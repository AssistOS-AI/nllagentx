import test from "node:test";
import assert from "node:assert/strict";
import coreOntology from "../../../../../../../framework/packs/core-language/ontologies/core.ontology.mjs";
import { CircuitRunner } from "../../../../../../../framework/runtime/circuit-runner.mjs";
import { SemanticStore } from "../../../../../../../framework/runtime/store/semantic-store.mjs";
import safetyEvidenceCircuit from "../../../circuits/safety-evidence.circuit.mjs";
import ontology from "../../../ontologies/operational-policy.ontology.mjs";
import {
  Event,
  Evidence,
  Proposition,
  SafetyConclusion,
  SupportsSafetyConclusion,
  actor
} from "../sdk/ontology.generated.mjs";
import longText, {
  alarmSoundingClaim,
  claimedOperatorTraining,
  claimedOperatorTrainingClaim,
  memoAuthor,
  noSupportingEvidenceClaim,
  northGateOpeningClaim,
  safetyConclusion,
  safetyConclusionClaim,
  semanticDiagnostics,
  supportingEvidencePresent
} from "../longtext/root.longtext.mjs";
import safetyConclusionsQuery from "./safety-conclusions.query.mjs";

const SOURCE_DIGEST = "8f2db1ef1d41384666f475e0795959e7d666fd19b7c8cb8aef90561a1817da0d";

function roleValues(term, role) {
  return term.bindings()
    .filter((binding) => binding.role().identity === role.identity())
    .map((binding) => binding.value());
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

function taskStore() {
  const store = new SemanticStore()
    .installOntology(coreOntology)
    .installOntology(ontology);
  store.beginTransaction("task longtext")
    .longText(longText)
    .commit();
  return store;
}

test("LongTextJS grounds every materialized source statement at exact offsets", () => {
  assert.deepEqual(groundingRange(alarmSoundingClaim), {
    sourceId: "source-001",
    unitId: "source-001:unit-0001",
    sourceDigest: SOURCE_DIGEST,
    start: 20,
    end: 47
  });
  assert.deepEqual(groundingRange(northGateOpeningClaim), {
    sourceId: "source-001",
    unitId: "source-001:unit-0001",
    sourceDigest: SOURCE_DIGEST,
    start: 48,
    end: 83
  });
  assert.deepEqual(groundingRange(safetyConclusionClaim), {
    sourceId: "source-001",
    unitId: "source-001:unit-0001",
    sourceDigest: SOURCE_DIGEST,
    start: 84,
    end: 175
  });
  assert.deepEqual(groundingRange(claimedOperatorTrainingClaim), {
    sourceId: "source-001",
    unitId: "source-001:unit-0001",
    sourceDigest: SOURCE_DIGEST,
    start: 143,
    end: 173
  });
  assert.deepEqual(groundingRange(noSupportingEvidenceClaim), {
    sourceId: "source-001",
    unitId: "source-001:unit-0001",
    sourceDigest: SOURCE_DIGEST,
    start: 177,
    end: 291
  });
});

test("the quoted safety conclusion and training rationale remain attributed claims", () => {
  assert.equal(safetyConclusion.concept(), SafetyConclusion.identity());
  assert.deepEqual(roleValues(safetyConclusion, actor), [memoAuthor]);
  assert.equal(safetyConclusionClaim.seal().descriptor().voice.identity(), memoAuthor.identity());
  assert.equal(claimedOperatorTraining.concept(), Proposition.identity());
  assert.equal(
    claimedOperatorTrainingClaim.seal().descriptor().voice.identity(),
    memoAuthor.identity()
  );
  assert.equal(noSupportingEvidenceClaim.seal().descriptor().polarity.value(), "denied");
});

test("the attributed rationale is not promoted to verified supporting evidence", () => {
  const store = taskStore();
  const evidenceTerms = store.allTerms()
    .filter((term) => store.isSubtype(term, Evidence));
  const supportTerms = store.allTerms()
    .filter((term) => store.isSubtype(term, SupportsSafetyConclusion));

  assert.equal(evidenceTerms.length, 1);
  assert.deepEqual(supportTerms, [supportingEvidencePresent]);
  assert.equal(noSupportingEvidenceClaim.seal().descriptor().polarity.value(), "denied");
  assert.deepEqual(semanticDiagnostics.map((entry) => entry.code()), [
    "LONGTEXT_CLAIMED_RATIONALE_NOT_EVIDENCE"
  ]);
  assert.ok(semanticDiagnostics.every((entry) => entry.severity() === "warning"));
});

test("coverage is closed only for the conclusion and its support relation", () => {
  assert.equal(longText.claims.length, 5);
  assert.equal(longText.coverage.length, 4);
  const coverageByConcept = new Map(
    longText.coverage.map((entry) => [entry.descriptor().concept.identity(), entry])
  );

  assert.equal(coverageByConcept.get(SafetyConclusion.identity()).descriptor().status, "closed");
  assert.equal(
    coverageByConcept.get(SupportsSafetyConclusion.identity()).descriptor().status,
    "closed"
  );
  assert.equal(coverageByConcept.get(Event.identity()).descriptor().status, "partial");
  assert.equal(coverageByConcept.get(Proposition.identity()).descriptor().status, "partial");
});

test("the reusable circuit emits an evidence-grounded unsupported conclusion", async () => {
  const store = taskStore();
  const conclusionMatches = store.query(safetyConclusionsQuery);
  assert.equal(conclusionMatches.length, 1);
  assert.equal(conclusionMatches[0].term.identity(), safetyConclusion.identity());

  const execution = await new CircuitRunner().run(safetyEvidenceCircuit, store);
  assert.equal(execution.findings.length, 1);
  const finding = execution.findings[0];
  assert.equal(finding.code(), "UNSUPPORTED_SAFETY_CONCLUSION");
  assert.equal(finding.status(), "VIOLATED");
  assert.deepEqual(finding.descriptor().details.supportLinks, []);
  assert.deepEqual(finding.descriptor().details.supportingEvidence, []);

  const groundedOffsets = [...finding.evidence()]
    .filter((entry) => entry.sort() === "SourceSpan")
    .map((span) => [span.start(), span.end()])
    .sort((left, right) => left[0] - right[0]);
  assert.deepEqual(groundedOffsets, [[84, 175], [177, 291]]);
});
