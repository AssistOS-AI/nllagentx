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
  symbolicDecisionCoverage,
  taskScope
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

export const coldChainTransferPolicy = () => new IntentFragment(
  "cold-chain-transfer-policy",
  "cold-chain-transfer-policy"
);

export default intent(task.id)
  .mode(analyze())
  .target(coldChainTransferPolicy())
  .domains(inferDomainsFromSource())
  .concerns(concern("ColdChainTransferReleaseSupport"))
  .scope(taskScope("entire-source-set"))
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
