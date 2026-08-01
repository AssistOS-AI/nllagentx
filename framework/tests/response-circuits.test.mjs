import test from "node:test";
import assert from "node:assert/strict";
import { resolve } from "node:path";
import { readFile } from "node:fs/promises";
import { Finding } from "../sdk/circuit/decisions.mjs";
import { analyze, intent } from "../sdk/intent/intent.mjs";
import {
  concise,
  groupResultsBy,
  includeSatisfiedResults,
  responseCircuit,
  responseStage
} from "../sdk/cnl/response.mjs";
import { composeResponse } from "../runtime/response/composer.mjs";
import { executeTask } from "../tools/executor.mjs";

function finding(code, status) {
  return new Finding({ code, status });
}

test("response circuits omit internal and non-applicable results and group material findings", () => {
  const selectedIntent = intent("response-materiality").mode(analyze()).seal();
  const composition = composeResponse({
    intent: selectedIntent,
    findings: [
      finding("CoreGroundingFinding.grounded", "SATISFIED"),
      finding("UNRELATED_NOT_APPLICABLE", "NOT_APPLICABLE"),
      finding("RULE_CONTRADICTION", "CONFLICT"),
      finding("SECONDARY_CONFIRMATION", "SATISFIED")
    ],
    frames: [],
    executions: []
  });
  assert.deepEqual(composition.entries.map((entry) => entry.finding.code()), ["RULE_CONTRADICTION"]);
  assert.deepEqual(composition.groups.map((group) => [group.key, group.entries.length]), [["conflicts", 1]]);
  assert.equal(composition.style, "evidence-led");
  assert.ok(composition.selectedCircuits.some((identity) => identity.includes("MaterialSelection")));
});

test("IntentJS presentation directives select style, grouping, and satisfied results", () => {
  const selectedIntent = intent("response-directives")
    .mode(analyze())
    .present(concise(), groupResultsBy("code"), includeSatisfiedResults())
    .seal();
  const composition = composeResponse({
    intent: selectedIntent,
    findings: [finding("BROKEN_RULE", "VIOLATED"), finding("SUPPORTED_RULE", "SATISFIED")],
    frames: [],
    executions: []
  });
  assert.equal(composition.style, "concise");
  assert.deepEqual(composition.groups.map((group) => group.key), ["BROKEN_RULE", "SUPPORTED_RULE"]);
  assert.equal(composition.entries.length, 2);
  assert.ok(composition.features.has("stable-tags"));
});

test("response circuits cannot invent semantic findings", () => {
  const selectedIntent = intent("response-truth-boundary").mode(analyze()).seal();
  const existing = finding("SOURCE_GROUNDED", "SATISFIED");
  const malicious = responseCircuit("test.InventFinding", "1.0.0")
    .priority(100)
    .use(responseStage("test.inject", (state) => ({
      ...state,
      entries: Object.freeze([{ finding: finding("INVENTED", "VIOLATED") }])
    })))
    .seal();
  assert.throws(() => composeResponse({
    intent: selectedIntent,
    findings: [existing],
    frames: [],
    executions: [],
    circuits: [malicious]
  }), /RESPONSE_STAGE_INVENTED_FINDING/);
});

test("ordinary execution writes qualitative Markdown CNL and keeps technical evidence separate", async () => {
  const projectRoot = resolve(import.meta.dirname, "../..");
  const agentRoot = resolve(projectRoot, "examples", "validation-agent");
  const taskRoot = resolve(agentRoot, "tasks", "task-symbolic-validation");
  const result = await executeTask({ projectRoot, agentRoot, taskRoot, assurance: "all" });
  assert.match(result.response, /\[CNL:DOCUMENT\]/);
  assert.match(result.response, /\[CNL:FINDING\].*\[CODE:ORDER_OK\]/);
  assert.match(result.response, /> The alarm sounded in Building A at 08:57\./);
  assert.doesNotMatch(result.response, /nll\.source-span|Object\.freeze|NOT_APPLICABLE/);
  assert.equal(await readFile(resolve(taskRoot, "results", "response.md"), "utf8"), result.response);
  assert.match(await readFile(resolve(taskRoot, "results", "artifacts.md"), "utf8"), /## Technical execution evidence/);
  assert.doesNotMatch(await readFile(resolve(taskRoot, "results", "observations.cnl"), "utf8"), /role=\(value\)|implementation=/);
  assert.ok(result.runtime.responseCircuits.some((circuit) => circuit.id === "validation-agent.EvidencePresentation"));
  assert.ok(result.composition.selectedCircuits.some((identity) => identity.includes("validation-agent.EvidencePresentation")));
  assert.ok(result.composition.features.has("validation-agent-policy"));
});
