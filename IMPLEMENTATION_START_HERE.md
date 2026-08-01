# Implementation Start Here

This file is the shortest path from the package to code. It does not replace the design specifications.

## First framework pass

1. Read DS-000 and establish the authoritative decisions.
2. Implement DS-001 path resolution, agent/task/run creation, visible skill copying, context files and the Codex adapter.
3. Implement the minimal DS-002 kernel: semantic identities, opaque handles, fluent builders, collections, OntologyJS, source anchors, LongText transactions, CircuitJS contracts and IntentJS.
4. Implement the minimal DS-003 runtime: SemanticStore, essential indexes, query matching, capability registry, concrete dataflow scheduler, trace and CNLFrame emission.
5. Implement DS-004 profiles, pack descriptors, source signals and deterministic plan explanation.
6. Implement DS-005 fast tests before adding broad packs.
7. Add DS-007, DS-016 and DS-017 first: common sense, elementary logic and reasoning-error circuits form the most useful baseline.
8. Add the remaining domain packs and DS-006 evaluation suites incrementally.

## First end-to-end acceptance task

Create a `general-school-review` agent and one random-ID task containing a mixed prose document with:

- two actors and an ambiguous reference;
- a short event sequence and one continuity gap;
- a percentage calculation;
- a basic physical claim;
- a normative sentence with an exception;
- a small argument with one missing premise;
- a request for CNL observations and a structured composition plan.

Codex must generate `intent/intent.mjs`, multi-file LongTextJS and tests. The resolved profile should load only compatible packs, or all compatible packs when intent remains unclear. The runtime must emit evidence-bearing findings, explicit unknowns, the execution-plan explanation and CNL outputs. A second ordinary run must execute without Codex.

## Minimal public tools before broad domain work

Implement these commands early because every coding skill relies on them:

```text
nllAgent files index
nllAgent context build
nllAgent catalog sdk
nllAgent catalog ontology
nllAgent catalog circuit
nllAgent source outline
nllAgent source show
nllAgent source search
nllAgent source span
nllAgent source verify-anchors
nllAgent ontology check
nllAgent longtext check
nllAgent longtext execute
nllAgent longtext query
nllAgent intent check
nllAgent profile resolve
nllAgent plan --explain
nllAgent circuit check
nllAgent circuit run
nllAgent trace slice
nllAgent test framework
nllAgent test packs
nllAgent test task
```

## Implementation doctrine

- Add reusable primitives to the SDK when two or more circuits need the same semantics.
- Keep ontology identity separate from lexical wording.
- Keep source claims separate from facts about the world.
- Never conclude absence without compatible coverage.
- Preserve interpretation alternatives until an explicit aggregation policy is applied.
- Use query/dataflow and standard circuit kits for ordinary checks; use procedural stages for irregular algorithms without artificial restrictions.
- Add an auxiliary abstract or symbolic adapter only when its guarantee is useful; concrete execution remains valid without it.
- Write tests with every authoring change, but test execution itself never starts a coding agent.

## Current implementation entry point

The steps above are preserved as the original construction sequence. The implementation is now present. Use `node nllAgent.mjs help`, read `AGENTS.md` and `docs/index.html`, and run the committed validation task under `examples/validation-agent/`. New work must follow the authoritative `docs/specs/DS001-coding-style.md` contract and update the affected HTML and DS surfaces together.
