---
id: DS022
title: Architect Skill Contract
status: implemented
owner: nll-architect
summary: Decomposes requests into artifact ownership, pack selection, and ordered work phases.
---

# DS022 — Architect Skill Contract

## Introduction

This specification makes the `nll-architect` coding workflow part of the official contract. The executable companion is `nll-skills/nll-architect/workflow.mjs`.

## Core Content

The CLI must load the executable workflow through the SDK, resolve its dependencies transitively, copy only the required skill folders into a run directory, and generate the context artifacts declared by that workflow. The coding agent must read the installed skill contract and resolved catalogs before editing canonical files.

### Preserved skill instructions

# nll-architect

## Purpose and invocation

Use when a new semantic agent, rule family, domain pack, complex task, or cross-cutting feature needs decomposition before code is written.

This skill is installed from `project/nll-skills/nll-architect/` into a run-local `skills/nll-architect/` directory. Read this file before editing. Do not look for `.agents`, `.codex` or hidden skill discovery. The run's `INSTRUCTIONS.md` is authoritative for working directory and requested phase.

## Required design specifications

- `DS-000_System_Architecture_and_Check_Catalog.md`
- `DS-004_IntentJS_Load_Profiles_and_Dynamic_Circuit_Selection.md`
- `DS041-agentic-natural-language-authoring.md`
- `DS042-adaptive-task-local-authoring-and-verification.md`
- `DS043-primary-markdown-cnl-response.md`
- `DS044-response-circuit-composition-and-intent-presentation.md`

Read the primary DS first, then only the domain DS files named by the run context. Generated catalogs summarize the current implementation but do not override the DS contract.

## Canonical edit scope

agent.mjs, task.mjs, architecture-plan.mjs, work-plan.mjs, profile selection and ownership notes. It may create directory skeletons but does not implement deep SDK algorithms.

Codex works directly on canonical files in YOLO/direct-editing mode. There is no patch-staging or nllAgent approval phase. Do not modify unrelated agents or tasks.

## Required tools before or during work

- `nllAgent files index`
- `nllAgent catalog sdk`
- `nllAgent catalog ontology`
- `nllAgent catalog circuit`
- `nllAgent profile resolve`
- `nllAgent source outline`
- `nllAgent context show`

Use generated catalogs and source-slice tools before loading large implementation trees or whole documents into context.
The run-local `context/` files already contain the requested catalog outputs. Invoke task-only source commands only
when `INSTRUCTIONS.md` names a task root. At agent scope, read `context/SOURCE_OUTLINE.md` directly; do not call
`source outline` without `--task`/`--task-dir`. `context show` requires the concrete run directory through
`--run <runs/run-id>` and is optional when the generated context files are already open.

## Workflow

1. Restate the semantic goal in terms of outputs, concerns, target texts and guarantees.
2. Identify which meanings belong in OntologyJS, which source facts belong in LongTextJS, which judgments belong in semantic CircuitJS, which presentation policy belongs in IntentJS and whether an orthogonal response circuit is required.
3. Choose framework packs, agent extensions and task-local artifacts. Prefer reuse over copying.
4. Decompose work into skill phases with canonical edit roots and dependencies.
5. Create architecture-plan.mjs and work-plan.mjs using fluent project builders.
6. List required tests, evaluation cases and the primary Markdown CNL contract: material filtering, grouping, stable tags, rule explanation, exact quotations and technical-artifact separation.
7. Run plan/profile/catalog checks and leave a concise handoff.

## Implementation rules

- Use ordinary `.mjs` modules and fluent nllAgent SDK APIs.
- Do not create JSON or TypeScript artifacts.
- Do not add third-party runtime dependencies.
- Full JavaScript is allowed; semantic effects must pass through SDK transactions, circuit outputs or declared tool interfaces.
- Create or update tests as part of the same coding phase.
- Preserve provenance, interpretation context, coverage and explicit unknown status.
- Prefer reusable framework or agent code over task-local duplication when the abstraction is real.

## Natural-language authoring boundary

When the requested phase targets an agent, read the retained agent brief and design reusable agent-owned ontology, semantic circuits, response circuits, CNL, profile policy and tests. When it targets a task, keep the instruction, grounded source interpretation and task-local extensions in that task. The framework prepares context and invokes the coding agent; it must not pre-author semantic modules or replace this phase with keyword extraction.

## Adaptive allocation decision

For adaptive analysis, inventory the inherited framework, profile and agent capabilities before proposing code. Put a meaning or circuit under the task when it is required only by the current source or has not yet earned a reusable contract. Do not copy an inherited provider into the task. Record any candidate promotion to the agent as a later review decision; adaptive authoring itself must not mutate reusable agent knowledge.

## Completion criterion

The plan names every semantic artifact, owner skill, selected DS file, target directory, test obligation and handoff. No unresolved design question blocks the next skill.

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

## Conclusion

The skill is complete only when its workflow resolves through the real SDK, its edit boundary is respected, and its mandatory deterministic checks pass.
