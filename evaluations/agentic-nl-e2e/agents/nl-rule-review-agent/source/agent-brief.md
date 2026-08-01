# Natural-language brief for the rule-review agent

Create a reusable semantic agent for reviewing short operational policies and event records. The agent must be authored with the local nllAgent SDK and must remain isolated to the `core-language` framework pack plus agent-local OntologyJS and CircuitJS modules. Do not encode source-specific facts in the reusable agent.

## Required semantic distinctions

The ontology must be expressive enough for task LongTextJS to represent:

- operational rules with an action, triggering condition, modality or effect (`required`, `forbidden`, or `permitted`), and source grounding;
- two rules that govern the same action under the same condition but impose incompatible effects;
- an emergency-exception invocation and whether a source-grounded justification record exists;
- a safety conclusion stated by an author and whether source-grounded supporting evidence exists;
- a request to generate an ordered operational procedure from stated rules;
- acknowledgement, authorization, gate action, exception justification, and audit-recording steps.

Reuse core-language identities wherever they are semantically sufficient. Add agent-qualified concepts, roles, values, or frames only where the core vocabulary cannot express the distinction. Ontology laws must not directly emit application findings.

## Required reusable circuit behavior

Create agent-local circuits and focused deterministic tests. The circuits must consume semantic terms and claims from the store rather than search raw source strings.

1. When two source-grounded rules apply to the same action and condition and one requires what the other forbids, emit `RULE_CONTRADICTION` with status `CONFLICT`, citing both rules. If priority or exception information is absent, do not invent it.
2. When the source records use of an emergency exception but contains no justification record for it, emit `MISSING_EXCEPTION_JUSTIFICATION` with status `VIOLATED`, citing the invocation and the policy requirement.
3. When a source states a safety conclusion but provides no supporting evidence for that conclusion, emit `UNSUPPORTED_SAFETY_CONCLUSION` with status `VIOLATED`, citing the conclusion. Do not treat the conclusion itself as its evidence.
4. When the task requests a procedure, emit `PROCEDURE_PLAN_READY` with status `SATISFIED` and at least one typed CNL generation-plan frame. The plan must order acknowledgement before authorization and gate action, require justification for any emergency exception, and finish with an audit record. Generated slots must retain provenance to the input rules.

Expose stable capabilities matching these responsibilities so IntentJS can select them. Findings for absent, irrelevant semantic terms should be `NOT_APPLICABLE` or omitted according to the circuit contract; they must not become false successes.

## Auxiliary assurance contract

Declare abstract preflight and symbolic decision coverage on every reusable circuit. Express review verdict boundaries through CircuitJS decision structures where that preserves the semantics, including explicit `UNKNOWN` and `CONFLICT` paths. The procedure circuit must expose a symbolic readiness boundary and retain a CNL round-trip obligation. Agent tests must run the auxiliary methods and verify that paths are present, not truncated, and connected to the circuit's finding or generation outputs. These auxiliary results complement rather than replace mandatory concrete execution.

## Agent and test contract

Keep reusable ontology code under `ontologies/`, reusable circuit code under `circuits/`, and agent tests under `tests/`. `agent.mjs` must use Codex direct editing and a profile that resolves the isolated core vocabulary. Tests must cover satisfied, violated, conflict, unknown or not-applicable boundaries where relevant, evidence identities, and the generation frame.
