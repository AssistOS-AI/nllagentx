# nll-evaluate

## Purpose and invocation

Use when creating an evaluation suite, isolated evaluation agent, corpus task, metric or comparative report.

This skill is installed from `project/nll-skills/nll-evaluate/` into a run-local `skills/nll-evaluate/` directory. Read this file before editing. Do not look for `.agents`, `.codex` or hidden skill discovery. The run's `INSTRUCTIONS.md` is authoritative for working directory and requested phase.

## Required design specifications

- `DS-006_Evaluation_Agents_Tasks_and_Benchmarks.md`

Read the primary DS first, then only the domain DS files named by the run context. Generated catalogs summarize the current implementation but do not override the DS contract.

## Canonical edit scope

evaluations/<suite>, evaluation-agent directories, corpora metadata, gold .mjs/CNL artifacts and report generators.

Codex works directly on canonical files in YOLO/direct-editing mode. There is no patch-staging or nllAgent approval phase. Do not modify unrelated agents or tasks.

## Required tools before or during work

- `nllAgent agent create`
- `nllAgent task create`
- `nllAgent context build`
- `nllAgent code intent`
- `nllAgent code longtext`
- `nllAgent code circuit`
- `nllAgent evaluate`
- `nllAgent trace compare`

Use generated catalogs and source-slice tools before loading large implementation trees or whole documents into context.

## Workflow

1. Declare the evaluation question, permitted packs, coding-agent phases and metrics.
2. Create an isolated agent with no unrelated ontology/circuit leakage.
3. Create random-ID tasks and preserve all generated semantic artifacts.
4. Invoke Codex only in declared authoring phases.
5. Run deterministic concrete and required auxiliary analyses.
6. Compute semantic metrics from structures and traces.
7. Separate authoring, materialization, intent, circuit, runtime and dataset failures.
8. Generate task-level and suite-level Markdown reports.

## Implementation rules

- Use ordinary `.mjs` modules and fluent nllAgent SDK APIs.
- Do not create JSON or TypeScript artifacts.
- Do not add third-party runtime dependencies.
- Full JavaScript is allowed; semantic effects must pass through SDK transactions, circuit outputs or declared tool interfaces.
- Create or update tests as part of the same coding phase.
- Preserve provenance, interpretation context, coverage and explicit unknown status.
- Prefer reusable framework or agent code over task-local duplication when the abstraction is real.

## Completion criterion

The suite is reproducible, retains artifacts, compares declared profiles or systems, and reports metrics without conflating process failures with semantic findings.

At completion, run the fast checks named in `INSTRUCTIONS.md`, summarize changed canonical files and leave any genuinely blocked issue as a typed diagnostic or refinement demand. Do not claim success merely because code imports.

## Executable SDK integration

The adjacent `workflow.mjs` is the executable skill contract. The CLI loads it through the SDK, resolves its skill dependencies transitively, and generates only the context artifacts declared there. The workflow never searches hidden skill directories.

At runtime, `nllAgent context build` resolves either `--agent <name>` or `--agent-dir <path>`, and either `--task <id>` or `--task-dir <path>`. It imports framework default knowledge, then profile, agent, and task ontologies/circuits in that precedence order. Generated `SDK_CATALOG.md`, `ONTOLOGY_CATALOG.md`, `CIRCUIT_CATALOG.md`, and `PROFILE_RESOLUTION.md` describe the actual resolved modules. Skill code must use those SDK constructors and ontology identities; it must not copy catalog prose into semantic modules or replace executable DSL code with data manifests.

The task folder owns source, IntentJS, LongTextJS, task-local ontology/circuit code, tests, runs, and results. The agent folder owns reusable extensions. A reusable dependency belongs in the framework or agent layer, while a source-specific interpretation belongs in the task layer.
