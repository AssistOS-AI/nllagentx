import {
  ontology,
  entityKind,
  eventKind,
  propositionKind,
  documentArtifactKind,
  valueKind,
  role,
  requires,
  allows,
  exactlyOne,
  atMostOne,
  atLeastOne,
  lexicalize,
  capability
} from "../../../../../framework/sdk/ontology/index.mjs";
import {
  SemanticEntity,
  Event,
  Proposition,
  InformationArtifact,
  actor,
  source,
  context,
  evidence,
  value
} from "../../../../../framework/packs/core-language/ontologies/core.ontology.mjs";

const O = ontology("nl-rule-review.operational-policy", "1.0.0");

export const RuleEffect = O.value(
  valueKind("RuleEffect")
    .role(requires(value, exactlyOne()))
);

export const action = O.role(role("action").range(Event));
export const condition = O.role(role("condition").range(Proposition));
export const effect = O.role(role("effect").range(RuleEffect));

export const OperationalRule = O.entity(
  entityKind("OperationalRule")
    .subtypeOf(SemanticEntity)
    .role(requires(action, exactlyOne()))
    .role(requires(condition, exactlyOne()))
    .role(requires(effect, exactlyOne()))
    .provide(capability("RuleContradictionReview"))
);

export const EmergencyExceptionInvocation = O.event(
  eventKind("EmergencyExceptionInvocation")
    .subtypeOf(Event)
    .role(allows(actor, atMostOne()))
    .role(allows(context, atMostOne()))
);

export const invocation = O.role(
  role("invocation").range(EmergencyExceptionInvocation)
);

export const JustificationRecord = O.documentArtifact(
  documentArtifactKind("JustificationRecord")
    .subtypeOf(InformationArtifact)
    .role(requires(invocation, exactlyOne()))
    .role(allows(actor, atMostOne()))
);

export const ExceptionJustificationRequirement = O.entity(
  entityKind("ExceptionJustificationRequirement")
    .subtypeOf(SemanticEntity)
    .role(allows(action, atMostOne()))
    .provide(capability("ExceptionJustificationReview"))
);

export const SafetyConclusion = O.proposition(
  propositionKind("SafetyConclusion")
    .subtypeOf(Proposition)
    .role(requires(actor, exactlyOne()))
    .provide(capability("SafetyConclusionEvidenceReview"))
);

export const conclusion = O.role(role("conclusion").range(SafetyConclusion));

export const SupportsSafetyConclusion = O.event(
  eventKind("SupportsSafetyConclusion")
    .subtypeOf(Event)
    .role(requires(evidence, exactlyOne()))
    .role(requires(conclusion, exactlyOne()))
);

export const ProcedureRequest = O.entity(
  entityKind("ProcedureRequest")
    .subtypeOf(SemanticEntity)
    .role(requires(source, atLeastOne()))
    .provide(capability("OperationalProcedureGeneration"))
);

export const ProcedureStep = O.entity(
  entityKind("ProcedureStep")
    .subtypeOf(SemanticEntity)
    .role(requires(value, exactlyOne()))
    .role(requires(source, atLeastOne()))
);

export const requiredEffect = RuleEffect(value("required"));
export const forbiddenEffect = RuleEffect(value("forbidden"));
export const permittedEffect = RuleEffect(value("permitted"));

const procedureStep = (kind) => (...rules) => ProcedureStep(
  value(kind),
  ...rules.map((ruleValue) => source(ruleValue))
);

export const acknowledgementStep = procedureStep("acknowledgement");
export const authorizationStep = procedureStep("authorization");
export const gateActionStep = procedureStep("gate-action");
export const exceptionJustificationStep = procedureStep("exception-justification");
export const auditRecordingStep = procedureStep("audit-recording");

O.lexicon(lexicalize(OperationalRule).english("operational rule"));
O.lexicon(lexicalize(RuleEffect).english("rule effect"));
O.lexicon(lexicalize(EmergencyExceptionInvocation).english("invoke emergency exception"));
O.lexicon(lexicalize(ExceptionJustificationRequirement).english("exception justification requirement"));
O.lexicon(lexicalize(JustificationRecord).english("justification record"));
O.lexicon(lexicalize(SafetyConclusion).english("safety conclusion"));
O.lexicon(lexicalize(SupportsSafetyConclusion).english("supports safety conclusion"));
O.lexicon(lexicalize(ProcedureRequest).english("procedure request"));
O.lexicon(lexicalize(ProcedureStep).english("procedure step"));

export default O.seal();
