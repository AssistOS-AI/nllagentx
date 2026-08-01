import { diagnostic } from "../../../../../../../../framework/sdk/core/diagnostics.mjs";
import {
  asserted,
  claim,
  confidence,
  coverage,
  denied,
  describe,
  groundedAt,
  named,
  obligatory,
  section,
  sequence,
  taskSource
} from "../../../../../../../../framework/sdk/longtext/index.mjs";
import {
  Event,
  InformationArtifact,
  OperationalRule,
  Proposition,
  RuleEffect,
  action,
  condition,
  effect,
  value
} from "../../sdk/ontology.generated.mjs";
import registry from "../../source/source-map.mjs";

const source = taskSource("source-001", registry);
const policyVoice = InformationArtifact(named("North Gate Alarm Policy"));

export const alarmBeforeAcknowledgement = Proposition(
  named("the building alarm is active before an operator acknowledges the alarm")
);
export const openNorthGate = Event(
  named("staff open the north gate before an operator acknowledges the alarm")
);

const forbiddenEffect = RuleEffect(value("forbidden"));
const requiredEffect = RuleEffect(value("required"));

export const ruleA = OperationalRule(
  action(openNorthGate),
  condition(alarmBeforeAcknowledgement),
  effect(forbiddenEffect)
);
export const ruleB = OperationalRule(
  action(openNorthGate),
  condition(alarmBeforeAcknowledgement),
  effect(requiredEffect)
);

export const noStatedPriority = Proposition(
  named("a priority between Rule A and Rule B is stated")
);
export const noResolvingException = Proposition(
  named("an exception resolving the overlap between Rule A and Rule B is stated")
);

export const ruleAClaim = claim(ruleA)
  .modality(obligatory())
  .polarity(asserted())
  .grounding(groundedAt(source.span(25, 148)))
  .statedBy(policyVoice)
  .confidence(confidence(1));
export const ruleBClaim = claim(ruleB)
  .modality(obligatory())
  .polarity(asserted())
  .grounding(groundedAt(source.span(150, 267)))
  .statedBy(policyVoice)
  .confidence(confidence(1));
export const noStatedPriorityClaim = claim(noStatedPriority)
  .polarity(denied())
  .grounding(groundedAt(source.span(287, 324)))
  .statedBy(policyVoice)
  .confidence(confidence(1));
export const noResolvingExceptionClaim = claim(noResolvingException)
  .polarity(denied())
  .grounding(groundedAt(source.span(335, 375)))
  .statedBy(policyVoice)
  .confidence(confidence(1));

export const semanticDiagnostics = Object.freeze([
  diagnostic(
    "LONGTEXT_GENERIC_PRIORITY_PROPOSITION",
    "The resolved ontology has no rule-priority identity; the source denial remains a grounded generic proposition.",
    { severity: "warning", responsible: noStatedPriority }
  ),
  diagnostic(
    "LONGTEXT_GENERIC_RESOLVING_EXCEPTION_PROPOSITION",
    "The resolved ontology has no resolving-exception identity; the source denial remains "
      + "a grounded generic proposition.",
    { severity: "warning", responsible: noResolvingException }
  )
]);

export default describe("source-001-north-gate-policy")
  .section(section("operational-rules", sequence(ruleAClaim, ruleBClaim)))
  .section(section(
    "resolution-status",
    sequence(noStatedPriorityClaim, noResolvingExceptionClaim)
  ))
  .coverage(
    coverage(OperationalRule)
      .forScope("source-001")
      .sources(...source.units)
      .complete(),
    coverage(Proposition)
      .forScope("source-001")
      .sources(...source.units)
      .partial()
  )
  .commit();
