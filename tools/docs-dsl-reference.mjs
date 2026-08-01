import * as Ontology from "../framework/sdk/ontology/index.mjs";
import * as Intent from "../framework/sdk/intent/index.mjs";
import * as LongText from "../framework/sdk/longtext/index.mjs";
import * as Circuit from "../framework/sdk/circuit/index.mjs";
import * as CNL from "../framework/sdk/cnl/index.mjs";

const surfaces = Object.freeze({ ontology: Ontology, intent: Intent, longtext: LongText, circuit: Circuit, cnl: CNL });

const categoryNames = Object.freeze({
  ontology: Object.freeze({
    "Builders and models": ["Builder", "Module", "Cardinality", "RoleUse", "Capability", "Guarantee", "PackReference"],
    "Ontology kinds": ["entityKind", "eventKind", "stateKind", "qualityKind", "valueKind", "propositionKind", "documentArtifactKind"],
    "Roles and relations": ["role", "relation", "requires", "optional", "repeatable", "exactlyOne", "atLeastOne", "atMostOne", "subtypeOf", "disjointWith"],
    "Knowledge declarations": ["fact", "law", "allows", "lexicalize", "lexicalSignals", "semanticSignals", "capability", "guarantee", "concept"],
    "Pack composition": ["ontology", "ontologyModule", "domainPack", "packIndex", "packRef", "circuitModule", "knowledgeLevel", "loadTier", "coreTier", "baselineTier", "domainTier", "specializedTier", "lowerSecondary"]
  }),
  intent: Object.freeze({
    "Builders and models": ["IntentBuilder", "IntentFragment", "IntentModel", "LoadProfile", "LoadProfileBuilder", "ProfileDirective", "intent", "loadProfile"],
    "Operation modes": ["analyze", "validate", "compare", "explain", "repair", "canonicalize", "generate", "plan", "summarizeSemantically", "askForClarification", "analyzeAndPlan"],
    "Text targets": ["longDocument", "narrativeText", "legalText", "scientificText", "argumentText", "taskScope"],
    "Domain selection": ["explicitDomain", "preferDomain", "allowDomain", "excludeDomain", "inferDomainsFromSource", "inferFromSource"],
    "Concerns and outputs": ["concern", "findings", "cnlObservations", "markdownCnl", "compositionPlan", "structuralTrace", "repairFrames", "clarificationQuestions"],
    "Evidence and assurance": ["concreteExecution", "abstractPreflight", "symbolicWhereSupported", "symbolicDecisionCoverage", "interpretationRobust", "sourceGrounded"],
    "Fallback and profiles": ["allCompatible", "resourcePolicy", "usePack", "useEveryCompatiblePack", "concreteFirst", "abstractPreflightForSelectedCircuits", "allCompatibleWithinLoadedPacks", "runEveryCompatibleCircuit", "explainAllSelection", "preferConcern", "requireEvidenceBearing"]
  }),
  longtext: Object.freeze({
    "Builders and models": ["Builder", "LongTextModel", "DocumentSection", "SemanticRelation", "Claim"],
    "Source and grounding": ["SourceRegistry", "SourceSpan", "SourceUnit", "sourceUnit", "taskSource", "groundedAt"],
    "Claims and polarity": ["claim", "asserted", "denied", "questioned", "actual", "hypothetical", "possible", "necessary", "obligatory", "permitted", "confidence"],
    "Context and interpretation": ["context", "within", "reportedBy", "statedBy", "definedIn", "interpretation", "named", "condition", "exception", "appliesTo"],
    "Collections and alternatives": ["section", "describe", "sequence", "setOf", "bagOf", "allOf", "anyOf", "alternatives", "orderedBy"],
    "Identity and relations": ["sameEntity", "possibleSameEntity", "differentEntity", "refersTo", "before", "after", "during", "overlaps"],
    "Coverage and time": ["coverage", "coverageSet", "scopeClosed", "scopeOpen", "DateValue", "ClockTime", "Duration", "Days", "Months", "Years", "interval"]
  }),
  circuit: Object.freeze({
    "Builders, models, and catalogs": ["Builder", "CircuitModel", "CheckCatalogBuilder", "checkCatalog", "checkFamily", "circuit", "compositeCircuit", "STATUSES"],
    "Query and conditions": ["QueryNode", "PredicateCondition", "variable", "match", "exists", "notExists", "none", "groundedBy", "withinScope", "inWorld", "anySourceSpan", "before", "after", "during", "overlaps", "sameEntity", "mayAlias", "differentEntity"],
    "Query algebra": ["select", "project", "bind", "join", "on", "where", "all", "count", "groupBy", "orderBy", "aggregate", "min", "max", "sum", "path", "reachable", "closure"],
    "Decisions and results": ["Decision", "EvidenceTemplate", "Finding", "FindingTemplate", "evidence", "when", "row", "decisionTable", "satisfied", "violated", "unknown", "conflict", "notApplicable", "acceptedException", "possibleProblem", "blockedOntology", "blockedCoverage", "blockedResource", "blockedMethod", "findingResult", "findingSet", "evidenceReference"],
    "Stages and emissions": ["ProceduralStage", "proceduralStage", "mapEach", "emitEach", "emitFinding", "emitCNLFrame", "emitAssessment", "emitClarification", "emitCollection", "emitDerivedFact", "emitRefinementDemand"],
    "Composition and ports": ["CapabilityRequest", "typedPort", "connect", "composeByCapability", "requireCapability", "provideCapability", "capability", "guarantee", "concept", "concern", "targetText", "outputKind", "coverageRequirement", "closedForRelevantScope", "compliance"],
    "Assurance": ["AssuranceRequest", "concreteExecution", "abstractPreflight", "symbolicDecisionCoverage", "boundedCounterexampleSearch", "constraintProof", "cnlRoundTrip"]
  }),
  cnl: Object.freeze({
    "Frames and builders": ["CNLFrame", "CNLFrameBuilder", "observationFrame", "assertionFrame", "definitionFrame", "obligationFrame", "prohibitionFrame", "permissionFrame", "recommendationFrame", "causalFrame", "claimEvidenceFrame", "narrativeEventFrame", "procedureStepFrame", "documentSectionFrame", "findingFrame", "repairFrame", "clarificationFrame", "generationPlan"],
    "Slots and provenance": ["subject", "predicate", "evidenceSlot", "certainty", "recommendation", "conditional", "sourceBound", "slot", "literalSlot", "isCNLFrame"],
    "Canonical grammar": ["renderCanonicalCNL", "parseCanonicalCNL", "frameProjection", "compareFrames", "roundTripFrame"],
    "Response directives": ["ResponseDirective", "responseStyle", "evidenceLed", "analytical", "concise", "procedural", "groupResultsBy", "includeResultStatus", "excludeResultStatus", "includeResultTag", "excludeResultTag", "includeSatisfiedResults", "explainMatchedRules", "quoteSourceEvidence", "countResultGroups", "emitStableCnlTags"],
    "Response circuits": ["ResponseStage", "ResponseCircuitBuilder", "ResponseCircuitModel", "responseStage", "responseCircuit"]
  })
});

const exactDescriptions = Object.freeze({
  ontology: "Starts an ontology module whose sealed identity qualifies every contained semantic definition.",
  taskSource: "Binds a decoded SourceRegistry entry and creates verified absolute spans by offsets or exact text.",
  claim: "Starts a source-attributed claim builder; modality, polarity, context, interpretation, and grounding remain explicit.",
  coverage: "Starts a coverage witness; closed coverage is required before absence can become a negative conclusion.",
  intent: "Starts the task selection policy; seal() produces immutable IntentJS consumed by the planner and response composer.",
  allCompatible: "Declares the explicit fallback that runs every compatible provider inside the already loaded knowledge boundary.",
  decisionTable: "Builds ordered semantic rows with overlap and exhaustiveness policy; every row emits a typed result.",
  proceduralStage: "Wraps a named algorithm with declared reads, writes, concrete implementation, and optional abstract/symbolic adapters.",
  findingResult: "Reconstructs an executable Finding from retained code, status, evidence references, details, message, and circuit identity.",
  renderCanonicalCNL: "Renders a typed frame into compact deterministic FRAME syntax without expanding SDK functions or internal objects.",
  responseCircuit: "Builds a versioned post-execution circuit with priority, applicability predicate, and ordered response stages.",
  groupResultsBy: "IntentJS presentation directive selecting status-family, status, code, or circuit grouping.",
  includeSatisfiedResults: "Prevents material-result suppression from hiding applicable satisfied findings in audit/completeness views."
});

const predefinedValues = Object.freeze({
  ontology: Object.freeze([
    ["Concept kind", "Entity / Event / State / Quality / Value / Proposition / DocumentArtifact", "Selects the semantic sort, available roles and index behavior of a declared concept."],
    ["Role cardinality", "required / optional / repeatable / exactly-one / at-least-one / at-most-one", "Constrains how many fillers a frame role may have without turning cardinality into prose."],
    ["Load tier", "core / baseline / domain / specialized", "Orders knowledge loading; it does not imply that a task source asserts the tier's facts."],
    ["Knowledge level", "lower-secondary and declared pack-specific levels", "Records intended knowledge calibration independently of source evidence and runtime truth."]
  ]),
  intent: Object.freeze([
    ["Operation", "analyze / validate / compare / explain / repair / canonicalize", "Selects an analysis-shaped request without fabricating a target finding."],
    ["Operation", "generate / plan / analyze-and-plan / summarize-semantically / ask-for-clarification", "Selects generation, planning, semantic summary or clarification behavior."],
    ["Primary output", "markdown-cnl", "Requires the tagged human-readable response written to results/response.md."],
    ["Technical/semantic output", "findings / cnl-observations / composition-plan / structural-trace / repair-frames / clarification-questions", "Selects typed underlying artifacts; these do not replace the primary Markdown answer."],
    ["Fallback", "all-compatible", "Runs every provider compatible with the loaded profile when the intent does not narrow selection."],
    ["Domain mode", "require / prefer / allow / exclude / infer-from-source", "Controls pack selection while keeping explicit requirements above inferred source signals."]
  ]),
  longtext: Object.freeze([
    ["Polarity", "asserted / denied / questioned", "Preserves positive, negative and interrogative source force."],
    ["World/modal status", "actual / hypothetical / possible / necessary", "Separates what the source says happened from alternatives and modal claims."],
    ["Deontic status", "obligatory / permitted", "Models requirements and permissions without treating them as actual events."],
    ["Collection semantics", "sequence / set / bag / all-of / any-of / alternatives", "Preserves order, multiplicity, conjunction, disjunction and competing interpretations."],
    ["Coverage", "scope-open / scope-closed", "Only closed relevant coverage permits a circuit to interpret absence as a negative fact."],
    ["Identity relation", "same / possible-same / different", "Keeps proved identity, alias hypotheses and proved distinction separate."]
  ]),
  circuit: Object.freeze([
    ...Circuit.STATUSES.map((status) => ["Finding status", status, ({
      SATISFIED: "The selected rule is supported by the required evidence.",
      VIOLATED: "A covered requirement is not satisfied.",
      UNKNOWN: "The available evidence or coverage cannot decide the rule.",
      CONFLICT: "Mutually incompatible evidence supports different outcomes.",
      NOT_APPLICABLE: "The circuit is compatible but the current store has no relevant instance; public response circuits omit it.",
      ACCEPTED_EXCEPTION: "A violation-shaped condition is explicitly excused by a supported exception.",
      POSSIBLE_PROBLEM: "Evidence justifies review but not a definite violation.",
      BLOCKED_ONTOLOGY: "A required semantic identity or ontology closure is missing.",
      BLOCKED_COVERAGE: "Required source coverage is absent or open.",
      BLOCKED_RESOURCE: "A declared resource is unavailable.",
      BLOCKED_METHOD: "The requested execution/assurance method is unsupported."
    })[status] ?? "Typed circuit result status."]),
    ["Assurance", "concrete-execution", "Runs actual circuit stages against the SemanticStore and is the required truth-bearing execution."],
    ["Assurance", "abstract-preflight", "Propagates finite abstract values to check convergence and reachable status families."],
    ["Assurance", "symbolic-decision-coverage", "Explores decision conditions with declared exclusivity and reports path completeness/truncation."],
    ["Assurance", "bounded-counterexample / constraint-proof / cnl-round-trip", "Runs the specialized auxiliary method only when both request and circuit declare support."]
  ]),
  cnl: Object.freeze([
    ["Response style", "evidence-led", "Leads with material conclusions, rule explanation and ranked exact input quotations."],
    ["Response style", "analytical", "Retains more evidence and details for comparison or deep review."],
    ["Response style", "concise", "Keeps stable result markers while limiting rule prose and quotations."],
    ["Response style", "procedural", "Places ordered generated ProcedureStep frames before the readiness finding."],
    ["Grouping", "status-family / status / code / circuit", "Groups selected entries by user-facing family, exact status, stable code or producing circuit."],
    ["Stable marker", "[CNL:DOCUMENT] / [CNL:GROUP] / [CNL:FINDING]", "Delimits filterable document, group and finding blocks for humans or a later formatter LLM."],
    ["Empty result marker", "[CNL:NO-MATERIAL-RESULT]", "Emits one compact statement; it never lists every non-applicable circuit."],
    ["Local response module", "*.response.circuit.mjs", "Executable agent/task policy loaded after framework defaults and ordered by identity plus priority."]
  ])
});

function predefinedValueTable(surface, escapeHtml) {
  const rows = predefinedValues[surface].map(([domain, value, meaning]) => `<tr><td>${escapeHtml(domain)}</td><td><code>${escapeHtml(value)}</code></td><td>${escapeHtml(meaning)}</td></tr>`).join("");
  return `<h2>Predefined values and semantic distinctions</h2><p>These values are part of the DSL contract. They remain distinct during planning, execution, response composition and replay.</p><div class="table-wrap"><table><thead><tr><th>Domain</th><th>Value(s)</th><th>Meaning and boundary</th></tr></thead><tbody>${rows}</tbody></table></div>`;
}

function categoryFor(surface, name) {
  for (const [category, patterns] of Object.entries(categoryNames[surface])) {
    if (patterns.some((pattern) => {
      const candidate = name.toLocaleLowerCase("en");
      const token = pattern.toLocaleLowerCase("en");
      return candidate === token || (token.length >= 5 && (candidate.startsWith(token) || candidate.endsWith(token)));
    })) return category;
  }
  return "Supporting constructor";
}

function parametersOf(value) {
  if (typeof value !== "function") return "";
  const source = Function.prototype.toString.call(value);
  const start = source.indexOf("(");
  if (start >= 0) {
    let depth = 1;
    let quote = null;
    let escaped = false;
    for (let index = start + 1; index < source.length; index += 1) {
      const character = source[index];
      if (quote) {
        if (escaped) escaped = false;
        else if (character === "\\") escaped = true;
        else if (character === quote) quote = null;
        continue;
      }
      if (["\"", "'", "`"].includes(character)) quote = character;
      else if (character === "(") depth += 1;
      else if (character === ")") {
        depth -= 1;
        if (depth === 0) return source.slice(start + 1, index).replace(/\s+/g, " ").trim();
      }
    }
  }
  const arrow = source.match(/^\s*([^=()\s]+)\s*=>/);
  return arrow?.[1] ?? "";
}

function callShape(name, value) {
  if (typeof value === "function" && /^class\s/.test(Function.prototype.toString.call(value))) return `class ${name}`;
  if (typeof value === "function") return `${name}(${parametersOf(value) || "…"})`;
  return name;
}

function resultTypeFor(surface, name, value, category) {
  if (typeof value !== "function") return Array.isArray(value) ? "immutable value catalog" : "exported constant";
  if (/Builder$/.test(name)) return `${name} instance`;
  if (/^[A-Z].*(?:Model|Module|Frame|Finding|Claim|SourceSpan|SourceUnit)$/.test(name)) return `${name} instance`;
  const byCategory = {
    "Ontology kinds": "KindBuilder → sealed concept definition",
    "Roles and relations": "role/cardinality/relation semantic value",
    "Knowledge declarations": "ontology-owned declaration",
    "Pack composition": "sealed module, pack, tier, or reference",
    "Operation modes": "IntentFragment",
    "Text targets": "IntentFragment",
    "Domain selection": "ProfileDirective or IntentFragment",
    "Concerns and outputs": "IntentFragment",
    "Evidence and assurance": "IntentFragment or AssuranceRequest",
    "Fallback and profiles": "Intent/Profile directive",
    "Source and grounding": "source registry/unit/span or grounding",
    "Claims and polarity": "ClaimBuilder or claim facet",
    "Context and interpretation": "context/interpretation semantic value",
    "Collections and alternatives": "typed semantic collection",
    "Identity and relations": "SemanticRelation",
    "Coverage and time": "coverage or temporal value",
    "Query and conditions": "QueryNode or PredicateCondition",
    "Query algebra": "composed QueryNode",
    "Decisions and results": "decision/result/finding semantic value",
    "Stages and emissions": "stage or typed emission declaration",
    "Composition and ports": "capability/port/composition value",
    Assurance: "AssuranceRequest",
    "Frames and builders": "CNLFrame or CNLFrameBuilder",
    "Slots and provenance": "typed CNL slot/provenance value",
    "Canonical grammar": "canonical text, parsed frame, or comparison",
    "Response directives": "ResponseDirective",
    "Response circuits": "ResponseStage or ResponseCircuit model/builder"
  };
  return byCategory[category] ?? `${surface} semantic value or builder`;
}

function descriptionFor(surface, name, category) {
  if (exactDescriptions[name]) return exactDescriptions[name];
  const lower = name.replace(/([a-z])([A-Z])/g, "$1 $2").toLocaleLowerCase("en");
  const descriptions = {
    "Builders and models": `Immutable ${surface} ${lower}; builder instances validate and seal the corresponding semantic model.`,
    "Builders, models, and catalogs": `Executable ${lower} used to construct, seal, or catalog CircuitJS declarations.`,
    "Ontology kinds": `Declares the ${lower.replace(" kind", "")} semantic sort and returns a KindBuilder for parents, roles, disjointness, and capabilities.`,
    "Roles and relations": `Defines or constrains ${lower}; the resulting identity is shared by constructors, LongTextJS, store indexes, and circuits.`,
    "Knowledge declarations": `Declares reusable ${lower} with explicit ontology ownership; it must not smuggle task-source claims into default knowledge.`,
    "Pack composition": `Describes ${lower} for dependency-checked ontology, circuit, signal, and load-tier composition.`,
    "Operation modes": `Intent operation fragment requesting ${lower}; planners and response circuits use it without inferring a hidden mode.`,
    "Text targets": `Intent target fragment marking the source/task as ${lower} for compatible circuit selection.`,
    "Domain selection": `Intent domain directive for ${lower}; require, prefer, allow, exclude, or source-signal inference remains explicit.`,
    "Concerns and outputs": `Declares the requested ${lower} concern or retained output capability.`,
    "Evidence and assurance": `Requires ${lower} evidence or auxiliary execution in addition to ordinary concrete semantics.`,
    "Fallback and profiles": `Controls profile loading or fallback through the ${lower} directive.`,
    "Source and grounding": `Represents ${lower} with decoded-text identity, stable offsets, and digest-verifiable provenance.`,
    "Claims and polarity": `Adds the ${lower} epistemic, deontic, modal, or polarity facet without collapsing unknown or conflict.`,
    "Context and interpretation": `Constructs ${lower} context or interpretation scope for claims and circuit compatibility.`,
    "Collections and alternatives": `Builds ${lower} while preserving whether order, multiplicity, alternatives, or set semantics matter.`,
    "Identity and relations": `Declares ${lower} as an evidence-bearing semantic relation rather than a string comparison.`,
    "Coverage and time": `Represents ${lower} with explicit scope or exact temporal semantics.`,
    "Query and conditions": `Builds the ${lower} query/condition node executed against indexed SemanticStore values and evidence.`,
    "Query algebra": `Adds ${lower} to the declarative query plan while retaining bindings and deterministic order.`,
    "Decisions and results": `Constructs ${lower} decision or typed result with stable status, evidence, and code semantics.`,
    "Stages and emissions": `Declares ${lower} execution or emission; emitted values remain typed Findings or CNL frames.`,
    "Composition and ports": `Declares ${lower} capability/port metadata used by dependency closure and circuit composition.`,
    Assurance: `Declares the ${lower} assurance method; it runs only when the circuit and request both support it.`,
    "Frames and builders": `Creates or represents the ${lower} typed CNL frame with named slots and provenance.`,
    "Slots and provenance": `Constructs the ${lower} slot/provenance value used by typed CNL frames.`,
    "Canonical grammar": `Performs ${lower} over canonical CNL for deterministic parsing, rendering, comparison, or round-trip checks.`,
    "Response directives": `Intent presentation directive controlling ${lower} without changing semantic finding truth.`,
    "Response circuits": `Executable ${lower} primitive for post-execution filtering, grouping, counting, evidence ranking, and layout.`
  };
  return descriptions[category] ?? `Public ${surface} constructor/helper for ${lower}.`;
}

const methodDescriptions = Object.freeze({
  seal: "Validate accumulated declarations and return the immutable semantic model.",
  commit: "Validate and commit the LongText document as one immutable materialization unit.",
  mode: "Add one or more task operation fragments.",
  target: "Add source/task target classifications.",
  domains: "Add required, preferred, allowed, excluded, or inferred domains.",
  concerns: "Add semantic capabilities that the planner must provide.",
  evidence: "Add provenance and interpretation requirements.",
  assurance: "Add concrete, abstract, or symbolic execution requirements.",
  outputs: "Add requested semantic and retained artifact outputs.",
  present: "Add response style, grouping, filtering, evidence, and tagging directives.",
  whenUnclear: "Set the explicit circuit-selection fallback.",
  provenance: "Attach task instruction or source provenance.",
  use: "Install a definition, stage, pack, or directive owned by the builder.",
  requires: "Declare semantic/capability inputs that must be available before execution.",
  provides: "Declare capabilities and guarantees produced by the circuit.",
  emit: "Declare typed Finding or CNL-frame emissions.",
  role: "Attach a role definition/use with declared cardinality.",
  subtypeOf: "Declare parent concept identities used by store subtype closure.",
  grounding: "Attach exact source evidence to a claim.",
  within: "Attach an explicit context/scope to a claim.",
  section: "Add an ordered, set, bag, or alternative semantic section.",
  run: "Attach the concrete implementation for a procedural stage.",
  abstract: "Attach the abstract summary used by abstract preflight.",
  symbolic: "Attach the symbolic adapter used by supported assurance."
});

function builderTables(namespace, escapeHtml) {
  const builders = Object.entries(namespace)
    .filter(([name, value]) => /Builder$/.test(name) && typeof value === "function")
    .sort(([left], [right]) => left.localeCompare(right));
  const sections = [];
  for (const [name, Builder] of builders) {
    const methods = Object.getOwnPropertyNames(Builder.prototype).filter((method) => method !== "constructor").sort();
    if (methods.length === 0) continue;
    const rows = methods.map((method) => {
      const value = Builder.prototype[method];
      const shape = `${method}(${parametersOf(value) || "…"})`;
      const description = methodDescriptions[method] ?? `Apply the ${method.replace(/([a-z])([A-Z])/g, "$1 $2").toLocaleLowerCase("en")} declaration and return the fluent builder or sealed value defined by this DSL.`;
      const result = method === "seal" || method === "commit" ? "immutable sealed semantic model" : "same fluent builder unless documented otherwise";
      return `<tr><td><code>${escapeHtml(shape)}</code></td><td>${escapeHtml(result)}</td><td>${escapeHtml(description)}</td></tr>`;
    }).join("");
    sections.push(`<h3>${escapeHtml(name)} methods</h3><div class="table-wrap"><table><thead><tr><th>Method and parameters</th><th>Return/chain result</th><th>Effect and invariant</th></tr></thead><tbody>${rows}</tbody></table></div>`);
  }
  return sections.join("");
}

export function dslReference(surface, escapeHtml) {
  const namespace = surfaces[surface];
  const rows = Object.entries(namespace).sort(([left], [right]) => left.localeCompare(right)).map(([name, value]) => {
    const category = categoryFor(surface, name);
    return `<tr><td><code>${escapeHtml(name)}</code></td><td>${escapeHtml(category)}</td><td><code>${escapeHtml(callShape(name, value))}</code></td><td>${escapeHtml(resultTypeFor(surface, name, value, category))}</td><td>${escapeHtml(descriptionFor(surface, name, category))}</td></tr>`;
  }).join("");
  return `${predefinedValueTable(surface, escapeHtml)}<h2>Complete live export inventory (${Object.keys(namespace).length})</h2>
<p>This table is generated from the imported local SDK namespace. A renamed or removed export therefore changes this page on the next documentation build.</p>
<div class="table-wrap"><table><thead><tr><th>Construction</th><th>Category</th><th>Call shape and parameters</th><th>Result type</th><th>Semantic effect</th></tr></thead><tbody>${rows}</tbody></table></div>
<h2>Fluent builder methods</h2>${builderTables(namespace, escapeHtml)}`;
}
