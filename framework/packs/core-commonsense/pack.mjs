import { domainPack, ontologyModule, circuitModule, lexicalSignals, semanticSignals, capability, domainTier, lowerSecondary } from "../../sdk/ontology/packs.mjs";
import ontology0 from "./ontologies/entities.ontology.mjs";
import ontology1 from "./ontologies/space.ontology.mjs";
import ontology2 from "./ontologies/events.ontology.mjs";
import ontology3 from "./ontologies/agency.ontology.mjs";
import ontology4 from "./ontologies/continuity.ontology.mjs";
import ontology5 from "./ontologies/causality.ontology.mjs";
import consistencyCircuits from "./circuits/consistency.circuit.mjs";
import generationCircuits from "./circuits/generation.circuit.mjs";

export const ontologies = Object.freeze([ontology0, ontology1, ontology2, ontology3, ontology4, ontology5]);
export const circuits = Object.freeze([...consistencyCircuits, ...generationCircuits]);

export default domainPack("core-commonsense", "1.0.0")
  .ontology(...ontologies.map(ontologyModule))
  .circuit(...circuits.map(circuitModule))
  .recognize(lexicalSignals("move", "object", "location", "possess", "use", "access", "continuity"), semanticSignals("Agent", "Person", "GroupAgent", "PhysicalObject", "Substance"))
  .provide(
    capability("ObjectContinuityFinding"),
    capability("MissingTransitionFinding"),
    capability("ActionPreconditionFinding"),
    capability("KnowledgeContinuityFinding"),
    capability("CausalGapFinding"),
    capability("ImpossibleCoexistenceFinding"),
    capability("PossessionConflictFinding"),
    capability("EverydayPlanCircuit"),
    capability("ClarificationDemand")
  )
  .tier(domainTier()).knowledgeLevel(lowerSecondary()).seal();
