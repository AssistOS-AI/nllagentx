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
    expectation: "RULE_CONTRADICTION:CONFLICT",
    purpose: "Show how two individually grounded rules become a real conflict only when they govern the same situation and no priority or exception resolves them.",
    translation: "IntentJS selects RuleContradictionReview because the task asks for mutually incompatible rules. LongTextJS maps “keep the north gate closed” and “open the north gate” to the same gate-opening action and alarm-before-acknowledgement condition, but assigns forbidden and required effects. It also retains the source's explicit denials of a priority and a resolving exception instead of inferring them from silence.",
    interpretation: "The reusable contradiction circuit finds one comparable pair with incompatible effects. The response therefore contains one material CONFLICT, quotes both rules, and recommends an explicit priority, scope, or exception; unrelated NOT_APPLICABLE circuit results are filtered from the public CNL."
  }),
  Object.freeze({
    id: "missing-exception-justification",
    name: "tutorial-missing-exception.html",
    title: "Tutorial: Missing Exception Justification",
    circuit: "exception-justification.circuit.mjs",
    expectation: "MISSING_EXCEPTION_JUSTIFICATION:VIOLATED",
    purpose: "Show why an omitted justification is a violation only after the relevant record has explicit closed coverage rather than merely lacking a matching phrase.",
    translation: "IntentJS requests ExceptionJustificationReview. LongTextJS creates three distinct grounded values: the policy requirement, Ana's 09:02 emergency invocation, and a denied justification record linked to that invocation. Complete JustificationRecord coverage turns the explicit “no reason or justification record” clause into safe negative evidence instead of treating a failed text search as proof.",
    interpretation: "The exception circuit joins the invocation to the applicable requirement and cannot find an asserted linked record while closed coverage and the explicit denial are present. The response reports one VIOLATED finding, quotes the rule, invocation, and denial, and does not invent a missing reason."
  }),
  Object.freeze({
    id: "unsupported-safety-conclusion",
    name: "tutorial-unsupported-conclusion.html",
    title: "Tutorial: Unsupported Safety Conclusion",
    circuit: "safety-evidence.circuit.mjs",
    expectation: "UNSUPPORTED_SAFETY_CONCLUSION:VIOLATED",
    purpose: "Show that a conclusion in the source is not evidence for itself and that explicit denied support must remain visible in the final answer.",
    translation: "IntentJS selects SafetyConclusionEvidenceReview. LongTextJS keeps the author's safety conclusion and claimed training rationale as attributed assertions, creates a separate SupportsSafetyConclusion relation, and grounds that relation with denied polarity in the sentence saying the memo has no supporting record. Complete support-relation coverage prevents the conclusion from being reused as its own evidence.",
    interpretation: "The safety circuit sees a grounded conclusion but no distinct asserted support link. The response emits one VIOLATED finding, quotes the conclusion and the explicit evidence denial, and omits the recorded alarm and gate-opening events because they do not support the requested safety assessment."
  }),
  Object.freeze({
    id: "generate-compliant-procedure",
    name: "tutorial-procedure-generation.html",
    title: "Tutorial: Controlled Procedure Generation",
    circuit: "procedure-plan.circuit.mjs",
    expectation: "PROCEDURE_PLAN_READY:SATISFIED",
    purpose: "Show the generation path: a natural-language procedure request and grounded policy rules produce an ordered controlled-language procedure rather than a generic prose completion.",
    translation: "IntentJS uses generate mode, requests OperationalProcedureGeneration, and selects procedural presentation. LongTextJS turns the source into a ProcedureRequest plus five grounded OperationalRule values: acknowledgement, authorization recording, emergency permission, exception justification, and final audit recording. Required and permitted effects remain distinct, so the exception does not become an unstated general permission.",
    interpretation: "The generation circuit confirms that the request and required rule set are present, emits an ordered procedure frame, and the response renderer produces five CNL steps followed by one supporting SATISFIED finding. Each governing sentence is quoted so the generated order can be checked against the input."
  })
]);
