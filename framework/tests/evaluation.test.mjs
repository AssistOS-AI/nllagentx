import test from "node:test";
import assert from "node:assert/strict";
import { evaluationSuite, taskCase, materialization, ordinaryReplay, defaultSemanticMetrics } from "../sdk/evaluation/index.mjs";
import { classificationMetrics, aggregateMetrics } from "../sdk/evaluation/metrics.mjs";
import { CodexAdapter, createCodingAgentAdapter } from "../tools/coding-agent.mjs";
import { evaluationExpectationFailures, evaluationResponseFailures, scoredActualFindings } from "../evaluation/runner.mjs";

test("evaluation suite is an immutable executable authoring contract", () => {
  const suite = evaluationSuite("unit-suite")
    .agentTemplate("isolated")
    .agentBrief("agent-brief.md")
    .authorAgent("architect", "ontology", "circuit")
    .authorTasks("intent", "longtext")
    .profiles("minimal-core")
    .tasks(taskCase("one", { source: "one.txt" }))
    .modes(materialization(), ordinaryReplay())
    .codingAgent("codex")
    .metrics(defaultSemanticMetrics())
    .retainAllArtifacts()
    .seal();
  assert.equal(suite.id, "unit-suite");
  assert.equal(suite.taskValues[0].value, "one");
  assert.deepEqual(suite.agentAuthoringValues, ["architect", "ontology", "circuit"]);
  assert.deepEqual(suite.taskAuthoringValues, ["intent", "longtext"]);
  assert.equal(suite.retainArtifacts, true);
  assert.ok(Object.isFrozen(suite));
  assert.throws(
    () => evaluationSuite("bad").agentTemplate("isolated").authorAgent("ontology").tasks(taskCase("one")).seal(),
    /EVALUATION_AGENT_BRIEF_REQUIRED/
  );
});

test("semantic classification and aggregation retain exact counts", () => {
  const result = classificationMetrics(["a", "b"], ["b", "c"]); assert.deepEqual({ truePositive: result.truePositive, falsePositive: result.falsePositive, falseNegative: result.falseNegative }, { truePositive: 1, falsePositive: 1, falseNegative: 1 });
  assert.equal(result.f1, 0.5); assert.deepEqual(aggregateMetrics([{ metrics: { f1: 0.5 } }, { metrics: { f1: 1 } }]), { f1: 0.75 });
});

test("coding-agent creation keeps Codex as the first replaceable adapter", () => {
  assert.ok(createCodingAgentAdapter("codex") instanceof CodexAdapter);
  assert.throws(() => createCodingAgentAdapter("unregistered-agent"), /CODING_AGENT_ADAPTER_UNKNOWN/);
});

test("evaluation acceptance rejects unexpected material findings but permits inapplicable circuits", () => {
  assert.deepEqual(
    evaluationExpectationFailures({
      actual: ["TARGET:VIOLATED", "UNRELATED:NOT_APPLICABLE"],
      expected: ["TARGET:VIOLATED"]
    }),
    []
  );
  assert.deepEqual(
    evaluationExpectationFailures({
      actual: ["TARGET:VIOLATED", "SPURIOUS:UNKNOWN"],
      expected: ["TARGET:VIOLATED"]
    }),
    ["unexpected material finding SPURIOUS:UNKNOWN"]
  );
  assert.deepEqual(
    scoredActualFindings(
      ["TARGET:VIOLATED", "UNRELATED:NOT_APPLICABLE"],
      ["TARGET:VIOLATED"]
    ),
    ["TARGET:VIOLATED"]
  );
});

test("evaluation acceptance treats qualitative Markdown CNL as the primary response contract", () => {
  const source = "Rule A requires acknowledgement before access.";
  const response = `# Response

[CNL:DOCUMENT] [STYLE:evidence-led]
[CNL:FINDING] [CODE:MISSING_ACK] [STATUS:VIOLATED] [GROUP:violations] [MATERIAL]

> ${source}
`;
  assert.deepEqual(evaluationResponseFailures({ response, expected: ["MISSING_ACK:VIOLATED"], sourceText: source }), []);
  assert.deepEqual(
    evaluationResponseFailures({
      response: `${response}\n[CNL:FINDING] [CODE:OTHER_NOT_APPLICABLE] [STATUS:NOT_APPLICABLE]`,
      expected: ["MISSING_ACK:VIOLATED"],
      sourceText: source
    }),
    ["primary response includes a non-applicable result"]
  );
});
