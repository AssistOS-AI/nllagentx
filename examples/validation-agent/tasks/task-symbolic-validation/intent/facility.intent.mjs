import {
  intent, analyze, explicitDomain, concern, findings, cnlObservations,
  concreteExecution, abstractPreflight, symbolicDecisionCoverage, allCompatible
} from "../../../../../framework/sdk/intent/intent.mjs";

export default intent("facility-order-validation")
  .mode(analyze())
  .domains(explicitDomain("facility"))
  .concerns(concern("FacilityOrderFinding"))
  .assurance(concreteExecution(), abstractPreflight(), symbolicDecisionCoverage())
  .outputs(findings(), cnlObservations())
  .whenUnclear(allCompatible())
  .seal();
