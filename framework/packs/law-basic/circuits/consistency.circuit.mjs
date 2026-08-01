import { createCheckCircuit } from "../../shared/check-runtime.mjs";

export const NormFrameCompletenessFinding = createCheckCircuit("law-basic", "NormFrameCompletenessFinding", ["law-basic.norms:Norm"]);
export const DefinitionConsistencyFinding = createCheckCircuit("law-basic", "DefinitionConsistencyFinding", ["law-basic.definitions-references:DefinedTerm"]);
export const NormConflictFinding = createCheckCircuit("law-basic", "NormConflictFinding", ["law-basic.norms:Norm"]);
export const AuthorityJurisdictionFinding = createCheckCircuit("law-basic", "AuthorityJurisdictionFinding", ["law-basic.authority-jurisdiction:NormativeAuthority"]);
export const ProcedureOrderFinding = createCheckCircuit("law-basic", "ProcedureOrderFinding", ["law-basic.time-procedure:Procedure"]);
export const DeadlineFinding = createCheckCircuit("law-basic", "DeadlineFinding", ["law-basic.time-procedure:Deadline"]);
export const CrossReferenceFinding = createCheckCircuit("law-basic", "CrossReferenceFinding", ["law-basic.definitions-references:CrossReference"]);
export const ExceptionCoverageFinding = createCheckCircuit("law-basic", "ExceptionCoverageFinding", ["law-basic.conditions-exceptions:Exception"]);
export const LegalBasisFinding = createCheckCircuit("law-basic", "LegalBasisFinding", ["law-basic.evidence-remedy:LegalEvidence"]);

export default Object.freeze([NormFrameCompletenessFinding, DefinitionConsistencyFinding, NormConflictFinding, AuthorityJurisdictionFinding, ProcedureOrderFinding, DeadlineFinding, CrossReferenceFinding, ExceptionCoverageFinding, LegalBasisFinding]);
