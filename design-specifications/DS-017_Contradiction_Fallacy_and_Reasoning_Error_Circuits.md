# DS-017 — Contradiction, Fallacy and Reasoning-Error Circuits

**Status:** Normative predefined-pack specification  
**Pack identity:** `reasoning-errors`  
**Primary skills:** `nll-circuit, nll-ontology`  
**Depends on:** DS-000–DS-004  
**Testing:** DS-005  
**Evaluation:** DS-006


## 1. Role in the architecture

This pack is one modular source of ontology constructors, stable background knowledge, reusable circuits, CNL frames and intent-recognition metadata. It does not replace the common language ontology or the task-specific LongText interpretation. LongTextJS uses the pack's generated constructors to describe source claims; CircuitJS uses the same identities to query, derive and evaluate; IntentJS uses the pack descriptor to decide whether loading and execution are relevant.

The target breadth is comparable to a careful 12–14-year-old with ordinary lower-secondary education. The pack should be useful and conservative. It should recognize basic relationships and common errors, but it must report uncertainty rather than simulate expert knowledge. Every domain assertion is either a source-grounded claim, a declared pack fact, or a derived fact with provenance.

The pack is implemented entirely as `.mjs` modules with Node.js built-ins. It introduces no JSON or TypeScript artifacts and no third-party dependency. Ontologies, circuits and tests are written by coding agents using the SDK and the relevant nll-* skills.


## 2. Scope and non-goals

This pack specializes the logic and argumentation substrate to detect contradictions, unsupported inferences and common reasoning errors. Its findings are explanatory warnings, not accusations about a writer's competence or intent. It supports general prose, essays, policy, science and social analysis.

The pack must distinguish internal document reasoning from claims about the external world. It may flag a statement as inconsistent with loaded basic knowledge, but it should say which pack fact or relation was used. It must not upgrade a plausible heuristic into a universal law.

## 3. Conceptual and scientific basis

A reasoning error is rarely detectable from keywords alone. The pack represents arguments as claims, premises, conclusions, definitions, evidence relations, alternatives and scope. Formal fallacies can sometimes be checked exactly in a controlled fragment. Informal fallacies require contextual conditions and should often be reported as possible weaknesses with a trace explaining the pattern.

The practical ontology should favor event/state frames with typed roles over flat subject–predicate–object triples. Reified events make time, place, participants, causes, instruments, modality and evidence attachable without inventing a different predicate arity for every sentence. Claims and contexts remain separate from the situations they describe.

## 4. Ontology modules

The pack is divided into the following modules:

- argument-structure — claim, premise, conclusion, objection and response
- definition-use — term sense, lexicalization and scope
- evidence-authority — source, expertise, relevance and independence
- causality — temporal order, mechanism, confounder and alternative
- generalization — sample, population, quantifier and exception
- dialogue — opponent claim, reconstruction and reply
- error-patterns — formal and informal reasoning templates

The module boundaries are semantic and operational. A coding agent may split a large module further, but imports must preserve pack-qualified identities and avoid circular initialization.

## 5. Core concept inventory

- Argument, Premise, Conclusion and Inference
- EvidenceRelation and SourceAuthority
- DefinitionUse and TermSense
- CausalClaim, CorrelationClaim and AlternativeExplanation
- GeneralizationClaim, Sample and Population
- OpponentPosition and ReconstructedClaim
- ReasoningErrorPattern and Counterexample
- BurdenOfSupport and MissingPremise

Concepts should include English lexicalizations and may add other languages in separate lexicon modules. Lexical forms are recognition aids; they do not define semantic identity.

## 6. Canonical frames and relations

- Supports(premise, conclusion)
- Attacks(objection, claim)
- Defines(term, sense, scope)
- UsesSense(claim, term, sense)
- Cites(claim, source)
- GeneralizesFrom(sample, population)
- AttributesCause(cause, effect)
- RepresentsOpponent(reply, position)

Every frame declares role domains, ranges and cardinalities. Relations with inverses or symmetry properties register those laws in OntologyJS. Application-specific judgments remain in circuits.

## 7. Stable knowledge seed

The initial pack should encode a deliberately small, inspectable seed rather than an opaque encyclopaedia. Recommended seed categories are:

- a conclusion needs a represented support route or must be marked as assertion/opinion
- an authority citation is relevant only to the authority's domain and does not replace evidence for every claim
- correlation alone does not establish causation
- a binary choice is not exhaustive unless alternatives are excluded
- a definition should remain stable within its scope or the shift must be explicit
- a counterexample refutes a universal claim but not necessarily a typical claim
- criticism of a person does not by itself refute their proposition
- repeating a conclusion as a premise does not provide independent support

Pack facts are versioned and carry a provenance note such as `school-textbook-consensus`, `definition`, `unit-standard` or `design-convention`. Current, jurisdiction-dependent or contested facts are not part of the baseline pack.

## 8. Predefined circuit catalog

| Capability | Design |
|---|---|
| ContradictionClassifier | distinguishes direct contradiction, specialization, exception, different scope, different time and unresolved ambiguity |
| AffirmingConsequentFinding | detects the controlled form if A→B, B, therefore A when no biconditional is licensed |
| DenyingAntecedentFinding | detects if A→B, not A, therefore not B |
| CircularReasoningFinding | finds support cycles without independent grounding |
| EquivocationFinding | finds a conclusion depending on incompatible senses of a term |
| FalseDilemmaFinding | finds exhaustive-choice claims with represented alternatives not excluded |
| HastyGeneralizationFinding | compares sample, population, variation and quantifier |
| CorrelationCausationFinding | checks causal language for order, mechanism, intervention or alternatives |
| AdHominemFinding | detects when a personal attack is used as the only refutation of a proposition |
| AppealToAuthorityFinding | checks source domain relevance and whether authority is treated as conclusive |
| StrawManFinding | compares an opponent's grounded claim with the reconstructed target of a reply |
| SlipperySlopeFinding | checks whether an asserted chain has unsupported transition links |
| CompositionDivisionFinding | checks transfer of properties between parts and wholes |
| BaseRateAndSelectionWarning | flags ignored background rates or selected cases when represented |
| ArgumentRepairPlan | produces missing premise, qualifier, evidence and counterargument frames |

A circuit may use several methods. The table describes its semantic responsibility, not a rigid implementation class. For example, a consistency circuit may use indexed queries, a relation closure, a constraint network and a bounded symbolic witness search.

## 9. Controlled generation and planning

The pack contributes CNL frames and generation circuits for:

- claim-premise-conclusion maps
- CNL argument plans with objections and replies
- qualified rewrites that reduce overclaiming
- clarification questions about evidence, sample and intended sense
- minimal counterexample descriptions

Generated plans preserve the distinction between a pack fact, a source claim, an inferred relation and an open question. A downstream LLM may improve style, but it should receive the CNL plan plus immutable semantic constraints.

## 10. Intent recognition and profile behavior

Cheap and semantic intent signals include:

- argument markers such as therefore, because, proves, always, only, everyone or obviously
- citations, causal claims, generalizations and debate structure
- explicit request for contradiction, fallacy or reasoning review
- logic-basic propositions and evidence relations

The pack descriptor declares these signals through fluent functions. Signal matches only influence loading and ranking; they do not produce findings. When this pack is loaded under `all-compatible`, every circuit whose prerequisites are satisfied is eligible. Domain-specific profiles may choose a smaller circuit subset.

## 11. Algorithm and implementation guidance

- build a dependency graph of claims and evidence
- use SCC detection for circular support
- use typed term-sense identities for equivocation
- use finite logical templates for formal fallacies
- use quantifier/sample scope and counterexample search for generalization
- use dependency chains plus bounded model checking for slippery-slope transitions
- classify informal patterns with must/may conditions; avoid categorical labels when evidence is incomplete
- generate a backward slice for every warning

All algorithms operate over SemanticStore handles and provenance-preserving views. A specialized view may be cached, but the store remains the logical authority. Procedural stages are allowed when they are simpler than forcing an algorithm into declarative primitives; the stage must declare semantic reads, writes and trace output.

## 12. Fluent pack shape

A pack is ordinary JavaScript, not a manifest object:

```js
import {
  ontology, entityKind, eventKind, role, relation,
  capability, domainPack, lexicalSignals, semanticSignals
} from "../../sdk/index.mjs";

const O = ontology("reasoning-errors", "1.0.0");
export const Argument = O.entity(entityKind("Argument"));
export const EvidenceRelation = O.entity(entityKind("EvidenceRelation"));
export const DefinitionUse = O.entity(entityKind("DefinitionUse"));

export const ontologyModule = O.seal();

export default domainPack("reasoning-errors")
  .ontology(ontologyModule)
  .recognize(
    lexicalSignals(/* pack-specific terms */),
    semanticSignals(/* pack-specific frame identities */)
  )
  .provide(capability("ContradictionClassifier"))
  .provide(capability("AffirmingConsequentFinding"))
  .provide(capability("DenyingAntecedentFinding"))
  .targetKnowledgeLevel("lower-secondary")
  .seal();
```

The real implementation should define event/state frames, role constructors, lexicalizations, facts, circuits and tests in separate files as described below.

## 13. Required directory structure

```text
framework/packs/reasoning-errors/
  pack.mjs
  ontologies/
    argument-structure.ontology.mjs
    definition-use.ontology.mjs
    evidence-authority.ontology.mjs
    causality.ontology.mjs
    generalization.ontology.mjs
    dialogue.ontology.mjs
    error-patterns.ontology.mjs
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

- formal fallacy positive/negative pairs
- direct contradiction versus exception or time change
- support cycle with and without external premise
- stable versus shifted term sense
- two-choice case with an available third alternative
- small versus representative sample
- correlation with and without mechanism
- opponent quote versus distorted reconstruction
- part/whole property transfer
- argument repair CNL

Tests use Node's built-in test runner. Every finding test asserts evidence and trace dependencies. CNL tests assert frame slots and, where parsers exist, round-trip equivalence.

## 15. Limitations and extension policy

Informal fallacy labels are easily overused. The pack must report the exact structural condition and missing evidence, not merely a rhetorical name. Satire, dialogue, fiction and compressed argument may require interpretation alternatives. The pack does not decide whether a conclusion is socially desirable.

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

Argument graphs, formal logic, natural logic [MAC07], dependency SCCs, causal constraints and program slicing [WEI84].

## Appendix A. Reasoning-error pattern contract

Every error pattern must declare:

1. the structural premises required;
2. the conclusion or rhetorical move under review;
3. conditions that make the pattern valid rather than fallacious;
4. evidence/coverage requirements;
5. output status and cautious wording;
6. a minimal counterexample or missing-premise frame where possible.

### A.1 Formal patterns

Implement exact patterns for affirming the consequent, denying the antecedent, inconsistent conjunction, invalid quantifier conversion and modal substitution. These circuits require a controlled logical form and should return `NOT_APPLICABLE` when parsing is insufficient.

### A.2 Semantic contradiction classifier

Before reporting contradiction, compare subject identity, predicate sense, value, time, location, scope, modality, quantifier, source world, exception and specificity. Classify outcomes as direct contradiction, temporal change, scoped difference, specialized exception, disputed testimony, lexical ambiguity or unresolved.

### A.3 Informal patterns

Informal patterns—straw man, ad hominem, appeal to authority, false dilemma, slippery slope, hasty generalization, circular reasoning, equivocation, composition/division, base-rate neglect and survivorship/selection bias—should emit a structured weakness with explicit conditions. The user-facing explanation must not reduce to the fallacy name.

### A.4 Minimal repair generation

For each pattern, define repair operators such as add qualifier, add missing premise, identify alternative, provide representative evidence, stabilize definition, separate personal criticism from claim criticism, or label causal language as correlation. A bounded synthesis circuit selects the smallest semantically adequate repair frame, not a free-text rewrite.

