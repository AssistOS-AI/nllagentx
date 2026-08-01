import test from "node:test";
import assert from "node:assert/strict";
import coreOntology, {
  Event,
  Proposition,
  source
} from "../../../../../framework/packs/core-language/ontologies/core.ontology.mjs";
import { SemanticStore } from "../../../../../framework/runtime/store/semantic-store.mjs";
import { CircuitRunner } from "../../../../../framework/runtime/circuit-runner.mjs";
import { frameProjection, renderCanonicalCNL } from "../../../../../framework/sdk/cnl/grammar.mjs";
import { roundTripFrame } from "../../../../../framework/sdk/cnl/compare.mjs";
import { parseCanonicalCNL } from "../../../../../framework/sdk/cnl/grammar.mjs";
import { claim, groundedAt } from "../../../../../framework/sdk/longtext/claims.mjs";
import { sourceUnit } from "../../../../../framework/sdk/longtext/source.mjs";
import ontology, {
  OperationalRule,
  ProcedureRequest,
  action,
  condition,
  effect,
  requiredEffect,
  permittedEffect
} from "../ontologies/operational-policy.ontology.mjs";
import procedurePlanCircuit from "../circuits/procedure-plan.circuit.mjs";

function provenanceIdentities(frame) {
  return new Set(frame.descriptor().provenance.map((entry) => entry.identity()));
}

async function generatedProcedure() {
  const text = "The operator must acknowledge, authorize, act, justify exceptions, and audit.";
  const unit = sourceUnit("procedure-policy", {
    sourceId: "procedure-policy",
    text,
    end: text.length
  });
  const rule = OperationalRule(
    action(Event()),
    condition(Proposition()),
    effect(requiredEffect)
  );
  const request = ProcedureRequest(source(rule));
  const store = new SemanticStore()
    .installOntology(coreOntology)
    .installOntology(ontology);
  store.beginTransaction("procedure input")
    .claim(
      claim(rule).grounding(groundedAt(unit.span(0, 18))),
      claim(request).grounding(groundedAt(unit.span(19, text.length)))
    )
    .commit();
  const execution = await new CircuitRunner().run(procedurePlanCircuit, store);
  return { execution, rule, request };
}

test("procedure generation emits a typed ordered plan with rule provenance", async () => {
  const { execution, rule, request } = await generatedProcedure();
  const plan = execution.frames.find((frame) => frame.kind() === "GenerationPlan");
  const steps = execution.frames.filter((frame) => frame.kind() === "ProcedureStep");

  assert.ok(plan);
  assert.equal(steps.length, 5);
  assert.deepEqual(
    steps.map((frame) => frame.slot("kind").value()),
    [
      "acknowledgement",
      "authorization",
      "gate-action",
      "exception-justification",
      "audit-recording"
    ]
  );
  assert.deepEqual(steps.map((frame) => frame.slot("position").value()), ["1", "2", "3", "4", "5"]);
  assert.match(steps[3].slot("instruction").value(), /emergency exception.*justification/i);
  assert.match(steps.at(-1).slot("instruction").value(), /Finish.*auditable/i);
  assert.ok(provenanceIdentities(plan).has(rule.identity()));
  assert.ok(provenanceIdentities(plan).has(request.identity()));
  assert.ok(steps.every((frame) => provenanceIdentities(frame).has(rule.identity())));
  assert.ok(plan.slot("ordered-steps"));
  assert.ok(plan.slot("completion"));
});

test("canonical procedure frames round-trip without semantic slot drift", async () => {
  const { execution } = await generatedProcedure();
  for (const frame of execution.frames) {
    const roundTrip = roundTripFrame(frame, renderCanonicalCNL, parseCanonicalCNL);
    assert.equal(roundTrip.comparison.equivalent, true);
    assert.deepEqual(frameProjection(roundTrip.parsed), frameProjection(frame));
    assert.match(roundTrip.text, new RegExp(`^FRAME ${frame.kind()}`));
  }
  assert.ok(procedurePlanCircuit.assurances.some((request) => request.kind === "cnl-roundtrip"));
  assert.ok(procedurePlanCircuit.emissions.some((emission) => emission.kind === "cnl-emission"));
});

test("separate procedure requests retain separate rule provenance", async () => {
  const text = "Generate one procedure for each policy rule.";
  const unit = sourceUnit("multiple-procedure-policy", {
    sourceId: "multiple-procedure-policy",
    text,
    end: text.length
  });
  const firstRule = OperationalRule(
    action(Event()),
    condition(Proposition()),
    effect(requiredEffect)
  );
  const secondRule = OperationalRule(
    action(Event()),
    condition(Proposition()),
    effect(permittedEffect)
  );
  const firstRequest = ProcedureRequest(source(firstRule));
  const secondRequest = ProcedureRequest(source(secondRule));
  const store = new SemanticStore()
    .installOntology(coreOntology)
    .installOntology(ontology);
  store.beginTransaction("multiple procedure inputs")
    .claim(
      claim(firstRule).grounding(groundedAt(unit.span(0, 8))),
      claim(secondRule).grounding(groundedAt(unit.span(9, 18))),
      claim(firstRequest).grounding(groundedAt(unit.span(19, 28))),
      claim(secondRequest).grounding(groundedAt(unit.span(29, text.length)))
    )
    .commit();

  const execution = await new CircuitRunner().run(procedurePlanCircuit, store);
  const plans = execution.frames.filter((frame) => frame.kind() === "GenerationPlan");
  const steps = execution.frames.filter((frame) => frame.kind() === "ProcedureStep");
  assert.equal(plans.length, 2);
  assert.equal(steps.length, 10);

  const firstPlan = plans.find((plan) => provenanceIdentities(plan).has(firstRequest.identity()));
  const secondPlan = plans.find((plan) => provenanceIdentities(plan).has(secondRequest.identity()));
  assert.ok(firstPlan);
  assert.ok(secondPlan);
  assert.ok(provenanceIdentities(firstPlan).has(firstRule.identity()));
  assert.ok(!provenanceIdentities(firstPlan).has(secondRule.identity()));
  assert.ok(provenanceIdentities(secondPlan).has(secondRule.identity()));
  assert.ok(!provenanceIdentities(secondPlan).has(firstRule.identity()));
});
