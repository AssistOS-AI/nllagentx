// Fluent IntentJS example.
import {
  intent, analyze, longDocument, explicitDomain, inferDomainsFromSource,
  concern, findings, cnlObservations, concreteExecution,
  abstractPreflight, symbolicWhereSupported, allCompatible
} from "../../framework/sdk/intent/intent.mjs";

export default intent("facility-task")
  .mode(analyze())
  .target(longDocument())
  .domains(explicitDomain("example.facility"), inferDomainsFromSource())
  .concerns(concern("event-order"), concern("contradiction"), concern("coverage"))
  .assurance(concreteExecution(), abstractPreflight(), symbolicWhereSupported())
  .outputs(findings(), cnlObservations())
  .whenUnclear(allCompatible())
  .seal();
