import {
  codingSkill,
  contextArtifact,
  cliTool,
  editRoot
} from "../../../../framework/sdk/agent/index.mjs";

const freezeEntries = (entries) => Object.freeze(entries.map((entry) => Object.freeze(entry)));

export const semanticGoal = Object.freeze({
  targetTexts: Object.freeze(["short operational policies", "event records"]),
  concerns: Object.freeze([
    "incompatible rule effects",
    "emergency-exception justification",
    "safety-conclusion evidence",
    "ordered operational procedure generation"
  ]),
  outputs: Object.freeze([
    "evidence-bearing findings",
    "typed CNL generation-plan frames",
    "explicit unknown and not-applicable boundaries"
  ]),
  guarantees: Object.freeze([
    "source grounding",
    "interpretation preservation",
    "coverage before absence",
    "deterministic replay",
    "no source-specific reusable facts"
  ])
});

export const selectedSpecifications = Object.freeze([
  "design-specifications/DS-000_System_Architecture_and_Check_Catalog.md",
  "design-specifications/DS-004_IntentJS_Load_Profiles_and_Dynamic_Circuit_Selection.md",
  "docs/specs/DS035-context-and-dependency-resolution.md",
  "docs/specs/DS041-agentic-natural-language-authoring.md",
  "docs/specs/DS034-core-language-pack.md",
  "docs/specs/DS001-coding-style.md",
  "docs/specs/DS022-nll-architect.md"
]);

export const artifactOwnership = freezeEntries([
  {
    path: "agent.mjs",
    ownerSkill: "nll-architect",
    responsibility: "Declare core-language use, the isolated local profile, and Codex direct editing."
  },
  {
    path: "profiles/minimal-core.profile.mjs",
    ownerSkill: "nll-architect",
    responsibility: "Override the project profile locally so only core-language is loaded."
  },
  {
    path: "ontologies/operational-policy.ontology.mjs",
    ownerSkill: "nll-ontology",
    responsibility: "Define reusable operational rules, exceptions, safety support, and procedure steps."
  },
  {
    path: "circuits/rule-contradiction.circuit.mjs",
    ownerSkill: "nll-circuit",
    responsibility: "Emit RULE_CONTRADICTION only for grounded, same-action, same-condition rule conflicts."
  },
  {
    path: "circuits/exception-justification.circuit.mjs",
    ownerSkill: "nll-circuit",
    responsibility: "Evaluate emergency invocation justification with explicit coverage handling."
  },
  {
    path: "circuits/safety-evidence.circuit.mjs",
    ownerSkill: "nll-circuit",
    responsibility: "Keep an author's safety conclusion distinct from source-grounded support."
  },
  {
    path: "circuits/procedure-plan.circuit.mjs",
    ownerSkill: "nll-circuit",
    responsibility: "Generate an ordered, provenance-retaining procedure plan from input rules."
  },
  {
    path: "tests/architecture-plan.test.mjs",
    ownerSkill: "nll-architect",
    responsibility: "Lock the profile isolation, ownership map, checks, and next-phase handoff."
  },
  {
    path: "tests/ontology.test.mjs",
    ownerSkill: "nll-ontology",
    responsibility: "Test stable identities, role cardinalities, core reuse, and the absence of finding laws."
  },
  {
    path: "tests/circuits.test.mjs",
    ownerSkill: "nll-test",
    responsibility: "Test conflict, violation, satisfied, unknown, and not-applicable circuit boundaries."
  },
  {
    path: "tests/cnl.test.mjs",
    ownerSkill: "nll-test",
    responsibility: "Test procedure ordering, source-bound slots, provenance, and CNL round-trip behavior."
  },
  {
    path: "tasks/<task-id>/intent/intent.mjs",
    ownerSkill: "nll-intent",
    responsibility: "Select only the relevant agent capabilities from the preserved task instruction."
  },
  {
    path: "tasks/<task-id>/longtext/root.longtext.mjs",
    ownerSkill: "nll-longtext",
    responsibility: "Own source-specific rules, records, anchors, contexts, alternatives, and coverage."
  }
]);

export const ontologyAllocation = freezeEntries([
  {
    identity: "nl-rule-review.operational-policy:OperationalRule",
    meaning: "A grounded rule whose action, condition, and effect can be compared."
  },
  {
    identity: "nl-rule-review.operational-policy:RuleEffect",
    meaning: "The required, forbidden, or permitted effect of an operational rule."
  },
  {
    identity: "nl-rule-review.operational-policy:EmergencyExceptionInvocation",
    meaning: "A recorded use of an emergency exception."
  },
  {
    identity: "nl-rule-review.operational-policy:ExceptionJustificationRequirement",
    meaning: "The policy rule requiring a source-grounded justification record."
  },
  {
    identity: "nl-rule-review.operational-policy:JustificationRecord",
    meaning: "A source-grounded information artifact that justifies an exception invocation."
  },
  {
    identity: "nl-rule-review.operational-policy:SafetyConclusion",
    meaning: "An author's proposition about safety, kept distinct from supporting evidence."
  },
  {
    identity: "nl-rule-review.operational-policy:SupportsSafetyConclusion",
    meaning: "A source-grounded link from Evidence to a SafetyConclusion."
  },
  {
    identity: "nl-rule-review.operational-policy:ProcedureRequest",
    meaning: "A request for an ordered procedure; IntentJS remains the selection authority."
  },
  {
    identity: "nl-rule-review.operational-policy:ProcedureStep",
    meaning: "A typed acknowledgement, authorization, gate, justification, or audit step."
  }
]);

export const coreLanguageReuse = Object.freeze([
  "core-language:Agent",
  "core-language:Event",
  "core-language:State",
  "core-language:Proposition",
  "core-language:InformationArtifact",
  "core-language:Evidence",
  "core-language:actor",
  "core-language:theme",
  "core-language:source",
  "core-language:target",
  "core-language:context",
  "core-language:evidence",
  "core-language:value"
]);

export const circuitContracts = freezeEntries([
  {
    capability: "RuleContradictionReview",
    finding: "RULE_CONTRADICTION:CONFLICT",
    absenceBoundary: "Omit or return NOT_APPLICABLE when fewer than two comparable grounded rules exist."
  },
  {
    capability: "ExceptionJustificationReview",
    finding: "MISSING_EXCEPTION_JUSTIFICATION:VIOLATED",
    absenceBoundary: "Return UNKNOWN without closed coverage for justification records."
  },
  {
    capability: "SafetyConclusionEvidenceReview",
    finding: "UNSUPPORTED_SAFETY_CONCLUSION:VIOLATED",
    absenceBoundary: "Return UNKNOWN without closed coverage for supporting evidence."
  },
  {
    capability: "OperationalProcedureGeneration",
    finding: "PROCEDURE_PLAN_READY:SATISFIED",
    absenceBoundary: "Omit or return NOT_APPLICABLE when procedure generation was not selected."
  }
]);

export const cnlOutputs = Object.freeze([
  "GenerationPlan",
  "ProcedureStep:acknowledgement",
  "ProcedureStep:authorization",
  "ProcedureStep:gate-action",
  "ProcedureStep:exception-justification",
  "ProcedureStep:audit-recording"
]);

export const testObligations = Object.freeze([
  "Same action and condition with required versus forbidden effects yields one conflict with both anchors.",
  "Different actions, conditions, or compatible effects do not yield a rule contradiction.",
  "Missing exception justification violates only under closed relevant coverage; open coverage is UNKNOWN.",
  "A safety conclusion is not its own evidence; support and coverage determine SATISFIED, VIOLATED, or UNKNOWN.",
  "Irrelevant or absent semantic terms are NOT_APPLICABLE or omitted, never false successes.",
  "The procedure frame orders acknowledgement before authorization and gate action and ends with audit recording.",
  "Emergency use requires a justification step, and every generated slot traces to input rules.",
  "Canonical CNL round-trips without changing the generation-plan meaning."
]);

export const handoff = Object.freeze({
  nextSkill: "nll-ontology",
  target: "ontologies/operational-policy.ontology.mjs",
  prerequisites: Object.freeze([
    "Use only core-language imports and agent-qualified additions.",
    "Keep source claims and coverage in task LongTextJS.",
    "Do not encode findings as ontology laws."
  ]),
  blockers: Object.freeze([])
});

const architecturePlan = codingSkill("nl-rule-review-agent.architecture")
  .specs("DS-000", "DS-004", "DS035", "DS041", "DS034", "DS001", "DS022")
  .context(
    contextArtifact("PROJECT_MAP.md"),
    contextArtifact("SDK_CATALOG.md"),
    contextArtifact("ONTOLOGY_CATALOG.md"),
    contextArtifact("CIRCUIT_CATALOG.md"),
    contextArtifact("PROFILE_RESOLUTION.md"),
    contextArtifact("SOURCE_OUTLINE.md")
  )
  .tools(
    cliTool("nllAgent files index"),
    cliTool("nllAgent catalog sdk"),
    cliTool("nllAgent catalog ontology"),
    cliTool("nllAgent catalog circuit"),
    cliTool("nllAgent profile resolve"),
    cliTool("nllAgent source outline"),
    cliTool("nllAgent context show")
  )
  .dependsOn("nll-ontology", "nll-circuit", "nll-test", "nll-intent", "nll-longtext")
  .edits(editRoot("agent"), editRoot("architecture-plan"), editRoot("work-plan"))
  .phase("ontology", "circuit", "test", "task-intent", "task-longtext", "handoff")
  .seal();

export default architecturePlan;
