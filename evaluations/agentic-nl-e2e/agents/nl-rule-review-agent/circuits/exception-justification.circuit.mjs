import {
  circuit,
  capability,
  concept,
  guarantee,
  proceduralStage,
  emitFinding,
  abstractPreflight,
  symbolicDecisionCoverage
} from "../../../../../framework/sdk/circuit/index.mjs";
import {
  EmergencyExceptionInvocation,
  ExceptionJustificationRequirement,
  JustificationRecord,
  action,
  invocation
} from "../ontologies/operational-policy.ontology.mjs";
import {
  REVIEW_OUTCOMES,
  assessment,
  commonInterpretation,
  evidenceFor,
  groundedClaims,
  hasClosedCoverage,
  identityOf,
  interpretationsCompatible,
  reviewDecisionTable,
  roleValues,
  termsOf
} from "./review-support.mjs";

function requirementApplies(store, requirement, exceptionUse) {
  const governedActions = roleValues(store, requirement, action);
  return governedActions.length === 0
    || governedActions.some((candidate) => identityOf(candidate) === identityOf(exceptionUse));
}

function linkedRecords(store, exceptionUse) {
  return termsOf(store, JustificationRecord)
    .filter((record) => roleValues(store, record, invocation)
      .some((candidate) => identityOf(candidate) === identityOf(exceptionUse)));
}

function evaluateExceptionJustification({ store }) {
  const invocations = termsOf(store, EmergencyExceptionInvocation);
  const requirements = termsOf(store, ExceptionJustificationRequirement);
  const structuralPairs = invocations.flatMap((exceptionUse) => requirements
    .filter((requirement) => requirementApplies(store, requirement, exceptionUse))
    .map((requirement) => ({ exceptionUse, requirement })));
  if (structuralPairs.length === 0) {
    return assessment(REVIEW_OUTCOMES.FALSE, evidenceFor(store, [...invocations, ...requirements]), {
      invocations: invocations.map(identityOf),
      requirements: requirements.map(identityOf)
    }, null, {
      code: "EXCEPTION_JUSTIFICATION_NOT_APPLICABLE",
      status: "NOT_APPLICABLE"
    });
  }

  const results = [];
  for (const pair of structuralPairs) {
    const invocationClaims = groundedClaims(store, pair.exceptionUse);
    const requirementClaims = groundedClaims(store, pair.requirement);
    const claimPairs = invocationClaims.flatMap((invocationClaim) => requirementClaims
      .filter((requirementClaim) => interpretationsCompatible(invocationClaim, requirementClaim))
      .map((requirementClaim) => [invocationClaim, requirementClaim]));
    if (claimPairs.length === 0) {
      results.push({ ...pair, outcome: REVIEW_OUTCOMES.UNKNOWN, claims: [] });
      continue;
    }

    const pairClaims = claimPairs.flat();
    const deniedInvocationClaims = groundedClaims(store, pair.exceptionUse, "denied");
    const deniedRequirementClaims = groundedClaims(store, pair.requirement, "denied");
    const subjectConflicts = [
      ...invocationClaims.flatMap((assertedClaim) => deniedInvocationClaims
        .filter((deniedClaim) => interpretationsCompatible(assertedClaim, deniedClaim))),
      ...requirementClaims.flatMap((assertedClaim) => deniedRequirementClaims
        .filter((deniedClaim) => interpretationsCompatible(assertedClaim, deniedClaim)))
    ];
    if (subjectConflicts.length > 0) {
      results.push({
        ...pair,
        outcome: REVIEW_OUTCOMES.CONFLICT,
        records: [],
        claims: [...pairClaims, ...subjectConflicts]
      });
      continue;
    }
    if (deniedInvocationClaims.length > 0 || deniedRequirementClaims.length > 0) {
      results.push({
        ...pair,
        outcome: REVIEW_OUTCOMES.UNKNOWN,
        records: [],
        claims: [
          ...pairClaims,
          ...deniedInvocationClaims,
          ...deniedRequirementClaims
        ]
      });
      continue;
    }

    const records = linkedRecords(store, pair.exceptionUse);
    const assertedRecords = records.flatMap((record) => groundedClaims(store, record)
      .filter((recordClaim) => pairClaims.some((claim) => interpretationsCompatible(claim, recordClaim)))
      .map((recordClaim) => ({ record, claim: recordClaim })));
    const deniedRecords = records.flatMap((record) => groundedClaims(store, record, "denied")
      .filter((recordClaim) => pairClaims.some((claim) => interpretationsCompatible(claim, recordClaim)))
      .map((recordClaim) => ({ record, claim: recordClaim })));
    const conflictingRecords = assertedRecords.flatMap((assertedRecord) => deniedRecords
      .filter((deniedRecord) => identityOf(assertedRecord.record) === identityOf(deniedRecord.record)
        && interpretationsCompatible(assertedRecord.claim, deniedRecord.claim)));
    const stableAssertedRecords = assertedRecords.filter((assertedRecord) => !deniedRecords
      .some((deniedRecord) => identityOf(assertedRecord.record) === identityOf(deniedRecord.record)));
    if (conflictingRecords.length > 0) {
      results.push({
        ...pair,
        outcome: REVIEW_OUTCOMES.CONFLICT,
        records,
        claims: [
          ...pairClaims,
          ...assertedRecords.map(({ claim }) => claim),
          ...deniedRecords.map(({ claim }) => claim)
        ]
      });
    } else if (stableAssertedRecords.length > 0) {
      results.push({
        ...pair,
        outcome: REVIEW_OUTCOMES.TRUE,
        records: stableAssertedRecords.map(({ record }) => record),
        claims: [...pairClaims, ...stableAssertedRecords.map(({ claim }) => claim)]
      });
    } else if (assertedRecords.length > 0 && deniedRecords.length > 0) {
      results.push({
        ...pair,
        outcome: REVIEW_OUTCOMES.UNKNOWN,
        records,
        claims: [
          ...pairClaims,
          ...assertedRecords.map(({ claim }) => claim),
          ...deniedRecords.map(({ claim }) => claim)
        ]
      });
    } else if (hasClosedCoverage(store, JustificationRecord, pairClaims)) {
      results.push({ ...pair, outcome: REVIEW_OUTCOMES.FALSE, records: [], claims: pairClaims });
    } else {
      results.push({ ...pair, outcome: REVIEW_OUTCOMES.UNKNOWN, records: [], claims: pairClaims });
    }
  }

  const outcome = results.some((result) => result.outcome === REVIEW_OUTCOMES.CONFLICT)
    ? REVIEW_OUTCOMES.CONFLICT
    : results.some((result) => result.outcome === REVIEW_OUTCOMES.FALSE)
      ? REVIEW_OUTCOMES.FALSE
      : results.some((result) => result.outcome === REVIEW_OUTCOMES.UNKNOWN)
        ? REVIEW_OUTCOMES.UNKNOWN
        : REVIEW_OUTCOMES.TRUE;
  const decisive = results.filter((result) => result.outcome === outcome);
  const terms = decisive.flatMap(({ exceptionUse, requirement, records = [] }) => [
    exceptionUse,
    requirement,
    ...records
  ]);
  const claims = decisive.flatMap(({ claims: resultClaims }) => resultClaims);
  return assessment(
    outcome,
    evidenceFor(store, terms, claims),
    {
      checkedInvocations: structuralPairs.length,
      decisiveInvocations: decisive.map(({ exceptionUse }) => identityOf(exceptionUse)),
      justificationRecords: decisive.flatMap(({ records = [] }) => records.map(identityOf))
    },
    commonInterpretation(claims)
  );
}

const assess = proceduralStage("nl-rule-review.exception-justification.assess")
  .reads(EmergencyExceptionInvocation, ExceptionJustificationRequirement, JustificationRecord)
  .writes("ExceptionJustificationAssessment")
  .abstract(() => new Set(["SATISFIED", "VIOLATED", "UNKNOWN", "CONFLICT", "NOT_APPLICABLE"]))
  .run(evaluateExceptionJustification);

const decide = reviewDecisionTable("nl-rule-review.exception-justification.decide", assess, {
  true: { code: "EXCEPTION_JUSTIFICATION_PRESENT", status: "SATISFIED" },
  false: { code: "MISSING_EXCEPTION_JUSTIFICATION", status: "VIOLATED" },
  unknown: { code: "EXCEPTION_JUSTIFICATION_UNKNOWN", status: "UNKNOWN" },
  conflict: { code: "EXCEPTION_JUSTIFICATION_CONFLICT", status: "CONFLICT" }
});

export default circuit("nl-rule-review.ExceptionJustificationReview", "1.0.0")
  .concern("emergency-exception-justification")
  .targets("short-operational-policy", "event-record")
  .requires(
    concept(EmergencyExceptionInvocation),
    concept(ExceptionJustificationRequirement),
    concept(JustificationRecord)
  )
  .provides(
    capability("ExceptionJustificationReview"),
    guarantee("evidence-bearing"),
    guarantee("coverage-aware"),
    guarantee("interpretation-aware")
  )
  .use(assess)
  .use(decide)
  .emit(emitFinding(decide))
  .statuses("SATISFIED", "VIOLATED", "UNKNOWN", "CONFLICT", "NOT_APPLICABLE")
  .assurance(abstractPreflight(), symbolicDecisionCoverage())
  .seal();
