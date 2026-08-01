import test from "node:test";
import assert from "node:assert/strict";
import agent from "../agent.mjs";
import profile from "../profiles/minimal-core.profile.mjs";
import architecturePlan, {
  artifactOwnership,
  circuitContracts,
  evaluationCases,
  findingOutputContract,
  handoff,
  intentPresentationPolicy,
  ontologyAllocation,
  responseCircuitDecision,
  selectedSpecifications,
  sourceFactAllocation,
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
    "DS042",
    "DS043",
    "DS044",
    "DS034",
    "DS001",
    "DS022"
  ]);
  assert.ok(selectedSpecifications.includes("docs/specs/DS041-agentic-natural-language-authoring.md"));
  assert.ok(selectedSpecifications.includes("docs/specs/DS043-primary-markdown-cnl-response.md"));
  assert.ok(selectedSpecifications.includes(
    "docs/specs/DS044-response-circuit-composition-and-intent-presentation.md"
  ));
  assert.ok(selectedSpecifications.every((path) => path.endsWith(".md")));
  assert.ok(architecturePlan.contextArtifacts.some(
    (artifact) => artifact.name === "RESPONSE_CIRCUIT_CATALOG.md"
  ));
  assert.ok(architecturePlan.tools.some(
    (tool) => tool.command === "nllAgent catalog response"
  ));
  assert.ok(artifactOwnership.some((entry) => entry.path.endsWith(".ontology.mjs")));
  assert.equal(artifactOwnership.filter((entry) => entry.path.endsWith(".circuit.mjs")).length, 4);
  assert.ok(artifactOwnership.some((entry) => entry.path === "circuits/review-support.mjs"));
  assert.ok(artifactOwnership.some((entry) => entry.path === "tests/response.test.mjs"));
  assert.equal(ontologyAllocation.length, 9);
  assert.equal(circuitContracts.length, 4);
  assert.ok(circuitContracts.every((contract) => contract.message && contract.exactEvidence));
  assert.ok(testObligations.some((obligation) => obligation.includes("UNKNOWN")));
  assert.ok(testObligations.some((obligation) => obligation.includes("exact verified source quotations")));
  assert.equal(evaluationCases.length, 4);
  assert.equal(handoff.nextSkill, "nll-ontology");
  assert.deepEqual(handoff.blockers, []);
});

test("architecture assigns source facts, IntentJS presentation, and inherited response composition", () => {
  assert.equal(sourceFactAllocation.owner, "tasks/<task-id>/longtext/");
  assert.ok(sourceFactAllocation.includes.some((entry) => entry.includes("SourceSpan")));
  assert.deepEqual(intentPresentationPolicy.outputs, ["findings", "markdown-cnl"]);
  assert.ok(intentPresentationPolicy.analysisDirectives.includes("quoteSourceEvidence()"));
  assert.equal(responseCircuitDecision.customAgentCircuitRequired, false);
  assert.equal(responseCircuitDecision.inherited.length, 4);
  assert.match(findingOutputContract.message, /non-empty qualitative/i);
  assert.ok(findingOutputContract.detailKeys.includes("failedRequirements"));
  assert.match(findingOutputContract.evidence, /verified exact SourceSpan/);
});

test("work plan orders owning skills and declares focused deterministic checks", () => {
  assert.deepEqual(
    workPlan.flatMap((phase) => phase.skills),
    ["nll-ontology", "nll-circuit", "nll-test", "nll-intent", "nll-longtext"]
  );
  assert.ok(workPlan.every((phase) => phase.adapter === "codex"));
  assert.ok(workPlan.every((phase) => phase.checks.length > 0));
  assert.ok(workPlan.flatMap((phase) => phase.editRoots).includes("tests/cnl.test.mjs"));
  assert.ok(workPlan.flatMap((phase) => phase.editRoots).includes("tests/response.test.mjs"));
  assert.ok(workPlan.flatMap((phase) => phase.editRoots).includes("circuits/review-support.mjs"));
});
