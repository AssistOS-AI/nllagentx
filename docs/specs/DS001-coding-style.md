---
id: DS001
title: Coding Style, Module Structure, and Test Organization
status: implemented
owner: nllAgent maintainers
summary: Establishes the coding-style authority for dependency-free production modules, generated artifacts, and deterministic tests.
---

# DS001 — Coding Style, Module Structure, and Test Organization

## Introduction

This specification is the coding-style authority for the repository. Future agents must read it before changing source layout, module APIs, generators, tests, documentation, or command behavior.

## Core Content

All runtime, SDK, semantic, tool, test, and generated code must use ECMAScript modules with the `.mjs` suffix and Node.js built-ins only. Public DSL APIs should use small immutable value objects and fluent builders that seal into stable semantic models. Modules must have one coherent responsibility, depend on narrower layers, and expose extension points through registries, adapters, builders, or explicit interfaces. Domain-specific behavior belongs in packs or agent-local modules rather than conditional code in the CLI.

Semantic identities must be deterministic. Collections that have set semantics must canonicalize order; sequences must preserve order; bags must preserve multiplicity. Public handles and sealed models must be immutable. Transactions must validate before commit and must never partially mutate the `SemanticStore` after failure. Typed diagnostic codes are stable interfaces; prose messages may evolve.

The source layout is authoritative: `framework/sdk` owns constructors and semantic values, `framework/runtime` owns execution and analysis algorithms, `framework/packs` owns default knowledge, `framework/tools` owns workspace adapters, `framework/cli` owns routing, `nll-skills` owns coding-agent workflows, `profiles` owns executable load policy, `examples` owns runnable examples, and `test-support` or `framework/test-support` owns reusable deterministic test utilities. Agent-specific code must remain under its agent folder; source-specific code must remain under its task folder.

Tests must use `node:test` and `node:assert/strict`. Test files end in `.test.mjs`. Unit tests cover public constructor boundaries and algorithms; pack tests cover ontology, circuit, intent, and CNL behavior; integration tests execute semantic modules through the real store and runner; evaluation suites remain separate from tests because they may invoke Codex. Fixtures and expected semantic structures must remain executable modules or text/CNL, never JSON snapshots.

Files should remain cohesive. The repository uses `fileSizesCheck.sh` to expose files above 500 lines as review candidates and above 800 lines as strong decomposition candidates. Generated preserved specifications may legitimately exceed these thresholds because splitting them would destroy source fidelity. Human-authored source lines should normally remain below 120 characters; generated tables and literal source preservation are exceptions when reflow would change meaning.

Edits must use additive, backward-compatible APIs where possible. Existing user content must not be deleted or silently reformatted. Generators must be deterministic, retained in `tools/`, and rerun whenever their inputs change. Generated output must pass syntax/import checks and focused behavioral tests.

All documentation, specifications, and code comments must be written in English. Code identifiers retain the project vocabulary. HTML documentation and affected DS files must be updated in the same change set as contract-shaping code changes. DS numbering must remain contiguous.

## Decisions & Questions

### Question #1: Why are large preserved DS files exempt from ordinary file-size decomposition?

Response: The user requires the original specification content to remain intact and unsummarized. The exemption applies only to preserved contract copies; executable source must still be decomposed by responsibility.

### Question #2: Are tooling manifests prohibited by the no-JSON semantic rule?

Response: No. The prohibition covers semantic artifacts and test oracles. Existing plugin and external-tool integration manifests may remain JSON because they are not OntologyJS, LongTextJS, IntentJS, CircuitJS, CNL, or evaluation semantics.

### Question #3: How are generated files reviewed?

Response: Review the generator and representative outputs, run the full generated test set, check reproducibility by rerunning the generator, and use `fileSizesCheck.sh` to identify exceptional artifacts.

## Conclusion

Repository code must remain modular, deterministic, executable, evidence-aware, and testable with Node.js alone. This file remains the single coding-style authority.
