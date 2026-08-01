import { createGenerationCircuit } from "../../shared/check-runtime.mjs";
export const LogicExplanationPlan = createGenerationCircuit("logic-basic", "LogicExplanationPlan", ["premises","rule","conclusion","assumptions","counterexample"]);
export default Object.freeze([LogicExplanationPlan]);
