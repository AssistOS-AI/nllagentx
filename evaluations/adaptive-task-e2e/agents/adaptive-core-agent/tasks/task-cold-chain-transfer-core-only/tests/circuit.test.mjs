import test from "node:test";
import assert from "node:assert/strict";
import { CircuitRunner } from "../../../../../../../framework/runtime/circuit-runner.mjs";
import { abstractCircuit } from "../../../../../../../framework/runtime/methods/abstract/worklist.mjs";
import { SemanticStore } from "../../../../../../../framework/runtime/store/semantic-store.mjs";
import {
  asserted,
  claim,
  denied,
  groundedAt,
  named
} from "../../../../../../../framework/sdk/longtext/index.mjs";
import {
  compareFrames,
  parseCanonicalCNL,
  renderCanonicalCNL
} from "../../../../../../../framework/sdk/cnl/index.mjs";
import coreOntology from "../../../../../../../framework/packs/core-language/ontologies/core.ontology.mjs";
import circuitModel, {
  assessReleaseSupport,
  decideReleaseSupport,
  generateReleaseObservation
} from "../circuits/cold-chain-release.circuit.mjs";
import ontology from "../ontologies/cold-chain-transfer.ontology.mjs";
import registry from "../source/source-map.mjs";
import {
  QuantityValue,
  TemperatureExcursion,
  duration,
  subject,
  temperature,
  transfer
} from "../sdk/ontology.generated.mjs";
import longText, {
  beforeTemperatureReadingClaim,
  afterTemperatureReadingClaim,
  custodyTransferAX17,
  custodyTransferClaim,
  invalidCalibrationAtTransferClaim,
  noReportedTemperatureExcursionClaim,
  northCourierAcknowledgementClaim,
  recordIdentifierRecordingClaim,
  releaseConclusionClaim,
  sampleAX17,
  valeLaboratoryAcknowledgementClaim
} from "../longtext/root.longtext.mjs";

function seal(claimValue) {
  return typeof claimValue?.seal === "function" ? claimValue.seal() : claimValue;
}

function cloneClaim(claimValue, polarity) {
  const sourceClaim = seal(claimValue);
  const descriptor = sourceClaim.descriptor();
  const builder = claim(sourceClaim.proposition())
    .modality(descriptor.modality)
    .polarity(polarity)
    .grounding(...sourceClaim.groundings().map(groundedAt))
    .confidence(descriptor.confidence);
  if (descriptor.voice) builder.statedBy(descriptor.voice);
  if (descriptor.context) builder.within(descriptor.context);
  if (descriptor.interpretation) builder.interpretation(descriptor.interpretation);
  return builder.seal();
}

function storeWithClaims(claims = []) {
  const store = new SemanticStore({ id: "cold-chain-circuit-microcase" })
    .installOntology(coreOntology)
    .installOntology(ontology);
  if (claims.length > 0) {
    store.beginTransaction("cold-chain circuit microcase")
      .claim(...claims.map(seal))
      .commit();
  }
  return store;
}

function baseConcreteClaims() {
  return [
    releaseConclusionClaim,
    custodyTransferClaim,
    recordIdentifierRecordingClaim,
    beforeTemperatureReadingClaim,
    afterTemperatureReadingClaim,
    northCourierAcknowledgementClaim
  ];
}

function noExcursionClaim() {
  const noExcursion = TemperatureExcursion(
    subject(sampleAX17),
    transfer(custodyTransferAX17),
    temperature(QuantityValue(named("above 8.0 °C"))),
    duration(QuantityValue(named("more than five minutes")))
  );
  const groundingClaim = seal(noReportedTemperatureExcursionClaim);
  const descriptor = groundingClaim.descriptor();
  return claim(noExcursion)
    .modality(descriptor.modality)
    .polarity(denied())
    .grounding(...groundingClaim.groundings().map(groundedAt))
    .statedBy(descriptor.voice)
    .within(descriptor.context)
    .confidence(descriptor.confidence)
    .seal();
}

function satisfiedClaims() {
  return [
    ...baseConcreteClaims(),
    cloneClaim(invalidCalibrationAtTransferClaim, asserted()),
    cloneClaim(valeLaboratoryAcknowledgementClaim, asserted()),
    noExcursionClaim()
  ];
}

function evidenceText(finding) {
  const spans = [...finding.evidence()].flatMap((entry) => {
    if (entry?.sort?.() === "SourceSpan") return [entry];
    return typeof entry?.groundings === "function" ? entry.groundings() : [];
  });
  return [...new Map(spans.map((span) => [span.identity(), span])).values()]
    .map((span) => registry.source(span.sourceId()).text.slice(span.start(), span.end()))
    .join("\n");
}

async function findingFor(store) {
  const execution = await new CircuitRunner().run(circuitModel, store);
  assert.equal(execution.findings.length, 1);
  return { execution, finding: execution.findings[0] };
}

test("the task circuit declares composable concrete, abstract, symbolic, and CNL behavior", () => {
  assert.equal(
    circuitModel.identity,
    "circuit:task-cold-chain-transfer.ColdChainTransferReleaseSupport@1.0.0"
  );
  assert.deepEqual(circuitModel.concerns, ["ColdChainTransferReleaseSupport"]);
  assert.ok(circuitModel.provisions.some((entry) => entry.name === "ColdChainTransferReleaseSupport"));
  assert.deepEqual(circuitModel.assurances.map((entry) => entry.kind), [
    "abstract-preflight",
    "symbolic-decision-coverage",
    "cnl-roundtrip"
  ]);
  assert.equal(decideReleaseSupport.descriptor().rows.length, 4);
  assert.equal(decideReleaseSupport.descriptor().exhaustive, true);
  assert.deepEqual(circuitModel.emissions.map((entry) => entry.kind), [
    "finding-emission",
    "cnl-emission"
  ]);
  assert.ok(circuitModel.stages.includes(assessReleaseSupport));
  assert.ok(circuitModel.stages.includes(generateReleaseObservation));

  const abstract = abstractCircuit(circuitModel);
  assert.equal(abstract.converged, true);
  assert.ok(abstract.steps > 0);
});

test("the concrete source violates release support and cites both decisive defects", async () => {
  const store = new SemanticStore({ id: "cold-chain-concrete-source" })
    .installOntology(coreOntology)
    .installOntology(ontology);
  store.beginTransaction("cold-chain concrete source")
    .longText(longText)
    .commit();

  const { execution, finding } = await findingFor(store);
  assert.equal(finding.code(), "COLD_CHAIN_RELEASE_UNSUPPORTED");
  assert.equal(finding.status(), "VIOLATED");
  assert.deepEqual(finding.descriptor().details.failedRequirements, [
    "RECEIVING_PARTY_ACKNOWLEDGED",
    "THERMOMETER_CALIBRATION_VALID"
  ]);
  assert.deepEqual(finding.descriptor().details.uncertainRequirements, [
    "EXCURSION_QUARANTINE_PATH"
  ]);
  assert.equal(
    finding.descriptor().details.requirementStatements.RECEIVING_PARTY_ACKNOWLEDGED,
    "The receiving party acknowledged the custody transfer."
  );
  assert.equal(
    finding.descriptor().details.requirementStatements.THERMOMETER_CALIBRATION_VALID,
    "Every thermometer used for the transfer has a calibration valid at the transfer time."
  );

  const citedText = evidenceText(finding);
  assert.match(citedText, /calibration certificate for TH-9 expired on 13 July 2026/i);
  assert.match(citedText, /no acknowledgement by Vale Laboratory/i);
  assert.equal(execution.frames.length, 1);
  const frame = execution.frames[0];
  assert.equal(frame.kind(), "Finding");
  assert.equal(frame.slot("status").value(), "VIOLATED");
  assert.match(frame.slot("failed-preconditions").value(), /calibration valid at the transfer time/i);
  assert.doesNotMatch(frame.slot("failed-preconditions").value(), /THERMOMETER_CALIBRATION_VALID/);
  const reparsed = parseCanonicalCNL(renderCanonicalCNL(frame));
  assert.equal(compareFrames(frame, reparsed).equivalent, true);
});

test("microcases exercise satisfied, unknown, conflict, and not-applicable decisions", async () => {
  const cases = [
    {
      name: "satisfied",
      store: storeWithClaims(satisfiedClaims()),
      code: "COLD_CHAIN_RELEASE_SUPPORTED",
      status: "SATISFIED"
    },
    {
      name: "unknown",
      store: storeWithClaims(baseConcreteClaims()),
      code: "COLD_CHAIN_RELEASE_SUPPORT_UNKNOWN",
      status: "UNKNOWN"
    },
    {
      name: "conflict",
      store: storeWithClaims([
        ...satisfiedClaims(),
        cloneClaim(invalidCalibrationAtTransferClaim, denied())
      ]),
      code: "COLD_CHAIN_RELEASE_SUPPORT_CONFLICT",
      status: "CONFLICT"
    },
    {
      name: "not-applicable",
      store: storeWithClaims(),
      code: "COLD_CHAIN_RELEASE_NOT_APPLICABLE",
      status: "NOT_APPLICABLE"
    }
  ];

  for (const microcase of cases) {
    const { finding } = await findingFor(microcase.store);
    assert.equal(finding.code(), microcase.code, microcase.name);
    assert.equal(finding.status(), microcase.status, microcase.name);
  }
});
