import { domainPack, ontologyModule, circuitModule, lexicalSignals, semanticSignals, capability, coreTier, lowerSecondary } from "../../sdk/ontology/packs.mjs";
import ontology from "./ontologies/core.ontology.mjs";
import coreConsistency from "./circuits/core-consistency.circuit.mjs";

export default domainPack("core-language", "1.0.0")
  .ontology(ontologyModule(ontology))
  .circuit(circuitModule(coreConsistency))
  .recognize(lexicalSignals("is", "has", "does", "must", "may"), semanticSignals("Claim", "Event", "State"))
  .provide(capability("CoreSemanticIntegrity"))
  .tier(coreTier()).knowledgeLevel(lowerSecondary()).seal();
