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
  sourceGrounded,
  symbolicDecisionCoverage,
  taskScope
} from "../../../../../../../framework/sdk/intent/index.mjs";
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
  .outputs(findings(), cnlObservations())
  .whenUnclear(allCompatible())
  .provenance(...task.instructions)
  .seal();
