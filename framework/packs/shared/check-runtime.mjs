import { circuit, capability, concept, guarantee } from "../../sdk/circuit/circuit.mjs";
import { proceduralStage } from "../../sdk/circuit/procedural.mjs";
import { Finding } from "../../sdk/circuit/decisions.mjs";
import { generationPlan, repairFrame, clarificationFrame, literalSlot } from "../../sdk/cnl/frames.mjs";

function localName(term) { return String(term?.descriptor?.().concept ?? "").split(":").at(-1); }
function evidenceFor(store, values) { return values.flatMap((value) => store.grounding(value).length ? store.grounding(value) : [value]); }
function termRoles(term) {
  const roles = new Map();
  for (const binding of term?.bindings?.() ?? []) {
    const name = binding.role().name ?? String(binding.role().identity ?? binding.role()).split(":").at(-1);
    if (!roles.has(name)) roles.set(name, []);
    roles.get(name).push(binding.value());
  }
  return roles;
}

export function structuralEvaluator(capabilityName, requiredConcepts = []) {
  return ({ store, circuit: circuitModel }) => {
    const localRequirements = requiredConcepts.map((name) => String(name).split(":").at(-1));
    const candidates = store.allTerms().filter((term) => localRequirements.length === 0 || localRequirements.some((name) => localName(term) === name));
    if (candidates.length === 0) {
      return [new Finding({ code: `${capabilityName}.not-applicable`, status: "NOT_APPLICABLE", circuit: circuitModel.identity, evidence: [], details: { requiredConcepts } })];
    }
    if (/Completeness|FrameCompleteness/.test(capabilityName)) {
      const incomplete = candidates.filter((term) => term.bindings().length === 0);
      return [new Finding({
        code: `${capabilityName}.${incomplete.length ? "missing-slots" : "complete"}`,
        status: incomplete.length ? "UNKNOWN" : "SATISFIED",
        circuit: circuitModel.identity,
        evidence: evidenceFor(store, incomplete.length ? incomplete : candidates),
        details: { checked: candidates.length, incomplete: incomplete.map((term) => term.identity()) }
      })];
    }
    if (/Contradiction|Conflict|Consistency|Impossible|Category/.test(capabilityName)) {
      const claims = store.allClaims(); const conflicts = [];
      for (let leftIndex = 0; leftIndex < claims.length; leftIndex += 1) for (let rightIndex = leftIndex + 1; rightIndex < claims.length; rightIndex += 1) {
        const left = claims[leftIndex]; const right = claims[rightIndex];
        if (left.proposition().identity() !== right.proposition().identity()) continue;
        if (left.descriptor().polarity.value() !== right.descriptor().polarity.value()) conflicts.push([left, right]);
      }
      return [new Finding({
        code: `${capabilityName}.${conflicts.length ? "conflict" : "consistent"}`,
        status: conflicts.length ? "CONFLICT" : "SATISFIED",
        circuit: circuitModel.identity,
        evidence: conflicts.length ? conflicts.flat().flatMap((claim) => claim.groundings()) : evidenceFor(store, candidates),
        details: { checkedClaims: claims.length, conflictPairs: conflicts.length }
      })];
    }
    if (/Continuity|Order|Sequence|Lifecycle|Deadline|Transition|Closure/.test(capabilityName)) {
      const related = store.allRelations().filter((relation) => ["Before", "After", "During", "Overlaps"].includes(relation.kind()));
      return [new Finding({
        code: `${capabilityName}.${related.length ? "represented" : "insufficient-order"}`,
        status: related.length ? "SATISFIED" : "UNKNOWN",
        circuit: circuitModel.identity,
        evidence: evidenceFor(store, candidates), details: { temporalRelations: related.length }
      })];
    }
    if (/Evidence|Authority|Basis|Generalization|Perspective|Attribution|Assumption|Typicality/.test(capabilityName)) {
      const grounded = candidates.filter((term) => store.grounding(term).length > 0);
      return [new Finding({
        code: `${capabilityName}.${grounded.length === candidates.length ? "grounded" : "needs-evidence"}`,
        status: grounded.length === candidates.length ? "SATISFIED" : "UNKNOWN",
        circuit: circuitModel.identity,
        evidence: evidenceFor(store, grounded), details: { grounded: grounded.length, checked: candidates.length }
      })];
    }
    const roleCounts = candidates.map((term) => termRoles(term).size);
    return [new Finding({
      code: `${capabilityName}.insufficient-model`, status: "UNKNOWN", circuit: circuitModel.identity,
      evidence: evidenceFor(store, candidates), details: { checked: candidates.length, roleCounts }
    })];
  };
}

export function createCheckCircuit(packId, capabilityName, requiredConcepts = [], evaluator = null) {
  const stage = proceduralStage(`${packId}.${capabilityName}.evaluate`)
    .reads(...requiredConcepts)
    .writes("Finding")
    .run(evaluator ?? structuralEvaluator(capabilityName, requiredConcepts));
  return circuit(`${packId}.${capabilityName}`, "1.0.0")
    .concern(capabilityName)
    .requires(...requiredConcepts.map((name) => concept(String(name).includes(":") ? name : `${packId}:${name}`)))
    .provides(capability(capabilityName), guarantee("evidence-bearing"), guarantee("interpretation-aware"))
    .use(stage)
    .emit({ kind: "finding-emission", value: stage })
    .statuses("SATISFIED", "VIOLATED", "UNKNOWN", "CONFLICT", "NOT_APPLICABLE")
    .seal();
}

export function createGenerationCircuit(packId, capabilityName, sectionNames) {
  const stage = proceduralStage(`${packId}.${capabilityName}.generate`)
    .reads("Claim")
    .writes("CNLFrame")
    .run(({ store }) => {
      const frame = /Demand$/.test(capabilityName) ? clarificationFrame(`${packId}.${capabilityName}`) : /Repair/.test(capabilityName) ? repairFrame(`${packId}.${capabilityName}`) : generationPlan(`${packId}.${capabilityName}`);
      frame.set("domain", literalSlot(packId));
      frame.set("capability", literalSlot(capabilityName));
      frame.set("sections", literalSlot(sectionNames.join(" -> ")));
      frame.set("evidence-count", literalSlot(String(store.allClaims().length)));
      return frame.provenance(...store.allClaims()).seal();
    });
  return circuit(`${packId}.${capabilityName}`, "1.0.0")
    .provides(capability(capabilityName), guarantee("plan-explainable"))
    .use(stage).emit({ kind: "cnl-emission", value: stage }).seal();
}
