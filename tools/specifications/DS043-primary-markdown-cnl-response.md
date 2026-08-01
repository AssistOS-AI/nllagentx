## Introduction

nllAgent accepts a natural-language instruction and source, then behaves externally like a prompt-to-answer system. Its durable public answer must therefore be intelligible on its own; internal JavaScript projections and symbolic traces are supporting evidence, not the answer.

## Core Content

Every successful `run`, `analyze`, or `generate` command must write `results/response.md` and return that tagged Markdown CNL on standard output by default. `--format json` exposes a machine-oriented command projection and the path to the same response; it does not replace the response. The public document must use stable markers such as `[CNL:DOCUMENT]`, `[CNL:GROUP]`, and `[CNL:FINDING]` with style, grouping, code, status, group, count, and materiality fields so a later consumer can retain or filter semantic blocks without parsing prose.

The response must contain only applicable, intent-visible semantic results. Internal grounding checks and `NOT_APPLICABLE` findings are excluded. When material violated, conflict, unknown, possible-problem, or blocked findings exist, supporting satisfied findings are suppressed unless IntentJS explicitly requests them. Empty result groups are never rendered.

Each finding must state the conclusion, status, semantic concern or rule, selected circuit, and why the decision row matched. Evidence must be exact text quoted from verified SourceSpan intervals and linked to the task source through a relative path. Evidence selection must rank passages by the failed, uncertain, or conflicting requirements and limit ordinary output verbosity while keeping all raw evidence available technically. Domain details such as failed requirements and uncertainty counts are rendered when they are human-readable; semantic hashes, SDK functions, serialized objects, and assurance path tables are prohibited from the primary response.

Generation intents must render ordered typed content such as procedure steps before or alongside their readiness finding. Analysis intents must not expose generation or repair frames emitted by unrelated compatible circuits. Requested repair, clarification, and observation frames are filtered by intent output directives.

`results/artifacts.md` indexes task.mjs, IntentJS, LongTextJS, task-local OntologyJS, task-local semantic CircuitJS, task/agent response circuits, generated SDK facades, retained coding-agent instructions and final responses, canonical CNL, executable findings, assurance, diagnostics, coverage, and traces. `report.md` is explicitly a technical execution report. Raw `assurance.mjs`, JSON-like projections, and binary traces remain available there and must not be embedded as tutorial answers.

## Decisions & Questions

### Question #1: Why use tagged Markdown instead of only canonical FRAME syntax?

Response: Canonical FRAME CNL is suitable for semantic round-trip and tooling, while Markdown provides the chapters, quotations, explanations, and ordered generated content expected by a human or a later LLM. Stable tags preserve filterability without leaking internal object structures.

### Question #2: What does “qualitative” mean for a deterministic response?

Response: It means the answer identifies the actual rule, decision, decisive source language, material status, relevant counts, and uncertainty using deterministic templates and circuit metadata. It does not mean inventing fluent prose unsupported by the semantic execution.

### Question #3: May the public response say that nothing was found?

Response: It may emit one `[CNL:NO-MATERIAL-RESULT]` statement when no applicable semantic result exists, but it must not list every circuit that failed to apply. Empty requests and non-applicable branches remain technical planner evidence.

## Conclusion

The primary response is a compact, grounded semantic answer suitable for direct human use or later LLM formatting, while every technical detail remains separately auditable.
