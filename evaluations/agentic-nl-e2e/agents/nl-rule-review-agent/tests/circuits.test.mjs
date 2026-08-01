import test from "node:test";
import assert from "node:assert/strict";
import coreOntology, {
  Agent,
  Event,
  Evidence,
  Proposition,
  actor,
  evidence,
  source
} from "../../../../../framework/packs/core-language/ontologies/core.ontology.mjs";
import { SemanticStore } from "../../../../../framework/runtime/store/semantic-store.mjs";
import { CircuitRunner } from "../../../../../framework/runtime/circuit-runner.mjs";
import { abstractCircuit } from "../../../../../framework/runtime/methods/abstract/worklist.mjs";
import { exploreDecisionConditions } from "../../../../../framework/runtime/methods/symbolic/explorer.mjs";
import { claim, denied, groundedAt } from "../../../../../framework/sdk/longtext/claims.mjs";
import { coverage } from "../../../../../framework/sdk/longtext/coverage.mjs";
import { interpretation } from "../../../../../framework/sdk/longtext/contexts.mjs";
import { sourceUnit } from "../../../../../framework/sdk/longtext/source.mjs";
import ontology, {
  OperationalRule,
  EmergencyExceptionInvocation,
  ExceptionJustificationRequirement,
  JustificationRecord,
  SafetyConclusion,
  SupportsSafetyConclusion,
  ProcedureRequest,
  action,
  condition,
  effect,
  invocation,
  conclusion,
  requiredEffect,
  forbiddenEffect,
  permittedEffect
} from "../ontologies/operational-policy.ontology.mjs";
import ruleContradictionCircuit from "../circuits/rule-contradiction.circuit.mjs";
import exceptionJustificationCircuit from "../circuits/exception-justification.circuit.mjs";
import safetyEvidenceCircuit from "../circuits/safety-evidence.circuit.mjs";
import procedurePlanCircuit from "../circuits/procedure-plan.circuit.mjs";

const SOURCE_TEXT = "A".repeat(512);

function fixture() {
  const store = new SemanticStore()
    .installOntology(coreOntology)
    .installOntology(ontology);
  const unit = sourceUnit("policy-unit", {
    sourceId: "policy",
    text: SOURCE_TEXT,
    end: SOURCE_TEXT.length
  });
  let offset = 0;
  const groundedClaim = (term, options = {}) => {
    const builder = claim(term).grounding(groundedAt(unit.span(offset, offset + 1)));
    offset += 2;
    if (options.interpretation) builder.interpretation(options.interpretation);
    if (options.denied) builder.polarity(denied());
    return builder;
  };
  return { store, groundedClaim };
}

function commit(store, label, claims, witnesses = [], terms = []) {
  store.beginTransaction(label)
    .term(...terms)
    .claim(...claims)
    .coverage(...witnesses)
    .commit();
  return store;
}

function makeRule(ruleEffect, sharedAction = Event(), sharedCondition = Proposition()) {
  return OperationalRule(
    action(sharedAction),
    condition(sharedCondition),
    effect(ruleEffect)
  );
}

async function onlyFinding(circuit, store) {
  const execution = await new CircuitRunner().run(circuit, store);
  assert.equal(execution.findings.length, 1);
  return execution.findings[0];
}

function evidenceIdentities(finding) {
  return new Set([...finding.evidence()].map((entry) => entry.identity()));
}

const REQUIREMENT_DETAIL_KEYS = Object.freeze([
  "failedRequirements",
  "uncertainRequirements",
  "conflictingRequirements",
  "satisfiedRequirements"
]);

function assertQualitativeFinding(finding, { minimumSourceSpans = 0 } = {}) {
  assert.equal(typeof finding.message(), "string");
  assert.ok(finding.message().trim().length > 0);
  assert.notEqual(finding.message(), finding.code());
  const details = finding.descriptor().details;
  for (const key of REQUIREMENT_DETAIL_KEYS) {
    assert.ok(Array.isArray(details[key]), `${finding.code()} must expose ${key}`);
    assert.ok(details[key].every((entry) => typeof entry === "string" && entry.trim().length > 0));
  }
  const sourceSpans = [...finding.evidence()].filter((entry) => entry.sort() === "SourceSpan");
  assert.ok(sourceSpans.length >= minimumSourceSpans);
}

function symbolicCoverage(circuit) {
  const table = circuit.stages.find((stage) => stage.kind() === "DecisionTable");
  assert.ok(table, `${circuit.id} must expose a decision table`);
  assert.ok(table.descriptor().rows.every(({ result }) => result.message?.trim()));
  const conditions = table.descriptor().rows.map((entry) => entry.condition);
  const explored = exploreDecisionConditions(
    conditions.map((entry) => entry.identity()),
    { exclusiveGroups: [conditions.map((entry) => entry.identity())] }
  );
  const statuses = new Set();
  for (const path of explored.paths) {
    const truth = new Map(path.path.map((entry) => [entry.condition, entry.truth]));
    const selected = table.descriptor().rows.find((entry) => truth.get(entry.condition.identity()));
    if (selected) statuses.add(selected.result.status);
  }
  return { ...explored, statuses };
}

test("rule contradiction requires compatible grounded interpretations and cites both rules", async () => {
  const { store, groundedClaim } = fixture();
  const sharedAction = Event();
  const sharedCondition = Proposition();
  const requiredRule = makeRule(requiredEffect, sharedAction, sharedCondition);
  const forbiddenRule = makeRule(forbiddenEffect, sharedAction, sharedCondition);
  commit(store, "conflicting rules", [groundedClaim(requiredRule), groundedClaim(forbiddenRule)]);

  const finding = await onlyFinding(ruleContradictionCircuit, store);
  assert.equal(finding.code(), "RULE_CONTRADICTION");
  assert.equal(finding.status(), "CONFLICT");
  const identities = evidenceIdentities(finding);
  assert.ok(identities.has(requiredRule.identity()));
  assert.ok(identities.has(forbiddenRule.identity()));
  assert.equal(finding.descriptor().details.conflictPairs.length, 1);
  assertQualitativeFinding(finding, { minimumSourceSpans: 2 });
  assert.match(finding.message(), /same action.*same condition.*requires.*forbids/i);
  assert.deepEqual(finding.descriptor().details.failedRequirements, []);
  assert.ok(finding.descriptor().details.conflictingRequirements.some(
    (entry) => /effects.*compatible/i.test(entry)
  ));
});

test("a disputed rule is not reused as the premise of RULE_CONTRADICTION", async () => {
  const { store, groundedClaim } = fixture();
  const sharedAction = Event();
  const sharedCondition = Proposition();
  const requiredRule = makeRule(requiredEffect, sharedAction, sharedCondition);
  const forbiddenRule = makeRule(forbiddenEffect, sharedAction, sharedCondition);
  commit(
    store,
    "disputed conflicting rule",
    [
      groundedClaim(requiredRule),
      groundedClaim(requiredRule, { denied: true }),
      groundedClaim(forbiddenRule)
    ],
    [coverage(OperationalRule).forScope("policy").complete()]
  );

  const finding = await onlyFinding(ruleContradictionCircuit, store);
  assert.equal(finding.code(), "RULE_CONTRADICTION_UNKNOWN");
  assert.equal(finding.status(), "UNKNOWN");
});

test("rule contradiction remains unknown across alternatives and without closed rule coverage", async () => {
  const first = fixture();
  const sharedAction = Event();
  const sharedCondition = Proposition();
  const requiredRule = makeRule(requiredEffect, sharedAction, sharedCondition);
  const forbiddenRule = makeRule(forbiddenEffect, sharedAction, sharedCondition);
  const leftWorld = interpretation("required-reading").seal();
  const rightWorld = interpretation("forbidden-reading").seal();
  commit(
    first.store,
    "alternative rules",
    [
      first.groundedClaim(requiredRule, { interpretation: leftWorld }),
      first.groundedClaim(forbiddenRule, { interpretation: rightWorld })
    ],
    [coverage(OperationalRule).forScope("policy").complete()]
  );
  const alternativeFinding = await onlyFinding(ruleContradictionCircuit, first.store);
  assert.equal(alternativeFinding.status(), "UNKNOWN");

  const second = fixture();
  const permittedRule = makeRule(permittedEffect, sharedAction, sharedCondition);
  commit(second.store, "open compatible rules", [
    second.groundedClaim(requiredRule),
    second.groundedClaim(permittedRule)
  ]);
  assert.equal((await onlyFinding(ruleContradictionCircuit, second.store)).status(), "UNKNOWN");
  second.store.beginTransaction("close rule coverage")
    .coverage(coverage(OperationalRule).forScope("policy").complete())
    .commit();
  assert.equal((await onlyFinding(ruleContradictionCircuit, second.store)).status(), "SATISFIED");
});

test("irrelevant rule terms are not reported as a false success", async () => {
  const { store, groundedClaim } = fixture();
  const left = makeRule(requiredEffect, Event(), Proposition());
  const right = makeRule(forbiddenEffect, EmergencyExceptionInvocation(), Proposition());
  commit(store, "unrelated rules", [groundedClaim(left), groundedClaim(right)]);
  assert.equal((await onlyFinding(ruleContradictionCircuit, store)).status(), "NOT_APPLICABLE");
});

test("missing exception justification is violated only with closed relevant coverage", async () => {
  const open = fixture();
  const exceptionUse = EmergencyExceptionInvocation(actor(Agent()));
  const requirement = ExceptionJustificationRequirement(action(exceptionUse));
  commit(open.store, "open exception review", [
    open.groundedClaim(exceptionUse),
    open.groundedClaim(requirement)
  ]);
  assert.equal((await onlyFinding(exceptionJustificationCircuit, open.store)).status(), "UNKNOWN");

  open.store.beginTransaction("add unrelated justification coverage")
    .coverage(
      coverage(JustificationRecord).forScope("another-source").complete(),
      coverage("another-pack:JustificationRecord").forScope("policy").complete()
    )
    .commit();
  assert.equal((await onlyFinding(exceptionJustificationCircuit, open.store)).status(), "UNKNOWN");

  open.store.beginTransaction("close justification coverage")
    .coverage(coverage(JustificationRecord).forScope("policy").complete())
    .commit();
  const violatedFinding = await onlyFinding(exceptionJustificationCircuit, open.store);
  assert.equal(violatedFinding.code(), "MISSING_EXCEPTION_JUSTIFICATION");
  assert.equal(violatedFinding.status(), "VIOLATED");
  assertQualitativeFinding(violatedFinding, { minimumSourceSpans: 2 });
  assert.match(violatedFinding.message(), /invocation lacks.*justification record.*required/i);
  assert.ok(violatedFinding.descriptor().details.failedRequirements.some(
    (entry) => /justification record.*link/i.test(entry)
  ));
  const identities = evidenceIdentities(violatedFinding);
  assert.ok(identities.has(exceptionUse.identity()));
  assert.ok(identities.has(requirement.identity()));

  const satisfied = fixture();
  const record = JustificationRecord(invocation(exceptionUse), actor(Agent()));
  commit(satisfied.store, "justified exception", [
    satisfied.groundedClaim(exceptionUse),
    satisfied.groundedClaim(requirement),
    satisfied.groundedClaim(record)
  ]);
  assert.equal((await onlyFinding(exceptionJustificationCircuit, satisfied.store)).status(), "SATISFIED");
});

test("asserted and denied justification records preserve a conflict boundary", async () => {
  const { store, groundedClaim } = fixture();
  const exceptionUse = EmergencyExceptionInvocation(actor(Agent()));
  const requirement = ExceptionJustificationRequirement(action(exceptionUse));
  const record = JustificationRecord(invocation(exceptionUse), actor(Agent()));
  commit(store, "conflicting justification", [
    groundedClaim(exceptionUse),
    groundedClaim(requirement),
    groundedClaim(record),
    groundedClaim(record, { denied: true })
  ]);
  assert.equal((await onlyFinding(exceptionJustificationCircuit, store)).status(), "CONFLICT");
});

test("exception evidence preserves alternatives and does not confuse different records", async () => {
  const alternative = fixture();
  const exceptionUse = EmergencyExceptionInvocation(actor(Agent()));
  const requirement = ExceptionJustificationRequirement(action(exceptionUse));
  const record = JustificationRecord(invocation(exceptionUse), actor(Agent()));
  const presentWorld = interpretation("justification-present").seal();
  const absentWorld = interpretation("justification-denied").seal();
  commit(alternative.store, "alternative justification", [
    alternative.groundedClaim(exceptionUse),
    alternative.groundedClaim(requirement),
    alternative.groundedClaim(record, { interpretation: presentWorld }),
    alternative.groundedClaim(record, { interpretation: absentWorld, denied: true })
  ]);
  assert.equal((await onlyFinding(exceptionJustificationCircuit, alternative.store)).status(), "UNKNOWN");

  const distinct = fixture();
  const presentRecord = JustificationRecord(invocation(exceptionUse), actor(Agent()));
  const deniedRecord = JustificationRecord(invocation(exceptionUse));
  commit(distinct.store, "distinct justification records", [
    distinct.groundedClaim(exceptionUse),
    distinct.groundedClaim(requirement),
    distinct.groundedClaim(presentRecord),
    distinct.groundedClaim(deniedRecord, { denied: true })
  ]);
  assert.equal((await onlyFinding(exceptionJustificationCircuit, distinct.store)).status(), "SATISFIED");
});

test("absent exception and safety terms are not applicable rather than violations", async () => {
  const { store } = fixture();
  const exceptionFinding = await onlyFinding(exceptionJustificationCircuit, store);
  const safetyFinding = await onlyFinding(safetyEvidenceCircuit, store);
  assert.equal(exceptionFinding.status(), "NOT_APPLICABLE");
  assert.equal(exceptionFinding.code(), "EXCEPTION_JUSTIFICATION_NOT_APPLICABLE");
  assert.equal(safetyFinding.status(), "NOT_APPLICABLE");
  assert.equal(safetyFinding.code(), "SAFETY_CONCLUSION_EVIDENCE_NOT_APPLICABLE");
});

test("a safety conclusion is not its own evidence and absence needs closed coverage", async () => {
  const { store, groundedClaim } = fixture();
  const safetyConclusion = SafetyConclusion(actor(Agent()));
  commit(store, "unsupported open conclusion", [groundedClaim(safetyConclusion)]);
  assert.equal((await onlyFinding(safetyEvidenceCircuit, store)).status(), "UNKNOWN");

  store.beginTransaction("close unrelated safety support coverage")
    .coverage(coverage(SupportsSafetyConclusion).forScope("another-source").complete())
    .commit();
  assert.equal((await onlyFinding(safetyEvidenceCircuit, store)).status(), "UNKNOWN");

  store.beginTransaction("close safety support coverage")
    .coverage(coverage(SupportsSafetyConclusion).forScope("policy").complete())
    .commit();
  const finding = await onlyFinding(safetyEvidenceCircuit, store);
  assert.equal(finding.code(), "UNSUPPORTED_SAFETY_CONCLUSION");
  assert.equal(finding.status(), "VIOLATED");
  assertQualitativeFinding(finding, { minimumSourceSpans: 1 });
  assert.match(finding.message(), /safety conclusion.*no distinct supporting evidence/i);
  assert.ok(finding.descriptor().details.failedRequirements.some(
    (entry) => /distinct source-grounded evidence link/i.test(entry)
  ));
  assert.deepEqual(finding.descriptor().details.supportingEvidence, []);
});

test("source-grounded support yields a satisfied safety finding with evidence identity", async () => {
  const { store, groundedClaim } = fixture();
  const safetyConclusion = SafetyConclusion(actor(Agent()));
  const supportEvidence = Evidence();
  const support = SupportsSafetyConclusion(
    evidence(supportEvidence),
    conclusion(safetyConclusion)
  );
  commit(store, "supported conclusion", [
    groundedClaim(safetyConclusion),
    groundedClaim(support)
  ]);
  const finding = await onlyFinding(safetyEvidenceCircuit, store);
  assert.equal(finding.status(), "SATISFIED");
  assert.ok(evidenceIdentities(finding).has(supportEvidence.identity()));
  assert.deepEqual(finding.descriptor().details.supportingEvidence, [supportEvidence.identity()]);
});

test("asserted and denied safety support preserves a concrete conflict boundary", async () => {
  const { store, groundedClaim } = fixture();
  const safetyConclusion = SafetyConclusion(actor(Agent()));
  const supportEvidence = Evidence();
  const support = SupportsSafetyConclusion(
    evidence(supportEvidence),
    conclusion(safetyConclusion)
  );
  commit(store, "conflicting safety support", [
    groundedClaim(safetyConclusion),
    groundedClaim(support),
    groundedClaim(support, { denied: true })
  ]);

  const finding = await onlyFinding(safetyEvidenceCircuit, store);
  assert.equal(finding.code(), "SAFETY_CONCLUSION_EVIDENCE_CONFLICT");
  assert.equal(finding.status(), "CONFLICT");
  const identities = evidenceIdentities(finding);
  assert.ok(identities.has(safetyConclusion.identity()));
  assert.ok(identities.has(support.identity()));
  assert.ok(identities.has(supportEvidence.identity()));
});

test("safety evidence preserves mutually exclusive alternatives", async () => {
  const alternative = fixture();
  const safetyConclusion = SafetyConclusion(actor(Agent()));
  const support = SupportsSafetyConclusion(
    evidence(Evidence()),
    conclusion(safetyConclusion)
  );
  const supportedWorld = interpretation("supported-reading").seal();
  const unsupportedWorld = interpretation("unsupported-reading").seal();
  commit(alternative.store, "alternative safety support", [
    alternative.groundedClaim(safetyConclusion),
    alternative.groundedClaim(support, { interpretation: supportedWorld }),
    alternative.groundedClaim(support, { interpretation: unsupportedWorld, denied: true })
  ]);
  assert.equal((await onlyFinding(safetyEvidenceCircuit, alternative.store)).status(), "UNKNOWN");
});

test("procedure readiness distinguishes absent, ungrounded, and grounded requests", async () => {
  const absent = fixture();
  assert.equal((await onlyFinding(procedurePlanCircuit, absent.store)).status(), "NOT_APPLICABLE");

  const ungrounded = fixture();
  const rule = makeRule(requiredEffect);
  const request = ProcedureRequest(source(rule));
  commit(ungrounded.store, "ungrounded request", [], [], [request, rule]);
  assert.equal((await onlyFinding(procedurePlanCircuit, ungrounded.store)).status(), "UNKNOWN");

  const grounded = fixture();
  commit(grounded.store, "grounded procedure request", [
    grounded.groundedClaim(rule),
    grounded.groundedClaim(request)
  ]);
  const execution = await new CircuitRunner().run(procedurePlanCircuit, grounded.store);
  assert.equal(execution.findings[0].code(), "PROCEDURE_PLAN_READY");
  assert.equal(execution.findings[0].status(), "SATISFIED");
  assertQualitativeFinding(execution.findings[0], { minimumSourceSpans: 2 });
  assert.match(execution.findings[0].message(), /grounded request.*input rules.*ordered/i);
  assert.ok(execution.findings[0].descriptor().details.satisfiedRequirements.some(
    (entry) => /acknowledgement before authorization and gate action/i.test(entry)
  ));
  assert.ok(evidenceIdentities(execution.findings[0]).has(rule.identity()));
  assert.equal(execution.frames.filter((frame) => frame.kind() === "GenerationPlan").length, 1);
});

test("procedure generation does not treat a disputed input rule as ready", async () => {
  const { store, groundedClaim } = fixture();
  const rule = makeRule(requiredEffect);
  const request = ProcedureRequest(source(rule));
  commit(store, "disputed procedure rule", [
    groundedClaim(rule),
    groundedClaim(rule, { denied: true }),
    groundedClaim(request)
  ]);

  const execution = await new CircuitRunner().run(procedurePlanCircuit, store);
  assert.equal(execution.findings[0].code(), "PROCEDURE_PLAN_READINESS_UNKNOWN");
  assert.equal(execution.findings[0].status(), "UNKNOWN");
  assert.equal(execution.frames.length, 0);
});

test("asserted and denied procedure requests emit conflict without generation frames", async () => {
  const { store, groundedClaim } = fixture();
  const rule = makeRule(requiredEffect);
  const request = ProcedureRequest(source(rule));
  const assertedRequestClaim = groundedClaim(request);
  const deniedRequestClaim = groundedClaim(request, { denied: true });
  commit(store, "conflicting procedure request", [
    groundedClaim(rule),
    assertedRequestClaim,
    deniedRequestClaim
  ]);

  const execution = await new CircuitRunner().run(procedurePlanCircuit, store);
  assert.equal(execution.findings.length, 1);
  assert.equal(execution.findings[0].code(), "PROCEDURE_REQUEST_CONFLICT");
  assert.equal(execution.findings[0].status(), "CONFLICT");
  assert.equal(execution.frames.length, 0);
  const identities = evidenceIdentities(execution.findings[0]);
  assert.ok(identities.has(request.identity()));
  assert.ok(identities.has(assertedRequestClaim.identity()));
  assert.ok(identities.has(deniedRequestClaim.identity()));
});

test("procedure requests in incompatible alternatives remain unknown", async () => {
  const { store, groundedClaim } = fixture();
  const rule = makeRule(requiredEffect);
  const request = ProcedureRequest(source(rule));
  const requestedWorld = interpretation("procedure-requested").seal();
  const deniedWorld = interpretation("procedure-denied").seal();
  commit(store, "alternative procedure request", [
    groundedClaim(rule),
    groundedClaim(request, { interpretation: requestedWorld }),
    groundedClaim(request, { interpretation: deniedWorld, denied: true })
  ]);

  const execution = await new CircuitRunner().run(procedurePlanCircuit, store);
  assert.equal(execution.findings[0].status(), "UNKNOWN");
  assert.equal(execution.frames.length, 0);
});

test("all reusable circuits run convergent abstract and complete symbolic assurance", () => {
  const circuits = [
    ruleContradictionCircuit,
    exceptionJustificationCircuit,
    safetyEvidenceCircuit,
    procedurePlanCircuit
  ];
  for (const circuit of circuits) {
    assert.deepEqual(
      circuit.assurances.slice(0, 2).map((request) => request.kind),
      ["abstract-preflight", "symbolic-decision-coverage"]
    );
    const abstract = abstractCircuit(circuit);
    assert.equal(abstract.converged, true);
    assert.equal(abstract.precisionLoss.length, 0);
    assert.ok(abstract.values.size >= circuit.stages.length);

    const symbolic = symbolicCoverage(circuit);
    assert.equal(symbolic.truncated, false);
    assert.equal(symbolic.guarantee, "path-complete");
    assert.equal(symbolic.paths.length, 4);
    assert.ok(symbolic.statuses.has("UNKNOWN"));
    assert.ok(symbolic.statuses.has("CONFLICT"));
    assert.ok([...symbolic.statuses].some((status) => ["SATISFIED", "VIOLATED"].includes(status)));
  }
});
