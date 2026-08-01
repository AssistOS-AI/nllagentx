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
import { renderTaskResponse } from "../tools/response-renderer.mjs";

function finding(code, status) {
  return new Finding({ code, status });
}

function responseComposition(selectedFinding) {
  const entry = Object.freeze({
    finding: selectedFinding,
    rule: null,
    tags: Object.freeze(new Set(["material"]))
  });
  return Object.freeze({
    entries: Object.freeze([entry]),
    groups: Object.freeze([Object.freeze({ key: "problems", entries: Object.freeze([entry]) })]),
    generatedFrames: Object.freeze([]),
    style: "evidence-led",
    grouping: "status-family",
    features: Object.freeze(new Set(["stable-tags"]))
  });
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

test("public CNL renders mapped requirement statements instead of internal codes", async () => {
  const selected = new Finding({
    code: "TRANSFER_UNSUPPORTED",
    status: "VIOLATED",
    message: "The transfer is not supported by every required condition.",
    details: {
      failedRequirements: ["RECEIVING_PARTY_ACKNOWLEDGED"],
      uncertainRequirements: ["EXCURSION_QUARANTINE_PATH"],
      requirementStatements: {
        RECEIVING_PARTY_ACKNOWLEDGED: "The receiving party acknowledged the custody transfer.",
        EXCURSION_QUARANTINE_PATH: "Every recorded excursion follows the required quarantine path."
      }
    }
  });
  const response = await renderTaskResponse({
    runtime: {},
    store: {},
    composition: responseComposition(selected),
    diagnostics: [],
    sourceRegistry: {}
  });
  assert.match(response, /\[CNL:REQUIREMENT-GROUP\] \[STATUS:VIOLATED\] \[COUNT:1\]/);
  assert.match(response, /The receiving party acknowledged the custody transfer\./);
  assert.match(response, /The available input does not determine whether the following required condition holds:/);
  assert.doesNotMatch(response, /RECEIVING_PARTY_ACKNOWLEDGED|EXCURSION_QUARANTINE_PATH/);
  assert.match(response, /\*\*Status:\*\* Not satisfied/);
});

test("public CNL fails closed when a requirement code lacks a semantic statement", async () => {
  const selected = new Finding({
    code: "TRANSFER_UNSUPPORTED",
    status: "VIOLATED",
    details: { failedRequirements: ["RECEIVING_PARTY_ACKNOWLEDGED"] }
  });
  await assert.rejects(renderTaskResponse({
    runtime: {},
    store: {},
    composition: responseComposition(selected),
    diagnostics: [],
    sourceRegistry: {}
  }), /PUBLIC_REQUIREMENT_STATEMENT_REQUIRED: RECEIVING_PARTY_ACKNOWLEDGED/);
});

test("ordinary execution writes qualitative Markdown CNL and keeps technical evidence separate", async () => {
  const projectRoot = resolve(import.meta.dirname, "../..");
  const agentRoot = resolve(projectRoot, "examples", "validation-agent");
  const taskRoot = resolve(agentRoot, "tasks", "task-symbolic-validation");
  const result = await executeTask({ projectRoot, agentRoot, taskRoot, assurance: "all" });
  assert.match(result.response, /\[CNL:DOCUMENT\]/);
  assert.match(result.response, /\[CNL:FINDING\].*\[CODE:ORDER_OK\]/);
  assert.match(result.response, /> The alarm sounded in Building A at 08:57\./);
  assert.match(result.response, /\[CNL:EVIDENCE\] \[COUNT:2\]/);
  assert.match(result.response, /\[CNL:SOURCE-QUOTE\] \[SOURCE:source-001\]/);
  assert.match(result.response, /> — Exact source text copied from \[source-001\]\(\.\.\/source\/incident\.txt\)/);
  assert.doesNotMatch(result.response, /characters\s+\d+[–-]\d+/i);
  assert.doesNotMatch(result.response, /nll\.source-span|Object\.freeze|NOT_APPLICABLE/);
  assert.equal(await readFile(resolve(taskRoot, "results", "response.md"), "utf8"), result.response);
  assert.match(await readFile(resolve(taskRoot, "results", "artifacts.md"), "utf8"), /## Technical execution evidence/);
  assert.doesNotMatch(await readFile(resolve(taskRoot, "results", "observations.cnl"), "utf8"), /role=\(value\)|implementation=/);
  assert.ok(result.runtime.responseCircuits.some((circuit) => circuit.id === "validation-agent.EvidencePresentation"));
  assert.ok(result.composition.selectedCircuits.some((identity) => identity.includes("validation-agent.EvidencePresentation")));
  assert.ok(result.composition.features.has("validation-agent-policy"));
});
