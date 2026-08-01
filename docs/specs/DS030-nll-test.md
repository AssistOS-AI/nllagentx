---
id: DS030
title: Test Skill Contract
status: implemented
owner: nll-test
summary: Builds deterministic structural, differential, mutation, and integration checks.
---

# DS030 — Test Skill Contract

## Introduction

This specification makes the `nll-test` coding workflow part of the official contract. The executable companion is `nll-skills/nll-test/workflow.mjs`.

## Core Content

The CLI must load the executable workflow through the SDK, resolve its dependencies transitively, copy only the required skill folders into a run directory, and generate the context artifacts declared by that workflow. The coding agent must read the installed skill contract and resolved catalogs before editing canonical files.

### Preserved skill instructions

# nll-test

## Purpose and invocation

Use when adding or repairing deterministic tests, generators, mutations, reference implementations or test commands.

This skill is installed from `project/nll-skills/nll-test/` into a run-local `skills/nll-test/` directory. Read this file before editing. Do not look for `.agents`, `.codex` or hidden skill discovery. The run's `INSTRUCTIONS.md` is authoritative for working directory and requested phase.

## Required design specifications

- `DS-005_Testing_and_Developer_Verification.md`

Read the primary DS first, then only the domain DS files named by the run context. Generated catalogs summarize the current implementation but do not override the DS contract.

## Canonical edit scope

*.test.mjs files, test-support generators/assertions/fixtures and test CLI code.

Codex works directly on canonical files in YOLO/direct-editing mode. There is no patch-staging or nllAgent approval phase. Do not modify unrelated agents or tasks.

## Required tools before or during work

- `nllAgent test framework`
- `nllAgent test packs`
- `nllAgent test agent`
- `nllAgent test task`
- `nllAgent review bundle`

Use generated catalogs and source-slice tools before loading large implementation trees or whole documents into context.

## Workflow

1. Identify the semantic contract and possible wrong-reason successes.
2. Create focused valid, invalid, unknown, conflict and coverage cases.
3. Assert evidence, trace and diagnostics, not only status.
4. Add deterministic mutations and finite generators.
5. Use differential tests against a slow reference algorithm where applicable.
6. Keep the test independent of coding agents and network services.
7. Run fast and relevant standard suites.

## Implementation rules

- Use ordinary `.mjs` modules and fluent nllAgent SDK APIs.
- Do not create JSON or TypeScript artifacts.
- Do not add third-party runtime dependencies.
- Full JavaScript is allowed; semantic effects must pass through SDK transactions, circuit outputs or declared tool interfaces.
- Create or update tests as part of the same coding phase.
- Preserve provenance, interpretation context, coverage and explicit unknown status.
- Prefer reusable framework or agent code over task-local duplication when the abstraction is real.

## Completion criterion

Tests fail for the intended semantic defects, pass deterministically, use no JSON snapshots, and can run without Codex.

At completion, run the fast checks named in `INSTRUCTIONS.md`, summarize changed canonical files and leave any genuinely blocked issue as a typed diagnostic or refinement demand. Do not claim success merely because code imports.

## Executable SDK integration

The adjacent `workflow.mjs` is the executable skill contract. The CLI loads it through the SDK, resolves its skill dependencies transitively, and generates only the context artifacts declared there. The workflow never searches hidden skill directories.

At runtime, `nllAgent context build` resolves either `--agent <name>` or `--agent-dir <path>`, and either `--task <id>` or `--task-dir <path>`. It imports framework default knowledge, then profile, agent, and task ontologies/circuits in that precedence order. Generated `SDK_CATALOG.md`, `ONTOLOGY_CATALOG.md`, `CIRCUIT_CATALOG.md`, and `PROFILE_RESOLUTION.md` describe the actual resolved modules. Skill code must use those SDK constructors and ontology identities; it must not copy catalog prose into semantic modules or replace executable DSL code with data manifests.

The task folder owns source, IntentJS, LongTextJS, task-local ontology/circuit code, tests, runs, and results. The agent folder owns reusable extensions. A reusable dependency belongs in the framework or agent layer, while a source-specific interpretation belongs in the task layer.


## Decisions & Questions

### Question #1: Why does the skill have both Markdown and executable forms?

Response: `SKILL.md` provides operational guidance to the coding agent; `workflow.mjs` provides machine-resolvable specifications, dependencies, tools, edit roots, and phases. Both are loaded from the same skill folder and must remain synchronized.

### Question #2: How does the skill obtain SDK and ontology knowledge?

Response: It consumes run-local `SDK_CATALOG.md`, `ONTOLOGY_CATALOG.md`, `CIRCUIT_CATALOG.md`, `PROFILE_RESOLUTION.md`, source outlines, and the exact DS files selected by its workflow. It must use resolved constructors rather than duplicating theory into task code.

## Conclusion

The skill is complete only when its workflow resolves through the real SDK, its edit boundary is respected, and its mandatory deterministic checks pass.
