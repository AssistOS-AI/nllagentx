import { TRUE, FALSE, UNKNOWN, CONFLICT } from "../../../../../framework/sdk/core/logic.mjs";
import {
  Finding,
  FindingTemplate,
  PredicateCondition,
  decisionTable,
  evidence,
  row,
  when
} from "../../../../../framework/sdk/circuit/index.mjs";

export const REVIEW_OUTCOMES = Object.freeze({ TRUE, FALSE, UNKNOWN, CONFLICT });

export function identityOf(value) {
  if (typeof value?.identity === "function") return value.identity();
  if (typeof value?.identity === "string") return value.identity;
  return String(value);
}

function uniqueSemanticValues(values) {
  return [...new Map(values.filter(Boolean).map((value) => [identityOf(value), value])).values()]
    .sort((left, right) => identityOf(left).localeCompare(identityOf(right)));
}

function requirementList(values) {
  return Object.freeze([...new Set(values.filter(Boolean).map(String))]);
}

export function requirementDetails(details = {}, {
  failedRequirements = [],
  uncertainRequirements = [],
  conflictingRequirements = [],
  satisfiedRequirements = []
} = {}) {
  return Object.freeze({
    ...details,
    failedRequirements: requirementList(failedRequirements),
    uncertainRequirements: requirementList(uncertainRequirements),
    conflictingRequirements: requirementList(conflictingRequirements),
    satisfiedRequirements: requirementList(satisfiedRequirements)
  });
}

export function termsOf(store, concept) {
  return store.allTerms()
    .filter((term) => store.isSubtype(term, concept))
    .sort((left, right) => identityOf(left).localeCompare(identityOf(right)));
}

export function roleValues(store, term, role) {
  const indexed = store.targets(term, role);
  const values = indexed.length > 0
    ? indexed
    : (term?.bindings?.() ?? [])
      .filter((binding) => identityOf(binding.role()) === identityOf(role))
      .map((binding) => binding.value());
  return values
    .sort((left, right) => identityOf(left).localeCompare(identityOf(right)));
}

export function polarityOf(claim) {
  return claim.descriptor().polarity?.value?.() ?? "asserted";
}

export function groundedClaims(store, term, polarity = "asserted") {
  return store.claimsAbout(term)
    .filter((claim) => claim.groundings().length > 0 && polarityOf(claim) === polarity)
    .sort((left, right) => identityOf(left).localeCompare(identityOf(right)));
}

export function interpretationsCompatible(...claims) {
  const identities = new Set(
    claims
      .map((claim) => claim?.descriptor?.().interpretation)
      .filter(Boolean)
      .map(identityOf)
  );
  return identities.size <= 1;
}

export function commonInterpretation(claims) {
  const interpretations = uniqueSemanticValues(
    claims.map((claim) => claim?.descriptor?.().interpretation).filter(Boolean)
  );
  return interpretations.length === 1 ? interpretations[0] : null;
}

export function evidenceFor(store, terms, claims = []) {
  const selectedClaims = claims.length
    ? claims
    : terms.flatMap((term) => store.claimsAbout(term));
  return uniqueSemanticValues([
    ...terms,
    ...selectedClaims,
    ...selectedClaims.flatMap((claim) => claim.groundings())
  ]);
}

function coverageKeys(value) {
  const descriptor = value?.descriptor?.() ?? {};
  return [
    identityOf(value),
    descriptor.id,
    descriptor.sourceId,
    descriptor.unitId
  ].filter(Boolean).map(String);
}

export function hasClosedCoverage(store, concept, claims = []) {
  const contextKeys = new Set(
    claims
      .map((claim) => claim?.descriptor?.().context)
      .filter(Boolean)
      .flatMap(coverageKeys)
  );
  const groundings = claims.flatMap((claim) => claim?.groundings?.() ?? []);
  const sourceKeys = new Set(groundings.flatMap(coverageKeys));
  const sourceIds = new Set(
    groundings
      .map((grounding) => grounding?.descriptor?.().sourceId)
      .filter(Boolean)
      .map(String)
  );
  return store.allCoverage().some((witness) => {
    const descriptor = witness.descriptor();
    if (descriptor.status !== "closed" || identityOf(descriptor.concept) !== identityOf(concept)) {
      return false;
    }
    const scopeMatches = !descriptor.scope
      || (contextKeys.size > 0
        ? coverageKeys(descriptor.scope).some((key) => contextKeys.has(key))
        : coverageKeys(descriptor.scope).some((key) => sourceKeys.has(key)));
    if (!scopeMatches) return false;
    const declaredSourceKeys = new Set((descriptor.sources ?? []).flatMap(coverageKeys));
    return declaredSourceKeys.size === 0
      || [...sourceIds].every((sourceId) => declaredSourceKeys.has(sourceId));
  });
}

export function assessment(outcome, evidenceValues, details = {}, interpretation = null, finding = null) {
  return Object.freeze({
    outcome,
    evidence: Object.freeze(uniqueSemanticValues(evidenceValues)),
    details: Object.freeze({ ...details }),
    interpretation,
    finding: finding ? Object.freeze({ ...finding }) : null
  });
}

class AssessmentFindingTemplate extends FindingTemplate {
  instantiate(context = {}) {
    const assessmentStage = this.evidence?.references?.[0];
    const assessed = context.values?.get(assessmentStage?.identity?.()) ?? {};
    return new Finding({
      code: assessed.finding?.code ?? this.code,
      status: assessed.finding?.status ?? this.status,
      evidence: assessed.evidence ?? [],
      message: assessed.finding?.message ?? this.message,
      circuit: context.circuit?.identity,
      interpretation: assessed.interpretation ?? null,
      details: assessed.details ?? {}
    });
  }
}

function assessmentFinding(status, code, stage, message = null) {
  return new AssessmentFindingTemplate(status, code, evidence(stage), message);
}

export function reviewDecisionTable(id, stage, outcomes) {
  const result = new PredicateCondition(
    "ReviewOutcome",
    { operand: stage },
    (context) => context.values?.get(stage.identity())?.outcome ?? UNKNOWN
  );
  return decisionTable(id)
    .add(
      row(
        when(result.isTrue()),
        assessmentFinding(outcomes.true.status, outcomes.true.code, stage, outcomes.true.message)
      ),
      row(
        when(result.isFalse()),
        assessmentFinding(outcomes.false.status, outcomes.false.code, stage, outcomes.false.message)
      ),
      row(
        when(result.isUnknown()),
        assessmentFinding(outcomes.unknown.status, outcomes.unknown.code, stage, outcomes.unknown.message)
      ),
      row(
        when(result.isConflict()),
        assessmentFinding(outcomes.conflict.status, outcomes.conflict.code, stage, outcomes.conflict.message)
      )
    )
    .exhaustive()
    .seal();
}
