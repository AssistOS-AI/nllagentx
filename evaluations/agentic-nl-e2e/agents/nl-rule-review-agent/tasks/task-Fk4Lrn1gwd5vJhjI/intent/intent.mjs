import {
  IntentFragment,
  abstractPreflight,
  allCompatible,
  analyze,
  cnlObservations,
  concern,
  concreteExecution,
  findings,
  inferDomainsFromSource,
  intent,
  interpretationRobust,
  markdownCnl,
  sourceGrounded,
  symbolicDecisionCoverage
} from "../../../../../../../framework/sdk/intent/index.mjs";
import {
  countResultGroups,
  emitStableCnlTags,
  evidenceLed,
  explainMatchedRules,
  groupResultsBy,
  quoteSourceEvidence
} from "../../../../../../../framework/sdk/cnl/index.mjs";
import task from "../task.mjs";

export const shortOperationalPolicy = () => new IntentFragment(
  "short-operational-policy",
  "short-operational-policy"
);

export default intent(task.id)
  .mode(analyze())
  .target(shortOperationalPolicy())
  .domains(inferDomainsFromSource())
  .concerns(concern("SafetyConclusionEvidenceReview"))
  .evidence(sourceGrounded(), interpretationRobust())
  .assurance(
    concreteExecution(),
    abstractPreflight(),
    symbolicDecisionCoverage()
  )
  .outputs(findings(), cnlObservations(), markdownCnl())
  .present(
    evidenceLed(),
    groupResultsBy("status-family"),
    explainMatchedRules(),
    quoteSourceEvidence(),
    countResultGroups(),
    emitStableCnlTags()
  )
  .whenUnclear(allCompatible())
  .provenance(...task.instructions)
  .seal();
