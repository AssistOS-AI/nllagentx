# Evaluation suite agentic-nl-e2e

Modes: `intent-selection`, `materialization`, `end-to-end-analysis`, `end-to-end-generation`, `ordinary-replay`. Coding agent invoked: yes. Agent authoring phases: `architect`, `ontology`, `circuit`, `review`. Task authoring phases: `intent`, `longtext`.

| Case | Task | Status | Findings | Frames | F1 |
| --- | --- | --- | ---: | ---: | ---: |
| contradictory-rules | [`task-8FzS_rlGDHv7AfH9`](../agents/nl-rule-review-agent/tasks/task-8FzS_rlGDHv7AfH9/results/report.md) | completed | 5 | 0 | 1.000 |
| missing-exception-justification | [`task-WoxQsPCh54QjxO7I`](../agents/nl-rule-review-agent/tasks/task-WoxQsPCh54QjxO7I/results/report.md) | completed | 5 | 0 | 1.000 |
| unsupported-safety-conclusion | [`task-0g-oRJ4yTQO7FWVQ`](../agents/nl-rule-review-agent/tasks/task-0g-oRJ4yTQO7FWVQ/results/report.md) | completed | 5 | 0 | 1.000 |
| generate-compliant-procedure | [`task-o4WLD_kMXKh82gDE`](../agents/nl-rule-review-agent/tasks/task-o4WLD_kMXKh82gDE/results/report.md) | completed | 5 | 6 | 1.000 |

## Aggregate metrics

- precision: 1.0000
- recall: 1.0000
- f1: 1.0000
- anchorValidity: 1.0000
- replayEquivalent: 1.0000
- authoringCompletion: 1.0000
- elapsedMilliseconds: 51.7603

See `authoring.md` for every Codex phase, `assurance.md` for complete per-task auxiliary artifacts, and `artifacts.md` for retained canonical files.
