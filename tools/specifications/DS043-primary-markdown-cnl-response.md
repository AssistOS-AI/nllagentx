## Introduction

nllAgent accepts a natural-language instruction and source, then behaves externally like a prompt-to-answer system. Its durable public answer must therefore be intelligible on its own; internal JavaScript projections and symbolic traces are supporting evidence, not the answer.

## Core Content

Every successful `run`, `analyze`, or `generate` command must write `results/response.md` and return that tagged Markdown CNL on standard output by default. `--format json` exposes a machine-oriented command projection and the path to the same response; it does not replace the response. The public document must use stable markers such as `[CNL:DOCUMENT]`, `[CNL:GROUP]`, and `[CNL:FINDING]` with style, grouping, code, status, group, count, and materiality fields so a later consumer can retain or filter semantic blocks without parsing prose.

The response must contain only applicable, intent-visible semantic results. Internal grounding checks and `NOT_APPLICABLE` findings are excluded. When material violated, conflict, unknown, possible-problem, or blocked findings exist, supporting satisfied findings are suppressed unless IntentJS explicitly requests them. Empty result groups are never rendered.

Each finding must state the conclusion, status, semantic concern or rule, selected circuit, and why the decision row matched. Public explanatory prose must never substitute an implementation identifier for a domain statement. In particular, semantic hashes, SDK identities, serialized objects, assurance path tables, and identifiers such as `RECEIVING_PARTY_ACKNOWLEDGED` are prohibited as requirement prose. A semantic circuit that exposes failed, conflicting, uncertain, or satisfied requirement codes must also expose a public requirement statement for every selected code. That statement expresses the domain condition as a complete controlled-language sentence. Existing requirement values that are already complete human-readable sentences remain valid. The renderer applies fixed status-specific templates to those statements and fails closed when a code-shaped value has no public statement; it must not invent domain meaning by merely splitting or lowercasing an identifier.

Requirement groups use stable markers such as `[CNL:REQUIREMENT-GROUP] [STATUS:VIOLATED] [COUNT:2]`, followed by a fixed explanation of what that status means and one domain sentence per requirement. The stable marker is the machine-filterable part; the list items are the human-readable part. A next-action template may quote a public requirement sentence as its dynamic value, but it must not repeat the internal requirement code.

Evidence must be exact text quoted from verified SourceSpan intervals and linked to the task source through a relative path. The public citation must identify the quotation as exact source text and must not expose character offsets such as “characters 42–77”; decoded start/end offsets remain available only in technical evidence used to verify the quotation. Generated explanation and copied input text must be visibly distinct. An evidence section begins with `[CNL:EVIDENCE]`, explicitly says that the following passages are copied exactly from the input, and marks every block with `[CNL:SOURCE-QUOTE] [SOURCE:...]` before its Markdown quotation. The prose before the quotation is generated CNL; the blockquote is verified source material. Evidence selection must rank passages by the failed, uncertain, or conflicting requirements and limit ordinary output verbosity while keeping all raw evidence available technically. Domain details and uncertainty counts are rendered only when human-readable.

A correct verdict with incomplete decisive evidence is not a qualitative answer. When the input explicitly denies a required justification, acknowledgement, calibration, support relation, or other predicate and that denial contributes to the result, the corresponding verified negative passage must be present in the finding evidence and quoted in the public response. The renderer must consume evidence already selected by the semantic circuit; it must not rediscover missing semantic evidence through string search.

The primary document must not repeat task identifiers, generic input inventories, artifact locations, unconditional uncertainty disclaimers, or empty technical chapters. Structured requirement arrays are rendered as separate list items rather than flattened comma-separated prose. A limits section is present only for actual diagnostics, `UNKNOWN`, or a material blocked state. A next action is included only when it follows from the failed requirement or a requested generation/repair operation.

Generation intents must render ordered typed content such as procedure steps before or alongside their readiness finding. Analysis intents must not expose generation or repair frames emitted by unrelated compatible circuits. Requested repair, clarification, and observation frames are filtered by intent output directives.

`results/artifacts.md` indexes task.mjs, IntentJS, LongTextJS, task-local OntologyJS, task-local semantic CircuitJS, task/agent response circuits, generated SDK facades, retained coding-agent instructions and final responses, canonical CNL, executable findings, assurance, diagnostics, coverage, and traces. `report.md` is explicitly a technical execution report. Raw `assurance.mjs`, JSON-like projections, and binary traces remain available there and must not be embedded as tutorial answers.

## Decisions & Questions

### Question #1: Why use tagged Markdown instead of only canonical FRAME syntax?

Response: Canonical FRAME CNL is suitable for semantic round-trip and tooling, while Markdown provides the chapters, quotations, explanations, and ordered generated content expected by a human or a later LLM. Stable tags preserve filterability without leaking internal object structures.

### Question #2: What does “qualitative” mean for a deterministic response?

Response: It means the answer identifies the actual rule, decision, decisive source language, material status, relevant counts, and uncertainty using deterministic templates and circuit metadata. It does not mean inventing fluent prose unsupported by the semantic execution.

### Question #3: May the public response say that nothing was found?

Response: It may emit one `[CNL:NO-MATERIAL-RESULT]` statement when no applicable semantic result exists, but it must not list every circuit that failed to apply. Empty requests and non-applicable branches remain technical planner evidence.

### Question #4: Is every semantically expected finding required in the public response?

Response: No. Evaluation gold applies to the complete concrete semantic result set. The public response applies the separately validated response-composition boundary and may omit internal grounding or secondary confirmations. It must include every finding selected for public presentation and every exact decisive quotation declared by the response contract.

### Question #5: Why are verified character offsets omitted from the public citation?

Response: Offsets are stable machine evidence for anchor validation but are expensive for a human to resolve mentally. The exact verified substring is already the useful evidence. The public CNL therefore quotes that substring and links its source, while technical artifacts retain the interval for debugging and replay.

### Question #6: Why must the semantic circuit provide the public requirement sentence?

Response: The semantic circuit knows that `THERMOMETER_CALIBRATION_VALID` means that every thermometer used for a transfer has a calibration valid at the transfer time. The generic renderer knows only that the value looks like an identifier. Requiring an explicit sentence prevents presentation code from guessing domain semantics while still allowing one reusable set of grammatical templates.

### Question #7: How can a consumer distinguish generated CNL from copied source text?

Response: Generated conclusions, requirement groups, and actions remain ordinary tagged Markdown CNL. Exact input passages appear only after an evidence marker and a source-specific quote marker, inside a Markdown blockquote whose attribution identifies it as copied source text. A human can see the boundary and a later tool can filter it without parsing prose.

## Conclusion

The primary response is a compact, grounded semantic answer suitable for direct human use or later LLM formatting, while every technical detail remains separately auditable.
