import test from "node:test";
import assert from "node:assert/strict";
import coreOntology from "../../../../../../../framework/packs/core-language/ontologies/core.ontology.mjs";
import { CircuitRunner } from "../../../../../../../framework/runtime/circuit-runner.mjs";
import { SemanticStore } from "../../../../../../../framework/runtime/store/semantic-store.mjs";
import exceptionJustificationCircuit from "../../../circuits/exception-justification.circuit.mjs";
import ontology from "../../../ontologies/operational-policy.ontology.mjs";
import {
  EmergencyExceptionInvocation,
  ExceptionJustificationRequirement,
  JustificationRecord,
  action,
  actor,
  context,
  invocation
} from "../sdk/ontology.generated.mjs";
import longText, {
  emergencyAccessInvocation,
  emergencyAccessInvocationClaim,
  justificationRequirement,
  justificationRequirementClaim,
  linkedJustificationRecord,
  noLinkedJustificationRecordClaim,
  openingEntryContext,
  operatorAna
} from "../longtext/root.longtext.mjs";
import registry from "../source/source-map.mjs";
import emergencyInvocationsQuery from "./emergency-invocations.query.mjs";

const SOURCE_DIGEST = "3ad54b667bec708994c576a12e842fc93076f8494b63b5759023b176b81ef88f";
const sourceText = registry.source("source-001").text;

function roleValues(term, role) {
  return term.bindings()
    .filter((binding) => binding.role().identity === role.identity())
    .map((binding) => binding.value());
}

function grounding(claimBuilder) {
  return claimBuilder.seal().groundings()[0];
}

function groundingRange(claimBuilder) {
  const span = grounding(claimBuilder);
  return {
    sourceId: span.sourceId(),
    unitId: span.unitId(),
    sourceDigest: span.descriptor().sourceDigest,
    start: span.start(),
    end: span.end()
  };
}

test("LongTextJS grounds the decisive requirement, invocation, and denial at exact offsets", () => {
  assert.deepEqual(groundingRange(justificationRequirementClaim), {
    sourceId: "source-001",
    unitId: "source-001:unit-0001",
    sourceDigest: SOURCE_DIGEST,
    start: 46,
    end: 144
  });
  assert.deepEqual(groundingRange(emergencyAccessInvocationClaim), {
    sourceId: "source-001",
    unitId: "source-001:unit-0001",
    sourceDigest: SOURCE_DIGEST,
    start: 157,
    end: 245
  });
  assert.deepEqual(groundingRange(noLinkedJustificationRecordClaim), {
    sourceId: "source-001",
    unitId: "source-001:unit-0001",
    sourceDigest: SOURCE_DIGEST,
    start: 284,
    end: 349
  });

  assert.equal(
    sourceText.slice(46, 144),
    "Every use of the emergency-access exception must have a recorded reason linked to that invocation."
  );
  assert.equal(
    sourceText.slice(157, 245),
    "At 09:02, operator Ana invoked the emergency-access exception and opened the north gate."
  );
  assert.equal(
    sourceText.slice(284, 349),
    "It contains no reason or justification record for the invocation."
  );
  assert.ok([
    justificationRequirementClaim,
    emergencyAccessInvocationClaim,
    noLinkedJustificationRecordClaim
  ].every((claimBuilder) => registry.verify(grounding(claimBuilder)).valid));
});

test("the policy requirement applies universally and the logged invocation preserves its participants", () => {
  assert.equal(justificationRequirement.concept(), ExceptionJustificationRequirement.identity());
  assert.deepEqual(roleValues(justificationRequirement, action), []);
  assert.equal(emergencyAccessInvocation.concept(), EmergencyExceptionInvocation.identity());
  assert.deepEqual(roleValues(emergencyAccessInvocation, actor), [operatorAna]);
  assert.deepEqual(roleValues(emergencyAccessInvocation, context), [openingEntryContext]);
  assert.equal(justificationRequirementClaim.seal().descriptor().modality.value(), "obligatory");
  assert.equal(emergencyAccessInvocationClaim.seal().descriptor().modality.value(), "actual");
});

test("the source denial links a record only to the invocation and invents no justification content", () => {
  assert.equal(linkedJustificationRecord.concept(), JustificationRecord.identity());
  assert.deepEqual(roleValues(linkedJustificationRecord, invocation), [emergencyAccessInvocation]);
  assert.deepEqual(
    linkedJustificationRecord.bindings().map((binding) => binding.role().identity),
    [invocation.identity()]
  );
  assert.equal(noLinkedJustificationRecordClaim.seal().descriptor().polarity.value(), "denied");
});

test("coverage is closed only for the three fully inspected review concepts", () => {
  assert.equal(longText.claims.length, 3);
  assert.equal(longText.coverage.length, 3);
  const coverageByConcept = new Map(
    longText.coverage.map((entry) => [entry.descriptor().concept.identity(), entry])
  );
  assert.deepEqual([...coverageByConcept.keys()].sort(), [
    EmergencyExceptionInvocation.identity(),
    ExceptionJustificationRequirement.identity(),
    JustificationRecord.identity()
  ].sort());
  assert.ok([...coverageByConcept.values()]
    .every((entry) => entry.descriptor().status === "closed"));
  assert.ok([...coverageByConcept.values()]
    .every((entry) => entry.descriptor().sources.length === 1));
});

test("the reusable review circuit reports the missing record without inventing a reason", async () => {
  const store = new SemanticStore()
    .installOntology(coreOntology)
    .installOntology(ontology);
  store.beginTransaction("task longtext")
    .longText(longText)
    .commit();

  const invocationMatches = store.query(emergencyInvocationsQuery);
  assert.equal(invocationMatches.length, 1);
  assert.equal(invocationMatches[0].term.identity(), emergencyAccessInvocation.identity());

  const execution = await new CircuitRunner().run(exceptionJustificationCircuit, store);
  assert.equal(execution.findings.length, 1);
  const finding = execution.findings[0];
  assert.equal(finding.code(), "MISSING_EXCEPTION_JUSTIFICATION");
  assert.equal(finding.status(), "VIOLATED");
  assert.equal(finding.descriptor().details.checkedInvocations, 1);
  assert.deepEqual(finding.descriptor().details.justificationRecords, []);
  assert.deepEqual(finding.descriptor().details.failedRequirements, [
    "A source-grounded justification record must link to the invocation."
  ]);

  const groundedOffsets = [...finding.evidence()]
    .filter((entry) => entry.sort() === "SourceSpan")
    .map((span) => [span.start(), span.end()])
    .sort((left, right) => left[0] - right[0]);
  assert.deepEqual(groundedOffsets, [[46, 144], [157, 245], [284, 349]]);
});
