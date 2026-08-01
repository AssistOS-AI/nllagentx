---
id: DS016
title: Preserved Anthropology Ontology and Circuits
status: normative-implemented
owner: nllAgent architecture
summary: Preserves DS-014_Anthropology_Ontology_and_Circuits.md verbatim and records additive implementation alignment.
---

# DS016 — Preserved Anthropology Ontology and Circuits

## Introduction

This official specification preserves the complete original design contract. No wording from the source specification has been removed, shortened, or rewritten.

## Core Content

The following source specification is included verbatim from `design-specifications/DS-014_Anthropology_Ontology_and_Circuits.md`.

<!-- ORIGINAL SPECIFICATION START: DS-014_Anthropology_Ontology_and_Circuits.md -->
# DS-014 — Anthropology Ontology and Circuits

**Status:** Normative predefined-pack specification  
**Pack identity:** `anthropology-basic`  
**Primary skills:** `nll-ontology, nll-circuit`  
**Depends on:** DS-000–DS-004  
**Testing:** DS-005  
**Evaluation:** DS-006


## 1. Role in the architecture

This pack is one modular source of ontology constructors, stable background knowledge, reusable circuits, CNL frames and intent-recognition metadata. It does not replace the common language ontology or the task-specific LongText interpretation. LongTextJS uses the pack's generated constructors to describe source claims; CircuitJS uses the same identities to query, derive and evaluate; IntentJS uses the pack descriptor to decide whether loading and execution are relevant.

The target breadth is comparable to a careful 12–14-year-old with ordinary lower-secondary education. The pack should be useful and conservative. It should recognize basic relationships and common errors, but it must report uncertainty rather than simulate expert knowledge. Every domain assertion is either a source-grounded claim, a declared pack fact, or a derived fact with provenance.

The pack is implemented entirely as `.mjs` modules with Node.js built-ins. It introduces no JSON or TypeScript artifacts and no third-party dependency. Ontologies, circuits and tests are written by coding agents using the SDK and the relevant nll-* skills.


## 2. Scope and non-goals

This pack covers elementary cultural anthropology: culture, practice, norm, ritual, kinship, subsistence, exchange, material culture, symbolism, identity, diffusion and field evidence. It helps analyze claims about human groups without reducing cultural patterns to universal laws.

The pack must distinguish internal document reasoning from claims about the external world. It may flag a statement as inconsistent with loaded basic knowledge, but it should say which pack fact or relation was used. It must not upgrade a plausible heuristic into a universal law.

## 3. Conceptual and scientific basis

Anthropological reasoning is contextual and comparative. A practice belongs to a group, time, place and situation; an observer's category may differ from participants' categories; evidence may come from observation, testimony, artifact or historical source. The ontology foregrounds context, variation and emic/etic perspective. Circuits target overgeneralization, category projection and missing evidence rather than judging a culture by one normative standard.

The practical ontology should favor event/state frames with typed roles over flat subject–predicate–object triples. Reified events make time, place, participants, causes, instruments, modality and evidence attachable without inventing a different predicate arity for every sentence. Claims and contexts remain separate from the situations they describe.

## 4. Ontology modules

The pack is divided into the following modules:

- culture-practice — learned patterns, practices, values and symbols
- norm-ritual — expectations, sanctions, rituals and life events
- kinship-household — relation, descent, marriage, household and caregiving
- subsistence-exchange — production, distribution, reciprocity and trade
- material-culture — artifact, technology, clothing, food and built environment
- identity-perspective — group identity, role, emic/etic category and observer position
- evidence-change — field observation, testimony, history, diffusion and adaptation

The module boundaries are semantic and operational. A coding agent may split a large module further, but imports must preserve pack-qualified identities and avoid circular initialization.

## 5. Core concept inventory

- CulturalGroup, Community and Population
- CulturalPractice, Norm, Value and Symbol
- Ritual and LifeEvent
- KinRelation, Household and DescentRelation
- SubsistenceStrategy and ExchangePractice
- MaterialCultureArtifact
- IdentityCategory and SocialRole
- EmicConcept, EticConcept and EvidenceSource

Concepts should include English lexicalizations and may add other languages in separate lexicon modules. Lexical forms are recognition aids; they do not define semantic identity.

## 6. Canonical frames and relations

- PracticedBy(practice, group, context)
- ExpectedBy(norm, group, scope)
- Symbolizes(symbol, meaning, context)
- RelatedBy(personA, personB, kinRelation)
- ExchangedBetween(item, parties, institution)
- ObservedBy(source, practice)
- CategorizedAs(observer, phenomenon, concept)
- ChangesThrough(practice, process, time)

Every frame declares role domains, ranges and cardinalities. Relations with inverses or symmetry properties register those laws in OntologyJS. Application-specific judgments remain in circuits.

## 7. Stable knowledge seed

The initial pack should encode a deliberately small, inspectable seed rather than an opaque encyclopaedia. Recommended seed categories are:

- culture is learned and shared unevenly rather than genetically fixed
- groups contain variation and disagreement
- a norm may be ideal, descriptive or contested
- kinship categories vary and should not be projected from one system without evidence
- similar practices can have different meanings in different contexts
- an observer's description and participant meaning are distinct
- cultural change can arise through internal innovation, interaction, diffusion and broader conditions
- one case does not establish a universal human pattern

Pack facts are versioned and carry a provenance note such as `school-textbook-consensus`, `definition`, `unit-standard` or `design-convention`. Current, jurisdiction-dependent or contested facts are not part of the baseline pack.

## 8. Predefined circuit catalog

| Capability | Design |
|---|---|
| CulturalOvergeneralizationFinding | detects claims that move from one group/case to all humans without support |
| ContextLossFinding | detects a practice or symbol interpreted without time/place/group context |
| EmicEticConfusionFinding | distinguishes participant categories from analyst categories |
| KinshipProjectionFinding | warns when one kinship vocabulary is assumed universal |
| NormPracticeConfusionFinding | distinguishes stated norm, observed practice and individual action |
| EvidencePerspectiveFinding | tracks observer, method and source limitations |
| CulturalChangeFinding | checks simplistic single-cause accounts against represented alternatives |
| EthnographicExplanationPlan | produces context, practice, participant meaning, evidence, variation and limitation frames |

A circuit may use several methods. The table describes its semantic responsibility, not a rigid implementation class. For example, a consistency circuit may use indexed queries, a relation closure, a constraint network and a bounded symbolic witness search.

## 9. Controlled generation and planning

The pack contributes CNL frames and generation circuits for:

- comparative cultural descriptions
- ethnographic observation plans
- context-rich explanations of practices
- questions about group, time, place, observer and participant meaning
- CNL sections separating description, interpretation and limitation

Generated plans preserve the distinction between a pack fact, a source claim, an inferred relation and an open question. A downstream LLM may improve style, but it should receive the CNL plan plus immutable semantic constraints.

## 10. Intent recognition and profile behavior

Cheap and semantic intent signals include:

- culture, ritual, custom, kinship, tribe/community, tradition or identity terms
- comparative descriptions of human groups
- claims about universal human behavior
- anthropological, historical or ethnographic text

The pack descriptor declares these signals through fluent functions. Signal matches only influence loading and ranking; they do not produce findings. When this pack is loaded under `all-compatible`, every circuit whose prerequisites are satisfied is eligible. Domain-specific profiles may choose a smaller circuit subset.

## 11. Algorithm and implementation guidance

- represent every cultural-practice claim with group, time/place and evidence scope where available
- use quantifier circuits to distinguish some, many, typical and all
- track observer perspective and participant attribution as separate contexts
- use subtype and analogy cautiously; similarity is not identity of meaning
- use dependency slices to expose which observations support an interpretation
- emit overgeneralization warnings rather than categorical refutations when coverage is incomplete

All algorithms operate over SemanticStore handles and provenance-preserving views. A specialized view may be cached, but the store remains the logical authority. Procedural stages are allowed when they are simpler than forcing an algorithm into declarative primitives; the stage must declare semantic reads, writes and trace output.

## 12. Fluent pack shape

A pack is ordinary JavaScript, not a manifest object:

```js
import {
  ontology, entityKind, eventKind, role, relation,
  capability, domainPack, lexicalSignals, semanticSignals
} from "../../sdk/index.mjs";

const O = ontology("anthropology-basic", "1.0.0");
export const CulturalGroup = O.entity(entityKind("CulturalGroup"));
export const CulturalPractice = O.entity(entityKind("CulturalPractice"));
export const Ritual = O.entity(entityKind("Ritual"));

export const ontologyModule = O.seal();

export default domainPack("anthropology-basic")
  .ontology(ontologyModule)
  .recognize(
    lexicalSignals(/* pack-specific terms */),
    semanticSignals(/* pack-specific frame identities */)
  )
  .provide(capability("CulturalOvergeneralizationFinding"))
  .provide(capability("ContextLossFinding"))
  .provide(capability("EmicEticConfusionFinding"))
  .targetKnowledgeLevel("lower-secondary")
  .seal();
```

The real implementation should define event/state frames, role constructors, lexicalizations, facts, circuits and tests in separate files as described below.

## 13. Required directory structure

```text
framework/packs/anthropology-basic/
  pack.mjs
  ontologies/
    culture-practice.ontology.mjs
    norm-ritual.ontology.mjs
    kinship-household.ontology.mjs
    subsistence-exchange.ontology.mjs
    material-culture.ontology.mjs
    identity-perspective.ontology.mjs
    evidence-change.ontology.mjs
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

- one-group-to-all-humans generalization
- norm versus observed practice
- participant versus observer meaning
- kinship category mismatch
- symbol interpreted outside context
- within-group variation
- multiple pathways of cultural change
- ethnographic CNL plan

Tests use Node's built-in test runner. Every finding test asserts evidence and trace dependencies. CNL tests assert frame slots and, where parsers exist, round-trip equivalence.

## 15. Limitations and extension policy

The pack must not encode stereotypes, rank cultures or treat simplified categories as fixed essences. It provides structural concepts, not a catalogue of cultural judgments. Detailed regional knowledge belongs in explicit, sourced packs.

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

Contextual semantics, discourse perspective [KAMP11], provenance and scope-aware comparative reasoning.

## Appendix A. Minimum contextual-analysis inventory

### A.1 Context tuple

Every cultural-practice assertion should be capable of carrying a tuple of group/community, place, period, situation, participant category, observer/source and evidence type. Missing tuple elements do not invalidate the claim, but they limit generalization and comparison.

### A.2 Norm, practice and value

Encode `StatedNorm`, `ObservedPractice`, `ReportedValue`, `IndividualAction` and `AnalystInterpretation` as separate claim types. Circuits should not infer observed frequency from a stated ideal or infer a shared value from one individual statement.

### A.3 Kinship and household

Provide abstract relations—parent, child, sibling, spouse/partner, descent, household membership, caregiving and alliance—without assuming one terminology or residence pattern. Domain-specific packs can add local categories and lexicalizations.

### A.4 Exchange and subsistence

Represent production, collection, cultivation, herding, wage labor, trade, gift, reciprocity and redistribution as frames with participants and institutional context. Do not assign moral ranking. Similar surface exchanges can have different social meanings.

### A.5 Comparison circuits

A comparison requires aligned dimensions and compatible evidence. The circuit should generate a table of context, practice, participant meaning, observer category, variation and source. It must report when categories are not commensurable rather than force a binary comparison.

### A.6 Bias and universalization checks

Implement circuits for ethnocentric projection, timeless tradition claims, homogeneous-group assumptions, biological essentialism, observer-category reification and single-cause cultural explanation. Findings should be phrased as methodological concerns with evidence slices.

<!-- ORIGINAL SPECIFICATION END: DS-014_Anthropology_Ontology_and_Circuits.md -->

### Additive implementation alignment

The corresponding executable pack is installed under framework/packs and includes ontology modules, a sealed pack descriptor, capability-providing circuits, CNL support, lexical/semantic intent signals, and isolated ontology/circuit/intent/CNL tests. Pack 8 of the preserved domain sequence is also loadable through framework/packs/index.mjs.

## Decisions & Questions

### Question #1: Why is the original specification embedded instead of replaced by a normalized rewrite?

Response: Source fidelity is an explicit project requirement. The embedded body remains byte-for-byte identical to the original file; official metadata, implementation alignment, and decision records are additive.

### Question #2: Which text wins if an additive note appears narrower than the preserved contract?

Response: The preserved normative requirement remains authoritative. An implementation-alignment note reports confirmed current behavior and cannot silently weaken the original contract.



## Conclusion

Future changes must preserve the embedded source contract, extend implementation and tests to meet it, and record contract-shaping rationale in numbered entries here.
