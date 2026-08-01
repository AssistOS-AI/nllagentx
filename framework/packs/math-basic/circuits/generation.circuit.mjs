import { createGenerationCircuit } from "../../shared/check-runtime.mjs";
export const MathExplanationPlan = createGenerationCircuit("math-basic", "MathExplanationPlan", ["givens","unknown","formula","substitution","result","check"]);
export default Object.freeze([MathExplanationPlan]);
