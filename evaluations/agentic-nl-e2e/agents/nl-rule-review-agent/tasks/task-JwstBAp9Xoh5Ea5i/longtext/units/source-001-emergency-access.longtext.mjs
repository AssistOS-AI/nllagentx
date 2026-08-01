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
  obligatory,
  section,
  sequence,
  taskSource
} from "../../../../../../../../framework/sdk/longtext/index.mjs";
import {
  Agent,
  Context,
  EmergencyExceptionInvocation,
  ExceptionJustificationRequirement,
  InformationArtifact,
  JustificationRecord,
  actor,
  context,
  invocation
} from "../../sdk/ontology.generated.mjs";
import registry from "../../source/source-map.mjs";

const source = taskSource("source-001", registry);
const policyVoice = InformationArtifact(named("Emergency Access Policy and Log"));

export const operatorAna = Agent(named("operator Ana"));
export const openingEntryContext = Context(
  named("event log entry at 09:02 opening the north gate")
);

export const justificationRequirement = ExceptionJustificationRequirement();
export const emergencyAccessInvocation = EmergencyExceptionInvocation(
  actor(operatorAna),
  context(openingEntryContext)
);
export const linkedJustificationRecord = JustificationRecord(
  invocation(emergencyAccessInvocation)
);

export const justificationRequirementClaim = claim(justificationRequirement)
  .modality(obligatory())
  .polarity(asserted())
  .grounding(groundedAt(source.span(46, 144)))
  .statedBy(policyVoice)
  .confidence(confidence(1));
export const emergencyAccessInvocationClaim = claim(emergencyAccessInvocation)
  .modality(actual())
  .polarity(asserted())
  .grounding(groundedAt(source.span(157, 245)))
  .statedBy(policyVoice)
  .confidence(confidence(1));
export const noLinkedJustificationRecordClaim = claim(linkedJustificationRecord)
  .polarity(denied())
  .grounding(groundedAt(source.span(284, 349)))
  .statedBy(policyVoice)
  .confidence(confidence(1));

export default describe("source-001-emergency-access-policy-and-log")
  .section(section("policy-rule", sequence(justificationRequirementClaim)))
  .section(section("event-log", sequence(emergencyAccessInvocationClaim)))
  .section(section("justification-status", sequence(noLinkedJustificationRecordClaim)))
  .coverage(
    coverage(ExceptionJustificationRequirement)
      .forScope("source-001")
      .sources(...source.units)
      .complete(),
    coverage(EmergencyExceptionInvocation)
      .forScope("source-001")
      .sources(...source.units)
      .complete(),
    coverage(JustificationRecord)
      .forScope("source-001")
      .sources(...source.units)
      .complete()
  )
  .commit();
