import { domainPack, ontologyModule, circuitModule, lexicalSignals, semanticSignals, capability, domainTier, lowerSecondary } from "../../sdk/ontology/packs.mjs";
import ontology0 from "./ontologies/culture-practice.ontology.mjs";
import ontology1 from "./ontologies/norm-ritual.ontology.mjs";
import ontology2 from "./ontologies/kinship-household.ontology.mjs";
import ontology3 from "./ontologies/subsistence-exchange.ontology.mjs";
import ontology4 from "./ontologies/material-culture.ontology.mjs";
import ontology5 from "./ontologies/identity-perspective.ontology.mjs";
import ontology6 from "./ontologies/evidence-change.ontology.mjs";
import consistencyCircuits from "./circuits/consistency.circuit.mjs";
import generationCircuits from "./circuits/generation.circuit.mjs";

export const ontologies = Object.freeze([ontology0, ontology1, ontology2, ontology3, ontology4, ontology5, ontology6]);
export const circuits = Object.freeze([...consistencyCircuits, ...generationCircuits]);

export default domainPack("anthropology-basic", "1.0.0")
  .ontology(...ontologies.map(ontologyModule))
  .circuit(...circuits.map(circuitModule))
  .recognize(lexicalSignals("culture", "ritual", "custom", "kinship", "community", "tradition", "identity", "ethnographic"), semanticSignals("CulturalGroup", "Community", "Population", "CulturalPractice", "Norm"))
  .provide(
    capability("CulturalOvergeneralizationFinding"),
    capability("ContextLossFinding"),
    capability("EmicEticConfusionFinding"),
    capability("KinshipProjectionFinding"),
    capability("NormPracticeConfusionFinding"),
    capability("EvidencePerspectiveFinding"),
    capability("CulturalChangeFinding"),
    capability("EthnographicExplanationPlan")
  )
  .tier(domainTier()).knowledgeLevel(lowerSecondary()).seal();
