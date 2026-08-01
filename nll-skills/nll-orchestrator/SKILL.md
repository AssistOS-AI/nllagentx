# nll-orchestrator

## Purpose and invocation

Use when implementing or changing the CLI, workspace layout, source ingestion, run context, coding-agent adapter, skill installation, locks, logs or process lifecycle.

This skill is installed from `project/nll-skills/nll-orchestrator/` into a run-local `skills/nll-orchestrator/` directory. Read this file before editing. Do not look for `.agents`, `.codex` or hidden skill discovery. The run's `INSTRUCTIONS.md` is authoritative for working directory and requested phase.

## Required design specifications

- `DS-001_Workspaces_CLI_Coding_Agents_and_Skills.md`

Read the primary DS first, then only the domain DS files named by the run context. Generated catalogs summarize the current implementation but do not override the DS contract.

## Canonical edit scope

framework/cli, framework/tools, framework/runtime orchestration, nllAgent executable and workspace tests.

Codex works directly on canonical files in YOLO/direct-editing mode. There is no patch-staging or nllAgent approval phase. Do not modify unrelated agents or tasks.

## Required tools before or during work

- `nllAgent files index`
- `nllAgent context build`
- `nllAgent context show`
- `nllAgent source ingest`
- `nllAgent source outline`
- `nllAgent review bundle`

Use generated catalogs and source-slice tools before loading large implementation trees or whole documents into context.

## Workflow

1. Verify the canonical repository and path-resolution rules.
2. Implement one CLI command as a thin orchestration layer over reusable modules.
3. Ensure every semantic command requires --agent and task commands require --task where applicable.
4. Build run directories, copy only selected skills and generate INSTRUCTIONS.md.
5. Invoke Codex through CodingAgentAdapter in direct-editing mode; do not stage or approve patches.
6. Implement fresh-process execution, lock handling, logs and deterministic exit statuses.
7. Add unit and end-to-end workspace tests using temporary directories.

## Implementation rules

- Use ordinary `.mjs` modules and fluent nllAgent SDK APIs.
- Do not create JSON or TypeScript artifacts.
- Do not add third-party runtime dependencies.
- Full JavaScript is allowed; semantic effects must pass through SDK transactions, circuit outputs or declared tool interfaces.
- Create or update tests as part of the same coding phase.
- Preserve provenance, interpretation context, coverage and explicit unknown status.
- Prefer reusable framework or agent code over task-local duplication when the abstraction is real.

## Completion criterion

CLI commands create the exact paths in DS-001, Codex can be launched and awaited, post-run checks can be executed, and no hidden skill directory or JSON manifest is introduced.

At completion, run the fast checks named in `INSTRUCTIONS.md`, summarize changed canonical files and leave any genuinely blocked issue as a typed diagnostic or refinement demand. Do not claim success merely because code imports.

## Executable SDK integration

The adjacent `workflow.mjs` is the executable skill contract. The CLI loads it through the SDK, resolves its skill dependencies transitively, and generates only the context artifacts declared there. The workflow never searches hidden skill directories.

At runtime, `nllAgent context build` resolves either `--agent <name>` or `--agent-dir <path>`, and either `--task <id>` or `--task-dir <path>`. It imports framework default knowledge, then profile, agent, and task ontologies/circuits in that precedence order. Generated `SDK_CATALOG.md`, `ONTOLOGY_CATALOG.md`, `CIRCUIT_CATALOG.md`, and `PROFILE_RESOLUTION.md` describe the actual resolved modules. Skill code must use those SDK constructors and ontology identities; it must not copy catalog prose into semantic modules or replace executable DSL code with data manifests.

The task folder owns source, IntentJS, LongTextJS, task-local ontology/circuit code, tests, runs, and results. The agent folder owns reusable extensions. A reusable dependency belongs in the framework or agent layer, while a source-specific interpretation belongs in the task layer.
