import { diagnostic } from "../../../../../../../../framework/sdk/core/diagnostics.mjs";
import {
  actual,
  asserted,
  claim,
  confidence,
  coverage,
  denied,
  describe,
  groundedAt,
  named,
  section,
  sequence,
  taskSource
} from "../../../../../../../../framework/sdk/longtext/index.mjs";
import {
  Agent,
  Evidence,
  Event,
  InformationArtifact,
  Proposition,
  SafetyConclusion,
  SupportsSafetyConclusion,
  actor,
  conclusion,
  evidence
} from "../../sdk/ontology.generated.mjs";
import registry from "../../source/source-map.mjs";

const source = taskSource("source-001", registry);

export const safetyReviewMemo = InformationArtifact(named("Safety Review Memo"));
export const memoAuthor = Agent(named("the memo's author"));

export const alarmSounding = Event(named("the alarm sounded at 08:57"));
export const northGateOpening = Event(named("the north gate was opened at 09:00"));
export const claimedOperatorTraining = Proposition(
  named("the operator was fully trained")
);
export const safetyConclusion = SafetyConclusion(actor(memoAuthor));
export const anyDistinctSupportingEvidence = Evidence(
  named("any distinct supporting evidence contained in the memo")
);
export const supportingEvidencePresent = SupportsSafetyConclusion(
  evidence(anyDistinctSupportingEvidence),
  conclusion(safetyConclusion)
);

export const alarmSoundingClaim = claim(alarmSounding)
  .modality(actual())
  .polarity(asserted())
  .grounding(groundedAt(source.span(20, 47)))
  .statedBy(safetyReviewMemo)
  .confidence(confidence(1));
export const northGateOpeningClaim = claim(northGateOpening)
  .modality(actual())
  .polarity(asserted())
  .grounding(groundedAt(source.span(48, 83)))
  .statedBy(safetyReviewMemo)
  .confidence(confidence(1));
export const safetyConclusionClaim = claim(safetyConclusion)
  .modality(actual())
  .polarity(asserted())
  .grounding(groundedAt(source.span(84, 175)))
  .statedBy(memoAuthor)
  .confidence(confidence(1));
export const claimedOperatorTrainingClaim = claim(claimedOperatorTraining)
  .modality(actual())
  .polarity(asserted())
  .grounding(groundedAt(source.span(143, 173)))
  .statedBy(memoAuthor)
  .confidence(confidence(1));
export const noSupportingEvidenceClaim = claim(supportingEvidencePresent)
  .modality(actual())
  .polarity(denied())
  .grounding(groundedAt(source.span(177, 291)))
  .statedBy(safetyReviewMemo)
  .confidence(confidence(1));

export const semanticDiagnostics = Object.freeze([
  diagnostic(
    "LONGTEXT_CLAIMED_RATIONALE_NOT_EVIDENCE",
    "The attributed training rationale is retained as a generic proposition because the resolved ontology "
      + "has no claimed-rationale relation; it is not promoted to source-grounded evidence.",
    { severity: "warning", responsible: claimedOperatorTraining }
  )
]);

export default describe("source-001-safety-review-memo")
  .section(section(
    "recorded-events",
    sequence(alarmSoundingClaim, northGateOpeningClaim)
  ))
  .section(section(
    "author-conclusion",
    sequence(safetyConclusionClaim, claimedOperatorTrainingClaim)
  ))
  .section(section("evidence-status", sequence(noSupportingEvidenceClaim)))
  .coverage(
    coverage(SafetyConclusion)
      .forScope("source-001")
      .sources(...source.units)
      .complete(),
    coverage(SupportsSafetyConclusion)
      .forScope("source-001")
      .sources(...source.units)
      .complete(),
    coverage(Event)
      .forScope("source-001")
      .sources(...source.units)
      .partial(),
    coverage(Proposition)
      .forScope("source-001")
      .sources(...source.units)
      .partial()
  )
  .commit();
