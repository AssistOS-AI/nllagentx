import { diagnostic } from "../../../../../../../../framework/sdk/core/diagnostics.mjs";
import {
  actual,
  allOf,
  alternatives,
  asserted,
  claim,
  confidence,
  condition,
  context,
  denied,
  exception,
  groundedAt,
  named,
  necessary,
  obligatory,
  permitted,
  reportedBy,
  taskSource,
  within
} from "../../../../../../../../framework/sdk/longtext/index.mjs";
import {
  CalibrationCertificate,
  CalibrationValidity,
  ContainerSeal,
  CustodyParty,
  CustodyTransfer,
  Evidence,
  IdentifierRecording,
  InformationArtifact,
  Proposition,
  QuantityValue,
  QuarantineRequirement,
  ReleaseConclusion,
  ResearchSample,
  StabilityStudy,
  StabilityStudySupport,
  TemperatureExcursion,
  TemperatureReading,
  Thermometer,
  TimeValue,
  TransferAcknowledgement,
  TransferPhase,
  TransferRecord,
  actor,
  duration,
  evidence,
  from,
  phase,
  quantity,
  source as readingSource,
  subject,
  temperature,
  theme,
  time,
  to,
  transfer
} from "../../sdk/ontology.generated.mjs";
import registry from "../../source/source-map.mjs";

const source = taskSource("source-001", registry);

function groundedClaim(proposition, {
  ranges,
  voice,
  contextValue,
  modality = actual(),
  polarity = asserted()
}) {
  return claim(proposition)
    .modality(modality)
    .polarity(polarity)
    .grounding(...ranges.map(([start, end]) => groundedAt(source.span(start, end))))
    .statedBy(voice)
    .within(contextValue)
    .confidence(confidence(1));
}

export const policyVoice = InformationArtifact(named("Cold-chain Transfer Policy"));
export const ct1Context = context("PolicyRule", "CT-1").seal();
export const ct2Context = context("PolicyRule", "CT-2").seal();
export const ct3Context = context("PolicyRule", "CT-3").seal();

export const policySample = ResearchSample(named("the refrigerated research sample governed by CT-1"));
export const policyReleasingParty = CustodyParty(named("the releasing party governed by CT-1"));
export const policyReceivingParty = CustodyParty(named("the receiving party governed by CT-1"));
export const policyTransferTime = TimeValue(named("the time of the custody transfer"));
export const policyTransfer = CustodyTransfer(
  theme(policySample),
  from(policyReleasingParty),
  to(policyReceivingParty),
  time(policyTransferTime)
);
export const policySeal = ContainerSeal(named("the sealed-container identifier governed by CT-1"));
export const policyThermometer = Thermometer(named("the thermometer used for the CT-1 readings"));
export const policyRecord = TransferRecord(named("the record required by CT-1"));
export const policyCalibrationEvidence = Evidence(named("support for calibration validity"));
export const requiredTemperatureRange = QuantityValue(named("between 2.0 °C and 8.0 °C"));
export const beforeHandoff = TransferPhase(named("before handoff"));
export const afterReceipt = TransferPhase(named("after receipt"));

export const requiredIdentifierRecording = IdentifierRecording(
  subject(policySeal),
  transfer(policyTransfer),
  evidence(policyRecord)
);
export const requiredBeforeReading = TemperatureReading(
  subject(policySample),
  readingSource(policyThermometer),
  quantity(requiredTemperatureRange),
  phase(beforeHandoff),
  transfer(policyTransfer),
  evidence(policyRecord)
);
export const requiredAfterReading = TemperatureReading(
  subject(policySample),
  readingSource(policyThermometer),
  quantity(requiredTemperatureRange),
  phase(afterReceipt),
  transfer(policyTransfer),
  evidence(policyRecord)
);
export const requiredCalibrationValidity = CalibrationValidity(
  subject(policyThermometer),
  transfer(policyTransfer),
  evidence(policyCalibrationEvidence)
);
export const requiredReleasingAcknowledgement = TransferAcknowledgement(
  actor(policyReleasingParty),
  transfer(policyTransfer)
);
export const requiredReceivingAcknowledgement = TransferAcknowledgement(
  actor(policyReceivingParty),
  transfer(policyTransfer)
);

export const requiredIdentifierRecordingClaim = groundedClaim(requiredIdentifierRecording, {
  ranges: [[175, 218]],
  voice: policyVoice,
  contextValue: ct1Context,
  modality: necessary()
});
export const requiredBeforeReadingClaim = groundedClaim(requiredBeforeReading, {
  ranges: [[220, 331]],
  voice: policyVoice,
  contextValue: ct1Context,
  modality: necessary()
});
export const requiredAfterReadingClaim = groundedClaim(requiredAfterReading, {
  ranges: [[220, 331]],
  voice: policyVoice,
  contextValue: ct1Context,
  modality: necessary()
});
export const requiredCalibrationValidityClaim = groundedClaim(requiredCalibrationValidity, {
  ranges: [[333, 420]],
  voice: policyVoice,
  contextValue: ct1Context,
  modality: necessary()
});
export const requiredReleasingAcknowledgementClaim = groundedClaim(requiredReleasingAcknowledgement, {
  ranges: [[426, 499]],
  voice: policyVoice,
  contextValue: ct1Context,
  modality: necessary()
});
export const requiredReceivingAcknowledgementClaim = groundedClaim(requiredReceivingAcknowledgement, {
  ranges: [[426, 499]],
  voice: policyVoice,
  contextValue: ct1Context,
  modality: necessary()
});

export const ct1Requirements = allOf(
  requiredIdentifierRecordingClaim,
  requiredBeforeReadingClaim,
  requiredAfterReadingClaim,
  requiredCalibrationValidityClaim,
  requiredReleasingAcknowledgementClaim,
  requiredReceivingAcknowledgementClaim
);
export const policyReleaseConclusion = ReleaseConclusion(
  subject(policySample),
  transfer(policyTransfer)
);
export const ct1ReleaseContext = within(ct1Context, condition(ct1Requirements).seal());
export const policyReleaseConclusionClaim = groundedClaim(policyReleaseConclusion, {
  ranges: [[39, 173]],
  voice: policyVoice,
  contextValue: ct1ReleaseContext,
  modality: permitted()
});
export const ct1SupportModel = allOf(policyReleaseConclusionClaim, ct1Requirements);

export const recordExistenceOnly = Proposition(
  named("recording an identifier or temperature reading establishes only that a record exists")
);
export const recordingProvesCalibrationValidity = Proposition(
  named("recording an identifier or temperature reading proves calibration validity")
);
export const recordingProvesUnrecordedAcknowledgement = Proposition(
  named("recording an identifier or temperature reading proves an unrecorded acknowledgement occurred")
);
export const recordExistenceOnlyClaim = groundedClaim(recordExistenceOnly, {
  ranges: [[513, 583]],
  voice: policyVoice,
  contextValue: ct2Context
});
export const noCalibrationProofClaim = groundedClaim(recordingProvesCalibrationValidity, {
  ranges: [[584, 690]],
  voice: policyVoice,
  contextValue: ct2Context,
  polarity: denied()
});
export const noUnrecordedAcknowledgementProofClaim = groundedClaim(
  recordingProvesUnrecordedAcknowledgement,
  {
    ranges: [[584, 690]],
    voice: policyVoice,
    contextValue: ct2Context,
    polarity: denied()
  }
);

export const excursionTemperature = QuantityValue(named("above 8.0 °C"));
export const excursionDuration = QuantityValue(named("more than five minutes"));
export const policyTemperatureExcursion = TemperatureExcursion(
  subject(policySample),
  transfer(policyTransfer),
  temperature(excursionTemperature),
  duration(excursionDuration)
);
export const namedStabilityStudy = StabilityStudy(
  named("a named stability study supporting the observed temperature and duration")
);
export const policyStudySupport = StabilityStudySupport(
  subject(policySample),
  transfer(policyTransfer),
  temperature(excursionTemperature),
  duration(excursionDuration),
  evidence(namedStabilityStudy)
);
export const policyQuarantineRequirement = QuarantineRequirement(
  subject(policySample),
  transfer(policyTransfer)
);
export const quarantineConditionContext = within(
  ct3Context,
  condition(policyTemperatureExcursion).seal()
);
export const stabilityStudyExceptionContext = within(
  ct3Context,
  exception(policyStudySupport).seal()
);
export const quarantineRequirementClaim = groundedClaim(policyQuarantineRequirement, {
  ranges: [[703, 787]],
  voice: policyVoice,
  contextValue: quarantineConditionContext,
  modality: obligatory()
});
export const stabilityStudySupportRequirementClaim = groundedClaim(policyStudySupport, {
  ranges: [[788, 876]],
  voice: policyVoice,
  contextValue: stabilityStudyExceptionContext,
  modality: necessary()
});
export const quarantineAlternatives = alternatives(
  quarantineRequirementClaim.seal(),
  stabilityStudySupportRequirementClaim.seal()
);
export const safetyAssertionAsStudy = StabilityStudy(
  named("an assertion that the sample is safe")
);
export const safetyAssertionIsNotStudyClaim = groundedClaim(safetyAssertionAsStudy, {
  ranges: [[878, 947]],
  voice: policyVoice,
  contextValue: ct3Context,
  polarity: denied()
});

export const transferRecord = TransferRecord(named("Transfer Record AX-17"));
export const transferMemo = TransferRecord(named("transfer memo for AX-17"));
export const recordContext = context("TransferRecord", "AX-17").seal();
export const transferMemoContext = reportedBy(transferMemo).seal();
export const sampleAX17 = ResearchSample(named("AX-17"));
export const northCourier = CustodyParty(named("North Courier"));
export const valeLaboratory = CustodyParty(named("Vale Laboratory"));
export const transferTime = TimeValue(named("14 July 2026 at 10:15"));
export const custodyTransferAX17 = CustodyTransfer(
  theme(sampleAX17),
  from(northCourier),
  to(valeLaboratory),
  time(transferTime)
);
export const sealS884 = ContainerSeal(named("S-884"));
export const thermometerTH9 = Thermometer(named("TH-9"));
export const calibrationCertificateTH9 = CalibrationCertificate(
  named("TH-9 calibration certificate expiring 13 July 2026")
);
export const actualBeforeHandoff = TransferPhase(named("before handoff"));
export const actualAfterReceipt = TransferPhase(named("after receipt"));
export const temperature62C = QuantityValue(named("6.2 °C"));
export const temperature67C = QuantityValue(named("6.7 °C"));

export const recordIdentifierRecording = IdentifierRecording(
  subject(sealS884),
  transfer(custodyTransferAX17),
  evidence(transferRecord)
);
export const beforeTemperatureReading = TemperatureReading(
  subject(sampleAX17),
  readingSource(thermometerTH9),
  quantity(temperature62C),
  phase(actualBeforeHandoff),
  transfer(custodyTransferAX17),
  evidence(transferRecord)
);
export const afterTemperatureReading = TemperatureReading(
  subject(sampleAX17),
  readingSource(thermometerTH9),
  quantity(temperature67C),
  phase(actualAfterReceipt),
  transfer(custodyTransferAX17),
  evidence(transferRecord)
);
export const invalidCalibrationAtTransfer = CalibrationValidity(
  subject(thermometerTH9),
  transfer(custodyTransferAX17),
  evidence(calibrationCertificateTH9)
);
export const northCourierAcknowledgement = TransferAcknowledgement(
  actor(northCourier),
  transfer(custodyTransferAX17),
  evidence(transferRecord)
);
export const valeLaboratoryAcknowledgement = TransferAcknowledgement(
  actor(valeLaboratory),
  transfer(custodyTransferAX17),
  evidence(transferRecord)
);
export const calibrationCertificateExpired = Proposition(
  named("the calibration certificate for TH-9 expired on 13 July 2026")
);
export const reportedTemperatureExcursion = Proposition(
  named("the transfer record reports a temperature above 8.0 °C")
);
export const citedStabilityStudy = Proposition(
  named("the transfer record cites a stability study")
);
export const releaseConclusionAX17 = ReleaseConclusion(
  subject(sampleAX17),
  transfer(custodyTransferAX17)
);

export const transferRecordClaim = groundedClaim(transferRecord, {
  ranges: [[949, 970]],
  voice: transferRecord,
  contextValue: recordContext
});
export const custodyTransferClaim = groundedClaim(custodyTransferAX17, {
  ranges: [[972, 1059]],
  voice: transferRecord,
  contextValue: recordContext
});
export const recordIdentifierRecordingClaim = groundedClaim(recordIdentifierRecording, {
  ranges: [[1060, 1091]],
  voice: transferRecord,
  contextValue: recordContext
});
export const beforeTemperatureReadingClaim = groundedClaim(beforeTemperatureReading, {
  ranges: [[1092, 1165]],
  voice: transferRecord,
  contextValue: recordContext
});
export const afterTemperatureReadingClaim = groundedClaim(afterTemperatureReading, {
  ranges: [[1092, 1165]],
  voice: transferRecord,
  contextValue: recordContext
});
export const calibrationCertificateExpiredClaim = groundedClaim(calibrationCertificateExpired, {
  ranges: [[1166, 1227]],
  voice: transferRecord,
  contextValue: recordContext
});
export const invalidCalibrationAtTransferClaim = groundedClaim(invalidCalibrationAtTransfer, {
  ranges: [[972, 1059], [1166, 1227]],
  voice: transferRecord,
  contextValue: recordContext,
  polarity: denied()
});
export const northCourierAcknowledgementClaim = groundedClaim(northCourierAcknowledgement, {
  ranges: [[1228, 1263]],
  voice: transferRecord,
  contextValue: recordContext
});
export const valeLaboratoryAcknowledgementClaim = groundedClaim(valeLaboratoryAcknowledgement, {
  ranges: [[1264, 1322]],
  voice: transferRecord,
  contextValue: recordContext,
  polarity: denied()
});
export const noReportedTemperatureExcursionClaim = groundedClaim(reportedTemperatureExcursion, {
  ranges: [[1323, 1362]],
  voice: transferRecord,
  contextValue: recordContext,
  polarity: denied()
});
export const noCitedStabilityStudyClaim = groundedClaim(citedStabilityStudy, {
  ranges: [[1367, 1394]],
  voice: transferRecord,
  contextValue: recordContext,
  polarity: denied()
});
export const releaseConclusionClaim = groundedClaim(releaseConclusionAX17, {
  ranges: [[1397, 1487]],
  voice: transferMemo,
  contextValue: transferMemoContext,
  modality: permitted()
});

export const semanticDiagnostics = Object.freeze([
  diagnostic(
    "LONGTEXT_PROOF_RELATION_UNSUPPORTED",
    "The resolved ontology has no evidential-entailment relation. CT-2's proof limits remain grounded generic "
      + "propositions and are not promoted to validity or acknowledgement facts.",
    { severity: "warning", responsible: recordExistenceOnly }
  ),
  diagnostic(
    "LONGTEXT_TEMPERATURE_INTERVAL_LEXICALIZED",
    "The resolved ontology has no bounded-temperature interval roles. The exact range, readings, threshold, and "
      + "duration remain typed QuantityValue labels without invented interval arithmetic.",
    { severity: "warning", responsible: requiredTemperatureRange }
  ),
  diagnostic(
    "LONGTEXT_CALIBRATION_EXPIRY_INTERPRETATION",
    "Invalid calibration at transfer is grounded jointly in the dated transfer and the prior certificate expiry; "
      + "it is kept distinct from the mere existence of recorded readings.",
    { severity: "warning", responsible: invalidCalibrationAtTransfer }
  ),
  diagnostic(
    "LONGTEXT_REPORTED_EXCURSION_NOT_WORLD_ABSENCE",
    "The record denies that an above-threshold temperature was reported. This does not assert that no unreported "
      + "temperature excursion occurred.",
    { severity: "warning", responsible: reportedTemperatureExcursion }
  ),
  diagnostic(
    "LONGTEXT_UNCITED_STUDY_NOT_WORLD_ABSENCE",
    "The record denies citing a stability study. This does not assert that no uncited study exists or supports the "
      + "transfer.",
    { severity: "warning", responsible: citedStabilityStudy }
  )
]);

export const materializedClaims = Object.freeze([
  policyReleaseConclusionClaim,
  requiredIdentifierRecordingClaim,
  requiredBeforeReadingClaim,
  requiredAfterReadingClaim,
  requiredCalibrationValidityClaim,
  requiredReleasingAcknowledgementClaim,
  requiredReceivingAcknowledgementClaim,
  recordExistenceOnlyClaim,
  noCalibrationProofClaim,
  noUnrecordedAcknowledgementProofClaim,
  quarantineRequirementClaim,
  stabilityStudySupportRequirementClaim,
  safetyAssertionIsNotStudyClaim,
  transferRecordClaim,
  custodyTransferClaim,
  recordIdentifierRecordingClaim,
  beforeTemperatureReadingClaim,
  afterTemperatureReadingClaim,
  calibrationCertificateExpiredClaim,
  invalidCalibrationAtTransferClaim,
  northCourierAcknowledgementClaim,
  valeLaboratoryAcknowledgementClaim,
  noReportedTemperatureExcursionClaim,
  noCitedStabilityStudyClaim,
  releaseConclusionClaim
]);
