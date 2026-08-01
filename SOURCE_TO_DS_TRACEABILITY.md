# Source-to-DS Traceability

This package consolidates three stable nllAgent documents and the subsequent design decisions requested for the DS split. The latest detailed platform specification remains authoritative for workspace, CLI, coding-agent and full-JavaScript decisions; the conceptual monograph supplies scientific and algorithmic explanations; the task-directed volume supplies IntentJS, semantic views and method-selection architecture.

## Source volumes

1. **nllAgent — Detailed Specification of an Agentic Platform for Semantic Programming of Long Documents**
2. **nllAgent — Conceptual and Scientific Foundations of Dynamic Semantic Circuits**
3. **nllAgent — Task-Directed Semantic Analysis and Compact Reasoning Methods**

The earlier **Dynamic Semantic Circuits for Natural Language** document is used as historical conceptual input where it remains compatible, especially for dynamic SSA/dataflow, capability planning, provenance and CNL frames. Conflicting restrictions from that earlier draft are not carried forward.

## Traceability table

| Source subject | Consolidated DS location |
|---|---|
| System contract, semantic authority, explicit uncertainty and non-goals | DS-000 |
| Repository, agents, tasks, runs, source units, concurrency and module resolution | DS-001 |
| CLI, CodingAgentAdapter, Codex direct-editing mode, context building and review runs | DS-001 |
| Visible run-local skills and coding-agent tool surface | DS-001 plus `nll-skills/` |
| Many-sorted term algebra, semantic handles and collections | DS-002 |
| OntologyJS executable signatures and generated constructors | DS-002 and DS-007–DS-019 |
| LongTextJS grounding, claims, contexts, alternatives, identity, time and coverage | DS-002 |
| CircuitJS contracts, query algebra, decision tables, procedural stages and composition | DS-002 and DS-003 |
| IntentJS and task-purpose semantics | DS-004 |
| One logical SemanticStore and physical indexes | DS-003 |
| Semantic transactions, canonical IDs and provenance | DS-003 |
| Dynamic dataflow, epochs, scheduling, cache and invalidation | DS-003 |
| Capability planning and method selection | DS-003 and DS-004 |
| Abstract interpretation, symbolic/concolic execution, constraints and CEGAR | DS-003 |
| Fixed points, relation evaluation, automata, bounded model checking and monitors | DS-003 |
| Rewriting/e-graphs, decision DAGs, slicing, specialization and factorized uncertainty | DS-003 |
| Controlled generation, CNLFrames and round-trip checking | DS-000, DS-002 and domain DS files |
| Unit/integration/mutation/differential testing | DS-005 |
| Isolated evaluation agents, random task IDs, Codex authoring and retained CNL outputs | DS-006 |
| Source-driven intent discovery, load profiles and `all-compatible` fallback | DS-004 |
| Broad lower-secondary common-sense and domain knowledge extension requested after the source volumes | DS-007–DS-019 |
| Check catalog for literary, legal, policy, manual, textbook, scientific and argumentative texts | DS-000 and domain DS files |
| Reference profile code and registry skeletons | `profiles/` and `catalogs/` |
| Fluent reference modules for all four internal DSL roles | `examples/` |

## Resolved contradictions

The DS package deliberately resolves earlier tensions as follows:

- All semantic authoring artifacts are ordinary, fully expressive `.mjs` modules. They are not restricted JavaScript subsets and are not JSON-shaped configurations.
- nllAgent does not approve or stage coding-agent patches. Codex edits canonical files directly, creates tests and decides the implementation during its run. nllAgent may execute deterministic checks or start a separate review run.
- Deployment isolation is external and creates no framework subsystem or SDK restriction.
- The runtime has one logical SemanticStore. Method-specific graphs, relations, constraints, automata and factor views are provenance-preserving projections.
- A circuit has one primary semantic responsibility but can combine several computational methods.
- Concrete semantic execution is mandatory for end-to-end tasks. Abstract, symbolic, constraint, proof or approximate interpretations are additional declared passes, not synonyms for ordinary execution.
- Default intent is broad. When no instruction narrows the task, the planner uses `all-compatible` and runs every satisfiable compatible circuit in the resolved registry.
