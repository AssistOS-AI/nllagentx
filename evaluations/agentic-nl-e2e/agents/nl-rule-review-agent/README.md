# nl-rule-review-agent

Persistent nllAgent package. Reusable ontologies and circuits belong here; task-specific source interpretations belong under `tasks/`.

The agent-local `minimal-core` profile deliberately resolves only the mandatory `core-language` pack. Reusable
operational-policy vocabulary will live in `ontologies/`, and the four evidence-aware review and generation circuits
will live in `circuits/`.
Concrete policy rules, event records, evidence, source anchors, alternatives, and coverage remain owned by each task.

`architecture-plan.mjs` records the semantic allocation and guarantees. `work-plan.mjs` hands implementation to
`nll-ontology`, then `nll-circuit` and `nll-test`; task-local `nll-intent` and `nll-longtext` authoring follows per
source.
