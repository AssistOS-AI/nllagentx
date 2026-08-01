---
id: DS007
title: Preserved Testing and Developer Verification
status: normative-implemented
owner: nllAgent architecture
summary: Preserves DS-005_Testing_and_Developer_Verification.md verbatim and records additive implementation alignment.
---

# DS007 — Preserved Testing and Developer Verification

## Introduction

This official specification preserves the complete original design contract. No wording from the source specification has been removed, shortened, or rewritten.

## Core Content

The following source specification is included verbatim from `design-specifications/DS-005_Testing_and_Developer_Verification.md`.

<!-- ORIGINAL SPECIFICATION START: DS-005_Testing_and_Developer_Verification.md -->
# DS-005 — Testing and Developer Verification

**Status:** Normative testing specification  
**Primary skill:** `nll-test`  
**Depends on:** DS-000–DS-004  
**Distinct from:** DS-006 evaluation

## 1. Purpose

This specification defines deterministic unit and integration testing for the framework, SDK, predefined packs, agents and tasks. Testing is an engineering activity over existing code. It does not invoke Codex or another coding agent. The built-in Node.js test runner and project `.mjs` helpers are sufficient.

Evaluation is different: it measures whether a coding agent can create task artifacts and whether the whole system performs useful semantic work on held-out documents. That process is defined in DS-006.

## 2. Testing principles

1. Test semantic structure, not only final labels.
2. A correct status produced for the wrong reason is a failure.
3. Preserve `UNKNOWN`, alternatives and coverage semantics.
4. Test every public primitive at concrete boundaries and, where declared, abstract/symbolic boundaries.
5. Use deterministic generators and mutation sets; do not depend on third-party property-testing libraries.
6. Keep fixtures executable as `.mjs` modules or source text; do not introduce JSON snapshots.
7. Test local edits and cache invalidation, not only clean runs.
8. Test CNL frame equivalence, not only rendered wording.
9. Every predefined pack must have isolated tests and profile-composition tests.
10. Tests must be runnable without a coding agent, network access or external services.

## 3. Test directory structure

```text
framework/
  sdk/**/__tests__/*.test.mjs
  runtime/**/__tests__/*.test.mjs
  packs/<pack>/tests/*.test.mjs
agents/<agent>/tests/*.test.mjs
agents/<agent>/tasks/<task>/tests/*.test.mjs
test-support/
  fixtures/
  generators/
  assertions/
  mutations/
  harness/
```

The package may expose `nllAgent test` commands, but the underlying tests use `node:test` and `node:assert/strict`.

## 4. Test layers

### 4.1 SDK constructor tests

Verify:

- semantic sort and identity;
- fluent chaining behavior;
- role cardinality and range checks;
- collection semantics;
- provenance attachment;
- immutable public handles;
- stable canonicalization;
- descriptor/catalog generation;
- import and export consistency.

A constructor test should build both valid and invalid terms. It should check diagnostics, not only exceptions.

### 4.2 Ontology tests

Each ontology module must test:

- unique pack-qualified identities;
- subtype closure;
- disjointness and equivalence consistency;
- frame required/optional/repeated roles;
- inherited role behavior;
- inverse relation consistency;
- lexicalization resolution;
- pack facts and source classes;
- generated constructor facade;
- compatibility with required base packs.

Cross-pack tests verify that two default packs do not redefine identities or introduce contradictory axioms.

### 4.3 LongText tests

LongText fixtures consist of a small source text and one or more `.longtext.mjs` modules. Tests verify:

- exact source anchors;
- source digest mismatch detection;
- entity/mention distinction;
- event and claim frame correctness;
- voice, modality, polarity and scope;
- identity alternatives;
- temporal and quantity normalization;
- coverage declarations;
- multi-file composition order independence;
- preservation of unknown information;
- deterministic transaction commit.

A LongText test must fail if the code fills an unsupported semantic slot merely to satisfy a later circuit.

### 4.4 Query tests

Use small hand-built SemanticStores to verify:

- type and role index lookup;
- joins and variable binding;
- subtype matching;
- interpretation compatibility;
- scope filtering;
- temporal predicates;
- aggregate and grouping semantics;
- coverage-aware absence;
- query-plan stability;
- physical-index independence.

Where practical, compare optimized query execution with a simple reference scan implementation.

### 4.5 Circuit tests

Every circuit ships with micro-cases covering:

- clear applicable success;
- clear violation or failure;
- not applicable;
- valid exception;
- incomplete exception;
- open versus closed scope;
- unknown input;
- conflicting interpretations;
- ontological incompatibility;
- evidence and explanation trace;
- requested CNLFrame output.

The test asserts status, selected evidence, evaluated conditions, activated subcircuits and trace shape.

### 4.6 Runtime tests

Verify:

- transaction atomicity;
- canonical interning;
- deterministic ready-queue order;
- duplicate circuit-instance suppression;
- content-addressed cache identity;
- invalidation after source edits;
- fixed-point convergence;
- stratified negation;
- epoch isolation;
- replay from source modules;
- blocked statuses for method or resource failure.

### 4.7 Intent and planner tests

Tests cover precedence, load profiles, all-compatible fallback, hard filtering, capability closure, method selection, plan explanation and stable ranking. Use pack descriptors with intentionally overlapping providers.

### 4.8 Analysis-method tests

Each engine has algorithm-specific tests.

- abstract domains: lattice laws, monotonic transfers, widening termination, must/may soundness on finite enumerations;
- symbolic engine: path coverage and infeasible-path pruning;
- finite domains: propagation and search completeness over bounded fixtures;
- union-find: equality/disequality conflict;
- rational intervals: normalization and bound propagation;
- difference constraints: negative-cycle detection;
- temporal network: relation composition and contradiction;
- relation engine: semi-naive result equals naïve fixed point;
- automata: accepted/rejected traces and weights;
- decision DAG: equivalence to direct rule evaluation;
- rewrite/e-graph: semantic preservation for registered rules;
- slicing: slice contains all dependencies and excludes irrelevant nodes;
- specialization: residual circuit agrees with general circuit on dynamic inputs;
- factor methods: exact results on trees and explicit approximate diagnostics on cycles.

### 4.9 CNL tests

For every supported frame type:

1. build a complete frame;
2. render canonical CNL;
3. parse the CNL where parser support exists;
4. compare semantic slots;
5. test missing mandatory slots;
6. test negation, modality, quantities, time and exceptions;
7. test prohibited ambiguity, especially pronouns;
8. verify provenance of every generated slot.

## 5. Deterministic test generators

The framework should provide small generator modules that accept a seed and enumerate or sample finite semantic spaces.

Examples:

- truth values and decision-table combinations;
- quantity boundaries around a limit;
- simple temporal interval networks;
- identity alias patterns;
- scope open/closed variants;
- modality and negation mutations;
- argument forms;
- short event traces;
- ontology subtype diamonds and disjointness cases.

Generators return semantic values through SDK constructors. Seed, generation parameters and expected invariants are `.mjs` exports.

## 6. Mutation testing

Mutation sets alter exactly one semantic feature:

- change actor;
- reverse polarity;
- move a claim into an exception scope;
- alter duration or unit;
- remove coverage;
- substitute a sibling concept;
- change temporal order;
- merge or separate identities;
- replace obligation with recommendation;
- remove evidence;
- introduce a contradictory claim;
- alter a CNL slot.

A circuit is sensitive if the expected result or status changes exactly where the rule semantics predicts. Mutation tests are particularly important for coding-agent-generated circuits because they expose overly broad lexical matches.

## 7. Reference models and differential tests

For complex optimized algorithms, maintain a small slow reference implementation:

- naïve relation fixed point;
- exhaustive finite-domain search;
- direct decision-table evaluation;
- simple query scan;
- explicit interpretation enumeration for tiny cases.

Differential tests compare the optimized engine with the reference over generated small inputs. This is an efficient substitute for a full formal proof for the experimental system.

## 8. Test oracles without JSON

Expected structured outputs may be expressed as:

- executable `.expected.mjs` modules that construct semantic values;
- CNL or text files for exact rendering;
- Markdown tables for human-inspected benchmark cases;
- binary traces generated during a test and compared through semantic replay, not raw bytes.

The project must not add JSON snapshot files.

## 9. Fast, standard and exhaustive suites

### 9.1 Fast

Runs import checks, constructor tests, changed pack tests and focused circuit micro-cases. Target: seconds to a few minutes.

### 9.2 Standard

Runs all framework and pack unit tests, mutation sets and moderate incremental tests. This is the normal post-Codex check.

### 9.3 Exhaustive

Runs bounded enumerations, differential algorithms, large source fixtures, all profiles and cache/invalidation stress tests. It is suitable for release or scheduled validation.

CLI:

```text
nllAgent test framework --level fast
nllAgent test packs --level standard
nllAgent test agent --agent <name> --level standard
nllAgent test task --agent <name> --task <id> --level fast
nllAgent test all --level exhaustive
```

## 10. Diagnostics assertions

Tests should assert diagnostic identity and responsible semantic handle. String messages are secondary and may evolve. A helper such as `assertDiagnostic(run, "QUERY_MISSING_COVERAGE", { circuit: circuitHandle })` avoids fragile full-text comparison.

## 11. Testing skills and coding-agent interaction

`nll-test` is used during authoring to tell Codex how to create or update tests, but the test run itself never calls Codex. A post-authoring workflow is:

1. Codex edits semantic code and tests under the relevant authoring skill;
2. nllAgent runs the fast or standard suite;
3. failures are collected in a review bundle;
4. a separate explicit `nllAgent code review` may invoke Codex with `nll-review`/`nll-test` context;
5. tests are rerun independently.

## 12. Minimum pack test contract

Every predefined domain pack must include:

- ontology import/closure tests;
- at least one constructor example per major frame family;
- one positive and one negative micro-case per circuit;
- unknown and conflict cases for circuits that can produce them;
- intent recognition tests;
- profile loading tests;
- CNL output tests where the pack advertises generation;
- cross-pack compatibility tests against `minimal-core` and `general-school`.

## 13. Acceptance criteria

Testing is complete when:

- all framework modules can be imported in fresh processes;
- all public constructors and descriptors are covered;
- every pack has independent tests;
- no unit-test command invokes a coding agent;
- query, scheduler and fixed-point engines pass differential tests;
- all-compatible profile tests enumerate every compatible circuit;
- CNL round-trip tests cover every supported frame family;
- local source edits invalidate only dependent results in test fixtures;
- no JSON or TypeScript test artifacts exist.
<!-- ORIGINAL SPECIFICATION END: DS-005_Testing_and_Developer_Verification.md -->

### Additive implementation alignment

The deterministic test layer uses node:test, a real fixture harness, semantic assertions, seeded finite generators, mutation helpers, framework algorithm tests, pack tests, example tests, CLI workspace tests, and explicit fast/standard/exhaustive selection.

## Decisions & Questions

### Question #1: Why is the original specification embedded instead of replaced by a normalized rewrite?

Response: Source fidelity is an explicit project requirement. The embedded body remains byte-for-byte identical to the original file; official metadata, implementation alignment, and decision records are additive.

### Question #2: Which text wins if an additive note appears narrower than the preserved contract?

Response: The preserved normative requirement remains authoritative. An implementation-alignment note reports confirmed current behavior and cannot silently weaken the original contract.



## Conclusion

Future changes must preserve the embedded source contract, extend implementation and tests to meet it, and record contract-shaping rationale in numbered entries here.
