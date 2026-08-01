import {
  Finding,
  FindingTemplate,
  PredicateCondition,
  abstractPreflight,
  capability,
  circuit,
  cnlRoundTrip,
  concept,
  decisionTable,
  emitCNLFrame,
  emitFinding,
  evidence,
  guarantee,
  match,
  proceduralStage,
  row,
  symbolicDecisionCoverage,
  variable,
  when
} from "../../../../../../../framework/sdk/circuit/index.mjs";
import {
  findingFrame,
  literalSlot,
  slot
} from "../../../../../../../framework/sdk/cnl/index.mjs";
import {
  CalibrationValidity,
  CustodyTransfer,
  IdentifierRecording,
  ReleaseConclusion,
  ResearchSample,
  StabilityStudySupport,
  TemperatureExcursion,
  TemperatureReading,
  TransferAcknowledgement,
  theme,
  transfer
} from "../sdk/ontology.generated.mjs";
import {
  RELEASE_OUTCOMES,
  evaluateColdChainReleaseSupport
} from "./cold-chain-release-support.mjs";

const anyTransfer = variable(CustodyTransfer, "custody-transfer");

export const releaseConclusions = match(
  ReleaseConclusion(transfer(anyTransfer))
).as("release-conclusions");
export const custodyTransfers = match(
  CustodyTransfer(theme(variable(ResearchSample, "research-sample")))
).as("custody-transfers");
export const identifierRecordings = match(
  IdentifierRecording(transfer(anyTransfer))
).as("identifier-recordings");
export const temperatureReadings = match(
  TemperatureReading(transfer(anyTransfer))
).as("temperature-readings");
export const calibrationValidityStates = match(
  CalibrationValidity(transfer(anyTransfer))
).as("calibration-validity-states");
export const transferAcknowledgements = match(
  TransferAcknowledgement(transfer(anyTransfer))
).as("transfer-acknowledgements");
export const temperatureExcursions = match(
  TemperatureExcursion(transfer(anyTransfer))
).as("temperature-excursions");
export const stabilityStudySupports = match(
  StabilityStudySupport(transfer(anyTransfer))
).as("stability-study-supports");

const assessmentConcepts = Object.freeze({
  IdentifierRecording,
  TemperatureReading,
  CalibrationValidity,
  TransferAcknowledgement,
  TemperatureExcursion,
  StabilityStudySupport
});

export const assessReleaseSupport = proceduralStage(
  "task-cold-chain-transfer.release-support.assess"
)
  .reads(
    releaseConclusions,
    custodyTransfers,
    identifierRecordings,
    temperatureReadings,
    calibrationValidityStates,
    transferAcknowledgements,
    temperatureExcursions,
    stabilityStudySupports
  )
  .writes("ColdChainReleaseSupportAssessment")
  .abstract(() => new Set([
    "SATISFIED",
    "VIOLATED",
    "UNKNOWN",
    "CONFLICT",
    "NOT_APPLICABLE"
  ]))
  .run(({ store, inputs }) => evaluateColdChainReleaseSupport({
    store,
    inputs,
    concepts: assessmentConcepts
  }));

class ReleaseAssessmentFindingTemplate extends FindingTemplate {
  instantiate(context = {}) {
    const assessed = context.values?.get(assessReleaseSupport.identity()) ?? {};
    return new Finding({
      code: assessed.finding?.code ?? this.code,
      status: assessed.finding?.status ?? this.status,
      evidence: assessed.evidence ?? [],
      message: assessed.finding?.message ?? this.message,
      circuit: context.circuit?.identity,
      interpretation: assessed.interpretation ?? null,
      details: assessed.details ?? {}
    });
  }
}

function assessmentFinding(status, code, message) {
  return new ReleaseAssessmentFindingTemplate(
    status,
    code,
    evidence(assessReleaseSupport),
    message
  );
}

const releaseOutcome = new PredicateCondition(
  "ColdChainReleaseSupportOutcome",
  { operand: assessReleaseSupport },
  (context) => context.values?.get(assessReleaseSupport.identity())?.outcome
    ?? RELEASE_OUTCOMES.UNKNOWN
);

export const decideReleaseSupport = decisionTable(
  "task-cold-chain-transfer.release-support.decide"
)
  .add(
    row(
      when(releaseOutcome.isTrue()),
      assessmentFinding(
        "SATISFIED",
        "COLD_CHAIN_RELEASE_SUPPORTED",
        "Every applicable cold-chain release precondition has valid source support."
      )
    ),
    row(
      when(releaseOutcome.isFalse()),
      assessmentFinding(
        "VIOLATED",
        "COLD_CHAIN_RELEASE_UNSUPPORTED",
        "The release conclusion lacks valid support for one or more required preconditions."
      )
    ),
    row(
      when(releaseOutcome.isUnknown()),
      assessmentFinding(
        "UNKNOWN",
        "COLD_CHAIN_RELEASE_SUPPORT_UNKNOWN",
        "The available source evidence does not determine every release precondition."
      )
    ),
    row(
      when(releaseOutcome.isConflict()),
      assessmentFinding(
        "CONFLICT",
        "COLD_CHAIN_RELEASE_SUPPORT_CONFLICT",
        "Compatible source evidence both supports and refutes a release precondition."
      )
    )
  )
  .exhaustive()
  .seal();

function generateObservation({ inputs }) {
  const assessment = inputs[0];
  if (!assessment) return [];
  const details = assessment.details ?? {};
  const sourceSpans = (assessment.evidence ?? [])
    .filter((value) => value?.sort?.() === "SourceSpan");
  const requirementText = (name) => (details[name] ?? [])
    .map((code) => details.requirementStatements?.[code] ?? code)
    .join(" ") || "none";
  return [findingFrame("task-cold-chain-transfer.release-support")
    .set("status", literalSlot(assessment.status ?? "UNKNOWN"))
    .set(
      "failed-preconditions",
      literalSlot(requirementText("failedRequirements"))
    )
    .set(
      "uncertain-preconditions",
      literalSlot(requirementText("uncertainRequirements"))
    )
    .set(
      "conflicting-preconditions",
      literalSlot(requirementText("conflictingRequirements"))
    )
    .set("source-evidence", slot("SourceEvidence", ...sourceSpans))
    .provenance(...(assessment.evidence ?? []))
    .seal()];
}

export const generateReleaseObservation = proceduralStage(
  "task-cold-chain-transfer.release-support.generate-observation"
)
  .reads(assessReleaseSupport)
  .writes("CNLFrame")
  .abstract(() => new Set(["SATISFIED", "VIOLATED", "UNKNOWN", "CONFLICT"]))
  .run(generateObservation);

export default circuit("task-cold-chain-transfer.ColdChainTransferReleaseSupport", "1.0.0")
  .concern("ColdChainTransferReleaseSupport")
  .targets("cold-chain-transfer-policy", "custody-transfer-record")
  .requires(
    concept(ReleaseConclusion),
    concept(CustodyTransfer),
    concept(IdentifierRecording),
    concept(TemperatureReading),
    concept(CalibrationValidity),
    concept(TransferAcknowledgement),
    concept(TemperatureExcursion),
    concept(StabilityStudySupport)
  )
  .provides(
    capability("ColdChainTransferReleaseSupport"),
    guarantee("evidence-bearing"),
    guarantee("coverage-aware"),
    guarantee("interpretation-aware"),
    guarantee("typed-cnl-observation")
  )
  .use(
    releaseConclusions,
    custodyTransfers,
    identifierRecordings,
    temperatureReadings,
    calibrationValidityStates,
    transferAcknowledgements,
    temperatureExcursions,
    stabilityStudySupports,
    assessReleaseSupport,
    decideReleaseSupport,
    generateReleaseObservation
  )
  .emit(
    emitFinding(decideReleaseSupport),
    emitCNLFrame(generateReleaseObservation)
  )
  .statuses("SATISFIED", "VIOLATED", "UNKNOWN", "CONFLICT", "NOT_APPLICABLE")
  .assurance(abstractPreflight(), symbolicDecisionCoverage(), cnlRoundTrip())
  .seal();
