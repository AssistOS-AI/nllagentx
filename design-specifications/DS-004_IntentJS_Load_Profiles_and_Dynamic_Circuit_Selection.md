# DS-004 — IntentJS, Load Profiles and Dynamic Circuit Selection

**Status:** Normative intent and planning specification  
**Primary skill:** `nll-intent`  
**Depends on:** DS-000, DS-001, DS-002, DS-003  
**Related:** all predefined domain pack specifications

## 1. Purpose

This specification defines how nllAgent decides which ontology packs, circuits, semantic views and analysis methods are relevant to a current task. It introduces IntentJS as a first-class internal `.mjs` language and establishes the default behavior when intent is incomplete: execute every compatible check available in the resolved broad profile.

The problem is not simply classification. A document can simultaneously be a policy, a technical manual and an argumentative text. A task can request contradiction detection, controlled generation and legal-structure review at the same time. The planner must therefore construct a typed intent and a capability plan rather than select one label.

## 2. Two inputs determine analysis

Analysis depends on two semantic inputs:

1. **the source interpretation**, materialized by LongTextJS;
2. **the purpose of the current task**, materialized by IntentJS.

The same source may be checked differently under different purposes. A fictional dialogue should not be fact-checked as the narrator’s world truth unless the intent explicitly asks for internal world consistency. A legal clause may be checked for grammar, internal norm structure, or jurisdiction-specific compliance; those are different plans.

Intent is not merely a prompt string. It is an executable object with explicit fields, provenance and merge rules.

### 2.1 The task system instruction as a first-class input

Every task may contain a persistent natural-language system instruction in `task.mjs`. This is the task-level direction that says, for example, “review this as a legal policy,” “find every problem you can justify,” “produce a lower-secondary composition plan,” or “check chronology only.” It is separate from the source document and is never mixed into LongTextJS as though it were a claim made by the document.

The coding agent reads the instruction and creates IntentJS. IntentJS is the executable interpretation of that instruction: requested modes, domains, concerns, exclusions, output kinds, evidence policy, assurance and fallback. The original instruction remains attached as provenance. Ordinary execution uses the resolved IntentModel, not an unstructured model prompt. A changed system instruction therefore creates a new intent/plan identity but can reuse the same LongText snapshot when the source interpretation remains compatible.

If the system instruction is absent or too broad, source-driven signals and the agent profile add suggestions. If no clear narrowing survives the merge, the normative fallback is `all-compatible`.

## 3. Sources of intent

Intent fragments may come from:

- explicit CLI switches;
- a user/system instruction supplied to the task;
- the persistent agent’s default profile;
- a task-local profile overlay;
- cheap source signals extracted before full LongText materialization;
- semantic signals produced by an initial LongText pass;
- diagnostics or refinement demands from a previous run.

Each fragment records its source and priority. The final IntentJS program may be authored by Codex using `nll-intent`, but the merge and planning semantics are deterministic.

## 4. Precedence and merge policy

The default precedence is:

1. explicit exclusions and requirements from CLI;
2. explicit user/system task instruction;
3. task-local IntentJS declarations;
4. agent profile defaults;
5. inferred source signals;
6. global fallback policy.

Higher precedence may narrow or force a lower-precedence suggestion. Lower precedence may add compatible concerns unless explicitly excluded. A user request such as “only check chronology” suppresses unrelated checks. A request such as “check chronology, especially character knowledge” allows general baseline checks unless `--only` is specified.

Contradictory high-priority instructions produce `INTENT_CONFLICT` and require an explicit resolution or a coding-agent review. They are not arbitrarily ordered by occurrence.

## 5. Intent ontology

IntentJS must represent at least the following categories.

### 5.1 Task mode

- `analyze`
- `validate`
- `compare`
- `explain`
- `repair`
- `canonicalize`
- `generate`
- `plan`
- `summarizeSemantically`
- `askForClarification`
- combinations such as `analyzeAndPlan`

### 5.2 Target artifact

- long prose document;
- literary/narrative text;
- legal or regulatory text;
- internal policy or procedure;
- textbook/manual;
- scientific/technical report;
- argument or essay;
- CNL document;
- outline, specification or generation plan;
- pair or set of documents for comparison.

### 5.3 Domain hypotheses

Intent can require, prefer, allow or exclude domain packs. It can also request inference from source. Domain hypotheses are multi-valued and carry confidence/provenance; a document may activate several.

### 5.4 Concerns

Representative concerns include:

- contradiction;
- terminology;
- entity/reference continuity;
- timeline;
- causality;
- quantity/unit consistency;
- evidence and provenance;
- argument validity;
- normative structure;
- procedure order;
- social interaction;
- motivation/emotion consistency;
- scientific plausibility;
- common-sense plausibility;
- factual compatibility with loaded world knowledge;
- CNL generation, repair or planning.

### 5.5 Scope

Intent specifies document, section, source collection, chapter, claim set, event window, jurisdiction, narrative world or other scope. An unspecified scope defaults to the entire registered source set for the task.

### 5.6 Evidence policy

Intent can require:

- source-grounded evidence;
- pack facts allowed or disallowed;
- external verified facts required;
- open-world or closed-world treatment;
- interpretation-robust results only;
- conditional results allowed;
- approximate results allowed or forbidden.

### 5.7 Assurance

Intent declares requested guarantee classes:

- ordinary concrete execution;
- abstract preflight;
- symbolic decision coverage;
- local constraint proof;
- bounded counterexample search;
- CNL round-trip;
- refinement on ambiguity;
- approximate probabilistic ranking.

### 5.8 Output

- findings;
- CNL observations;
- structural trace;
- explanation slice;
- repair frames;
- composition/book/document plan;
- controlled specification;
- questions for clarification;
- selected execution plan and rationale.

### 5.9 Resource policy

Resource policy is explicit. It may set maximum time, nodes, symbolic paths or model calls. Absence of a user limit does not authorize the planner to silently drop checks. It uses project defaults and reports any deferred work.

## 6. Fluent IntentJS design

A representative task intent:

```js
import {
  intent, analyzeAndPlan, longDocument, inferDomainsFromSource,
  preferDomain, concern, findings, cnlObservations, compositionPlan,
  interpretationRobust, concreteExecution, abstractPreflight,
  symbolicWhereSupported, allCompatible
} from "../../../../framework/sdk/intent/intent.mjs";

export default intent("task-4x8p")
  .mode(analyzeAndPlan())
  .target(longDocument())
  .domains(
    inferDomainsFromSource(),
    preferDomain("literature"),
    preferDomain("psychology-basic")
  )
  .concerns(
    concern("contradiction"),
    concern("timeline"),
    concern("motivation"),
    concern("argument-structure")
  )
  .evidence(interpretationRobust())
  .assurance(
    concreteExecution(),
    abstractPreflight(),
    symbolicWhereSupported()
  )
  .outputs(findings(), cnlObservations(), compositionPlan())
  .whenUnclear(allCompatible())
  .seal();
```

This is an executable builder module. The result is an immutable IntentModel with canonical handles, not a plain JSON object.

## 7. Source-driven intent discovery

### 7.1 Two-pass discovery

To avoid loading every heavy circuit before knowing the document, intent discovery uses two passes.

**Pass A: cheap structural and lexical signals**

- source format and metadata;
- headings and section titles;
- recurring lexical fields;
- presence of normative modals, equations, citations, dialogue, narrative tense or procedure numbering;
- document length and structure;
- agent profile hints.

This pass uses small scanners and pack descriptors. It does not assert semantic truth.

**Pass B: semantic signals from an initial LongText core pass**

The core ontology materializes generic claims, events, modality, quantities, source roles, definitions and discourse structure. Domain classifiers query these terms to produce stronger signals such as `ContainsNormativeRules`, `ContainsChemicalFormula`, `ContainsNarrativeCharacters` or `ContainsStatisticalClaims`.

The planner can then load or activate domain packs. If a newly loaded pack requires additional materialization, `RefinementDemand` asks the coding agent or existing materializer to extend LongTextJS.

### 7.2 Signal descriptors

Every predefined pack declares cheap and semantic signals:

```js
export default domainPack("physics-basic")
  .recognize(
    lexicalSignals("force", "mass", "velocity", "energy"),
    semanticSignals(QuantityClaim, MotionEvent, PhysicalInteraction)
  )
  .provide(capability("PhysicsCheck"))
  .seal();
```

Signals influence selection but do not by themselves produce findings.

### 7.3 Ambiguous domains

When several domains are plausible, the planner loads all non-conflicting packs that can contribute. It does not force one dominant class. A text about social consequences of biological research may load biology, sociology, logic and argument-error packs.

## 8. Pack descriptors and load profiles

### 8.1 Pack descriptor

A pack descriptor declares:

- pack identity and version;
- domain concepts;
- cheap and semantic recognition signals;
- ontology modules;
- circuit capabilities;
- CNL frame and lexicon support;
- required base packs;
- incompatibilities or alternative models;
- default load tier;
- expected cost and assurance classes;
- target age/knowledge tier;
- test suite.

### 8.2 Load tiers

- **Core:** always loaded for semantic integrity, e.g. language core, source/provenance, elementary logic.
- **Baseline:** loaded by broad default profiles, e.g. commonsense, world-basic, reasoning-errors.
- **Domain:** loaded when selected by profile or intent.
- **Specialized:** agent-specific or task-specific expert packs.

### 8.3 Predefined profiles

The framework includes at least:

#### `minimal-core`

Core language, provenance, elementary logic and contradiction circuits. Intended for debugging or narrowly controlled agents.

#### `general-broad`

Commonsense, basic world knowledge, elementary logic, reasoning errors, social interaction and lightweight mathematics. This is the default for an unspecified general agent.

#### `general-school`

All basic packs at the 12–14-year baseline: common sense, world, mathematics, physics, chemistry, biology, psychology/emotion, anthropology, sociology, logic, reasoning errors, law-basic and social interaction.

#### `literary-analysis`

Commonsense, world, psychology/emotion, social interaction, anthropology, sociology, logic, contradiction/fallacy and narrative circuits.

#### `legal-policy`

Commonsense, logic, reasoning errors, law-basic, social interaction, mathematics/quantities, temporal/procedural circuits and CNL normative frames.

#### `scientific-textbook`

Commonsense, world, mathematics, physics, chemistry, biology, logic, reasoning errors, evidence/provenance and educational-structure circuits.

#### `social-analysis`

Commonsense, psychology, anthropology, sociology, social interaction, logic and reasoning-error packs.

#### `all-compatible`

Loads all framework packs and all agent packs that do not declare hard incompatibility. Executes every circuit whose requirements can be met. This is the fallback selection policy when intent remains unclear.

### 8.4 Profile code

Profiles are fluent `.mjs` modules:

```js
export default loadProfile("literary-analysis")
  .use(coreLanguage)
  .use(coreCommonsense)
  .use(worldBasic)
  .use(psychologyBasic)
  .use(socialInteraction)
  .use(logicBasic)
  .use(reasoningErrors)
  .prefer(concreteFirst())
  .assure(abstractPreflightForSelectedCircuits())
  .fallback(allCompatibleWithinLoadedPacks())
  .seal();
```

## 9. Circuit and method descriptors for selection

A circuit descriptor includes:

- semantic concern;
- target artifact types;
- domains and concepts;
- required capabilities and coverage;
- outputs;
- supported methods;
- guarantee class;
- cost class;
- profile tags;
- exclusions;
- tests and maturity status.

A method provider descriptor includes view kind, applicable domain shape, guarantee and cost. Intent never directly chooses an implementation class when a guarantee/capability is sufficient.

## 10. Deterministic planning algorithm

### 10.1 Inputs

- resolved IntentModel;
- agent and task profile stack;
- pack registry;
- circuit registry;
- method registry;
- initial LongText capability signature;
- project resource policy.

### 10.2 Phase 1: hard filtering

Remove candidates that fail:

- explicit intent exclusion;
- target text/artifact compatibility;
- ontology compatibility;
- evidence or coverage policy;
- required output kind;
- forbidden approximate guarantee;
- unresolved pack incompatibility;
- impossible language/CNL support.

Hard filtering occurs before ranking.

### 10.3 Phase 2: load-pack closure

Starting from explicitly required and inferred domains, add required base packs. If the intent is unclear, apply the profile fallback. For `all-compatible`, load every non-conflicting pack in the resolved registry.

### 10.4 Phase 3: capability closure

Starting from requested outputs and concerns, perform the AND/OR capability search described in DS-003. Include required materializers, normalization circuits, analysis circuits, assurance passes and renderers.

### 10.5 Phase 4: method selection

For each circuit subproblem, select methods using semantic shape:

| Problem shape | Default method |
|---|---|
| finite typed match/join | query/dataflow |
| finite conditions and exceptions | decision table |
| recursive reachability or propagation | relation fixed point |
| quantities, deadlines, equality | ConstraintKernel |
| event protocols and trace properties | monitor/model-checking view |
| branch coverage and micro-cases | symbolic/concolic |
| global must/may preflight | abstract interpretation |
| normalization/equivalence | directed rewrite or EGraphLite |
| repeated stable Boolean rules | decision DAG/knowledge compilation |
| explanation relevance | dependency slicing |
| ambiguity requiring local refinement | semantic CEGAR |
| minimal repair | bounded weighted constraint/synthesis |
| irregular algorithm | procedural stage with explicit contract |

The planner may combine methods. No circuit is forced into a single method class.

### 10.6 Phase 5: stable ranking

Remaining alternative plans are ranked lexicographically by:

1. hard guarantee compatibility;
2. required coverage satisfaction;
3. output completeness;
4. interpretation robustness;
5. determinism/replayability;
6. reuse of specialized or cached providers;
7. estimated cost;
8. stable provider identity.

A cheaper plan cannot outrank one that fails a required guarantee.

### 10.7 Phase 6: plan explanation

Write `results/execution-plan.md` and a replayable `intent/plan.mjs`. The explanation lists selected/rejected packs, circuits, methods, outputs and fallback choices.

## 11. Default behavior when intent is unclear

The fallback algorithm is normative:

1. attempt to infer source domains and text type;
2. preserve every domain hypothesis above a low relevance threshold;
3. load the agent’s default broad profile;
4. if no hypothesis is decisive, switch to `all-compatible`;
5. run every circuit whose requirements are satisfiable;
6. report checks that are incompatible, blocked or deferred;
7. never interpret missing intent as permission to run only a minimal stylistic subset.

To keep the process finite, the registry itself is finite and every circuit must declare applicability. The planner should not repeatedly invoke coding agents or external models during ordinary execution. User-supplied budgets can limit execution, but the result lists every skipped compatible circuit and why.

## 12. Intent refinement

Generic retries are replaced with typed refinement.

- `DomainRefinementDemand`: inspect source units for a candidate domain.
- `OntologyRefinementDemand`: add a concept or role necessary for selected checks.
- `LongTextRefinementDemand`: materialize missing claims, identities or coverage.
- `MethodRefinementDemand`: add a summary, symbolic adapter or stronger engine.
- `ScopeRefinementDemand`: resolve which section/world the task targets.
- `EvidenceRefinementDemand`: obtain a source or classify authority.

A refinement may be handled by existing circuits. If code must change, nllAgent starts a coding run with the appropriate skill and the demand as context.

## 13. CLI controls

Representative controls:

```text
--profile <id>
--domain <id>                  repeatable
--exclude-domain <id>
--check <capability-or-concern> repeatable
--exclude-check <id>
--only                         make explicit selections exclusive
--all-compatible
--output <kind>
--assurance <class>
--allow-approximate
--require-robust
--max-time <duration>
--explain-plan
```

CLI selections become high-priority IntentJS fragments. The task’s canonical `intent.mjs` remains readable and may record the resolved selections for replay.

## 14. Intent skill workflow

`nll-intent` must:

1. read DS-004 and the agent’s resolved profile;
2. inspect the task instruction, source outline and cheap signals;
3. read pack and circuit catalogs rather than framework internals;
4. create or update `intent/intent.mjs` and tests;
5. preserve explicit user requirements and exclusions;
6. declare fallback behavior;
7. run `intent check`, `profile resolve` and `plan show`;
8. create semantic signals only when supported by source evidence;
9. request ontology or LongText refinement instead of inventing unavailable capabilities;
10. leave a concise explanation of selected and rejected domains.

## 15. Tests and acceptance

Intent planning tests must cover:

- explicit CLI-only selection;
- system instruction plus inferred domains;
- multi-domain document;
- conflict between explicit requirements;
- unclear source triggering `all-compatible`;
- hard exclusion;
- missing ontology capability;
- approximate method forbidden;
- broad generation request selecting CNL plan circuits;
- stable plan identity across repeated execution;
- plan change after one intent signal changes;
- explanation of every selected and rejected pack.

The implementation is complete when the same source can be analyzed under two different IntentJS modules with different, explainable circuit plans while preserving one common LongText snapshot where semantically appropriate.
