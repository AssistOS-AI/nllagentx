import { createGenerationCircuit } from "../../shared/check-runtime.mjs";
export const ArgumentRepairPlan = createGenerationCircuit("reasoning-errors", "ArgumentRepairPlan", ["claim","premise","missing support","qualifier","objection","repair"]);
export default Object.freeze([ArgumentRepairPlan]);
