import test from "node:test";
import assert from "node:assert/strict";
import coreOntology from "../../../../../../../framework/packs/core-language/ontologies/core.ontology.mjs";
import { CircuitRunner } from "../../../../../../../framework/runtime/circuit-runner.mjs";
import { SemanticStore } from "../../../../../../../framework/runtime/store/semantic-store.mjs";
import ontology from "../../../ontologies/operational-policy.ontology.mjs";
import contradictionCircuit from "../../../circuits/rule-contradiction.circuit.mjs";
import {
  OperationalRule,
  Proposition,
  action,
  condition,
  effect,
  value
} from "../sdk/ontology.generated.mjs";
import longText, {
  noResolvingExceptionClaim,
  noStatedPriorityClaim,
  ruleA,
  ruleAClaim,
  ruleB,
  ruleBClaim,
  semanticDiagnostics
} from "../longtext/root.longtext.mjs";
import operationalRulesQuery from "./operational-rules.query.mjs";

const SOURCE_DIGEST = "d8ad63e92e3285794353f988ffbbcab4867fcb3e1aac6c2764acf13229dd8f29";

function roleValue(term, role) {
  return term.bindings()
    .find((binding) => binding.role().identity === role.identity())
    ?.value();
}

function groundingRange(claimBuilder) {
  const span = claimBuilder.seal().groundings()[0];
  return {
    sourceId: span.sourceId(),
    unitId: span.unitId(),
    sourceDigest: span.descriptor().sourceDigest,
    start: span.start(),
    end: span.end()
  };
}

test("LongTextJS grounds every policy assertion at the exact decoded offsets", () => {
  assert.deepEqual(groundingRange(ruleAClaim), {
    sourceId: "source-001",
    unitId: "source-001:unit-0001",
    sourceDigest: SOURCE_DIGEST,
    start: 25,
    end: 148
  });
  assert.deepEqual(groundingRange(ruleBClaim), {
    sourceId: "source-001",
    unitId: "source-001:unit-0001",
    sourceDigest: SOURCE_DIGEST,
    start: 150,
    end: 267
  });
  assert.deepEqual(groundingRange(noStatedPriorityClaim), {
    sourceId: "source-001",
    unitId: "source-001:unit-0001",
    sourceDigest: SOURCE_DIGEST,
    start: 287,
    end: 324
  });
  assert.deepEqual(groundingRange(noResolvingExceptionClaim), {
    sourceId: "source-001",
    unitId: "source-001:unit-0001",
    sourceDigest: SOURCE_DIGEST,
    start: 335,
    end: 375
  });
});

test("the two rules share their action and condition but require incompatible effects", () => {
  assert.equal(ruleA.concept(), OperationalRule.identity());
  assert.equal(ruleB.concept(), OperationalRule.identity());
  assert.equal(roleValue(ruleA, action).identity(), roleValue(ruleB, action).identity());
  assert.equal(roleValue(ruleA, condition).identity(), roleValue(ruleB, condition).identity());
  assert.equal(roleValue(roleValue(ruleA, effect), value).value(), "forbidden");
  assert.equal(roleValue(roleValue(ruleB, effect), value).value(), "required");
});

test("priority and resolving-exception absences remain explicit without invented ontology terms", () => {
  assert.equal(noStatedPriorityClaim.seal().descriptor().polarity.value(), "denied");
  assert.equal(noResolvingExceptionClaim.seal().descriptor().polarity.value(), "denied");
  assert.deepEqual(semanticDiagnostics.map((entry) => entry.code()), [
    "LONGTEXT_GENERIC_PRIORITY_PROPOSITION",
    "LONGTEXT_GENERIC_RESOLVING_EXCEPTION_PROPOSITION"
  ]);
  assert.ok(semanticDiagnostics.every((entry) => entry.severity() === "warning"));
});

test("coverage is closed only for operational rules", () => {
  assert.equal(longText.claims.length, 4);
  assert.equal(longText.coverage.length, 2);
  const coverageByConcept = new Map(
    longText.coverage.map((entry) => [entry.descriptor().concept.identity(), entry])
  );
  assert.equal(coverageByConcept.get(OperationalRule.identity()).descriptor().status, "closed");
  assert.equal(coverageByConcept.get(Proposition.identity()).descriptor().status, "partial");
});

test("the reusable contradiction circuit emits an evidence-grounded conflict", async () => {
  const store = new SemanticStore()
    .installOntology(coreOntology)
    .installOntology(ontology);
  store.beginTransaction("task longtext")
    .longText(longText)
    .commit();

  assert.equal(store.query(operationalRulesQuery).length, 2);

  const execution = await new CircuitRunner().run(contradictionCircuit, store);
  assert.equal(execution.findings.length, 1);
  const finding = execution.findings[0];
  assert.equal(finding.code(), "RULE_CONTRADICTION");
  assert.equal(finding.status(), "CONFLICT");

  const groundedOffsets = [...finding.evidence()]
    .filter((entry) => entry.sort() === "SourceSpan")
    .map((span) => [span.start(), span.end()])
    .sort((left, right) => left[0] - right[0]);
  assert.deepEqual(groundedOffsets, [[25, 148], [150, 267]]);
});
