---
id: DS009
title: Preserved Core Common-Sense Ontology and Circuits
status: normative-implemented
owner: nllAgent architecture
summary: Preserves DS-007_Core_Common_Sense_Ontology_and_Circuits.md verbatim and records additive implementation alignment.
---

# DS009 — Preserved Core Common-Sense Ontology and Circuits

## Introduction

This official specification preserves the complete original design contract. No wording from the source specification has been removed, shortened, or rewritten.

## Core Content

The following source specification is included verbatim from `design-specifications/DS-007_Core_Common_Sense_Ontology_and_Circuits.md`.

<!-- ORIGINAL SPECIFICATION START: DS-007_Core_Common_Sense_Ontology_and_Circuits.md -->
# DS-007 — Core Common-Sense Ontology and Circuits

**Status:** Normative predefined-pack specification  
**Pack identity:** `core-commonsense`  
**Primary skills:** `nll-ontology, nll-circuit`  
**Depends on:** DS-000–DS-004  
**Testing:** DS-005  
**Evaluation:** DS-006


## 1. Role in the architecture

This pack is one modular source of ontology constructors, stable background knowledge, reusable circuits, CNL frames and intent-recognition metadata. It does not replace the common language ontology or the task-specific LongText interpretation. LongTextJS uses the pack's generated constructors to describe source claims; CircuitJS uses the same identities to query, derive and evaluate; IntentJS uses the pack descriptor to decide whether loading and execution are relevant.

The target breadth is comparable to a careful 12–14-year-old with ordinary lower-secondary education. The pack should be useful and conservative. It should recognize basic relationships and common errors, but it must report uncertainty rather than simulate expert knowledge. Every domain assertion is either a source-grounded claim, a declared pack fact, or a derived fact with provenance.

The pack is implemented entirely as `.mjs` modules with Node.js built-ins. It introduces no JSON or TypeScript artifacts and no third-party dependency. Ontologies, circuits and tests are written by coding agents using the SDK and the relevant nll-* skills.


## 2. Scope and non-goals

This pack covers ordinary persistence, containment, support, movement, possession, access, use, basic agency, preconditions and everyday causal expectations. It supports document continuity and simple planning. It is not a database of every everyday fact and it does not declare culturally contingent behavior universal.

The pack must distinguish internal document reasoning from claims about the external world. It may flag a statement as inconsistent with loaded basic knowledge, but it should say which pack fact or relation was used. It must not upgrade a plausible heuristic into a universal law.

## 3. Conceptual and scientific basis

Common-sense reasoning is treated as a compact collection of typed qualitative models. Objects persist unless an event creates, destroys or transforms them; physical location and possession change through events; actions have participants and preconditions; agents can have goals and knowledge states. These are defeasible defaults used to generate questions or plausibility findings, not inviolable physical laws. Event semantics and frame semantics provide the representation, while small transition systems and dependency relations provide execution.

The practical ontology should favor event/state frames with typed roles over flat subject–predicate–object triples. Reified events make time, place, participants, causes, instruments, modality and evidence attachable without inventing a different predicate arity for every sentence. Claims and contexts remain separate from the situations they describe.

## 4. Ontology modules

The pack is divided into the following modules:

- entities — agents, physical objects, substances, containers, tools and places
- space — containment, support, contact, adjacency and reachability
- events — movement, transfer, acquisition, loss, use, creation, destruction and change
- agency — goals, intentions, abilities, knowledge and action preconditions
- continuity — persistence, state transitions, possession and location history
- causality — enablement, prevention, direct cause and expected consequence

The module boundaries are semantic and operational. A coding agent may split a large module further, but imports must preserve pack-qualified identities and avoid circular initialization.

## 5. Core concept inventory

- Agent — a person, group or system capable of intentional action
- PhysicalObject — a persistent countable object
- Substance — divisible material rather than an individual object
- Place — a spatial region or functional location
- Container — an object or place that can contain another object
- Tool — an object used as an instrument
- Goal — a desired state attributed to an agent
- Ability — a capability under stated conditions
- KnowledgeState — what an agent is represented as knowing or not knowing
- PossessionState — ownership, custody, control or temporary holding
- AccessibilityState — reachable, visible, available, locked or blocked

Concepts should include English lexicalizations and may add other languages in separate lexicon modules. Lexical forms are recognition aids; they do not define semantic identity.

## 6. Canonical frames and relations

- Move(agent, theme, from, to, time)
- Transfer(giver, receiver, theme, time)
- PlaceIn(agent, theme, container)
- RemoveFrom(agent, theme, container)
- Use(agent, instrument, purpose)
- Acquire(agent, theme) and Lose(agent, theme)
- Create(agent, result) and Destroy(agent, theme)
- Know(agent, proposition, context)
- Intend(agent, goal) and Attempt(agent, action)
- Requires(action, precondition), Enables(event, action), Prevents(event, action)
- LocatedAt(entity, place, interval), Contains(container, entity, interval)
- Before, After, During and Overlaps

Every frame declares role domains, ranges and cardinalities. Relations with inverses or symmetry properties register those laws in OntologyJS. Application-specific judgments remain in circuits.

## 7. Stable knowledge seed

The initial pack should encode a deliberately small, inspectable seed rather than an opaque encyclopaedia. Recommended seed categories are:

- an object normally cannot be in two disjoint places at the same time unless duplication or part structure is represented
- placing an object in a container changes its containment relation when the action completes
- using a specific physical object normally requires access to it
- transfer changes custody or control but not necessarily legal ownership
- knowledge requires an acquisition route in narrative continuity checks unless omniscience or narration licenses it
- destruction normally ends ordinary persistence of the destroyed object
- a cause must precede or overlap its direct effect in ordinary time
- a prerequisite must hold before an action whose frame requires it

Pack facts are versioned and carry a provenance note such as `school-textbook-consensus`, `definition`, `unit-standard` or `design-convention`. Current, jurisdiction-dependent or contested facts are not part of the baseline pack.

## 8. Predefined circuit catalog

| Capability | Design |
|---|---|
| ObjectContinuityFinding | detects incompatible locations, possession or existence states for the same object and time |
| MissingTransitionFinding | finds a later state that requires an unrepresented move, acquisition, retrieval or transformation |
| ActionPreconditionFinding | checks access, ability, required tool and enabling conditions before an action |
| KnowledgeContinuityFinding | checks whether an agent uses information that has not been acquired in the represented world |
| CausalGapFinding | finds effects or state changes without any compatible enabling event when the text claims a complete account |
| ImpossibleCoexistenceFinding | uses disjointness, identity and time to identify mutually impossible basic states |
| PossessionConflictFinding | distinguishes ownership, custody and access before reporting contradiction |
| EverydayPlanCircuit | builds a CNL sequence of goals, prerequisites, actions and expected outcomes |
| ClarificationDemand | asks which object, location, actor or transition resolves an ambiguity |

A circuit may use several methods. The table describes its semantic responsibility, not a rigid implementation class. For example, a consistency circuit may use indexed queries, a relation closure, a constraint network and a bounded symbolic witness search.

## 9. Controlled generation and planning

The pack contributes CNL frames and generation circuits for:

- event-sequence plans with explicit preconditions and outcomes
- narrative continuity observations
- object-location and possession summaries
- clarification questions for missing transitions
- simple action instructions with actor, object, tool, location and order

Generated plans preserve the distinction between a pack fact, a source claim, an inferred relation and an open question. A downstream LLM may improve style, but it should receive the CNL plan plus immutable semantic constraints.

## 10. Intent recognition and profile behavior

Cheap and semantic intent signals include:

- high density of concrete actors, objects, locations and action verbs
- narrative scenes, procedures or everyday descriptions
- references to possession, movement, retrieval, access or use
- task concerns such as continuity, plausibility, precondition or plan

The pack descriptor declares these signals through fluent functions. Signal matches only influence loading and ranking; they do not produce findings. When this pack is loaded under `all-compatible`, every circuit whose prerequisites are satisfied is eligible. Domain-specific profiles may choose a smaller circuit subset.

## 11. Algorithm and implementation guidance

- maintain interval-indexed state histories for location, possession and existence
- use identity must/may/cannot-alias before comparing states
- compile action frames into precondition/effect summaries used by a small transition view
- use breadth-first witness search for a shortest missing transition suggestion
- treat defeasible defaults as possible findings requiring explanation, never as hard contradictions unless ontology disjointness and closed scope support them
- use backward slicing from a later action to the facts that should enable it

All algorithms operate over SemanticStore handles and provenance-preserving views. A specialized view may be cached, but the store remains the logical authority. Procedural stages are allowed when they are simpler than forcing an algorithm into declarative primitives; the stage must declare semantic reads, writes and trace output.

## 12. Fluent pack shape

A pack is ordinary JavaScript, not a manifest object:

```js
import {
  ontology, entityKind, eventKind, role, relation,
  capability, domainPack, lexicalSignals, semanticSignals
} from "../../sdk/index.mjs";

const O = ontology("core-commonsense", "1.0.0");
export const Agent = O.entity(entityKind("Agent"));
export const PhysicalObject = O.entity(entityKind("PhysicalObject"));
export const Substance = O.entity(entityKind("Substance"));

export const ontologyModule = O.seal();

export default domainPack("core-commonsense")
  .ontology(ontologyModule)
  .recognize(
    lexicalSignals(/* pack-specific terms */),
    semanticSignals(/* pack-specific frame identities */)
  )
  .provide(capability("ObjectContinuityFinding"))
  .provide(capability("MissingTransitionFinding"))
  .provide(capability("ActionPreconditionFinding"))
  .targetKnowledgeLevel("lower-secondary")
  .seal();
```

The real implementation should define event/state frames, role constructors, lexicalizations, facts, circuits and tests in separate files as described below.

## 13. Required directory structure

```text
framework/packs/core-commonsense/
  pack.mjs
  ontologies/
    entities.ontology.mjs
    space.ontology.mjs
    events.ontology.mjs
    agency.ontology.mjs
    continuity.ontology.mjs
    causality.ontology.mjs
  circuits/
    selection.circuit.mjs
    consistency.circuit.mjs
    generation.circuit.mjs
    index.mjs
  cnl/
    frames.mjs
    lexicon.en.mjs
    renderer.mjs
  tests/
    ontology.test.mjs
    circuits.test.mjs
    intent.test.mjs
    cnl.test.mjs
```

File names may be refined, but the pack must expose one `pack.mjs`, one circuit index and one test entry point. Agent-level specializations import the pack instead of copying it.

## 14. Testing requirements

Minimum tests include:

- object moved through an explicit transition versus appearing elsewhere without one
- an agent uses a key before and after transferring it, with access distinctions
- two same-time disjoint locations
- a character knows a secret after hearing it versus before hearing it
- container insertion and removal
- creation/destruction lifecycle
- ambiguous identity producing a conditional rather than robust finding
- CNL action plan round-trip

Tests use Node's built-in test runner. Every finding test asserts evidence and trace dependencies. CNL tests assert frame slots and, where parsers exist, round-trip equivalence.

## 15. Limitations and extension policy

The pack cannot encode unlimited real-world common sense. Many defaults are culturally, physically or contextually defeasible. Hard findings should be limited to declared disjointness and explicit state constraints. Plausibility circuits should emit `POSSIBLE_PROBLEM` or `UNKNOWN` when alternative explanations remain.

A specialized agent can add a new module under `agents/<agent>/ontologies/` or `circuits/`. Task-local additions are allowed under the task directory. Reusable additions should be promoted by a coding-agent run after tests demonstrate that the concept or circuit is not task-specific.

## 16. Acceptance criteria

The pack is acceptable when:

1. its ontology imports with the core stack and has no identity or closure conflict;
2. LongTextJS can use generated constructors without generic field objects;
3. its major circuits produce evidence-bearing findings on micro-cases;
4. IntentJS can select the pack from both explicit instructions and semantic source signals;
5. `all-compatible` loads and executes all applicable pack circuits;
6. CNL planning or explanation outputs preserve provenance;
7. pack tests pass without a coding agent, network or external dependency;
8. ambiguous or expert-level cases produce explicit uncertainty or a refinement demand.

## 17. Relevant foundations

Event semantics [DAV67], frame semantics [FIL82], qualitative state-transition reasoning, Allen temporal relations [ALL83], dependency slicing [WEI84] and explicit-state reachability.

## Appendix A. Minimum implementation inventory

### A.1 Required ontology identities

The first usable implementation should expose distinct identities for `Agent`, `Person`, `GroupAgent`, `PhysicalObject`, `Substance`, `Place`, `Region`, `Container`, `Surface`, `Tool`, `InformationArtifact`, `Goal`, `Plan`, `Ability`, `KnowledgeState`, `BeliefState`, `PossessionState`, `AccessState`, `ExistenceState`, `LocationState` and `Condition`.

Required event families are `Appear`, `Disappear`, `Create`, `Destroy`, `Move`, `Arrive`, `Depart`, `Enter`, `Exit`, `PlaceIn`, `RemoveFrom`, `Give`, `Receive`, `Acquire`, `Lose`, `Take`, `Return`, `Open`, `Close`, `Lock`, `Unlock`, `Use`, `Break`, `Repair`, `Observe`, `Tell`, `Learn`, `Forget`, `Attempt`, `Succeed`, `Fail`, `Prevent` and `Enable`.

Required spatial relations are `LocatedAt`, `Inside`, `Contains`, `On`, `Supports`, `Touches`, `AdjacentTo`, `Near`, `FarFrom`, `ConnectedTo`, `ReachableFrom` and `DisjointPlace`. Relations should declare symmetry, inverse or transitivity only where the intended qualitative model licenses it.

### A.2 State-transition summaries

The pack should register reusable summaries rather than hard-code effects in every circuit. Examples:

- completed `Move(theme, from, to)` ends a compatible `LocatedAt(theme, from)` state and starts a `LocatedAt(theme, to)` state;
- `PlaceIn(theme, container)` implies `Inside(theme, container)` after completion;
- `RemoveFrom(theme, container)` ends that containment state;
- `Give(giver, receiver, theme)` normally changes custody, while ownership changes only if the source claims it;
- `Unlock(lockable)` can enable `Open(lockable)` but does not imply that opening occurred;
- `Destroy(theme)` ends ordinary persistence, while `Break(theme)` may preserve identity with a changed functional state;
- `Tell(source, recipient, proposition)` can enable a recipient belief/knowledge claim, subject to hearing and trust assumptions.

Each summary must identify whether it is hard, model-relative or defeasible. Defeasible summaries support plausibility checks and refinement, not unconditional contradiction.

### A.3 Required query/circuit kits

The SDK should include reusable kits for:

- state-at-time lookup;
- state-transition validation;
- object-history reconstruction;
- must/may alias aware continuity;
- precondition satisfaction;
- missing-enabler search;
- shortest transition witness;
- source-order versus event-order comparison;
- knowledge-acquisition path;
- persistence across narrative ellipsis;
- clarification frame generation.

### A.4 Default loading

`core-commonsense` belongs in `general-broad`, `general-school`, `literary-analysis`, `legal-policy`, `scientific-textbook` and `social-analysis`. It may be excluded only by an explicit narrow profile. Expensive continuity circuits are selected by intent; lightweight identity, time and state sanity checks are baseline-compatible.

<!-- ORIGINAL SPECIFICATION END: DS-007_Core_Common_Sense_Ontology_and_Circuits.md -->

### Additive implementation alignment

The corresponding executable pack is installed under framework/packs and includes ontology modules, a sealed pack descriptor, capability-providing circuits, CNL support, lexical/semantic intent signals, and isolated ontology/circuit/intent/CNL tests. Pack 1 of the preserved domain sequence is also loadable through framework/packs/index.mjs.

## Decisions & Questions

### Question #1: Why is the original specification embedded instead of replaced by a normalized rewrite?

Response: Source fidelity is an explicit project requirement. The embedded body remains byte-for-byte identical to the original file; official metadata, implementation alignment, and decision records are additive.

### Question #2: Which text wins if an additive note appears narrower than the preserved contract?

Response: The preserved normative requirement remains authoritative. An implementation-alignment note reports confirmed current behavior and cannot silently weaken the original contract.



## Conclusion

Future changes must preserve the embedded source contract, extend implementation and tests to meet it, and record contract-shaping rationale in numbered entries here.
