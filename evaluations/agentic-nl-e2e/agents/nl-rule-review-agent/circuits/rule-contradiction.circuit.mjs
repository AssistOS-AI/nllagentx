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
  OperationalRule,
  action,
  condition,
  effect
} from "../ontologies/operational-policy.ontology.mjs";
import { value } from "../../../../../framework/packs/core-language/ontologies/core.ontology.mjs";
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

function effectName(store, rule) {
  const effectTerm = roleValues(store, rule, effect)[0];
  return effectTerm ? roleValues(store, effectTerm, value)[0]?.value?.() ?? null : null;
}

function comparable(store, left, right) {
  return identityOf(roleValues(store, left, action)[0]) === identityOf(roleValues(store, right, action)[0])
    && identityOf(roleValues(store, left, condition)[0])
      === identityOf(roleValues(store, right, condition)[0]);
}

function incompatibleEffects(left, right) {
  return (left === "required" && right === "forbidden")
    || (left === "forbidden" && right === "required");
}

function evaluateRuleConsistency({ store }) {
  const rules = termsOf(store, OperationalRule);
  const pairs = [];
  for (let leftIndex = 0; leftIndex < rules.length; leftIndex += 1) {
    for (let rightIndex = leftIndex + 1; rightIndex < rules.length; rightIndex += 1) {
      if (comparable(store, rules[leftIndex], rules[rightIndex])) {
        pairs.push([rules[leftIndex], rules[rightIndex]]);
      }
    }
  }
  if (pairs.length === 0) {
    return assessment(REVIEW_OUTCOMES.FALSE, evidenceFor(store, rules), {
      comparablePairs: 0,
      rules: rules.map(identityOf)
    });
  }

  const groundedPairs = [];
  const conflicts = [];
  for (const [left, right] of pairs) {
    const leftClaims = groundedClaims(store, left);
    const rightClaims = groundedClaims(store, right);
    const leftDeniedClaims = groundedClaims(store, left, "denied");
    const rightDeniedClaims = groundedClaims(store, right, "denied");
    if (leftDeniedClaims.length > 0 || rightDeniedClaims.length > 0) continue;
    const compatibleClaimPairs = leftClaims.flatMap((leftClaim) => rightClaims
      .filter((rightClaim) => interpretationsCompatible(leftClaim, rightClaim))
      .map((rightClaim) => [leftClaim, rightClaim]));
    if (compatibleClaimPairs.length === 0) continue;
    groundedPairs.push({ left, right, claims: compatibleClaimPairs.flat() });
    if (incompatibleEffects(effectName(store, left), effectName(store, right))) {
      conflicts.push({ left, right, claims: compatibleClaimPairs.flat() });
    }
  }

  if (conflicts.length > 0) {
    const conflictTerms = conflicts.flatMap(({ left, right }) => [left, right]);
    const conflictClaims = conflicts.flatMap(({ claims }) => claims);
    return assessment(
      REVIEW_OUTCOMES.CONFLICT,
      evidenceFor(store, conflictTerms, conflictClaims),
      {
        conflictPairs: conflicts.map(({ left, right }) => [identityOf(left), identityOf(right)]),
        comparablePairs: pairs.length
      },
      commonInterpretation(conflictClaims)
    );
  }

  const groundedTerms = groundedPairs.flatMap(({ left, right }) => [left, right]);
  const groundedPairClaims = groundedPairs.flatMap(({ claims }) => claims);
  const groundedEvidence = evidenceFor(
    store,
    groundedTerms.length ? groundedTerms : rules,
    groundedPairClaims
  );
  if (groundedPairs.length !== pairs.length
    || !hasClosedCoverage(store, OperationalRule, groundedPairClaims)) {
    return assessment(REVIEW_OUTCOMES.UNKNOWN, groundedEvidence, {
      comparablePairs: pairs.length,
      groundedComparablePairs: groundedPairs.length,
      reason: groundedPairs.length !== pairs.length ? "missing-grounding" : "open-rule-coverage"
    });
  }
  return assessment(REVIEW_OUTCOMES.TRUE, groundedEvidence, {
    comparablePairs: pairs.length,
    conflictPairs: []
  });
}

const assess = proceduralStage("nl-rule-review.rule-contradiction.assess")
  .reads(OperationalRule)
  .writes("RuleContradictionAssessment")
  .abstract(() => new Set(["SATISFIED", "UNKNOWN", "CONFLICT", "NOT_APPLICABLE"]))
  .run(evaluateRuleConsistency);

const decide = reviewDecisionTable("nl-rule-review.rule-contradiction.decide", assess, {
  true: { code: "RULES_COMPATIBLE", status: "SATISFIED" },
  false: { code: "RULE_CONTRADICTION_NOT_APPLICABLE", status: "NOT_APPLICABLE" },
  unknown: { code: "RULE_CONTRADICTION_UNKNOWN", status: "UNKNOWN" },
  conflict: { code: "RULE_CONTRADICTION", status: "CONFLICT" }
});

export default circuit("nl-rule-review.RuleContradictionReview", "1.0.0")
  .concern("incompatible-rule-effects")
  .targets("short-operational-policy", "event-record")
  .requires(concept(OperationalRule))
  .provides(
    capability("RuleContradictionReview"),
    guarantee("evidence-bearing"),
    guarantee("interpretation-aware")
  )
  .use(assess)
  .use(decide)
  .emit(emitFinding(decide))
  .statuses("SATISFIED", "UNKNOWN", "CONFLICT", "NOT_APPLICABLE")
  .assurance(abstractPreflight(), symbolicDecisionCoverage())
  .seal();
