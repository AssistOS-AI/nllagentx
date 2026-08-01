import { createCheckCircuit } from "../../shared/check-runtime.mjs";

export const DirectContradictionFinding = createCheckCircuit("logic-basic", "DirectContradictionFinding", ["logic-basic.propositions:Proposition"]);
export const LocalEntailmentFinding = createCheckCircuit("logic-basic", "LocalEntailmentFinding", ["logic-basic.propositions:Proposition"]);
export const QuantifierScopeFinding = createCheckCircuit("logic-basic", "QuantifierScopeFinding", ["logic-basic.quantifiers:Universal"]);
export const ModalConfusionFinding = createCheckCircuit("logic-basic", "ModalConfusionFinding", ["logic-basic.modality:ModalProposition"]);
export const EqualitySubstitutionFinding = createCheckCircuit("logic-basic", "EqualitySubstitutionFinding", ["logic-basic.predicates-terms:Term"]);
export const ConsistencySetCircuit = createCheckCircuit("logic-basic", "ConsistencySetCircuit", ["logic-basic.propositions:Proposition"]);
export const ProofStepCircuit = createCheckCircuit("logic-basic", "ProofStepCircuit", ["logic-basic.proof-steps:ProofStep"]);

export default Object.freeze([DirectContradictionFinding, LocalEntailmentFinding, QuantifierScopeFinding, ModalConfusionFinding, EqualitySubstitutionFinding, ConsistencySetCircuit, ProofStepCircuit]);
