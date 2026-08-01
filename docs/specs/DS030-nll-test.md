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

The CLI must load the executable workflow through the SDK, resolve its dependencies transitively, copy only the required skill folders into a run directory, and generate the union of context artifacts declared by the complete dependency closure. The coding agent must read the installed skill contract, dependency-ordered instructions, exact selected specifications, and resolved live catalogs before editing canonical files.

The executable manifest is not a decorative index. Its specification references determine the DS files copied into the reading order; its context declarations select named run-local projections generated from live project modules; its tool declarations must resolve to implemented CLI commands; its dependency declarations determine installation and reading order; its edit roots state the ownership boundary; and its phases state where the workflow is applicable. Every declared context name and tool command must be validated by framework tests so a misspelling or stale declaration fails before a coding run is presented as usable.

The generated coding instructions must explain the goal, canonical working directory, project CLI, installed skill order, selected specifications, and exact context artifact inventory. Context artifacts remain compact projections for discovery: they name real SDK imports, loaded ontology identities, available semantic and response circuits, profile resolution, source units, or diagnostics. Codex must inspect canonical modules when it needs implementation detail and must write executable `.mjs` programs through the real SDK rather than translating catalog prose into inert data.

Correctness has two explicit layers. The skill's Markdown workflow tells Codex which narrow CLI checks to run while authoring. The run manifest records the standard deterministic check for the edited owner. Evaluation and adaptive authoring additionally apply phase-specific acceptance to imported modules, ontology diagnostics, source anchors, provider availability, focused tests, concrete findings, requested auxiliary assurance, and the public CNL response. Documentation must identify which layer runs automatically for each command and must not describe a suggested check as if the framework had already executed it.

### Preserved skill instructions

# nll-test

## Purpose and invocation

Use when adding or repairing deterministic tests, generators, mutations, reference implementations or test commands.

This skill is installed from `project/nll-skills/nll-test/` into a run-local `skills/nll-test/` directory. Read this file before editing. Do not look for `.agents`, `.codex` or hidden skill discovery. The run's `INSTRUCTIONS.md` is authoritative for working directory and requested phase.

## Required design specifications

- `DS-005_Testing_and_Developer_Verification.md`
- `DS042-adaptive-task-local-authoring-and-verification.md`
- `DS043-primary-markdown-cnl-response.md`
- `DS044-response-circuit-composition-and-intent-presentation.md`

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
7. Assert the public `response.md`: expected stable code/status/group tags, meaningful rule text, exact input quotations, group counts, omission of internal/non-applicable results, absence of raw executable/assurance projections and byte-stable replay.
8. Run fast and relevant standard suites.

For adaptive review, treat deterministic acceptance as an invariant: ontology diagnostics, anchor validity, provider closure, task tests, material concrete output, qualitative Markdown CNL, response-circuit selection, abstract convergence, complete symbolic paths and response replay may be repaired but never disabled or weakened. Add a regression test for each observed failure before claiming that a cycle is accepted.

## Implementation rules

- Use ordinary `.mjs` modules and fluent nllAgent SDK APIs.
- Do not create JSON or TypeScript artifacts.
- Do not add third-party runtime dependencies.
- Full JavaScript is allowed; semantic effects must pass through SDK transactions, circuit outputs or declared tool interfaces.
- Create or update tests as part of the same coding phase.
- Preserve provenance, interpretation context, coverage and explicit unknown status.
- Prefer reusable framework or agent code over task-local duplication when the abstraction is real.

## Completion criterion

Tests fail for the intended semantic or response defect, pass deterministically, use no JSON snapshots, validate human-readable Markdown directly, and can run without Codex.

At completion, run the fast checks named in `INSTRUCTIONS.md`, summarize changed canonical files and leave any genuinely blocked issue as a typed diagnostic or refinement demand. Do not claim success merely because code imports.

## Executable SDK integration

The adjacent `workflow.mjs` is the executable skill contract. The CLI loads it through the SDK, resolves its skill dependencies transitively, and generates only the context artifacts declared there. The workflow never searches hidden skill directories.

At runtime, `nllAgent context build` resolves either `--agent <name>` or `--agent-dir <path>`, and either `--task <id>` or `--task-dir <path>`. It imports framework default knowledge, then profile, agent, and task ontologies, semantic circuits and response circuits in that precedence order. Generated `SDK_CATALOG.md`, `ONTOLOGY_CATALOG.md`, `CIRCUIT_CATALOG.md`, `RESPONSE_CIRCUIT_CATALOG.md`, and `PROFILE_RESOLUTION.md` describe the actual resolved modules. Skill code must use those SDK constructors and ontology identities; it must not copy catalog prose into semantic modules or replace executable DSL code with data manifests.

The task folder owns source, IntentJS, LongTextJS, task-local ontology/semantic-circuit/response-circuit code, tests, runs, and results. The agent folder owns reusable extensions. A reusable dependency belongs in the framework or agent layer, while a source-specific interpretation belongs in the task layer.


## Decisions & Questions

### Question #1: Why does the skill have both Markdown and executable forms?

Response: `SKILL.md` provides operational guidance to the coding agent; `workflow.mjs` provides machine-resolvable specifications, dependencies, tools, edit roots, and phases. Both are loaded from the same skill folder and must remain synchronized.

### Question #2: How does the skill obtain SDK and ontology knowledge?

Response: It consumes run-local `SDK_CATALOG.md`, `ONTOLOGY_CATALOG.md`, `CIRCUIT_CATALOG.md`, `PROFILE_RESOLUTION.md`, source outlines, and the exact DS files selected by its workflow. It must use resolved constructors rather than duplicating theory into task code.

### Question #3: How is sufficient context selected without copying the whole project?

Response: The requested phase selects one or more root skills. Dependency-first closure produces the installed skill order, and the union of their manifest declarations produces the exact DS and context inventory. Each catalog is generated from the currently resolved project, profile, agent, task, and decoded source state. Codex follows identities and import paths from those projections into canonical code only when the phase needs more detail.

### Question #4: What proves that a skill declaration is executable?

Response: Framework tests load every manifest, close every dependency graph, reject cycles, validate every context artifact name, and route every declared tool through the real CLI. Authoring evaluations then retain the installed skill, instructions, catalogs, process evidence, edited paths, and phase-specific deterministic acceptance. The Markdown instructions alone are not proof of a successful run.

## Conclusion

The skill is complete only when its workflow resolves through the real SDK, its edit boundary is respected, and its mandatory deterministic checks pass.
