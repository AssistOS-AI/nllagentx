import { domainPack, ontologyModule, circuitModule, lexicalSignals, semanticSignals, capability, domainTier, lowerSecondary } from "../../sdk/ontology/packs.mjs";
import ontology0 from "./ontologies/propositions.ontology.mjs";
import ontology1 from "./ontologies/predicates-terms.ontology.mjs";
import ontology2 from "./ontologies/quantifiers.ontology.mjs";
import ontology3 from "./ontologies/modality.ontology.mjs";
import ontology4 from "./ontologies/natural-logic.ontology.mjs";
import ontology5 from "./ontologies/proof-steps.ontology.mjs";
import ontology6 from "./ontologies/four-valued.ontology.mjs";
import consistencyCircuits from "./circuits/consistency.circuit.mjs";
import generationCircuits from "./circuits/generation.circuit.mjs";

export const ontologies = Object.freeze([ontology0, ontology1, ontology2, ontology3, ontology4, ontology5, ontology6]);
export const circuits = Object.freeze([...consistencyCircuits, ...generationCircuits]);

export default domainPack("logic-basic", "1.0.0")
  .ontology(...ontologies.map(ontologyModule))
  .circuit(...circuits.map(circuitModule))
  .recognize(lexicalSignals("all", "some", "none", "if", "then", "unless", "must", "possible", "contradiction"), semanticSignals("Proposition", "AtomicProposition", "CompoundProposition", "Predicate", "Term"))
  .provide(
    capability("DirectContradictionFinding"),
    capability("LocalEntailmentFinding"),
    capability("QuantifierScopeFinding"),
    capability("ModalConfusionFinding"),
    capability("EqualitySubstitutionFinding"),
    capability("ConsistencySetCircuit"),
    capability("ProofStepCircuit"),
    capability("LogicExplanationPlan")
  )
  .tier(domainTier()).knowledgeLevel(lowerSecondary()).seal();
