import { basename, extname, relative, resolve } from "node:path";
import { copyFile, mkdir, readFile, readdir } from "node:fs/promises";
import { aggregateMetrics, classificationMetrics } from "../sdk/evaluation/metrics.mjs";
import { initializeAgentAt, createTask } from "../tools/workspace.mjs";
import { executeTask, runAbstract, runSymbolic, verifyTaskAnchors } from "../tools/executor.mjs";
import { atomicWrite, exists, jsString, listFiles } from "../tools/filesystem.mjs";
import { importFresh } from "../tools/module-loader.mjs";
import { createCodingAgentAdapter } from "../tools/coding-agent.mjs";
import { authorEvaluationAgent, authorEvaluationTask, installAgentBrief } from "./authoring.mjs";
import { responseContractFailures } from "../runtime/response/contract.mjs";

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
    if (directive.kind === "task") {
      const options = { ...directive.options };
      if (options.source) options.source = resolve(suiteRoot, options.source);
      cases.push({ id: directive.value, ...options });
      continue;
    }
    if (directive.kind !== "corpus") continue;
    const root = resolve(suiteRoot, directive.value); const entries = await readdir(root, { withFileTypes: true });
    for (const entry of entries.sort((left, right) => left.name.localeCompare(right.name))) {
      if (!entry.isFile() || entry.name.startsWith(".") || entry.name === "README.md") continue;
      cases.push({ id: basename(entry.name, extname(entry.name)), source: resolve(root, entry.name), ...directive.options });
    }
  }
  return cases;
}

async function expectedFindings(suiteRoot, suite, caseSpec) {
  if (caseSpec.expectedFindings) return Object.freeze([...caseSpec.expectedFindings]);
  const caseId = caseSpec.id;
  const path = resolve(suiteRoot, suite.goldRoot, `${caseId}.gold.mjs`);
  if (!(await exists(path))) return null;
  const gold = (await importFresh(path)).default;
  const findings = gold.findings ?? gold;
  return [...findings].map((finding) => typeof finding === "string" ? finding : `${finding.code?.() ?? finding.code}:${finding.status?.() ?? finding.status}`);
}

function actualFindingKeys(findings) { return findings.map((finding) => `${finding.code()}:${finding.status()}`); }

export function scoredActualFindings(actual, expected = null) {
  if (!expected) return Object.freeze([...actual]);
  return Object.freeze(actual.filter((finding) => (
    expected.includes(finding) || !finding.endsWith(":NOT_APPLICABLE")
  )));
}

export function evaluationExpectationFailures({
  actual,
  expected = null,
  generatedFrames = 0,
  minimumFrames = 0,
  allowAdditionalFindings = false
}) {
  return Object.freeze([
    ...(expected ?? [])
      .filter((finding) => !actual.includes(finding))
      .map((finding) => `missing finding ${finding}`),
    ...(
      expected && !allowAdditionalFindings
        ? actual
          .filter((finding) => !expected.includes(finding) && !finding.endsWith(":NOT_APPLICABLE"))
          .map((finding) => `unexpected material finding ${finding}`)
        : []
    ),
    ...(minimumFrames > generatedFrames
      ? [`expected at least ${minimumFrames} generated frames, found ${generatedFrames}`]
      : [])
  ]);
}

export function evaluationResponseFailures({ response, expected = [], sourceText = "" }) {
  const materialExpected = expected.filter((value) => !value.endsWith(":NOT_APPLICABLE"));
  return responseContractFailures({
    response,
    expectedFindings: materialExpected,
    sourceTexts: [sourceText],
    requireQuotedEvidence: materialExpected.length > 0
  });
}

function inferredTaskAuthoring(suite) {
  if (suite.taskAuthoringValues.length) return suite.taskAuthoringValues;
  const phases = [];
  for (const mode of suite.modeValues.map((entry) => entry.value)) {
    if (mode === "intent-selection") phases.push("intent");
    if (mode === "materialization" || mode === "end-to-end-analysis" || mode === "end-to-end-generation") phases.push("longtext");
    if (mode === "circuit-authoring") phases.push("circuit");
  }
  return Object.freeze([...new Set(phases)]);
}

async function artifactPaths(root, projectRoot, exclude = []) {
  const files = await listFiles(root, { exclude: [".git", "node_modules", ...exclude] });
  return Object.freeze(files.map((path) => relative(projectRoot, path).split("\\").join("/")));
}

function failureReportName(caseId, taskId) {
  const safeCase = caseId.replace(/[^A-Za-z0-9._-]/g, "-");
  const safeTask = taskId.replace(/[^A-Za-z0-9._-]/g, "-");
  return `${safeCase}--${safeTask}.md`;
}

async function archiveCurrentReports(reportsRoot) {
  const primary = resolve(reportsRoot, "task-results.mjs");
  if (!await exists(primary)) return null;
  const archiveId = `iteration-${new Date().toISOString().replace(/[:.]/g, "-")}`;
  const archiveRoot = resolve(reportsRoot, "iterations", archiveId);
  await mkdir(archiveRoot, { recursive: true });
  const names = [
    "summary.md", "task-results.mjs", "authoring.md", "agent-authoring.mjs",
    "artifacts.md", "assurance.md", "intent-selection.md", "materialization.md",
    "circuit-results.md", "generation.md", "runtime.md"
  ];
  for (const name of names) {
    const source = resolve(reportsRoot, name);
    if (await exists(source)) await copyFile(source, resolve(archiveRoot, name));
  }
  await atomicWrite(
    resolve(archiveRoot, "README.md"),
    "# Archived evaluation iteration\n\nThese reports are an immutable retained view of the previous suite invocation. "
      + "The task folders and coding-agent run directories referenced by them remain under the evaluation agent.\n"
  );
  return archiveRoot;
}

export async function runEvaluationSuite({ projectRoot, suitePath, invokeAgent = false, model = null, adapterFactory = createCodingAgentAdapter }) {
  const suiteRoot = resolve(suitePath, ".."); const suite = (await importFresh(suitePath)).default;
  const evaluationRoot = resolve(projectRoot, "evaluations", suite.id);
  const agentName = suite.agent; const agentRoot = resolve(evaluationRoot, "agents", agentName);
  const reportsRoot = resolve(evaluationRoot, "reports");
  await archiveCurrentReports(reportsRoot);
  const codingAdapter = invokeAgent ? adapterFactory(suite.agentAdapter ?? "codex") : null;
  await mkdir(resolve(reportsRoot, "failures"), { recursive: true });
  if (!(await exists(agentRoot))) await initializeAgentAt(projectRoot, agentRoot, agentName, { profile: suite.profileValues[0] ?? "general-broad", packs: ["core-language"] });
  await installAgentBrief(suiteRoot, agentRoot, suite.agentBriefPath);
  let agentAuthoring = [];
  if (invokeAgent && suite.agentAuthoringValues.length) {
    try {
      agentAuthoring = await authorEvaluationAgent({
        projectRoot, agentRoot, profileId: suite.profileValues[0] ?? "general-broad",
        phases: suite.agentAuthoringValues, model, adapter: codingAdapter
      });
    } catch (error) {
      agentAuthoring = error.authoringOutcomes ?? agentAuthoring;
      await atomicWrite(resolve(reportsRoot, "failures", "agent-authoring.md"), `# Agent authoring failure\n\n\`\`\`text\n${error.stack ?? error}\n\`\`\`\n`);
      throw error;
    }
  }
  const results = []; const modes = new Set(suite.modeValues.map((entry) => entry.value));
  const profiles = modes.has("pack-ablation") ? suite.profileValues : [suite.profileValues[0] ?? "general-broad"];
  const taskPhases = inferredTaskAuthoring(suite);
  for (const sourceCase of await corpusCases(suiteRoot, suite)) for (const profile of profiles) {
    const caseSpec = { ...sourceCase, profile, resultId: profiles.length > 1 ? `${sourceCase.id}@${profile}` : sourceCase.id };
    const task = await createTask(agentRoot, { projectRoot, sourcePath: caseSpec.source, title: caseSpec.title ?? caseSpec.id, instruction: caseSpec.instruction, profile });
    let authoring = [];
    try {
      if (invokeAgent) authoring = await authorEvaluationTask({ projectRoot, agentRoot, taskRoot: task.root, profileId: profile, phases: taskPhases, model, caseSpec, adapter: codingAdapter });
      const started = process.hrtime.bigint(); const execution = await executeTask({ projectRoot, agentRoot, taskRoot: task.root, profileId: profile });
      const elapsedMilliseconds = Number(process.hrtime.bigint() - started) / 1e6;
      const expected = await expectedFindings(suiteRoot, suite, caseSpec); const actual = actualFindingKeys(execution.findings);
      const classification = expected
        ? classificationMetrics(scoredActualFindings(actual, expected), expected)
        : null;
      const semanticExpectationFailures = evaluationExpectationFailures({
        actual,
        expected,
        generatedFrames: execution.frames.length,
        minimumFrames: caseSpec.minimumFrames,
        allowAdditionalFindings: caseSpec.allowAdditionalFindings
      });
      const responseFailures = evaluationResponseFailures({
        response: execution.response,
        expected: expected ?? [],
        sourceText: await readFile(caseSpec.source, "utf8")
      });
      const expectationFailures = [...semanticExpectationFailures, ...responseFailures];
      const assurance = [];
      for (const circuit of execution.plan.circuits.filter((item) => item.assurances.length > 0)) {
        assurance.push({ circuit: circuit.id, abstract: await runAbstract({ projectRoot, agentRoot, taskRoot: task.root, profileId: profile }, circuit.id), symbolic: await runSymbolic({ projectRoot, agentRoot, taskRoot: task.root, profileId: profile }, circuit.id) });
      }
      const projectedAssurance = semanticProjection(assurance);
      const renderedAssurance = render(projectedAssurance);
      await atomicWrite(resolve(task.root, "results", "evaluation-assurance.mjs"), `export default ${renderedAssurance};\n`);
      await atomicWrite(resolve(task.root, "results", "evaluation-assurance.md"), `# Evaluation auxiliary assurance\n\nThe executable source of truth is \`evaluation-assurance.mjs\`. This complete JavaScript projection retains every abstract and symbolic result produced for the case.\n\n\`\`\`javascript\n${renderedAssurance}\n\`\`\`\n`);
      const anchorChecks = execution.runtime.longTexts.length ? await verifyTaskAnchors(task.root, execution.runtime.longTexts, { projectRoot }) : [];
      let replayEquivalent = 1;
      let responseReplayEquivalent = 1;
      if (modes.has("ordinary-replay")) {
        const replay = await executeTask({ projectRoot, agentRoot, taskRoot: task.root, profileId: profile });
        replayEquivalent = Number(JSON.stringify(actualFindingKeys(replay.findings)) === JSON.stringify(actual));
        responseReplayEquivalent = Number(replay.response === execution.response);
      }
      const status = expectationFailures.length ? "failed" : "completed";
      const result = {
        caseId: caseSpec.resultId, sourceCaseId: caseSpec.id, profile, taskId: task.id,
        taskPath: relative(projectRoot, task.root).split("\\").join("/"), sourcePath: relative(projectRoot, caseSpec.source).split("\\").join("/"),
        instruction: caseSpec.instruction ?? null, status, findings: actual, generatedFrames: execution.frames.length,
        expectedFindings: expected ?? [], expectationFailures,
        metrics: {
          ...(classification ? { precision: classification.precision, recall: classification.recall, f1: classification.f1 } : {}),
          anchorValidity: anchorChecks.length ? anchorChecks.filter((check) => check.valid).length / anchorChecks.length : 1,
          replayEquivalent,
          responseContract: Number(responseFailures.length === 0),
          responseReplayEquivalent,
          authoringCompletion: Number(authoring.every((run) => run.exitCode === 0)), elapsedMilliseconds
        },
        response: {
          path: relative(projectRoot, resolve(task.root, "results", "response.md")).split("\\").join("/"),
          style: execution.composition.style,
          grouping: execution.composition.grouping,
          results: execution.composition.entries.length,
          groups: execution.composition.groups.map((group) => ({ key: group.key, count: group.entries.length })),
          failures: responseFailures
        },
        authoring, artifacts: await artifactPaths(task.root, projectRoot), assurance: projectedAssurance
      };
      results.push(result);
      if (expectationFailures.length) {
        await atomicWrite(
          resolve(reportsRoot, "failures", failureReportName(caseSpec.resultId, task.id)),
          `# Evaluation expectation failure: ${caseSpec.resultId}\n\nTask: \`${task.id}\`.\n\n${expectationFailures.map((item) => `- ${item}`).join("\n")}\n`
        );
      }
    } catch (error) {
      authoring = error.authoringOutcomes ?? authoring;
      results.push({
        caseId: caseSpec.resultId, sourceCaseId: caseSpec.id, profile, taskId: task.id,
        taskPath: relative(projectRoot, task.root).split("\\").join("/"), status: "failed",
        error: error.stack ?? String(error), metrics: { authoringCompletion: 0 }, authoring,
        artifacts: await artifactPaths(task.root, projectRoot)
      });
      await atomicWrite(
        resolve(reportsRoot, "failures", failureReportName(caseSpec.resultId, task.id)),
        `# Evaluation failure: ${caseSpec.resultId}\n\nTask: \`${task.id}\`.\n\n\`\`\`text\n${error.stack ?? error}\n\`\`\`\n`
      );
    }
  }
  const aggregate = aggregateMetrics(results);
  await atomicWrite(resolve(reportsRoot, "task-results.mjs"), `export default Object.freeze([\n${results.map((result) => `  ${render(result)}`).join(",\n")}\n]);\n`);
  const taskTable = results.map((result) => {
    const reportTarget = relative(reportsRoot, resolve(projectRoot, result.taskPath, "results", "response.md")).split("\\").join("/");
    return `| ${result.caseId} | [\`${result.taskId}\`](${reportTarget}) | ${result.status} | ${result.findings?.length ?? 0} | ${result.generatedFrames ?? 0} | ${result.metrics.f1 === undefined ? "not gold-scored" : result.metrics.f1.toFixed(3)} |`;
  }).join("\n");
  await atomicWrite(resolve(reportsRoot, "summary.md"), `# Evaluation suite ${suite.id}\n\nModes: ${suite.modeValues.map((entry) => `\`${entry.value}\``).join(", ")}. Coding agent invoked: ${invokeAgent ? "yes" : "no"}. Agent authoring phases: ${suite.agentAuthoringValues.map((phase) => `\`${phase}\``).join(", ") || "none"}. Task authoring phases: ${taskPhases.map((phase) => `\`${phase}\``).join(", ") || "none"}.\n\n| Case | Primary Markdown CNL response | Status | Findings | Frames | F1 |\n| --- | --- | --- | ---: | ---: | ---: |\n${taskTable}\n\n## Aggregate metrics\n\n${Object.entries(aggregate).map(([name, value]) => `- ${name}: ${value.toFixed(4)}`).join("\n") || "No numeric metrics."}\n\nThe linked task artifact is the primary human-facing response. See \`authoring.md\` for every Codex phase, \`assurance.md\` for auxiliary debug evidence, and \`artifacts.md\` for all retained files.\n`);
  const runRow = (run) => `| ${run.scope} | ${run.phase} | ${run.adapter ?? suite.agentAdapter ?? "not invoked"} | ${run.exitCode} | [run](${relative(reportsRoot, resolve(projectRoot, run.runPath)).split("\\").join("/")}/INSTRUCTIONS.md) | [final response](${relative(reportsRoot, resolve(projectRoot, run.finalResponsePath)).split("\\").join("/")}) | ${run.created.length} | ${run.modified.length} |`;
  const authoringSections = results.map((result) => `## ${result.caseId}\n\nTask: \`${result.taskPath}\`.\n\n${result.authoring?.map(runRow).join("\n") || "No task coding-agent phase was retained."}`).join("\n\n");
  await atomicWrite(resolve(reportsRoot, "authoring.md"), `# Coding-agent authoring evidence\n\nEvery row is a real CodingAgentAdapter process with retained instructions, installed skills, context, stdout, stderr, and final response.\n\n| Scope | Phase | Adapter | Exit | Instructions | Final response | Created | Modified |\n| --- | --- | --- | ---: | --- | --- | ---: | ---: |\n${agentAuthoring.map(runRow).join("\n") || "| agent | none | not invoked | 0 | — | — | 0 | 0 |"}\n\n${authoringSections}\n`);
  await atomicWrite(resolve(reportsRoot, "agent-authoring.mjs"), `export default Object.freeze([\n${agentAuthoring.map((run) => `  ${render(run)}`).join(",\n")}\n]);\n`);
  const artifactSections = results.map((result) => `## ${result.caseId}\n\n${result.artifacts?.map((path) => `- \`${path}\``).join("\n") || "No retained artifacts."}`).join("\n\n");
  await atomicWrite(resolve(reportsRoot, "artifacts.md"), `# Retained evaluation artifacts\n\n## Agent\n\n${(await artifactPaths(agentRoot, projectRoot, ["tasks", "runs"])).map((path) => `- \`${path}\``).join("\n")}\n\n${artifactSections}\n`);
  const assuranceSections = results.map((result) => {
    if (!result.assurance) return `## ${result.caseId}\n\nNo auxiliary artifact was produced because the case did not reach assurance execution.`;
    const target = relative(reportsRoot, resolve(projectRoot, result.taskPath, "results", "evaluation-assurance.md")).split("\\").join("/");
    return `## ${result.caseId}\n\nAuxiliary circuit results: ${result.assurance?.length ?? 0}. [Complete abstract and symbolic projection](${target}).`;
  }).join("\n\n");
  await atomicWrite(resolve(reportsRoot, "assurance.md"), `# Evaluation auxiliary assurance\n\nEvery linked task artifact includes the complete executable JavaScript projection of its abstract and symbolic runs.\n\n${assuranceSections}\n`);
  for (const name of ["intent-selection", "materialization", "circuit-results", "generation", "runtime"]) await atomicWrite(resolve(reportsRoot, `${name}.md`), `# ${name}\n\nSee \`summary.md\`, \`authoring.md\`, \`artifacts.md\`, and executable \`task-results.mjs\` for per-task evidence.\n`);
  return Object.freeze({ suite, evaluationRoot, agentAuthoring: Object.freeze(agentAuthoring), results: Object.freeze(results), aggregate });
}
