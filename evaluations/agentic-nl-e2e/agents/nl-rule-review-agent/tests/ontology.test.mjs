import test from "node:test";
import assert from "node:assert/strict";
import coreOntology, {
  Agent,
  Context,
  Event,
  Evidence,
  Proposition,
  actor,
  context,
  evidence,
  source,
  value
} from "../../../../../framework/packs/core-language/ontologies/core.ontology.mjs";
import { SemanticStore } from "../../../../../framework/runtime/store/semantic-store.mjs";
import { claim, groundedAt } from "../../../../../framework/sdk/longtext/claims.mjs";
import { sourceUnit } from "../../../../../framework/sdk/longtext/source.mjs";
import { ontologyAllocation } from "../architecture-plan.mjs";
import * as generated from "../sdk/ontology.generated.mjs";
import ontology, {
  OperationalRule,
  RuleEffect,
  EmergencyExceptionInvocation,
  ExceptionJustificationRequirement,
  JustificationRecord,
  SafetyConclusion,
  SupportsSafetyConclusion,
  ProcedureRequest,
  ProcedureStep,
  action,
  condition,
  effect,
  invocation,
  conclusion,
  requiredEffect,
  forbiddenEffect,
  permittedEffect,
  acknowledgementStep,
  authorizationStep,
  gateActionStep,
  exceptionJustificationStep,
  auditRecordingStep
} from "../ontologies/operational-policy.ontology.mjs";

const bindingValues = (term, roleConstructor) => term.bindings()
  .filter((binding) => binding.role().identity === roleConstructor.identity())
  .map((binding) => binding.value());

const literalValue = (term) => bindingValues(term, value)[0].value();

const makeRule = (ruleEffect = requiredEffect) => OperationalRule(
  action(Event()),
  condition(Proposition()),
  effect(ruleEffect)
);

test("ontology seals the planned identities and selection capabilities", () => {
  assert.equal(ontology.id, "nl-rule-review.operational-policy");
  assert.equal(ontology.version, "1.0.0");
  assert.deepEqual(
    ontology.concepts.map((concept) => concept.identity).sort(),
    ontologyAllocation.map((entry) => entry.identity).sort()
  );
  assert.deepEqual(
    ontology.provides().map((provided) => provided.name).sort(),
    [
      "ExceptionJustificationReview",
      "OperationalProcedureGeneration",
      "RuleContradictionReview",
      "SafetyConclusionEvidenceReview"
    ]
  );
  assert.equal(ontology.facts.length, 0);
  assert.equal(ontology.laws.length, 0);
  assert.ok(Object.isFrozen(ontology));
});

test("generated facade resolves fluent constructors to canonical identities", () => {
  const generatedEffect = generated.RuleEffect(generated.value("required"));
  const generatedRule = generated.OperationalRule(
    generated.action(generated.Event()),
    generated.condition(generated.Proposition()),
    generated.effect(generatedEffect)
  );

  assert.equal(generated.OperationalRule.identity(), OperationalRule.identity());
  assert.equal(generated.action.identity(), action.identity());
  assert.equal(generatedRule.concept(), OperationalRule.identity());
  assert.equal(bindingValues(generatedRule, effect)[0].concept(), RuleEffect.identity());
});

test("operational rules use typed local comparison roles and canonical effects", () => {
  const sharedAction = Event();
  const sharedCondition = Proposition();
  const requiredRule = OperationalRule(
    action(sharedAction),
    condition(sharedCondition),
    effect(requiredEffect)
  );
  const forbiddenRule = OperationalRule(
    action(sharedAction),
    condition(sharedCondition),
    effect(forbiddenEffect)
  );

  assert.equal(bindingValues(requiredRule, action)[0].identity(), sharedAction.identity());
  assert.equal(bindingValues(forbiddenRule, condition)[0].identity(), sharedCondition.identity());
  assert.notEqual(requiredEffect.identity(), forbiddenEffect.identity());
  assert.notEqual(forbiddenEffect.identity(), permittedEffect.identity());
  assert.deepEqual(
    [requiredEffect, forbiddenEffect, permittedEffect].map(literalValue),
    ["required", "forbidden", "permitted"]
  );
  assert.throws(() => OperationalRule(), /ONTOLOGY_CARDINALITY_MINIMUM/);
  assert.throws(
    () => OperationalRule(action(Proposition()), condition(sharedCondition), effect(requiredEffect)),
    /ONTOLOGY_ROLE_RANGE/
  );
  assert.equal(
    ontology.tryConstruct("OperationalRule").diagnostics[0].code,
    "ONTOLOGY_CARDINALITY_MINIMUM"
  );
});

test("exception and safety frames retain distinct evidence identities", () => {
  const author = Agent();
  const exceptionUse = EmergencyExceptionInvocation(
    actor(author),
    context(Context())
  );
  const requirement = ExceptionJustificationRequirement(action(exceptionUse));
  const record = JustificationRecord(invocation(exceptionUse), actor(author));
  const safetyConclusion = SafetyConclusion(actor(author));
  const supportEvidence = Evidence();
  const support = SupportsSafetyConclusion(
    evidence(supportEvidence),
    conclusion(safetyConclusion)
  );

  assert.equal(bindingValues(requirement, action)[0].identity(), exceptionUse.identity());
  assert.equal(bindingValues(record, invocation)[0].identity(), exceptionUse.identity());
  assert.equal(bindingValues(support, evidence)[0].identity(), supportEvidence.identity());
  assert.equal(bindingValues(support, conclusion)[0].identity(), safetyConclusion.identity());
  assert.notEqual(safetyConclusion.identity(), supportEvidence.identity());
  assert.throws(() => JustificationRecord(), /ONTOLOGY_CARDINALITY_MINIMUM/);
  assert.throws(() => SafetyConclusion(), /ONTOLOGY_CARDINALITY_MINIMUM/);
});

test("procedure helpers construct ordered step kinds linked to input rules", () => {
  const rule = makeRule();
  const request = ProcedureRequest(source(rule));
  const steps = [
    acknowledgementStep(rule),
    authorizationStep(rule),
    gateActionStep(rule),
    exceptionJustificationStep(rule),
    auditRecordingStep(rule)
  ];

  assert.equal(request.concept(), ProcedureRequest.identity());
  assert.ok(steps.every((step) => step.concept() === ProcedureStep.identity()));
  assert.deepEqual(
    steps.map(literalValue),
    [
      "acknowledgement",
      "authorization",
      "gate-action",
      "exception-justification",
      "audit-recording"
    ]
  );
  assert.ok(steps.every((step) => bindingValues(step, source)[0].identity() === rule.identity()));
  assert.throws(() => acknowledgementStep(), /ONTOLOGY_CARDINALITY_MINIMUM/);
});

test("core roles are reused and source grounding remains a LongText claim concern", () => {
  assert.deepEqual(
    ontology.roles.map((roleDefinition) => roleDefinition.identity).sort(),
    [action, condition, effect, invocation, conclusion].map((roleConstructor) => roleConstructor.identity()).sort()
  );
  assert.ok(SafetyConclusion.definition().roles.some((roleUse) => roleUse.role === actor));
  assert.ok(EmergencyExceptionInvocation.definition().roles.some((roleUse) => roleUse.role === context));
  assert.ok(SupportsSafetyConclusion.definition().roles.some((roleUse) => roleUse.role === evidence));
  assert.ok(ProcedureStep.definition().roles.some((roleUse) => roleUse.role === source));
  assert.ok(ProcedureStep.definition().roles.some((roleUse) => roleUse.role === value));

  const text = "Operators must close the gate during an alarm.";
  const unit = sourceUnit("policy-rule", {
    sourceId: "policy",
    text,
    end: text.length
  });
  const rule = makeRule();
  const store = new SemanticStore()
    .installOntology(coreOntology)
    .installOntology(ontology);
  store.beginTransaction("ground operational rule")
    .claim(claim(rule).grounding(groundedAt(unit.span(0, text.length))))
    .commit();

  assert.equal(store.claimsAbout(rule).length, 1);
  assert.equal(store.grounding(rule).length, 1);
  assert.equal(store.grounding(rule)[0].descriptor().sourceId, "policy");
  assert.equal(rule.provenance().length, 0);
});
