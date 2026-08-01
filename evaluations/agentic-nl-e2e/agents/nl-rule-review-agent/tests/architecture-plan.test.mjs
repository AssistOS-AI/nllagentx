import test from "node:test";
import assert from "node:assert/strict";
import agent from "../agent.mjs";
import profile from "../profiles/minimal-core.profile.mjs";
import architecturePlan, {
  artifactOwnership,
  circuitContracts,
  handoff,
  ontologyAllocation,
  selectedSpecifications,
  testObligations
} from "../architecture-plan.mjs";
import workPlan from "../work-plan.mjs";

test("agent resolves an isolated core-language profile with direct editing", () => {
  assert.deepEqual(agent.packs.map((directive) => directive.value), ["core-language"]);
  assert.equal(agent.defaultProfile.value, "minimal-core");
  assert.equal(agent.codingAgent.options.editingMode, "direct");
  assert.deepEqual(profile.packs.map((directive) => directive.value), ["core-language"]);
  assert.equal(profile.fallback.kind, "all-compatible-within-loaded-packs");
  assert.equal(profile.selection.kind, "run-every-compatible-circuit");
});

test("architecture plan names specifications, artifacts, tests, and an unblocked handoff", () => {
  assert.equal(architecturePlan.id, "nl-rule-review-agent.architecture");
  assert.deepEqual(architecturePlan.designSpecifications, [
    "DS-000",
    "DS-004",
    "DS035",
    "DS041",
    "DS034",
    "DS001",
    "DS022"
  ]);
  assert.ok(selectedSpecifications.includes("docs/specs/DS041-agentic-natural-language-authoring.md"));
  assert.ok(selectedSpecifications.every((path) => path.endsWith(".md")));
  assert.ok(artifactOwnership.some((entry) => entry.path.endsWith(".ontology.mjs")));
  assert.equal(artifactOwnership.filter((entry) => entry.path.endsWith(".circuit.mjs")).length, 4);
  assert.equal(ontologyAllocation.length, 9);
  assert.equal(circuitContracts.length, 4);
  assert.ok(testObligations.some((obligation) => obligation.includes("UNKNOWN")));
  assert.equal(handoff.nextSkill, "nll-ontology");
  assert.deepEqual(handoff.blockers, []);
});

test("work plan orders owning skills and declares focused deterministic checks", () => {
  assert.deepEqual(
    workPlan.flatMap((phase) => phase.skills),
    ["nll-ontology", "nll-circuit", "nll-test", "nll-intent", "nll-longtext"]
  );
  assert.ok(workPlan.every((phase) => phase.adapter === "codex"));
  assert.ok(workPlan.every((phase) => phase.checks.length > 0));
  assert.ok(workPlan.flatMap((phase) => phase.editRoots).includes("tests/cnl.test.mjs"));
});
