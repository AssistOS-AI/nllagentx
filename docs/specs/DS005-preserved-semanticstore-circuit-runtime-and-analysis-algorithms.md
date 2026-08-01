---
id: DS005
title: Preserved SemanticStore, Circuit Runtime and Analysis Algorithms
status: normative-implemented
owner: nllAgent architecture
summary: Preserves DS-003_SemanticStore_Circuit_Runtime_and_Analysis_Algorithms.md verbatim and records additive implementation alignment.
---

# DS005 — Preserved SemanticStore, Circuit Runtime and Analysis Algorithms

## Introduction

This official specification preserves the complete original design contract. No wording from the source specification has been removed, shortened, or rewritten.

## Core Content

The following source specification is included verbatim from `design-specifications/DS-003_SemanticStore_Circuit_Runtime_and_Analysis_Algorithms.md`.

<!-- ORIGINAL SPECIFICATION START: DS-003_SemanticStore_Circuit_Runtime_and_Analysis_Algorithms.md -->
# DS-003 — SemanticStore, Circuit Runtime and Analysis Algorithms

**Status:** Normative runtime and algorithm specification  
**Primary skills:** `nll-runtime`, `nll-circuit`  
**Depends on:** DS-000, DS-002  
**Related:** DS-004, DS-005, DS-006, all domain pack specifications

## 1. Purpose

This specification defines the execution substrate for OntologyJS, LongTextJS, CircuitJS and IntentJS. It explains the single logical SemanticStore, physical indexes, semantic transactions, query planning, dynamic dataflow, circuit composition, capability planning and the family of compact analysis methods available to circuit authors.

The implementation is dependency-free. Algorithms are implemented as focused `.mjs` kernels over shared semantic handles. No single universal solver is required. The runtime exposes a common contract so circuits can use the most suitable method without changing the semantic authority of the store.

## 2. One logical SemanticStore

### 2.1 Logical model

The SemanticStore is a typed attributed term graph with explicit provenance and interpretation context. Its logical entities include:

- ontology identities and schema declarations;
- ground entities, events, states, values and propositions;
- source mentions and exact anchors;
- claims and voices;
- contexts, scopes, worlds and alternatives;
- temporal and quantitative constraints;
- coverage declarations;
- derived facts, assessments, findings and CNLFrames;
- circuit instances and trace events.

The logical model must be independent of storage representation. Circuit code sees semantic handles and query algebra. It does not read internal arrays or maps.

### 2.2 Physical indexes

The reference runtime should maintain at least:

- type/subtype index;
- outgoing role index `(source, role) -> targets`;
- reverse role index `(role, target) -> sources`;
- relation index;
- claim-content index;
- source-span interval index;
- scope/context index;
- interpretation/world index;
- temporal constraint network;
- quantity/unit index;
- identity/alias index;
- provenance/dependency index;
- coverage index;
- capability/result index;
- optional full-text token index for labels and lexicalizations.

Indexes are rebuilt from `.mjs` semantic modules or disposable binary cache. They are not separate semantic databases.

### 2.3 SemanticStore API

The public store interface should support:

```text
store.term(id)
store.typeOf(term)
store.isSubtype(termOrType, type)
store.roles(term)
store.targets(term, role)
store.sources(role, target)
store.claimsAbout(term)
store.grounding(termOrClaim)
store.context(termOrClaim)
store.interpretation(termOrClaim)
store.coverage(concept, scope)
store.query(pattern)
store.beginTransaction(label)
store.explain(value)
```

Returned values are immutable semantic handles or explicit semantic collections.

## 3. Semantic transactions

### 3.1 Why transactions are required

Ontology and LongText modules may use full JavaScript and may compute terms procedurally. The runtime therefore obtains determinism and integrity at the semantic boundary rather than by restricting language syntax. A transaction collects semantic assertions, validates them, canonicalizes values and commits them atomically.

### 3.2 Transaction phases

1. **Open:** bind the transaction to a source snapshot, ontology stack and interpretation context.
2. **Construct:** SDK calls create provisional handles and assertions.
3. **Resolve:** explicit references and generated constructor identities are resolved.
4. **Validate:** sorts, role cardinalities, scope, grounding, coverage and ontology compatibility are checked.
5. **Canonicalize:** canonical values and semantic identities are interned.
6. **Commit:** accepted terms and indexes become part of the new immutable snapshot.
7. **Trace:** the commit records module, source digest, framework version and diagnostics.

A failed transaction commits nothing. It reports all safely collectable diagnostics rather than failing after the first minor error.

### 3.3 Canonical identity

Canonicalization rules differ by semantic category.

- ontology declarations use explicit pack-qualified identity;
- mentions use source ID plus exact span and mention kind;
- quantities use normalized rational magnitude, dimension and unit family;
- dates/times use normalized representation plus uncertainty;
- derived facts use operation identity, canonical inputs, circuit version and interpretation context;
- circuit instances use template identity plus canonical bindings;
- claims remain distinct when voice, polarity, grounding or context differs.

Canonical IDs can be constructed with a stable textual encoding and SHA-256 from Node’s `crypto` module. Iteration order must be deterministic before hashing.

## 4. Query algebra and planning

### 4.1 Pattern representation

Circuit patterns are term structures containing constants, variables and constraints. A pattern such as `Use(actor(p), theme(o))` compiles to a set of type and role constraints. The compiler extracts:

- required type indexes;
- constant-bound roles;
- variable equalities;
- scope/world restrictions;
- temporal or quantitative predicates;
- required coverage for negative operations.

### 4.2 Join planning

The planner estimates candidate cardinality from index counts. It should:

1. start with the most selective type or role constraint;
2. bind variables as early as possible;
3. apply cheap deterministic filters before expensive derived predicates;
4. use reverse indexes for bound targets;
5. preserve interpretation compatibility during joins;
6. postpone coverage-dependent negative checks until the positive candidate scope is known;
7. memoize repeated subqueries by canonical query and snapshot ID.

A simple left-deep plan is sufficient initially. Bushy plans may be added only if benchmarks show a need.

### 4.3 Query result semantics

Every result row carries:

- variable bindings;
- interpretation condition;
- scope;
- evidence/provenance references;
- completeness metadata for quantified operations.

Rows from incompatible alternatives cannot be joined as though they were simultaneously true. The join returns separate conditioned rows or a conflict diagnostic.

### 4.4 Absence and quantified queries

`notExists`, `none` and `all` require a `CoverageWitness`. The query engine validates that the witness covers the same concept, relation, scope, source set and interpretation assumptions. Incomplete coverage yields `UNKNOWN` or `BLOCKED_COVERAGE`.

## 5. Circuit model

### 5.1 Circuit versus method

A circuit is a reusable semantic program with a responsibility and contract. A method is a computational strategy used inside or around a circuit. A retention circuit may combine query/dataflow, quantity constraints, a decision table, abstract preflight and symbolic benchmark generation. It remains one retention circuit.

### 5.2 CircuitModel

After executing a CircuitJS builder module, the runtime receives a `CircuitModel` containing:

- identity and version;
- required and provided capabilities;
- ontology and coverage requirements;
- stage definitions;
- subcircuit references;
- variables, ports and data dependencies;
- emission contracts;
- method adapters and summaries;
- tests and diagnostics metadata.

Full JavaScript procedural stages are represented as callable stage implementations with declared semantic reads/writes.

### 5.3 Composition forms

The runtime supports five composition forms.

1. **Static composition:** one circuit directly includes another.
2. **Capability composition:** the planner selects providers for required capabilities.
3. **Per-match composition:** each query result instantiates a canonical circuit template.
4. **Assurance composition:** abstract, symbolic, proof or monitor circuits analyze another circuit.
5. **Refinement composition:** an unknown or possible result creates a typed demand handled by another circuit or a new coding task.

### 5.4 Circuit instance identity

An instance key includes template identity, version, canonical bindings, ontology stack, source snapshot and interpretation context. The same instance is not materialized twice in one epoch.

## 6. Dynamic dataflow and SSA discipline

### 6.1 Dataflow graph

Declarative circuit stages compile to nodes and typed edges. Every node output has one producer in an epoch. Nodes may select candidates, normalize values, derive facts, evaluate conditions, create subcircuit instances, aggregate results or emit outputs.

Procedural stages are macro-nodes: internally they can use ordinary JS, but externally they consume declared values and publish immutable results.

### 6.2 Epochs

An epoch is one stable evaluation of a semantic snapshot and plan. New derived facts or canonical subcircuit instances may extend the graph inside the epoch. Source edits, ontology changes or non-monotone invalidation start a new epoch. Old epochs remain replayable until garbage-collected.

### 6.3 Scheduler

The scheduler maintains:

- dependency counts;
- a deterministic ready queue;
- node state;
- value store;
- content-addressed cache;
- pending expansions;
- diagnostics and trace.

Reference algorithm:

```text
initialize graph and dependency counts
insert zero-dependency nodes into stable priority queue
while queue not empty:
    node := pop smallest canonical node key
    inputs := resolve input values
    cacheKey := hash(node semantics, inputs, versions, context)
    if reusable cache entry exists:
        output := cache entry
    else:
        output := execute node concrete semantics
        validate output contract
        cache output
    bind node outputs once
    record trace
    materialize canonical expansion requests
    decrement dependent counts and enqueue newly ready nodes
when queue empty:
    process fixed-point strata and unresolved capability requests
    finalize emissions or explicit blocked diagnostics
```

Deterministic queue ordering prevents accidental schedule-dependent results.

### 6.4 Incremental recomputation

The dependency graph records which terms, queries and nodes depend on each source or ontology value. When a source unit changes:

1. create a new source snapshot;
2. align unchanged source units and spans;
3. rematerialize affected LongText transactions;
4. invalidate dependent query results and derived values;
5. reuse unchanged nodes by content identity;
6. execute only affected descendants.

The mechanism follows self-adjusting computation and build-system principles, but the first implementation can use explicit reverse dependencies and snapshot-level invalidation rather than a sophisticated dynamic dependency library.

## 7. Capability planner

### 7.1 Registry

Circuits and method providers register descriptors indexed by:

- provided capability;
- required capability;
- domain and concept;
- text type and concern;
- view kind;
- guarantee class;
- cost class;
- profile tags;
- ontology compatibility;
- supported statuses and outputs.

### 7.2 Backward planning

Starting from IntentJS output targets, the planner performs an AND/OR search.

- an output capability may have several provider circuits (OR);
- a chosen provider may require several capabilities (AND);
- available LongText observations, pack facts and agent services are leaf capabilities;
- cycles are detected and either resolved as a fixed-point group or rejected.

The planner memoizes subgoals and prunes dominated partial plans. A plan dominates another when it provides no weaker guarantees, no less required coverage and no greater declared cost for the same goals.

### 7.3 Forward activation

The selected plan describes circuit families, not every instance. During execution, new semantic matches activate per-instance circuits. This combines demand-driven backward planning with forward dataflow.

### 7.4 Plan explanation

Every plan must explain:

- requested outputs and concerns;
- loaded packs and intent evidence;
- selected circuits and providers;
- rejected candidates and hard incompatibilities;
- selected methods and guarantee levels;
- fallback behavior and any deferred checks.

## 8. Multi-semantics runtime

The same CircuitModel can support several operational questions. Concrete execution remains authoritative for task findings. Other interpreters help planning, testing, refinement and local assurance.

### 8.1 Concrete interpretation

Concrete interpretation evaluates the circuit against one SemanticStore snapshot and produces actual values. It uses exact ground terms, source anchors and current alternatives.

### 8.2 Abstract interpretation

Abstract interpretation computes a conservative approximation of possible circuit outcomes without enumerating every concrete interpretation or state.

#### 8.2.1 Abstract domains

The initial implementation should provide:

- evidence lattice: none, support, refute, conflict;
- ontology-type domain: exact type, possible subtype set, incompatible, top;
- identity domain: must-alias, may-alias, cannot-alias, unknown;
- interval quantity domain: lower/upper rational bounds and dimension;
- temporal relation domain: set of possible Allen relations;
- scope domain: required, possible, incompatible scopes;
- coverage domain: open, partial, closed;
- interpretation domain: all/some/no alternatives satisfy property;
- status domain: possible and mandatory rule statuses.

Domains can be combined by a reduced product that propagates obvious cross-domain reductions. For example, disjoint types imply cannot-alias; incompatible temporal intervals can eliminate an identity hypothesis.

#### 8.2.2 Worklist algorithm

Each abstract stage has a monotone transfer function. The runtime:

1. initializes input nodes with abstract values;
2. orders nodes by strongly connected components (SCCs);
3. evaluates acyclic components once in topological order;
4. iterates cyclic components with a worklist until values stabilize;
5. applies widening after a configurable number of growth steps in potentially infinite domains;
6. optionally applies narrowing passes;
7. records precision-loss points and opaque stages.

The result exposes `must`, `may` and `cannot` properties. An opaque procedural stage returns `top` unless it provides an abstract summary.

### 8.3 Symbolic and concolic execution

Symbolic execution represents selected input values as symbolic variables and follows circuit branches while accumulating conditions.

The implementation should initially target declarative decision logic and registered symbolic primitives rather than arbitrary JS instruction symbolic execution. A procedural stage can provide a symbolic adapter or be treated as an uninterpreted function.

Symbolic state contains:

- symbolic bindings;
- path condition;
- current stage;
- generated outputs;
- provenance to circuit rows and source templates.

A depth-first or breadth-first explorer forks on undecided finite conditions. It uses the ConstraintKernel to reject infeasible paths. Concolic execution starts from a concrete benchmark, records branch conditions and negates selected conditions to generate nearby cases.

Primary uses:

- decision-row coverage;
- boundary-value generation;
- unreachable status detection;
- minimal semantic counterexamples;
- mutation benchmark generation;
- equivalence checks between circuit versions over bounded domains.

### 8.4 ConstraintKernel

A dependency-free kernel is built from small cooperating solvers.

#### 8.4.1 Finite-domain propagation

Variables have explicit finite domains. Constraints remove inconsistent values. The engine uses a queue of constraints affected by each domain change. If a domain becomes empty, the branch is inconsistent. If all are singleton, a model is found. Search chooses the smallest remaining domain.

#### 8.4.2 Equality and disequality

Use union-find for equality classes. Each root maintains disequality roots and optional type/domain metadata. Merging incompatible classes fails. Union by rank and path compression are sufficient.

#### 8.4.3 Rational intervals

Represent numbers as reduced numerator/denominator pairs. Interval constraints update lower and upper bounds with open/closed flags. Unit normalization occurs before comparison. Propagate inequalities until stable.

#### 8.4.4 Difference constraints

Constraints of the form `x - y <= c` become weighted graph edges. Bellman–Ford detects negative cycles and derives upper bounds. This covers many deadline and temporal-offset problems.

#### 8.4.5 Boolean search

A small DPLL-style solver supports clauses needed by decision tables and bounded model checks. Implement unit propagation, pure-literal elimination, stable variable selection and chronological backtracking. Learned clauses are optional until needed by benchmarks.

#### 8.4.6 Weighted objectives

For minimal repairs, use branch-and-bound over weighted soft constraints. Maintain the best known cost; prune partial assignments whose unavoidable cost already exceeds it. This provides a practical MaxSAT-like subset without implementing a full industrial solver.

### 8.5 Temporal reasoning

The temporal engine supports points, intervals and relative offsets.

- point inequalities use difference constraints;
- interval relations use the 13 Allen relations;
- each pair of intervals stores a possible-relation bitset;
- adding a relation intersects the bitset;
- path consistency composes relations through a third interval and narrows the pair;
- an empty bitset is a temporal contradiction.

For basic school-level and policy tasks, path consistency is a useful practical approximation. It is not a complete decision procedure for every temporal network; diagnostics must state the guarantee.

### 8.6 RelationEngine and fixed points

Datalog-like circuit fragments compile to finite relations and rules. Use semi-naive evaluation:

1. seed base relations;
2. for each recursive stratum, maintain `all` and `delta` relations;
3. in each round, evaluate rules with at least one recursive input from `delta`;
4. subtract already-known tuples;
5. continue until delta is empty;
6. evaluate stratified negation only after lower strata close.

This supports subtype closure, transitive dependency, reachability, provenance propagation and recursive policy derivation.

### 8.7 Transition systems and model checking

A circuit can project semantic events into a transition view. A state is a canonical finite tuple of relevant properties; transitions are typed events or procedural steps.

Initial algorithms:

- breadth-first reachability for shortest error witnesses;
- depth-first cycle detection;
- iterative deepening for bounded exploration;
- small deterministic monitor automata for precedence, response, absence, bounded response and completion patterns;
- explicit-state bounded model checking with constraint pruning.

A property such as “every approval is eventually followed by execution or cancellation” compiles to a monitor state machine. The monitor consumes the trace and emits a witness for violation or an inconclusive status if the observed trace is incomplete.

### 8.8 Predicate abstraction and semantic CEGAR

A circuit or method defines abstract predicates relevant to a concern, such as `authorized`, `supported`, `currentSource`, `sameActor` or `exceptionApplies`. The abstract model is checked. A possible violation is concretized against the SemanticStore.

If concretization fails, the runtime creates a typed `RefinementDemand` identifying the lost distinction:

- identity refinement;
- temporal-order refinement;
- coverage refinement;
- source-authority refinement;
- ontology refinement;
- finer predicate split.

The demand can activate an existing circuit or become a coding task. This is semantic CEGAR: refine only where the current verdict depends on an abstraction.

### 8.9 Automata and packed derivations

Finite and weighted automata are useful for local lexical patterns, protocols, procedure traces and CNL grammars. The runtime provides:

- deterministic and nondeterministic finite automata;
- weighted transitions over a generic semiring interface;
- tree-pattern matching over term DAGs;
- packed derivation charts for repeated subparses or interpretations.

Semiring evaluation supports Boolean existence, minimum cost, Viterbi best derivation, counting and provenance accumulation using the same dynamic program.

### 8.10 Knowledge compilation and decision DAGs

Stable Boolean/finite rule fragments can be compiled into reduced decision DAGs.

Reference algorithm:

1. choose a stable variable order from dependency structure and frequency;
2. recursively condition the rule function on each variable;
3. memoize `(variable-index, residual-function)`;
4. merge identical low/high children;
5. eliminate nodes whose low and high children are equal.

The resulting DAG supports fast repeated conditioning, satisfiability, implication and influence queries. If it grows beyond a configured threshold, the system falls back to ordinary decision evaluation and records the reason.

### 8.11 Rewriting and EGraphLite

Directed normalization rules handle units, temporal expressions, logical forms and canonical terminology. For equivalence-preserving alternatives, EGraphLite maintains equivalence classes using union-find and congruence hashing.

Saturation proceeds in bounded rounds:

1. match registered rewrite rules against e-classes;
2. add new terms and equivalence unions;
3. rebuild congruence closure;
4. stop on saturation or budget;
5. extract the lowest-cost term with dynamic programming over e-classes.

Rewrites must be ontology- and context-qualified. Natural-language paraphrases are never declared universally equivalent without scope and modality conditions.

### 8.12 Program slicing

The provenance/dependency graph supports:

- backward slice: everything influencing a finding;
- forward slice: everything influenced by a claim or source span;
- chop: nodes on paths between a source set and result set;
- differential slice: dependencies that differ between two results or interpretations.

Slicing reduces explanations and context sent to a coding agent or LLM.

### 8.13 Partial evaluation and specialization

When agent profile, ontology, jurisdiction, text type or fixed policy parameters are known, a circuit can be specialized.

- bind known constants and pack facts;
- execute static queries and normalizations;
- remove unreachable branches;
- preselect providers;
- residualize dynamic source-dependent stages;
- run equivalence-oriented tests against the unspecialized circuit.

Specialized circuits are cached by source-independent plan identity. They are optimization artifacts, not separate semantic authorities.

### 8.14 Factor graphs and probabilistic circuits

Uncertainty engines are optional and explicitly approximate unless tractability conditions hold.

A factor view contains variables, finite domains and local factors. For acyclic graphs, sum-product or max-product message passing is exact. For cyclic graphs, bounded loopy propagation may be used only with an `APPROXIMATE` guarantee and convergence diagnostics.

Probabilistic circuits may represent decomposable uncertainty over interpretation alternatives. They are not required in the minimal runtime. Their outputs must remain separate from four-valued semantic truth and may influence ranking, not silently determine rule satisfaction.

## 9. Method-provider interface

Each method engine exports a descriptor and provider:

```js
export default methodProvider("finite-domain-constraints")
  .accepts(viewKind("ConstraintView"))
  .provides(capability("ConstraintModel"), guarantee("exact-for-finite-domain"))
  .cost(medium())
  .applicable(whenFiniteDomains())
  .execute(runFiniteDomainSolver)
  .explain(explainConstraintResult)
  .seal();
```

The planner selects providers based on hard compatibility before cost. A circuit can require a guarantee class, not a concrete engine name.

## 10. Cache and freshness

### 10.1 Cache key

A reusable result key includes:

- operation or circuit identity and version;
- canonical inputs;
- source snapshot ID;
- ontology stack identity;
- intent/plan identity when relevant;
- interpretation context;
- method provider and version;
- framework semantics version.

### 10.2 Cache storage

Caches may use `v8.serialize` or a simple project binary encoding. They are disposable. No canonical result depends on a cache being present.

### 10.3 Freshness

External facts, model-generated artifacts or source snapshots carry explicit freshness metadata. A circuit requiring current facts must reject or downgrade stale evidence. The framework does not infer temporal freshness from filesystem modification time alone.

## 11. Trace and proof objects

Every stage records:

- semantic inputs and outputs;
- source and ontology dependencies;
- circuit/method identity;
- interpretation context;
- decision row or constraint reason;
- cache use;
- diagnostics;
- elapsed cost metadata.

Local proof objects are replayable data structures constructed in `.mjs` or binary trace form. The ProofKernel should check a small set of proof steps: equality substitution, subtype application, interval comparison, relation-rule application, decision-row satisfaction and contradiction from an unsatisfiable constraint set. It is not a general proof assistant.

## 12. Diagnostics

Important runtime diagnostics include:

- `PLAN_NO_PROVIDER`
- `PLAN_CAPABILITY_CYCLE`
- `PLAN_ONTOLOGY_INCOMPATIBLE`
- `QUERY_MISSING_COVERAGE`
- `QUERY_INTERPRETATION_CONFLICT`
- `CIRCUIT_DUPLICATE_INSTANCE`
- `CIRCUIT_UNDECLARED_OUTPUT`
- `FIXPOINT_NON_TERMINATING_DOMAIN`
- `FIXPOINT_UNSTRATIFIED_NEGATION`
- `ABSTRACT_OPAQUE_STAGE`
- `ABSTRACT_WIDENED_TO_TOP`
- `SYMBOLIC_UNSUPPORTED_OPERATION`
- `CONSTRAINT_UNSAT`
- `TEMPORAL_INCONSISTENT`
- `MODEL_CHECK_COUNTEREXAMPLE`
- `REFINEMENT_REQUIRED`
- `REWRITE_BUDGET_EXCEEDED`
- `KNOWLEDGE_COMPILE_BLOWUP`
- `APPROXIMATE_NONCONVERGENCE`
- `CNL_ROUNDTRIP_MISMATCH`

Each diagnostic includes the responsible stage, semantic handles, trace slice and suggested skill routing.

## 13. Module layout

```text
framework/runtime/
  store/
    semantic-store.mjs
    transaction.mjs
    canonicalize.mjs
    indexes.mjs
  query/
    patterns.mjs
    planner.mjs
    execute.mjs
    coverage.mjs
  planner/
    registry.mjs
    capability-search.mjs
    ranking.mjs
    explain.mjs
  scheduler/
    graph.mjs
    agenda.mjs
    epochs.mjs
    invalidate.mjs
  methods/
    abstract/
    symbolic/
    constraints/
    temporal/
    relations/
    transition/
    automata/
    decision/
    rewrite/
    slicing/
    specialize/
    factors/
  trace/
  cache/
```

## 14. Acceptance criteria

The runtime is coherent when it can:

- commit a multi-file LongText transaction into one store;
- answer typed pattern queries without exposing physical fields;
- enforce interpretation and coverage semantics;
- compose circuits by capability and per-match instantiation;
- execute a dynamic dataflow graph deterministically;
- reuse unchanged results after a local source edit;
- compute a recursive relation by semi-naive fixed point;
- run abstract preflight and report must/may statuses;
- symbolically cover a decision table with the internal ConstraintKernel;
- check a temporal network and return a witness for inconsistency;
- create a refinement demand from a spurious abstract finding;
- emit a trace slice and CNL explanation;
- operate entirely with project `.mjs` modules and Node.js built-ins.
<!-- ORIGINAL SPECIFICATION END: DS-003_SemanticStore_Circuit_Runtime_and_Analysis_Algorithms.md -->

### Additive implementation alignment

The runtime implements transactional storage, indexed queries, deterministic scheduling, capability planning, traces, caching, exact rationals, finite-domain and Boolean solving, difference constraints, union-find, Allen relations, fixed points, automata, abstract interpretation, symbolic paths, state exploration, decision DAGs, rewriting, slicing, specialization, and factor inference.

## Decisions & Questions

### Question #1: Why is the original specification embedded instead of replaced by a normalized rewrite?

Response: Source fidelity is an explicit project requirement. The embedded body remains byte-for-byte identical to the original file; official metadata, implementation alignment, and decision records are additive.

### Question #2: Which text wins if an additive note appears narrower than the preserved contract?

Response: The preserved normative requirement remains authoritative. An implementation-alignment note reports confirmed current behavior and cannot silently weaken the original contract.

### Question #3: How does symbolic decision coverage handle an omitted four-valued truth facet?

Response: Truth facets for one operand are mutually exclusive. They are exactly-one only when TRUE, FALSE, UNKNOWN, and CONFLICT are all declared. A partial table uses at-most-one constraints, so an omitted facet remains a path with no matching row. Symbolic path artifacts attach the selected row or missing-row output and its evidence identities without changing concrete decision semantics.

## Conclusion

Future changes must preserve the embedded source contract, extend implementation and tests to meet it, and record contract-shaping rationale in numbered entries here.
