import test from "node:test";
import assert from "node:assert/strict";
import coreOntology from "../../../../../../../framework/packs/core-language/ontologies/core.ontology.mjs";
import { CircuitRunner } from "../../../../../../../framework/runtime/circuit-runner.mjs";
import { SemanticStore } from "../../../../../../../framework/runtime/store/semantic-store.mjs";
import { roundTripFrame } from "../../../../../../../framework/sdk/cnl/compare.mjs";
import {
  frameProjection,
  parseCanonicalCNL,
  renderCanonicalCNL
} from "../../../../../../../framework/sdk/cnl/grammar.mjs";
import ontology from "../../../ontologies/operational-policy.ontology.mjs";
import procedureCircuit from "../../../circuits/procedure-plan.circuit.mjs";
import {
  OperationalRule,
  ProcedureRequest,
  effect,
  source,
  value
} from "../sdk/ontology.generated.mjs";
import longText, {
  acknowledgementRule,
  acknowledgementRuleClaim,
  auditRecordingRule,
  auditRecordingRuleClaim,
  authorizationRule,
  authorizationRuleClaim,
  emergencyPermissionRule,
  emergencyPermissionRuleClaim,
  exceptionJustificationRule,
  exceptionJustificationRuleClaim,
  procedureRequest,
  procedureRequestClaim,
  semanticDiagnostics
} from "../longtext/root.longtext.mjs";

const SOURCE_DIGEST = "759e5183506b5f6462dea5d2b9c4380f76ff1e5278fca3919927ebe4bd7ad6a3";
const rules = [
  acknowledgementRule,
  authorizationRule,
  emergencyPermissionRule,
  exceptionJustificationRule,
  auditRecordingRule
];

function roleValues(term, role) {
  return term.bindings()
    .filter((binding) => binding.role().identity === role.identity())
    .map((binding) => binding.value());
}

function roleValue(term, role) {
  return roleValues(term, role)[0];
}

function groundingRange(claimBuilder) {
  const span = claimBuilder.seal().groundings()[0];
  return {
    sourceId: span.sourceId(),
    unitId: span.unitId(),
    sourceDigest: span.descriptor().sourceDigest,
    start: span.start(),
    end: span.end()
  };
}

function effectValue(rule) {
  return roleValue(roleValue(rule, effect), value).value();
}

function provenanceIdentities(frame) {
  return new Set(frame.descriptor().provenance.map((entry) => entry.identity()));
}

test("LongTextJS grounds the request and every operational rule at exact decoded offsets", () => {
  assert.deepEqual(groundingRange(procedureRequestClaim), {
    sourceId: "source-001",
    unitId: "source-001:unit-0001",
    sourceDigest: SOURCE_DIGEST,
    start: 0,
    end: 22
  });
  assert.deepEqual([
    acknowledgementRuleClaim,
    authorizationRuleClaim,
    emergencyPermissionRuleClaim,
    exceptionJustificationRuleClaim,
    auditRecordingRuleClaim
  ].map((entry) => {
    const range = groundingRange(entry);
    return [range.start, range.end];
  }), [
    [24, 124],
    [125, 182],
    [183, 295],
    [183, 295],
    [296, 404]
  ]);
});

test("the request references all and only the five source-grounded rules", () => {
  assert.equal(procedureRequest.concept(), ProcedureRequest.identity());
  assert.ok(rules.every((rule) => rule.concept() === OperationalRule.identity()));
  assert.deepEqual(
    roleValues(procedureRequest, source).map((rule) => rule.identity()),
    rules.map((rule) => rule.identity())
  );
});

test("only the stated emergency opening is permitted", () => {
  assert.deepEqual(rules.map(effectValue), [
    "required",
    "required",
    "permitted",
    "required",
    "required"
  ]);
  assert.equal(emergencyPermissionRuleClaim.seal().descriptor().modality.value(), "permitted");
  assert.ok([
    acknowledgementRuleClaim,
    authorizationRuleClaim,
    exceptionJustificationRuleClaim,
    auditRecordingRuleClaim
  ].every((entry) => entry.seal().descriptor().modality.value() === "obligatory"));
});

test("unsupported ordering and quantified audit structure remain explicit", () => {
  assert.deepEqual(semanticDiagnostics.map((entry) => entry.code()), [
    "LONGTEXT_GENERIC_PROCEDURE_ORDERING",
    "LONGTEXT_GENERIC_AUDIT_SCOPE"
  ]);
  assert.ok(semanticDiagnostics.every((entry) => entry.severity() === "warning"));
  assert.equal(longText.claims.length, 6);
  const coverageByConcept = new Map(
    longText.coverage.map((entry) => [entry.descriptor().concept.identity(), entry.descriptor().status])
  );
  assert.equal(coverageByConcept.get(OperationalRule.identity()), "closed");
  assert.equal(coverageByConcept.get(ProcedureRequest.identity()), "closed");
});

test("the reusable circuit emits an evidence-preserving ordered procedure", async () => {
  const store = new SemanticStore()
    .installOntology(coreOntology)
    .installOntology(ontology);
  store.beginTransaction("task procedure requirements")
    .longText(longText)
    .commit();

  const execution = await new CircuitRunner().run(procedureCircuit, store);
  assert.equal(execution.findings.length, 1);
  assert.equal(execution.findings[0].code(), "PROCEDURE_PLAN_READY");
  assert.equal(execution.findings[0].status(), "SATISFIED");

  const plan = execution.frames.find((frame) => frame.kind() === "GenerationPlan");
  const steps = execution.frames.filter((frame) => frame.kind() === "ProcedureStep");
  assert.ok(plan);
  assert.deepEqual(steps.map((frame) => frame.slot("kind").value()), [
    "acknowledgement",
    "authorization",
    "gate-action",
    "exception-justification",
    "audit-recording"
  ]);
  assert.match(steps[3].slot("instruction").value(), /emergency exception.*justification/i);
  assert.match(steps.at(-1).slot("instruction").value(), /Finish.*auditable/i);
  assert.ok(provenanceIdentities(plan).has(procedureRequest.identity()));
  assert.ok(rules.every((rule) => provenanceIdentities(plan).has(rule.identity())));
  assert.ok(steps.every((step) => rules.every(
    (rule) => provenanceIdentities(step).has(rule.identity())
  )));

  for (const frame of execution.frames) {
    const roundTrip = roundTripFrame(frame, renderCanonicalCNL, parseCanonicalCNL);
    assert.equal(roundTrip.comparison.equivalent, true);
    assert.deepEqual(frameProjection(roundTrip.parsed), frameProjection(frame));
  }
});
