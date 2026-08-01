import {
  circuit,
  capability,
  concept,
  guarantee,
  proceduralStage,
  emitFinding,
  emitCNLFrame,
  abstractPreflight,
  symbolicDecisionCoverage,
  cnlRoundTrip
} from "../../../../../framework/sdk/circuit/index.mjs";
import {
  generationPlan,
  literalSlot,
  procedureStepFrame,
  slot,
  sourceBound
} from "../../../../../framework/sdk/cnl/index.mjs";
import { source } from "../../../../../framework/packs/core-language/ontologies/core.ontology.mjs";
import {
  OperationalRule,
  ProcedureRequest,
  acknowledgementStep,
  authorizationStep,
  gateActionStep,
  exceptionJustificationStep,
  auditRecordingStep
} from "../ontologies/operational-policy.ontology.mjs";
import {
  REVIEW_OUTCOMES,
  assessment,
  commonInterpretation,
  evidenceFor,
  groundedClaims,
  identityOf,
  interpretationsCompatible,
  reviewDecisionTable,
  roleValues,
  termsOf
} from "./review-support.mjs";

function evaluateProcedureReadiness({ store }) {
  const requests = termsOf(store, ProcedureRequest);
  if (requests.length === 0) {
    return assessment(REVIEW_OUTCOMES.FALSE, [], { requests: [] });
  }
  const deniedRequests = requests.flatMap((request) => groundedClaims(store, request, "denied")
    .map((requestClaim) => ({ request, requestClaim })));
  const groundedRequests = requests.flatMap((request) => groundedClaims(store, request)
    .map((requestClaim) => ({ request, requestClaim })));
  const conflictingRequests = groundedRequests.flatMap((assertedRequest) => deniedRequests
    .filter((deniedRequest) => identityOf(assertedRequest.request) === identityOf(deniedRequest.request)
      && interpretationsCompatible(assertedRequest.requestClaim, deniedRequest.requestClaim))
    .map((deniedRequest) => ({ assertedRequest, deniedRequest })));
  if (conflictingRequests.length > 0) {
    const requestTerms = conflictingRequests.map(({ assertedRequest }) => assertedRequest.request);
    const requestClaims = conflictingRequests.flatMap(({ assertedRequest, deniedRequest }) => [
      assertedRequest.requestClaim,
      deniedRequest.requestClaim
    ]);
    return assessment(
      REVIEW_OUTCOMES.CONFLICT,
      evidenceFor(store, requestTerms, requestClaims),
      { requests: requestTerms.map(identityOf), reason: "asserted-and-denied-request" },
      commonInterpretation(requestClaims)
    );
  }
  const splitRequests = groundedRequests.filter((assertedRequest) => deniedRequests
    .some((deniedRequest) => identityOf(assertedRequest.request) === identityOf(deniedRequest.request)));
  if (splitRequests.length > 0) {
    const requestTerms = splitRequests.map(({ request }) => request);
    const requestClaims = [
      ...splitRequests.map(({ requestClaim }) => requestClaim),
      ...deniedRequests
        .filter(({ request }) => requestTerms.some((term) => identityOf(term) === identityOf(request)))
        .map(({ requestClaim }) => requestClaim)
    ];
    return assessment(
      REVIEW_OUTCOMES.UNKNOWN,
      evidenceFor(store, requestTerms, requestClaims),
      { requests: requestTerms.map(identityOf), reason: "request-varies-by-interpretation" },
      null
    );
  }
  if (groundedRequests.length === 0) {
    const deniedClaims = deniedRequests.map(({ requestClaim }) => requestClaim);
    return deniedClaims.length > 0
      ? assessment(REVIEW_OUTCOMES.FALSE, evidenceFor(store, requests, deniedClaims), {
        requests: requests.map(identityOf),
        reason: "no-asserted-request"
      })
      : assessment(REVIEW_OUTCOMES.UNKNOWN, evidenceFor(store, requests), {
        requests: requests.map(identityOf),
        reason: "request-not-source-grounded"
      });
  }

  const ready = [];
  const incomplete = [];
  for (const { request, requestClaim } of groundedRequests) {
    const inputRules = roleValues(store, request, source)
      .filter((term) => store.isSubtype(term, OperationalRule));
    const groundedRules = inputRules.filter((rule) => groundedClaims(store, rule, "denied").length === 0
      && groundedClaims(store, rule)
        .some((ruleClaim) => interpretationsCompatible(requestClaim, ruleClaim)));
    const entry = { request, requestClaim, rules: inputRules, groundedRules };
    if (inputRules.length > 0 && groundedRules.length === inputRules.length) ready.push(entry);
    else incomplete.push(entry);
  }
  if (incomplete.length > 0 || ready.length === 0) {
    const selected = incomplete.length ? incomplete : groundedRequests;
    const requestTerms = selected.map(({ request }) => request);
    const rules = incomplete.flatMap(({ rules: values }) => values);
    const claims = selected.map(({ requestClaim }) => requestClaim);
    return assessment(REVIEW_OUTCOMES.UNKNOWN, evidenceFor(store, [...requestTerms, ...rules], claims), {
      requests: requestTerms.map(identityOf),
      inputRules: rules.map(identityOf),
      reason: "missing-grounded-input-rule"
    });
  }

  const rules = ready.flatMap(({ groundedRules }) => groundedRules)
    .filter((rule, index, values) => values.findIndex(
      (candidate) => identityOf(candidate) === identityOf(rule)
    ) === index)
    .sort((left, right) => identityOf(left).localeCompare(identityOf(right)));
  const claims = ready.flatMap(({ requestClaim, groundedRules }) => [
    requestClaim,
    ...groundedRules.flatMap((rule) => groundedClaims(store, rule))
  ]);
  return assessment(
    REVIEW_OUTCOMES.TRUE,
    evidenceFor(store, [...ready.map(({ request }) => request), ...rules], claims),
    {
      request: identityOf(ready[0].request),
      rules: rules.map(identityOf),
      requestTerm: ready[0].request,
      ruleTerms: Object.freeze(rules),
      plans: Object.freeze(ready.map(({ request, groundedRules }) => Object.freeze({
        request,
        rules: Object.freeze([...groundedRules].sort(
          (left, right) => identityOf(left).localeCompare(identityOf(right))
        ))
      })))
    },
    commonInterpretation(claims)
  );
}

function stepFrame(planId, position, kind, instruction, stepTerm, rules) {
  return procedureStepFrame(`nl-rule-review.procedure-step.${planId}.${position}.${kind}`)
    .set("position", literalSlot(String(position)))
    .set("kind", literalSlot(kind))
    .set("instruction", literalSlot(instruction))
    .set("source", sourceBound(stepTerm, ...rules))
    .provenance(...rules)
    .seal();
}

function generateProcedureFrames({ inputs }) {
  const readiness = inputs[0];
  if (readiness?.outcome !== REVIEW_OUTCOMES.TRUE) return [];
  const plans = readiness.details.plans ?? [{
    request: readiness.details.requestTerm,
    rules: readiness.details.ruleTerms
  }];
  return plans.flatMap(({ request, rules }) => {
    const planId = identityOf(request);
    const steps = [
      stepFrame(
        planId,
        1,
        "acknowledgement",
        "Acknowledge the request and applicable rules.",
        acknowledgementStep(...rules),
        rules
      ),
      stepFrame(
        planId,
        2,
        "authorization",
        "Confirm authorization before acting.",
        authorizationStep(...rules),
        rules
      ),
      stepFrame(
        planId,
        3,
        "gate-action",
        "Perform the governed gate action.",
        gateActionStep(...rules),
        rules
      ),
      stepFrame(
        planId,
        4,
        "exception-justification",
        "If an emergency exception is invoked, record its justification.",
        exceptionJustificationStep(...rules),
        rules
      ),
      stepFrame(
        planId,
        5,
        "audit-recording",
        "Finish by recording the auditable result.",
        auditRecordingStep(...rules),
        rules
      )
    ];
    const plan = generationPlan(`nl-rule-review.operational-procedure.${planId}`)
      .set("request", sourceBound(request, ...rules))
      .set("ordered-steps", slot("OrderedProcedureSteps", ...steps))
      .set("exception-rule", sourceBound(steps[3], ...rules))
      .set("completion", sourceBound(steps.at(-1), ...rules))
      .provenance(request, ...rules)
      .seal();
    return [plan, ...steps];
  });
}

const assess = proceduralStage("nl-rule-review.procedure-plan.assess")
  .reads(ProcedureRequest, OperationalRule)
  .writes("ProcedureReadinessAssessment")
  .abstract(() => new Set(["SATISFIED", "UNKNOWN", "CONFLICT", "NOT_APPLICABLE"]))
  .run(evaluateProcedureReadiness);

const decide = reviewDecisionTable("nl-rule-review.procedure-plan.decide", assess, {
  true: { code: "PROCEDURE_PLAN_READY", status: "SATISFIED" },
  false: { code: "PROCEDURE_PLAN_NOT_APPLICABLE", status: "NOT_APPLICABLE" },
  unknown: { code: "PROCEDURE_PLAN_READINESS_UNKNOWN", status: "UNKNOWN" },
  conflict: { code: "PROCEDURE_REQUEST_CONFLICT", status: "CONFLICT" }
});

const generate = proceduralStage("nl-rule-review.procedure-plan.generate")
  .reads(assess)
  .writes("CNLFrame")
  .abstract(() => new Set(["SATISFIED", "UNKNOWN"]))
  .run(generateProcedureFrames);

export default circuit("nl-rule-review.OperationalProcedureGeneration", "1.0.0")
  .concern("ordered-operational-procedure-generation")
  .targets("short-operational-policy", "event-record")
  .requires(concept(ProcedureRequest), concept(OperationalRule))
  .provides(
    capability("OperationalProcedureGeneration"),
    guarantee("evidence-bearing"),
    guarantee("interpretation-aware"),
    guarantee("plan-explainable"),
    guarantee("cnl-round-trip")
  )
  .use(assess)
  .use(decide)
  .use(generate)
  .emit(emitFinding(decide), emitCNLFrame(generate))
  .statuses("SATISFIED", "UNKNOWN", "CONFLICT", "NOT_APPLICABLE")
  .assurance(abstractPreflight(), symbolicDecisionCoverage(), cnlRoundTrip())
  .seal();
