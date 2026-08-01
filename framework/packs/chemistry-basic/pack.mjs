import { domainPack, ontologyModule, circuitModule, lexicalSignals, semanticSignals, capability, domainTier, lowerSecondary } from "../../sdk/ontology/packs.mjs";
import ontology0 from "./ontologies/matter-substances.ontology.mjs";
import ontology1 from "./ontologies/particles.ontology.mjs";
import ontology2 from "./ontologies/formulae.ontology.mjs";
import ontology3 from "./ontologies/reactions.ontology.mjs";
import ontology4 from "./ontologies/states-solutions.ontology.mjs";
import ontology5 from "./ontologies/acids-bases.ontology.mjs";
import ontology6 from "./ontologies/laboratory-description.ontology.mjs";
import consistencyCircuits from "./circuits/consistency.circuit.mjs";
import generationCircuits from "./circuits/generation.circuit.mjs";

export const ontologies = Object.freeze([ontology0, ontology1, ontology2, ontology3, ontology4, ontology5, ontology6]);
export const circuits = Object.freeze([...consistencyCircuits, ...generationCircuits]);

export default domainPack("chemistry-basic", "1.0.0")
  .ontology(...ontologies.map(ontologyModule))
  .circuit(...circuits.map(circuitModule))
  .recognize(lexicalSignals("reaction", "compound", "mixture", "atom", "molecule", "pH", "solution", "laboratory"), semanticSignals("MaterialSample", "PureSubstance", "Element", "Compound", "Mixture"))
  .provide(
    capability("ChemicalCategoryFinding"),
    capability("FormulaCompositionFinding"),
    capability("ReactionBalanceFinding"),
    capability("PhysicalChemicalChangeFinding"),
    capability("SolutionRelationFinding"),
    capability("AcidBaseFinding"),
    capability("LaboratorySequenceFinding"),
    capability("ChemistryExplanationPlan")
  )
  .tier(domainTier()).knowledgeLevel(lowerSecondary()).seal();
