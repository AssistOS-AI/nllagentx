import test from "node:test";
import assert from "node:assert/strict";
import { ResponseDirective } from "../../../../../../../framework/sdk/cnl/index.mjs";
import intentModel from "../intent/intent.mjs";
import task from "../task.mjs";

const instruction = "Determine whether the stated release conclusion is supported under every "
  + "custody-transfer precondition in the source. Distinguish recorded evidence from valid evidence, report "
  + "every absent or invalid required support with exact source provenance, preserve uncertainty instead of "
  + "assuming omitted facts, and produce executable semantic results that can be replayed without another "
  + "model call.";
const values = (entries) => entries.map((entry) => entry.value);
const directives = (entries) => entries.map((entry) => [entry.kind, entry.value]);

test("IntentJS preserves the exact task instruction as provenance", () => {
  assert.equal(task.instructions.length, 1);
  assert.equal(task.instructions[0].value, instruction);
  assert.deepEqual(intentModel.provenance, task.instructions);
  assert.strictEqual(intentModel.provenance[0], task.instructions[0]);
});

test("IntentJS requests the complete source-grounded transfer-release audit and Markdown CNL", () => {
  assert.equal(intentModel.id, task.id);
  assert.deepEqual(values(intentModel.modes), ["analyze"]);
  assert.deepEqual(values(intentModel.targets), ["cold-chain-transfer-policy"]);
  assert.deepEqual(values(intentModel.domains), ["source"]);
  assert.deepEqual(values(intentModel.concerns), ["ColdChainTransferReleaseSupport"]);
  assert.equal(intentModel.scope.value, "entire-source-set");
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
