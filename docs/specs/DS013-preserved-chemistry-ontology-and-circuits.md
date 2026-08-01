---
id: DS013
title: Preserved Chemistry Ontology and Circuits
status: normative-implemented
owner: nllAgent architecture
summary: Preserves DS-011_Chemistry_Ontology_and_Circuits.md verbatim and records additive implementation alignment.
---

# DS013 — Preserved Chemistry Ontology and Circuits

## Introduction

This official specification preserves the complete original design contract. No wording from the source specification has been removed, shortened, or rewritten.

## Core Content

The following source specification is included verbatim from `design-specifications/DS-011_Chemistry_Ontology_and_Circuits.md`.

<!-- ORIGINAL SPECIFICATION START: DS-011_Chemistry_Ontology_and_Circuits.md -->
# DS-011 — Chemistry Ontology and Circuits

**Status:** Normative predefined-pack specification  
**Pack identity:** `chemistry-basic`  
**Primary skills:** `nll-ontology, nll-circuit`  
**Depends on:** DS-000–DS-004  
**Testing:** DS-005  
**Evaluation:** DS-006


## 1. Role in the architecture

This pack is one modular source of ontology constructors, stable background knowledge, reusable circuits, CNL frames and intent-recognition metadata. It does not replace the common language ontology or the task-specific LongText interpretation. LongTextJS uses the pack's generated constructors to describe source claims; CircuitJS uses the same identities to query, derive and evaluate; IntentJS uses the pack descriptor to decide whether loading and execution are relevant.

The target breadth is comparable to a careful 12–14-year-old with ordinary lower-secondary education. The pack should be useful and conservative. It should recognize basic relationships and common errors, but it must report uncertainty rather than simulate expert knowledge. Every domain assertion is either a source-grounded claim, a declared pack fact, or a derived fact with provenance.

The pack is implemented entirely as `.mjs` modules with Node.js built-ins. It introduces no JSON or TypeScript artifacts and no third-party dependency. Ontologies, circuits and tests are written by coding agents using the SDK and the relevant nll-* skills.


## 2. Scope and non-goals

This pack covers atoms, elements, compounds, mixtures, bonding at a basic descriptive level, chemical reactions, conservation, states of matter, solutions, acids/bases and ordinary laboratory description. It is not an expert reaction predictor or safety authority.

The pack must distinguish internal document reasoning from claims about the external world. It may flag a statement as inconsistent with loaded basic knowledge, but it should say which pack fact or relation was used. It must not upgrade a plausible heuristic into a universal law.

## 3. Conceptual and scientific basis

Chemical text requires strict category distinctions: element versus atom, compound versus mixture, physical versus chemical change, substance versus sample, symbol versus substance. Reactions are frames with reactants, products, coefficients, conditions and evidence. The pack uses finite counting and quantity relations for simple equations while preserving the difference between a written formula and the material it denotes.

The practical ontology should favor event/state frames with typed roles over flat subject–predicate–object triples. Reified events make time, place, participants, causes, instruments, modality and evidence attachable without inventing a different predicate arity for every sentence. Claims and contexts remain separate from the situations they describe.

## 4. Ontology modules

The pack is divided into the following modules:

- matter-substances — samples, pure substances, elements, compounds and mixtures
- particles — atom, molecule and ion
- formulae — symbols, chemical formulae and simple composition
- reactions — reactants, products, coefficients, conditions and observations
- states-solutions — solid, liquid, gas, dissolution, concentration and separation
- acids-bases — basic pH categories and neutralization
- laboratory-description — measurement, container, procedure and observation

The module boundaries are semantic and operational. A coding agent may split a large module further, but imports must preserve pack-qualified identities and avoid circular initialization.

## 5. Core concept inventory

- MaterialSample, PureSubstance, Element, Compound and Mixture
- Atom, Molecule and Ion
- ChemicalSymbol and ChemicalFormula
- ChemicalReaction, Reactant and Product
- PhysicalChange and ChemicalChange
- PhaseState, Solution, Solute and Solvent
- Acidic, Neutral and Basic state
- LaboratoryObservation and ReactionCondition

Concepts should include English lexicalizations and may add other languages in separate lexicon modules. Lexical forms are recognition aids; they do not define semantic identity.

## 6. Canonical frames and relations

- ComposedOf(substance, element, count)
- ContainsSample(sample, substance)
- Reacts(reactants, products, conditions)
- Dissolves(solute, solvent)
- ChangesPhase(sample, from, to)
- Separates(method, mixture, components)
- HasPH(solution, value)
- ObservedAs(reaction, observation)

Every frame declares role domains, ranges and cardinalities. Relations with inverses or symmetry properties register those laws in OntologyJS. Application-specific judgments remain in circuits.

## 7. Stable knowledge seed

The initial pack should encode a deliberately small, inspectable seed rather than an opaque encyclopaedia. Recommended seed categories are:

- chemical symbols and formula syntax for a limited school-level element set
- an element contains one kind of atom; a compound contains elements in a defined composition; a mixture is not a single compound
- physical changes do not by themselves create a new chemical substance
- simple reaction equations conserve atom counts when balanced
- mass is conserved in a closed ordinary chemical system at school-model precision
- solutions contain solute and solvent; dissolving is not automatically a chemical reaction
- pH below, at and above seven is classified as acidic, neutral and basic in the basic aqueous model
- formulas and names are representations, not samples

Pack facts are versioned and carry a provenance note such as `school-textbook-consensus`, `definition`, `unit-standard` or `design-convention`. Current, jurisdiction-dependent or contested facts are not part of the baseline pack.

## 8. Predefined circuit catalog

| Capability | Design |
|---|---|
| ChemicalCategoryFinding | detects element/compound/mixture and atom/molecule category errors |
| FormulaCompositionFinding | checks simple formula atom counts and name/formula compatibility where encoded |
| ReactionBalanceFinding | checks conservation of element counts in simple equations |
| PhysicalChemicalChangeFinding | checks whether a described change is incorrectly classified under supplied observations |
| SolutionRelationFinding | checks solute/solvent/concentration relations and simple dilution claims |
| AcidBaseFinding | checks basic pH classification and simple neutralization statements |
| LaboratorySequenceFinding | checks stated procedure order, measurements and observation/result separation |
| ChemistryExplanationPlan | produces substances, process, evidence, equation and limitation frames |

A circuit may use several methods. The table describes its semantic responsibility, not a rigid implementation class. For example, a consistency circuit may use indexed queries, a relation closure, a constraint network and a bounded symbolic witness search.

## 9. Controlled generation and planning

The pack contributes CNL frames and generation circuits for:

- reaction explanation plans separating observation from interpretation
- balanced-equation worked frames
- classification tables for substances and mixtures
- laboratory report plans with materials, method, observation, result and safety placeholder
- clarification requests for missing conditions or ambiguous substance names

Generated plans preserve the distinction between a pack fact, a source claim, an inferred relation and an open question. A downstream LLM may improve style, but it should receive the CNL plan plus immutable semantic constraints.

## 10. Intent recognition and profile behavior

Cheap and semantic intent signals include:

- chemical symbols, formulae, reaction arrows, pH, solution or laboratory terms
- textbook chemistry sections and experiment reports
- requests to balance, classify or explain a chemical change
- material/substance claims requiring chemistry concepts

The pack descriptor declares these signals through fluent functions. Signal matches only influence loading and ranking; they do not produce findings. When this pack is loaded under `all-compatible`, every circuit whose prerequisites are satisfied is eligible. Domain-specific profiles may choose a smaller circuit subset.

## 11. Algorithm and implementation guidance

- parse a constrained subset of chemical formulas into element-count maps
- balance only small integer equations using bounded linear search or rational null-space routines implemented in project code
- use exact atom-count constraints and return unsupported for formulas outside the parser
- keep sample identity separate from substance kind
- use state transitions for phase and reaction processes
- do not infer a reaction from color or temperature change alone; treat observations as evidence with alternative explanations
- reuse quantity/unit primitives for mass, volume and concentration

All algorithms operate over SemanticStore handles and provenance-preserving views. A specialized view may be cached, but the store remains the logical authority. Procedural stages are allowed when they are simpler than forcing an algorithm into declarative primitives; the stage must declare semantic reads, writes and trace output.

## 12. Fluent pack shape

A pack is ordinary JavaScript, not a manifest object:

```js
import {
  ontology, entityKind, eventKind, role, relation,
  capability, domainPack, lexicalSignals, semanticSignals
} from "../../sdk/index.mjs";

const O = ontology("chemistry-basic", "1.0.0");
export const MaterialSample = O.entity(entityKind("MaterialSample"));
export const Atom = O.entity(entityKind("Atom"));
export const ChemicalFormula = O.entity(entityKind("ChemicalFormula"));

export const ontologyModule = O.seal();

export default domainPack("chemistry-basic")
  .ontology(ontologyModule)
  .recognize(
    lexicalSignals(/* pack-specific terms */),
    semanticSignals(/* pack-specific frame identities */)
  )
  .provide(capability("ChemicalCategoryFinding"))
  .provide(capability("FormulaCompositionFinding"))
  .provide(capability("ReactionBalanceFinding"))
  .targetKnowledgeLevel("lower-secondary")
  .seal();
```

The real implementation should define event/state frames, role constructors, lexicalizations, facts, circuits and tests in separate files as described below.

## 13. Required directory structure

```text
framework/packs/chemistry-basic/
  pack.mjs
  ontologies/
    matter-substances.ontology.mjs
    particles.ontology.mjs
    formulae.ontology.mjs
    reactions.ontology.mjs
    states-solutions.ontology.mjs
    acids-bases.ontology.mjs
    laboratory-description.ontology.mjs
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

- element versus compound versus mixture
- atom/molecule distinction
- simple formula atom counts
- balanced and unbalanced equations
- closed-system mass statement
- dissolving versus reacting
- pH classification
- observation versus conclusion
- unsupported advanced formula
- laboratory CNL report plan

Tests use Node's built-in test runner. Every finding test asserts evidence and trace dependencies. CNL tests assert frame slots and, where parsers exist, round-trip equivalence.

## 15. Limitations and extension policy

The pack should not generate hazardous experimental instructions, predict complex reactions, infer toxicity or give medical advice. It covers a controlled school-level vocabulary. Unknown substances, ambiguous names and advanced equations require specialized modules or produce `BLOCKED_ONTOLOGY`.

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

Typed symbolic expressions, finite constraint solving, conservation checks and school-level chemistry ontology design.

## Appendix A. Minimum chemistry parser and knowledge inventory

### A.1 Element and formula subset

The baseline should include names and symbols for the common school set: H, He, C, N, O, F, Ne, Na, Mg, Al, Si, P, S, Cl, Ar, K, Ca, Fe, Cu, Zn, Ag and Au. More elements may be added through data-like `.mjs` fact modules. The formula parser supports element symbols, integer subscripts and parenthesized groups. Hydrates, charges and complex coordination syntax may initially return unsupported diagnostics.

### A.2 Formula parser algorithm

Scan left to right. Parse an uppercase letter with optional lowercase letter as an element symbol, followed by an optional positive integer count. On `(` recursively parse a group until `)`, then multiply counts by the following integer. Accumulate a map from element identity to BigInt count. Reject unknown symbols, zero counts, unmatched parentheses and trailing invalid tokens. Preserve the original formula string as provenance.

### A.3 Reaction balancing

For small equations, build an element-by-species integer matrix. Find a nonzero rational null-space vector through exact elimination, scale to the least common positive integers and verify all coefficients. If the null space has dimension greater than one or coefficients exceed a configured bound, return `BLOCKED_METHOD` rather than guessing.

### A.4 Matter classification

Implement explicit distinctions among sample, substance kind, element, compound, homogeneous mixture, heterogeneous mixture, solution, atom, molecule and ion. A source may use an everyday term loosely; findings should explain the formal category rather than merely label it wrong.

### A.5 Reactions and evidence

Reaction observations include gas production, precipitate, color change, energy change and new odor, but no single observation proves a reaction in isolation. A circuit can report that observations are compatible with chemical change and ask for stronger evidence.

### A.6 Laboratory text

Procedure circuits should track materials, quantities, containers, actions, observations and conclusions. They should not synthesize hazardous laboratory steps. Safety content is preserved and checked for internal sequence only when present.

<!-- ORIGINAL SPECIFICATION END: DS-011_Chemistry_Ontology_and_Circuits.md -->

### Additive implementation alignment

The corresponding executable pack is installed under framework/packs and includes ontology modules, a sealed pack descriptor, capability-providing circuits, CNL support, lexical/semantic intent signals, and isolated ontology/circuit/intent/CNL tests. Pack 5 of the preserved domain sequence is also loadable through framework/packs/index.mjs.

## Decisions & Questions

### Question #1: Why is the original specification embedded instead of replaced by a normalized rewrite?

Response: Source fidelity is an explicit project requirement. The embedded body remains byte-for-byte identical to the original file; official metadata, implementation alignment, and decision records are additive.

### Question #2: Which text wins if an additive note appears narrower than the preserved contract?

Response: The preserved normative requirement remains authoritative. An implementation-alignment note reports confirmed current behavior and cannot silently weaken the original contract.



## Conclusion

Future changes must preserve the embedded source contract, extend implementation and tests to meet it, and record contract-shaping rationale in numbered entries here.
