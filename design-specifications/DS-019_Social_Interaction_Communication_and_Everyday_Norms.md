# DS-019 — Social Interaction, Communication and Everyday Norms Ontology and Circuits

**Status:** Normative predefined-pack specification  
**Pack identity:** `social-interaction`  
**Primary skills:** `nll-ontology, nll-circuit`  
**Depends on:** DS-000–DS-004  
**Testing:** DS-005  
**Evaluation:** DS-006


## 1. Role in the architecture

This pack is one modular source of ontology constructors, stable background knowledge, reusable circuits, CNL frames and intent-recognition metadata. It does not replace the common language ontology or the task-specific LongText interpretation. LongTextJS uses the pack's generated constructors to describe source claims; CircuitJS uses the same identities to query, derive and evaluate; IntentJS uses the pack descriptor to decide whether loading and execution are relevant.

The target breadth is comparable to a careful 12–14-year-old with ordinary lower-secondary education. The pack should be useful and conservative. It should recognize basic relationships and common errors, but it must report uncertainty rather than simulate expert knowledge. Every domain assertion is either a source-grounded claim, a declared pack fact, or a derived fact with provenance.

The pack is implemented entirely as `.mjs` modules with Node.js built-ins. It introduces no JSON or TypeScript artifacts and no third-party dependency. Ontologies, circuits and tests are written by coding agents using the SDK and the relevant nll-* skills.


## 2. Scope and non-goals

This pack covers ordinary speech acts, requests, promises, consent, cooperation, conflict, boundaries, turn-taking, privacy, reciprocity, fairness and simple social expectations. It supports narrative, policy and interpersonal-text analysis. It does not encode one culture's etiquette as universal morality.

The pack must distinguish internal document reasoning from claims about the external world. It may flag a statement as inconsistent with loaded basic knowledge, but it should say which pack fact or relation was used. It must not upgrade a plausible heuristic into a universal law.

## 3. Conceptual and scientific basis

Social interaction is modeled as actions between agents under relationships, roles, norms and contexts. A request differs from an order; a promise creates an expectation; consent depends on information, freedom and scope; politeness conventions are defeasible and culture-specific. The ontology separates descriptive interaction facts from normative judgments and records whose norm or expectation is being applied.

The practical ontology should favor event/state frames with typed roles over flat subject–predicate–object triples. Reified events make time, place, participants, causes, instruments, modality and evidence attachable without inventing a different predicate arity for every sentence. Claims and contexts remain separate from the situations they describe.

## 4. Ontology modules

The pack is divided into the following modules:

- speech-acts — assertion, question, request, offer, promise, refusal, apology and threat
- consent-boundaries — proposal, information, voluntariness, scope, withdrawal and privacy
- cooperation — shared goal, contribution, reciprocity and coordination
- conflict — disagreement, accusation, repair, negotiation and escalation
- roles-power — authority, dependency, vulnerability and responsibility
- fairness — distribution, procedure, consistency and justification
- communication-quality — clarity, ambiguity, turn-taking and acknowledgment

The module boundaries are semantic and operational. A coding agent may split a large module further, but imports must preserve pack-qualified identities and avoid circular initialization.

## 5. Core concept inventory

- Interaction, SpeechAct and Conversation
- Request, Order, Offer, Promise, Refusal and Apology
- Consent, Permission, Boundary and Withdrawal
- SharedGoal, Contribution and Cooperation
- Conflict, Disagreement, Accusation and RepairAttempt
- Relationship, Role, Authority and Dependency
- PrivacyExpectation and Disclosure
- FairnessClaim and Justification

Concepts should include English lexicalizations and may add other languages in separate lexicon modules. Lexical forms are recognition aids; they do not define semantic identity.

## 6. Canonical frames and relations

- DirectedTo(act, recipient)
- CommitsTo(promise, promisor, action)
- Requests(requester, recipient, action)
- ConsentsTo(agent, action, scope, conditions)
- Withdraws(agent, consent)
- SharesGoal(agents, goal)
- Contributes(agent, action, goal)
- Discloses(source, information, recipient, scope)
- Repairs(agent, priorAct)

Every frame declares role domains, ranges and cardinalities. Relations with inverses or symmetry properties register those laws in OntologyJS. Application-specific judgments remain in circuits.

## 7. Stable knowledge seed

The initial pack should encode a deliberately small, inspectable seed rather than an opaque encyclopaedia. Recommended seed categories are:

- a promise creates an expectation but does not guarantee performance
- a request is not automatically an order; authority and context matter
- consent is scoped and can be absent, unclear, conditional or withdrawn
- silence is not universally valid consent
- private information has a source, subject, audience and disclosure scope
- roles and power affect whether an interaction is voluntary
- fairness claims require a stated comparison or procedure
- social norms vary by group and context

Pack facts are versioned and carry a provenance note such as `school-textbook-consensus`, `definition`, `unit-standard` or `design-convention`. Current, jurisdiction-dependent or contested facts are not part of the baseline pack.

## 8. Predefined circuit catalog

| Capability | Design |
|---|---|
| SpeechActClassificationFinding | distinguishes request, order, offer, promise, refusal and threat using context |
| PromiseClosureFinding | checks whether a commitment is fulfilled, cancelled, renegotiated or left unresolved |
| ConsentStructureFinding | checks actor, action, information, voluntariness, scope and withdrawal |
| BoundaryConflictFinding | finds an action inconsistent with an explicit boundary or permission |
| PrivacyDisclosureFinding | checks information subject, audience and represented permission |
| CooperationContributionFinding | tracks shared goals, expected contributions and unacknowledged dependencies |
| ConflictEscalationFinding | analyzes interaction traces for accusation, response, repair and escalation |
| FairnessReasoningFinding | checks consistency of comparison groups and procedural justification |
| SocialAttributionWarning | distinguishes observed behavior from assumed intention |
| DialogueAndInteractionPlan | generates CNL goals, speech acts, boundaries, commitments and repair steps |

A circuit may use several methods. The table describes its semantic responsibility, not a rigid implementation class. For example, a consistency circuit may use indexed queries, a relation closure, a constraint network and a bounded symbolic witness search.

## 9. Controlled generation and planning

The pack contributes CNL frames and generation circuits for:

- dialogue plans with explicit speech-act purpose
- consent and boundary checklists
- promise/commitment summaries
- conflict-resolution and clarification plans without pretending universal etiquette
- social-interaction observations separating behavior, interpretation and norm

Generated plans preserve the distinction between a pack fact, a source claim, an inferred relation and an open question. A downstream LLM may improve style, but it should receive the CNL plan plus immutable semantic constraints.

## 10. Intent recognition and profile behavior

Cheap and semantic intent signals include:

- dialogue, requests, promises, consent, apology, conflict, privacy or fairness language
- narrative scenes and interpersonal case descriptions
- codes of conduct and internal policies
- requests to analyze communication or generate interaction plans

The pack descriptor declares these signals through fluent functions. Signal matches only influence loading and ranking; they do not produce findings. When this pack is loaded under `all-compatible`, every circuit whose prerequisites are satisfied is eligible. Domain-specific profiles may choose a smaller circuit subset.

## 11. Algorithm and implementation guidance

- represent interactions as events with speaker, recipient, content, context and power relation
- use monitor automata for promise-response, request-acknowledgment and repair sequences
- model consent as a state with scope, conditions and temporal validity
- use alternative classifications when a speech act is ambiguous
- separate descriptive behavior from normative evaluation
- parameterize culture/group norms through explicit agent packs
- use dependency slices to explain which utterances and boundaries support a finding

All algorithms operate over SemanticStore handles and provenance-preserving views. A specialized view may be cached, but the store remains the logical authority. Procedural stages are allowed when they are simpler than forcing an algorithm into declarative primitives; the stage must declare semantic reads, writes and trace output.

## 12. Fluent pack shape

A pack is ordinary JavaScript, not a manifest object:

```js
import {
  ontology, entityKind, eventKind, role, relation,
  capability, domainPack, lexicalSignals, semanticSignals
} from "../../sdk/index.mjs";

const O = ontology("social-interaction", "1.0.0");
export const Interaction = O.entity(entityKind("Interaction"));
export const Request = O.entity(entityKind("Request"));
export const Consent = O.entity(entityKind("Consent"));

export const ontologyModule = O.seal();

export default domainPack("social-interaction")
  .ontology(ontologyModule)
  .recognize(
    lexicalSignals(/* pack-specific terms */),
    semanticSignals(/* pack-specific frame identities */)
  )
  .provide(capability("SpeechActClassificationFinding"))
  .provide(capability("PromiseClosureFinding"))
  .provide(capability("ConsentStructureFinding"))
  .targetKnowledgeLevel("lower-secondary")
  .seal();
```

The real implementation should define event/state frames, role constructors, lexicalizations, facts, circuits and tests in separate files as described below.

## 13. Required directory structure

```text
framework/packs/social-interaction/
  pack.mjs
  ontologies/
    speech-acts.ontology.mjs
    consent-boundaries.ontology.mjs
    cooperation.ontology.mjs
    conflict.ontology.mjs
    roles-power.ontology.mjs
    fairness.ontology.mjs
    communication-quality.ontology.mjs
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

- request versus order under different authority
- promise fulfilled/cancelled/unresolved
- consent granted, limited and withdrawn
- silence not treated as universal consent
- privacy disclosure scope
- cooperation with missing contribution
- conflict repair versus escalation
- fairness comparison mismatch
- ambiguous speech act
- dialogue CNL plan

Tests use Node's built-in test runner. Every finding test asserts evidence and trace dependencies. CNL tests assert frame slots and, where parsers exist, round-trip equivalence.

## 15. Limitations and extension policy

The pack must not label normal cultural variation as error, infer intent without evidence or give clinical/relationship advice. Consent and legality can require specialized law or safeguarding packs. Baseline findings should be structural and cautious.

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

Speech-act and event-frame modeling, runtime verification [LEU09], perspective contexts [KAMP11] and scope-aware normative reasoning.

## Appendix A. Minimum interaction-state model

### A.1 Speech acts

Implement assertion, question, request, order, offer, acceptance, refusal, promise, warning, threat, apology, thanks, accusation, denial and clarification. A classification includes speaker, recipient, propositional content, social role, context and confidence. Surface grammar alone is insufficient.

### A.2 Commitments

A promise or accepted agreement creates a `CommitmentState` with promisor, beneficiary, action, deadline, conditions and status: open, fulfilled, cancelled, renegotiated, violated or unknown. Monitor circuits consume interaction/event traces and explain unresolved commitments.

### A.3 Consent and permission

Represent proposer, consenting agent, action, scope, information basis, conditions, time, voluntariness indicators and withdrawal. The baseline should detect missing explicit consent when a rule requires it, but it must not universalize culture-specific conventions or infer legal validity without the law pack.

### A.4 Privacy and disclosure

Information has subject, holder, source, sensitivity class, intended audience and allowed use. A disclosure circuit checks audience and represented permission/expectation. It reports structural mismatch, not legal liability unless law-specific rules are loaded.

### A.5 Conflict and repair

Represent disagreement target, accusation, response, acknowledgment, apology, correction, negotiation and escalation. A repair sequence can be planned in CNL as: identify issue, state observation, ask/clarify, acknowledge, propose action and confirm outcome. This is a structural option, not mandatory advice.

### A.6 Cultural parameterization

Politeness, turn-taking and reciprocity norms are supplied by explicit culture/group profiles or treated as defeasible general expectations. The baseline pack must never report a universal violation solely because a local etiquette convention was not followed.

