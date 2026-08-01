import { createCheckCircuit } from "../../shared/check-runtime.mjs";

export const ArithmeticConsistencyFinding = createCheckCircuit("math-basic", "ArithmeticConsistencyFinding", ["math-basic.numbers-arithmetic:Number"]);
export const EquationSatisfactionFinding = createCheckCircuit("math-basic", "EquationSatisfactionFinding", ["math-basic.algebra:Equation"]);
export const PercentageRatioFinding = createCheckCircuit("math-basic", "PercentageRatioFinding", ["math-basic.ratios-percentages:Percentage"]);
export const UnitDimensionFinding = createCheckCircuit("math-basic", "UnitDimensionFinding", ["math-basic.measurement:Dimension"]);
export const GeometryFormulaFinding = createCheckCircuit("math-basic", "GeometryFormulaFinding", ["math-basic.geometry:GeometricFigure"]);
export const StatisticsExampleFinding = createCheckCircuit("math-basic", "StatisticsExampleFinding", ["math-basic.probability-statistics:Dataset"]);
export const ProbabilityBoundFinding = createCheckCircuit("math-basic", "ProbabilityBoundFinding", ["math-basic.probability-statistics:Probability"]);
export const DerivationStepFinding = createCheckCircuit("math-basic", "DerivationStepFinding", ["math-basic.proof-explanation:DerivationStep"]);

export default Object.freeze([ArithmeticConsistencyFinding, EquationSatisfactionFinding, PercentageRatioFinding, UnitDimensionFinding, GeometryFormulaFinding, StatisticsExampleFinding, ProbabilityBoundFinding, DerivationStepFinding]);
