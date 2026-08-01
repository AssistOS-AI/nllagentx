---
id: DS027
title: Ontology Skill Contract
status: implemented
owner: nll-ontology
summary: Authors pack-qualified OntologyJS modules and constructor facades.
---

# DS027 — Ontology Skill Contract

## Introduction

This specification makes the `nll-ontology` coding workflow part of the official contract. The executable companion is `nll-skills/nll-ontology/workflow.mjs`.

## Core Content

The CLI must load the executable workflow through the SDK, resolve its dependencies transitively, copy only the required skill folders into a run directory, and generate the context artifacts declared by that workflow. The coding agent must read the installed skill contract and resolved catalogs before editing canonical files.

### Preserved skill instructions

# nll-ontology

## Purpose and invocation

Use when a concept, frame, role, relation, lexicalization, stable pack fact or semantic law is missing or when creating a predefined/domain agent pack.

This skill is installed from `project/nll-skills/nll-ontology/` into a run-local `skills/nll-ontology/` directory. Read this file before editing. Do not look for `.agents`, `.codex` or hidden skill discovery. The run's `INSTRUCTIONS.md` is authoritative for working directory and requested phase.

## Required design specifications

- `DS-002_Internal_MJS_DSLs_and_SDK.md`
- `one or more DS-007–DS-019 domain specifications selected by the task`
- `DS041-agentic-natural-language-authoring.md`
- `DS042-adaptive-task-local-authoring-and-verification.md`

Read the primary DS first, then only the domain DS files named by the run context. Generated catalogs summarize the current implementation but do not override the DS contract.

## Canonical edit scope

framework pack ontologies, agent ontologies, task-local ontologies, lexicons, constructor facades and ontology tests.

Codex works directly on canonical files in YOLO/direct-editing mode. There is no patch-staging or nllAgent approval phase. Do not modify unrelated agents or tasks.

## Required tools before or during work

- `nllAgent catalog ontology`
- `nllAgent ontology show`
- `nllAgent ontology check`
- `nllAgent ontology build`
- `nllAgent ontology affected`
- `nllAgent sdk usage`
- `nllAgent source search`
- `nllAgent test packs`

Use generated catalogs and source-slice tools before loading large implementation trees or whole documents into context.
Apply tools to the current ownership scope. At agent scope, read the retained brief and run ontology/catalog checks
with `--agent-dir`; do not invoke `source search` without a task. Use `test agent` for agent-local ontologies and
`test packs --pack <id>` only when editing a framework pack. `ontology affected` requires an explicit
`--identity`, and `sdk usage` should name the narrow `ontology` surface.

## Workflow

1. Determine whether the need is a new semantic identity, lexicalization, subclass, relation, fact or circuit policy.
2. Reuse and import existing identities whenever semantically correct.
3. Define event/state frames with typed roles and explicit cardinality.
4. Keep application judgments out of ontology laws.
5. Add pack facts only when stable, scoped and provenance-classified.
6. Generate/update constructor facades and catalogs.
7. Add ontology, cross-pack and LongText-construction tests.
8. Run affected-circuit analysis and hand off required circuit updates.

## Implementation rules

- Use ordinary `.mjs` modules and fluent nllAgent SDK APIs.
- Do not create JSON or TypeScript artifacts.
- Do not add third-party runtime dependencies.
- Full JavaScript is allowed; semantic effects must pass through SDK transactions, circuit outputs or declared tool interfaces.
- Create or update tests as part of the same coding phase.
- Preserve provenance, interpretation context, coverage and explicit unknown status.
- Prefer reusable framework or agent code over task-local duplication when the abstraction is real.

## Natural-language authoring boundary

An agent brief may require the coding agent to learn reusable semantic distinctions and place them under the agent ontology folder. A task source may justify a task-local extension only when the meaning is genuinely source-specific. Ingestion never invents either module, and extracted source claims must not be promoted into stable ontology facts.

## Adaptive ontology audit

Compare every distinction required by the instruction and planned circuit with `ONTOLOGY_CATALOG.md`. Create a task-local ontology only when no inherited identity expresses a required meaning. Keep it minimal, versioned, typed, closed under its declared imports, and covered by focused tests plus facade generation when fluent constructors are needed. A term merely appearing in the source is not sufficient reason to mint a concept, and no task fact may be installed as default ontology knowledge.

## Completion criterion

The ontology expresses the needed meaning without redefining imported concepts, generated constructors are fluent and usable, and all closure/lexicon/tests pass.

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
