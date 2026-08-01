import {
  allows,
  atMostOne,
  capability,
  entityKind,
  eventKind,
  exactlyOne,
  lexicalize,
  ontology,
  propositionKind,
  requires,
  role,
  stateKind,
  valueKind
} from "../../../../../../../framework/sdk/ontology/index.mjs";
import {
  Agent,
  Event,
  Evidence,
  InformationArtifact,
  PhysicalObject,
  Proposition,
  QuantityValue,
  SemanticEntity,
  State,
  TimeValue,
  actor,
  evidence,
  from,
  quantity,
  source,
  subject,
  theme,
  time,
  to
} from "../../../../../../../framework/packs/core-language/ontologies/core.ontology.mjs";

const O = ontology("task-cold-chain-transfer-core-only.cold-chain-transfer", "1.0.0");

export const ResearchSample = O.entity(
  entityKind("ResearchSample").subtypeOf(PhysicalObject, SemanticEntity)
    .provide(capability("ResearchSample"))
);
export const CustodyParty = O.entity(
  entityKind("CustodyParty").subtypeOf(Agent).provide(capability("CustodyParty"))
);
export const ContainerSeal = O.entity(
  entityKind("ContainerSeal").subtypeOf(PhysicalObject, SemanticEntity)
    .provide(capability("ContainerSeal"))
);
export const Thermometer = O.entity(
  entityKind("Thermometer").subtypeOf(PhysicalObject, SemanticEntity)
    .provide(capability("Thermometer"))
);
export const TransferRecord = O.entity(
  entityKind("TransferRecord").subtypeOf(InformationArtifact, Evidence)
    .provide(capability("TransferRecord"))
);
export const CalibrationCertificate = O.entity(
  entityKind("CalibrationCertificate").subtypeOf(InformationArtifact, Evidence)
    .provide(capability("CalibrationCertificate"))
);
export const StabilityStudy = O.entity(
  entityKind("StabilityStudy").subtypeOf(InformationArtifact, Evidence)
    .provide(capability("StabilityStudy"))
);
export const TransferPhase = O.value(
  valueKind("TransferPhase").subtypeOf(TimeValue).provide(capability("TransferPhase"))
);

export const CustodyTransfer = O.event(
  eventKind("CustodyTransfer")
    .subtypeOf(Event)
    .role(requires(theme, exactlyOne()))
    .role(requires(from, exactlyOne()))
    .role(requires(to, exactlyOne()))
    .role(allows(time, atMostOne()))
    .provide(capability("CustodyTransfer"))
);

export const transfer = O.role(role("transfer").range(CustodyTransfer));
export const phase = O.role(role("phase").range(TransferPhase));
export const temperature = O.role(role("temperature").range(QuantityValue));
export const duration = O.role(role("duration").range(QuantityValue));

export const IdentifierRecording = O.event(
  eventKind("IdentifierRecording")
    .subtypeOf(Event)
    .role(requires(subject, exactlyOne()))
    .role(requires(transfer, exactlyOne()))
    .role(requires(evidence, exactlyOne()))
    .provide(capability("IdentifierRecording"))
);
export const TemperatureReading = O.event(
  eventKind("TemperatureReading")
    .subtypeOf(Event)
    .role(requires(subject, exactlyOne()))
    .role(requires(source, exactlyOne()))
    .role(requires(quantity, exactlyOne()))
    .role(requires(phase, exactlyOne()))
    .role(requires(transfer, exactlyOne()))
    .role(allows(evidence, atMostOne()))
    .provide(capability("TemperatureReading"))
);
export const CalibrationValidity = O.state(
  stateKind("CalibrationValidity")
    .subtypeOf(State)
    .role(requires(subject, exactlyOne()))
    .role(requires(transfer, exactlyOne()))
    .role(requires(evidence, exactlyOne()))
    .provide(capability("CalibrationValidity"))
);
export const TransferAcknowledgement = O.event(
  eventKind("TransferAcknowledgement")
    .subtypeOf(Event)
    .role(requires(actor, exactlyOne()))
    .role(requires(transfer, exactlyOne()))
    .role(allows(evidence, atMostOne()))
    .provide(capability("TransferAcknowledgement"))
);
export const TemperatureExcursion = O.state(
  stateKind("TemperatureExcursion")
    .subtypeOf(State)
    .role(requires(subject, exactlyOne()))
    .role(requires(transfer, exactlyOne()))
    .role(requires(temperature, exactlyOne()))
    .role(requires(duration, exactlyOne()))
    .provide(capability("TemperatureExcursion"))
);
export const StabilityStudySupport = O.state(
  stateKind("StabilityStudySupport")
    .subtypeOf(State)
    .role(requires(subject, exactlyOne()))
    .role(requires(transfer, exactlyOne()))
    .role(requires(temperature, exactlyOne()))
    .role(requires(duration, exactlyOne()))
    .role(requires(evidence, exactlyOne()))
    .provide(capability("StabilityStudySupport"))
);
export const QuarantineRequirement = O.proposition(
  propositionKind("QuarantineRequirement")
    .subtypeOf(Proposition)
    .role(requires(subject, exactlyOne()))
    .role(requires(transfer, exactlyOne()))
    .provide(capability("QuarantineRequirement"))
);
export const ReleaseConclusion = O.proposition(
  propositionKind("ReleaseConclusion")
    .subtypeOf(Proposition)
    .role(requires(subject, exactlyOne()))
    .role(requires(transfer, exactlyOne()))
    .provide(capability("ReleaseConclusion"))
);

for (const [concept, forms] of [
  [ResearchSample, ["research sample"]],
  [CustodyParty, ["custody party"]],
  [ContainerSeal, ["container seal"]],
  [Thermometer, ["thermometer"]],
  [TransferRecord, ["transfer record"]],
  [CalibrationCertificate, ["calibration certificate"]],
  [StabilityStudy, ["stability study"]],
  [CustodyTransfer, ["custody transfer", "transfer"]],
  [IdentifierRecording, ["identifier recording", "record identifier"]],
  [TemperatureReading, ["temperature reading", "record temperature"]],
  [CalibrationValidity, ["calibration validity", "valid calibration"]],
  [TransferAcknowledgement, ["transfer acknowledgement", "acknowledge transfer"]],
  [TemperatureExcursion, ["temperature excursion"]],
  [StabilityStudySupport, ["stability-study support"]],
  [QuarantineRequirement, ["quarantine requirement"]],
  [ReleaseConclusion, ["release conclusion"]]
]) {
  O.lexicon(lexicalize(concept).english(...forms));
}

export default O.seal();
