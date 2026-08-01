import test from "node:test";
import assert from "node:assert/strict";
import coreOntology, {
  Event,
  Proposition,
  source
} from "../../../../../framework/packs/core-language/ontologies/core.ontology.mjs";
import { CircuitRunner } from "../../../../../framework/runtime/circuit-runner.mjs";
import { SemanticStore } from "../../../../../framework/runtime/store/semantic-store.mjs";
import { composeResponse } from "../../../../../framework/runtime/response/composer.mjs";
import { responseContractFailures } from "../../../../../framework/runtime/response/contract.mjs";
import {
  countResultGroups,
  emitStableCnlTags,
  evidenceLed,
  explainMatchedRules,
  groupResultsBy,
  procedural,
  quoteSourceEvidence
} from "../../../../../framework/sdk/cnl/response.mjs";
import {
  analyze,
  compositionPlan,
  findings,
  generate,
  intent,
  markdownCnl
} from "../../../../../framework/sdk/intent/intent.mjs";
import { claim, groundedAt } from "../../../../../framework/sdk/longtext/claims.mjs";
import { SourceRegistry } from "../../../../../framework/sdk/longtext/source.mjs";
import { renderTaskResponse } from "../../../../../framework/tools/response-renderer.mjs";
import ontology, {
  OperationalRule,
  ProcedureRequest,
  action,
  condition,
  effect,
  forbiddenEffect,
  requiredEffect
} from "../ontologies/operational-policy.ontology.mjs";
import ruleContradictionCircuit from "../circuits/rule-contradiction.circuit.mjs";
import safetyEvidenceCircuit from "../circuits/safety-evidence.circuit.mjs";
import procedurePlanCircuit from "../circuits/procedure-plan.circuit.mjs";

function sourceFixture(id, text) {
  const registry = new SourceRegistry();
  const registered = registry.register({
    id,
    path: `source/${id}.txt`,
    text
  });
  const store = new SemanticStore()
    .installOntology(coreOntology)
    .installOntology(ontology);
  return { registry, store, unit: registered.units[0] };
}

function groundedClaim(unit, text, excerpt, term) {
  const start = text.indexOf(excerpt);
  assert.notEqual(start, -1, `Missing fixture excerpt: ${excerpt}`);
  return claim(term).grounding(groundedAt(unit.span(start, start + excerpt.length)));
}

function runtime(taskId, selectedIntent) {
  return Object.freeze({
    task: Object.freeze({ id: taskId }),
    intent: selectedIntent
  });
}

async function renderResponse({
  taskId,
  selectedIntent,
  registry,
  store,
  executions
}) {
  const findings = executions.flatMap((execution) => execution.findings);
  const frames = executions.flatMap((execution) => execution.frames);
  const composition = composeResponse({
    intent: selectedIntent,
    findings,
    frames,
    executions
  });
  const response = await renderTaskResponse({
    runtime: runtime(taskId, selectedIntent),
    store,
    composition,
    diagnostics: [],
    sourceRegistry: registry
  });
  return { composition, findings, frames, response };
}

test("analysis response quotes both conflicting rules and suppresses non-applicable results", async () => {
  const firstRuleText = "Rule one requires closing the north gate during an alarm.";
  const secondRuleText = "Rule two forbids closing the north gate during an alarm.";
  const text = `${firstRuleText}\n${secondRuleText}\n`;
  const { registry, store, unit } = sourceFixture("conflicting-rules", text);
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
  store.beginTransaction("response conflict evidence")
    .claim(
      groundedClaim(unit, text, firstRuleText, requiredRule),
      groundedClaim(unit, text, secondRuleText, forbiddenRule)
    )
    .commit();

  const runner = new CircuitRunner();
  const conflictExecution = await runner.run(ruleContradictionCircuit, store);
  const nonApplicableExecution = await runner.run(safetyEvidenceCircuit, store);
  const selectedIntent = intent("conflict-response")
    .mode(analyze())
    .outputs(findings(), markdownCnl())
    .present(
      evidenceLed(),
      groupResultsBy("status-family"),
      explainMatchedRules(),
      quoteSourceEvidence(),
      countResultGroups(),
      emitStableCnlTags()
    )
    .seal();
  const rendered = await renderResponse({
    taskId: "conflict-response",
    selectedIntent,
    registry,
    store,
    executions: [conflictExecution, nonApplicableExecution]
  });

  assert.deepEqual(rendered.composition.entries.map(
    (entry) => `${entry.finding.code()}:${entry.finding.status()}`
  ), ["RULE_CONTRADICTION:CONFLICT"]);
  assert.deepEqual(rendered.composition.groups.map(
    (group) => [group.key, group.entries.length]
  ), [["conflicts", 1]]);
  assert.match(rendered.response, /\[CNL:GROUP\] \[KEY:conflicts\] \[COUNT:1\]/);
  assert.match(
    rendered.response,
    /\[CNL:FINDING\] \[CODE:RULE_CONTRADICTION\] \[STATUS:CONFLICT\].*\[MATERIAL\]/
  );
  assert.match(rendered.response, /one requires it while the other forbids it/i);
  assert.match(rendered.response, /\[CNL:REQUIREMENT-GROUP\] \[STATUS:CONFLICT\] \[COUNT:1\]/);
  assert.match(rendered.response, /Required conditions with conflicting evidence.*Effects .* must be compatible\./is);
  assert.doesNotMatch(rendered.response, /## Input basis|## Artifacts|No blocking diagnostic/);
  assert.match(rendered.response, /\*\*Rule evaluated:\*\* Incompatible rule effects/);
  assert.ok(rendered.response.includes(`> ${firstRuleText}`));
  assert.ok(rendered.response.includes(`> ${secondRuleText}`));
  assert.match(rendered.response, /\[CNL:EVIDENCE\] \[COUNT:2\]/);
  assert.match(rendered.response, /\[CNL:SOURCE-QUOTE\] \[SOURCE:conflicting-rules\]/);
  assert.doesNotMatch(rendered.response, /NOT_APPLICABLE|SAFETY_CONCLUSION_EVIDENCE_NOT_APPLICABLE/);
  assert.doesNotMatch(rendered.response, /nll\.source-span|Object\.freeze|symbolic-decision-coverage/);
  assert.deepEqual(responseContractFailures({
    response: rendered.response,
    expectedFindings: ["RULE_CONTRADICTION:CONFLICT"],
    sourceTexts: [text]
  }), []);

  const replay = await renderTaskResponse({
    runtime: runtime("conflict-response", selectedIntent),
    store,
    composition: rendered.composition,
    diagnostics: [],
    sourceRegistry: registry
  });
  assert.equal(replay, rendered.response);
});

test("procedural response selects ordered generated frames and retains source quotations", async () => {
  const ruleText = "The operator must close the gate after authorization.";
  const requestText = "Generate an operational procedure from that rule.";
  const text = `${ruleText}\n${requestText}\n`;
  const { registry, store, unit } = sourceFixture("procedure-request", text);
  const rule = OperationalRule(
    action(Event()),
    condition(Proposition()),
    effect(requiredEffect)
  );
  const request = ProcedureRequest(source(rule));
  store.beginTransaction("response procedure evidence")
    .claim(
      groundedClaim(unit, text, ruleText, rule),
      groundedClaim(unit, text, requestText, request)
    )
    .commit();

  const execution = await new CircuitRunner().run(procedurePlanCircuit, store);
  const selectedIntent = intent("procedure-response")
    .mode(generate())
    .outputs(findings(), markdownCnl(), compositionPlan())
    .present(
      procedural(),
      groupResultsBy("status-family"),
      explainMatchedRules(),
      quoteSourceEvidence(),
      countResultGroups(),
      emitStableCnlTags()
    )
    .seal();
  const rendered = await renderResponse({
    taskId: "procedure-response",
    selectedIntent,
    registry,
    store,
    executions: [execution]
  });

  assert.equal(rendered.composition.style, "procedural");
  assert.equal(rendered.composition.generatedFrames.length, 6);
  assert.match(rendered.response, /## Generated procedure/);
  assert.match(rendered.response, /1\. Acknowledge the request and applicable rules\./);
  assert.match(rendered.response, /2\. Confirm authorization before acting\./);
  assert.match(rendered.response, /3\. Perform the governed gate action\./);
  assert.match(rendered.response, /4\. If an emergency exception is invoked, record its justification\./);
  assert.match(rendered.response, /5\. Finish by recording the auditable result\./);
  assert.match(rendered.response, /\[CODE:PROCEDURE_PLAN_READY\] \[STATUS:SATISFIED\]/);
  assert.ok(rendered.response.includes(`> ${ruleText}`));
  assert.ok(rendered.response.includes(`> ${requestText}`));
  assert.doesNotMatch(rendered.response, /^FRAME (?:GenerationPlan|ProcedureStep)/m);
  assert.doesNotMatch(rendered.response, /nll\.source-span|Object\.freeze|assurance path/i);
  assert.deepEqual(responseContractFailures({
    response: rendered.response,
    expectedFindings: ["PROCEDURE_PLAN_READY:SATISFIED"],
    sourceTexts: [text]
  }), []);
});
