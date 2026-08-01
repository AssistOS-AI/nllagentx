import { createCheckCircuit } from "../../shared/check-runtime.mjs";

export const KnowledgeAccessFinding = createCheckCircuit("psychology-basic", "KnowledgeAccessFinding", ["psychology-basic.perception-knowledge:Knowledge"]);
export const MotivationContinuityFinding = createCheckCircuit("psychology-basic", "MotivationContinuityFinding", ["psychology-basic.motivation:Motivation"]);
export const EmotionTransitionFinding = createCheckCircuit("psychology-basic", "EmotionTransitionFinding", ["psychology-basic.emotion:EmotionState"]);
export const BeliefActionConsistencyFinding = createCheckCircuit("psychology-basic", "BeliefActionConsistencyFinding", ["psychology-basic.perception-knowledge:Belief"]);
export const PerspectiveAttributionFinding = createCheckCircuit("psychology-basic", "PerspectiveAttributionFinding", ["psychology-basic.perspective:Perspective"]);
export const MindReadingWarning = createCheckCircuit("psychology-basic", "MindReadingWarning", ["psychology-basic.perspective:MentalStateEvidence"]);
export const GoalConflictCircuit = createCheckCircuit("psychology-basic", "GoalConflictCircuit", ["psychology-basic.goals-intentions:Goal"]);

export default Object.freeze([KnowledgeAccessFinding, MotivationContinuityFinding, EmotionTransitionFinding, BeliefActionConsistencyFinding, PerspectiveAttributionFinding, MindReadingWarning, GoalConflictCircuit]);
