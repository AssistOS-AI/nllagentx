import { relative, resolve } from "node:path";
import { createHash } from "node:crypto";
import { checkOntologies } from "./ontology-tools.mjs";
import { atomicWrite, jsString, listFiles } from "./filesystem.mjs";
import { executeTask, verifyTaskAnchors } from "./executor.mjs";
import { resolveRuntime } from "./module-loader.mjs";
import { runTests } from "./test-runner.mjs";
import { loadSourceRegistry } from "./source-tools.mjs";
import { responseContractFailures } from "../runtime/response/contract.mjs";

function identityOf(value) {
  return value?.id
    ?? (typeof value?.identity === "function" ? value.identity() : value?.identity)
    ?? String(value);
}

function findingKey(finding) {
  return `${finding.code()}:${finding.status()}`;
}

function intentContractFailures(intent, assurance) {
  if (!intent) return ["IntentJS is missing"];
  const failures = [];
  if (intent.concerns.length === 0) failures.push("IntentJS declares no semantic concern");
  if (intent.provenance.length === 0) failures.push("IntentJS has no task-instruction provenance");
  if (!intent.evidence.some((entry) => entry.value === "source-grounded")) {
    failures.push("IntentJS does not require source-grounded evidence");
  }
  if (!intent.outputs.some((entry) => entry.value === "markdown-cnl")) {
    failures.push("IntentJS does not request the primary Markdown CNL response");
  }
  const declaredAssurance = new Set(intent.assurances.map((entry) => entry.value));
  if (!declaredAssurance.has("concrete-execution")) {
    failures.push("IntentJS does not request concrete execution");
  }
  if (["abstract", "all"].includes(assurance) && !declaredAssurance.has("abstract-preflight")) {
    failures.push("IntentJS does not request abstract preflight");
  }
  const symbolicDeclared = declaredAssurance.has("symbolic-decision-coverage")
    || declaredAssurance.has("symbolic-where-supported");
  if (["symbolic", "all"].includes(assurance) && !symbolicDeclared) {
    failures.push("IntentJS does not request symbolic decision coverage");
  }
  return failures;
}

function render(value) {
  if (value === null) return "null";
  if (value === undefined) return "undefined";
  if (["boolean", "number"].includes(typeof value)) return String(value);
  if (typeof value === "string") return jsString(value);
  if (Array.isArray(value)) return `Object.freeze([${value.map(render).join(", ")}])`;
  const entries = Object.entries(value)
    .map(([key, entry]) => `${jsString(key)}: ${render(entry)}`)
    .join(", ");
  return `Object.freeze({ ${entries} })`;
}

export function adaptiveAssuranceFailures(execution, requirement) {
  if (requirement === "none") return [];
  const failures = [];
  const circuits = execution.plan.circuits.filter((circuit) => !circuit.id.startsWith("core-language."));
  if (circuits.length === 0) return ["no non-core semantic circuit was selected"];
  const methods = requirement === "all"
    ? ["abstract-preflight", "symbolic-decision-coverage"]
    : [requirement === "abstract" ? "abstract-preflight" : "symbolic-decision-coverage"];
  for (const circuit of circuits) {
    const declared = new Set(circuit.assurances.map((entry) => entry.kind));
    for (const method of methods) {
      if (!declared.has(method)) {
        failures.push(`circuit ${circuit.id} does not declare ${method}`);
        continue;
      }
      const result = execution.assurance.find((entry) => (
        entry.circuit === circuit.identity && entry.method === method
      ));
      if (!result) failures.push(`circuit ${circuit.id} did not execute ${method}`);
      if (method === "abstract-preflight" && result && result.result?.converged !== true) {
        failures.push(`circuit ${circuit.id} abstract interpretation did not converge`);
      }
      if (method === "symbolic-decision-coverage" && result) {
        if (result.result?.truncated) {
          failures.push(`circuit ${circuit.id} symbolic exploration was truncated`);
        }
        if (!Array.isArray(result.result?.paths) || result.result.paths.length === 0) {
          failures.push(`circuit ${circuit.id} produced no symbolic paths`);
        }
      }
    }
  }
  return failures;
}

export function hasAdaptiveMaterialOutput(execution, allowUnknown = false) {
  const nonCoreIdentities = new Set(execution.plan.circuits
    .filter((circuit) => !circuit.id.startsWith("core-language."))
    .map((circuit) => circuit.identity));
  const materialStatuses = allowUnknown
    ? new Set(["SATISFIED", "VIOLATED", "CONFLICT", "UNKNOWN"])
    : new Set(["SATISFIED", "VIOLATED", "CONFLICT"]);
  const findingIsMaterial = execution.findings.some((finding) => {
    const descriptor = finding.descriptor();
    return nonCoreIdentities.has(descriptor.circuit) && materialStatuses.has(finding.status());
  });
  const frameIsMaterial = execution.executions.some((entry) => (
    nonCoreIdentities.has(entry.circuit.identity) && entry.frames.length > 0
  ));
  return findingIsMaterial || frameIsMaterial;
}

function replayProjection(execution) {
  return Object.freeze({
    circuits: Object.freeze(execution.plan.circuits.map((circuit) => circuit.identity).sort()),
    findings: Object.freeze(execution.findings.map(findingKey).sort()),
    frames: Object.freeze(execution.frames.map(identityOf).sort()),
    assurance: Object.freeze(execution.assurance.map((entry) => (
      `${entry.circuit}:${entry.method}`
    )).sort()),
    responseDigest: createHash("sha256").update(execution.response).digest("hex")
  });
}

export function adaptiveReplayEquivalent(left, right) {
  return JSON.stringify(replayProjection(left)) === JSON.stringify(replayProjection(right));
}

async function assessAdaptiveTask({
  projectRoot,
  agentRoot,
  taskRoot,
  executionOptions,
  allowUnknown,
  assurance
}) {
  const failures = [];
  let runtime;
  let execution = null;
  let replay = null;
  try {
    runtime = await resolveRuntime({ ...executionOptions, projectRoot, agentRoot, taskRoot });
    failures.push(...intentContractFailures(runtime.intent, assurance));
    if (runtime.longTexts.length === 0) failures.push("LongTextJS is missing");
    const ontologyDiagnostics = await checkOntologies(runtime.ontologies);
    failures.push(...ontologyDiagnostics.map((entry) => (
      `ontology diagnostic ${typeof entry.code === "function" ? entry.code() : entry.code}`
    )));
    if (runtime.longTexts.length > 0) {
      const anchors = await verifyTaskAnchors(taskRoot, runtime.longTexts, { projectRoot });
      if (anchors.length === 0) failures.push("LongTextJS has no source anchors");
      failures.push(...anchors
        .filter((entry) => !entry.valid)
        .map((entry) => `invalid source anchor ${entry.code}`));
    }
    const requested = [
      ...(executionOptions.checks ?? []),
      ...(runtime.intent?.concerns?.map((entry) => entry.value) ?? [])
    ];
    for (const capability of new Set(requested)) {
      if (runtime.registry.providersFor(capability).length === 0) {
        failures.push(`no circuit provides ${capability}`);
      }
    }
    const tests = await runTests({ projectRoot, scope: "task", agentRoot, taskRoot, level: "fast" });
    if (tests.files.length === 0) failures.push("task has no focused tests");
    if (tests.exitCode !== 0) failures.push("task fast tests failed");
    execution = await executeTask({ ...executionOptions, assurance });
    failures.push(...execution.diagnostics.map((entry) => (
      `execution diagnostic ${entry.code ?? entry.message ?? "unknown"}`
    )));
    if (!hasAdaptiveMaterialOutput(execution, allowUnknown)) {
      failures.push("no selected non-core circuit produced a material finding or generated frame");
    }
    const publicFindingKeys = execution.composition.entries.map((entry) => findingKey(entry.finding));
    const sourceRegistry = await loadSourceRegistry(taskRoot, { projectRoot });
    failures.push(...responseContractFailures({
      response: execution.response,
      expectedFindings: publicFindingKeys,
      sourceTexts: sourceRegistry.all().map((source) => source.text),
      requireQuotedEvidence: publicFindingKeys.length > 0
    }));
    if (execution.composition.entries.length === 0 && execution.composition.generatedFrames.length === 0) {
      failures.push("response circuits selected no public finding or generated content");
    }
    failures.push(...adaptiveAssuranceFailures(execution, assurance));
    replay = await executeTask({ ...executionOptions, assurance });
    if (!adaptiveReplayEquivalent(execution, replay)) {
      failures.push("ordinary model-free replay changed circuits, findings, frames, assurance selection, or Markdown CNL response");
    }
  } catch (error) {
    failures.push(error.stack ?? String(error));
  }
  return Object.freeze({ runtime, execution, replay, failures: Object.freeze(failures) });
}

function assessmentProjection(assessment, reviewIndex) {
  return Object.freeze({
    reviewIndex,
    accepted: assessment.failures.length === 0,
    failures: assessment.failures,
    circuits: assessment.execution?.plan.circuits.map((circuit) => circuit.id) ?? [],
    findings: assessment.execution?.findings.map(findingKey) ?? [],
    generatedFrames: assessment.execution?.frames.length ?? 0,
    responseResults: assessment.execution?.composition.entries.length ?? 0,
    responseDigest: assessment.execution ? replayProjection(assessment.execution).responseDigest : null,
    replayEquivalent: Boolean(
      assessment.execution && assessment.replay
      && adaptiveReplayEquivalent(assessment.execution, assessment.replay)
    ),
    assurances: assessment.execution?.assurance.map((entry) => ({
      circuit: entry.circuit,
      method: entry.method,
      converged: entry.result?.converged ?? null,
      paths: entry.result?.paths?.length ?? null,
      truncated: entry.result?.truncated ?? null
    })) ?? []
  });
}

async function writeAssessment(taskRoot, projection) {
  const path = resolve(
    taskRoot,
    "results",
    `adaptive-authoring-cycle-${projection.reviewIndex}.md`
  );
  const lines = [
    `# Adaptive authoring cycle ${projection.reviewIndex}`,
    "",
    `Accepted: ${projection.accepted ? "yes" : "no"}.`,
    "",
    "## Deterministic acceptance failures",
    "",
    projection.failures.length
      ? projection.failures.map((entry) => `- ${entry}`).join("\n")
      : "No acceptance failures.",
    "",
    "## Executed circuits",
    "",
    projection.circuits.length
      ? projection.circuits.map((entry) => `- \`${entry}\``).join("\n")
      : "No circuit executed.",
    "",
    "## Findings and generation",
    "",
    projection.findings.length
      ? projection.findings.map((entry) => `- \`${entry}\``).join("\n")
      : "No findings.",
    `- Generated frames: ${projection.generatedFrames}`,
    `- Public Markdown CNL results: ${projection.responseResults}`,
    `- Markdown CNL SHA-256: ${projection.responseDigest ?? "not produced"}`,
    "",
    "## Auxiliary assurance",
    "",
    projection.assurances.length
      ? projection.assurances.map((entry) => (
        `- \`${entry.circuit}\` / ${entry.method}: converged=${entry.converged}, `
        + `paths=${entry.paths}, truncated=${entry.truncated}`
      )).join("\n")
      : "No auxiliary result.",
    "",
    `Model-free replay equivalent: ${projection.replayEquivalent ? "yes" : "no"}.`
  ];
  await atomicWrite(path, `${lines.join("\n")}\n`);
  return path;
}

async function captureInitialState({
  taskRoot,
  runtime,
  assurance,
  maxReviewCycles,
  resolutionFailure = null
}) {
  const semanticFiles = [];
  for (const folder of ["intent", "ontologies", "longtext", "circuits", "cnl", "tests"]) {
    for (const path of await listFiles(resolve(taskRoot, folder))) {
      semanticFiles.push(relative(taskRoot, path).split("\\").join("/"));
    }
  }
  const state = Object.freeze({
    capturedBeforeAuthoring: true,
    taskSemanticFiles: Object.freeze(semanticFiles),
    inheritedOntologies: Object.freeze(runtime.ontologies.map(identityOf)),
    inheritedCircuits: Object.freeze(runtime.circuits.map(identityOf)),
    resolutionFailure: resolutionFailure ? String(resolutionFailure.stack ?? resolutionFailure) : null,
    assurance,
    maxReviewCycles
  });
  await atomicWrite(
    resolve(taskRoot, "results", "adaptive-initial-state.mjs"),
    `export default ${render(state)};\n`
  );
  const initialReport = [
    "# Adaptive initial state",
    "",
    "Captured before coding-agent authoring.",
    "",
    `- Task semantic files: ${semanticFiles.length
      ? semanticFiles.map((path) => `\`${path}\``).join(", ")
      : "none"}.`,
    `- Inherited ontologies: ${state.inheritedOntologies.length}.`,
    `- Inherited circuits: ${state.inheritedCircuits.length}.`,
    `- Initial runtime resolution: ${resolutionFailure ? "failed; retained for review" : "valid"}.`,
    `- Auxiliary requirement: \`${assurance}\`.`,
    `- Maximum review cycles: ${maxReviewCycles}.`
  ].join("\n");
  await atomicWrite(
    resolve(taskRoot, "results", "adaptive-initial-state.md"),
    `${initialReport}\n`
  );
  return state;
}

const adaptiveGoals = Object.freeze({
  intent: "Author task IntentJS from the exact instruction and sources. Preserve instruction provenance "
    + "and request the primary Markdown CNL response plus concrete and adaptive auxiliary outputs. Declare "
    + "an evidence, grouping, filtering, and style policy with IntentJS presentation directives.",
  ontology: "Audit the task instruction and sources against the resolved ontology. Create a minimal task-local "
    + "OntologyJS extension and tests only for genuinely missing meanings; reuse agent and framework identities "
    + "exactly and do not encode source facts as ontology facts.",
  longtext: "Author complete source-grounded LongTextJS against the now-resolved ontology. Retain exact anchors, "
    + "attribution, alternatives, coverage, and explicit unsupported meanings.",
  circuit: "Audit whether the combined framework, agent, and task circuit registry can perform the requested "
    + "operation realistically. Create task-local CircuitJS and focused tests only for missing behavior. "
    + "Integrate through declared capabilities, concrete execution, abstract preflight, symbolic decision "
    + "coverage, evidence-bearing findings, qualitative messages/details, and typed CNL generation where requested. "
    + "When default response composition is insufficient, add a task-local executable response circuit under cnl/.",
  review: "Review the complete adaptive execution evidence. Repair task-owned IntentJS, OntologyJS, LongTextJS, "
    + "CircuitJS, and tests without weakening acceptance. Inspect concrete findings, abstract convergence, "
    + "symbolic paths, provenance, the primary Markdown CNL response, response-circuit selection, generated CNL, "
    + "and every supplied failure. If the task is already valid, "
    + "audit it and avoid semantic churn."
});

export async function runAdaptiveAuthoring({
  projectRoot,
  agentRoot,
  taskRoot,
  executionOptions,
  authorPhase,
  maxReviewCycles = 3,
  allowUnknown = false,
  assurance = "all"
}) {
  const phases = [];
  const authoringRuns = [];
  async function invokePhase(phase, goal, diagnosticsPath = null) {
    const evidence = await authorPhase(phase, goal, diagnosticsPath);
    phases.push(phase);
    authoringRuns.push(typeof evidence === "object" && evidence !== null
      ? evidence
      : Object.freeze({ phase, summary: String(evidence ?? "") }));
  }
  let runtime;
  let resolutionFailure = null;
  try {
    runtime = await resolveRuntime({ ...executionOptions, projectRoot, agentRoot, taskRoot });
  } catch (error) {
    resolutionFailure = error;
    runtime = await resolveRuntime({
      ...executionOptions,
      projectRoot,
      agentRoot,
      taskRoot: null
    });
  }
  const initialState = await captureInitialState({
    taskRoot,
    runtime,
    assurance,
    maxReviewCycles,
    resolutionFailure
  });
  const hasIntentFile = initialState.taskSemanticFiles.some((path) => path.startsWith("intent/"));
  const hasLongTextFile = initialState.taskSemanticFiles.some((path) => path.startsWith("longtext/"));
  if (!hasIntentFile) {
    await invokePhase("intent", adaptiveGoals.intent);
  }
  await invokePhase("ontology", adaptiveGoals.ontology);
  if (!hasLongTextFile) {
    await invokePhase("longtext", adaptiveGoals.longtext);
  }
  await invokePhase("circuit", adaptiveGoals.circuit);

  const cycles = [];
  let assessment = await assessAdaptiveTask({
    projectRoot, agentRoot, taskRoot, executionOptions, allowUnknown, assurance
  });
  for (let reviewIndex = 1; reviewIndex <= maxReviewCycles; reviewIndex += 1) {
    const projection = assessmentProjection(assessment, reviewIndex);
    cycles.push(projection);
    const diagnosticsPath = await writeAssessment(taskRoot, projection);
    await invokePhase(
      "review",
      adaptiveGoals.review,
      diagnosticsPath
    );
    assessment = await assessAdaptiveTask({
      projectRoot, agentRoot, taskRoot, executionOptions, allowUnknown, assurance
    });
    if (assessment.failures.length === 0) {
      const accepted = assessmentProjection(assessment, reviewIndex + 1);
      cycles.push(accepted);
      await writeAssessment(taskRoot, accepted);
      const record = Object.freeze({
        mode: "adaptive-task-authoring",
        agent: identityOf(assessment.runtime.agent),
        task: identityOf(assessment.runtime.task),
        phases: Object.freeze(phases),
        authoringRuns: Object.freeze(authoringRuns),
        initialState,
        cycles: Object.freeze(cycles),
        assurance,
        accepted: true
      });
      await atomicWrite(
        resolve(taskRoot, "results", "adaptive-authoring.mjs"),
        `export default ${render(record)};\n`
      );
      const reviewCount = phases.filter((phase) => phase === "review").length;
      const authoringReport = [
        "# Adaptive task authoring",
        "",
        `Accepted after ${cycles.length} deterministic assessments and ${reviewCount} Codex review cycle(s).`,
        "",
        `Phases: ${phases.map((phase) => `\`${phase}\``).join(", ")}.`,
        `Auxiliary requirement: \`${assurance}\`.`
      ].join("\n");
      await atomicWrite(
        resolve(taskRoot, "results", "adaptive-authoring.md"),
        `${authoringReport}\n`
      );
      const replay = replayProjection(assessment.replay);
      await atomicWrite(
        resolve(taskRoot, "results", "adaptive-replay.mjs"),
        `export default ${render(replay)};\n`
      );
      const replayReport = [
        "# Adaptive model-free replay",
        "",
        "Equivalent: yes.",
        "",
        `- Circuits: ${replay.circuits.map((entry) => `\`${entry}\``).join(", ")}.`,
        `- Findings: ${replay.findings.map((entry) => `\`${entry}\``).join(", ")}.`,
        `- Generated frames: ${replay.frames.length}.`,
        `- Auxiliary passes: ${replay.assurance.length}.`,
        `- Markdown CNL SHA-256: \`${replay.responseDigest}\`.`
      ].join("\n");
      await atomicWrite(
        resolve(taskRoot, "results", "adaptive-replay.md"),
        `${replayReport}\n`
      );
      return Object.freeze({ execution: assessment.execution, record });
    }
  }
  const finalProjection = assessmentProjection(assessment, maxReviewCycles + 1);
  cycles.push(finalProjection);
  const diagnosticsPath = await writeAssessment(taskRoot, finalProjection);
  const failedRecord = Object.freeze({
    mode: "adaptive-task-authoring",
    phases,
    authoringRuns,
    initialState,
    cycles,
    assurance,
    accepted: false
  });
  await atomicWrite(
    resolve(taskRoot, "results", "adaptive-authoring.mjs"),
    `export default ${render(failedRecord)};\n`
  );
  throw new Error(`ADAPTIVE_AUTHORING_NOT_ACCEPTED: see ${diagnosticsPath}`);
}
