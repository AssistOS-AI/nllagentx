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
  requirementDetails,
  reviewDecisionTable,
  roleValues,
  termsOf
} from "./review-support.mjs";

const REQUIREMENTS = Object.freeze({
  invocation: "An emergency exception invocation must be source-grounded.",
  policy: "An applicable policy requires a justification record for the invocation.",
  record: "A source-grounded justification record must link to the invocation.",
  consistent: "The invocation, requirement, and linked record must not be both asserted and denied.",
  coverage: "Justification-record coverage must be closed before absence is treated as a violation."
});

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
    return assessment(
      REVIEW_OUTCOMES.FALSE,
      evidenceFor(store, [...invocations, ...requirements]),
      requirementDetails({
        invocations: invocations.map(identityOf),
        requirements: requirements.map(identityOf)
      }),
      null,
      {
        code: "EXCEPTION_JUSTIFICATION_NOT_APPLICABLE",
        status: "NOT_APPLICABLE"
      }
    );
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
      results.push({
        ...pair,
        outcome: REVIEW_OUTCOMES.FALSE,
        records: [],
        claims: [...pairClaims, ...deniedRecords.map(({ claim }) => claim)]
      });
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
  const detailGroups = outcome === REVIEW_OUTCOMES.TRUE
    ? {
      satisfiedRequirements: [
        REQUIREMENTS.invocation,
        REQUIREMENTS.policy,
        REQUIREMENTS.record,
        REQUIREMENTS.consistent
      ]
    }
    : outcome === REVIEW_OUTCOMES.FALSE
      ? {
        failedRequirements: [REQUIREMENTS.record],
        satisfiedRequirements: [REQUIREMENTS.invocation, REQUIREMENTS.policy, REQUIREMENTS.coverage]
      }
      : outcome === REVIEW_OUTCOMES.CONFLICT
        ? { conflictingRequirements: [REQUIREMENTS.consistent] }
        : {
          uncertainRequirements: claims.length > 0
            ? [REQUIREMENTS.record, REQUIREMENTS.coverage]
            : [REQUIREMENTS.invocation, REQUIREMENTS.policy, REQUIREMENTS.record],
          satisfiedRequirements: claims.length > 0
            ? [REQUIREMENTS.invocation, REQUIREMENTS.policy]
            : []
        };
  return assessment(
    outcome,
    evidenceFor(store, terms, claims),
    requirementDetails({
      checkedInvocations: structuralPairs.length,
      decisiveInvocations: decisive.map(({ exceptionUse }) => identityOf(exceptionUse)),
      justificationRecords: decisive.flatMap(({ records = [] }) => records.map(identityOf))
    }, detailGroups),
    commonInterpretation(claims)
  );
}

const assess = proceduralStage("nl-rule-review.exception-justification.assess")
  .reads(EmergencyExceptionInvocation, ExceptionJustificationRequirement, JustificationRecord)
  .writes("ExceptionJustificationAssessment")
  .abstract(() => new Set(["SATISFIED", "VIOLATED", "UNKNOWN", "CONFLICT", "NOT_APPLICABLE"]))
  .run(evaluateExceptionJustification);

const decide = reviewDecisionTable("nl-rule-review.exception-justification.decide", assess, {
  true: {
    code: "EXCEPTION_JUSTIFICATION_PRESENT",
    status: "SATISFIED",
    message: "Every reviewed emergency exception invocation has a linked source-grounded justification record."
  },
  false: {
    code: "MISSING_EXCEPTION_JUSTIFICATION",
    status: "VIOLATED",
    message: "A recorded emergency exception invocation lacks the justification record " +
      "required by the applicable policy."
  },
  unknown: {
    code: "EXCEPTION_JUSTIFICATION_UNKNOWN",
    status: "UNKNOWN",
    message: "The available source evidence cannot determine whether every emergency exception " +
      "invocation has its required justification record."
  },
  conflict: {
    code: "EXCEPTION_JUSTIFICATION_CONFLICT",
    status: "CONFLICT",
    message: "Compatible source claims disagree about the emergency exception, " +
      "its justification requirement, or its linked record."
  }
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
