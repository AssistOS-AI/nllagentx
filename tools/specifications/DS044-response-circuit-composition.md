## Introduction

Result presentation is semantic behavior, not a hard-coded report template. This specification defines the post-execution circuits that turn findings and typed CNL frames into the primary Markdown CNL response.

## Core Content

`framework/sdk/cnl/response.mjs` must expose executable ResponseDirective, ResponseStage, and ResponseCircuit builders. A response circuit declares identity, version, priority, applicability, and ordered transform stages. `framework/runtime/response` selects every applicable circuit, orders it deterministically, executes its stages over immutable semantic results, and retains the selected circuit identities plus a stage trace.

The default composition contains orthogonal circuits for material-result selection, intent-selected style, analytical grouping, and generated-content selection. Selection derives stable tags from finding type, code, status, group, and materiality; applies IntentJS include/exclude status and tag directives; removes internal and non-applicable results; and suppresses secondary confirmations when a material issue exists. Grouping supports status family, exact status, finding code, and source circuit. Group counts are generated from selected entries rather than inferred from prose.

IntentJS owns presentation policy through `.present(...directives)`. Standard directives include evidence-led, analytical, concise, and procedural styles; result grouping; status and tag filters; satisfied-result inclusion; matched-rule explanation; exact evidence quotation; group counts; and stable CNL tags. When no directive is supplied, analysis uses evidence-led status-family grouping and generation uses procedural presentation. These defaults are code-owned response circuits and may be replaced or extended without adding CLI conditionals.

Response circuits run only after semantic circuits have produced Findings and typed CNL frames. They may filter, rank, group, count, label, and render existing evidence. They must not change a finding status, invent a SourceSpan, convert absence under open coverage into a violation, or make an ontology assertion. Their output must be deterministic and part of model-free replay acceptance.

The composer enforces this boundary after every stage. Every public entry must reference a Finding from the completed semantic execution, every generated frame must reference an emitted input frame, and every group member must reference a selected entry. A stage returning an invented finding, invented frame, invalid group, or non-Set feature collection fails with a typed response-stage diagnostic instead of rendering the value.

Agent-local response circuits are loaded from `agent/cnl/*.response.circuit.mjs`; task-local response circuits are loaded from `task/cnl/*.response.circuit.mjs`. Composition starts with framework defaults, then agent modules, then task modules. A later module with the same declared identity replaces an earlier implementation before priority sorting, which permits an explicit task override without duplicate execution. A custom style must declare its applicability and tests, preserve stable tags unless an explicit machine contract says otherwise, and remain compatible with the technical artifact index. The generated coding context must expose all resolved policies in `RESPONSE_CIRCUIT_CATALOG.md`.

## Decisions & Questions

### Question #1: Why are response circuits separate from semantic CircuitJS?

Response: Semantic circuits establish findings from the SemanticStore; response circuits select and organize already established results for an audience. Keeping the phases distinct prevents formatting choices from changing truth conditions while retaining executable, extensible composition in both layers.

### Question #2: Why does the default hide satisfied findings when a violation exists?

Response: Broad compatible execution can produce internal or secondary confirmations that distract from the requested material issue. They remain in executable findings and technical artifacts; IntentJS can explicitly include them when a completeness or audit style requires both positive and negative results.

### Question #3: How can a later LLM consume the response safely?

Response: Stable CNL markers delimit documents, groups, findings, codes, statuses, counts, and materiality. A later LLM may rephrase or summarize those blocks while source quotations and technical artifacts remain available for verification.

## Conclusion

Dynamic response circuits make output filtering and presentation a tested semantic-program layer: composable like the rest of nllAgent, but unable to rewrite underlying evidence or decisions.
