import { domainPack, ontologyModule, circuitModule, lexicalSignals, semanticSignals, capability, domainTier, lowerSecondary } from "../../sdk/ontology/packs.mjs";
import ontology0 from "./ontologies/speech-acts.ontology.mjs";
import ontology1 from "./ontologies/consent-boundaries.ontology.mjs";
import ontology2 from "./ontologies/cooperation.ontology.mjs";
import ontology3 from "./ontologies/conflict.ontology.mjs";
import ontology4 from "./ontologies/roles-power.ontology.mjs";
import ontology5 from "./ontologies/fairness.ontology.mjs";
import ontology6 from "./ontologies/communication-quality.ontology.mjs";
import consistencyCircuits from "./circuits/consistency.circuit.mjs";
import generationCircuits from "./circuits/generation.circuit.mjs";

export const ontologies = Object.freeze([ontology0, ontology1, ontology2, ontology3, ontology4, ontology5, ontology6]);
export const circuits = Object.freeze([...consistencyCircuits, ...generationCircuits]);

export default domainPack("social-interaction", "1.0.0")
  .ontology(...ontologies.map(ontologyModule))
  .circuit(...circuits.map(circuitModule))
  .recognize(lexicalSignals("request", "promise", "consent", "apology", "conflict", "privacy", "fairness", "dialogue"), semanticSignals("Interaction", "SpeechAct", "Conversation", "Request", "Order"))
  .provide(
    capability("SpeechActClassificationFinding"),
    capability("PromiseClosureFinding"),
    capability("ConsentStructureFinding"),
    capability("BoundaryConflictFinding"),
    capability("PrivacyDisclosureFinding"),
    capability("CooperationContributionFinding"),
    capability("ConflictEscalationFinding"),
    capability("FairnessReasoningFinding"),
    capability("SocialAttributionWarning"),
    capability("DialogueAndInteractionPlan")
  )
  .tier(domainTier()).knowledgeLevel(lowerSecondary()).seal();
