---
id: DS002
title: Preserved nllAgent System Architecture and Verification/Generation Catalog
status: normative-implemented
owner: nllAgent architecture
summary: Preserves DS-000_System_Architecture_and_Check_Catalog.md verbatim and records additive implementation alignment.
---

# DS002 — Preserved nllAgent System Architecture and Verification/Generation Catalog

## Introduction

This official specification preserves the complete original design contract. No wording from the source specification has been removed, shortened, or rewritten.

## Core Content

The following source specification is included verbatim from `design-specifications/DS-000_System_Architecture_and_Check_Catalog.md`.

<!-- ORIGINAL SPECIFICATION START: DS-000_System_Architecture_and_Check_Catalog.md -->
# DS-000 — nllAgent System Architecture and Verification/Generation Catalog

**Status:** Normative design specification for the experimental nllAgent implementation  
**Audience:** framework implementers, coding-agent authors, ontology authors, circuit authors, evaluators  
**Primary skill:** `nll-architect`  
**Depends on:** none  
**Referenced by:** every other design specification in this package

## 1. Purpose

This specification defines the common architectural contract for nllAgent. It also catalogs the principal classes of analysis and controlled generation that the system is expected to support. The remaining design specifications refine individual parts of this contract; none may silently replace the principles established here.

nllAgent is an experimental platform for turning natural-language material into explicit semantic programs and for applying reusable semantic circuits to those programs. It is not a prompt library, a generic chatbot wrapper, a universal theorem prover, or a complete formal semantics for ordinary language. Its purpose is narrower and more operational:

1. a coding agent translates task instructions, source documents and reusable rules into ordinary JavaScript ESM modules;
2. those modules use fluent SDK constructors to define ontologies, grounded document interpretations, task intent and circuits;
3. nllAgent executes the modules, builds a single logical semantic store, chooses compatible circuits and analysis methods, evaluates them, and produces evidence-bearing findings or Controlled Natural Language (CNL) structures;
4. ordinary re-execution does not require another model call once the semantic code exists;
5. uncertainty, conflict, missing coverage and ontological incompatibility remain explicit instead of being converted into optimistic answers.

The architecture is designed so that a coding agent such as Codex can implement complex checks with reusable primitives rather than repeatedly inventing ad hoc parsing, graph traversal and reasoning code.

## 2. Decisions that are authoritative across the package

The following decisions resolve earlier alternatives and are mandatory for the experimental implementation.

### 2.1 Real internal JavaScript DSLs

OntologyJS, LongTextJS, CircuitJS and IntentJS are genuine internal DSLs expressed as `.mjs` modules. They are not JSON documents hidden behind functions and they are not TypeScript declarations. Their authoring surface consists of constructor functions, fluent builders, semantic handles and reusable circuit or ontology modules.

The modules execute as ordinary JavaScript. Full JavaScript is permitted when it improves implementation clarity or performance: functions, classes, loops, recursion, exceptions, asynchronous operations and procedural stages are not artificially prohibited. The semantic SDK remains the authoritative boundary: semantic terms enter the system through SDK constructors and semantic changes are committed through explicit transactions or circuit outputs.

### 2.2 Deployment isolation is out of scope

Deployment may isolate the whole project in a container or another external boundary. The nllAgent SDK and runtime define no deployment-isolation subsystem and impose no restrictions on the JavaScript authoring model for that purpose.

### 2.3 Coding agents author semantic artifacts

Ontology modules, LongTextJS modules, IntentJS modules, CircuitJS modules and their tests are authored or modified only by coding agents. Codex is the first supported coding agent, but the invocation interface is adapter-based. nllAgent prepares file-based context, selects the required skills, starts the coding agent in direct-editing/YOLO mode, waits for it to finish, and may run deterministic tests or initiate a separate review run. nllAgent does not approve individual patches and does not override the coding agent’s implementation decisions.

### 2.4 One logical semantic model

The runtime exposes one logical `SemanticStore`. It may maintain several physical indexes and several provenance-preserving semantic views, but circuits must not depend on a particular storage layout. A graph index, relation index, temporal network, decision diagram or factor graph is a derived execution structure, not a competing semantic authority.

### 2.5 No JSON or TypeScript artifacts

No semantic contract, profile, manifest, task description, circuit, ontology, test oracle or canonical result is stored as JSON or TypeScript. Authoritative executable artifacts are `.mjs`; explanatory and report artifacts are Markdown, CNL text or plain text; caches may be disposable binary files produced with Node.js built-ins. The source modules must always be sufficient to rebuild runtime indexes.

### 2.6 Dependency-free framework

The framework implementation uses Node.js built-ins and project `.mjs` modules only. Domain agents may not silently add third-party runtime dependencies. If a needed algorithm is small enough to belong in the platform, it is implemented in the reusable SDK and accompanied by tests and documentation.

### 2.7 Default analysis is broad, not narrow

Intent-driven selection is used to avoid unnecessary work, but silence does not mean “run almost nothing.” When the CLI, system instruction, agent profile and source text provide no clear restriction, the planner uses the `all-compatible` policy: it loads the configured broad pack set and executes every circuit whose semantic, scope and evidence prerequisites can be satisfied. The planner may report deferred work if a user-supplied resource limit is reached, but it must not silently suppress compatible checks.

## 3. Architectural thesis

A useful semantic linter should not hide all meaning inside one model invocation. Natural-language interpretation is probabilistic and task-relative; rule execution can nevertheless be made explicit once a coding agent has materialized the relevant interpretation. The architecture therefore separates authoring from execution.

```text
Natural-language task, system instruction, source documents, reusable rules
                                  │
                                  ▼
                         Coding agent run
             (selected nll-* skills + generated file context)
                                  │
             ┌────────────────────┼──────────────────────┐
             ▼                    ▼                      ▼
       IntentJS program     LongTextJS program      task-local code
             │                    │                  if genuinely needed
             └────────────────────┼──────────────────────┘
                                  ▼
                    OntologyJS constructor universe
                                  │
                                  ▼
                         SemanticStore snapshot
                                  │
                                  ▼
               Intent planner + capability/method registry
                                  │
                                  ▼
                    selected/composed CircuitJS programs
                                  │
             ┌──────────────┬─────┴──────┬──────────────┐
             ▼              ▼            ▼              ▼
          concrete       abstract      symbolic       specialized
          execution      preflight      assurance     method engines
             └──────────────┴─────┬──────┴──────────────┘
                                  ▼
                    findings, explanations, CNLFrames
                                  │
                                  ▼
                  CNL observations, plans and specifications
```

The coding agent is flexible where the language is ambiguous. The runtime is explicit where the resulting semantic program is executable. This does not prove that the coding agent interpreted the text correctly; it makes the interpretation inspectable, testable, reusable and replayable.

## 4. Core semantic artifacts

### 4.1 OntologyJS

OntologyJS defines the semantic signature available to the other DSLs: concepts, entity classes, event and state frames, roles, value types, relations, subtype and incompatibility relations, lexicalizations, basic facts, semantic laws and capabilities. Executing an ontology module creates schema objects and generated constructor functions; it does not merely return a data-shaped configuration object.

### 4.2 LongTextJS

LongTextJS materializes a particular source into grounded semantic terms. It represents mentions, entities, events, states, claims, definitions, conditions, exceptions, modality, polarity, scope, time, quantities, source anchors, alternatives, worlds, identity hypotheses and coverage. A document may be split across many `.mjs` modules. The root LongTextJS module composes the units into one transaction and one snapshot.

### 4.3 CircuitJS

CircuitJS defines analysis and generation programs over the semantic store. A circuit has a semantic responsibility, typed requirements, provided capabilities, one or more execution stages and explicit outputs. It may use declarative query/dataflow primitives, decision tables, recursive relation rules, constraints, model-checking patterns, symbolic exploration, procedural JavaScript stages or combinations of these methods. Circuits compose through typed values and `requires/provides` capabilities.

### 4.4 IntentJS

IntentJS describes what the current task seeks to analyze or generate, what domains and text types appear relevant, what outputs are requested, what evidence policy applies, what methods are allowed or preferred, what profiles are loaded and what should happen when the intent is uncertain. It is generated for every task and may be refined after a first semantic pass.

### 4.5 CNLFrame and CNL output

Circuits do not directly invent final prose. They produce typed frames such as obligation, definition, causal explanation, claim-evidence pair, narrative event, section plan or clarification request. A controlled renderer produces concise CNL that another LLM may later expand stylistically. Where a deterministic parser exists, the CNL is round-tripped back to a frame and checked for semantic equivalence.

## 5. Global semantic principles

### 5.1 Semantics is relative to task, ontology and scope

The system does not claim to understand every possible meaning of a document. It claims to execute a delimited interpretation under a declared ontology and task intent. A source may be well represented for temporal continuity while being poorly represented for legal authority. Coverage is therefore typed and scoped.

### 5.2 Claims are not automatically world facts

A sentence in a document normally becomes a `Claim` attributed to a source or voice. It becomes an accepted world fact only when an ontology pack or evidence circuit explicitly licenses that transition. This distinction is essential for fiction, argumentation, legal documents and scientific claims.

### 5.3 Absence is not negation

`not(Claim)` differs from failing to find a claim. Circuits that conclude from absence require evidence that the relevant collection or scope is closed. If completeness is unknown, the result is `UNKNOWN`, not `FALSE`.

### 5.4 Alternatives are preserved when they can change a result

Ambiguous references, scope assignments or classifications may form alternative interpretation contexts. A result can be robust across all alternatives, conditional on one alternative or conflicting across alternatives. The runtime must preserve that distinction in traces and CNL output.

### 5.5 Provenance is structural

Every finding and generated frame must trace to source spans, ontology facts, circuit stages and derived terms. A natural-language explanation may paraphrase this structure but may not add premises that do not occur in the trace.

### 5.6 Status is richer than Boolean truth

At minimum the platform supports:

- `SATISFIED`
- `VIOLATED`
- `NOT_APPLICABLE`
- `UNKNOWN`
- `CONFLICT`
- `ACCEPTED_EXCEPTION`
- `BLOCKED_ONTOLOGY`
- `BLOCKED_COVERAGE`
- `BLOCKED_RESOURCE`
- `BLOCKED_METHOD`

Predicate-level logic uses at least `TRUE`, `FALSE`, `UNKNOWN` and `CONFLICT`. Rule-level statuses are not collapsed into predicate values.

## 6. The baseline knowledge target

The predefined packs target the breadth and caution expected from a capable child of approximately 12–14 years who has received a general lower-secondary education. This is a scope decision, not a psychological simulation.

The baseline should be able to:

- track ordinary objects, people, locations, possession, time and causality;
- apply elementary arithmetic, measurement and scientific relationships;
- recognize basic biological, physical and chemical categories;
- reason about beliefs, goals, emotions and simple social expectations without diagnosing people;
- distinguish individual, group, institution and cultural levels of explanation;
- apply elementary logical relations, detect direct contradictions and identify common reasoning errors;
- recognize basic normative structures such as duties, permissions, prohibitions, authority, procedures and consent;
- produce a logically organized CNL plan or analysis that an LLM can expand into polished prose.

The baseline must also know its limits. Expert medicine, jurisdiction-specific law, advanced physics, clinical psychology and contested social theory require separate agent-level or task-local packs.

## 7. Catalog of analysis and generation capabilities

This catalog defines expected circuit families. Individual domain specifications refine their ontology requirements and algorithms.

### 7.1 Cross-document structural checks

- source anchoring and span validity;
- missing, duplicate or conflicting definitions;
- term consistency and concept drift;
- unresolved references and ambiguous pronouns;
- entity identity continuity;
- temporal ordering, duration and deadline consistency;
- quantity, unit and dimensional compatibility;
- causal dependency and missing preconditions;
- claim-to-evidence dependency and provenance propagation;
- scope, exception, condition and negation attachment;
- contradiction, specialization and apparent-conflict discrimination;
- coverage gaps and unsupported closed-world conclusions;
- circular dependencies and unreachable requirements;
- section purpose, prerequisite order and outline coverage;
- duplication, redundant formulations and incompatible restatements.

### 7.2 Literary and narrative texts

- character identity and naming consistency;
- object and location continuity;
- event chronology and impossible travel or possession transitions;
- motivation-to-action plausibility;
- knowledge-state consistency: a character should not use information they have not acquired unless the narrative marks a special perspective;
- point-of-view consistency and unattributed narrator shifts;
- causal setup, consequence, foreshadowing and payoff;
- unresolved promises, introduced objects or plot obligations;
- contradiction between narrator, dialogue and later events, with explicit handling of unreliable narration;
- scene goals, conflict, outcome and transition;
- thematic or argument outline extraction without claiming literary value judgments as formal facts;
- CNL story plans with characters, settings, event constraints, arc stages and unresolved questions.

### 7.3 Legal, regulatory and policy texts

- definitions before use and consistency of defined terms;
- authority, jurisdiction, actor, beneficiary and regulated object;
- obligation, prohibition, permission, right, power and recommendation;
- conditions, exceptions, deadlines, recurrence and termination;
- conflicting duties or permissions;
- missing authorization before an action;
- procedural order, approval, notice, appeal and escalation;
- scope inheritance across sections and annexes;
- internal cross-reference validity;
- rule hierarchy and special-rule versus general-rule relationships;
- closed-world checks for mandatory clauses only when document scope is complete;
- controlled repair or synthesis of clauses using explicit normative frames.

The legal pack checks internal semantic structure. It does not determine jurisdiction-specific legality unless an agent explicitly loads an authoritative jurisdiction pack.

### 7.4 Internal regulations and operating procedures

- role/action authorization;
- required inputs and preconditions;
- process sequencing and eventually-required follow-up actions;
- segregation of duties and incompatible role combinations;
- deadline and service-level consistency;
- exception approval and documentation;
- escalation and failure handling;
- missing exit conditions or unreachable states;
- traceability from policy objective to procedure step;
- CNL procedure plans with actors, triggers, actions, outputs and exception paths.

### 7.5 Textbooks, manuals and educational texts

- concept introduction before dependent use;
- definition-example compatibility;
- prerequisite graph and pedagogical order;
- formula, unit, quantity and worked-example checks;
- scientific category mistakes and inconsistent diagrams or captions when structured inputs are available;
- instruction completeness and safety preconditions;
- claims stated too strongly relative to the supplied evidence;
- exercises aligned with taught concepts;
- CNL chapter plans with learning goals, definitions, examples, exercises and recap constraints.

### 7.6 Scientific and technical documents

- distinction between observation, hypothesis, method, result, interpretation and recommendation;
- unit and dimensional checks;
- numerical relation consistency;
- methods/results alignment;
- evidence provenance and source recency when metadata exists;
- correlation-versus-causation warnings;
- population, sample and generalization scope;
- uncertainty and confidence language;
- comparison baselines and omitted conditions;
- claim dependency slicing;
- contradictions among tables, text and derived claims when all are materialized;
- CNL study plans, claim-evidence maps and limitation statements.

### 7.7 Argumentative and analytical texts

- premise/conclusion structure;
- missing premises and unsupported leaps;
- circular support;
- equivocation and shifting definitions;
- quantifier and modal scope errors;
- direct contradiction and inconsistent commitments;
- common formal and informal fallacies;
- alternative explanations and omitted counterconditions;
- argument slices explaining why a conclusion is or is not supported;
- CNL argument plans with claims, supports, objections, replies and boundaries.

### 7.8 CNL planning and controlled generation

The platform must support generation of semantic plans rather than only sentence repair. Relevant outputs include:

- composition and essay plans;
- book and chapter architectures;
- policy and procedure outlines;
- requirement specifications;
- scientific claim/evidence outlines;
- narrative scene and character-arc plans;
- definitions and glossary plans;
- question sets, review checklists and clarification requests;
- concise CNL observations from analysis findings;
- constrained rewrite frames preserving actor, modality, scope, time, quantities and exceptions.

A plan is represented as typed frames and relations: section purpose, prerequisite, claim, evidence requirement, example, counterargument, transition, scope and completion condition. An LLM may expand the plan into natural prose, but the semantic plan remains the authoritative structure.

## 8. Predefined pack model

Each domain pack has a visible `.mjs` descriptor and four principal areas:

```text
framework/packs/<pack-id>/
  pack.mjs
  ontologies/
  circuits/
  cnl/
  tests/
```

A pack descriptor declares domains, recognized source signals, provided concepts, provided circuit capabilities, method requirements, default-load policy and compatibility constraints through fluent SDK calls. It does not contain a JSON manifest.

Packs are versioned by exported semantic identity, not by a hidden package manager. An agent may load framework packs, add agent-level extensions, and add task-local extensions. More specific layers may add lexicalizations, subclasses and new circuits, but they may not silently redefine the identity or law of an imported concept.

## 9. Global invariants

The implementation must enforce the following across all packs and tasks:

1. Every grounded semantic term has provenance or is explicitly marked as a pack fact.
2. Every finding has evidence, a rule/circuit identity and a trace.
3. Every generated CNL frame identifies which slots come from source facts, ontology facts, task instructions and circuit synthesis.
4. No negative conclusion based on absence is final without coverage evidence.
5. Interpretation context is preserved through queries, joins and aggregation.
6. Ontology casts occur only through declared subtype, equivalence or conversion relations.
7. A task’s selected plan is reproducible from its IntentJS, agent profile, loaded registry and source snapshot.
8. A circuit may be procedurally complex, but its semantic inputs, outputs and externally visible effects are explicit.
9. No circuit can emit a final result directly from an untracked model response.
10. The same canonical semantic inputs and framework versions produce the same deterministic core result.
11. Results produced under incomplete execution are marked blocked or partial rather than silently accepted.
12. All authoritative code artifacts are `.mjs`; no JSON/TypeScript fallback is introduced.

## 10. Reference repository shape

The complete directory contract is specified in DS-001, but all designs assume the following high-level structure:

```text
project/
  framework/
    sdk/
    runtime/
    packs/
    cnl/
    tools/
  nll-skills/
  profiles/
  agents/
    <agent-name>/
      agent.mjs
      ontologies/
      circuits/
      methods/
      profiles/
      tasks/
        <random-task-id>/
          task.mjs
          source/
          intent/
          longtext/
          ontologies/
          circuits/
          runs/
          results/
  evaluations/
```

## 11. Definition of architectural completeness

The architecture is considered coherently implemented when one clean repository can demonstrate all of the following without third-party runtime dependencies:

- create an agent and random-ID task through the `nllAgent` CLI;
- install selected skills in a run-local skills directory;
- invoke Codex through an adapter in direct-editing mode;
- generate a real fluent OntologyJS module, IntentJS module, multi-file LongTextJS program and composed CircuitJS program;
- materialize one semantic store from a long source;
- infer and merge task intent, select a load profile and explain why circuits were selected or rejected;
- execute concrete circuits and at least one auxiliary method such as abstract preflight or symbolic case generation;
- emit evidence-bearing findings and CNL observations;
- generate a CNL plan or repair frame and validate it with a deterministic structural check;
- rerun the task without invoking a coding agent;
- run unit tests without invoking a coding agent;
- run an isolated evaluation where the coding agent generates task artifacts inside a custom agent directory.

## 12. Related design specifications

- **DS-001** defines workspaces, CLI, coding-agent orchestration and skills.
- **DS-002** defines the four internal `.mjs` DSLs and the reusable SDK.
- **DS-003** defines the SemanticStore, circuit runtime and analysis algorithms.
- **DS-004** defines IntentJS, load profiles and dynamic selection.
- **DS-005** defines implementation testing.
- **DS-006** defines isolated evaluation.
- **DS-007–DS-019** define the predefined ontology and circuit packs.

## 13. Conceptual foundations

The design draws on many-sorted term algebras and embedded DSLs; event and frame semantics; discourse representation; SSA and dataflow; self-adjusting computation; relational fixed points; four-valued logic; abstract interpretation; symbolic execution; model checking; constraint solving; term rewriting; controlled natural languages; program slicing; knowledge compilation and capability planning. These techniques are adopted as implementation patterns, not as claims that ordinary language has become a fully formal program.

Key reference anchors used throughout the package are `[DAV67]`, `[FIL82]`, `[KAMP11]`, `[CYC91]`, `[FOR82]`, `[ACA05]`, `[HAM14]`, `[AHV95]`, `[BEL77]`, `[COU77]`, `[KIN76]`, `[CEGAR00]`, `[ALL83]`, `[BN98]`, `[KUH14]`, `[WEI84]` and `[DAR02]`. Full bibliographic entries are included in the source monograph and may be copied into project documentation as needed.
<!-- ORIGINAL SPECIFICATION END: DS-000_System_Architecture_and_Check_Catalog.md -->

### Additive implementation alignment

The implementation maps the architecture to framework/sdk, framework/runtime, framework/packs, framework/tools, framework/cli, profiles, agents/tasks, and executable examples. The CLI retains findings, CNL frames, coverage, diagnostics, binary traces, execution plans, and auxiliary assurance artifacts.

## Decisions & Questions

### Question #1: Why is the original specification embedded instead of replaced by a normalized rewrite?

Response: Source fidelity is an explicit project requirement. The embedded body remains byte-for-byte identical to the original file; official metadata, implementation alignment, and decision records are additive.

### Question #2: Which text wins if an additive note appears narrower than the preserved contract?

Response: The preserved normative requirement remains authoritative. An implementation-alignment note reports confirmed current behavior and cannot silently weaken the original contract.



## Conclusion

Future changes must preserve the embedded source contract, extend implementation and tests to meet it, and record contract-shaping rationale in numbered entries here.
