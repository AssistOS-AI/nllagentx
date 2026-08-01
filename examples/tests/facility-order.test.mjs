import test from "node:test";
import assert from "node:assert/strict";
import { runFixture } from "../../framework/test-support/harness/run-fixture.mjs";

// Reference test shape; the fixture harness is implemented under DS-005.
test("opening after alarm is satisfied with source evidence", async () => {
  const result = await runFixture({
    ontology: "../ontologies/facility.ontology.mjs",
    longtext: "../longtexts/facility-task.longtext.mjs",
    circuit: "../circuits/facility-order.circuit.mjs"
  });

  assert.equal(result.findings[0].status(), "SATISFIED");
  assert.ok(result.findings[0].evidence().size() >= 2);
});
