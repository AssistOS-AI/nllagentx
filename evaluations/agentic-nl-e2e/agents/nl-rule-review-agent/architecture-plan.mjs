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
    "non-empty qualitative finding messages",
    "structured human-readable requirement details",
    "verified exact SourceSpan evidence for Markdown quotations",
    "typed CNL generation-plan frames",
    "tagged primary Markdown CNL",
    "explicit unknown and not-applicable boundaries"
  ]),
  guarantees: Object.freeze([
    "source grounding",
    "interpretation preservation",
    "coverage before absence",
    "response presentation cannot change semantic findings",
    "material filtering, grouping, stable tags, and matched-rule explanations",
    "primary response separation from raw findings, assurance, logs, and traces",
    "deterministic replay",
    "no source-specific reusable facts"
  ])
});

export const selectedSpecifications = Object.freeze([
  "design-specifications/DS-000_System_Architecture_and_Check_Catalog.md",
  "design-specifications/DS-004_IntentJS_Load_Profiles_and_Dynamic_Circuit_Selection.md",
  "docs/specs/DS035-context-and-dependency-resolution.md",
  "docs/specs/DS041-agentic-natural-language-authoring.md",
  "docs/specs/DS042-adaptive-task-local-authoring-and-verification.md",
  "docs/specs/DS043-primary-markdown-cnl-response.md",
  "docs/specs/DS044-response-circuit-composition-and-intent-presentation.md",
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
    responsibility: "Emit a qualitative RULE_CONTRADICTION only for grounded, same-action, same-condition conflicts."
  },
  {
    path: "circuits/exception-justification.circuit.mjs",
    ownerSkill: "nll-circuit",
    responsibility: "Evaluate justification with coverage-aware requirement details and exact invocation evidence."
  },
  {
    path: "circuits/safety-evidence.circuit.mjs",
    ownerSkill: "nll-circuit",
    responsibility: "Keep a conclusion distinct from support and expose response-ready evidence details."
  },
  {
    path: "circuits/procedure-plan.circuit.mjs",
    ownerSkill: "nll-circuit",
    responsibility: "Generate an ordered, provenance-retaining procedure plan from input rules."
  },
  {
    path: "circuits/review-support.mjs",
    ownerSkill: "nll-circuit",
    responsibility: "Share deterministic finding construction without erasing messages, details, evidence, or contexts."
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
    path: "tests/response.test.mjs",
    ownerSkill: "nll-test",
    responsibility: "Test default response composition, exact quotations, tags, grouping, and artifact separation."
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

export const sourceFactAllocation = Object.freeze({
  owner: "tasks/<task-id>/longtext/",
  includes: Object.freeze([
    "source-grounded operational-rule claims",
    "exception invocations and justification records",
    "safety conclusions and distinct supporting evidence links",
    "procedure requests",
    "verified SourceSpan anchors, interpretation contexts, alternatives, and coverage witnesses"
  ]),
  excludes: Object.freeze([
    "agent-default source facts",
    "negative absence conclusions without closed relevant coverage"
  ])
});

export const intentPresentationPolicy = Object.freeze({
  owner: "tasks/<task-id>/intent/intent.mjs",
  outputs: Object.freeze(["findings", "markdown-cnl"]),
  analysisDirectives: Object.freeze([
    "evidenceLed()",
    "groupResultsBy(\"status-family\")",
    "explainMatchedRules()",
    "quoteSourceEvidence()",
    "countResultGroups()",
    "emitStableCnlTags()"
  ]),
  generationDirective: "procedural()",
  rule: "IntentJS selects presentation but cannot change finding status, details, or evidence."
});

export const responseCircuitDecision = Object.freeze({
  customAgentCircuitRequired: false,
  inherited: Object.freeze([
    "response-circuit:nll.response.MaterialSelection@1.0.0",
    "response-circuit:nll.response.IntentStyle@1.0.0",
    "response-circuit:nll.response.GroupedAnalysis@1.0.0",
    "response-circuit:nll.response.GeneratedContent@1.0.0"
  ]),
  reason: "The resolved orthogonal defaults already filter, style, group, count, tag, and select generated content.",
  extensionTrigger: "Add agent/cnl/*.response.circuit.mjs only if a later reusable presentation need is unsupported."
});

export const findingOutputContract = Object.freeze({
  message: "Every emitted finding carries a non-empty qualitative conclusion appropriate to its status.",
  detailKeys: Object.freeze([
    "failedRequirements",
    "uncertainRequirements",
    "conflictingRequirements",
    "satisfiedRequirements"
  ]),
  details: "Applicable keys contain human-readable requirement statements plus relevant stable counts.",
  evidence: "Every visible analysis finding reaches verified exact SourceSpan intervals through its evidence graph.",
  separation: "Raw projections, semantic identities, assurance paths, logs, and traces stay outside response.md."
});

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
    message: "Explain that the same action and condition receive required and forbidden effects.",
    requirementDetails: Object.freeze(["same action", "same condition", "compatible effects"]),
    exactEvidence: "Both source-grounded rule spans.",
    absenceBoundary: "Omit or return NOT_APPLICABLE when fewer than two comparable grounded rules exist."
  },
  {
    capability: "ExceptionJustificationReview",
    finding: "MISSING_EXCEPTION_JUSTIFICATION:VIOLATED",
    message: "Explain that an invoked emergency exception lacks its required justification record.",
    requirementDetails: Object.freeze(["invocation recorded", "justification record required"]),
    exactEvidence: "The invocation and policy-requirement spans; absence itself is never fabricated as a quote.",
    absenceBoundary: "Return UNKNOWN without closed coverage for justification records."
  },
  {
    capability: "SafetyConclusionEvidenceReview",
    finding: "UNSUPPORTED_SAFETY_CONCLUSION:VIOLATED",
    message: "Explain that the stated safety conclusion has no distinct source-grounded support.",
    requirementDetails: Object.freeze(["safety conclusion stated", "distinct supporting evidence required"]),
    exactEvidence: "The conclusion span and any actual support span; the conclusion is not its own support.",
    absenceBoundary: "Return UNKNOWN without closed coverage for supporting evidence."
  },
  {
    capability: "OperationalProcedureGeneration",
    finding: "PROCEDURE_PLAN_READY:SATISFIED",
    message: "Explain that the grounded rules are sufficient to generate the ordered procedure.",
    requirementDetails: Object.freeze(["grounded request", "grounded input rules", "required step ordering"]),
    exactEvidence: "The request and every input-rule span used by generated slots.",
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
  "Canonical CNL round-trips without changing the generation-plan meaning.",
  "Every finding has a qualitative message and human-readable structured requirement details.",
  "Every visible analysis finding renders exact verified source quotations from its evidence graph.",
  "Default response composition filters non-applicable results, groups and counts material results, " +
    "explains rules, and emits stable tags.",
  "The primary Markdown CNL omits raw projections and assurance path tables while technical artifacts remain separate."
]);

export const evaluationCases = freezeEntries([
  {
    case: "contradictory-rules",
    expected: "One RULE_CONTRADICTION conflict quoting both incompatible rules."
  },
  {
    case: "missing-exception-justification",
    expected: "One violated result quoting the invocation and its justification requirement."
  },
  {
    case: "unsupported-safety-conclusion",
    expected: "One violated result quoting the conclusion without treating it as supporting evidence."
  },
  {
    case: "generate-compliant-procedure",
    expected: "A ready finding plus ordered typed frames with rule provenance and procedural presentation."
  }
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
  .specs(
    "DS-000",
    "DS-004",
    "DS035",
    "DS041",
    "DS042",
    "DS043",
    "DS044",
    "DS034",
    "DS001",
    "DS022"
  )
  .context(
    contextArtifact("PROJECT_MAP.md"),
    contextArtifact("SDK_CATALOG.md"),
    contextArtifact("ONTOLOGY_CATALOG.md"),
    contextArtifact("CIRCUIT_CATALOG.md"),
    contextArtifact("RESPONSE_CIRCUIT_CATALOG.md"),
    contextArtifact("PROFILE_RESOLUTION.md"),
    contextArtifact("SOURCE_OUTLINE.md")
  )
  .tools(
    cliTool("nllAgent files index"),
    cliTool("nllAgent catalog sdk"),
    cliTool("nllAgent catalog ontology"),
    cliTool("nllAgent catalog circuit"),
    cliTool("nllAgent catalog response"),
    cliTool("nllAgent profile resolve"),
    cliTool("nllAgent source outline"),
    cliTool("nllAgent context show")
  )
  .dependsOn("nll-ontology", "nll-circuit", "nll-test", "nll-intent", "nll-longtext")
  .edits(editRoot("agent"), editRoot("architecture-plan"), editRoot("work-plan"))
  .phase("ontology", "circuit", "response-contract-test", "task-intent", "task-longtext", "handoff")
  .seal();

export default architecturePlan;
