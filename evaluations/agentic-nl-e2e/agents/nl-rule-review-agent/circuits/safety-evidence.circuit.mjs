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
  SafetyConclusion,
  SupportsSafetyConclusion,
  conclusion
} from "../ontologies/operational-policy.ontology.mjs";
import { evidence as evidenceRole } from "../../../../../framework/packs/core-language/ontologies/core.ontology.mjs";
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
  conclusion: "The safety conclusion must be source-grounded.",
  support: "A distinct source-grounded evidence link must support the safety conclusion.",
  distinct: "The safety conclusion itself must not be treated as its supporting evidence.",
  consistent: "The conclusion and its support must not be both asserted and denied.",
  coverage: "Safety-support coverage must be closed before absence is treated as a violation."
});

function supportTerms(store, safetyConclusion) {
  return termsOf(store, SupportsSafetyConclusion)
    .filter((support) => roleValues(store, support, conclusion)
      .some((candidate) => identityOf(candidate) === identityOf(safetyConclusion)));
}

function evaluateSafetyEvidence({ store }) {
  const conclusions = termsOf(store, SafetyConclusion);
  if (conclusions.length === 0) {
    return assessment(
      REVIEW_OUTCOMES.FALSE,
      [],
      requirementDetails({ conclusions: [] }),
      null,
      {
        code: "SAFETY_CONCLUSION_EVIDENCE_NOT_APPLICABLE",
        status: "NOT_APPLICABLE"
      }
    );
  }

  const results = [];
  for (const safetyConclusion of conclusions) {
    const conclusionClaims = groundedClaims(store, safetyConclusion);
    if (conclusionClaims.length === 0) {
      results.push({ safetyConclusion, outcome: REVIEW_OUTCOMES.UNKNOWN, supports: [], claims: [] });
      continue;
    }
    const deniedConclusionClaims = groundedClaims(store, safetyConclusion, "denied");
    const conclusionConflicts = conclusionClaims.flatMap((assertedClaim) => deniedConclusionClaims
      .filter((deniedClaim) => interpretationsCompatible(assertedClaim, deniedClaim)));
    if (conclusionConflicts.length > 0) {
      results.push({
        safetyConclusion,
        outcome: REVIEW_OUTCOMES.CONFLICT,
        supports: [],
        claims: [...conclusionClaims, ...conclusionConflicts]
      });
      continue;
    }
    if (deniedConclusionClaims.length > 0) {
      results.push({
        safetyConclusion,
        outcome: REVIEW_OUTCOMES.UNKNOWN,
        supports: [],
        claims: [...conclusionClaims, ...deniedConclusionClaims]
      });
      continue;
    }
    const supports = supportTerms(store, safetyConclusion);
    const assertedSupports = supports.flatMap((support) => groundedClaims(store, support)
      .filter((supportClaim) => conclusionClaims.some((claim) => interpretationsCompatible(claim, supportClaim)))
      .map((supportClaim) => ({ support, claim: supportClaim })));
    const deniedSupports = supports.flatMap((support) => groundedClaims(store, support, "denied")
      .filter((supportClaim) => conclusionClaims.some((claim) => interpretationsCompatible(claim, supportClaim)))
      .map((supportClaim) => ({ support, claim: supportClaim })));
    const conflictingSupports = assertedSupports.flatMap((assertedSupport) => deniedSupports
      .filter((deniedSupport) => identityOf(assertedSupport.support) === identityOf(deniedSupport.support)
        && interpretationsCompatible(assertedSupport.claim, deniedSupport.claim)));
    const stableAssertedSupports = assertedSupports.filter((assertedSupport) => !deniedSupports
      .some((deniedSupport) => identityOf(assertedSupport.support) === identityOf(deniedSupport.support)));
    if (conflictingSupports.length > 0) {
      results.push({
        safetyConclusion,
        outcome: REVIEW_OUTCOMES.CONFLICT,
        supports,
        claims: [
          ...conclusionClaims,
          ...assertedSupports.map(({ claim }) => claim),
          ...deniedSupports.map(({ claim }) => claim)
        ]
      });
    } else if (stableAssertedSupports.length > 0) {
      results.push({
        safetyConclusion,
        outcome: REVIEW_OUTCOMES.TRUE,
        supports: stableAssertedSupports.map(({ support }) => support),
        claims: [...conclusionClaims, ...stableAssertedSupports.map(({ claim }) => claim)]
      });
    } else if (assertedSupports.length > 0 && deniedSupports.length > 0) {
      results.push({
        safetyConclusion,
        outcome: REVIEW_OUTCOMES.UNKNOWN,
        supports,
        claims: [
          ...conclusionClaims,
          ...assertedSupports.map(({ claim }) => claim),
          ...deniedSupports.map(({ claim }) => claim)
        ]
      });
    } else if (hasClosedCoverage(store, SupportsSafetyConclusion, conclusionClaims)) {
      results.push({
        safetyConclusion,
        outcome: REVIEW_OUTCOMES.FALSE,
        supports: [],
        claims: conclusionClaims
      });
    } else {
      results.push({
        safetyConclusion,
        outcome: REVIEW_OUTCOMES.UNKNOWN,
        supports: [],
        claims: conclusionClaims
      });
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
  const supports = decisive.flatMap(({ supports: values }) => values);
  const supportEvidence = supports.flatMap((support) => roleValues(store, support, evidenceRole));
  const terms = [
    ...decisive.map(({ safetyConclusion }) => safetyConclusion),
    ...supports,
    ...supportEvidence
  ];
  const claims = decisive.flatMap(({ claims: resultClaims }) => resultClaims);
  const detailGroups = outcome === REVIEW_OUTCOMES.TRUE
    ? {
      satisfiedRequirements: [
        REQUIREMENTS.conclusion,
        REQUIREMENTS.support,
        REQUIREMENTS.distinct,
        REQUIREMENTS.consistent
      ]
    }
    : outcome === REVIEW_OUTCOMES.FALSE
      ? {
        failedRequirements: [REQUIREMENTS.support],
        satisfiedRequirements: [
          REQUIREMENTS.conclusion,
          REQUIREMENTS.distinct,
          REQUIREMENTS.coverage
        ]
      }
      : outcome === REVIEW_OUTCOMES.CONFLICT
        ? { conflictingRequirements: [REQUIREMENTS.consistent] }
        : {
          uncertainRequirements: claims.length > 0
            ? [REQUIREMENTS.support, REQUIREMENTS.coverage]
            : [REQUIREMENTS.conclusion, REQUIREMENTS.support],
          satisfiedRequirements: claims.length > 0
            ? [REQUIREMENTS.conclusion, REQUIREMENTS.distinct]
            : []
        };
  return assessment(
    outcome,
    evidenceFor(store, terms, claims),
    requirementDetails({
      checkedConclusions: conclusions.length,
      decisiveConclusions: decisive.map(({ safetyConclusion }) => identityOf(safetyConclusion)),
      supportLinks: supports.map(identityOf),
      supportingEvidence: supportEvidence.map(identityOf)
    }, detailGroups),
    commonInterpretation(claims)
  );
}

const assess = proceduralStage("nl-rule-review.safety-evidence.assess")
  .reads(SafetyConclusion, SupportsSafetyConclusion)
  .writes("SafetyEvidenceAssessment")
  .abstract(() => new Set(["SATISFIED", "VIOLATED", "UNKNOWN", "CONFLICT", "NOT_APPLICABLE"]))
  .run(evaluateSafetyEvidence);

const decide = reviewDecisionTable("nl-rule-review.safety-evidence.decide", assess, {
  true: {
    code: "SAFETY_CONCLUSION_SUPPORTED",
    status: "SATISFIED",
    message: "The stated safety conclusion has distinct source-grounded supporting evidence."
  },
  false: {
    code: "UNSUPPORTED_SAFETY_CONCLUSION",
    status: "VIOLATED",
    message: "The source states a safety conclusion but provides no distinct supporting evidence for it."
  },
  unknown: {
    code: "SAFETY_CONCLUSION_EVIDENCE_UNKNOWN",
    status: "UNKNOWN",
    message: "The available source evidence cannot determine whether the safety conclusion has distinct support."
  },
  conflict: {
    code: "SAFETY_CONCLUSION_EVIDENCE_CONFLICT",
    status: "CONFLICT",
    message: "Compatible source claims both assert and deny the safety conclusion or its supporting evidence."
  }
});

export default circuit("nl-rule-review.SafetyConclusionEvidenceReview", "1.0.0")
  .concern("safety-conclusion-evidence")
  .targets("short-operational-policy", "event-record")
  .requires(concept(SafetyConclusion), concept(SupportsSafetyConclusion))
  .provides(
    capability("SafetyConclusionEvidenceReview"),
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
