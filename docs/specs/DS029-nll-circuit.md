---
id: DS029
title: Circuit Skill Contract
status: implemented
owner: nll-circuit
summary: Authors reusable query, decision, procedural, generation, and assurance circuits.
---

# DS029 — Circuit Skill Contract

## Introduction

This specification makes the `nll-circuit` coding workflow part of the official contract. The executable companion is `nll-skills/nll-circuit/workflow.mjs`.

## Core Content

The CLI must load the executable workflow through the SDK, resolve its dependencies transitively, copy only the required skill folders into a run directory, and generate the context artifacts declared by that workflow. The coding agent must read the installed skill contract and resolved catalogs before editing canonical files.

### Preserved skill instructions

# nll-circuit

## Purpose and invocation

Use when creating or repairing a reusable rule, analysis, generation, refinement or assurance circuit.

This skill is installed from `project/nll-skills/nll-circuit/` into a run-local `skills/nll-circuit/` directory. Read this file before editing. Do not look for `.agents`, `.codex` or hidden skill discovery. The run's `INSTRUCTIONS.md` is authoritative for working directory and requested phase.

## Required design specifications

- `DS-003_SemanticStore_Circuit_Runtime_and_Analysis_Algorithms.md`
- `relevant DS-007–DS-019 domain specifications`
- `DS-000_System_Architecture_and_Check_Catalog.md`
- `DS041-agentic-natural-language-authoring.md`
- `DS042-adaptive-task-local-authoring-and-verification.md`
- `DS043-primary-markdown-cnl-response.md`
- `DS044-response-circuit-composition-and-intent-presentation.md`

Read the primary DS first, then only the domain DS files named by the run context. Generated catalogs summarize the current implementation but do not override the DS contract.

## Canonical edit scope

framework/agent/task semantic circuits, agent/task `cnl/*.response.circuit.mjs` response circuits, CNL frames/renderers and circuit tests/benchmarks.

Codex works directly on canonical files in YOLO/direct-editing mode. There is no patch-staging or nllAgent approval phase. Do not modify unrelated agents or tasks.

## Required tools before or during work

- `nllAgent catalog circuit`
- `nllAgent catalog response`
- `nllAgent catalog ontology`
- `nllAgent sdk usage`
- `nllAgent longtext query`
- `nllAgent circuit check`
- `nllAgent circuit plan`
- `nllAgent circuit run`
- `nllAgent circuit abstract`
- `nllAgent circuit symbolic`
- `nllAgent trace slice`
- `nllAgent cnl roundtrip`
- `nllAgent test task`

Use generated catalogs and source-slice tools before loading large implementation trees or whole documents into context.
Apply tools to the current ownership scope. At agent scope, use agent fixtures and `test agent`; task-only
`longtext`, concrete circuit, trace, and CNL commands require `--task`/`--task-dir` plus their documented circuit,
expression, trace, or file argument. Do not run an incomplete command merely because its family appears above.
The run-local catalogs are already available and should be inspected before requesting an additional CLI view.

## Workflow

1. State the circuit responsibility, inputs, outputs, statuses and coverage requirements.
2. Decompose selection, normalization, reasoning, decision, explanation and generation.
3. Choose methods by semantic problem shape, not fashion; combine methods when needed.
4. Use query/dataflow and circuit kits before writing ad hoc traversal code.
5. Use a procedural stage for genuinely irregular algorithms and declare semantic reads/writes.
6. Add evidence-bearing emissions with qualitative messages and structured details naming failed, uncertain or conflicting requirements. Emit `NOT_APPLICABLE` only for planner/debug evidence; it will not enter the primary CNL response.
7. Inspect `RESPONSE_CIRCUIT_CATALOG.md`. Add an agent- or task-local response circuit only when selection, filtering, grouping, counting, ranking or explanation differs from the defaults; never use it to invent a semantic finding.
8. Create micro-cases, mutations and boundary tests.
9. Run planning, concrete, auxiliary, response-composition and trace checks.

## Implementation rules

- Use ordinary `.mjs` modules and fluent nllAgent SDK APIs.
- Do not create JSON or TypeScript artifacts.
- Do not add third-party runtime dependencies.
- Full JavaScript is allowed; semantic effects must pass through SDK transactions, circuit outputs or declared tool interfaces.
- Create or update tests as part of the same coding phase.
- Preserve provenance, interpretation context, coverage and explicit unknown status.
- Prefer reusable framework or agent code over task-local duplication when the abstraction is real.

## Natural-language authoring boundary

Reusable rules described in an agent brief are implemented here by the coding agent as real CircuitJS modules and tests. Task-local circuit code is justified only by task-specific behavior. A report or prose completion is not a circuit: the resulting module must declare capabilities, evidence requirements, statuses and outputs and must pass deterministic concrete and requested auxiliary execution.

## Adaptive circuit audit

Query the combined registry before writing code. If behavior is missing, create the smallest task-local provider that consumes ontology identities and LongText claims through SDK queries, returns evidence-bearing findings or typed CNL frames, and declares every requirement and provision. It must have realistic satisfied, violated, unknown, conflict and not-applicable behavior where the domain permits those states. Finding messages must state the actual rule outcome, while `details` must expose decisive requirement identities in human-readable form. Declare abstract preflight and symbolic decision coverage, keep the symbolic state finite and meaningful, and add focused tests that exercise concrete source behavior, exact evidence and auxiliary paths. Let the planner compose the provider; do not generate a monolithic dispatcher.

## Response-circuit boundary

Semantic CircuitJS produces truth-bearing findings and typed generation frames. Response circuits run afterward and may filter internal or non-applicable entries, suppress confirmations when a material problem exists, group and count results, rank exact source spans and attach rule explanations. Store reusable policy in `agent/cnl/*.response.circuit.mjs` and source-specific policy in `task/cnl/*.response.circuit.mjs`. Compose stages through `responseCircuit()` and `responseStage()`; do not encode the policy as JSON and do not mutate the semantic store from a response stage.

## Completion criterion

The circuit is composable through capabilities, produces correct evidence/status on micro-cases, has explicit method guarantees and does not depend on physical store fields.

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
