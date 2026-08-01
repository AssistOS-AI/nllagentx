import { domainPack, ontologyModule, circuitModule, lexicalSignals, semanticSignals, capability, domainTier, lowerSecondary } from "../../sdk/ontology/packs.mjs";
import ontology0 from "./ontologies/argument-structure.ontology.mjs";
import ontology1 from "./ontologies/definition-use.ontology.mjs";
import ontology2 from "./ontologies/evidence-authority.ontology.mjs";
import ontology3 from "./ontologies/causality.ontology.mjs";
import ontology4 from "./ontologies/generalization.ontology.mjs";
import ontology5 from "./ontologies/dialogue.ontology.mjs";
import ontology6 from "./ontologies/error-patterns.ontology.mjs";
import consistencyCircuits from "./circuits/consistency.circuit.mjs";
import generationCircuits from "./circuits/generation.circuit.mjs";

export const ontologies = Object.freeze([ontology0, ontology1, ontology2, ontology3, ontology4, ontology5, ontology6]);
export const circuits = Object.freeze([...consistencyCircuits, ...generationCircuits]);

export default domainPack("reasoning-errors", "1.0.0")
  .ontology(...ontologies.map(ontologyModule))
  .circuit(...circuits.map(circuitModule))
  .recognize(lexicalSignals("therefore", "because", "proves", "always", "only", "everyone", "obviously", "fallacy"), semanticSignals("Argument", "Premise", "Conclusion", "Inference", "EvidenceRelation"))
  .provide(
    capability("ContradictionClassifier"),
    capability("AffirmingConsequentFinding"),
    capability("DenyingAntecedentFinding"),
    capability("CircularReasoningFinding"),
    capability("EquivocationFinding"),
    capability("FalseDilemmaFinding"),
    capability("HastyGeneralizationFinding"),
    capability("CorrelationCausationFinding"),
    capability("AdHominemFinding"),
    capability("AppealToAuthorityFinding"),
    capability("StrawManFinding"),
    capability("SlipperySlopeFinding"),
    capability("CompositionDivisionFinding"),
    capability("BaseRateAndSelectionWarning"),
    capability("ArgumentRepairPlan")
  )
  .tier(domainTier()).knowledgeLevel(lowerSecondary()).seal();
