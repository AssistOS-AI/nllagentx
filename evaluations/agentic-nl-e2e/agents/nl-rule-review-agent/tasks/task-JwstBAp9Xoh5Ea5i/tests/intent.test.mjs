import test from "node:test";
import assert from "node:assert/strict";
import { CapabilityRegistry } from "../../../../../../../framework/runtime/planner/registry.mjs";
import exceptionReview from "../../../circuits/exception-justification.circuit.mjs";
import procedureGeneration from "../../../circuits/procedure-plan.circuit.mjs";
import contradictionReview from "../../../circuits/rule-contradiction.circuit.mjs";
import safetyReview from "../../../circuits/safety-evidence.circuit.mjs";
import intentModel from "../intent/intent.mjs";
import task from "../task.mjs";

const instruction = "Determine whether every invoked emergency exception has the justification required "
  + "by the policy. Report missing evidence without inventing a reason.";
const values = (entries) => entries.map((entry) => entry.value);

test("IntentJS preserves the exact task instruction as provenance", () => {
  assert.equal(task.instructions.length, 1);
  assert.equal(task.instructions[0].value, instruction);
  assert.deepEqual(intentModel.provenance, task.instructions);
  assert.strictEqual(intentModel.provenance[0], task.instructions[0]);
});

test("IntentJS selects only source-grounded exception-justification review semantics", () => {
  assert.equal(intentModel.id, task.id);
  assert.deepEqual(values(intentModel.modes), ["analyze"]);
  assert.deepEqual(values(intentModel.targets), ["short-operational-policy"]);
  assert.deepEqual(values(intentModel.domains), ["source"]);
  assert.deepEqual(values(intentModel.concerns), ["ExceptionJustificationReview"]);
  assert.deepEqual(values(intentModel.evidence), ["source-grounded", "interpretation-robust"]);
  assert.deepEqual(values(intentModel.assurances), [
    "concrete-execution",
    "abstract-preflight",
    "symbolic-decision-coverage"
  ]);
  assert.deepEqual(values(intentModel.outputs), ["findings", "cnl-observations"]);
  assert.deepEqual(intentModel.exclusions, []);
  assert.equal(intentModel.fallback.value, "all-compatible");
  assert.ok(Object.isFrozen(intentModel));
});

test("the selected concern resolves to the reusable exception-justification circuit", () => {
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
    [exceptionReview.identity]
  );
});
