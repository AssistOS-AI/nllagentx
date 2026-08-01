import {
  IntentFragment,
  abstractPreflight,
  allCompatible,
  cnlObservations,
  compositionPlan,
  concern,
  concreteExecution,
  findings,
  generate,
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
  explainMatchedRules,
  groupResultsBy,
  procedural,
  quoteSourceEvidence
} from "../../../../../../../framework/sdk/cnl/index.mjs";
import task from "../task.mjs";

export const shortOperationalPolicy = () => new IntentFragment(
  "short-operational-policy",
  "short-operational-policy"
);

export default intent(task.id)
  .mode(generate())
  .target(shortOperationalPolicy())
  .domains(inferDomainsFromSource())
  .concerns(concern("OperationalProcedureGeneration"))
  .evidence(sourceGrounded(), interpretationRobust())
  .assurance(
    concreteExecution(),
    abstractPreflight(),
    symbolicDecisionCoverage()
  )
  .outputs(findings(), cnlObservations(), compositionPlan(), markdownCnl())
  .present(
    procedural(),
    groupResultsBy("status-family"),
    explainMatchedRules(),
    quoteSourceEvidence(),
    countResultGroups(),
    emitStableCnlTags()
  )
  .whenUnclear(allCompatible())
  .provenance(...task.instructions)
  .seal();
