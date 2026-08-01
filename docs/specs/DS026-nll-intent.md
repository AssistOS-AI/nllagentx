---
id: DS026
title: Intent Skill Contract
status: implemented
owner: nll-intent
summary: Authors IntentJS and resolves profiles, pack signals, concerns, and fallback selection.
---

# DS026 — Intent Skill Contract

## Introduction

This specification makes the `nll-intent` coding workflow part of the official contract. The executable companion is `nll-skills/nll-intent/workflow.mjs`.

## Core Content

The CLI must load the executable workflow through the SDK, resolve its dependencies transitively, copy only the required skill folders into a run directory, and generate the union of context artifacts declared by the complete dependency closure. The coding agent must read the installed skill contract, dependency-ordered instructions, exact selected specifications, and resolved live catalogs before editing canonical files.

The executable manifest is not a decorative index. Its specification references determine the DS files copied into the reading order; its context declarations select named run-local projections generated from live project modules; its tool declarations must resolve to implemented CLI commands; its dependency declarations determine installation and reading order; its edit roots state the ownership boundary; and its phases state where the workflow is applicable. Every declared context name and tool command must be validated by framework tests so a misspelling or stale declaration fails before a coding run is presented as usable.

The generated coding instructions must explain the goal, canonical working directory, project CLI, installed skill order, selected specifications, and exact context artifact inventory. Context artifacts remain compact projections for discovery: they name real SDK imports, loaded ontology identities, available semantic and response circuits, profile resolution, source units, or diagnostics. Codex must inspect canonical modules when it needs implementation detail and must write executable `.mjs` programs through the real SDK rather than translating catalog prose into inert data.

Correctness has two explicit layers. The skill's Markdown workflow tells Codex which narrow CLI checks to run while authoring. The run manifest records the standard deterministic check for the edited owner. Evaluation and adaptive authoring additionally apply phase-specific acceptance to imported modules, ontology diagnostics, source anchors, provider availability, focused tests, concrete findings, requested auxiliary assurance, and the public CNL response. Documentation must identify which layer runs automatically for each command and must not describe a suggested check as if the framework had already executed it.

### Preserved skill instructions

# nll-intent

## Purpose and invocation

Use for every new task and whenever pack selection, requested checks, outputs, assurance or fallback behavior changes.

This skill is installed from `project/nll-skills/nll-intent/` into a run-local `skills/nll-intent/` directory. Read this file before editing. Do not look for `.agents`, `.codex` or hidden skill discovery. The run's `INSTRUCTIONS.md` is authoritative for working directory and requested phase.

## Required design specifications

- `DS-004_IntentJS_Load_Profiles_and_Dynamic_Circuit_Selection.md`
- `DS041-agentic-natural-language-authoring.md`
- `DS042-adaptive-task-local-authoring-and-verification.md`
- `DS043-primary-markdown-cnl-response.md`
- `DS044-response-circuit-composition-and-intent-presentation.md`

Read the primary DS first, then only the domain DS files named by the run context. Generated catalogs summarize the current implementation but do not override the DS contract.

## Canonical edit scope

task intent/intent.mjs, intent-signals.mjs, plan.mjs, task-local profile overlays, response presentation policy and intent tests.

Codex works directly on canonical files in YOLO/direct-editing mode. There is no patch-staging or nllAgent approval phase. Do not modify unrelated agents or tasks.

## Required tools before or during work

- `nllAgent source outline`
- `nllAgent source search`
- `nllAgent catalog ontology`
- `nllAgent catalog circuit`
- `nllAgent catalog response`
- `nllAgent profile resolve`
- `nllAgent intent infer-signals`
- `nllAgent intent check`
- `nllAgent intent explain`
- `nllAgent plan show`

Use generated catalogs and source-slice tools before loading large implementation trees or whole documents into context.

## Workflow

1. Read explicit CLI/user/system requirements and preserve their precedence.
2. Inspect source structure and cheap domain signals.
3. Inspect core LongText semantic signals when available.
4. Select or infer domains, concerns, outputs, evidence policy and assurance. Every task requests `markdownCnl()` as its primary human-facing output.
5. Declare explicit exclusions, the whenUnclear policy and `.present(...)` directives for style, grouping, source quotation, rule explanation, stable tags and satisfied-result inclusion. Default to allCompatible.
6. Create a fluent IntentJS module and tests.
7. Run intent/profile/plan checks and explain selected and rejected packs.
8. Issue typed refinement demands instead of inventing missing ontology or source facts.

## Implementation rules

- Use ordinary `.mjs` modules and fluent nllAgent SDK APIs.
- Do not create JSON or TypeScript artifacts.
- Do not add third-party runtime dependencies.
- Full JavaScript is allowed; semantic effects must pass through SDK transactions, circuit outputs or declared tool interfaces.
- Create or update tests as part of the same coding phase.
- Preserve provenance, interpretation context, coverage and explicit unknown status.
- Prefer reusable framework or agent code over task-local duplication when the abstraction is real.

## Natural-language authoring boundary

IntentJS is authored by the coding agent from the explicit task instruction, CLI/system constraints, source outline and resolved catalogs. Signal inference may advise selection but must not silently write the canonical intent or stand in for the coding phase. The generated module remains task-owned and ordinary planning reuses it without another model call.

## Adaptive intent contract

In adaptive mode, name the semantic operation as a capability-bearing concern that the circuit registry can prove or expose as missing. Distinguish that concern from presentation outputs such as findings or CNL. Request `markdownCnl()`, concrete execution and the operator-selected auxiliary assurances. Use `.present(...)` with constructors from the CNL SDK to choose an evidence-led, analytical, concise or procedural response, grouping and filtering. Preserve the exact task instruction as provenance and do not broaden the request merely to make an inherited circuit selectable.

## Primary response policy

IntentJS selects how existing semantic results are presented; it never decides their truth. Prefer evidence-led analysis for validation, analytical grouping for comparison, concise output only when explicitly requested, and procedural output for generation or planning. Material violations, conflicts, unknowns and blocked results suppress unrelated confirmations unless `includeSatisfiedResults()` is explicitly justified. Never request raw assurance, JavaScript projections or non-applicable branches as the human answer.

## Completion criterion

IntentJS is executable, explains its provenance and fallback, requests Markdown CNL, defines a deterministic response policy, produces a deterministic semantic plan, and does not silently omit compatible checks.

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
