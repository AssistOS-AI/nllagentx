import test from "node:test";
import assert from "node:assert/strict";
import { CapabilityRegistry } from "../../../../../../../framework/runtime/planner/registry.mjs";
import exceptionReview from "../../../circuits/exception-justification.circuit.mjs";
import procedureGeneration from "../../../circuits/procedure-plan.circuit.mjs";
import contradictionReview from "../../../circuits/rule-contradiction.circuit.mjs";
import safetyReview from "../../../circuits/safety-evidence.circuit.mjs";
import intentModel from "../intent/intent.mjs";
import task from "../task.mjs";

const instruction = "Generate a controlled procedure plan that orders acknowledgement, authorization, gate action, "
  + "exception justification, and audit recording without adding unstated permissions.";
const values = (entries) => entries.map((entry) => entry.value);

test("IntentJS preserves the exact task instruction as provenance", () => {
  assert.equal(task.instructions.length, 1);
  assert.equal(task.instructions[0].value, instruction);
  assert.deepEqual(intentModel.provenance, task.instructions);
  assert.strictEqual(intentModel.provenance[0], task.instructions[0]);
});

test("IntentJS selects source-grounded controlled procedure generation", () => {
  assert.equal(intentModel.id, task.id);
  assert.deepEqual(values(intentModel.modes), ["generate"]);
  assert.deepEqual(values(intentModel.targets), ["short-operational-policy"]);
  assert.deepEqual(values(intentModel.domains), ["source"]);
  assert.deepEqual(values(intentModel.concerns), ["OperationalProcedureGeneration"]);
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

test("the selected concern resolves only to the reusable procedure-generation circuit", () => {
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
    [procedureGeneration.identity]
  );
});
