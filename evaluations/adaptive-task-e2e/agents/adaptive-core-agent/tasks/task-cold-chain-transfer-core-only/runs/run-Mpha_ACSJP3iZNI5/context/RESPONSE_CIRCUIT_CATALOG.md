# Response Circuit Catalog

Resolved response circuits: 4.

These circuits run after semantic CircuitJS. They may select, suppress, group, count, rank, and explain existing findings or typed frames, but they must not invent semantic truth.

| Response circuit | Priority | Stages | Applicability |
| --- | ---: | --- | --- |
| `response-circuit:nll.response.MaterialSelection@1.0.0` | 10 | `response.select-applicable-findings` | executable `applies(context)` predicate |
| `response-circuit:nll.response.IntentStyle@1.0.0` | 20 | `response.infer-style` | executable `applies(context)` predicate |
| `response-circuit:nll.response.GroupedAnalysis@1.0.0` | 30 | `response.group-results`, `response.select-generated-content` | executable `applies(context)` predicate |
| `response-circuit:nll.response.GeneratedContent@1.0.0` | 30 | `response.group-results`, `response.select-generated-content` | executable `applies(context)` predicate |

Agent response circuits are loaded from `agent/cnl/*.response.circuit.mjs`; task overrides and additions are loaded from `task/cnl/*.response.circuit.mjs`. Later modules with the same circuit identity replace earlier modules during composition.
