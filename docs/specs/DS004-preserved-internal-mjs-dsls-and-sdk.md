---
id: DS004
title: Preserved Internal `.mjs` DSLs and the Reusable Semantic SDK
status: normative-implemented
owner: nllAgent architecture
summary: Preserves DS-002_Internal_MJS_DSLs_and_SDK.md verbatim and records additive implementation alignment.
---

# DS004 — Preserved Internal `.mjs` DSLs and the Reusable Semantic SDK

## Introduction

This official specification preserves the complete original design contract. No wording from the source specification has been removed, shortened, or rewritten.

## Core Content

The following source specification is included verbatim from `design-specifications/DS-002_Internal_MJS_DSLs_and_SDK.md`.

<!-- ORIGINAL SPECIFICATION START: DS-002_Internal_MJS_DSLs_and_SDK.md -->
# DS-002 — Internal `.mjs` DSLs and the Reusable Semantic SDK

**Status:** Normative language and SDK specification  
**Primary skills:** `nll-sdk`, `nll-ontology`, `nll-longtext`  
**Depends on:** DS-000, DS-001  
**Related:** DS-003, DS-004, DS-007–DS-019

## 1. Purpose

This specification defines the internal JavaScript language family used by nllAgent and the reusable SDK that makes those languages practical for coding agents. The goal is to provide real fluent code, not configuration objects that merely resemble an API while hiding an untyped JSON schema.

The family contains four authoring roles:

- **OntologyJS** defines semantic concepts and constructors;
- **LongTextJS** creates grounded instances and claims for a particular source;
- **CircuitJS** defines analyses, derivations, decisions and controlled generation;
- **IntentJS** defines the purpose and scope of a task and controls pack/circuit selection.

All are ordinary ESM modules with `.mjs` extensions. They share semantic handles, canonical identities, collections, provenance and value types. They differ in what they are allowed to assert and what their execution produces.

## 2. Theoretical model: a many-sorted term algebra

The common foundation is a many-sorted algebra of terms. A *sort* is a broad semantic category such as `Entity`, `Event`, `State`, `Claim`, `Time`, `Quantity`, `Place`, `Proposition`, `Evidence`, `Scope`, `Intent` or `Finding`. An ontology extends the signature with domain concepts and frame constructors.

A term such as:

```js
Open(
  agent(Ana),
  theme(NorthGate),
  during(ClockTime("09:00"))
)
```

is not represented publicly as a record with arbitrary keys. `Open`, `agent`, `theme`, `during` and `ClockTime` are constructor functions generated or exported by the resolved ontology stack. Their calls create opaque semantic handles with validated sort, role, ontology identity and provenance.

The same signature supports different uses:

- OntologyJS defines `Open` and its allowed roles;
- LongTextJS constructs a ground `Open` event;
- CircuitJS constructs a pattern `Open(agent(variable(Person)), ...)` or a derived event;
- IntentJS refers to capabilities such as `check(EventContinuity)` rather than constructing a source event.

The runtime may interpret terms into a graph, relation set, indexes, canonical text or solver atoms. The authoring code remains stable because it depends on semantic constructors rather than storage fields.

## 3. Public SDK module layout

```text
framework/sdk/
  core/
    handles.mjs
    identity.mjs
    values.mjs
    collections.mjs
    logic.mjs
    provenance.mjs
    diagnostics.mjs
  ontology/
    ontology.mjs
    sorts.mjs
    concepts.mjs
    frames.mjs
    roles.mjs
    relations.mjs
    facts.mjs
    laws.mjs
    lexicon.mjs
    packs.mjs
  longtext/
    source.mjs
    document.mjs
    terms.mjs
    claims.mjs
    contexts.mjs
    alternatives.mjs
    identity.mjs
    time.mjs
    coverage.mjs
    commit.mjs
  circuit/
    circuit.mjs
    contracts.mjs
    query.mjs
    dataflow.mjs
    decisions.mjs
    composition.mjs
    emit.mjs
    cnl.mjs
    assurance.mjs
    procedural.mjs
  intent/
    intent.mjs
    domains.mjs
    concerns.mjs
    profiles.mjs
    outputs.mjs
    assurance.mjs
    policies.mjs
  cnl/
    frames.mjs
    grammar.mjs
    lexicon.mjs
    compare.mjs
  analysis/
    abstract.mjs
    symbolic.mjs
    constraints.mjs
    relations.mjs
    transition.mjs
    rewrite.mjs
    slice.mjs
  agent/
    agent.mjs
    task.mjs
    run.mjs
```

Every public export must have a descriptor from which `nllAgent catalog sdk` can generate documentation. The descriptor is constructed in `.mjs`, not stored as JSON.

## 4. Semantic handles and values

### 4.1 Opaque handles

A constructor returns an opaque handle recognized by the runtime. The handle exposes only stable read methods such as identity, sort and descriptor access. Domain code must not depend on private object fields.

The framework may implement handles with classes, private fields and symbols. Equality is semantic identity, not reference identity. Two independently constructed canonical quantities representing five metres may intern to the same value; two mentions with identical text at different spans remain distinct.

### 4.2 Identity classes

The SDK distinguishes:

- declared ontology identity;
- source mention identity;
- hypothesized entity identity;
- ground event/state identity;
- claim identity;
- circuit node and instance identity;
- interpretation-context identity;
- CNLFrame identity.

Canonicalization rules are specified in DS-003. SDK authors must not use user-facing labels as the sole identity of semantic values.

### 4.3 Semantic collections

Ordinary JavaScript arrays may be used internally and procedurally, but public semantic APIs use explicit collection constructors:

- `sequence(...)`: ordered semantic sequence;
- `setOf(...)`: semantically deduplicated finite set;
- `bagOf(...)`: multiplicity-preserving collection;
- `allOf(...)`: logical conjunction;
- `anyOf(...)`: logical disjunction;
- `alternatives(...)`: mutually incompatible interpretation branches;
- `orderedBy(...)`: relation-backed partial or total order;
- `coverageSet(...)`: collection with declared completeness scope.

This distinction prevents a coding agent from confusing document order, logical conjunction and a set of candidates.

### 4.4 Four-valued predicates

Predicates operate over `TRUE`, `FALSE`, `UNKNOWN` and `CONFLICT`. The SDK provides `and`, `or`, `not`, `implies`, `equivalent`, `bothTrue`, `possiblyTrue` and explicit aggregation policies. Domain circuits may not silently coerce `UNKNOWN` to false.

## 5. OntologyJS

### 5.1 Role

OntologyJS is an executable semantic signature and knowledge-pack language. It creates schema objects, constructor functions, relation definitions, lexicalizations, pack facts, semantic laws and circuit-relevant capabilities.

It must support modular composition. Core linguistic semantics, general commonsense, scientific concepts and legal frames live in separate packs. Agent-level and task-level modules extend the resolved stack.

### 5.2 Fluent authoring surface

A representative ontology module is:

```js
import {
  ontology, entityKind, eventKind, stateKind, valueKind,
  role, relation, requires, allows, exactlyOne, atMostOne,
  subtypeOf, disjointWith, lexicalize, capability, fact, law
} from "../../../framework/sdk/ontology/ontology.mjs";

const O = ontology("core.events", "1.0.0")
  .entity(entityKind("Agent"))
  .entity(entityKind("PhysicalObject"))
  .entity(entityKind("Place"))
  .value(valueKind("TimeValue"));

export const actor = O.role(role("actor").range("Agent"));
export const theme = O.role(role("theme").range("PhysicalObject"));
export const location = O.role(role("location").range("Place"));
export const time = O.role(role("time").range("TimeValue"));

export const Move = O.event(
  eventKind("Move")
    .role(requires(actor, exactlyOne()))
    .role(requires(theme, exactlyOne()))
    .role(allows(location, atMostOne()))
    .role(allows(time, atMostOne()))
    .provide(capability("SpatialTransition"))
);

O.lexicon(
  lexicalize(Move).english("move", "moves", "moved")
);

O.law(
  law("move-changes-location")
    .when(Move)
    .states("The destination of a completed move is the post-event location of its theme")
);

export default O.seal();
```

The example is real code. Builder methods create ontology objects immediately and register them in the module-local ontology builder. `seal()` validates identity uniqueness, role ranges, ancestry, lexicalization references and laws, then returns an immutable ontology module.

### 5.3 Schema constructs

The SDK must provide constructors for:

- entity, event, state, quality, value, proposition and document-artifact kinds;
- roles with domain, range, cardinality, inheritance and inverse metadata;
- binary and n-ary relations;
- subtype, equivalence, disjointness, part/whole and compatibility relations;
- frames with required, optional, repeatable and mutually exclusive roles;
- lexicalizations by language and grammatical function;
- stable pack facts with source/provenance notes;
- laws that can expose concrete, abstract or symbolic semantics;
- capability descriptors used by the planner;
- CNL lexicalization and frame bindings.

### 5.4 Generated constructors

`nllAgent ontology build` loads the resolved ontology stack and writes constructor facades as `.mjs`. A facade exports functions such as `Person`, `Move`, `actor` and `time` bound to canonical ontology identities. The generated file is readable and can be regenerated; it is not the semantic authority. Ontology modules remain authoritative.

Constructor behavior depends on use context. In LongTextJS, `Person(...)` produces a ground or hypothesized instance. In CircuitJS, the same imported constructor can accept pattern variables and produce a pattern term. The facade delegates to the active semantic context rather than returning plain records.

### 5.5 Pack facts

Facts such as basic unit conversions, taxonomic relations or stable world knowledge may be declared in ontology packs. Every fact includes source class and scope metadata. A pack fact is not presented as a claim extracted from the current document. Circuits can require `PackFact`, `SourceClaim` or `VerifiedExternalFact` separately.

### 5.6 Ontology behavior

An ontology may register reusable behavior when that behavior is intrinsic to the concept, for example quantity normalization, subtype closure or temporal inverse relations. Domain policy belongs in CircuitJS, not in ontology constructors. The boundary rule is:

> OntologyJS defines what a concept is and what relations are semantically intrinsic; CircuitJS defines what the application concludes or requires from instances of those concepts.

## 6. LongTextJS

### 6.1 Role

LongTextJS is the executable materialization of the current source. It does not store a generic tree of arbitrary fields. It calls ontology constructors to create terms, then wraps those terms in claims, contexts, interpretations and source-grounding structures.

### 6.2 SourceRegistry and anchors

The source SDK exposes a registered source rather than raw path access:

```js
const source = taskSource("source-001");
const sentence = source.spanByText(
  "The operator may retain customer records for ten years for audit."
);
```

Production LongText code should normally use stable source-unit and offset anchors generated by source tools. Text matching is acceptable during authoring tests but `source verify-anchors` must resolve and freeze exact ranges before ordinary execution.

A `SourceSpan` records source ID, source digest, unit ID, offsets, selected text hash and optional page/line metadata. If a source changes, the anchor fails or is explicitly realigned; it never silently points to different text.

### 6.3 Ground terms and claims

A representative module:

```js
import {
  describe, sourceUnit, section, claim, groundedAt, statedBy,
  asserted, permitted, confidence, coverage, sequence
} from "../../../../framework/sdk/longtext/document.mjs";
import {
  Organization, CustomerRecord, Retain, operator, theme,
  purpose, duration, Years, Audit
} from "../sdk.mjs";

const unit = sourceUnit("policy-section-3");
const operatorEntity = Organization(named("the operator"));
const records = CustomerRecord(named("customer records"));

const retention = Retain(
  operator(operatorEntity),
  theme(records),
  duration(Years(10)),
  purpose(Audit())
);

const retentionClaim = claim(retention)
  .modality(permitted())
  .polarity(asserted())
  .grounding(groundedAt(unit.span(14, 83)))
  .confidence(confidence(0.97));

export default describe("policy-section-3")
  .section(section("retention", sequence(retentionClaim)))
  .coverage(coverage("Retain").forScope("retention").complete())
  .commit();
```

The coding agent decides how to split the source and which concepts to instantiate. The SDK validates semantic compatibility and grounding. It does not infer that `CustomerRecord` is personal data unless the ontology or an explicit derived claim supplies that relation.

### 6.4 Claims, voices and worlds

LongTextJS must distinguish:

- a proposition;
- a source claim asserting, denying or questioning it;
- a narrator or speaker to whom the claim is attributed;
- an interpretation world in which the claim is resolved;
- a system assumption or pack fact.

This is necessary for fiction, reported speech, quotations and disputed claims. `Alice says the key is missing` does not automatically place `Missing(key)` in the world of accepted source facts.

### 6.5 Context and scope

Contexts represent sections, definitions, conditions, exceptions, hypothetical cases, quotations, narrative viewpoints and procedural phases. Scope is not just a location in the document; it determines where a term, definition, negation or rule applies.

The SDK provides:

- `within(context, ...)`;
- `condition(...)`;
- `exception(...)`;
- `hypothetical(...)`;
- `reportedBy(...)`;
- `definedIn(...)`;
- `appliesTo(...)`;
- `scopeClosed(...)`;
- `scopeOpen(...)`.

### 6.6 Alternatives

A coding agent may preserve multiple interpretations:

```js
const pronounResolution = alternatives(
  interpretation("controller-reading")
    .assume(refersTo(pronoun, controller))
    .include(claimA),
  interpretation("processor-reading")
    .assume(refersTo(pronoun, processor))
    .include(claimB)
);
```

Alternatives share canonical terms where possible. They are not copied whole-document stores. The runtime attaches interpretation conditions to terms and indexes.

### 6.7 Identity

Mentions and entities are distinct. LongTextJS may assert `sameEntity`, `possibleSameEntity` or `differentEntity`. Identity hypotheses carry evidence and context. Circuits can require must-alias or accept may-alias depending on purpose.

### 6.8 Time and source order

The SDK represents textual order separately from event time. It supports points, intervals, relative durations, deadlines, recurrence and Allen-style interval relations. A sentence appearing first does not imply its event happened first.

### 6.9 Coverage

Coverage is a first-class object. Examples:

- all definitions in section 2 were materialized;
- retention events are covered for the entire document;
- exceptions were inspected only in one subsection;
- identity resolution is partial;
- external legal sources were not loaded.

Queries such as `none`, `all` and `notExists` must require compatible coverage.

### 6.10 Multi-file composition

A root LongText module imports source-unit modules and commits them in deterministic order. Unit modules may define local mentions and export semantic handles. A task-level identity module reconciles cross-unit entities. The root transaction validates unresolved references, duplicate declared IDs and coverage declarations.

## 7. CircuitJS

### 7.1 Role

CircuitJS is the operational language for queries, derivations, decisions, explanations and CNL generation. It is a semantic extension of the same ontology algebra: LongTextJS supplies ground terms; CircuitJS supplies variables, patterns, dataflow, constraints, recursion, statuses and emission.

### 7.2 Circuit contract

A circuit declares:

- stable identity and version;
- semantic concern and supported text/domain types;
- required capabilities, ontology concepts, evidence and coverage;
- provided capabilities and guarantees;
- accepted interpretation policy;
- possible statuses;
- concrete execution stages;
- optional abstract, symbolic, proof or synthesis adapters;
- tests and benchmark identity.

A fluent contract:

```js
export default circuit("policy.retention-assessment", "1.0.0")
  .concern(compliance())
  .requires(
    capability("RetentionClaim"),
    capability("NormalizedDuration"),
    concept("PersonalData"),
    coverageRequirement("LegalException", closedForRelevantScope())
  )
  .provides(
    capability("RetentionFinding"),
    guarantee("evidence-bearing"),
    guarantee("interpretation-aware")
  )
  .use(selectCandidates)
  .use(normalizeDuration)
  .use(resolveException)
  .use(decideRetention)
  .use(buildRepairFrame)
  .assurance(abstractPreflight(), symbolicDecisionCoverage())
  .seal();
```

### 7.3 Query algebra

The query SDK operates on semantic patterns, not physical relation names:

- `match(pattern)`;
- `where(predicate)`;
- `bind(variable, expression)`;
- `join(query, on(...))`;
- `withinScope(scopePattern)`;
- `inWorld(worldPattern)`;
- `groundedBy(evidencePattern)`;
- `before`, `after`, `overlaps`, `during`;
- `sameEntity`, `mayAlias`, `differentEntity`;
- `exists`, `notExists`, `all`, `none`, `count`;
- `groupBy`, `aggregate`, `min`, `max`, `sum`;
- `path`, `reachable`, `closure`;
- `select`, `project`, `orderBy`.

A pattern is constructed with ontology functions:

```js
const person = variable(Person);
const object = variable(PhysicalObject);

const uses = match(
  Use(actor(person), theme(object))
).where(groundedBy(anySourceSpan()));
```

The runtime compiles this to index operations. Circuit code never names a backing `observations` array.

### 7.4 Dataflow and stages

A circuit can be written as fluent stages. Each stage consumes typed handles and produces one or more outputs. Declarative stages become inspectable dataflow nodes. Procedural stages are ordinary JS functions registered with explicit semantic boundaries.

```js
const candidates = select("candidates", () => match(retentionPattern));
const normalized = mapEach("normalize", candidates, normalizeRetention);
const decisions = mapEach("decide", normalized, assessRetention);
const findings = emitEach("emit", decisions, retentionFinding);
```

A procedural stage may contain loops, recursion or asynchronous calls:

```js
const normalized = proceduralStage("normalize-complex-schedule")
  .reads(TemporalExpression)
  .writes(NormalizedSchedule)
  .run(async context => {
    // ordinary JavaScript using context.query(), context.emit(), and context.trace()
  });
```

The stage must declare what it reads and writes. If abstract or symbolic analysis is desired, it supplies a summary or adapter. Lack of such an adapter does not prohibit concrete execution; it lowers auxiliary-analysis precision.

### 7.5 Decision tables

Decision tables use multi-valued conditions and explicit row overlap policy. They are useful for normative and procedural rules. The SDK checks unreachable rows, overlapping incompatible rows and missing combinations when the declared table is intended to be exhaustive.

### 7.6 Composition

Circuits compose through:

- direct subcircuit inclusion;
- typed port connection;
- `requires/provides` capability planning;
- per-match instantiation;
- assurance circuits applied to another circuit;
- refinement circuits activated by unknown or possible findings;
- generation circuits consuming findings and producing CNLFrames.

A circuit has one primary semantic responsibility but may combine many analysis methods.

### 7.7 Emission

Outputs include `DerivedFact`, `Assessment`, `Finding`, `ExplanationFrame`, `RefinementDemand`, `ClarificationRequest`, `CNLFrame`, `GenerationPlan` and `TraceProjection`. An emission must include provenance and interpretation context.

## 8. IntentJS

IntentJS is defined in detail by DS-004. The shared SDK requirements are:

- fluent constructors for task modes, targets, concerns, domains, profiles, outputs, evidence policies, assurance and exclusions;
- mergeable intent fragments with explicit precedence;
- domain and circuit selection handles, not stringly typed filters;
- a fallback policy of `allCompatible()`;
- plan explanation and provenance for inferred intent;
- capability requirements compatible with CircuitJS contracts.

Example:

```js
export default intent("task-7k3m")
  .mode(analyzeAndPlan())
  .target(longDocument())
  .domains(inferFromSource(), prefer("literature"), allow("psychology"))
  .concerns(continuity(), contradiction(), motivation(), argumentStructure())
  .outputs(findings(), cnlObservations(), compositionPlan())
  .whenUnclear(allCompatible())
  .seal();
```

## 9. CNLFrame SDK

The framework supplies frame families for:

- assertion, definition and classification;
- obligation, prohibition, permission, recommendation and right;
- condition, exception, deadline and recurrence;
- causal relation and explanation;
- claim, evidence, objection and response;
- narrative event, scene goal, conflict and outcome;
- procedure step and authorization;
- document section, prerequisite, learning goal and example;
- finding, repair and clarification;
- generation plan and expansion instruction.

A frame preserves semantic slots. Renderers may choose a concise canonical vocabulary. An LLM can later stylize the CNL output, but any claimed preservation of meaning must be checked against the frame or a reparsed CNL structure.

## 10. SDK primitive design rules

1. Prefer ontology-generated constructors to generic `node(type, fields)` calls.
2. Prefer fluent builders when a concept has optional or repeated semantic roles.
3. Return opaque semantic handles, not mutable public objects.
4. Require explicit semantic collection constructors at public boundaries.
5. Attach provenance at construction or transaction commit.
6. Separate source claim, derived fact and pack fact.
7. Keep physical index details out of public APIs.
8. Make every primitive discoverable through descriptors and examples.
9. Support concrete execution first; add abstract/symbolic adapters where they materially help.
10. Reject silent ontology casts, ambiguous role names and ungrounded source assertions.
11. Permit ordinary JavaScript helpers, but require semantic effects to pass through SDK boundaries.
12. Never introduce JSON or TypeScript as an alternative contract.

## 11. Required generated catalogs

`catalog sdk` and `catalog ontology` produce Markdown documents describing:

- export path;
- signature and semantic sorts;
- concrete behavior;
- provenance behavior;
- optional abstract/symbolic behavior;
- determinism and monotonicity notes;
- examples;
- tests;
- related circuit kits;
- diagnostic codes.

Coding agents use these catalogs instead of reading the entire framework implementation.

## 12. Validation and diagnostics

### 12.1 Ontology diagnostics

- duplicate semantic identity;
- invalid subtype cycle;
- role range mismatch;
- missing required lexicalization when a pack claims CNL support;
- contradictory disjoint/equivalent declarations;
- law referencing an undeclared concept;
- constructor facade out of date.

### 12.2 LongText diagnostics

- invalid or stale source span;
- ground term violates frame cardinality;
- unresolved constructor or lexicalization;
- claim lacks voice/grounding where required;
- incompatible interpretation contexts merged;
- coverage claim unsupported by processed source units;
- temporal relation inconsistency;
- duplicate explicit identity.

### 12.3 Circuit diagnostics

- unmet declared capability;
- query pattern incompatible with ontology;
- absence query without coverage;
- unreachable or overlapping decision row;
- emission without evidence;
- procedural stage with undeclared semantic output;
- recursive relation without termination/fixed-point contract;
- abstract or symbolic adapter inconsistent with concrete tests;
- CNLFrame missing mandatory slot.

## 13. Directory and file conventions

Framework DSL sources:

```text
framework/sdk/**.mjs
framework/packs/<pack>/ontologies/**.ontology.mjs
framework/packs/<pack>/circuits/**.circuit.mjs
```

Agent sources:

```text
agents/<agent>/ontologies/**.ontology.mjs
agents/<agent>/circuits/**.circuit.mjs
agents/<agent>/profiles/**.profile.mjs
```

Task sources:

```text
agents/<agent>/tasks/<task>/intent/intent.mjs
agents/<agent>/tasks/<task>/longtext/root.longtext.mjs
agents/<agent>/tasks/<task>/longtext/units/*.longtext.mjs
agents/<agent>/tasks/<task>/ontologies/*.ontology.mjs
agents/<agent>/tasks/<task>/circuits/*.circuit.mjs
```

Test files use `.test.mjs` and Node’s built-in test runner.

## 14. Acceptance criteria

The DSL/SDK implementation is acceptable when a coding agent can, from catalogs and relevant DS files alone:

- create a new ontology with generated constructors;
- materialize a multi-file source with exact anchors, alternatives and coverage;
- write a composed circuit using pattern queries and a procedural stage;
- write an IntentJS module selecting a profile and outputs;
- generate a CNLFrame and render it;
- run checks that detect type, scope, coverage and provenance errors;
- execute all modules as ordinary `.mjs` without JSON schemas, TypeScript or external dependencies.
<!-- ORIGINAL SPECIFICATION END: DS-002_Internal_MJS_DSLs_and_SDK.md -->

### Additive implementation alignment

The SDK is decomposed by DSL under framework/sdk. Builders seal immutable OntologyJS, LongTextJS, IntentJS, CircuitJS, CNL, agent, skill, run, and evaluation models; the root SDK also exports DSL namespaces to disambiguate intentionally repeated fluent names.

## Decisions & Questions

### Question #1: Why is the original specification embedded instead of replaced by a normalized rewrite?

Response: Source fidelity is an explicit project requirement. The embedded body remains byte-for-byte identical to the original file; official metadata, implementation alignment, and decision records are additive.

### Question #2: Which text wins if an additive note appears narrower than the preserved contract?

Response: The preserved normative requirement remains authoritative. An implementation-alignment note reports confirmed current behavior and cannot silently weaken the original contract.



## Conclusion

Future changes must preserve the embedded source contract, extend implementation and tests to meet it, and record contract-shaping rationale in numbered entries here.
