# DS-015 — Sociology Ontology and Circuits

**Status:** Normative predefined-pack specification  
**Pack identity:** `sociology-basic`  
**Primary skills:** `nll-ontology, nll-circuit`  
**Depends on:** DS-000–DS-004  
**Testing:** DS-005  
**Evaluation:** DS-006


## 1. Role in the architecture

This pack is one modular source of ontology constructors, stable background knowledge, reusable circuits, CNL frames and intent-recognition metadata. It does not replace the common language ontology or the task-specific LongText interpretation. LongTextJS uses the pack's generated constructors to describe source claims; CircuitJS uses the same identities to query, derive and evaluate; IntentJS uses the pack descriptor to decide whether loading and execution are relevant.

The target breadth is comparable to a careful 12–14-year-old with ordinary lower-secondary education. The pack should be useful and conservative. It should recognize basic relationships and common errors, but it must report uncertainty rather than simulate expert knowledge. Every domain assertion is either a source-grounded claim, a declared pack fact, or a derived fact with provenance.

The pack is implemented entirely as `.mjs` modules with Node.js built-ins. It introduces no JSON or TypeScript artifacts and no third-party dependency. Ontologies, circuits and tests are written by coding agents using the SDK and the relevant nll-* skills.


## 2. Scope and non-goals

This pack covers groups, roles, institutions, norms, networks, cooperation, conflict, power, inequality, demographics and collective action at an introductory level. It analyzes structural claims without reducing individuals to group averages or declaring one social theory universally correct.

The pack must distinguish internal document reasoning from claims about the external world. It may flag a statement as inconsistent with loaded basic knowledge, but it should say which pack fact or relation was used. It must not upgrade a plausible heuristic into a universal law.

## 3. Conceptual and scientific basis

Sociological statements operate at several levels: individual, interaction, organization, institution and population. Many reasoning errors arise from moving between levels without justification. The ontology represents actors, roles, groups, institutions, resources, networks and aggregate measures separately. Circuits focus on level consistency, role/institution relations, aggregation, causal caution and competing mechanisms.

The practical ontology should favor event/state frames with typed roles over flat subject–predicate–object triples. Reified events make time, place, participants, causes, instruments, modality and evidence attachable without inventing a different predicate arity for every sentence. Claims and contexts remain separate from the situations they describe.

## 4. Ontology modules

The pack is divided into the following modules:

- actors-groups — individuals, categories, groups, organizations and populations
- roles-norms — status, role, expectation, sanction and deviance
- institutions — family, education, economy, government, religion, health and media
- networks — ties, position, diffusion and coordination
- power-resources — authority, influence, resource and dependency
- inequality-demography — distribution, stratification, population and rate
- collective-process — cooperation, conflict, collective action and social change

The module boundaries are semantic and operational. A coding agent may split a large module further, but imports must preserve pack-qualified identities and avoid circular initialization.

## 5. Core concept inventory

- IndividualActor, Group, Organization, Institution and Population
- SocialCategory, Status and Role
- Norm, Expectation and Sanction
- SocialTie, Network and Position
- Resource, Authority, PowerRelation and Dependency
- Distribution, InequalityMeasure and DemographicMeasure
- CollectiveAction and InstitutionalChange
- SurveyClaim, AggregateClaim and CaseEvidence

Concepts should include English lexicalizations and may add other languages in separate lexicon modules. Lexical forms are recognition aids; they do not define semantic identity.

## 6. Canonical frames and relations

- MemberOf(actor, group)
- OccupiesRole(actor, role, institution)
- ExpectedTo(role, behavior, context)
- ConnectedTo(actorA, actorB, tieType)
- Controls(actor, resource)
- DependsOn(actor, resourceProvider)
- DistributedAcross(resource, population)
- MeasuredIn(claim, population, time)
- Influences(structure, outcome, mechanism)

Every frame declares role domains, ranges and cardinalities. Relations with inverses or symmetry properties register those laws in OntologyJS. Application-specific judgments remain in circuits.

## 7. Stable knowledge seed

The initial pack should encode a deliberately small, inspectable seed rather than an opaque encyclopaedia. Recommended seed categories are:

- individual and aggregate properties are distinct
- institutions persist beyond particular role occupants
- roles carry expectations but do not determine every action
- correlation at group level does not automatically explain individuals
- networks can transmit information and behavior through represented ties
- power may derive from authority, resources, position or dependency
- social groups contain variation
- social outcomes can have multiple mechanisms and levels of explanation

Pack facts are versioned and carry a provenance note such as `school-textbook-consensus`, `definition`, `unit-standard` or `design-convention`. Current, jurisdiction-dependent or contested facts are not part of the baseline pack.

## 8. Predefined circuit catalog

| Capability | Design |
|---|---|
| LevelOfAnalysisFinding | detects unsupported moves between individual, group, institution and population levels |
| EcologicalFallacyFinding | flags inference from aggregate association to individual cases |
| IndividualisticFallacyFinding | flags inference from individual cases to group structure without support |
| RoleInstitutionFinding | checks role, authority and institutional responsibility consistency |
| NetworkPathFinding | uses graph reachability to explain represented diffusion or dependency paths |
| CorrelationCausationFinding | checks causal claims against temporal order, mechanism and alternatives |
| PopulationScopeFinding | checks sample, population, time and rate definitions |
| SocialExplanationPlan | produces actor level, structure, mechanism, evidence, alternative and limitation frames |

A circuit may use several methods. The table describes its semantic responsibility, not a rigid implementation class. For example, a consistency circuit may use indexed queries, a relation closure, a constraint network and a bounded symbolic witness search.

## 9. Controlled generation and planning

The pack contributes CNL frames and generation circuits for:

- multi-level social explanations
- institution and role maps
- network/dependency summaries
- argument plans with mechanism and alternative explanation
- clarification questions for population, period and level of analysis

Generated plans preserve the distinction between a pack fact, a source claim, an inferred relation and an open question. A downstream LLM may improve style, but it should receive the CNL plan plus immutable semantic constraints.

## 10. Intent recognition and profile behavior

Cheap and semantic intent signals include:

- group, institution, class, organization, population, norm, power or network terms
- survey, demographic or social trend claims
- claims about society, groups or institutions
- requests for social analysis or policy impact

The pack descriptor declares these signals through fluent functions. Signal matches only influence loading and ranking; they do not produce findings. When this pack is loaded under `all-compatible`, every circuit whose prerequisites are satisfied is eligible. Domain-specific profiles may choose a smaller circuit subset.

## 11. Algorithm and implementation guidance

- tag every claim with level of analysis and population/time scope
- use graph relations for networks and dependency paths
- use quantity/rate primitives for demographic claims
- require a represented mechanism and temporal compatibility before strong causal classification
- preserve multiple competing explanations as alternatives
- use slicing from an aggregate conclusion to sample and measurement assumptions
- avoid value judgments in structural circuits unless a normative pack supplies them

All algorithms operate over SemanticStore handles and provenance-preserving views. A specialized view may be cached, but the store remains the logical authority. Procedural stages are allowed when they are simpler than forcing an algorithm into declarative primitives; the stage must declare semantic reads, writes and trace output.

## 12. Fluent pack shape

A pack is ordinary JavaScript, not a manifest object:

```js
import {
  ontology, entityKind, eventKind, role, relation,
  capability, domainPack, lexicalSignals, semanticSignals
} from "../../sdk/index.mjs";

const O = ontology("sociology-basic", "1.0.0");
export const IndividualActor = O.entity(entityKind("IndividualActor"));
export const SocialCategory = O.entity(entityKind("SocialCategory"));
export const Norm = O.entity(entityKind("Norm"));

export const ontologyModule = O.seal();

export default domainPack("sociology-basic")
  .ontology(ontologyModule)
  .recognize(
    lexicalSignals(/* pack-specific terms */),
    semanticSignals(/* pack-specific frame identities */)
  )
  .provide(capability("LevelOfAnalysisFinding"))
  .provide(capability("EcologicalFallacyFinding"))
  .provide(capability("IndividualisticFallacyFinding"))
  .targetKnowledgeLevel("lower-secondary")
  .seal();
```

The real implementation should define event/state frames, role constructors, lexicalizations, facts, circuits and tests in separate files as described below.

## 13. Required directory structure

```text
framework/packs/sociology-basic/
  pack.mjs
  ontologies/
    actors-groups.ontology.mjs
    roles-norms.ontology.mjs
    institutions.ontology.mjs
    networks.ontology.mjs
    power-resources.ontology.mjs
    inequality-demography.ontology.mjs
    collective-process.ontology.mjs
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

- individual versus group claim
- aggregate-to-individual inference
- role versus role occupant
- institutional responsibility
- network path and missing tie
- correlation without mechanism
- population and time-scope mismatch
- social explanation CNL plan

Tests use Node's built-in test runner. Every finding test asserts evidence and trace dependencies. CNL tests assert frame slots and, where parsers exist, round-trip equivalence.

## 15. Limitations and extension policy

The pack does not establish one sociological theory as fact. It does not infer personal traits from group membership or encode discriminatory stereotypes. Detailed empirical claims require sourced external data packs.

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

Multi-level modeling, graph reachability, quantitative scope, causal dependency and program slicing [WEI84].

## Appendix A. Minimum multi-level social model

### A.1 Analysis levels

The ontology should define `IndividualLevel`, `InteractionLevel`, `GroupLevel`, `OrganizationLevel`, `InstitutionLevel` and `PopulationLevel`. Every aggregate or causal claim can declare its level. Cross-level inference requires an explicit bridge or mechanism.

### A.2 Roles and institutions

Represent role identity separately from the person occupying it. Institutions have rules, resources, positions and functions; organizations are concrete coordinated actors; populations are analytic sets. A document may use these terms loosely, so LongText alternatives should be possible.

### A.3 Networks

Minimum network concepts are actor node, tie, directed/undirected relation, weight/strength, path, component, central position and bridge. The baseline engine supports reachability, shortest unweighted path and component detection. Statistical network claims require specialized packs.

### A.4 Power and dependency

Represent authority, control of resource, influence, bargaining dependency and vulnerability as different relations. Circuits should not infer authority from influence or moral legitimacy from formal power.

### A.5 Population and rate

Every rate has numerator event/count, denominator population/exposure and time interval. Circuits detect denominator changes, absolute-versus-relative confusion and comparison across incompatible periods or populations.

### A.6 Causal social claims

A causal claim should identify proposed mechanism, temporal order, target level, population and alternatives. The baseline can flag missing mechanisms or level mismatch; it cannot establish a contested social cause from prose alone.

