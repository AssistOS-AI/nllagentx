import { relative, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { createHash } from "node:crypto";
import { executeTask } from "../../framework/tools/executor.mjs";
import { atomicWrite, jsString, listFiles } from "../../framework/tools/filesystem.mjs";
import { loadSourceRegistry } from "../../framework/tools/source-tools.mjs";

const projectRoot = resolve(import.meta.dirname, "../..");
const evaluationRoot = import.meta.dirname;
const agentRoot = resolve(evaluationRoot, "agents", "adaptive-core-agent");
const taskRoot = resolve(agentRoot, "tasks", "task-cold-chain-transfer-core-only");

function render(value) {
  if (value === null) return "null";
  if (["boolean", "number"].includes(typeof value)) return String(value);
  if (typeof value === "string") return jsString(value);
  if (Array.isArray(value)) return `Object.freeze([${value.map(render).join(", ")}])`;
  const entries = Object.entries(value)
    .map(([key, entry]) => `${jsString(key)}: ${render(entry)}`)
    .join(", ");
  return `Object.freeze({ ${entries} })`;
}

async function importDefault(path) {
  const url = pathToFileURL(path);
  url.searchParams.set("adaptiveValidation", String(Date.now()));
  return (await import(url.href)).default;
}

function identityOf(value) {
  return typeof value?.identity === "function" ? value.identity() : value?.identity ?? String(value);
}

function evidenceSpans(finding) {
  const spans = [];
  for (const evidence of finding.evidence()) {
    if (evidence?.sort?.() === "SourceSpan") spans.push(evidence);
    if (typeof evidence?.groundings === "function") spans.push(...evidence.groundings());
  }
  return [...new Map(spans.map((span) => [identityOf(span), span])).values()];
}

function evidenceTexts(findings, registry) {
  return findings.flatMap((finding) => evidenceSpans(finding).map((span) => {
    const source = registry.source(span.sourceId());
    return source?.text.slice(span.start(), span.end()) ?? "";
  }));
}

function validateAssurance(execution, nonCoreCircuits, failures) {
  for (const circuit of nonCoreCircuits) {
    const abstract = execution.assurance.find((entry) => (
      entry.circuit === circuit.identity && entry.method === "abstract-preflight"
    ));
    const symbolic = execution.assurance.find((entry) => (
      entry.circuit === circuit.identity && entry.method === "symbolic-decision-coverage"
    ));
    if (abstract?.result?.converged !== true) {
      failures.push(`${circuit.id} lacks convergent abstract assurance`);
    }
    if (!symbolic || symbolic.result.truncated || symbolic.result.paths.length === 0) {
      failures.push(`${circuit.id} lacks complete symbolic paths`);
    }
  }
}

const record = await importDefault(resolve(taskRoot, "results", "adaptive-authoring.mjs"));
const replay = await importDefault(resolve(taskRoot, "results", "adaptive-replay.mjs"));
const execution = await executeTask({ projectRoot, agentRoot, taskRoot, assurance: "all" });
const registry = await loadSourceRegistry(taskRoot, { projectRoot });
const ontologyFiles = await listFiles(resolve(taskRoot, "ontologies"), {
  include: (path) => path.endsWith(".ontology.mjs")
});
const circuitFiles = await listFiles(resolve(taskRoot, "circuits"), {
  include: (path) => path.endsWith(".circuit.mjs")
});
const nonCoreCircuits = execution.plan.circuits.filter((circuit) => (
  !circuit.id.startsWith("core-language.")
));
const nonCoreIdentities = new Set(nonCoreCircuits.map((circuit) => circuit.identity));
const nonCoreFindings = execution.findings.filter((finding) => (
  nonCoreIdentities.has(finding.descriptor().circuit)
));
const citedText = evidenceTexts(nonCoreFindings, registry).join("\n");
const failures = [];
const responseDigest = createHash("sha256").update(execution.response).digest("hex");

if (!record.accepted) failures.push("adaptive authoring record is not accepted");
if (record.initialState.taskSemanticFiles.length !== 0) {
  failures.push("task semantic programs existed before adaptive authoring");
}
for (const phase of ["intent", "ontology", "longtext", "circuit", "review"]) {
  if (!record.phases.includes(phase)) failures.push(`missing real Codex phase ${phase}`);
}
if (!record.authoringRuns.every((run) => run.adapter === "codex" && run.exitCode === 0)) {
  failures.push("one or more adaptive authoring runs is not a successful Codex process");
}
if (ontologyFiles.length === 0) failures.push("no task-local OntologyJS was generated");
if (circuitFiles.length === 0) failures.push("no task-local CircuitJS was generated");
if (nonCoreCircuits.length === 0) failures.push("no task-local semantic circuit was selected");
if (!nonCoreFindings.some((finding) => finding.status() === "VIOLATED")) {
  failures.push("the unsupported release conclusion was not violated by a non-core circuit");
}
if (!/calibration certificate[\s\S]*expired/i.test(citedText)) {
  failures.push("finding evidence does not cite the expired calibration certificate");
}
if (!/no acknowledgement by Vale Laboratory/i.test(citedText)) {
  failures.push("finding evidence does not cite the missing receiving-party acknowledgement");
}
if (!execution.runtime.intent?.outputs.some((entry) => entry.value === "markdown-cnl")) {
  failures.push("IntentJS does not request the primary Markdown CNL response");
}
if (!execution.response.includes("[CNL:DOCUMENT]") || !execution.response.includes("[CNL:FINDING]")) {
  failures.push("primary response is not tagged, finding-bearing Markdown CNL");
}
if (/Object\.freeze|nll\.source-span|NOT_APPLICABLE/.test(execution.response)) {
  failures.push("primary response leaks raw executable data or a non-applicable branch");
}
if (!/expired calibration certificate/i.test(execution.response)
  || !/no acknowledgement by Vale Laboratory/i.test(execution.response)) {
  failures.push("primary response does not explain the decisive source evidence");
}
validateAssurance(execution, nonCoreCircuits, failures);
if (record.cycles.at(-1)?.replayEquivalent !== true) {
  failures.push("adaptive acceptance did not record equivalent replay");
}
const executedFindingKeys = execution.findings.map((finding) => (
  `${finding.code()}:${finding.status()}`
)).sort();
if (JSON.stringify(executedFindingKeys) !== JSON.stringify([...replay.findings].sort())) {
  failures.push("current model-free replay findings differ from the accepted projection");
}
if (replay.responseDigest !== responseDigest) {
  failures.push("current Markdown CNL differs from the accepted model-free replay");
}

const validation = Object.freeze({
  accepted: failures.length === 0,
  failures: Object.freeze(failures),
  task: relative(projectRoot, taskRoot).split("\\").join("/"),
  generatedOntologies: Object.freeze(ontologyFiles.map((path) => relative(taskRoot, path))),
  generatedCircuits: Object.freeze(circuitFiles.map((path) => relative(taskRoot, path))),
  selectedNonCoreCircuits: Object.freeze(nonCoreCircuits.map((circuit) => circuit.identity)),
  nonCoreFindings: Object.freeze(nonCoreFindings.map((finding) => (
    `${finding.code()}:${finding.status()}`
  ))),
  citedEvidence: Object.freeze(evidenceTexts(nonCoreFindings, registry)),
  abstractPasses: execution.assurance.filter((entry) => entry.method === "abstract-preflight").length,
  symbolicPasses: execution.assurance.filter((entry) => entry.method === "symbolic-decision-coverage").length,
  responseDigest,
  replayEquivalent: failures.every((failure) => !failure.includes("replay"))
});

await atomicWrite(
  resolve(evaluationRoot, "reports", "validation.mjs"),
  `export default ${render(validation)};\n`
);
const reportBody = failures.length
  ? failures.map((failure) => `- ${failure}`).join("\n")
  : "All real-authoring, semantic, assurance, evidence, and replay checks passed.";
await atomicWrite(
  resolve(evaluationRoot, "reports", "validation.md"),
  `# Adaptive task-local authoring validation\n\nAccepted: ${validation.accepted ? "yes" : "no"}.\n\n`
    + `${reportBody}\n`
);

if (failures.length) {
  throw new Error(`ADAPTIVE_EVALUATION_FAILED: ${failures.join("; ")}`);
}
console.log(`Adaptive evaluation accepted with ${nonCoreFindings.length} non-core finding(s).`);
