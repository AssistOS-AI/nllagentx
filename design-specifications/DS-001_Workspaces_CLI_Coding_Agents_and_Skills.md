# DS-001 — Workspaces, CLI, Coding Agents and the nll-* Skill System

**Status:** Normative implementation specification  
**Primary skill:** `nll-orchestrator`  
**Depends on:** DS-000  
**Related:** DS-005, DS-006

## 1. Purpose

This specification defines how nllAgent organizes persistent semantic agents, isolated document tasks, coding-agent runs, run-local skills, generated context, tests and results. It also defines the CLI contract and the minimum skill set. The design assumes Codex as the initial coding agent, while keeping the invocation interface open to future coding agents.

The operating principle is simple: nllAgent prepares an explicit file workspace and invokes a coding agent that edits canonical files directly. The coding agent is allowed to finish the requested phase, create tests, reorganize local code and make implementation decisions. nllAgent may then run fast checks or request a new review run. It does not stage patches for approval and does not act as a semantic gatekeeper.

## 2. Canonical repository structure

```text
project/
  framework/
    sdk/
      core/
      ontology/
      longtext/
      circuit/
      intent/
      cnl/
      analysis/
    runtime/
      store/
      query/
      planner/
      scheduler/
      methods/
      trace/
      cache/
    packs/
      core-commonsense/
      world-basic/
      math-basic/
      physics-basic/
      chemistry-basic/
      biology-basic/
      psychology-basic/
      anthropology-basic/
      sociology-basic/
      logic-basic/
      reasoning-errors/
      law-basic/
      social-interaction/
    tools/
    cli/
  nll-skills/
    nll-architect/
    nll-orchestrator/
    nll-sdk/
    nll-runtime/
    nll-intent/
    nll-ontology/
    nll-longtext/
    nll-circuit/
    nll-test/
    nll-evaluate/
  profiles/
  agents/
    <agent-name>/
      agent.mjs
      README.md
      ontologies/
      circuits/
      methods/
      profiles/
      lexicons/
      cnl/
      tests/
      tasks/
        <task-id>/
          task.mjs
          source/
          intent/
          longtext/
          ontologies/
          circuits/
          tests/
          runs/
          results/
  evaluations/
    <suite-name>/
      suite.mjs
      agents/
      corpora/
      reports/
  cache/
  logs/
```

No `.agents`, `.codex` or hidden skill-discovery directory is part of the design. Skills live in `project/nll-skills/`. A run sees only the skills explicitly copied into its own run directory.

## 3. Persistent semantic-agent package

An agent is a reusable configuration of ontologies, circuits, profiles, lexicons, CNL renderers and optional methods. It represents a stable analytical persona such as `general-school-review`, `legal-policy-review`, `literary-continuity` or `scientific-textbook-review`.

The agent root contains:

```text
agents/<agent-name>/
  agent.mjs
  ontologies/
  circuits/
  methods/
  profiles/
  lexicons/
  cnl/
  tests/
  tasks/
```

`agent.mjs` is an executable fluent module. It declares the base framework packs, agent-local extensions, default profile, preferred CNL dialects, coding-agent adapter and default task policy. It is not a JSON manifest.

Example shape:

```js
import { semanticAgent, usePack, useProfile, useSkillPolicy } from "../../framework/sdk/agent.mjs";

export default semanticAgent("general-school-review")
  .use(usePack("core-commonsense"))
  .use(usePack("world-basic"))
  .use(usePack("logic-basic"))
  .use(usePack("reasoning-errors"))
  .defaultProfile(useProfile("general-broad"))
  .skills(useSkillPolicy("standard-authoring"))
  .seal();
```

The agent directory is canonical and persistent. Coding agents edit it directly when creating reusable ontologies and circuits.

## 4. Task package

Every source analysis or generation request is represented by one task directory with a random, filesystem-safe identifier. The CLI generates the identifier; users may attach a display title but do not choose a path that can collide with another task.

```text
agents/<agent>/tasks/<task-id>/
  task.mjs
  source/
    source-001.txt
    source-002.pdf
    source-map.mjs
  intent/
    intent.mjs
    intent-signals.mjs
    plan.mjs
  longtext/
    root.longtext.mjs
    units/
      unit-0001.longtext.mjs
      unit-0002.longtext.mjs
  ontologies/
  circuits/
  tests/
  runs/
  results/
```

`task.mjs` records source identities, requested outputs, optional user instructions, task-local profile overlays and expected language. It uses SDK builders. Task-local ontology or circuit modules are created only when the task cannot be faithfully represented with the agent and framework packs. Reusable discoveries should subsequently be promoted by a separate coding run to the agent or framework layer.

### 4.1 Source units

Large documents are divided into stable `SourceUnit`s. A source unit is a line, paragraph, page range, section or other deterministic segment with a digest and offsets into the original source. The source map is an `.mjs` module generated by nllAgent tools. LongTextJS code anchors terms to units and exact spans; it does not copy whole source documents into semantic modules.

### 4.2 Task-local precedence

The resolved stack is:

1. framework SDK and base packs;
2. selected load profile;
3. agent ontologies, circuits and lexicons;
4. task-local ontologies, circuits and intent refinements;
5. run-local generated context, which is informative and never an authority over canonical code.

A task-local module may add new semantic identities or specialize a declared extension point. It may not silently redefine imported identities.

## 5. Run directories

Every coding-agent invocation receives a separate run directory under the task or agent that it is allowed to edit.

```text
runs/<run-id>/
  run.mjs
  INSTRUCTIONS.md
  context/
    PROJECT_MAP.md
    SDK_CATALOG.md
    ONTOLOGY_CATALOG.md
    CIRCUIT_CATALOG.md
    PROFILE_RESOLUTION.md
    SOURCE_OUTLINE.md
    DIAGNOSTICS.md
  skills/
    <only-selected-skills>/
  logs/
  checks/
  scratch/
```

The run directory is not a staging area for semantic files. Canonical files remain in the agent or task directory, and Codex edits them directly. The run directory carries instructions, context, selected skills, logs and disposable scratch material.

`run.mjs` declares the adapter, working directory, selected skills, goal, allowed canonical paths, standard check commands and requested completion report. It contains no hidden policy.

## 6. CodingAgentAdapter

The framework defines a small adapter interface so Codex can be replaced or supplemented later.

An adapter must support:

- start a coding-agent process with an explicit working directory;
- provide one or more instruction files and environment variables;
- run in direct-editing/YOLO mode when the backend supports it;
- stream or capture stdout and stderr;
- wait until the process completes;
- return exit status and log paths;
- optionally resume a previous coding session if the backend supports stable session identifiers.

The adapter does not translate model output into patches. It does not decide which file edits are semantically correct. It only invokes the coding agent and records process-level facts.

Codex is the initial adapter. Its run instruction must tell it to read `INSTRUCTIONS.md`, then the selected `SKILL.md` files, then the referenced DS files and generated catalogs before editing.

## 7. Coding-run lifecycle

A coding run follows a deterministic orchestration sequence.

### 7.1 Resolve scope

nllAgent resolves the agent, optional task, requested phase and canonical edit roots. It refuses ambiguous agent names or missing task IDs.

### 7.2 Build context

nllAgent invokes context tools to generate:

- relevant file tree and one-line summaries;
- SDK exports and primitive descriptors;
- ontology concepts, roles, frames and lexicalizations;
- circuit contracts and capabilities;
- source outline and requested source slices;
- existing diagnostics, tests and previous result summaries;
- profile resolution and selected domain packs;
- links to the DS documents required by the selected skills.

The context must be compact enough for a coding agent to navigate, but all canonical files remain readable from the working directory.

### 7.3 Copy selected skills

Only required skill folders are copied from `project/nll-skills/` to `run/skills/`. Each copied skill retains its own `SKILL.md` and optional templates. The coding agent is instructed to read the skills in an explicit order.

### 7.4 Start coding agent

The adapter starts Codex in direct-editing mode with the agent or task directory as its working directory. nllAgent does not interrupt normal implementation decisions. The instructions require Codex to create or update tests relevant to its change and to run the fast checks named by the skill.

### 7.5 Wait and collect logs

nllAgent waits for termination. It stores process logs and a short run summary. It does not attempt to infer semantic acceptance from the natural-language final response of the coding agent.

### 7.6 Optional deterministic checks

After the run, nllAgent may execute selected checks such as import checks, ontology validation, LongText anchoring, circuit planning and unit tests. Failure results in diagnostics. nllAgent may launch another Codex run with `nll-review`; it does not revert or selectively accept edits.

### 7.7 Ordinary execution

Once semantic modules exist, `nllAgent run` or `nllAgent analyze` can execute them without Codex. Coding agents are invoked only for authoring, repair, review or requested regeneration.

## 8. CLI grammar

The executable is named `nllAgent`. Every command that accesses semantic configuration names an agent explicitly.

### 8.1 Agent commands

```text
nllAgent agent create --agent <name> [--profile <profile>]
nllAgent agent show --agent <name>
nllAgent agent check --agent <name>
nllAgent agent catalog --agent <name>
```

### 8.2 Task commands

```text
nllAgent task create --agent <name> --source <path> [--title <text>]
nllAgent task show --agent <name> --task <id>
nllAgent task sources --agent <name> --task <id>
nllAgent task clean-runs --agent <name> --task <id>
```

`task create` returns the random ID and creates the directory skeleton.

### 8.3 Coding commands

```text
nllAgent code architect --agent <name> [--task <id>]
nllAgent code intent --agent <name> --task <id>
nllAgent code ontology --agent <name> [--task <id>]
nllAgent code longtext --agent <name> --task <id>
nllAgent code circuit --agent <name> [--task <id>]
nllAgent code sdk --agent <name> [--task <id>]
nllAgent code review --agent <name> [--task <id>] [--diagnostics <path>]
```

Each command resolves a skill chain. For example, `code longtext` normally installs `nll-longtext` plus `nll-intent` and `nll-ontology` references; `code circuit` installs `nll-circuit`, relevant domain DS files and `nll-runtime` references.

### 8.4 Execution commands

```text
nllAgent analyze --agent <name> --task <id> [--profile <id>] [--intent <text>]
nllAgent generate --agent <name> --task <id> --output <kind>
nllAgent run --agent <name> --task <id>
nllAgent plan --agent <name> --task <id> [--explain]
nllAgent query --agent <name> --task <id> --expression <module-or-id>
```

`analyze` performs intent resolution, materialization, planning, circuit execution and result rendering. It may call Codex only if the requested command includes `--author-missing` or a work plan explicitly requests authoring. Normal execution does not implicitly regenerate semantic code.

### 8.5 Test and evaluation commands

```text
nllAgent test framework
nllAgent test packs [--pack <id>]
nllAgent test agent --agent <name>
nllAgent test task --agent <name> --task <id>
nllAgent evaluate --suite <suite-name>
```

Testing never invokes a coding agent. Evaluation may invoke Codex because authoring performance is part of the evaluation scenario.

## 9. Context and inspection tools

All tools are subcommands of `nllAgent` and implemented with Node.js built-ins.

### 9.1 Context tools

- `context build`: create run context and copy selected skills;
- `context show`: print included files and DS references;
- `files index`: create a compact relevant file map;
- `catalog sdk`: list public primitives and examples;
- `catalog ontology`: list resolved concepts, roles and constructors;
- `catalog circuit`: list circuit contracts, methods and tests;
- `profile resolve`: explain loaded packs and precedence;
- `plan show`: render IntentJS and execution plan as Markdown.

### 9.2 Source tools

- `source ingest`: register files and create source units;
- `source outline`: show section/unit boundaries;
- `source show`: display a source unit or range;
- `source search`: return candidate spans;
- `source span`: resolve a phrase or offset range;
- `source verify-anchors`: verify every LongText anchor.

### 9.3 Semantic tools

- `ontology check`, `ontology build`, `ontology show`, `ontology affected`;
- `longtext check`, `longtext execute`, `longtext query`, `longtext coverage`;
- `intent check`, `intent infer-signals`, `intent explain`;
- `circuit check`, `circuit plan`, `circuit run`, `circuit abstract`, `circuit symbolic`;
- `trace slice`, `trace explain`, `trace compare`;
- `cnl render`, `cnl parse`, `cnl roundtrip`;
- `review bundle`: gather diagnostics, failing tests, changed files and relevant DS references for a review run.

## 10. Minimum skill set

The package defines ten skills. An implementation may initially combine some operationally, but their responsibilities must remain distinct.

| Skill | Primary DS | Responsibility |
|---|---|---|
| `nll-architect` | DS-000 | decompose a request, choose artifact ownership, packs and work phases |
| `nll-orchestrator` | DS-001 | workspace, CLI, context and coding-agent run implementation |
| `nll-sdk` | DS-002 | reusable fluent DSL constructors and public SDK primitives |
| `nll-runtime` | DS-003 | SemanticStore, planner, scheduler, method engines and traces |
| `nll-intent` | DS-004 | create or refine IntentJS, profiles and selection policy |
| `nll-ontology` | DS-002 + domain DS | create ontology modules and generated constructors |
| `nll-longtext` | DS-002 + DS-004 + domain DS | materialize grounded task semantics across source units |
| `nll-circuit` | DS-003 + domain DS | author reusable or task-local circuits and CNL frames |
| `nll-test` | DS-005 | create deterministic unit/integration tests and mutations |
| `nll-evaluate` | DS-006 | build isolated evaluation agents, tasks, metrics and reports |

### 10.1 Skill package contract

Each `SKILL.md` must state:

- invocation condition;
- required DS files;
- required generated context files;
- canonical directories it may edit;
- mandatory tools to run before editing;
- implementation workflow;
- tests to create or update;
- fast checks to run;
- outputs and completion criteria;
- handoff conditions to another skill.

The actual skill files are included in this package under `nll-skills/`.

## 11. Concurrency and process model

### 11.1 One writer per canonical root

Only one coding run may write the same agent or task root at a time. nllAgent uses a lock file or atomic lock directory. Independent agents and tasks may run concurrently.

### 11.2 Fresh semantic processes

Each semantic run loads `.mjs` artifacts in a fresh Node.js process. This avoids stale module caches and accidental global state. Long-running service deployments may later maintain process pools, but the reference implementation favors reproducibility.

### 11.3 Deterministic paths and identifiers

Task and run IDs are generated from cryptographically strong random bytes using Node.js built-ins and encoded in a filesystem-safe form. Semantic IDs are canonical content-derived or explicitly declared; filesystem task IDs are not semantic identities.

## 12. Output contract

A task `results/` directory may contain:

```text
results/
  execution-plan.md
  findings.mjs
  findings.cnl
  observations.cnl
  generation-plan.cnl
  report.md
  trace.bin
  trace-summary.md
  coverage.md
  diagnostics.md
```

`findings.mjs` is an executable/replayable semantic result module if a structured artifact is needed. CNL and Markdown are human-facing. `trace.bin` and caches are disposable implementation artifacts.

## 13. Exit statuses

The CLI uses process exit status only for tool success or failure. Semantic results are represented inside task outputs.

- `0`: command completed and outputs were written;
- `1`: usage or path error;
- `2`: import, syntax or framework contract error;
- `3`: deterministic checks or tests failed;
- `4`: coding-agent process failed;
- `5`: semantic execution was blocked before producing requested outputs;
- `6`: evaluation suite failed its declared acceptance threshold.

A task with valid `VIOLATED` findings still exits successfully because violation is a semantic result, not a process failure.

## 14. Implementation acceptance criteria

The workspace/CLI layer is complete when it can:

1. create agents and random-ID tasks;
2. ingest a long source into stable source units;
3. build run context and copy only selected skills;
4. start Codex in direct-editing mode through an adapter;
5. preserve logs and run metadata;
6. run post-authoring checks without approving patches;
7. execute an existing task without Codex;
8. prevent concurrent writes to the same canonical root;
9. isolate evaluation agents and tasks;
10. operate without JSON manifests, TypeScript or third-party dependencies.
