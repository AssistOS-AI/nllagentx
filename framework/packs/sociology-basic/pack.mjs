import { domainPack, ontologyModule, circuitModule, lexicalSignals, semanticSignals, capability, domainTier, lowerSecondary } from "../../sdk/ontology/packs.mjs";
import ontology0 from "./ontologies/actors-groups.ontology.mjs";
import ontology1 from "./ontologies/roles-norms.ontology.mjs";
import ontology2 from "./ontologies/institutions.ontology.mjs";
import ontology3 from "./ontologies/networks.ontology.mjs";
import ontology4 from "./ontologies/power-resources.ontology.mjs";
import ontology5 from "./ontologies/inequality-demography.ontology.mjs";
import ontology6 from "./ontologies/collective-process.ontology.mjs";
import consistencyCircuits from "./circuits/consistency.circuit.mjs";
import generationCircuits from "./circuits/generation.circuit.mjs";

export const ontologies = Object.freeze([ontology0, ontology1, ontology2, ontology3, ontology4, ontology5, ontology6]);
export const circuits = Object.freeze([...consistencyCircuits, ...generationCircuits]);

export default domainPack("sociology-basic", "1.0.0")
  .ontology(...ontologies.map(ontologyModule))
  .circuit(...circuits.map(circuitModule))
  .recognize(lexicalSignals("group", "institution", "organization", "population", "norm", "power", "network", "survey"), semanticSignals("IndividualActor", "Group", "Organization", "Institution", "Population"))
  .provide(
    capability("LevelOfAnalysisFinding"),
    capability("EcologicalFallacyFinding"),
    capability("IndividualisticFallacyFinding"),
    capability("RoleInstitutionFinding"),
    capability("NetworkPathFinding"),
    capability("CorrelationCausationFinding"),
    capability("PopulationScopeFinding"),
    capability("SocialExplanationPlan")
  )
  .tier(domainTier()).knowledgeLevel(lowerSecondary()).seal();
