import { domainPack, ontologyModule, circuitModule, lexicalSignals, semanticSignals, capability, domainTier, lowerSecondary } from "../../sdk/ontology/packs.mjs";
import ontology0 from "./ontologies/perception-knowledge.ontology.mjs";
import ontology1 from "./ontologies/memory.ontology.mjs";
import ontology2 from "./ontologies/goals-intentions.ontology.mjs";
import ontology3 from "./ontologies/emotion.ontology.mjs";
import ontology4 from "./ontologies/motivation.ontology.mjs";
import ontology5 from "./ontologies/perspective.ontology.mjs";
import ontology6 from "./ontologies/interaction.ontology.mjs";
import consistencyCircuits from "./circuits/consistency.circuit.mjs";
import generationCircuits from "./circuits/generation.circuit.mjs";

export const ontologies = Object.freeze([ontology0, ontology1, ontology2, ontology3, ontology4, ontology5, ontology6]);
export const circuits = Object.freeze([...consistencyCircuits, ...generationCircuits]);

export default domainPack("psychology-basic", "1.0.0")
  .ontology(...ontologies.map(ontologyModule))
  .circuit(...circuits.map(circuitModule))
  .recognize(lexicalSignals("believe", "know", "remember", "goal", "intend", "emotion", "motivation", "perspective"), semanticSignals("MentalAgent", "Perspective", "MentalContext", "Perception", "Belief"))
  .provide(
    capability("KnowledgeAccessFinding"),
    capability("MotivationContinuityFinding"),
    capability("EmotionTransitionFinding"),
    capability("BeliefActionConsistencyFinding"),
    capability("PerspectiveAttributionFinding"),
    capability("MindReadingWarning"),
    capability("GoalConflictCircuit"),
    capability("CharacterArcPlan")
  )
  .tier(domainTier()).knowledgeLevel(lowerSecondary()).seal();
