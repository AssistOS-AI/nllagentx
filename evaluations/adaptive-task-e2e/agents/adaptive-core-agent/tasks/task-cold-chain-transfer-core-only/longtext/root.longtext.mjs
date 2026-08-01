import {
  allOf,
  coverage,
  describe,
  section,
  sequence,
  taskSource
} from "../../../../../../../framework/sdk/longtext/index.mjs";
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
  TransferRecord
} from "../sdk/ontology.generated.mjs";
import registry from "../source/source-map.mjs";
import {
  afterTemperatureReadingClaim,
  beforeTemperatureReadingClaim,
  calibrationCertificateExpiredClaim,
  ct1SupportModel,
  custodyTransferClaim,
  invalidCalibrationAtTransferClaim,
  noCalibrationProofClaim,
  noCitedStabilityStudyClaim,
  noReportedTemperatureExcursionClaim,
  noUnrecordedAcknowledgementProofClaim,
  northCourierAcknowledgementClaim,
  quarantineAlternatives,
  recordExistenceOnlyClaim,
  recordIdentifierRecordingClaim,
  releaseConclusionClaim,
  safetyAssertionIsNotStudyClaim,
  transferRecordClaim,
  valeLaboratoryAcknowledgementClaim
} from "./units/source-001-cold-chain-transfer.longtext.mjs";

const source = taskSource("source-001", registry);
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
const completeTaskCoverage = taskConcepts.map((concept) => coverage(concept)
  .forScope("source-001")
  .sources(...source.units)
  .complete());

export default describe("source-001-cold-chain-transfer-policy-and-record")
  .section(section("ct1-release-support", ct1SupportModel))
  .section(section(
    "ct2-evidence-limits",
    allOf(
      recordExistenceOnlyClaim,
      noCalibrationProofClaim,
      noUnrecordedAcknowledgementProofClaim
    )
  ))
  .section(section("ct3-quarantine-alternatives", quarantineAlternatives))
  .section(section("ct3-unsupported-safety-assertion", sequence(safetyAssertionIsNotStudyClaim)))
  .section(section(
    "transfer-record-ax-17",
    sequence(
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
      noCitedStabilityStudyClaim
    )
  ))
  .section(section("transfer-memo-conclusion", sequence(releaseConclusionClaim)))
  .coverage(
    ...completeTaskCoverage,
    coverage(Proposition)
      .forScope("source-001")
      .sources(...source.units)
      .partial(),
    coverage(InformationArtifact)
      .forScope("source-001")
      .sources(...source.units)
      .partial()
  )
  .commit();

export * from "./units/source-001-cold-chain-transfer.longtext.mjs";
