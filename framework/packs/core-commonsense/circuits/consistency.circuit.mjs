import { createCheckCircuit } from "../../shared/check-runtime.mjs";

export const ObjectContinuityFinding = createCheckCircuit("core-commonsense", "ObjectContinuityFinding", ["core-commonsense.entities:PhysicalObject"]);
export const MissingTransitionFinding = createCheckCircuit("core-commonsense", "MissingTransitionFinding", ["core-commonsense.space:Move"]);
export const ActionPreconditionFinding = createCheckCircuit("core-commonsense", "ActionPreconditionFinding", ["core-commonsense.agency:Ability"]);
export const KnowledgeContinuityFinding = createCheckCircuit("core-commonsense", "KnowledgeContinuityFinding", ["core-commonsense.continuity:KnowledgeState"]);
export const CausalGapFinding = createCheckCircuit("core-commonsense", "CausalGapFinding", ["core-commonsense.causality:Enable"]);
export const ImpossibleCoexistenceFinding = createCheckCircuit("core-commonsense", "ImpossibleCoexistenceFinding", ["core-commonsense.continuity:ExistenceState"]);
export const PossessionConflictFinding = createCheckCircuit("core-commonsense", "PossessionConflictFinding", ["core-commonsense.continuity:PossessionState"]);

export default Object.freeze([ObjectContinuityFinding, MissingTransitionFinding, ActionPreconditionFinding, KnowledgeContinuityFinding, CausalGapFinding, ImpossibleCoexistenceFinding, PossessionConflictFinding]);
