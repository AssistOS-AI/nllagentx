# nll-intent

## Purpose and invocation

Use for every new task and whenever pack selection, requested checks, outputs, assurance or fallback behavior changes.

This skill is installed from `project/nll-skills/nll-intent/` into a run-local `skills/nll-intent/` directory. Read this file before editing. Do not look for `.agents`, `.codex` or hidden skill discovery. The run's `INSTRUCTIONS.md` is authoritative for working directory and requested phase.

## Required design specifications

- `DS-004_IntentJS_Load_Profiles_and_Dynamic_Circuit_Selection.md`
- `DS041-agentic-natural-language-authoring.md`

Read the primary DS first, then only the domain DS files named by the run context. Generated catalogs summarize the current implementation but do not override the DS contract.

## Canonical edit scope

task intent/intent.mjs, intent-signals.mjs, plan.mjs, task-local profile overlays and intent tests.

Codex works directly on canonical files in YOLO/direct-editing mode. There is no patch-staging or nllAgent approval phase. Do not modify unrelated agents or tasks.

## Required tools before or during work

- `nllAgent source outline`
- `nllAgent source search`
- `nllAgent catalog ontology`
- `nllAgent catalog circuit`
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
4. Select or infer domains, concerns, outputs, evidence policy and assurance.
5. Declare explicit exclusions and the whenUnclear policy; default to allCompatible.
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

## Completion criterion

IntentJS is executable, explains its provenance and fallback, produces a deterministic plan, and does not silently omit compatible checks.

At completion, run the fast checks named in `INSTRUCTIONS.md`, summarize changed canonical files and leave any genuinely blocked issue as a typed diagnostic or refinement demand. Do not claim success merely because code imports.

## Executable SDK integration

The adjacent `workflow.mjs` is the executable skill contract. The CLI loads it through the SDK, resolves its skill dependencies transitively, and generates only the context artifacts declared there. The workflow never searches hidden skill directories.

At runtime, `nllAgent context build` resolves either `--agent <name>` or `--agent-dir <path>`, and either `--task <id>` or `--task-dir <path>`. It imports framework default knowledge, then profile, agent, and task ontologies/circuits in that precedence order. Generated `SDK_CATALOG.md`, `ONTOLOGY_CATALOG.md`, `CIRCUIT_CATALOG.md`, and `PROFILE_RESOLUTION.md` describe the actual resolved modules. Skill code must use those SDK constructors and ontology identities; it must not copy catalog prose into semantic modules or replace executable DSL code with data manifests.

The task folder owns source, IntentJS, LongTextJS, task-local ontology/circuit code, tests, runs, and results. The agent folder owns reusable extensions. A reusable dependency belongs in the framework or agent layer, while a source-specific interpretation belongs in the task layer.
