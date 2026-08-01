import {
  IntentFragment,
  abstractPreflight,
  allCompatible,
  cnlObservations,
  concern,
  concreteExecution,
  findings,
  generate,
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
  .outputs(findings(), cnlObservations())
  .whenUnclear(allCompatible())
  .provenance(...task.instructions)
  .seal();
