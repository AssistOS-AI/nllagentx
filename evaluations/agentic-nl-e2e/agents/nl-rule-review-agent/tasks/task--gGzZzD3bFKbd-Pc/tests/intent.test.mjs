import test from "node:test";
import assert from "node:assert/strict";
import { ResponseDirective } from "../../../../../../../framework/sdk/cnl/index.mjs";
import { CapabilityRegistry } from "../../../../../../../framework/runtime/planner/registry.mjs";
import exceptionReview from "../../../circuits/exception-justification.circuit.mjs";
import procedureGeneration from "../../../circuits/procedure-plan.circuit.mjs";
import contradictionReview from "../../../circuits/rule-contradiction.circuit.mjs";
import safetyReview from "../../../circuits/safety-evidence.circuit.mjs";
import intentModel from "../intent/intent.mjs";
import task from "../task.mjs";

const instruction = "Analyze the policy for mutually incompatible rules. Produce evidence-grounded "
  + "findings and preserve the absence of any stated priority or exception.";
const values = (entries) => entries.map((entry) => entry.value);
const directives = (entries) => entries.map((entry) => [entry.kind, entry.value]);

test("IntentJS preserves the exact task instruction as provenance", () => {
  assert.equal(task.instructions.length, 1);
  assert.equal(task.instructions[0].value, instruction);
  assert.deepEqual(intentModel.provenance, task.instructions);
  assert.strictEqual(intentModel.provenance[0], task.instructions[0]);
});

test("IntentJS requests source-grounded contradiction review and Markdown CNL", () => {
  assert.equal(intentModel.id, task.id);
  assert.deepEqual(values(intentModel.modes), ["analyze"]);
  assert.deepEqual(values(intentModel.targets), ["short-operational-policy"]);
  assert.deepEqual(values(intentModel.domains), ["source"]);
  assert.deepEqual(values(intentModel.concerns), ["RuleContradictionReview"]);
  assert.deepEqual(values(intentModel.evidence), ["source-grounded", "interpretation-robust"]);
  assert.deepEqual(values(intentModel.assurances), [
    "concrete-execution",
    "abstract-preflight",
    "symbolic-decision-coverage"
  ]);
  assert.deepEqual(values(intentModel.outputs), ["findings", "cnl-observations", "markdown-cnl"]);
  assert.deepEqual(values(task.outputs), ["findings", "cnl-observations", "markdown-cnl"]);
  assert.deepEqual(intentModel.exclusions, []);
  assert.equal(intentModel.fallback.value, "all-compatible");
  assert.ok(Object.isFrozen(intentModel));
});

test("IntentJS declares the evidence-led qualitative response policy", () => {
  assert.deepEqual(directives(intentModel.presentation), [
    ["style", "evidence-led"],
    ["group-by", "status-family"],
    ["feature", "explain-rules"],
    ["feature", "quote-evidence"],
    ["feature", "count-groups"],
    ["feature", "stable-tags"]
  ]);
  assert.ok(intentModel.presentation.every((entry) => entry instanceof ResponseDirective));
  assert.ok(intentModel.presentation.every(Object.isFrozen));
  assert.ok(!values(intentModel.presentation).includes("include-satisfied"));
});

test("the selected concern resolves only to the reusable contradiction circuit", () => {
  const registry = new CapabilityRegistry();
  for (const circuit of [
    exceptionReview,
    procedureGeneration,
    contradictionReview,
    safetyReview
  ]) {
    registry.registerCircuit(circuit);
  }

  assert.deepEqual(
    registry.providersFor(intentModel.concerns[0].value).map((circuit) => circuit.identity),
    [contradictionReview.identity]
  );
});
