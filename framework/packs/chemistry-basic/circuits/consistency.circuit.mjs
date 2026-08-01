import { createCheckCircuit } from "../../shared/check-runtime.mjs";

export const ChemicalCategoryFinding = createCheckCircuit("chemistry-basic", "ChemicalCategoryFinding", ["chemistry-basic.matter-substances:MaterialSample"]);
export const FormulaCompositionFinding = createCheckCircuit("chemistry-basic", "FormulaCompositionFinding", ["chemistry-basic.formulae:ChemicalFormula"]);
export const ReactionBalanceFinding = createCheckCircuit("chemistry-basic", "ReactionBalanceFinding", ["chemistry-basic.reactions:ChemicalReaction"]);
export const PhysicalChemicalChangeFinding = createCheckCircuit("chemistry-basic", "PhysicalChemicalChangeFinding", ["chemistry-basic.reactions:ChemicalChange"]);
export const SolutionRelationFinding = createCheckCircuit("chemistry-basic", "SolutionRelationFinding", ["chemistry-basic.states-solutions:Solution"]);
export const AcidBaseFinding = createCheckCircuit("chemistry-basic", "AcidBaseFinding", ["chemistry-basic.acids-bases:Acidic"]);
export const LaboratorySequenceFinding = createCheckCircuit("chemistry-basic", "LaboratorySequenceFinding", ["chemistry-basic.laboratory-description:LaboratoryObservation"]);

export default Object.freeze([ChemicalCategoryFinding, FormulaCompositionFinding, ReactionBalanceFinding, PhysicalChemicalChangeFinding, SolutionRelationFinding, AcidBaseFinding, LaboratorySequenceFinding]);
