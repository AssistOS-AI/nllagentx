import { createHash } from "node:crypto";
import { copyFile, mkdir, readFile } from "node:fs/promises";
import { relative, resolve } from "node:path";
import { buildContext } from "../tools/context-builder.mjs";
import { createCodingAgentAdapter } from "../tools/coding-agent.mjs";
import { listFiles } from "../tools/filesystem.mjs";
import { importFresh, loadAgent, resolveRuntime } from "../tools/module-loader.mjs";
import { checkOntologies } from "../tools/ontology-tools.mjs";
import { runTests } from "../tools/test-runner.mjs";
import { verifyTaskAnchors } from "../tools/executor.mjs";

const semanticSuffixes = Object.freeze([".mjs", ".cnl", ".md"]);

async function artifactSnapshot(root) {
  const files = await listFiles(root, {
    include: (path) => semanticSuffixes.some((suffix) => path.endsWith(suffix)),
    exclude: [".git", "node_modules", "runs", "results", "source"]
  });
  const snapshot = new Map();
  for (const path of files) {
    const digest = createHash("sha256").update(await readFile(path)).digest("hex");
    snapshot.set(relative(root, path).split("\\").join("/"), digest);
  }
  return snapshot;
}

function artifactChanges(before, after) {
  const created = [...after.keys()].filter((path) => !before.has(path)).sort();
  const modified = [...after.keys()].filter((path) => before.has(path) && before.get(path) !== after.get(path)).sort();
  return Object.freeze({ created: Object.freeze(created), modified: Object.freeze(modified) });
}

async function matchingFiles(root, suffix) {
  return listFiles(root, {
    include: (path) => path.endsWith(suffix),
    exclude: [".git", "node_modules", "runs", "results"]
  });
}

async function loadDefaultValues(paths) {
  const values = [];
  for (const path of paths) {
    const exported = (await importFresh(path)).default;
    if (Array.isArray(exported)) values.push(...exported);
    else if (exported) values.push(exported);
  }
  return values;
}

function assertCircuitContracts(circuits, scope) {
  if (circuits.length === 0) throw new Error(`EVALUATION_${scope.toUpperCase()}_CIRCUIT_REQUIRED`);
  for (const circuit of circuits) {
    if (circuit.stages.length === 0) throw new Error(`EVALUATION_CIRCUIT_EMPTY: ${circuit.id}`);
    if (circuit.provisions.length === 0) throw new Error(`EVALUATION_CIRCUIT_PROVISION_REQUIRED: ${circuit.id}`);
  }
}

async function assertTests(projectRoot, root, scope, agentRoot, taskRoot = null) {
  const tests = await matchingFiles(resolve(root, "tests"), ".test.mjs");
  if (tests.length === 0) throw new Error(`EVALUATION_${scope.toUpperCase()}_TEST_REQUIRED`);
  const result = await runTests({ projectRoot, scope, agentRoot, taskRoot, level: "fast" });
  if (result.exitCode !== 0) throw new Error(`EVALUATION_${scope.toUpperCase()}_TEST_FAILED`);
}

async function validateAgentPhase({ projectRoot, agentRoot, profileId, phase }) {
  await loadAgent(agentRoot);
  if (phase === "architect") return;
  const runtime = await resolveRuntime({ projectRoot, agentRoot, profileId });
  if (phase === "ontology" || phase === "review") {
    const local = await matchingFiles(resolve(agentRoot, "ontologies"), ".ontology.mjs");
    if (local.length === 0) throw new Error("EVALUATION_AGENT_ONTOLOGY_REQUIRED");
    const diagnostics = await checkOntologies(runtime.ontologies);
    if (diagnostics.length) throw new Error(`EVALUATION_AGENT_ONTOLOGY_INVALID: ${diagnostics.map((item) => item.code).join(", ")}`);
  }
  if (phase === "circuit" || phase === "review") {
    const local = await matchingFiles(resolve(agentRoot, "circuits"), ".circuit.mjs");
    assertCircuitContracts(await loadDefaultValues(local), "agent");
  }
  if (phase === "circuit" || phase === "test" || phase === "review") {
    await assertTests(projectRoot, agentRoot, "agent", agentRoot);
  }
}

async function validateTaskPhase({ projectRoot, agentRoot, taskRoot, profileId, phase }) {
  const runtime = await resolveRuntime({ projectRoot, agentRoot, taskRoot, profileId });
  if (phase === "intent") {
    if (!runtime.intent) throw new Error("EVALUATION_TASK_INTENT_REQUIRED");
    if (!runtime.intent.outputs.some((entry) => entry.value === "markdown-cnl")) {
      throw new Error("EVALUATION_TASK_MARKDOWN_CNL_OUTPUT_REQUIRED");
    }
    if (runtime.intent.presentation.length === 0) {
      throw new Error("EVALUATION_TASK_RESPONSE_PRESENTATION_REQUIRED");
    }
  }
  if (phase === "ontology") {
    const local = await matchingFiles(resolve(taskRoot, "ontologies"), ".ontology.mjs");
    if (local.length === 0) throw new Error("EVALUATION_TASK_ONTOLOGY_REQUIRED");
    const diagnostics = await checkOntologies(runtime.ontologies);
    if (diagnostics.length) throw new Error(`EVALUATION_TASK_ONTOLOGY_INVALID: ${diagnostics.map((item) => item.code).join(", ")}`);
  }
  if (phase === "longtext") {
    if (runtime.longTexts.length === 0) throw new Error("EVALUATION_TASK_LONGTEXT_REQUIRED");
    const anchors = await verifyTaskAnchors(taskRoot, runtime.longTexts, { projectRoot });
    if (anchors.length === 0 || anchors.some((anchor) => !anchor.valid)) throw new Error("EVALUATION_TASK_ANCHOR_INVALID");
    await assertTests(projectRoot, taskRoot, "task", agentRoot, taskRoot);
  }
  if (phase === "circuit") {
    const local = await matchingFiles(resolve(taskRoot, "circuits"), ".circuit.mjs");
    if (local.length === 0) throw new Error("EVALUATION_TASK_CIRCUIT_REQUIRED");
    assertCircuitContracts(await loadDefaultValues(local), "task");
    await assertTests(projectRoot, taskRoot, "task", agentRoot, taskRoot);
  }
  if (phase === "test" || phase === "review") {
    if (runtime.longTexts.length > 0) {
      const anchors = await verifyTaskAnchors(taskRoot, runtime.longTexts, { projectRoot });
      if (anchors.length === 0 || anchors.some((anchor) => !anchor.valid)) throw new Error("EVALUATION_TASK_ANCHOR_INVALID");
    }
    await assertTests(projectRoot, taskRoot, "task", agentRoot, taskRoot);
  }
}

function phaseGoal({ scope, phase, caseSpec = null }) {
  if (scope === "agent") {
    return `Read source/agent-brief.md and complete the ${phase} authoring phase for this evaluation agent. Edit canonical agent files directly, use the installed skill and live SDK, ontology, semantic-circuit and response-circuit catalogs, create the required executable .mjs artifacts and focused tests, and do not replace semantics with JSON. Findings must carry qualitative messages, structured requirement details and exact evidence usable by the primary Markdown CNL response.`;
  }
  return `Read task.mjs, the registered source files, and the existing agent ontology, semantic-circuit and response-circuit catalogs. Complete the ${phase} authoring phase for case ${caseSpec.id}. Preserve the task instruction exactly, create executable source-grounded semantic code and focused tests, and leave unsupported meanings explicit rather than inventing evidence. IntentJS must request markdownCnl() and declare an appropriate .present(...) policy; ground the decisive source passages needed for a concise qualitative response.`;
}

async function authorPhases({ projectRoot, agentRoot, taskRoot = null, profileId, phases, model, caseSpec = null, adapter = createCodingAgentAdapter("codex") }) {
  const scope = taskRoot ? "task" : "agent";
  const targetRoot = taskRoot ?? agentRoot;
  const outcomes = [];
  for (const phase of phases) {
    const before = await artifactSnapshot(targetRoot);
    const context = await buildContext({
      projectRoot, agentRoot, taskRoot, phase, profileId,
      goal: phaseGoal({ scope, phase, caseSpec })
    });
    const process = await adapter.run({ projectRoot, workingDirectory: targetRoot, runRoot: context.runRoot, model });
    const after = await artifactSnapshot(targetRoot);
    const changes = artifactChanges(before, after);
    const outcome = Object.freeze({
      scope, phase, adapter: process.adapterId ?? "custom", exitCode: process.exitCode,
      startedAt: process.startedAt, finishedAt: process.finishedAt,
      runPath: relative(projectRoot, context.runRoot).split("\\").join("/"),
      finalResponsePath: relative(projectRoot, process.summaryPath).split("\\").join("/"),
      stdoutPath: relative(projectRoot, process.stdoutPath).split("\\").join("/"),
      stderrPath: relative(projectRoot, process.stderrPath).split("\\").join("/"),
      created: changes.created, modified: changes.modified
    });
    outcomes.push(outcome);
    try {
      if (process.exitCode !== 0) throw new Error(`EVALUATION_${scope.toUpperCase()}_AUTHORING_FAILED: ${phase}`);
      if (taskRoot) await validateTaskPhase({ projectRoot, agentRoot, taskRoot, profileId, phase });
      else await validateAgentPhase({ projectRoot, agentRoot, profileId, phase });
    } catch (error) {
      error.authoringOutcomes = Object.freeze([...outcomes]);
      throw error;
    }
  }
  return Object.freeze(outcomes);
}

export async function installAgentBrief(suiteRoot, agentRoot, briefPath) {
  if (!briefPath) return null;
  const target = resolve(agentRoot, "source", "agent-brief.md");
  await mkdir(resolve(agentRoot, "source"), { recursive: true });
  await copyFile(resolve(suiteRoot, briefPath), target);
  return target;
}

export function authorEvaluationAgent(options) {
  return authorPhases({ ...options, taskRoot: null, caseSpec: null });
}

export function authorEvaluationTask(options) {
  return authorPhases(options);
}
