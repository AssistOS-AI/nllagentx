---
id: DS015
title: Preserved Psychology, Emotion and Motivation Ontology and Circuits
status: normative-implemented
owner: nllAgent architecture
summary: Preserves DS-013_Psychology_Emotion_and_Motivation_Ontology_and_Circuits.md verbatim and records additive implementation alignment.
---

# DS015 — Preserved Psychology, Emotion and Motivation Ontology and Circuits

## Introduction

This official specification preserves the complete original design contract. No wording from the source specification has been removed, shortened, or rewritten.

## Core Content

The following source specification is included verbatim from `design-specifications/DS-013_Psychology_Emotion_and_Motivation_Ontology_and_Circuits.md`.

<!-- ORIGINAL SPECIFICATION START: DS-013_Psychology_Emotion_and_Motivation_Ontology_and_Circuits.md -->
# DS-013 — Psychology, Emotion and Motivation Ontology and Circuits

**Status:** Normative predefined-pack specification  
**Pack identity:** `psychology-basic`  
**Primary skills:** `nll-ontology, nll-circuit`  
**Depends on:** DS-000–DS-004  
**Testing:** DS-005  
**Evaluation:** DS-006


## 1. Role in the architecture

This pack is one modular source of ontology constructors, stable background knowledge, reusable circuits, CNL frames and intent-recognition metadata. It does not replace the common language ontology or the task-specific LongText interpretation. LongTextJS uses the pack's generated constructors to describe source claims; CircuitJS uses the same identities to query, derive and evaluate; IntentJS uses the pack descriptor to decide whether loading and execution are relevant.

The target breadth is comparable to a careful 12–14-year-old with ordinary lower-secondary education. The pack should be useful and conservative. It should recognize basic relationships and common errors, but it must report uncertainty rather than simulate expert knowledge. Every domain assertion is either a source-grounded claim, a declared pack fact, or a derived fact with provenance.

The pack is implemented entirely as `.mjs` modules with Node.js built-ins. It introduces no JSON or TypeScript artifacts and no third-party dependency. Ontologies, circuits and tests are written by coding agents using the SDK and the relevant nll-* skills.


## 2. Scope and non-goals

This pack models basic mental-state attribution for text analysis: perception, belief, knowledge, memory, goal, intention, emotion, appraisal, motivation and interpersonal perspective. It supports narrative and social reasoning. It does not diagnose disorders, infer hidden mental states as facts or present one psychological theory as complete.

The pack must distinguish internal document reasoning from claims about the external world. It may flag a statement as inconsistent with loaded basic knowledge, but it should say which pack fact or relation was used. It must not upgrade a plausible heuristic into a universal law.

## 3. Conceptual and scientific basis

Mental states are intensional and perspective-dependent. A character can believe a false proposition; a narrator can report an emotion without establishing its cause; the same event can be appraised differently by different agents. The ontology therefore attaches mental states to agents, times, contexts and evidence. Emotion relations are plausible appraisal patterns rather than deterministic laws.

The practical ontology should favor event/state frames with typed roles over flat subject–predicate–object triples. Reified events make time, place, participants, causes, instruments, modality and evidence attachable without inventing a different predicate arity for every sentence. Claims and contexts remain separate from the situations they describe.

## 4. Ontology modules

The pack is divided into the following modules:

- perception-knowledge — noticing, hearing, knowing, believing and uncertainty
- memory — encoding, remembering, forgetting and recall cues
- goals-intentions — desire, goal, plan, intention, attempt and obstacle
- emotion — basic emotion families, valence, arousal and appraisal
- motivation — need, incentive, value, conflict and persistence
- perspective — first/third-person attribution, report and inference
- interaction — empathy, misunderstanding, trust and expectation

The module boundaries are semantic and operational. A coding agent may split a large module further, but imports must preserve pack-qualified identities and avoid circular initialization.

## 5. Core concept inventory

- MentalAgent, Perspective and MentalContext
- Perception, Belief, Knowledge and Uncertainty
- MemoryTrace, Remember and Forget
- Desire, Goal, Intention, Plan and Attempt
- EmotionState, Appraisal and Regulation
- Motivation, Incentive, Need and Value
- TrustState and Expectation
- MentalStateEvidence

Concepts should include English lexicalizations and may add other languages in separate lexicon modules. Lexical forms are recognition aids; they do not define semantic identity.

## 6. Canonical frames and relations

- Perceives(agent, event, channel)
- Believes(agent, proposition, confidence)
- Knows(agent, proposition, basis)
- Remembers(agent, proposition, time)
- Wants(agent, goal), Intends(agent, action) and Attempts(agent, action)
- Appraises(agent, event, relationToGoal)
- Feels(agent, emotion, intensity, duration)
- MotivatedBy(agent, factor)
- ReportsMentalState(source, agent, state)

Every frame declares role domains, ranges and cardinalities. Relations with inverses or symmetry properties register those laws in OntologyJS. Application-specific judgments remain in circuits.

## 7. Stable knowledge seed

The initial pack should encode a deliberately small, inspectable seed rather than an opaque encyclopaedia. Recommended seed categories are:

- knowledge normally requires perception, testimony, inference or prior memory in a narrative world
- belief and knowledge are distinct; belief may be false
- goals can conflict and actions may serve more than one motive
- emotions depend on appraisal and context; no single event guarantees one emotion
- intent does not guarantee success
- memory can be incomplete or mistaken
- reported mental state and independently supported mental state are different evidence classes
- behavior can support several plausible interpretations

Pack facts are versioned and carry a provenance note such as `school-textbook-consensus`, `definition`, `unit-standard` or `design-convention`. Current, jurisdiction-dependent or contested facts are not part of the baseline pack.

## 8. Predefined circuit catalog

| Capability | Design |
|---|---|
| KnowledgeAccessFinding | checks whether an agent has a represented route to information used later |
| MotivationContinuityFinding | checks whether major actions connect to goals, values, threats or newly introduced motives |
| EmotionTransitionFinding | checks abrupt emotional changes and searches for represented appraisal events |
| BeliefActionConsistencyFinding | compares actions with attributed beliefs and goals while preserving alternatives |
| PerspectiveAttributionFinding | detects unsupported omniscient claims or viewpoint confusion |
| MindReadingWarning | flags text that states another person's motives as fact without evidence |
| GoalConflictCircuit | represents competing goals and explains decisions or unresolved conflict |
| CharacterArcPlan | builds CNL frames for initial state, goal, obstacle, choice, consequence and change |

A circuit may use several methods. The table describes its semantic responsibility, not a rigid implementation class. For example, a consistency circuit may use indexed queries, a relation closure, a constraint network and a bounded symbolic witness search.

## 9. Controlled generation and planning

The pack contributes CNL frames and generation circuits for:

- character motivation and emotion maps
- scene-level perspective plans
- clarification questions separating observation from inferred motive
- non-diagnostic social explanations
- composition plans with goal, obstacle, decision, consequence and learning

Generated plans preserve the distinction between a pack fact, a source claim, an inferred relation and an open question. A downstream LLM may improve style, but it should receive the CNL plan plus immutable semantic constraints.

## 10. Intent recognition and profile behavior

Cheap and semantic intent signals include:

- emotion words, belief/knowledge verbs, goals, intentions and interpersonal conflict
- literary narrative, biography, dialogue or social case description
- requests about motivation, perspective, empathy or behavior
- source claims attributing unobservable mental states

The pack descriptor declares these signals through fluent functions. Signal matches only influence loading and ranking; they do not produce findings. When this pack is loaded under `all-compatible`, every circuit whose prerequisites are satisfied is eligible. Domain-specific profiles may choose a smaller circuit subset.

## 11. Algorithm and implementation guidance

- maintain per-agent knowledge and belief contexts
- use event-to-mental-state dependency edges rather than global truth propagation
- represent appraisal dimensions as optional typed relations, not mandatory numeric scores
- use alternative interpretation branches for motives and emotions
- use temporal state histories to check continuity
- classify unsupported mental-state attribution as evidence weakness, not psychological diagnosis
- use backward slices from actions to goals, beliefs and triggering events

All algorithms operate over SemanticStore handles and provenance-preserving views. A specialized view may be cached, but the store remains the logical authority. Procedural stages are allowed when they are simpler than forcing an algorithm into declarative primitives; the stage must declare semantic reads, writes and trace output.

## 12. Fluent pack shape

A pack is ordinary JavaScript, not a manifest object:

```js
import {
  ontology, entityKind, eventKind, role, relation,
  capability, domainPack, lexicalSignals, semanticSignals
} from "../../sdk/index.mjs";

const O = ontology("psychology-basic", "1.0.0");
export const MentalAgent = O.entity(entityKind("MentalAgent"));
export const Belief = O.entity(entityKind("Belief"));
export const MemoryTrace = O.entity(entityKind("MemoryTrace"));

export const ontologyModule = O.seal();

export default domainPack("psychology-basic")
  .ontology(ontologyModule)
  .recognize(
    lexicalSignals(/* pack-specific terms */),
    semanticSignals(/* pack-specific frame identities */)
  )
  .provide(capability("KnowledgeAccessFinding"))
  .provide(capability("MotivationContinuityFinding"))
  .provide(capability("EmotionTransitionFinding"))
  .targetKnowledgeLevel("lower-secondary")
  .seal();
```

The real implementation should define event/state frames, role constructors, lexicalizations, facts, circuits and tests in separate files as described below.

## 13. Required directory structure

```text
framework/packs/psychology-basic/
  pack.mjs
  ontologies/
    perception-knowledge.ontology.mjs
    memory.ontology.mjs
    goals-intentions.ontology.mjs
    emotion.ontology.mjs
    motivation.ontology.mjs
    perspective.ontology.mjs
    interaction.ontology.mjs
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

- belief versus knowledge
- information acquired before/after use
- goal-action support and conflicting goals
- emotion change with and without trigger
- reported versus inferred motive
- unreliable narrator/perspective context
- ambiguous motive preserved as alternatives
- character arc CNL plan

Tests use Node's built-in test runner. Every finding test asserts evidence and trace dependencies. CNL tests assert frame slots and, where parsers exist, round-trip equivalence.

## 15. Limitations and extension policy

The pack cannot reliably infer real human motives from behavior and must not diagnose mental illness. Cultural variation affects emotion expression and social interpretation. Findings should distinguish explicit attribution, plausible inference and unsupported speculation.

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

Belief and discourse contexts [KAMP11], event/frame semantics [DAV67][FIL82], assumption-based alternatives [DEK86] and dependency slicing [WEI84].

## Appendix A. Minimum mental-state model

### A.1 Epistemic states

Represent perception, attention, belief, uncertainty, knowledge, memory and testimony separately. A `KnowledgeAcquisition` edge records a route: direct perception, communication, inference, prior memory or privileged narrative access. Knowledge-continuity circuits query this route before claiming an inconsistency.

### A.2 Goal and action model

An agent can have multiple goals with priorities, conflicts and dependencies. Actions may be intended, attempted, successful, failed, accidental or coerced. A motive is an explanatory relation, not an observable object. LongTextJS should mark whether motive is explicitly stated, reported by another voice or inferred by the coding agent.

### A.3 Emotion model

Use broad emotion families—joy, sadness, fear, anger, disgust, surprise, shame/guilt, affection and relief—plus valence, arousal, target, duration and appraisal relation. Do not force every emotion into one theory. A circuit may say that an emotion shift lacks a represented trigger, not that the emotion is impossible.

### A.4 Perspective and reliability

Implement narrator, focalizer, speaker, reported person and external observer contexts. Claims about mental states inherit the source voice and evidence class. Unreliable or limited narrators can make contradictory mental-state claims without establishing a world contradiction.

### A.5 Motivation and character-arc circuits

Provide reusable kits for goal introduction, obstacle, attempted strategy, decision, consequence, belief update and goal revision. A character arc plan should preserve unresolved ambivalence and should not require every narrative to end with psychological growth.

### A.6 Non-diagnostic policy

No pack circuit may map text directly to a psychiatric diagnosis. Terms such as anxiety or depression can be represented as source vocabulary or ordinary emotion descriptions, but diagnostic claims require a separate expert pack and evidence policy.

<!-- ORIGINAL SPECIFICATION END: DS-013_Psychology_Emotion_and_Motivation_Ontology_and_Circuits.md -->

### Additive implementation alignment

The corresponding executable pack is installed under framework/packs and includes ontology modules, a sealed pack descriptor, capability-providing circuits, CNL support, lexical/semantic intent signals, and isolated ontology/circuit/intent/CNL tests. Pack 7 of the preserved domain sequence is also loadable through framework/packs/index.mjs.

## Decisions & Questions

### Question #1: Why is the original specification embedded instead of replaced by a normalized rewrite?

Response: Source fidelity is an explicit project requirement. The embedded body remains byte-for-byte identical to the original file; official metadata, implementation alignment, and decision records are additive.

### Question #2: Which text wins if an additive note appears narrower than the preserved contract?

Response: The preserved normative requirement remains authoritative. An implementation-alignment note reports confirmed current behavior and cannot silently weaken the original contract.



## Conclusion

Future changes must preserve the embedded source contract, extend implementation and tests to meet it, and record contract-shaping rationale in numbered entries here.
