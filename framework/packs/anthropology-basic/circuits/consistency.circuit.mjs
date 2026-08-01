import { createCheckCircuit } from "../../shared/check-runtime.mjs";

export const CulturalOvergeneralizationFinding = createCheckCircuit("anthropology-basic", "CulturalOvergeneralizationFinding", ["anthropology-basic.culture-practice:CulturalPractice"]);
export const ContextLossFinding = createCheckCircuit("anthropology-basic", "ContextLossFinding", ["anthropology-basic.culture-practice:CulturalGroup"]);
export const EmicEticConfusionFinding = createCheckCircuit("anthropology-basic", "EmicEticConfusionFinding", ["anthropology-basic.identity-perspective:EmicConcept"]);
export const KinshipProjectionFinding = createCheckCircuit("anthropology-basic", "KinshipProjectionFinding", ["anthropology-basic.kinship-household:KinRelation"]);
export const NormPracticeConfusionFinding = createCheckCircuit("anthropology-basic", "NormPracticeConfusionFinding", ["anthropology-basic.norm-ritual:Norm"]);
export const EvidencePerspectiveFinding = createCheckCircuit("anthropology-basic", "EvidencePerspectiveFinding", ["anthropology-basic.evidence-change:EvidenceSource"]);
export const CulturalChangeFinding = createCheckCircuit("anthropology-basic", "CulturalChangeFinding", ["anthropology-basic.culture-practice:CulturalPractice"]);

export default Object.freeze([CulturalOvergeneralizationFinding, ContextLossFinding, EmicEticConfusionFinding, KinshipProjectionFinding, NormPracticeConfusionFinding, EvidencePerspectiveFinding, CulturalChangeFinding]);
