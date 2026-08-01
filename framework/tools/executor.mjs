import { writeFile } from "node:fs/promises";
import { resolve, relative, sep } from "node:path";
import { serialize } from "node:v8";
import { SemanticStore } from "../runtime/store/semantic-store.mjs";
import { CircuitRunner } from "../runtime/circuit-runner.mjs";
import { CapabilityPlanner } from "../runtime/planner/capability-search.mjs";
import { explainPlan } from "../runtime/planner/explain.mjs";
import { abstractCircuit } from "../runtime/methods/abstract/worklist.mjs";
import { exploreDecisionConditions } from "../runtime/methods/symbolic/explorer.mjs";
import { composeResponse } from "../runtime/response/composer.mjs";
import { defaultResponseCircuits } from "../runtime/response/default-circuits.mjs";
import { findingFrame, literalSlot } from "../sdk/cnl/frames.mjs";
import { renderCanonicalCNL } from "../sdk/cnl/grammar.mjs";
import { resolveRuntime, importFresh } from "./module-loader.mjs";
import { atomicWrite, ensureDirectory, jsString } from "./filesystem.mjs";
import { loadSourceRegistry } from "./source-tools.mjs";
import { renderArtifactManifest, renderTaskResponse } from "./response-renderer.mjs";

function identityOf(value) {
  if (typeof value?.identity === "function") return value.identity();
  if (typeof value?.identity === "string") return value.identity;
  return String(value);
}

function safeProjection(value, seen = new Set()) {
  if (value === null || value === undefined || ["string", "number", "boolean"].includes(typeof value)) return value;
  if (typeof value === "bigint") return String(value);
  if (typeof value === "function") return `[function ${value.name || "anonymous"}]`;
  if (typeof value?.identity === "function") return value.identity();
  if (seen.has(value)) return "[cycle]";
  seen.add(value);
  let projected;
  if (Array.isArray(value)) projected = value.map((entry) => safeProjection(entry, seen));
  else if (value instanceof Map) projected = [...value].map(([key, entry]) => [safeProjection(key, seen), safeProjection(entry, seen)]);
  else if (value instanceof Set) projected = [...value].map((entry) => safeProjection(entry, seen));
  else projected = Object.fromEntries(Object.entries(value).map(([key, entry]) => [key, safeProjection(entry, seen)]));
  seen.delete(value); return projected;
}

function findingCNL(finding) {
  return findingFrame(finding.code())
    .set("status", literalSlot(finding.status()))
    .set("message", literalSlot(finding.message() ?? finding.code()))
    .set("evidence", literalSlot([...finding.evidence()].map(identityOf).join(", ") || "none"))
    .provenance(...finding.evidence()).seal();
}

function moduleSpecifier(fromDirectory, target) { let value = relative(fromDirectory, target).split(sep).join("/"); if (!value.startsWith(".")) value = `./${value}`; return value; }

function findingsModuleSource(findings, resultsRoot, projectRoot) {
  const entries = findings.map((finding) => {
    const evidence = [...finding.evidence()].map(identityOf);
    const details = safeProjection(finding.descriptor().details);
    return `findingResult(${jsString(finding.code())}, ${jsString(finding.status())}, [${evidence.map(jsString).join(", ")}], ${renderJsValue(details)}, ${jsString(finding.message() ?? "")}, ${jsString(finding.descriptor().circuit ?? "")})`;
  });
  const resultsSdk = moduleSpecifier(resultsRoot, resolve(projectRoot, "framework", "sdk", "circuit", "results.mjs"));
  return `import { findingResult, findingSet } from ${jsString(resultsSdk)};\n\nexport default findingSet(\n  ${entries.join(",\n  ")}\n);\n`;
}

function renderJsValue(value) {
  if (value === null) return "null";
  if (typeof value === "string") return jsString(value);
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (Array.isArray(value)) return `[${value.map(renderJsValue).join(", ")}]`;
  if (typeof value === "object") return `{ ${Object.entries(value).map(([key, entry]) => `${jsString(key)}: ${renderJsValue(entry)}`).join(", ")} }`;
  return jsString(String(value));
}

function requestedCapabilities(runtime, explicit = []) {
  const concerns = runtime.intent?.concerns?.map((entry) => entry.value) ?? [];
  const outputs = runtime.intent?.outputs?.map((entry) => entry.value) ?? runtime.task?.outputs?.map((entry) => entry.value) ?? [];
  return [...new Set([...explicit, ...concerns, ...outputs])].filter((capability) => runtime.registry.providersFor(capability).length > 0);
}

export async function prepareExecution(options) {
  const { projectRoot, agentRoot, taskRoot, profileId = null, allCompatible = false } = options;
  const runtime = await resolveRuntime({ projectRoot, agentRoot, taskRoot, profileId, allCompatible, domains: options.domains, excludeDomains: options.excludeDomains, only: options.only, checks: options.checks, excludeChecks: options.excludeChecks, intentText: options.intentText });
  const store = new SemanticStore({ id: runtime.task?.id ?? "agent-store" });
  for (const ontology of runtime.ontologies) store.installOntology(ontology);
  for (const longText of runtime.longTexts) store.beginTransaction(`longtext:${longText.id}`).longText(longText).commit();
  const fallbackAll = allCompatible || !runtime.intent || runtime.intent.fallback?.value === "all-compatible";
  const planner = new CapabilityPlanner(runtime.registry);
  const plan = planner.plan({ requested: requestedCapabilities(runtime, options.checks ?? []), store, allCompatible: fallbackAll, allowedCircuits: runtime.circuits });
  return Object.freeze({ runtime, store, plan });
}

export async function executeTask(options) {
  const prepared = await prepareExecution(options); const runner = new CircuitRunner(); const executions = [];
  for (const circuit of prepared.plan.circuits) executions.push(await runner.run(circuit, prepared.store, options));
  const findings = executions.flatMap((execution) => execution.findings);
  const frames = executions.flatMap((execution) => execution.frames);
  const diagnostics = [...prepared.plan.blocked, ...executions.flatMap((execution) => execution.diagnostics)];
  const assuranceRequests = new Set([
    ...(prepared.runtime.intent?.assurances?.map((entry) => entry.value) ?? []),
    ...(prepared.runtime.profile.assurance?.map((entry) => entry.value) ?? [])
  ]);
  const assurance = [];
  for (const circuit of prepared.plan.circuits) {
    const declared = new Set(circuit.assurances.map((entry) => entry.kind));
    if (declared.has("abstract-preflight") && (assuranceRequests.has("abstract-preflight") || options.assurance === "abstract" || options.assurance === "all")) assurance.push({ circuit: circuit.identity, method: "abstract-preflight", result: abstractCircuit(circuit) });
    if (declared.has("symbolic-decision-coverage") && (assuranceRequests.has("symbolic-decision-coverage") || assuranceRequests.has("symbolic-where-supported") || options.assurance === "symbolic" || options.assurance === "all")) assurance.push({ circuit: circuit.identity, method: "symbolic-decision-coverage", result: symbolicCircuit(circuit) });
  }
  const resultsRoot = resolve(options.taskRoot, "results"); await ensureDirectory(resultsRoot);
  const profileSummary = { profile: prepared.runtime.profile.id, packs: prepared.runtime.packs, reasons: new Map(prepared.runtime.packs.map((pack) => [pack.id, "resolved-profile"])) };
  await atomicWrite(resolve(resultsRoot, "execution-plan.md"), explainPlan({ intent: prepared.runtime.intent, profile: profileSummary, plan: prepared.plan }));
  await atomicWrite(resolve(resultsRoot, "findings.mjs"), findingsModuleSource(findings, resultsRoot, options.projectRoot));
  const findingFrames = findings.map(findingCNL); const cnlFrames = [...findingFrames, ...frames];
  await atomicWrite(resolve(resultsRoot, "findings.cnl"), findingFrames.map(renderCanonicalCNL).join("\n\n"));
  await atomicWrite(resolve(resultsRoot, "observations.cnl"), cnlFrames.map(renderCanonicalCNL).join("\n\n"));
  await atomicWrite(resolve(resultsRoot, "generation-plan.cnl"), frames.map(renderCanonicalCNL).join("\n\n"));
  await atomicWrite(resolve(resultsRoot, "coverage.md"), `# Coverage\n\nStore witnesses: ${prepared.store.allCoverage().length}. Loaded packs: ${prepared.runtime.packs.map((pack) => `\`${pack.id}\``).join(", ")}. Executed circuits: ${executions.length}.\n`);
  await atomicWrite(resolve(resultsRoot, "diagnostics.md"), `# Diagnostics\n\n${diagnostics.length ? diagnostics.map((entry) => `- \`${entry.code ?? "DIAGNOSTIC"}\`: ${entry.capability ?? entry.stage ?? entry.message ?? "see trace"}`).join("\n") : "No blocking diagnostics."}\n`);
  const traceEvents = executions.flatMap((execution) => execution.trace.events()).map((event) => safeProjection(event));
  await writeFile(resolve(resultsRoot, "trace.bin"), serialize(traceEvents));
  await atomicWrite(resolve(resultsRoot, "trace-summary.md"), `# Trace Summary\n\nEvents: ${traceEvents.length}. Circuits: ${executions.length}. Findings: ${findings.length}. CNL frames: ${frames.length}.\n`);
  await atomicWrite(resolve(resultsRoot, "assurance.mjs"), `export default Object.freeze(${renderJsValue(safeProjection(assurance))});\n`);
  await atomicWrite(resolve(resultsRoot, "assurance.md"), `# Auxiliary assurance\n\n${assurance.length ? assurance.map((entry) => `- \`${entry.circuit}\`: ${entry.method}`).join("\n") : "No auxiliary assurance pass was requested and declared by a selected circuit."}\n`);
  const composition = composeResponse({
    intent: prepared.runtime.intent,
    findings,
    frames,
    executions,
    circuits: [...defaultResponseCircuits, ...prepared.runtime.responseCircuits]
  });
  const sourceRegistry = await loadSourceRegistry(options.taskRoot, { projectRoot: options.projectRoot });
  const response = await renderTaskResponse({
    runtime: prepared.runtime,
    store: prepared.store,
    composition,
    diagnostics,
    sourceRegistry
  });
  await atomicWrite(resolve(resultsRoot, "response.md"), response);
  await atomicWrite(resolve(resultsRoot, "artifacts.md"), await renderArtifactManifest({
    taskRoot: options.taskRoot,
    resultsRoot
  }));
  await atomicWrite(
    resolve(resultsRoot, "response-circuits.mjs"),
    `export default Object.freeze(${renderJsValue(safeProjection({
      style: composition.style,
      grouping: composition.grouping,
      selectedCircuits: composition.selectedCircuits,
      trace: composition.trace
    }))});\n`
  );
  await atomicWrite(resolve(resultsRoot, "report.md"), `# Technical execution report\n\nThe primary human-facing result is [\`response.md\`](response.md). This file reports execution mechanics only.\n\nTask: \`${prepared.runtime.task.id}\`. Profile: \`${prepared.runtime.profile.id}\`.\n\n- Executed semantic circuits: ${executions.length}\n- Selected response circuits: ${composition.selectedCircuits.length}\n- Public CNL findings: ${composition.entries.length}\n- Raw findings, including internal and non-applicable results: ${findings.length}\n- Generated CNL frames: ${frames.length}\n- Auxiliary assurance passes: ${assurance.length}\n- Blocking diagnostics: ${diagnostics.length}\n\nSee [\`artifacts.md\`](artifacts.md) for semantic programs, coding-agent evidence, canonical CNL, assurance, diagnostics, and trace artifacts.\n`);
  return Object.freeze({
    ...prepared,
    executions: Object.freeze(executions),
    findings: Object.freeze(findings),
    frames: Object.freeze(frames),
    assurance: Object.freeze(assurance),
    diagnostics: Object.freeze(diagnostics),
    composition,
    response,
    resultsRoot
  });
}

function symbolicEvidence(rows) {
  return Object.freeze([...new Set(rows.flatMap(({ row }) => row.result.evidence?.references ?? []).map(identityOf))]);
}

function symbolicDecisionOutput(table, truthByCondition) {
  const descriptor = table.descriptor();
  const matches = descriptor.rows
    .map((row, index) => ({ row, index, condition: row.condition.identity() }))
    .filter(({ condition }) => truthByCondition.get(condition) === true);
  if (matches.length === 0) {
    return Object.freeze({
      kind: "decision-no-row",
      decision: table.identity(),
      row: null,
      condition: null,
      code: `${descriptor.id}.no-row`,
      status: "UNKNOWN",
      evidence: Object.freeze([])
    });
  }
  if (matches.length > 1 && descriptor.overlapPolicy === "error") {
    return Object.freeze({
      kind: "decision-overlap",
      decision: table.identity(),
      row: null,
      condition: Object.freeze(matches.map(({ condition }) => condition)),
      code: `${descriptor.id}.overlap`,
      status: "CONFLICT",
      evidence: symbolicEvidence(matches)
    });
  }
  const selected = matches[0];
  return Object.freeze({
    kind: "decision-row",
    decision: table.identity(),
    row: selected.index,
    condition: selected.condition,
    code: selected.row.result.code,
    status: selected.row.result.status,
    evidence: symbolicEvidence([selected]),
    message: selected.row.result.message
  });
}

function symbolicCircuit(circuit) {
  const decisionTables = circuit.stages.filter((stage) => stage.kind?.() === "DecisionTable");
  const decisionConditions = decisionTables.flatMap((table) => table.descriptor().rows.map((row) => row.condition));
  const conditions = decisionConditions.map((condition) => condition.identity());
  const grouped = new Map();
  for (const condition of decisionConditions) {
    const operand = condition.descriptor?.().operand;
    if (!operand?.identity) continue;
    const key = typeof operand.identity === "function" ? operand.identity() : operand.identity;
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key).push(condition);
  }
  const truthFacets = new Set(["IsTrue", "IsFalse", "IsUnknown", "IsConflict"]);
  const completeGroups = []; const partialGroups = [];
  for (const conditionsForOperand of grouped.values()) {
    const identities = conditionsForOperand.map((condition) => condition.identity());
    const kinds = new Set(conditionsForOperand.map((condition) => condition.kind()));
    if ([...truthFacets].every((kind) => kinds.has(kind))) completeGroups.push(identities);
    else if (identities.length > 1) partialGroups.push(identities);
  }
  const explored = exploreDecisionConditions(conditions, {
    exclusiveGroups: completeGroups,
    atMostOneGroups: partialGroups
  });
  const paths = explored.paths.map((state) => {
    const truthByCondition = new Map(state.path.map(({ condition, truth }) => [condition, truth]));
    return state.withOutputs(...decisionTables.map((table) => symbolicDecisionOutput(table, truthByCondition)));
  });
  return Object.freeze({ ...explored, paths: Object.freeze(paths) });
}

export async function runCircuit(options, circuitId) {
  const prepared = await prepareExecution(options); const circuit = prepared.runtime.circuits.find((candidate) => candidate.id === circuitId || candidate.identity === circuitId);
  if (!circuit) throw new Error(`CIRCUIT_NOT_FOUND: ${circuitId}`);
  return new CircuitRunner().run(circuit, prepared.store, options);
}

export async function runAbstract(options, circuitId) {
  const prepared = await prepareExecution(options); const circuit = prepared.runtime.circuits.find((candidate) => candidate.id === circuitId || candidate.identity === circuitId);
  if (!circuit) throw new Error(`CIRCUIT_NOT_FOUND: ${circuitId}`);
  return abstractCircuit(circuit);
}

export async function runSymbolic(options, circuitId) {
  const prepared = await prepareExecution(options); const circuit = prepared.runtime.circuits.find((candidate) => candidate.id === circuitId || candidate.identity === circuitId);
  if (!circuit) throw new Error(`CIRCUIT_NOT_FOUND: ${circuitId}`);
  return symbolicCircuit(circuit);
}

export async function executeQueryModule(options, modulePath) {
  const prepared = await prepareExecution(options); const query = (await importFresh(modulePath)).default;
  return prepared.store.query(query.descriptor?.().pattern ?? query);
}

export async function verifyTaskAnchors(taskRoot, longTexts, { projectRoot = null } = {}) {
  const registry = await loadSourceRegistry(taskRoot, projectRoot ? { projectRoot } : {}); const spans = longTexts.flatMap((model) => model.claims.flatMap((claim) => claim.groundings()));
  return Object.freeze(spans.map((span) => registry.verify(span)));
}
