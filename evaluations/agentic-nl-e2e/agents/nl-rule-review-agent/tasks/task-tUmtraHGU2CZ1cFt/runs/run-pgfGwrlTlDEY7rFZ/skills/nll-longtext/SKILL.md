# nll-longtext

## Purpose and invocation

Use for every document task to author or repair grounded semantic materialization.

This skill is installed from `project/nll-skills/nll-longtext/` into a run-local `skills/nll-longtext/` directory. Read this file before editing. Do not look for `.agents`, `.codex` or hidden skill discovery. The run's `INSTRUCTIONS.md` is authoritative for working directory and requested phase.

## Required design specifications

- `DS-002_Internal_MJS_DSLs_and_SDK.md`
- `DS-004_IntentJS_Load_Profiles_and_Dynamic_Circuit_Selection.md`
- `relevant DS-007–DS-019 domain specifications`
- `DS037-source-extraction-and-stable-offsets.md`
- `DS041-agentic-natural-language-authoring.md`
- `DS042-adaptive-task-local-authoring-and-verification.md`
- `DS043-primary-markdown-cnl-response.md`

Read the primary DS first, then only the domain DS files named by the run context. Generated catalogs summarize the current implementation but do not override the DS contract.

## Canonical edit scope

task longtext/root.longtext.mjs, longtext/units, identity/context modules, task-local tests and coverage declarations.

Codex works directly on canonical files in YOLO/direct-editing mode. There is no patch-staging or nllAgent approval phase. Do not modify unrelated agents or tasks.

## Required tools before or during work

- `nllAgent source outline`
- `nllAgent source show`
- `nllAgent source search`
- `nllAgent source span`
- `nllAgent source verify-anchors`
- `nllAgent catalog ontology`
- `nllAgent ontology show`
- `nllAgent longtext check`
- `nllAgent longtext execute`
- `nllAgent longtext query`
- `nllAgent longtext coverage`

Use generated catalogs and source-slice tools before loading large implementation trees or whole documents into context.

## Workflow

1. Read task IntentJS and resolved ontology catalog before materialization.
2. Split long sources into stable units and create one module per manageable semantic unit.
3. Use ontology-generated constructors for ground terms; separate claims from world facts.
4. Anchor every extracted claim and mention to exact source spans.
5. Represent voice, modality, polarity, scope, alternatives, identity hypotheses, time and quantities explicitly.
6. Declare coverage only for source regions and concepts actually inspected.
7. Ensure decisive requirements, counterexamples, exceptions, conclusions and confirmations have exact source anchors reachable from the circuit finding evidence; response circuits can quote only grounded spans.
8. Compose unit modules in root.longtext.mjs and add structural tests.
9. Run anchor, ontology, transaction and focused query checks.

## Implementation rules

- Use ordinary `.mjs` modules and fluent nllAgent SDK APIs.
- Do not create JSON or TypeScript artifacts.
- Do not add third-party runtime dependencies.
- Full JavaScript is allowed; semantic effects must pass through SDK transactions, circuit outputs or declared tool interfaces.
- Create or update tests as part of the same coding phase.
- Preserve provenance, interpretation context, coverage and explicit unknown status.
- Prefer reusable framework or agent code over task-local duplication when the abstraction is real.

## Natural-language authoring boundary

Decoded source text, units and spans are evidence supplied to this coding phase, not a semantic interpretation produced by the ingester. The coding agent authors executable LongTextJS with exact anchors, contexts, claims, alternatives and honest coverage. A deterministic replay imports that canonical module; it does not rerun Codex or a hidden natural-language extractor.

## Adaptive grounding order

Author LongTextJS only after the adaptive ontology audit so every task-local identity is available through the resolved SDK and catalog. Model all source distinctions needed by the requested concern, including explicit denial, alternatives, interpretation context, attribution, coverage boundaries and unsupported evidence. Ground the facts that explain why a rule passed or failed, not only a broad enclosing paragraph. Verify every anchor against the decoded source and add tests that fail on span drift, irrelevant quotations or invented support.

## Completion criterion

The task materializes deterministically, all anchors verify, no unsupported slot is invented, alternatives/unknowns are preserved, and selected circuits have an honest compatibility signature.

At completion, run the fast checks named in `INSTRUCTIONS.md`, summarize changed canonical files and leave any genuinely blocked issue as a typed diagnostic or refinement demand. Do not claim success merely because code imports.

## Executable SDK integration

The adjacent `workflow.mjs` is the executable skill contract. The CLI loads it through the SDK, resolves its skill dependencies transitively, and generates only the context artifacts declared there. The workflow never searches hidden skill directories.

At runtime, `nllAgent context build` resolves either `--agent <name>` or `--agent-dir <path>`, and either `--task <id>` or `--task-dir <path>`. It imports framework default knowledge, then profile, agent, and task ontologies, semantic circuits and response circuits in that precedence order. Generated `SDK_CATALOG.md`, `ONTOLOGY_CATALOG.md`, `CIRCUIT_CATALOG.md`, `RESPONSE_CIRCUIT_CATALOG.md`, and `PROFILE_RESOLUTION.md` describe the actual resolved modules. Skill code must use those SDK constructors and ontology identities; it must not copy catalog prose into semantic modules or replace executable DSL code with data manifests.

The task folder owns source, IntentJS, LongTextJS, task-local ontology/semantic-circuit/response-circuit code, tests, runs, and results. The agent folder owns reusable extensions. A reusable dependency belongs in the framework or agent layer, while a source-specific interpretation belongs in the task layer.
