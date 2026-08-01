---
id: DS010
title: Preserved General World Knowledge Ontology and Circuits
status: normative-implemented
owner: nllAgent architecture
summary: Preserves DS-008_General_World_Knowledge_Ontology_and_Circuits.md verbatim and records additive implementation alignment.
---

# DS010 — Preserved General World Knowledge Ontology and Circuits

## Introduction

This official specification preserves the complete original design contract. No wording from the source specification has been removed, shortened, or rewritten.

## Core Content

The following source specification is included verbatim from `design-specifications/DS-008_General_World_Knowledge_Ontology_and_Circuits.md`.

<!-- ORIGINAL SPECIFICATION START: DS-008_General_World_Knowledge_Ontology_and_Circuits.md -->
# DS-008 — General World Knowledge Ontology and Circuits

**Status:** Normative predefined-pack specification  
**Pack identity:** `world-basic`  
**Primary skills:** `nll-ontology, nll-circuit`  
**Depends on:** DS-000–DS-004  
**Testing:** DS-005  
**Evaluation:** DS-006


## 1. Role in the architecture

This pack is one modular source of ontology constructors, stable background knowledge, reusable circuits, CNL frames and intent-recognition metadata. It does not replace the common language ontology or the task-specific LongText interpretation. LongTextJS uses the pack's generated constructors to describe source claims; CircuitJS uses the same identities to query, derive and evaluate; IntentJS uses the pack descriptor to decide whether loading and execution are relevant.

The target breadth is comparable to a careful 12–14-year-old with ordinary lower-secondary education. The pack should be useful and conservative. It should recognize basic relationships and common errors, but it must report uncertainty rather than simulate expert knowledge. Every domain assertion is either a source-grounded claim, a declared pack fact, or a derived fact with provenance.

The pack is implemented entirely as `.mjs` modules with Node.js built-ins. It introduces no JSON or TypeScript artifacts and no third-party dependency. Ontologies, circuits and tests are written by coding agents using the SDK and the relevant nll-* skills.


## 2. Scope and non-goals

This pack supplies a conservative, versioned set of stable facts and categories about time, geography, human institutions, common artifacts, materials, food, health and the natural world. It supports basic fact compatibility and contextual interpretation. It excludes rapidly changing facts, encyclopaedic detail and expert claims.

The pack must distinguish internal document reasoning from claims about the external world. It may flag a statement as inconsistent with loaded basic knowledge, but it should say which pack fact or relation was used. It must not upgrade a plausible heuristic into a universal law.

## 3. Conceptual and scientific basis

World knowledge is represented as a layered knowledge base rather than as unqualified assertions. Definitions and stable relations form the foundation; textbook-consensus facts form a second tier; time-sensitive or localized facts are excluded from the framework baseline. A fact carries its applicability scope and source class. Circuits compare source claims with loaded pack facts, but they distinguish contradiction, simplification, exception and missing specificity.

The practical ontology should favor event/state frames with typed roles over flat subject–predicate–object triples. Reified events make time, place, participants, causes, instruments, modality and evidence attachable without inventing a different predicate arity for every sentence. Claims and contexts remain separate from the situations they describe.

## 4. Ontology modules

The pack is divided into the following modules:

- time-calendar — days, months, seasons, duration and ordinary schedules
- earth-geography — planet, land, water, continent, country, city and direction categories
- institutions — family, school, government, company, market, hospital and media roles
- artifacts — tools, vehicles, buildings, communication and computing devices
- materials-food-health — ordinary material properties, food categories and basic health concepts
- measurement — common units, scales and qualitative comparison
- fact-provenance — source classes, temporal validity and applicability scope

The module boundaries are semantic and operational. A coding agent may split a large module further, but imports must preserve pack-qualified identities and avoid circular initialization.

## 5. Core concept inventory

- CalendarUnit — second through year with conversion relations where stable
- GeographicRegion — planet, continent, country, settlement and local area
- Institution — organized social structure with roles and functions
- Artifact — designed object with an ordinary function
- Vehicle — artifact enabling transport
- Material — substance category with qualitative properties
- Food — edible substance or prepared item
- HealthState — basic non-diagnostic health condition
- InformationArtifact — book, record, message, map or digital file
- StableWorldFact — versioned pack assertion with applicability

Concepts should include English lexicalizations and may add other languages in separate lexicon modules. Lexical forms are recognition aids; they do not define semantic identity.

## 6. Canonical frames and relations

- LocatedIn(place, region)
- PartOf(part, whole)
- HasFunction(artifact, function)
- MadeOf(artifact, material)
- UsedFor(agent, artifact, purpose)
- OccursDuring(event, calendarPeriod)
- InstitutionalRole(person, institution, role)
- TypicalProperty(kind, property) as a defeasible relation
- PackFact(proposition, sourceClass, validityScope)

Every frame declares role domains, ranges and cardinalities. Relations with inverses or symmetry properties register those laws in OntologyJS. Application-specific judgments remain in circuits.

## 7. Stable knowledge seed

The initial pack should encode a deliberately small, inspectable seed rather than an opaque encyclopaedia. Recommended seed categories are:

- basic calendar ordering and common unit conversions
- Earth is a planet; continents and countries are geographic regions; cities are settlements
- schools teach and organize learning; hospitals provide health care; governments exercise public authority under some legal order
- books and records are information artifacts; vehicles enable transport; thermometers measure temperature
- water commonly occurs as solid, liquid and gas under different conditions, with scientific detail delegated to physics/chemistry packs
- food provides nutrients; sleep, hydration and hygiene are relevant to ordinary health, without medical diagnosis
- maps represent places and spatial relations but are not the places themselves
- facts may have exceptions and scope; typical properties are not universal

Pack facts are versioned and carry a provenance note such as `school-textbook-consensus`, `definition`, `unit-standard` or `design-convention`. Current, jurisdiction-dependent or contested facts are not part of the baseline pack.

## 8. Predefined circuit catalog

| Capability | Design |
|---|---|
| BasicFactConflictFinding | compares a source claim with an explicit stable pack fact and reports direct incompatibility with provenance |
| CategoryMistakeFinding | detects confusion between representation and represented object, institution and person, place and organization, or artifact and function |
| TemporalCalendarFinding | checks date/day/month ordering and stable calendar conversions |
| UnitConventionFinding | normalizes common everyday units before comparison |
| TypicalityWarning | warns when a typical property is stated as universal |
| WorldContextEnrichment | derives conservative category and part/whole context for other circuits |
| FactClarificationDemand | asks for jurisdiction, date, location or intended category when a claim cannot be checked |
| BasicExpositionPlan | creates a CNL explanation plan: category, function, example, limitation |

A circuit may use several methods. The table describes its semantic responsibility, not a rigid implementation class. For example, a consistency circuit may use indexed queries, a relation closure, a constraint network and a bounded symbolic witness search.

## 9. Controlled generation and planning

The pack contributes CNL frames and generation circuits for:

- short factual explanation frames with definition, category, example and limitation
- basic world-context summaries for a document
- fact-check observations naming the exact pack fact used
- school-level expository plans
- questions requesting date, place or institutional context

Generated plans preserve the distinction between a pack fact, a source claim, an inferred relation and an open question. A downstream LLM may improve style, but it should receive the CNL plan plus immutable semantic constraints.

## 10. Intent recognition and profile behavior

Cheap and semantic intent signals include:

- dates, places, institutions, artifacts, common materials or everyday factual statements
- textbook or manual structure
- requests for basic fact checking or explanation
- terms that match stable world-fact categories

The pack descriptor declares these signals through fluent functions. Signal matches only influence loading and ranking; they do not produce findings. When this pack is loaded under `all-compatible`, every circuit whose prerequisites are satisfied is eligible. Domain-specific profiles may choose a smaller circuit subset.

## 11. Algorithm and implementation guidance

- store pack facts in indexed relation modules with explicit validity scope
- use subtype and part/whole closure for category queries
- require exact proposition compatibility before reporting contradiction
- distinguish universal, typical and existential quantification
- use knowledge slicing to show only the pack facts that influence a finding
- avoid probabilistic typicality scores in the baseline; represent typicality as a defeasible relation and status

All algorithms operate over SemanticStore handles and provenance-preserving views. A specialized view may be cached, but the store remains the logical authority. Procedural stages are allowed when they are simpler than forcing an algorithm into declarative primitives; the stage must declare semantic reads, writes and trace output.

## 12. Fluent pack shape

A pack is ordinary JavaScript, not a manifest object:

```js
import {
  ontology, entityKind, eventKind, role, relation,
  capability, domainPack, lexicalSignals, semanticSignals
} from "../../sdk/index.mjs";

const O = ontology("world-basic", "1.0.0");
export const CalendarUnit = O.entity(entityKind("CalendarUnit"));
export const GeographicRegion = O.entity(entityKind("GeographicRegion"));
export const Institution = O.entity(entityKind("Institution"));

export const ontologyModule = O.seal();

export default domainPack("world-basic")
  .ontology(ontologyModule)
  .recognize(
    lexicalSignals(/* pack-specific terms */),
    semanticSignals(/* pack-specific frame identities */)
  )
  .provide(capability("BasicFactConflictFinding"))
  .provide(capability("CategoryMistakeFinding"))
  .provide(capability("TemporalCalendarFinding"))
  .targetKnowledgeLevel("lower-secondary")
  .seal();
```

The real implementation should define event/state frames, role constructors, lexicalizations, facts, circuits and tests in separate files as described below.

## 13. Required directory structure

```text
framework/packs/world-basic/
  pack.mjs
  ontologies/
    time-calendar.ontology.mjs
    earth-geography.ontology.mjs
    institutions.ontology.mjs
    artifacts.ontology.mjs
    materials-food-health.ontology.mjs
    measurement.ontology.mjs
    fact-provenance.ontology.mjs
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

- stable fact agreement and direct disagreement
- typical property incorrectly universalized
- map versus territory category mistake
- city/country/continent hierarchy
- calendar conversion and invalid date
- institution versus individual role
- stale or scope-inapplicable fact not used
- expository CNL plan

Tests use Node's built-in test runner. Every finding test asserts evidence and trace dependencies. CNL tests assert frame slots and, where parsers exist, round-trip equivalence.

## 15. Limitations and extension policy

The pack is not a replacement for web search or a current knowledge base. It intentionally omits current office holders, prices, changing boundaries, medical guidance and contested claims. Agents needing such information must load a versioned external-fact pack with explicit freshness and provenance.

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

Portable ontology principles [GRU93], provenance discipline, typed knowledge bases and relevance slicing [WEI84].

## Appendix A. Minimum stable knowledge inventory

The implementation should begin with a compact knowledge set whose entries can be inspected in source code. The aim is not encyclopaedic coverage; it is to supply common category distinctions and reference points that frequently matter in text.

### A.1 Time and calendar

Include ordered calendar units, common conversions, month identities, ordinary date validity, day/week relations, seasons as region-dependent concepts, and distinctions among instant, duration, frequency and deadline. Do not encode local holidays or current time-zone rules in the baseline.

### A.2 Geography and representation

Include `Earth`, `Land`, `WaterBody`, `Continent`, `Country`, `Region`, `City`, `Village`, `River`, `Lake`, `Sea`, `Ocean`, `Mountain` and `Map`. Encode that a map represents spatial entities but is not one of them; settlements are located within regions; countries may contain cities; rivers and roads connect or traverse places. Exact current borders belong in versioned external packs.

### A.3 Institutions and roles

Include `Family`, `School`, `University`, `Company`, `Government`, `Court`, `Hospital`, `Market`, `Library`, `Museum`, `MediaOrganization`, `Bank` and `NonprofitOrganization`. Encode ordinary role/function relations conservatively: a school provides organized education, a hospital provides health-care services, a court resolves legal disputes under an authority, a library stores and provides access to information artifacts. These are type-level functions, not claims that every institution always performs perfectly.

### A.4 Artifacts and ordinary technology

Include `Book`, `Document`, `Record`, `Message`, `Computer`, `Phone`, `Camera`, `Clock`, `Thermometer`, `Scale`, `Vehicle`, `Bicycle`, `Car`, `Train`, `Ship`, `Aircraft`, `Building`, `Door`, `Key`, `Lock`, `Container`, `Tool` and `Machine`. Define basic function and representation relations without encoding brand-specific or current technical facts.

### A.5 Materials, food and health concepts

Include common material classes such as metal, wood, glass, plastic, paper, fabric, stone, water and air; common properties such as solid, liquid, gas, rigid, flexible, transparent, opaque, conductive and insulating as qualified typical properties. Include food, nutrient, water, meal, hygiene, sleep and exercise as basic concepts, but do not create diagnostic or treatment rules.

### A.6 Factual conflict policy

A direct pack-fact conflict requires the same subject identity, property, time, scope and quantifier. Typical facts cannot refute an explicit exception. The finding must quote the pack fact and classify it as definition, stable textbook fact or typical relation. If a source makes a more precise claim than the pack can represent, the circuit returns `UNKNOWN` or requests a specialized pack.

<!-- ORIGINAL SPECIFICATION END: DS-008_General_World_Knowledge_Ontology_and_Circuits.md -->

### Additive implementation alignment

The corresponding executable pack is installed under framework/packs and includes ontology modules, a sealed pack descriptor, capability-providing circuits, CNL support, lexical/semantic intent signals, and isolated ontology/circuit/intent/CNL tests. Pack 2 of the preserved domain sequence is also loadable through framework/packs/index.mjs.

## Decisions & Questions

### Question #1: Why is the original specification embedded instead of replaced by a normalized rewrite?

Response: Source fidelity is an explicit project requirement. The embedded body remains byte-for-byte identical to the original file; official metadata, implementation alignment, and decision records are additive.

### Question #2: Which text wins if an additive note appears narrower than the preserved contract?

Response: The preserved normative requirement remains authoritative. An implementation-alignment note reports confirmed current behavior and cannot silently weaken the original contract.



## Conclusion

Future changes must preserve the embedded source contract, extend implementation and tests to meet it, and record contract-shaping rationale in numbered entries here.
