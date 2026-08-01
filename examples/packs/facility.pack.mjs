// Fluent pack descriptor example. The ontology and circuit modules remain the semantic implementation.
import {
  domainPack, ontologyModule, circuitModule, lexicalSignals,
  semanticSignals, capability, baselineTier, lowerSecondary
} from "../../framework/sdk/ontology/packs.mjs";
import facilityOntology from "../ontologies/facility.ontology.mjs";
import facilityOrder from "../circuits/facility-order.circuit.mjs";

export default domainPack("example.facility", "1.0.0")
  .ontology(ontologyModule(facilityOntology))
  .circuit(circuitModule(facilityOrder))
  .recognize(
    lexicalSignals("alarm", "gate", "open", "building"),
    semanticSignals("AlarmEvent", "OpeningEvent")
  )
  .provide(capability("FacilityOrderFinding"))
  .tier(baselineTier())
  .knowledgeLevel(lowerSecondary())
  .seal();
