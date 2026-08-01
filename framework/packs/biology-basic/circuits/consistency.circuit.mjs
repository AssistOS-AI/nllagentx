import { createCheckCircuit } from "../../shared/check-runtime.mjs";

export const BiologicalLevelFinding = createCheckCircuit("biology-basic", "BiologicalLevelFinding", ["biology-basic.organization:LevelOfOrganization"]);
export const StructureFunctionFinding = createCheckCircuit("biology-basic", "StructureFunctionFinding", ["biology-basic.cell-biology:Cell"]);
export const LifecycleFinding = createCheckCircuit("biology-basic", "LifecycleFinding", ["biology-basic.reproduction-inheritance:LifecycleStage"]);
export const InheritanceFinding = createCheckCircuit("biology-basic", "InheritanceFinding", ["biology-basic.reproduction-inheritance:InheritedVariant"]);
export const EcologyRelationFinding = createCheckCircuit("biology-basic", "EcologyRelationFinding", ["biology-basic.ecology:EcologicalInteraction"]);
export const EvolutionReasoningFinding = createCheckCircuit("biology-basic", "EvolutionReasoningFinding", ["biology-basic.evolution-adaptation:Adaptation"]);
export const EvidenceGeneralizationFinding = createCheckCircuit("biology-basic", "EvidenceGeneralizationFinding", ["biology-basic.health-experiment:BiologicalObservation"]);

export default Object.freeze([BiologicalLevelFinding, StructureFunctionFinding, LifecycleFinding, InheritanceFinding, EcologyRelationFinding, EvolutionReasoningFinding, EvidenceGeneralizationFinding]);
