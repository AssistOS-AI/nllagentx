import { domainPack, ontologyModule, circuitModule, lexicalSignals, semanticSignals, capability, domainTier, lowerSecondary } from "../../sdk/ontology/packs.mjs";
import ontology0 from "./ontologies/motion.ontology.mjs";
import ontology1 from "./ontologies/forces.ontology.mjs";
import ontology2 from "./ontologies/energy.ontology.mjs";
import ontology3 from "./ontologies/thermal.ontology.mjs";
import ontology4 from "./ontologies/waves.ontology.mjs";
import ontology5 from "./ontologies/electricity-magnetism.ontology.mjs";
import ontology6 from "./ontologies/models-units.ontology.mjs";
import consistencyCircuits from "./circuits/consistency.circuit.mjs";
import generationCircuits from "./circuits/generation.circuit.mjs";

export const ontologies = Object.freeze([ontology0, ontology1, ontology2, ontology3, ontology4, ontology5, ontology6]);
export const circuits = Object.freeze([...consistencyCircuits, ...generationCircuits]);

export default domainPack("physics-basic", "1.0.0")
  .ontology(...ontologies.map(ontologyModule))
  .circuit(...circuits.map(circuitModule))
  .recognize(lexicalSignals("force", "mass", "speed", "energy", "temperature", "wave", "voltage", "resistance"), semanticSignals("PhysicalSystem", "PhysicalBody", "ParticleCollection", "Position", "MotionState"))
  .provide(
    capability("DimensionAndUnitFinding"),
    capability("KinematicsFinding"),
    capability("ForceBalanceFinding"),
    capability("EnergyAccountingFinding"),
    capability("ThermalDirectionFinding"),
    capability("WaveRelationFinding"),
    capability("SimpleCircuitFinding"),
    capability("ModelAssumptionFinding"),
    capability("PhysicsExplanationPlan")
  )
  .tier(domainTier()).knowledgeLevel(lowerSecondary()).seal();
