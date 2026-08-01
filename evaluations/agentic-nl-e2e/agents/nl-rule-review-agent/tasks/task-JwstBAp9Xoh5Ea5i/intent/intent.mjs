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
  symbolicDecisionCoverage
} from "../../../../../../../framework/sdk/intent/index.mjs";
import task from "../task.mjs";

export const shortOperationalPolicy = () => new IntentFragment(
  "short-operational-policy",
  "short-operational-policy"
);

export default intent(task.id)
  .mode(analyze())
  .target(shortOperationalPolicy())
  .domains(inferDomainsFromSource())
  .concerns(concern("ExceptionJustificationReview"))
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
