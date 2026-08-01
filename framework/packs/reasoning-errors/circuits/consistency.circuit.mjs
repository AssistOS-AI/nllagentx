import { createCheckCircuit } from "../../shared/check-runtime.mjs";

export const ContradictionClassifier = createCheckCircuit("reasoning-errors", "ContradictionClassifier", ["reasoning-errors.argument-structure:Argument"]);
export const AffirmingConsequentFinding = createCheckCircuit("reasoning-errors", "AffirmingConsequentFinding", ["reasoning-errors.argument-structure:Inference"]);
export const DenyingAntecedentFinding = createCheckCircuit("reasoning-errors", "DenyingAntecedentFinding", ["reasoning-errors.argument-structure:Inference"]);
export const CircularReasoningFinding = createCheckCircuit("reasoning-errors", "CircularReasoningFinding", ["reasoning-errors.argument-structure:Argument"]);
export const EquivocationFinding = createCheckCircuit("reasoning-errors", "EquivocationFinding", ["reasoning-errors.definition-use:TermSense"]);
export const FalseDilemmaFinding = createCheckCircuit("reasoning-errors", "FalseDilemmaFinding", ["reasoning-errors.argument-structure:Argument"]);
export const HastyGeneralizationFinding = createCheckCircuit("reasoning-errors", "HastyGeneralizationFinding", ["reasoning-errors.generalization:GeneralizationClaim"]);
export const CorrelationCausationFinding = createCheckCircuit("reasoning-errors", "CorrelationCausationFinding", ["reasoning-errors.causality:CausalClaim"]);
export const AdHominemFinding = createCheckCircuit("reasoning-errors", "AdHominemFinding", ["reasoning-errors.dialogue:OpponentPosition"]);
export const AppealToAuthorityFinding = createCheckCircuit("reasoning-errors", "AppealToAuthorityFinding", ["reasoning-errors.evidence-authority:SourceAuthority"]);
export const StrawManFinding = createCheckCircuit("reasoning-errors", "StrawManFinding", ["reasoning-errors.dialogue:ReconstructedClaim"]);
export const SlipperySlopeFinding = createCheckCircuit("reasoning-errors", "SlipperySlopeFinding", ["reasoning-errors.causality:CausalClaim"]);
export const CompositionDivisionFinding = createCheckCircuit("reasoning-errors", "CompositionDivisionFinding", ["reasoning-errors.generalization:GeneralizationClaim"]);
export const BaseRateAndSelectionWarning = createCheckCircuit("reasoning-errors", "BaseRateAndSelectionWarning", ["reasoning-errors.generalization:Sample"]);

export default Object.freeze([ContradictionClassifier, AffirmingConsequentFinding, DenyingAntecedentFinding, CircularReasoningFinding, EquivocationFinding, FalseDilemmaFinding, HastyGeneralizationFinding, CorrelationCausationFinding, AdHominemFinding, AppealToAuthorityFinding, StrawManFinding, SlipperySlopeFinding, CompositionDivisionFinding, BaseRateAndSelectionWarning]);
