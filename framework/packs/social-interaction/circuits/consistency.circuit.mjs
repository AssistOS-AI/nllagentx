import { createCheckCircuit } from "../../shared/check-runtime.mjs";

export const SpeechActClassificationFinding = createCheckCircuit("social-interaction", "SpeechActClassificationFinding", ["social-interaction.speech-acts:SpeechAct"]);
export const PromiseClosureFinding = createCheckCircuit("social-interaction", "PromiseClosureFinding", ["social-interaction.speech-acts:Promise"]);
export const ConsentStructureFinding = createCheckCircuit("social-interaction", "ConsentStructureFinding", ["social-interaction.consent-boundaries:Consent"]);
export const BoundaryConflictFinding = createCheckCircuit("social-interaction", "BoundaryConflictFinding", ["social-interaction.consent-boundaries:Boundary"]);
export const PrivacyDisclosureFinding = createCheckCircuit("social-interaction", "PrivacyDisclosureFinding", ["social-interaction.consent-boundaries:Disclosure"]);
export const CooperationContributionFinding = createCheckCircuit("social-interaction", "CooperationContributionFinding", ["social-interaction.cooperation:Contribution"]);
export const ConflictEscalationFinding = createCheckCircuit("social-interaction", "ConflictEscalationFinding", ["social-interaction.conflict:Conflict"]);
export const FairnessReasoningFinding = createCheckCircuit("social-interaction", "FairnessReasoningFinding", ["social-interaction.fairness:FairnessClaim"]);
export const SocialAttributionWarning = createCheckCircuit("social-interaction", "SocialAttributionWarning", ["social-interaction.fairness:Justification"]);

export default Object.freeze([SpeechActClassificationFinding, PromiseClosureFinding, ConsentStructureFinding, BoundaryConflictFinding, PrivacyDisclosureFinding, CooperationContributionFinding, ConflictEscalationFinding, FairnessReasoningFinding, SocialAttributionWarning]);
