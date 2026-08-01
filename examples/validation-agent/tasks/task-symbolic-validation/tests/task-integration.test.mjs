import test from "node:test";
import assert from "node:assert/strict";
import { resolve } from "node:path";
import { runFixture } from "../../../../../framework/test-support/harness/run-fixture.mjs";
import { runSymbolic } from "../../../../../framework/tools/executor.mjs";

const projectRoot = resolve(import.meta.dirname, "../../../../..");
const agentRoot = resolve(import.meta.dirname, "../../..");
const taskRoot = resolve(import.meta.dirname, "..");
const circuitId = "circuit:example.facility-order@1.0.0";

test("task-local LongTextJS drives the reusable facility circuit", async () => {
  const result = await runFixture({
    ontology: "../../../ontologies/facility.ontology.mjs",
    longtext: "../longtext/root.longtext.mjs",
    circuit: "../../../circuits/facility-order.circuit.mjs"
  });
  assert.equal(result.findings[0].code(), "ORDER_OK");
  assert.equal(result.findings[0].status(), "SATISFIED");
  assert.ok(result.findings[0].evidence().size() >= 2);
});

test("symbolic facility paths retain their decision outputs and evidence templates", async () => {
  const result = await runSymbolic({ projectRoot, agentRoot, taskRoot }, circuitId);
  assert.equal(result.guarantee, "path-complete");
  assert.equal(result.paths.length, 4);
  assert.equal(result.pruned, 3);

  const outputs = result.paths.flatMap((path) => path.outputs);
  assert.deepEqual(
    outputs.map((output) => [output.code, output.status]).sort(),
    [
      ["OPENED_BEFORE_ALARM", "VIOLATED"],
      ["ORDER_NOT_ESTABLISHED", "UNKNOWN"],
      ["ORDER_OK", "SATISFIED"],
      ["alarm-before-opening.no-row", "UNKNOWN"]
    ]
  );
  for (const output of outputs) {
    assert.ok(["decision-row", "decision-no-row"].includes(output.kind));
    assert.match(output.decision, /^nll\.CircuitNode\.DecisionTable:/);
    if (output.kind === "decision-row") {
      assert.match(output.condition, /^nll\.PredicateCondition\./);
      assert.equal(output.evidence.length, 2);
      assert.ok(output.evidence.every((identity) => identity.startsWith("nll.query.match:")));
    } else {
      assert.equal(output.condition, null);
      assert.deepEqual(output.evidence, []);
    }
  }
});
