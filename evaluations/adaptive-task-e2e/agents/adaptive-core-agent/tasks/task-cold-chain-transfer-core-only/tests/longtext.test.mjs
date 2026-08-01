import test from "node:test";
import assert from "node:assert/strict";
import coreOntology from "../../../../../../../framework/packs/core-language/ontologies/core.ontology.mjs";
import { SemanticStore } from "../../../../../../../framework/runtime/store/semantic-store.mjs";
import ontology from "../ontologies/cold-chain-transfer.ontology.mjs";
import registry from "../source/source-map.mjs";
import {
  CalibrationCertificate,
  CalibrationValidity,
  ContainerSeal,
  CustodyParty,
  CustodyTransfer,
  IdentifierRecording,
  InformationArtifact,
  Proposition,
  QuarantineRequirement,
  ReleaseConclusion,
  ResearchSample,
  StabilityStudy,
  StabilityStudySupport,
  TemperatureExcursion,
  TemperatureReading,
  Thermometer,
  TransferAcknowledgement,
  TransferPhase,
  TransferRecord,
  actor,
  evidence,
  from,
  phase,
  quantity,
  source as readingSource,
  subject,
  theme,
  time,
  to,
  transfer
} from "../sdk/ontology.generated.mjs";
import longText, {
  afterTemperatureReading,
  afterTemperatureReadingClaim,
  beforeTemperatureReading,
  beforeTemperatureReadingClaim,
  calibrationCertificateExpiredClaim,
  calibrationCertificateTH9,
  citedStabilityStudy,
  ct1Context,
  ct1SupportModel,
  custodyTransferAX17,
  custodyTransferClaim,
  invalidCalibrationAtTransfer,
  invalidCalibrationAtTransferClaim,
  materializedClaims,
  noCalibrationProofClaim,
  noCitedStabilityStudyClaim,
  noReportedTemperatureExcursionClaim,
  noUnrecordedAcknowledgementProofClaim,
  northCourier,
  northCourierAcknowledgement,
  northCourierAcknowledgementClaim,
  policyReleaseConclusionClaim,
  policyStudySupport,
  policyTransfer,
  quarantineAlternatives,
  quarantineRequirementClaim,
  recordExistenceOnlyClaim,
  recordIdentifierRecording,
  recordIdentifierRecordingClaim,
  releaseConclusionAX17,
  releaseConclusionClaim,
  reportedTemperatureExcursion,
  requiredAfterReadingClaim,
  requiredBeforeReadingClaim,
  requiredCalibrationValidityClaim,
  requiredIdentifierRecordingClaim,
  requiredReceivingAcknowledgementClaim,
  requiredReleasingAcknowledgementClaim,
  safetyAssertionIsNotStudyClaim,
  sampleAX17,
  semanticDiagnostics,
  stabilityStudySupportRequirementClaim,
  thermometerTH9,
  transferMemo,
  transferRecord,
  transferRecordClaim,
  valeLaboratory,
  valeLaboratoryAcknowledgement,
  valeLaboratoryAcknowledgementClaim
} from "../longtext/root.longtext.mjs";

const SOURCE_DIGEST = "5b08d3ce00a7e7257a8e863319d8fa0f0945a9cfb695bc7e3325f84aa712464e";

const expectedGroundings = new Map([
  [policyReleaseConclusionClaim, [[39, 173]]],
  [requiredIdentifierRecordingClaim, [[175, 218]]],
  [requiredBeforeReadingClaim, [[220, 331]]],
  [requiredAfterReadingClaim, [[220, 331]]],
  [requiredCalibrationValidityClaim, [[333, 420]]],
  [requiredReleasingAcknowledgementClaim, [[426, 499]]],
  [requiredReceivingAcknowledgementClaim, [[426, 499]]],
  [recordExistenceOnlyClaim, [[513, 583]]],
  [noCalibrationProofClaim, [[584, 690]]],
  [noUnrecordedAcknowledgementProofClaim, [[584, 690]]],
  [quarantineRequirementClaim, [[703, 787]]],
  [stabilityStudySupportRequirementClaim, [[788, 876]]],
  [safetyAssertionIsNotStudyClaim, [[878, 947]]],
  [transferRecordClaim, [[949, 970]]],
  [custodyTransferClaim, [[972, 1059]]],
  [recordIdentifierRecordingClaim, [[1060, 1091]]],
  [beforeTemperatureReadingClaim, [[1092, 1165]]],
  [afterTemperatureReadingClaim, [[1092, 1165]]],
  [calibrationCertificateExpiredClaim, [[1166, 1227]]],
  [invalidCalibrationAtTransferClaim, [[972, 1059], [1166, 1227]]],
  [northCourierAcknowledgementClaim, [[1228, 1263]]],
  [valeLaboratoryAcknowledgementClaim, [[1264, 1322]]],
  [noReportedTemperatureExcursionClaim, [[1323, 1362]]],
  [noCitedStabilityStudyClaim, [[1367, 1394]]],
  [releaseConclusionClaim, [[1397, 1487]]]
]);

function roleValue(term, role) {
  return term.bindings()
    .find((binding) => binding.role().identity === role.identity())
    ?.value();
}

function groundingRanges(claimBuilder) {
  return claimBuilder.seal().groundings().map((span) => ({
    sourceId: span.sourceId(),
    unitId: span.unitId(),
    sourceDigest: span.descriptor().sourceDigest,
    start: span.start(),
    end: span.end()
  }));
}

function polarityOf(claimBuilder) {
  return claimBuilder.seal().descriptor().polarity.value();
}

function taskStore() {
  const store = new SemanticStore()
    .installOntology(coreOntology)
    .installOntology(ontology);
  store.beginTransaction("cold-chain LongTextJS")
    .longText(longText)
    .commit();
  return store;
}

test("LongTextJS grounds every authored claim at exact stable source offsets", () => {
  assert.equal(materializedClaims.length, 25);
  assert.equal(longText.claims.length, 25);
  assert.equal(expectedGroundings.size, materializedClaims.length);

  for (const [claimBuilder, ranges] of expectedGroundings) {
    assert.deepEqual(groundingRanges(claimBuilder), ranges.map(([start, end]) => ({
      sourceId: "source-001",
      unitId: "source-001:unit-0001",
      sourceDigest: SOURCE_DIGEST,
      start,
      end
    })));
  }

  const verification = longText.claims
    .flatMap((claimValue) => claimValue.groundings())
    .map((span) => registry.verify(span));
  assert.equal(verification.length, 26);
  assert.ok(verification.every((entry) => entry.valid));
});

test("CT-1 remains an attributed conjunction of every release precondition", () => {
  assert.equal(ct1SupportModel.kind(), "Conjunction");
  assert.equal(ct1SupportModel.size(), 7);
  const claims = ct1SupportModel.toArray().map((entry) => entry.seal());

  assert.ok(claims.every((entry) => entry.descriptor().voice.identity() === policyReleaseConclusionClaim
    .seal().descriptor().voice.identity()));
  assert.ok(claims.every((entry) => {
    const contextValue = entry.descriptor().context;
    return contextValue.identity() === ct1Context.identity()
      || contextValue.descriptor().value.identity() === ct1Context.identity();
  }));
  assert.equal(policyReleaseConclusionClaim.seal().descriptor().modality.value(), "permitted");
  assert.ok(claims.slice(1).every((entry) => entry.descriptor().modality.value() === "necessary"));
});

test("CT-3 preserves mutually exclusive quarantine and stability-study paths", () => {
  assert.equal(quarantineAlternatives.kind(), "Alternatives");
  assert.equal(quarantineAlternatives.size(), 2);
  assert.equal(quarantineRequirementClaim.seal().descriptor().modality.value(), "obligatory");
  assert.equal(stabilityStudySupportRequirementClaim.seal().descriptor().modality.value(), "necessary");
  assert.equal(quarantineRequirementClaim.seal().descriptor().context.kind(), "Within");
  assert.equal(stabilityStudySupportRequirementClaim.seal().descriptor().context.kind(), "Within");
  assert.equal(polarityOf(safetyAssertionIsNotStudyClaim), "denied");
});

test("the record distinguishes recorded support from invalid and absent support", () => {
  assert.equal(recordIdentifierRecording.concept(), IdentifierRecording.identity());
  assert.equal(beforeTemperatureReading.concept(), TemperatureReading.identity());
  assert.equal(afterTemperatureReading.concept(), TemperatureReading.identity());
  assert.equal(roleValue(recordIdentifierRecording, transfer).identity(), custodyTransferAX17.identity());
  assert.equal(roleValue(beforeTemperatureReading, readingSource).identity(), thermometerTH9.identity());
  assert.equal(roleValue(afterTemperatureReading, readingSource).identity(), thermometerTH9.identity());
  assert.equal(roleValue(beforeTemperatureReading, subject).identity(), sampleAX17.identity());
  assert.equal(roleValue(afterTemperatureReading, subject).identity(), sampleAX17.identity());
  assert.notEqual(
    roleValue(beforeTemperatureReading, quantity).identity(),
    roleValue(afterTemperatureReading, quantity).identity()
  );
  assert.notEqual(
    roleValue(beforeTemperatureReading, phase).identity(),
    roleValue(afterTemperatureReading, phase).identity()
  );

  assert.equal(invalidCalibrationAtTransfer.concept(), CalibrationValidity.identity());
  assert.equal(roleValue(invalidCalibrationAtTransfer, subject).identity(), thermometerTH9.identity());
  assert.equal(
    roleValue(invalidCalibrationAtTransfer, evidence).identity(),
    calibrationCertificateTH9.identity()
  );
  assert.equal(polarityOf(invalidCalibrationAtTransferClaim), "denied");
  assert.equal(polarityOf(northCourierAcknowledgementClaim), "asserted");
  assert.equal(polarityOf(valeLaboratoryAcknowledgementClaim), "denied");
  assert.equal(roleValue(northCourierAcknowledgement, actor).identity(), northCourier.identity());
  assert.equal(roleValue(valeLaboratoryAcknowledgement, actor).identity(), valeLaboratory.identity());
});

test("record-level negatives do not become unsupported world absences", () => {
  assert.equal(reportedTemperatureExcursion.concept(), Proposition.identity());
  assert.equal(citedStabilityStudy.concept(), Proposition.identity());
  assert.equal(polarityOf(noReportedTemperatureExcursionClaim), "denied");
  assert.equal(polarityOf(noCitedStabilityStudyClaim), "denied");

  const excursionClaims = longText.claims.filter(
    (entry) => entry.proposition().concept() === TemperatureExcursion.identity()
  );
  const studySupportClaims = longText.claims.filter(
    (entry) => entry.proposition().concept() === StabilityStudySupport.identity()
  );
  assert.deepEqual(excursionClaims, []);
  assert.equal(studySupportClaims.length, 1);
  assert.equal(
    roleValue(studySupportClaims[0].proposition(), transfer).identity(),
    policyTransfer.identity()
  );
  assert.equal(policyStudySupport.identity(), studySupportClaims[0].proposition().identity());
});

test("the memo conclusion stays attributed and attached to the concrete transfer", () => {
  assert.equal(releaseConclusionAX17.concept(), ReleaseConclusion.identity());
  assert.equal(roleValue(releaseConclusionAX17, subject).identity(), sampleAX17.identity());
  assert.equal(roleValue(releaseConclusionAX17, transfer).identity(), custodyTransferAX17.identity());
  assert.equal(releaseConclusionClaim.seal().descriptor().voice.identity(), transferMemo.identity());
  assert.equal(releaseConclusionClaim.seal().descriptor().context.kind(), "ReportedSpeech");
  assert.equal(releaseConclusionClaim.seal().descriptor().modality.value(), "permitted");
});

test("unsupported meanings remain explicit typed warning diagnostics", () => {
  assert.deepEqual(semanticDiagnostics.map((entry) => entry.code()), [
    "LONGTEXT_PROOF_RELATION_UNSUPPORTED",
    "LONGTEXT_TEMPERATURE_INTERVAL_LEXICALIZED",
    "LONGTEXT_CALIBRATION_EXPIRY_INTERPRETATION",
    "LONGTEXT_REPORTED_EXCURSION_NOT_WORLD_ABSENCE",
    "LONGTEXT_UNCITED_STUDY_NOT_WORLD_ABSENCE"
  ]);
  assert.ok(semanticDiagnostics.every((entry) => entry.severity() === "warning"));
});

test("coverage is closed for every inspected task concept and partial for generic fallbacks", () => {
  const taskConcepts = [
    ResearchSample,
    CustodyParty,
    ContainerSeal,
    Thermometer,
    TransferRecord,
    CalibrationCertificate,
    StabilityStudy,
    TransferPhase,
    CustodyTransfer,
    IdentifierRecording,
    TemperatureReading,
    CalibrationValidity,
    TransferAcknowledgement,
    TemperatureExcursion,
    StabilityStudySupport,
    QuarantineRequirement,
    ReleaseConclusion
  ];
  const coverageByConcept = new Map(
    longText.coverage.map((entry) => [entry.descriptor().concept.identity(), entry])
  );

  assert.equal(longText.coverage.length, 19);
  for (const concept of taskConcepts) {
    const witness = coverageByConcept.get(concept.identity());
    assert.equal(witness.descriptor().scope, "source-001");
    assert.equal(witness.descriptor().status, "closed");
  }
  assert.equal(coverageByConcept.get(Proposition.identity()).descriptor().status, "partial");
  assert.equal(coverageByConcept.get(InformationArtifact.identity()).descriptor().status, "partial");
});

test("the complete LongTextJS commits and exposes the concrete release conclusion", () => {
  const store = taskStore();
  assert.equal(store.allClaims().length, 25);
  assert.equal(store.allCoverage().length, 19);

  const matches = store.query(releaseConclusionAX17);
  assert.equal(matches.length, 1);
  assert.equal(matches[0].term.identity(), releaseConclusionAX17.identity());
  assert.equal(store.claimsAbout(releaseConclusionAX17).length, 1);
  assert.equal(store.claimsAbout(releaseConclusionAX17)[0].identity(), releaseConclusionClaim.seal().identity());

  assert.equal(roleValue(custodyTransferAX17, theme).identity(), sampleAX17.identity());
  assert.equal(roleValue(custodyTransferAX17, from).identity(), northCourier.identity());
  assert.equal(roleValue(custodyTransferAX17, to).identity(), valeLaboratory.identity());
  assert.ok(roleValue(custodyTransferAX17, time));
});
