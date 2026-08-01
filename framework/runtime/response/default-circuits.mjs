import {
  responseCircuit,
  responseStage
} from "../../sdk/cnl/response.mjs";

const MATERIAL_STATUSES = new Set([
  "VIOLATED", "CONFLICT", "UNKNOWN", "POSSIBLE_PROBLEM", "BLOCKED_ONTOLOGY",
  "BLOCKED_COVERAGE", "BLOCKED_RESOURCE", "BLOCKED_METHOD"
]);

const INTERNAL_FINDING = /^(?:CoreGroundingFinding\.|.*_NOT_APPLICABLE$)/;

function presentationValues(intent, kind) {
  return (intent?.presentation ?? []).filter((entry) => entry.kind === kind).map((entry) => entry.value);
}

function groupFamily(status) {
  const families = {
    VIOLATED: "violations",
    CONFLICT: "conflicts",
    UNKNOWN: "uncertainties",
    POSSIBLE_PROBLEM: "possible-problems",
    SATISFIED: "confirmations",
    ACCEPTED_EXCEPTION: "accepted-exceptions",
    BLOCKED_ONTOLOGY: "blocked",
    BLOCKED_COVERAGE: "blocked",
    BLOCKED_RESOURCE: "blocked",
    BLOCKED_METHOD: "blocked"
  };
  return families[status] ?? "other-results";
}

function findingTags(finding) {
  return Object.freeze(new Set([
    "finding",
    `status:${finding.status().toLocaleLowerCase("en")}`,
    `code:${finding.code().toLocaleLowerCase("en")}`,
    `group:${groupFamily(finding.status())}`,
    MATERIAL_STATUSES.has(finding.status()) ? "material" : "supporting"
  ]));
}

function ruleFor(finding, executions) {
  const circuitIdentity = finding.descriptor().circuit;
  const circuit = executions.find((execution) => execution.circuit.identity === circuitIdentity)?.circuit;
  if (!circuit) return null;
  for (const stage of circuit.stages) {
    if (stage.kind?.() !== "DecisionTable") continue;
    const row = stage.descriptor().rows.find((entry) => entry.result.code === finding.code());
    if (!row) continue;
    const condition = row.condition;
    const operand = condition.descriptor?.().operand;
    const assessed = operand?.descriptor?.().operand ?? operand;
    return Object.freeze({
      circuit: circuit.id,
      concern: circuit.concerns.join(", ") || circuit.id,
      decision: stage.descriptor().id,
      condition: condition.kind?.() ?? "condition",
      assessment: assessed?.descriptor?.().id ?? assessed?.kind?.() ?? "semantic assessment",
      outcome: finding.status(),
      code: finding.code()
    });
  }
  return Object.freeze({
    circuit: circuit.id,
    concern: circuit.concerns.join(", ") || circuit.id,
    decision: null,
    condition: null,
    assessment: null,
    outcome: finding.status(),
    code: finding.code()
  });
}

const selectApplicable = responseStage("response.select-applicable-findings", (state) => {
  const includeStatuses = new Set(presentationValues(state.intent, "include-status"));
  const excludeStatuses = new Set(presentationValues(state.intent, "exclude-status"));
  const includeTags = new Set(presentationValues(state.intent, "include-tag"));
  const excludeTags = new Set(presentationValues(state.intent, "exclude-tag"));
  const candidates = state.findings
    .filter((finding) => !INTERNAL_FINDING.test(finding.code()) && finding.status() !== "NOT_APPLICABLE")
    .map((finding) => Object.freeze({ finding, tags: findingTags(finding), rule: ruleFor(finding, state.executions) }))
    .filter((entry) => includeStatuses.size === 0 || includeStatuses.has(entry.finding.status()))
    .filter((entry) => !excludeStatuses.has(entry.finding.status()))
    .filter((entry) => includeTags.size === 0 || [...includeTags].every((tag) => entry.tags.has(tag)))
    .filter((entry) => ![...excludeTags].some((tag) => entry.tags.has(tag)));
  const material = candidates.filter((entry) => entry.tags.has("material"));
  const includeSatisfied = presentationValues(state.intent, "feature").includes("include-satisfied");
  const selected = material.length > 0 && !includeSatisfied ? material : candidates;
  return { ...state, entries: Object.freeze(selected) };
});

const inferStyle = responseStage("response.infer-style", (state) => {
  const requested = presentationValues(state.intent, "style").at(-1);
  const modes = new Set(state.intent?.modes?.map((entry) => entry.kind) ?? []);
  const style = requested ?? (modes.has("generate") || modes.has("plan") ? "procedural" : "evidence-led");
  const requestedFeatures = presentationValues(state.intent, "feature");
  const features = new Set([
    "explain-rules", "quote-evidence", "count-groups", "stable-tags", ...requestedFeatures
  ]);
  return { ...state, style, features: Object.freeze(features) };
});

const groupEntries = responseStage("response.group-results", (state) => {
  const grouping = presentationValues(state.intent, "group-by").at(-1) ?? "status-family";
  const groups = new Map();
  for (const entry of state.entries) {
    const key = grouping === "code"
      ? entry.finding.code()
      : grouping === "circuit"
        ? entry.rule?.circuit ?? "unattributed"
        : grouping === "status"
          ? entry.finding.status().toLocaleLowerCase("en")
          : groupFamily(entry.finding.status());
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(entry);
  }
  return {
    ...state,
    grouping,
    groups: Object.freeze([...groups].map(([key, entries]) => Object.freeze({ key, entries: Object.freeze(entries) })))
  };
});

const markGeneratedContent = responseStage("response.select-generated-content", (state) => {
  const modes = new Set(state.intent?.modes?.map((entry) => entry.kind) ?? []);
  const outputs = new Set(state.intent?.outputs?.map((entry) => entry.value) ?? []);
  const proceduralRequested = modes.has("generate") || modes.has("plan") || outputs.has("composition-plan");
  const frames = state.frames.filter((frame) => {
    if (frame.kind() === "Finding") return false;
    if (["ProcedureStep", "GenerationPlan"].includes(frame.kind())) return proceduralRequested;
    if (frame.kind() === "Repair") return modes.has("repair") || outputs.has("repair-frames");
    if (frame.kind() === "Clarification") return outputs.has("clarification-questions");
    return outputs.has("cnl-observations");
  });
  return { ...state, generatedFrames: Object.freeze(frames) };
});

export const materialSelectionResponseCircuit = responseCircuit("nll.response.MaterialSelection", "1.0.0")
  .priority(10)
  .use(selectApplicable)
  .seal();

export const intentStyleResponseCircuit = responseCircuit("nll.response.IntentStyle", "1.0.0")
  .priority(20)
  .use(inferStyle)
  .seal();

export const groupedAnalysisResponseCircuit = responseCircuit("nll.response.GroupedAnalysis", "1.0.0")
  .priority(30)
  .when(({ intent }) => !(intent?.modes ?? []).some((mode) => ["generate", "plan"].includes(mode.kind)))
  .use(groupEntries, markGeneratedContent)
  .seal();

export const generatedContentResponseCircuit = responseCircuit("nll.response.GeneratedContent", "1.0.0")
  .priority(30)
  .when(({ intent }) => (intent?.modes ?? []).some((mode) => ["generate", "plan"].includes(mode.kind)))
  .use(groupEntries, markGeneratedContent)
  .seal();

export const defaultResponseCircuits = Object.freeze([
  materialSelectionResponseCircuit,
  intentStyleResponseCircuit,
  groupedAnalysisResponseCircuit,
  generatedContentResponseCircuit
]);
