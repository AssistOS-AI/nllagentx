# DS-016 — Elementary Logic Ontology and Circuits

**Status:** Normative predefined-pack specification  
**Pack identity:** `logic-basic`  
**Primary skills:** `nll-ontology, nll-circuit`  
**Depends on:** DS-000–DS-004  
**Testing:** DS-005  
**Evaluation:** DS-006


## 1. Role in the architecture

This pack is one modular source of ontology constructors, stable background knowledge, reusable circuits, CNL frames and intent-recognition metadata. It does not replace the common language ontology or the task-specific LongText interpretation. LongTextJS uses the pack's generated constructors to describe source claims; CircuitJS uses the same identities to query, derive and evaluate; IntentJS uses the pack descriptor to decide whether loading and execution are relevant.

The target breadth is comparable to a careful 12–14-year-old with ordinary lower-secondary education. The pack should be useful and conservative. It should recognize basic relationships and common errors, but it must report uncertainty rather than simulate expert knowledge. Every domain assertion is either a source-grounded claim, a declared pack fact, or a derived fact with provenance.

The pack is implemented entirely as `.mjs` modules with Node.js built-ins. It introduces no JSON or TypeScript artifacts and no third-party dependency. Ontologies, circuits and tests are written by coding agents using the SDK and the relevant nll-* skills.


## 2. Scope and non-goals

This pack provides elementary propositional, predicate, quantifier, modal and natural-logic structures used by every other domain. It checks local entailment, contradiction and consistency over explicitly materialized propositions. It is not a complete first-order theorem prover.

The pack must distinguish internal document reasoning from claims about the external world. It may flag a statement as inconsistent with loaded basic knowledge, but it should say which pack fact or relation was used. It must not upgrade a plausible heuristic into a universal law.

## 3. Conceptual and scientific basis

Logical form is represented through proposition terms with scope, polarity, quantification and modality. The pack supports a controlled fragment selected for practical text analysis: conjunction, disjunction, implication, equivalence, negation, finite quantification, type predicates, equality and basic modal relations. Natural-logic relations help compare phrases without translating every sentence to unrestricted logic.

The practical ontology should favor event/state frames with typed roles over flat subject–predicate–object triples. Reified events make time, place, participants, causes, instruments, modality and evidence attachable without inventing a different predicate arity for every sentence. Claims and contexts remain separate from the situations they describe.

## 4. Ontology modules

The pack is divided into the following modules:

- propositions — atoms, connectives and truth status
- predicates-terms — variables, constants, types and relations
- quantifiers — all, some, none, exactly, at-least and at-most
- modality — necessary, possible, permitted, required and believed
- natural-logic — entailment, equivalence, alternation and contradiction
- proof-steps — premise, rule, conclusion and countermodel
- four-valued — support, refutation, unknown and conflict

The module boundaries are semantic and operational. A coding agent may split a large module further, but imports must preserve pack-qualified identities and avoid circular initialization.

## 5. Core concept inventory

- Proposition, AtomicProposition and CompoundProposition
- Predicate, Term, Variable and Constant
- Universal, Existential and CardinalityQuantifier
- Implication, Equivalence, Conjunction, Disjunction and Negation
- ModalProposition and ModalOperator
- EntailmentRelation and ContradictionRelation
- Premise, Conclusion, ProofStep and Countermodel
- LogicValue — TRUE, FALSE, UNKNOWN, CONFLICT

Concepts should include English lexicalizations and may add other languages in separate lexicon modules. Lexical forms are recognition aids; they do not define semantic identity.

## 6. Canonical frames and relations

- And, Or, Not, Implies and Equivalent
- ForAll(variable, domain, proposition)
- Exists(variable, domain, proposition)
- Exactly, AtLeast and AtMost
- Necessary, Possible, Obligatory, Permitted and Believed
- Entails(propositionA, propositionB)
- Contradicts(propositionA, propositionB)
- UsesRule(step, rule)

Every frame declares role domains, ranges and cardinalities. Relations with inverses or symmetry properties register those laws in OntologyJS. Application-specific judgments remain in circuits.

## 7. Stable knowledge seed

The initial pack should encode a deliberately small, inspectable seed rather than an opaque encyclopaedia. Recommended seed categories are:

- truth tables for elementary connectives extended to four-valued evidence logic
- modus ponens and modus tollens as licensed local rules
- universal instantiation over represented domain members
- existential witness requirements
- quantifier negation in the supported fragment
- equality substitution under compatible type/context
- basic natural-logic monotonicity relations for typed noun phrases
- modal operators are not interchangeable: possible does not imply actual; required does not imply performed

Pack facts are versioned and carry a provenance note such as `school-textbook-consensus`, `definition`, `unit-standard` or `design-convention`. Current, jurisdiction-dependent or contested facts are not part of the baseline pack.

## 8. Predefined circuit catalog

| Capability | Design |
|---|---|
| DirectContradictionFinding | finds proposition and scoped negation under compatible terms and context |
| LocalEntailmentFinding | checks supported implication chains in the controlled fragment |
| QuantifierScopeFinding | detects all/some/none and negation-scope mismatches |
| ModalConfusionFinding | detects possible/actual, permitted/required and believed/known substitutions |
| EqualitySubstitutionFinding | checks substitution across same-identity terms and contexts |
| ConsistencySetCircuit | uses bounded constraint search to find a model or a small inconsistent core |
| ProofStepCircuit | checks local inference steps and returns the first unsupported step |
| LogicExplanationPlan | produces premises, rule, conclusion, assumptions and counterexample frames |

A circuit may use several methods. The table describes its semantic responsibility, not a rigid implementation class. For example, a consistency circuit may use indexed queries, a relation closure, a constraint network and a bounded symbolic witness search.

## 9. Controlled generation and planning

The pack contributes CNL frames and generation circuits for:

- formalized argument skeletons
- CNL statements with explicit quantifiers and modality
- counterexample frames
- clarification questions for scope and reference
- proof-step explanations at lower-secondary level

Generated plans preserve the distinction between a pack fact, a source claim, an inferred relation and an open question. A downstream LLM may improve style, but it should receive the CNL plan plus immutable semantic constraints.

## 10. Intent recognition and profile behavior

Cheap and semantic intent signals include:

- all/some/none, if/then, only, unless, must/may/cannot or contradiction terms
- argumentative, legal, scientific or instructional text
- requests to check consistency, implication or logic
- structured propositions produced by other packs

The pack descriptor declares these signals through fluent functions. Signal matches only influence loading and ranking; they do not produce findings. When this pack is loaded under `all-compatible`, every circuit whose prerequisites are satisfied is eligible. Domain-specific profiles may choose a smaller circuit subset.

## 11. Algorithm and implementation guidance

- implement four-valued tables explicitly and test algebraic laws
- compile finite propositional fragments to the internal Boolean/finite-domain solver
- use typed unification for predicate terms
- bound quantifier expansion to represented finite domains and report open-domain uncertainty
- use natural-logic relations only for registered lexical/ontology monotonicity
- produce minimal inconsistent cores by deletion-based minimization over small premise sets
- retain modal and interpretation scope in every logical comparison

All algorithms operate over SemanticStore handles and provenance-preserving views. A specialized view may be cached, but the store remains the logical authority. Procedural stages are allowed when they are simpler than forcing an algorithm into declarative primitives; the stage must declare semantic reads, writes and trace output.

## 12. Fluent pack shape

A pack is ordinary JavaScript, not a manifest object:

```js
import {
  ontology, entityKind, eventKind, role, relation,
  capability, domainPack, lexicalSignals, semanticSignals
} from "../../sdk/index.mjs";

const O = ontology("logic-basic", "1.0.0");
export const Proposition = O.entity(entityKind("Proposition"));
export const Predicate = O.entity(entityKind("Predicate"));
export const UniversalQuantifier = O.entity(entityKind("UniversalQuantifier"));

export const ontologyModule = O.seal();

export default domainPack("logic-basic")
  .ontology(ontologyModule)
  .recognize(
    lexicalSignals(/* pack-specific terms */),
    semanticSignals(/* pack-specific frame identities */)
  )
  .provide(capability("DirectContradictionFinding"))
  .provide(capability("LocalEntailmentFinding"))
  .provide(capability("QuantifierScopeFinding"))
  .targetKnowledgeLevel("lower-secondary")
  .seal();
```

The real implementation should define event/state frames, role constructors, lexicalizations, facts, circuits and tests in separate files as described below.

## 13. Required directory structure

```text
framework/packs/logic-basic/
  pack.mjs
  ontologies/
    propositions.ontology.mjs
    predicates-terms.ontology.mjs
    quantifiers.ontology.mjs
    modality.ontology.mjs
    natural-logic.ontology.mjs
    proof-steps.ontology.mjs
    four-valued.ontology.mjs
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

- truth-table cases including UNKNOWN/CONFLICT
- modus ponens and invalid converse
- all/some/none relations
- negation scope
- possible versus actual
- permission versus obligation
- finite consistency model and inconsistent core
- same words in incompatible contexts not treated as contradiction
- logic CNL plan

Tests use Node's built-in test runner. Every finding test asserts evidence and trace dependencies. CNL tests assert frame slots and, where parsers exist, round-trip equivalence.

## 15. Limitations and extension policy

The pack does not decide unrestricted first-order validity, resolve all natural-language scope, or infer missing world knowledge. A proof can be valid relative to an incorrect LongText interpretation. Results must retain source and interpretation provenance.

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

Four-valued logic [BEL77], controlled natural logic, finite constraint solving and local proof replay.

## Appendix A. Supported logical fragment

### A.1 Propositional core

Support atoms, negation, conjunction, disjunction, implication and equivalence. The concrete evaluator uses explicit four-valued tables. For bounded satisfiability, translate supported propositions to the internal Boolean solver while keeping source/provenance maps.

### A.2 Predicate and quantifier core

Support unary and binary typed predicates, equality, finite universal/existential quantification and cardinality constraints. Quantifiers range only over an explicit finite set or a closed coverage set. Open-domain universal claims cannot be exhaustively verified from absence.

### A.3 Natural-logic relations

Represent equivalence, forward entailment, reverse entailment, alternation, contradiction, cover and independence between typed expressions. Monotonicity signatures are registered for selected quantifiers and relations. The engine must not invent lexical entailments; they come from ontology subtype or explicit lexical knowledge.

### A.4 Modal core

Separate alethic possibility/necessity, deontic permission/obligation/prohibition, epistemic belief/knowledge and source-reported modality. Cross-modal inference is prohibited unless a circuit declares a rule.

### A.5 Minimal proof objects

Proof steps include premise reference, rule identity, substitutions, conclusion and side conditions. Required replay rules are conjunction introduction/elimination, disjunction introduction, modus ponens, modus tollens, finite universal instantiation, existential witness, equality substitution, subtype inheritance and contradiction from a proposition plus scoped negation.

### A.6 Inconsistent but non-trivial contexts

The four-valued layer allows both support and refutation without making every proposition derivable. Circuits should report conflict and isolate the inconsistent slice. Classical explosion is not the default semantic behavior for documents.

