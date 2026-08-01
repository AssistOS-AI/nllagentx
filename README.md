# nllAgent Design Specification Pack

This package reorganizes the stable nllAgent architecture into **20 focused design specifications** plus run-ready skill instructions, profile examples, fluent `.mjs` examples and catalog skeletons. It is intended to be read by framework implementers and coding agents.

The package is self-contained at the design level. It assumes a clean experimental implementation, not migration from the earlier JSON-shaped DSL prototype.

## Authoritative decisions

- OntologyJS, LongTextJS, CircuitJS and IntentJS are real internal JavaScript DSLs written as `.mjs` modules.
- Full JavaScript is allowed; the semantic SDK and transaction/circuit boundaries define observable meaning.
- No JSON or TypeScript semantic artifacts are used.
- Deployment isolation is outside the framework and imposes no nllAgent SDK requirement.
- Codex is the initial coding agent and runs in direct-editing/YOLO mode. Future coding agents use the same adapter contract.
- Coding agents author ontologies, task intents, LongText programs, circuits and associated tests.
- nllAgent prepares context, installs run-local skills, invokes the coding agent, waits, and may run deterministic checks or request a review run.
- One logical SemanticStore supports several physical indexes and semantic views.
- IntentJS controls domain packs, checks, methods and outputs. When intent is unclear, `all-compatible` is the default.
- The predefined knowledge target is broad lower-secondary knowledge, with explicit limits and modular domain packs.

## Reading order

### Framework implementer

1. DS-000 — architecture and analysis/generation catalog
2. DS-001 — workspace, CLI, coding agents and skills
3. DS-002 — internal DSLs and SDK
4. DS-003 — SemanticStore, runtime and algorithms
5. DS-004 — intent, profiles and planning
6. DS-005 — tests
7. DS-006 — evaluation
8. relevant domain pack specifications

### Coding agent authoring a task

1. run-local `INSTRUCTIONS.md`
2. selected `nll-skills/<skill>/SKILL.md`
3. DS-002 and DS-004
4. only the domain DS files named by the run context
5. generated SDK, ontology and circuit catalogs
6. source outline and requested source slices

### Domain-pack author

1. DS-000
2. DS-002
3. DS-003
4. the relevant DS-007–DS-019 file
5. DS-005


## Package guidance files

- `IMPLEMENTATION_START_HERE.md` gives the shortest coherent route from design to the first end-to-end implementation.
- `SOURCE_TO_DS_TRACEABILITY.md` maps the three stable source volumes and later decisions into the DS files and records resolved contradictions.
- `PACKAGE_MAP.md` maps skills, runtime ownership and task artifacts.
- `REFERENCES.md` collects the scientific and engineering foundations cited by the DS files.
- `QUALITY_REPORT.md` and `MANIFEST.md` are generated before packaging.

## Design specifications

| ID | Subject |
|---|---|
| DS-000 | System architecture and catalog of checks/generation capabilities |
| DS-001 | Workspaces, CLI, Codex/future coding agents and nll-* skills |
| DS-002 | OntologyJS, LongTextJS, CircuitJS, IntentJS and reusable SDK |
| DS-003 | SemanticStore, circuit runtime and compact analysis algorithms |
| DS-004 | Intent ontology, load profiles and dynamic circuit/method selection |
| DS-005 | Unit, integration, mutation and deterministic developer testing |
| DS-006 | Isolated evaluation agents, random-ID tasks and end-to-end benchmarks |
| DS-007 | Core common-sense ontology and circuits |
| DS-008 | Stable general world knowledge ontology and circuits |
| DS-009 | Mathematics ontology and circuits |
| DS-010 | Physics ontology and circuits |
| DS-011 | Chemistry ontology and circuits |
| DS-012 | Biology ontology and circuits |
| DS-013 | Psychology, emotion and motivation ontology and circuits |
| DS-014 | Anthropology ontology and circuits |
| DS-015 | Sociology ontology and circuits |
| DS-016 | Elementary logic ontology and circuits |
| DS-017 | Contradiction, fallacy and reasoning-error circuits |
| DS-018 | Law, legality and normative-document ontology/circuits |
| DS-019 | Social interaction, communication and everyday norms |

## Skills

The package contains ten visible skills under `nll-skills/`. A run copies only the necessary skill folders into its own `runs/<run-id>/skills/` directory. Skills do not live under `.agents` or another hidden path.

## Profiles

The `profiles/` directory contains reference `.profile.mjs` modules for:

- minimal-core
- general-broad
- general-school
- literary-analysis
- legal-policy
- scientific-textbook
- social-analysis
- all-compatible

They demonstrate the fluent profile API. The actual implementation should expose the imports defined by DS-004.

## Examples

The `examples/` directory contains syntactically valid reference `.mjs` modules showing ontology, LongText, composed circuits, intent, pack descriptors, CNL frames, agent, task and test shapes. They are design examples, not a complete runtime.

## No hidden semantic formats

The package deliberately contains no `.json` or `.ts` files. Catalog examples and profiles are executable `.mjs`; explanatory material is Markdown.

## Implemented system

The preserved text above describes the original design package. The repository now also contains its executable implementation. The original 20 files remain unchanged under `design-specifications/` and are embedded verbatim, with additive implementation notes, in the official contiguous DS set under `docs/specs/`.

Start with:

- `docs/index.html` for the detailed technical guide and runnable tutorials;
- `docs/specsLoader.html?spec=matrix.md` for the official specification matrix;
- `AGENTS.md` for repository rules and the active skill catalog;
- `node nllAgent.mjs help` for the implemented CLI;
- `examples/validation-agent/` for a complete source-grounded concrete, abstract, and symbolic task;
- `examples/evaluations/agentic-nl-e2e/` for the real Codex-authored natural-language agent/task evaluation;
- `examples/evaluations/adaptive-task-e2e/` for the DS042 evaluation declaration and command;
- `evaluations/adaptive-task-e2e/` for the retained core-only task that learns missing task-local semantics through Codex and proves concrete, abstract, symbolic, review, and replay acceptance;
- `observations.md` for review areas and implementation decisions that were not explicit in the original specifications.

The implementation supplies the SDK, SemanticStore, planner, scheduler, analysis kernels, fourteen packs including `core-language`, folder-aware workspace tools, Codex adapter, evaluation runner, deterministic test support, response-circuit composition, and retained result formats. Source ingestion is non-semantic: explicit coding-agent phases translate a natural-language agent brief, task instruction, and decoded source into reusable agent OntologyJS/CircuitJS and task-owned IntentJS/LongTextJS. Ordinary execution then replays those programs without Codex. Semantic artifacts remain executable `.mjs`; environment-managed Codex/plugin configuration is outside the project semantic and build contract.

Run the main checks with:

```text
node nllAgent.mjs test framework --level fast
node nllAgent.mjs test packs --level standard
node nllAgent.mjs test task --agent-dir examples/validation-agent --task task-symbolic-validation
node nllAgent.mjs source ingest --agent-dir examples/validation-agent --task task-symbolic-validation
node nllAgent.mjs evaluate --suite school-smoke
node nllAgent.mjs evaluate --suite agentic-nl-e2e --invoke-agent
node nllAgent.mjs analyze --agent-dir evaluations/adaptive-task-e2e/agents/adaptive-core-agent \
  --task-dir evaluations/adaptive-task-e2e/agents/adaptive-core-agent/tasks/task-cold-chain-transfer-core-only \
  --author-adaptive --authoring-cycles 3 --assurance all
node evaluations/adaptive-task-e2e/validate.mjs
```

SDK-aware coding workflows can inspect the exact local API without copied theory:

```text
node nllAgent.mjs sdk check
node nllAgent.mjs sdk usage --surface longtext
node nllAgent.mjs catalog response --agent-dir examples/validation-agent --task task-symbolic-validation
node nllAgent.mjs plan show --agent-dir examples/validation-agent --task task-symbolic-validation
```

The retained validation task returns a grounded `results/response.md`, reports `ORDER_OK` as `SATISFIED`, converges abstractly in six steps with all four logic outcomes, and explores four path-complete symbolic cases including the deliberately exposed missing `CONFLICT` row. The retained adaptive cold-chain task starts with no task semantic programs, completes real Codex authoring/review phases, produces a grounded `COLD_CHAIN_RELEASE_UNSUPPORTED` violation, converges abstractly, explores four non-truncated symbolic paths, and replays both semantic results and the Markdown CNL digest under an independent domain oracle. The project-owned skill catalog contains only the ten executable `nll-skills/` workflows used by nllAgent coding runs.
