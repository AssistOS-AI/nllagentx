import { diagnostic } from "../../../../../../../../framework/sdk/core/diagnostics.mjs";
import {
  asserted,
  claim,
  confidence,
  coverage,
  describe,
  groundedAt,
  named,
  obligatory,
  permitted,
  section,
  sequence,
  taskSource
} from "../../../../../../../../framework/sdk/longtext/index.mjs";
import {
  Event,
  InformationArtifact,
  OperationalRule,
  ProcedureRequest,
  Proposition,
  RuleEffect,
  action,
  condition,
  effect,
  source as ruleSource,
  value
} from "../../sdk/ontology.generated.mjs";
import registry from "../../source/source-map.mjs";

const source = taskSource("source-001", registry);
const policyVoice = InformationArtifact(named("Procedure Requirements"));
const requiredEffect = RuleEffect(value("required"));
const permittedEffect = RuleEffect(value("permitted"));

export const acknowledgeBeforeAuthorization = Event(
  named("acknowledge an active alarm before requesting authorization to open the north gate")
);
export const authorizationWillBeRequested = Proposition(
  named("the operator requests authorization to open the north gate")
);
export const acknowledgementRule = OperationalRule(
  action(acknowledgeBeforeAuthorization),
  condition(authorizationWillBeRequested),
  effect(requiredEffect)
);

export const recordAuthorizationBeforeOpening = Event(
  named("record authorization before the north gate is opened")
);
export const northGateWillBeOpened = Proposition(
  named("the north gate is to be opened")
);
export const authorizationRule = OperationalRule(
  action(recordAuthorizationBeforeOpening),
  condition(northGateWillBeOpened),
  effect(requiredEffect)
);

export const earlierEmergencyOpening = Event(
  named("open the north gate earlier under an emergency exception")
);
export const emergencyExceptionApplies = Proposition(
  named("an emergency exception applies")
);
export const emergencyPermissionRule = OperationalRule(
  action(earlierEmergencyOpening),
  condition(emergencyExceptionApplies),
  effect(permittedEffect)
);

export const recordExceptionReason = Event(
  named("record the reason for an invoked emergency exception")
);
export const emergencyExceptionIsInvoked = Proposition(
  named("the operator invokes an emergency exception")
);
export const exceptionJustificationRule = OperationalRule(
  action(recordExceptionReason),
  condition(emergencyExceptionIsInvoked),
  effect(requiredEffect)
);

export const finishWithAuditEntry = Event(
  named("finish the opening with an audit entry identifying the operator and time")
);
export const ordinaryOrExceptionalOpeningOccurs = Proposition(
  named("an ordinary or exceptional opening occurs")
);
export const auditRecordingRule = OperationalRule(
  action(finishWithAuditEntry),
  condition(ordinaryOrExceptionalOpeningOccurs),
  effect(requiredEffect)
);

export const procedureRequest = ProcedureRequest(
  ruleSource(acknowledgementRule),
  ruleSource(authorizationRule),
  ruleSource(emergencyPermissionRule),
  ruleSource(exceptionJustificationRule),
  ruleSource(auditRecordingRule)
);

export const procedureRequestClaim = claim(procedureRequest)
  .polarity(asserted())
  .grounding(groundedAt(source.span(0, 22)))
  .statedBy(policyVoice)
  .confidence(confidence(1));
export const acknowledgementRuleClaim = claim(acknowledgementRule)
  .modality(obligatory())
  .polarity(asserted())
  .grounding(groundedAt(source.span(24, 124)))
  .statedBy(policyVoice)
  .confidence(confidence(1));
export const authorizationRuleClaim = claim(authorizationRule)
  .modality(obligatory())
  .polarity(asserted())
  .grounding(groundedAt(source.span(125, 182)))
  .statedBy(policyVoice)
  .confidence(confidence(1));
export const emergencyPermissionRuleClaim = claim(emergencyPermissionRule)
  .modality(permitted())
  .polarity(asserted())
  .grounding(groundedAt(source.span(183, 295)))
  .statedBy(policyVoice)
  .confidence(confidence(1));
export const exceptionJustificationRuleClaim = claim(exceptionJustificationRule)
  .modality(obligatory())
  .polarity(asserted())
  .grounding(groundedAt(source.span(183, 295)))
  .statedBy(policyVoice)
  .confidence(confidence(1));
export const auditRecordingRuleClaim = claim(auditRecordingRule)
  .modality(obligatory())
  .polarity(asserted())
  .grounding(groundedAt(source.span(296, 404)))
  .statedBy(policyVoice)
  .confidence(confidence(1));

export const semanticDiagnostics = Object.freeze([
  diagnostic(
    "LONGTEXT_GENERIC_PROCEDURE_ORDERING",
    "The resolved ontology has no temporal-precedence role for operational rules; source ordering remains "
      + "in grounded generic actions and conditions.",
    { severity: "warning", responsible: procedureRequest }
  ),
  diagnostic(
    "LONGTEXT_GENERIC_AUDIT_SCOPE",
    "The resolved ontology has no universal or disjunctive scope role for ordinary and exceptional openings; "
      + "the audit scope remains in a grounded generic condition.",
    { severity: "warning", responsible: auditRecordingRule }
  )
]);

export default describe("source-001-procedure-requirements")
  .section(section("procedure-request", sequence(procedureRequestClaim)))
  .section(section(
    "operational-rules",
    sequence(
      acknowledgementRuleClaim,
      authorizationRuleClaim,
      emergencyPermissionRuleClaim,
      exceptionJustificationRuleClaim,
      auditRecordingRuleClaim
    )
  ))
  .coverage(
    coverage(ProcedureRequest)
      .forScope("source-001")
      .sources(...source.units)
      .complete(),
    coverage(OperationalRule)
      .forScope("source-001")
      .sources(...source.units)
      .complete()
  )
  .commit();
