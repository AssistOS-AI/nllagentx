import { domainPack, ontologyModule, circuitModule, lexicalSignals, semanticSignals, capability, domainTier, lowerSecondary } from "../../sdk/ontology/packs.mjs";
import ontology0 from "./ontologies/organization.ontology.mjs";
import ontology1 from "./ontologies/cell-biology.ontology.mjs";
import ontology2 from "./ontologies/organisms-systems.ontology.mjs";
import ontology3 from "./ontologies/reproduction-inheritance.ontology.mjs";
import ontology4 from "./ontologies/ecology.ontology.mjs";
import ontology5 from "./ontologies/evolution-adaptation.ontology.mjs";
import ontology6 from "./ontologies/health-experiment.ontology.mjs";
import consistencyCircuits from "./circuits/consistency.circuit.mjs";
import generationCircuits from "./circuits/generation.circuit.mjs";

export const ontologies = Object.freeze([ontology0, ontology1, ontology2, ontology3, ontology4, ontology5, ontology6]);
export const circuits = Object.freeze([...consistencyCircuits, ...generationCircuits]);

export default domainPack("biology-basic", "1.0.0")
  .ontology(...ontologies.map(ontologyModule))
  .circuit(...circuits.map(circuitModule))
  .recognize(lexicalSignals("cell", "organ", "organism", "species", "ecosystem", "gene", "trait", "evolution"), semanticSignals("BiologicalEntity", "LevelOfOrganization", "Molecule", "Organelle", "Cell"))
  .provide(
    capability("BiologicalLevelFinding"),
    capability("StructureFunctionFinding"),
    capability("LifecycleFinding"),
    capability("InheritanceFinding"),
    capability("EcologyRelationFinding"),
    capability("EvolutionReasoningFinding"),
    capability("EvidenceGeneralizationFinding"),
    capability("BiologyExplanationPlan")
  )
  .tier(domainTier()).knowledgeLevel(lowerSecondary()).seal();
