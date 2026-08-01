# DS-012 — Biology Ontology and Circuits

**Status:** Normative predefined-pack specification  
**Pack identity:** `biology-basic`  
**Primary skills:** `nll-ontology, nll-circuit`  
**Depends on:** DS-000–DS-004  
**Testing:** DS-005  
**Evaluation:** DS-006


## 1. Role in the architecture

This pack is one modular source of ontology constructors, stable background knowledge, reusable circuits, CNL frames and intent-recognition metadata. It does not replace the common language ontology or the task-specific LongText interpretation. LongTextJS uses the pack's generated constructors to describe source claims; CircuitJS uses the same identities to query, derive and evaluate; IntentJS uses the pack descriptor to decide whether loading and execution are relevant.

The target breadth is comparable to a careful 12–14-year-old with ordinary lower-secondary education. The pack should be useful and conservative. It should recognize basic relationships and common errors, but it must report uncertainty rather than simulate expert knowledge. Every domain assertion is either a source-grounded claim, a declared pack fact, or a derived fact with provenance.

The pack is implemented entirely as `.mjs` modules with Node.js built-ins. It introduces no JSON or TypeScript artifacts and no third-party dependency. Ontologies, circuits and tests are written by coding agents using the SDK and the relevant nll-* skills.


## 2. Scope and non-goals

This pack covers cells, organisms, body systems, reproduction, inheritance, ecosystems, adaptation, evolution, health and experimental biology at a lower-secondary level. It does not diagnose disease or replace expert biomedical knowledge.

The pack must distinguish internal document reasoning from claims about the external world. It may flag a statement as inconsistent with loaded basic knowledge, but it should say which pack fact or relation was used. It must not upgrade a plausible heuristic into a universal law.

## 3. Conceptual and scientific basis

Biological descriptions span levels of organization and often fail through level confusion: molecule, organelle, cell, tissue, organ, organism, population and ecosystem. The ontology therefore makes level, part/whole, function, lifecycle, environment and inheritance explicit. Circuits are conservative about causal claims because living systems have variation and multiple interacting conditions.

The practical ontology should favor event/state frames with typed roles over flat subject–predicate–object triples. Reified events make time, place, participants, causes, instruments, modality and evidence attachable without inventing a different predicate arity for every sentence. Claims and contexts remain separate from the situations they describe.

## 4. Ontology modules

The pack is divided into the following modules:

- organization — molecule through ecosystem levels
- cell-biology — cell, membrane, nucleus, organelle and basic functions
- organisms-systems — plants, animals, body systems and functions
- reproduction-inheritance — parent, offspring, trait, gene and variation
- ecology — population, community, habitat, resource, food relation and cycle
- evolution-adaptation — variation, selection, adaptation and common ancestry
- health-experiment — basic health state, observation, sample and biological evidence

The module boundaries are semantic and operational. A coding agent may split a large module further, but imports must preserve pack-qualified identities and avoid circular initialization.

## 5. Core concept inventory

- BiologicalEntity and LevelOfOrganization
- Cell, Tissue, Organ, OrganSystem and Organism
- Species, Population, Community and Ecosystem
- Trait, Gene, InheritedVariant and EnvironmentalInfluence
- LifecycleStage and ReproductiveEvent
- Habitat, Resource and EcologicalInteraction
- Adaptation, Variation and SelectionProcess
- BiologicalObservation and Sample

Concepts should include English lexicalizations and may add other languages in separate lexicon modules. Lexical forms are recognition aids; they do not define semantic identity.

## 6. Canonical frames and relations

- PartOfBiological(part, whole, level)
- PerformsFunction(structure, function)
- DevelopsFrom(stageA, stageB)
- Inherits(offspring, traitVariant, parentSource)
- LivesIn(organism, habitat)
- Consumes(organism, resource)
- CompetesWith, PredatesOn and CooperatesWith
- SelectedUnder(variant, environment, process)
- ObservedIn(claim, sample)

Every frame declares role domains, ranges and cardinalities. Relations with inverses or symmetry properties register those laws in OntologyJS. Application-specific judgments remain in circuits.

## 7. Stable knowledge seed

The initial pack should encode a deliberately small, inspectable seed rather than an opaque encyclopaedia. Recommended seed categories are:

- cells are basic units of living organisms in the school-level model
- multicellular organization distinguishes cell, tissue, organ and system
- organisms require resources and interact with environments
- traits can reflect inherited and environmental influences
- populations, not individual organisms, evolve across generations
- adaptation is not an intentional decision by an organism
- food webs and ecosystems contain multiple interacting paths
- biological variation and exceptions are normal; typical statements are not automatically universal

Pack facts are versioned and carry a provenance note such as `school-textbook-consensus`, `definition`, `unit-standard` or `design-convention`. Current, jurisdiction-dependent or contested facts are not part of the baseline pack.

## 8. Predefined circuit catalog

| Capability | Design |
|---|---|
| BiologicalLevelFinding | detects confusion across cell, organ, organism, population and ecosystem levels |
| StructureFunctionFinding | checks basic structure/function claims against declared pack relations |
| LifecycleFinding | checks stage ordering and impossible lifecycle transitions |
| InheritanceFinding | checks simple parent/offspring and dominant/recessive examples where explicitly modeled |
| EcologyRelationFinding | checks food-chain, habitat and population relations without oversimplifying food webs |
| EvolutionReasoningFinding | detects intentional or individual-level accounts of population evolution |
| EvidenceGeneralizationFinding | checks whether claims exceed the represented sample/population scope |
| BiologyExplanationPlan | produces level, process, evidence, variation and limitation frames |

A circuit may use several methods. The table describes its semantic responsibility, not a rigid implementation class. For example, a consistency circuit may use indexed queries, a relation closure, a constraint network and a bounded symbolic witness search.

## 9. Controlled generation and planning

The pack contributes CNL frames and generation circuits for:

- organism/process explanations
- lifecycle and ecosystem plans
- claim-evidence structures for school experiments
- comparative tables with shared and differing traits
- clarification questions about level, population, sample or environment

Generated plans preserve the distinction between a pack fact, a source claim, an inferred relation and an open question. A downstream LLM may improve style, but it should receive the CNL plan plus immutable semantic constraints.

## 10. Intent recognition and profile behavior

Cheap and semantic intent signals include:

- cells, organs, organisms, species, ecosystems, genes, traits or evolution
- biological experiment, health or environmental text
- claims about inheritance, adaptation or food relations
- requests for biology explanation or consistency

The pack descriptor declares these signals through fluent functions. Signal matches only influence loading and ranking; they do not produce findings. When this pack is loaded under `all-compatible`, every circuit whose prerequisites are satisfied is eligible. Domain-specific profiles may choose a smaller circuit subset.

## 11. Algorithm and implementation guidance

- use explicit level-of-organization types and reject cross-level role mismatches
- represent lifecycle as a transition graph with stage constraints
- model food relations as a directed graph and use reachability only for declared energy/consumption paths
- use simple finite inheritance tables only when assumptions are explicitly stated
- apply quantifier and sample-scope circuits to generalization claims
- treat structure/function and ecological relations as school-level facts with exceptions
- separate health description from diagnosis and advice

All algorithms operate over SemanticStore handles and provenance-preserving views. A specialized view may be cached, but the store remains the logical authority. Procedural stages are allowed when they are simpler than forcing an algorithm into declarative primitives; the stage must declare semantic reads, writes and trace output.

## 12. Fluent pack shape

A pack is ordinary JavaScript, not a manifest object:

```js
import {
  ontology, entityKind, eventKind, role, relation,
  capability, domainPack, lexicalSignals, semanticSignals
} from "../../sdk/index.mjs";

const O = ontology("biology-basic", "1.0.0");
export const BiologicalEntity = O.entity(entityKind("BiologicalEntity"));
export const Cell = O.entity(entityKind("Cell"));
export const Species = O.entity(entityKind("Species"));

export const ontologyModule = O.seal();

export default domainPack("biology-basic")
  .ontology(ontologyModule)
  .recognize(
    lexicalSignals(/* pack-specific terms */),
    semanticSignals(/* pack-specific frame identities */)
  )
  .provide(capability("BiologicalLevelFinding"))
  .provide(capability("StructureFunctionFinding"))
  .provide(capability("LifecycleFinding"))
  .targetKnowledgeLevel("lower-secondary")
  .seal();
```

The real implementation should define event/state frames, role constructors, lexicalizations, facts, circuits and tests in separate files as described below.

## 13. Required directory structure

```text
framework/packs/biology-basic/
  pack.mjs
  ontologies/
    organization.ontology.mjs
    cell-biology.ontology.mjs
    organisms-systems.ontology.mjs
    reproduction-inheritance.ontology.mjs
    ecology.ontology.mjs
    evolution-adaptation.ontology.mjs
    health-experiment.ontology.mjs
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

- cell/tissue/organ level distinctions
- plant/animal basic structure/function
- lifecycle order
- simple inheritance assumptions
- food chain versus food web
- individual versus population evolution
- sample-to-population overgeneralization
- typical versus universal biological claim
- biology CNL explanation plan

Tests use Node's built-in test runner. Every finding test asserts evidence and trace dependencies. CNL tests assert frame slots and, where parsers exist, round-trip equivalence.

## 15. Limitations and extension policy

Biology is variable and context-sensitive. The pack must not treat typical traits as universal, infer clinical diagnoses, or claim that a simplified school model is complete. Advanced genetics, molecular mechanisms, medicine and contested classification require specialized packs.

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

Frame semantics, part/whole ontologies, transition systems, graph reachability and scope-aware evidence reasoning.

## Appendix A. Minimum biological knowledge inventory

### A.1 Levels of organization

Encode a strict level lattice: molecule, organelle, cell, tissue, organ, organ system, organism, population, community, ecosystem and biosphere. Part/whole relations must specify adjacent or valid level transitions. Circuits should distinguish a property of a cell from a property of the organism unless a propagation law is declared.

### A.2 Cell and organism basics

Minimum concepts include cell membrane, cytoplasm, genetic material, nucleus for eukaryotic cells, chloroplast for typical plant photosynthetic cells, mitochondrion, tissue, organ and system. Pack facts are simplified and must be labeled as school-level typical relations, not universal statements about every cell.

### A.3 Life processes

Represent nutrition/resource acquisition, respiration, growth, response, reproduction, waste removal, regulation and development as process families. Avoid using a single checklist as a universal definition of life; the circuits use it for textbook consistency only.

### A.4 Inheritance and variation

Support trait, gene/variant, parent, offspring, genotype model, phenotype and environmental influence. Simple Punnett-style circuits require explicit assumptions about alleles and dominance. They should never generalize the simplified model to complex human traits.

### A.5 Ecology

Represent habitat, niche, population, resource, consumer, producer, decomposer, predator, prey, competitor, mutualistic interaction and abiotic factor. Food webs are directed multi-path graphs. Energy-flow explanations are distinct from matter cycling.

### A.6 Evolution

Minimum rules: heritable variation occurs in populations; differential reproductive success can change variant frequencies across generations; individuals do not evolve within one lifetime in the population-genetic sense; adaptation is a population-level outcome, not a conscious goal. Findings should allow historical and developmental meanings of “adapt” when context differs.

