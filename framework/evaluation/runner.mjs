import { basename, extname, relative, resolve } from "node:path";
import { mkdir, readdir } from "node:fs/promises";
import { aggregateMetrics, classificationMetrics } from "../sdk/evaluation/metrics.mjs";
import { initializeAgentAt, createTask } from "../tools/workspace.mjs";
import { buildContext } from "../tools/context-builder.mjs";
import { CodexAdapter } from "../tools/coding-agent.mjs";
import { executeTask, runAbstract, runSymbolic, verifyTaskAnchors } from "../tools/executor.mjs";
import { atomicWrite, exists, jsString } from "../tools/filesystem.mjs";
import { importFresh } from "../tools/module-loader.mjs";

function render(value) {
  if (value === null) return "null";
  if (value === undefined) return "undefined";
  if (typeof value === "bigint") return `${value}n`;
  if (["boolean", "number"].includes(typeof value)) return String(value);
  if (typeof value === "string") return jsString(value);
  if (Array.isArray(value)) return `[${value.map(render).join(", ")}]`;
  return `Object.freeze({ ${Object.entries(value).map(([key, entry]) => `${jsString(key)}: ${render(entry)}`).join(", ")} })`;
}

function semanticProjection(value, seen = new Set()) {
  if (value === null || value === undefined || ["string", "number", "boolean", "bigint"].includes(typeof value)) return value;
  if (typeof value === "function") return `[function ${value.name || "anonymous"}]`;
  if (typeof value?.identity === "function") return value.identity();
  if (seen.has(value)) return "[cycle]"; seen.add(value); let output;
  if (Array.isArray(value)) output = value.map((entry) => semanticProjection(entry, seen));
  else if (value instanceof Map) output = Object.fromEntries([...value].map(([key, entry]) => [String(key), semanticProjection(entry, seen)]));
  else if (value instanceof Set) output = [...value].map((entry) => semanticProjection(entry, seen));
  else output = Object.fromEntries(Object.entries(value).filter(([key]) => !["implementation", "evaluator"].includes(key)).map(([key, entry]) => [key, semanticProjection(entry, seen)]));
  seen.delete(value); return output;
}

async function corpusCases(suiteRoot, suite) {
  const cases = [];
  for (const directive of suite.taskValues) {
    if (directive.kind === "task") { cases.push({ id: directive.value, ...directive.options }); continue; }
    if (directive.kind !== "corpus") continue;
    const root = resolve(suiteRoot, directive.value); const entries = await readdir(root, { withFileTypes: true });
    for (const entry of entries.sort((left, right) => left.name.localeCompare(right.name))) {
      if (!entry.isFile() || entry.name.startsWith(".") || entry.name === "README.md") continue;
      cases.push({ id: basename(entry.name, extname(entry.name)), source: resolve(root, entry.name), ...directive.options });
    }
  }
  return cases;
}

async function expectedFindings(suiteRoot, suite, caseId) {
  const path = resolve(suiteRoot, suite.goldRoot, `${caseId}.gold.mjs`);
  if (!(await exists(path))) return null;
  const gold = (await importFresh(path)).default;
  const findings = gold.findings ?? gold;
  return [...findings].map((finding) => typeof finding === "string" ? finding : `${finding.code?.() ?? finding.code}:${finding.status?.() ?? finding.status}`);
}

function actualFindingKeys(findings) { return findings.map((finding) => `${finding.code()}:${finding.status()}`); }

async function authorTask({ projectRoot, agentRoot, taskRoot, suite, caseSpec, model }) {
  const adapter = new CodexAdapter(); const phases = [];
  for (const mode of suite.modeValues.map((entry) => entry.value)) {
    if (mode === "intent-selection") phases.push("intent");
    if (mode === "materialization" || mode === "end-to-end-analysis" || mode === "end-to-end-generation") phases.push("longtext");
    if (mode === "circuit-authoring") phases.push("circuit");
  }
  const outcomes = [];
  for (const phase of [...new Set(phases)]) {
    const context = await buildContext({ projectRoot, agentRoot, taskRoot, phase, goal: caseSpec.instruction ?? `Complete evaluation phase ${phase} for case ${caseSpec.id}.` });
    outcomes.push(await adapter.run({ projectRoot, workingDirectory: taskRoot, runRoot: context.runRoot, model }));
    if (outcomes.at(-1).exitCode !== 0) break;
  }
  if (outcomes.some((outcome) => outcome.exitCode !== 0)) throw new Error("EVALUATION_AUTHORING_FAILED");
  return outcomes;
}

export async function runEvaluationSuite({ projectRoot, suitePath, invokeAgent = false, model = null }) {
  const suiteRoot = resolve(suitePath, ".."); const suite = (await importFresh(suitePath)).default;
  const evaluationRoot = resolve(projectRoot, "evaluations", suite.id);
  const agentName = suite.agent; const agentRoot = resolve(evaluationRoot, "agents", agentName);
  await mkdir(resolve(evaluationRoot, "reports", "failures"), { recursive: true });
  if (!(await exists(agentRoot))) await initializeAgentAt(projectRoot, agentRoot, agentName, { profile: suite.profileValues[0] ?? "general-broad", packs: ["core-language"] });
  const results = []; const modes = new Set(suite.modeValues.map((entry) => entry.value));
  const profiles = modes.has("pack-ablation") ? suite.profileValues : [suite.profileValues[0] ?? "general-broad"];
  for (const sourceCase of await corpusCases(suiteRoot, suite)) for (const profile of profiles) {
    const caseSpec = { ...sourceCase, profile, resultId: profiles.length > 1 ? `${sourceCase.id}@${profile}` : sourceCase.id };
    const task = await createTask(agentRoot, { projectRoot, sourcePath: caseSpec.source, title: caseSpec.title ?? caseSpec.id, instruction: caseSpec.instruction, profile });
    let authoring = [];
    try {
      if (invokeAgent) authoring = await authorTask({ projectRoot, agentRoot, taskRoot: task.root, suite, caseSpec, model });
      const started = process.hrtime.bigint(); const execution = await executeTask({ projectRoot, agentRoot, taskRoot: task.root, profileId: profile });
      const elapsedMilliseconds = Number(process.hrtime.bigint() - started) / 1e6;
      const expected = await expectedFindings(suiteRoot, suite, caseSpec.id); const actual = actualFindingKeys(execution.findings);
      const classification = expected ? classificationMetrics(actual, expected) : null;
      const assurance = [];
      for (const circuit of execution.plan.circuits.filter((item) => item.assurances.length > 0)) {
        assurance.push({ circuit: circuit.id, abstract: await runAbstract({ projectRoot, agentRoot, taskRoot: task.root, profileId: profile }, circuit.id), symbolic: await runSymbolic({ projectRoot, agentRoot, taskRoot: task.root, profileId: profile }, circuit.id) });
      }
      const anchorChecks = execution.runtime.longTexts.length ? await verifyTaskAnchors(task.root, execution.runtime.longTexts, { projectRoot }) : [];
      let replayEquivalent = 1;
      if (modes.has("ordinary-replay")) { const replay = await executeTask({ projectRoot, agentRoot, taskRoot: task.root, profileId: profile }); replayEquivalent = Number(JSON.stringify(actualFindingKeys(replay.findings)) === JSON.stringify(actual)); }
      results.push({ caseId: caseSpec.resultId, sourceCaseId: caseSpec.id, profile, taskId: task.id, taskPath: relative(projectRoot, task.root), status: "completed", findings: actual, metrics: { ...(classification ? { precision: classification.precision, recall: classification.recall, f1: classification.f1 } : {}), anchorValidity: anchorChecks.length ? anchorChecks.filter((check) => check.valid).length / anchorChecks.length : 1, replayEquivalent, elapsedMilliseconds }, authoring: authoring.map((run) => ({ exitCode: run.exitCode, startedAt: run.startedAt, finishedAt: run.finishedAt })), assurance: semanticProjection(assurance) });
    } catch (error) {
      results.push({ caseId: caseSpec.resultId, sourceCaseId: caseSpec.id, profile, taskId: task.id, taskPath: relative(projectRoot, task.root), status: "failed", error: error.stack ?? String(error), metrics: {} });
      await atomicWrite(resolve(evaluationRoot, "reports", "failures", `${caseSpec.resultId.replace(/[^A-Za-z0-9._-]/g, "-")}.md`), `# Evaluation failure: ${caseSpec.resultId}\n\n\`\`\`text\n${error.stack ?? error}\n\`\`\`\n`);
    }
  }
  const aggregate = aggregateMetrics(results); const reportsRoot = resolve(evaluationRoot, "reports");
  await atomicWrite(resolve(reportsRoot, "task-results.mjs"), `export default Object.freeze([\n${results.map((result) => `  ${render(result)}`).join(",\n")}\n]);\n`);
  const table = results.map((result) => `| ${result.caseId} | \`${result.taskId}\` | ${result.status} | ${result.findings?.length ?? 0} | ${result.metrics.f1 === undefined ? "not gold-scored" : result.metrics.f1.toFixed(3)} |`).join("\n");
  await atomicWrite(resolve(reportsRoot, "summary.md"), `# Evaluation suite ${suite.id}\n\nModes: ${suite.modeValues.map((entry) => `\`${entry.value}\``).join(", ")}. Coding agent invoked: ${invokeAgent ? "yes" : "no"}.\n\n| Case | Task | Status | Findings | F1 |\n| --- | --- | --- | ---: | ---: |\n${table}\n\n## Aggregate metrics\n\n${Object.entries(aggregate).map(([name, value]) => `- ${name}: ${value.toFixed(4)}`).join("\n") || "No numeric metrics."}\n`);
  for (const name of ["intent-selection", "materialization", "circuit-results", "generation", "runtime"]) await atomicWrite(resolve(reportsRoot, `${name}.md`), `# ${name}\n\nSee \`summary.md\` and executable \`task-results.mjs\` for per-task evidence.\n`);
  return Object.freeze({ suite, evaluationRoot, results: Object.freeze(results), aggregate });
}
