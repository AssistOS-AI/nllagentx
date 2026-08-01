# Evaluation suite agentic-nl-e2e

Modes: `intent-selection`, `materialization`, `end-to-end-analysis`, `end-to-end-generation`, `ordinary-replay`. Coding agent invoked: yes. Agent authoring phases: `architect`, `ontology`, `circuit`. Task authoring phases: `intent`, `longtext`.

| Case | Task | Status | Findings | Frames | F1 |
| --- | --- | --- | ---: | ---: | ---: |
| contradictory-rules | [`task-IWMI6MFh9xiHG2Ba`](../agents/nl-rule-review-agent/tasks/task-IWMI6MFh9xiHG2Ba/results/report.md) | completed | 5 | 0 | 0.333 |
| missing-exception-justification | [`task-JwstBAp9Xoh5Ea5i`](../agents/nl-rule-review-agent/tasks/task-JwstBAp9Xoh5Ea5i/results/report.md) | completed | 5 | 0 | 0.333 |
| unsupported-safety-conclusion | [`task-zQAAFU5S1FJeyoXp`](../agents/nl-rule-review-agent/tasks/task-zQAAFU5S1FJeyoXp/results/report.md) | completed | 5 | 0 | 0.333 |
| generate-compliant-procedure | [`task-OdEYKCfza1g-k2ly`](../agents/nl-rule-review-agent/tasks/task-OdEYKCfza1g-k2ly/results/report.md) | completed | 5 | 6 | 0.333 |

## Aggregate metrics

- precision: 0.2000
- recall: 1.0000
- f1: 0.3333
- anchorValidity: 1.0000
- replayEquivalent: 1.0000
- authoringCompletion: 1.0000
- elapsedMilliseconds: 51.9424

See `authoring.md` for every Codex phase and `artifacts.md` for retained canonical files.
