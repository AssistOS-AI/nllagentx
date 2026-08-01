# nllAgent Repository Guidance

## Scope

This guidance applies to the complete repository. nllAgent is an executable semantic-program workbench built from dependency-free Node.js ECMAScript modules. The repository owns both the framework and its coding-agent skill catalog. Semantic artifacts are OntologyJS, LongTextJS, IntentJS, CircuitJS, CNL, agent, task, profile, and evaluation `.mjs` modules; do not replace them with JSON or TypeScript representations.

The DS specifications under `docs/specs/` are the source of truth. The original design specifications are preserved verbatim inside DS002 through DS021. When code changes behavior, interfaces, architecture, workflows, or constraints, update both the affected DS files and the HTML documentation in the same change set.

## Mandatory Reading Order

1. Read [the documentation entry point](docs/index.html).
2. Read [DS001 coding style](docs/specs/DS001-coding-style.md) before changing code, module layout, generators, or tests.
3. Open [the specification matrix](docs/specsLoader.html?spec=matrix.md) and read every DS affected by the task.
4. Read the relevant skill's `SKILL.md` and executable `workflow.mjs` before using or changing that skill.
5. Inspect the actual implementation, examples, and tests before modifying documentation or asserting behavior.
6. For specification reviews, apply `review-specs` and update `Core Content` before recording rationale under numbered `Decisions & Questions` entries.

## Current Skill Catalog

- `nll-architect`: artifact ownership, pack choice, and work-phase decomposition.
- `nll-orchestrator`: workspace, CLI, context, and coding-agent runs.
- `nll-sdk`: reusable fluent DSL constructors and public primitives.
- `nll-runtime`: store, planner, scheduler, algorithms, cache, and trace execution.
- `nll-intent`: IntentJS, profiles, signals, and circuit selection.
- `nll-ontology`: OntologyJS modules and generated constructor facades.
- `nll-longtext`: source-grounded semantic materialization and coverage.
- `nll-circuit`: reusable analysis, generation, and assurance circuits.
- `nll-test`: deterministic structural, differential, mutation, and integration tests.
- `nll-evaluate`: isolated evaluation agents, tasks, metrics, and reports.
- `article-build`: self-contained incremental research-article generation, bibliography support validation, SVG checks, and final HTML review; it is not an nllAgent runtime dependency.
- `gamp-specs`: repository documentation structure, HTML pages, AGENTS guidance, and DS maintenance.
- `review-specs`: implementation-aware review of affected DS contracts and numbered decisions.

`AGENTS.md`, the HTML skill catalog, and the DS matrix must be updated whenever a skill folder is added, removed, or renamed. The `gamp-specs` skill itself must be updated when new skill families, coding-style rules, or project bootstrap rules are introduced.

## Repository Rules

All persistent documentation, specifications, and code comments must be written in English. Preserve user-authored content; additions may clarify or strengthen it but must not silently shorten, rewrite, or delete it. Keep DS numbering gap-free. Every ordinary DS must contain `Introduction`, `Core Content`, `Decisions & Questions`, and `Conclusion`; decisions and unresolved alternatives use consecutively numbered `### Question #N` subchapters with `Response:` or `Options:`.

Use `.mjs`, Node.js built-ins, immutable public semantic handles, deterministic identities, typed diagnostics, and atomic transactions. Keep semantic effects inside SDK constructors, store transactions, circuit emissions, or declared tool interfaces. Preserve claims versus facts, provenance, interpretation contexts, alternatives, explicit unknowns, and coverage-before-absence semantics.

Source extraction follows DS037. Built-in UTF-8 and PDF decoding or an explicit task-local `source/extractors/<extension>.extractor.mjs` must produce deterministic decoded text before LongTextJS anchors are authored. Never fabricate text for an unsupported, encrypted, scanned, or undecodable source; retain a typed diagnostic and require an appropriate task-owned adapter.

Agent and task folders are ownership boundaries. Reusable additions belong to the framework or agent; source-specific interpretations belong to the task. Coding-agent context must be resolved from canonical SDK modules, pack descriptors, exact DS files, and generated catalogs rather than duplicated theory. Only explicit `code` or requested evaluation authoring commands may invoke Codex.

Generated domain packs follow DS038. Keep every concept and frame in the explicit semantic allocation catalog and let the generator reject missing, unknown, or duplicate ownership. Do not derive ontology module ownership from array position or filename order.

Use `node:test` and `node:assert/strict`. Add tests with every behavior change and run focused checks before the complete suite. Generated semantic fixtures and expected outputs remain `.mjs`, CNL, Markdown, text, or binary trace data—not JSON snapshots. Run `fileSizesCheck.sh` after large changes and decompose cohesive executable source that crosses the DS001 thresholds.

This repository owns its local skill catalog, so each current skill has a local HTML page and DS contract. A downstream project that merely imports these skills must keep imported-skill DS files and skill pages out of the host project's `docs/`; imported guidance stays in the copied skill folders.

## Runtime Defaults

- CLI entry point: `node nllAgent.mjs`.
- Agent resolution: `--agent <name-or-path>` or `--agent-dir <path>`.
- Task resolution: `--task <id-or-path>` or `--task-dir <path>`.
- Default profile: the task profile, then the agent default, then `general-broad`.
- Mandatory vocabulary: `core-language`; additional packs come from profiles, agent declarations, CLI controls, or all-compatible resolution.
- Runtime dependencies: Node.js built-ins only.
- Coding-agent adapter: local Codex, invoked only by explicit authoring/review/evaluation commands.
- Semantic execution: concrete by default, plus declared/requested abstract or symbolic assurance.
- Test levels: `fast`, `standard`, and `exhaustive`; tests never invoke Codex.

## Key Paths

- `docs/index.html`: technical documentation entry point.
- `docs/specs/`: authoritative contiguous DS set.
- `docs/specsLoader.html?spec=matrix.md`: browsable specification matrix.
- `design-specifications/`: preserved original source specifications.
- `framework/sdk/`: OntologyJS, LongTextJS, IntentJS, CircuitJS, CNL, agent, and evaluation SDKs.
- `framework/sdk/public-api.mjs`: live narrow-surface inventory used by `sdk check`, `sdk usage`, catalogs, and skills.
- `framework/runtime/`: SemanticStore, planner, scheduler, algorithms, cache, and traces.
- `framework/packs/`: core and domain knowledge packs.
- `framework/tools/` and `framework/cli/`: folder resolution, context, execution, testing, evaluation adapters, and CLI routing.
- `framework/tools/source-extractors.mjs`: built-in and task-local source decoding contract.
- `nll-skills/`: executable coding-agent skill catalog.
- `.agents/skills/`: repository documentation/specification maintenance skills.
- `profiles/`: executable load profiles.
- `examples/validation-agent/`: complete agent/task, concrete, abstract, and symbolic example.
- `examples/evaluations/`: executable evaluation suites.
- `observations.md`: non-authoritative review focus linked to normative DS decisions.
