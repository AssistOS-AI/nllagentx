# nll-runtime

## Purpose and invocation

Use when implementing SemanticStore, transactions, indexes, query planning, scheduler, capability planning, traces, caches or analysis-method engines.

This skill is installed from `project/nll-skills/nll-runtime/` into a run-local `skills/nll-runtime/` directory. Read this file before editing. Do not look for `.agents`, `.codex` or hidden skill discovery. The run's `INSTRUCTIONS.md` is authoritative for working directory and requested phase.

## Required design specifications

- `DS-003_SemanticStore_Circuit_Runtime_and_Analysis_Algorithms.md`

Read the primary DS first, then only the domain DS files named by the run context. Generated catalogs summarize the current implementation but do not override the DS contract.

## Canonical edit scope

framework/runtime, framework/sdk/analysis adapters and focused runtime tests.

Codex works directly on canonical files in YOLO/direct-editing mode. There is no patch-staging or nllAgent approval phase. Do not modify unrelated agents or tasks.

## Required tools before or during work

- `nllAgent sdk check`
- `nllAgent ontology check`
- `nllAgent longtext execute`
- `nllAgent circuit plan`
- `nllAgent circuit run`
- `nllAgent circuit abstract`
- `nllAgent circuit symbolic`
- `nllAgent trace slice`
- `nllAgent test framework`

Use generated catalogs and source-slice tools before loading large implementation trees or whole documents into context.

## Workflow

1. Identify the logical contract and physical index or method view required.
2. Implement a small kernel with deterministic iteration and canonical handles.
3. Keep store semantics independent of storage fields and method-specific views.
4. Provide diagnostics and trace reasons for every blocked or approximate result.
5. Write a slow reference algorithm for differential testing when practical.
6. Test invalidation, replay and interaction with existing planners.
7. Document any guarantee boundary in the descriptor and catalog.

## Implementation rules

- Use ordinary `.mjs` modules and fluent nllAgent SDK APIs.
- Do not create JSON or TypeScript artifacts.
- Do not add third-party runtime dependencies.
- Full JavaScript is allowed; semantic effects must pass through SDK transactions, circuit outputs or declared tool interfaces.
- Create or update tests as part of the same coding phase.
- Preserve provenance, interpretation context, coverage and explicit unknown status.
- Prefer reusable framework or agent code over task-local duplication when the abstraction is real.

## Completion criterion

The kernel satisfies its declared guarantee on tests, preserves provenance and interpretation context, and can be selected through the method/capability registry.

At completion, run the fast checks named in `INSTRUCTIONS.md`, summarize changed canonical files and leave any genuinely blocked issue as a typed diagnostic or refinement demand. Do not claim success merely because code imports.

## Executable SDK integration

The adjacent `workflow.mjs` is the executable skill contract. The CLI loads it through the SDK, resolves its skill dependencies transitively, and generates only the context artifacts declared there. The workflow never searches hidden skill directories.

At runtime, `nllAgent context build` resolves either `--agent <name>` or `--agent-dir <path>`, and either `--task <id>` or `--task-dir <path>`. It imports framework default knowledge, then profile, agent, and task ontologies/circuits in that precedence order. Generated `SDK_CATALOG.md`, `ONTOLOGY_CATALOG.md`, `CIRCUIT_CATALOG.md`, and `PROFILE_RESOLUTION.md` describe the actual resolved modules. Skill code must use those SDK constructors and ontology identities; it must not copy catalog prose into semantic modules or replace executable DSL code with data manifests.

The task folder owns source, IntentJS, LongTextJS, task-local ontology/circuit code, tests, runs, and results. The agent folder owns reusable extensions. A reusable dependency belongs in the framework or agent layer, while a source-specific interpretation belongs in the task layer.
