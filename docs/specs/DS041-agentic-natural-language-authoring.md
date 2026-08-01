---
id: DS041
title: Agentic Natural-Language Semantic Authoring and End-to-End Evaluation
status: implemented
owner: nll-architect
summary: Defines prompt-like authoring through a real coding agent, deterministic semantic replay, and retained end-to-end evidence.
---

# DS041 — Agentic Natural-Language Semantic Authoring and End-to-End Evaluation

## Introduction

nllAgent presents a prompt-like workflow to its operator, but it is intentionally not a monolithic hidden model call. A natural-language brief or task first drives a coding agent that authors inspectable semantic programs; the deterministic nllAgent runtime then executes those programs and can replay them without another coding-agent call. This specification makes that lifecycle explicit and closes the boundary left implicit by the source-extraction contract.

## Core Content

### Authoring and execution are separate stages

The natural-language inputs are an agent brief, a task instruction, and one or more task source files. Agent-level coding phases use the brief to create reusable agent-owned profiles, OntologyJS concepts, CircuitJS behavior, CNL forms, and tests. Task-level coding phases use the instruction and decoded sources to create task-owned IntentJS, LongTextJS, optional task-local ontology or circuit extensions, and tests. Codex is the first supported author through `CodingAgentAdapter`; the architecture must remain adapter-based.

The framework may prepare folders, decode sources, resolve dependencies, build catalogs, install skills, invoke the adapter, record artifacts, and validate the result. It must not replace the coding agent with keyword extraction or generate inert JSON descriptions of the DSLs. The coding agent directly edits canonical `.mjs` files through the SDK constructors exposed by the run-local catalogs and specifications.

Once semantic code exists, `plan`, `run`, `query`, assurance, replay, and inspection are deterministic framework operations. Reusing the same agent on a new task normally requires task-level IntentJS and LongTextJS authoring, not regeneration of the reusable agent ontology and circuits. Replaying an unchanged task requires no coding-agent invocation.

### Folder and evidence contract

The evaluation root owns one isolated agent folder. Its `source/agent-brief.md` is the exact reusable natural-language requirement. Reusable generated programs live in `profiles/`, `ontologies/`, `circuits/`, `cnl/`, and `tests/`. Every coding phase has a retained `runs/<run-id>/` directory containing `INSTRUCTIONS.md`, installed skills, resolved context, stdout, stderr, final response, timings, exit status, and the created or modified canonical paths.

Each evaluation case creates a new random-ID task folder. It retains the exact task instruction, original source files and decoded source map, generated `intent/`, generated `longtext/`, optional local extensions, tests, task-level coding runs, and deterministic `results/`. Reports must connect the human-readable case identifier to that concrete task folder and expose source text, generated code, findings or CNL frames, assurance outputs, and replay metrics.

The primary case output is `results/response.md`: tagged, human-readable Markdown CNL selected and organized by
response circuits according to IntentJS. Raw findings, executable result modules, assurance projections, logs,
and traces are separate technical evidence. Evaluation acceptance must verify response tags, expected material
results, exact source quotations, absence of non-applicable results, and model-free response replay in addition
to semantic finding keys. Semantic gold is checked against the full concrete finding set, while the public response
contract is checked against the exact findings selected by response circuits; internal grounding confirmations are
not forced back into the answer. A case may declare decisive source passages that must be quoted, including explicit
negative evidence used by a violation.

Before a later suite invocation replaces the canonical report set, the runner must archive the previous executable
agent-authoring and task-result records. Archived records continue to reference their original random-ID task and
run folders. Evaluation reruns must not erase earlier coding-agent attempts, generated programs, logs, failures, or
semantic results. Retained replay must select the newest current or archived cohort that contains actual coding-agent
process evidence; an intervening ordinary run with no authoring must not hide the most recent real cohort.

The evaluator command is fail-closed: any failed case produces a non-zero command result even when report generation
completed. `evaluate --replay-retained` may re-execute the exact random-ID tasks from the preceding real authoring
record without invoking Codex. It must preserve the real adapter provenance, regenerate semantic/response/replay
metrics against the current runtime, reject simultaneous `--invoke-agent`, and label the report as retained replay
rather than a new coding-agent run.

### Acceptance and iteration

A real authoring evaluation invokes the coding agent. Prewritten semantic fixtures, copied expected modules, or a report that merely says a phase occurred do not validate natural-language authoring. Each phase must be accepted by phase-specific deterministic checks. Each case must then execute through the real planner and SemanticStore, satisfy its semantic expectations, and reproduce its result during ordinary replay. Failed attempts remain retained as evidence; repairs use another explicit coding-agent phase or a new evaluation iteration until the suite meets its contract.

When a case declares expected findings, acceptance rejects both missing expected findings and unexpected material findings. Additional `NOT_APPLICABLE` results from compatible but irrelevant circuits are permitted because they demonstrate correct filtering; additional `SATISFIED`, `VIOLATED`, `UNKNOWN`, or `CONFLICT` findings fail the case unless the suite explicitly declares a partial oracle. Generation cases also enforce their minimum typed-frame count.

The minimum end-to-end validation covers materially different outcomes: contradiction detection, missing-justification detection, unsupported-conclusion detection, and controlled generation. At least one reusable agent ontology and the corresponding reusable circuits must be learned from the brief. Every task must obtain its own IntentJS and LongTextJS from its instruction and source. The controlled-generation case must produce a typed CNL frame rather than only a prose completion.

## Decisions & Questions

### Question #1: In what sense does nllAgent behave like an LLM?

Response: Its operator can supply a natural-language instruction and source and receive an analysis or generated artifact. Internally, however, the first encounter is an explicit coding-agent authoring operation that leaves inspectable programs; subsequent execution is deterministic and replayable. This is a deliberate semantic-program architecture, not an attempt to implement neural inference inside the runtime.

### Question #2: Why are agent-level and task-level authoring separate?

Response: Reusable domain distinctions and checks belong to the agent, while claims grounded in one source and the requested operation belong to the task. The separation prevents source assertions from becoming default knowledge and lets many tasks reuse one reviewed semantic agent.

### Question #3: May the source ingester infer enough semantics to skip Codex?

Response: No. It may expose stable text, units, spans, digests, and non-semantic outlines. Semantic selection, grounding, ontology design, and circuit authoring remain coding-agent responsibilities. Deterministic execution may skip Codex only after the required canonical programs already exist.

### Question #4: What proves that an evaluation is real?

Response: Retained subprocess evidence, generated canonical code absent before the run, phase-specific validation, concrete and auxiliary execution artifacts, expected semantic outcomes, and model-free replay together prove the complete path. Hand-authored fixtures remain useful unit tests but are not authoring evaluations.

### Question #5: Why have a retained replay mode if ordinary task replay already exists?

Response: Ordinary replay validates one task. Retained suite replay reuses the exact real-authoring cohort and strict per-case oracles, regenerates aggregate reports against current runtime code, and proves explicitly that no new coding agent was invoked.

### Question #6: What happens if an ordinary evaluation is run after the real authoring evaluation?

Response: Its report is archived like every other iteration, but it is not eligible to become the source of retained
authoring because it has no adapter process evidence. The replay selector searches the current report and archived
iterations from newest to oldest, then uses the newest cohort whose agent or task authoring records name the adapter,
run path, and exit code. The summary records which report directory supplied that provenance.

## Conclusion

Natural language enters nllAgent through an observable coding-agent authoring lifecycle and leaves behind executable semantic programs. Those programs—not hidden extraction heuristics or completion prose—are the durable interface between model-dependent interpretation and deterministic reasoning.
