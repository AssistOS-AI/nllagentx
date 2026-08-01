import { createGenerationCircuit } from "../../shared/check-runtime.mjs";
export const EverydayPlanCircuit = createGenerationCircuit("core-commonsense", "EverydayPlanCircuit", ["goal","prerequisite","action","outcome","open question"]);
export const ClarificationDemand = createGenerationCircuit("core-commonsense", "ClarificationDemand", ["goal","prerequisite","action","outcome","open question"]);
export default Object.freeze([EverydayPlanCircuit, ClarificationDemand]);
