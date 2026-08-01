import test from "node:test";
import assert from "node:assert/strict";
import { evaluationSuite, taskCase, materialization, ordinaryReplay, defaultSemanticMetrics } from "../sdk/evaluation/index.mjs";
import { classificationMetrics, aggregateMetrics } from "../sdk/evaluation/metrics.mjs";

test("evaluation suite is an immutable executable contract", () => {
  const suite = evaluationSuite("unit-suite").agentTemplate("isolated").profiles("minimal-core").tasks(taskCase("one", { source: "one.txt" })).modes(materialization(), ordinaryReplay()).codingAgent("codex").metrics(defaultSemanticMetrics()).retainAllArtifacts().seal();
  assert.equal(suite.id, "unit-suite"); assert.equal(suite.taskValues[0].value, "one"); assert.equal(suite.retainArtifacts, true); assert.ok(Object.isFrozen(suite));
});

test("semantic classification and aggregation retain exact counts", () => {
  const result = classificationMetrics(["a", "b"], ["b", "c"]); assert.deepEqual({ truePositive: result.truePositive, falsePositive: result.falsePositive, falseNegative: result.falseNegative }, { truePositive: 1, falsePositive: 1, falseNegative: 1 });
  assert.equal(result.f1, 0.5); assert.deepEqual(aggregateMetrics([{ metrics: { f1: 0.5 } }, { metrics: { f1: 1 } }]), { f1: 0.75 });
});
