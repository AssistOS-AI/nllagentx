---
id: DS044
title: Response Circuit Composition and Intent-Selected Presentation
status: implemented
owner: nll-circuit
summary: Defines response-circuit DSL, dynamic filtering, grouping, counting, evidence, and presentation styles.
---

# DS044 — Response Circuit Composition and Intent-Selected Presentation

## Introduction

Result presentation is semantic behavior, not a hard-coded report template. This specification defines the post-execution circuits that turn findings and typed CNL frames into the primary Markdown CNL response.

## Core Content

`framework/sdk/cnl/response.mjs` must expose executable ResponseDirective, ResponseStage, and ResponseCircuit builders. A response circuit declares identity, version, priority, applicability, and ordered transform stages. `framework/runtime/response` selects every applicable circuit, orders it deterministically, executes its stages over immutable semantic results, and retains the selected circuit identities plus a stage trace.

The default composition contains orthogonal circuits for material-result selection, intent-selected style, analytical grouping, and generated-content selection. Selection derives stable tags from finding type, code, status, group, and materiality; applies IntentJS include/exclude status and tag directives; removes internal and non-applicable results; and suppresses secondary confirmations when a material issue exists. Grouping supports status family, exact status, finding code, and source circuit. Group counts are generated from selected entries rather than inferred from prose.

Every response stage declares the response-state fields it reads and writes. Composition validates the dataflow before execution, rejects an unreadable input, ambiguous incompatible write, or malformed feature collection, and retains stage-by-stage input/output summaries. Orthogonal stages may compose; a deliberate same-identity framework/agent/task override replaces the earlier circuit before stable priority and identity ordering.

IntentJS owns presentation policy through `.present(...directives)`. Standard directives include evidence-led, analytical, concise, and procedural styles; result grouping; status and tag filters; satisfied-result inclusion; matched-rule explanation; exact evidence quotation; group counts; and stable CNL tags. When no directive is supplied, analysis uses evidence-led status-family grouping and generation uses procedural presentation. These defaults are code-owned response circuits and may be replaced or extended without adding CLI conditionals.

Adaptive authoring must treat a missing presentation policy as an incomplete IntentJS contract even when `markdown-cnl` is listed as an output. Coding-agent review must be able to create a task-local response circuit when selection, grouping, evidence ranking, generated-frame layout, or style cannot be expressed by inherited policies. The created module is executable CircuitJS-family code under `cnl/`, not JSON configuration or prefabricated answer text.

Response circuits run only after semantic circuits have produced Findings and typed CNL frames. They may filter, rank, group, count, label, and render existing evidence. They must not change a finding status, invent a SourceSpan, convert absence under open coverage into a violation, or make an ontology assertion. Their output must be deterministic and part of model-free replay acceptance.

Evidence enrichment may expose positive and explicit negative source claims already retained by the finding, plus human-readable rule and requirement details. Semantic circuits own the public statements associated with domain requirement codes. Response circuits may select those statements, group them by the already established status, insert them into fixed controlled-language templates, count them, quote them in a requested action, and attach stable filtering markers. They must not derive a domain statement by tokenizing an internal code, change its meaning, or silently render an unmapped code as prose. A missing public statement for a code-shaped requirement is a typed response-contract failure.

Evidence enrichment must not perform new ontology matching or natural-language extraction. Procedural style orders relevant generated steps and their supporting quotations; analytical/evidence-led styles expose each material finding and structured failed or uncertain requirements. Exact source material is rendered in separately marked quotation blocks, distinct from generated explanations. All styles omit empty result groups and raw assurance projections.

The composer enforces this boundary after every stage. Every public entry must reference a Finding from the completed semantic execution, every generated frame must reference an emitted input frame, and every group member must reference a selected entry. A stage returning an invented finding, invented frame, invalid group, or non-Set feature collection fails with a typed response-stage diagnostic instead of rendering the value.

Agent-local response circuits are loaded from `agent/cnl/*.response.circuit.mjs`; task-local response circuits are loaded from `task/cnl/*.response.circuit.mjs`. Composition starts with framework defaults, then agent modules, then task modules. A later module with the same declared identity replaces an earlier implementation before priority sorting, which permits an explicit task override without duplicate execution. A custom style must declare its applicability and tests, preserve stable tags unless an explicit machine contract says otherwise, and remain compatible with the technical artifact index. The generated coding context must expose all resolved policies in `RESPONSE_CIRCUIT_CATALOG.md`.

## Decisions & Questions

### Question #1: Why are response circuits separate from semantic CircuitJS?

Response: Semantic circuits establish findings from the SemanticStore; response circuits select and organize already established results for an audience. Keeping the phases distinct prevents formatting choices from changing truth conditions while retaining executable, extensible composition in both layers.

### Question #2: Why does the default hide satisfied findings when a violation exists?

Response: Broad compatible execution can produce internal or secondary confirmations that distract from the requested material issue. They remain in executable findings and technical artifacts; IntentJS can explicitly include them when a completeness or audit style requires both positive and negative results.

### Question #3: How can a later LLM consume the response safely?

Response: Stable CNL markers delimit documents, groups, findings, codes, statuses, counts, and materiality. A later LLM may rephrase or summarize those blocks while source quotations and technical artifacts remain available for verification.

### Question #4: Why must response stages declare reads and writes?

Response: Dynamic composition is safe only when the framework can validate ordering and ownership before execution. Explicit fields allow independent selection, grouping, evidence, generated-frame, and layout stages to compose without relying on hidden mutation.

### Question #5: Why is `markdown-cnl` alone insufficient in adaptive IntentJS?

Response: It names the artifact but does not say which results, evidence, groups, counts, or style make the artifact useful. Presentation directives or a local response circuit make those decisions executable, inspectable, and replayable.

### Question #6: Why does response composition reject an unmapped requirement code instead of humanizing it automatically?

Response: Automatic tokenization can improve typography but cannot recover domain meaning, scope, modality, or time. Rejection makes the missing semantic contract visible to the circuit author. Human-readable sentences already present in findings continue to work, so the rule does not force a separate label table where the finding already carries proper CNL.

## Conclusion

Dynamic response circuits make output filtering and presentation a tested semantic-program layer: composable like the rest of nllAgent, but unable to rewrite underlying evidence or decisions.
