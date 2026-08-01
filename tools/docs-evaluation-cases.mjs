export const evaluationId = "agentic-nl-e2e";
export const agentRelativePath = `evaluations/${evaluationId}/agents/nl-rule-review-agent`;
export const adaptiveTaskRelativePath =
  "evaluations/adaptive-task-e2e/agents/adaptive-core-agent/tasks/task-cold-chain-transfer-core-only";
export const adaptiveAgentRelativePath = "evaluations/adaptive-task-e2e/agents/adaptive-core-agent";

export const caseDefinitions = Object.freeze([
  Object.freeze({
    id: "contradictory-rules",
    name: "tutorial-contradictory-rules.html",
    title: "Tutorial: Contradictory Rules",
    circuit: "rule-contradiction.circuit.mjs",
    expectation: "RULE_CONTRADICTION:CONFLICT"
  }),
  Object.freeze({
    id: "missing-exception-justification",
    name: "tutorial-missing-exception.html",
    title: "Tutorial: Missing Exception Justification",
    circuit: "exception-justification.circuit.mjs",
    expectation: "MISSING_EXCEPTION_JUSTIFICATION:VIOLATED"
  }),
  Object.freeze({
    id: "unsupported-safety-conclusion",
    name: "tutorial-unsupported-conclusion.html",
    title: "Tutorial: Unsupported Safety Conclusion",
    circuit: "safety-evidence.circuit.mjs",
    expectation: "UNSUPPORTED_SAFETY_CONCLUSION:VIOLATED"
  }),
  Object.freeze({
    id: "generate-compliant-procedure",
    name: "tutorial-procedure-generation.html",
    title: "Tutorial: Controlled Procedure Generation",
    circuit: "procedure-plan.circuit.mjs",
    expectation: "PROCEDURE_PLAN_READY:SATISFIED"
  })
]);
