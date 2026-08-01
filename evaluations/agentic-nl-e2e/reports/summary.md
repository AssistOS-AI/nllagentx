# Evaluation suite agentic-nl-e2e

Modes: `intent-selection`, `materialization`, `end-to-end-analysis`, `end-to-end-generation`, `ordinary-replay`. Coding agent invoked: yes. Agent authoring phases: `architect`, `ontology`, `circuit`, `review`. Task authoring phases: `intent`, `longtext`.

| Case | Primary Markdown CNL response | Status | Findings | Frames | F1 |
| --- | --- | --- | ---: | ---: | ---: |
| contradictory-rules | [`task--gGzZzD3bFKbd-Pc`](../agents/nl-rule-review-agent/tasks/task--gGzZzD3bFKbd-Pc/results/response.md) | failed | 5 | 0 | 1.000 |
| missing-exception-justification | [`task-tUmtraHGU2CZ1cFt`](../agents/nl-rule-review-agent/tasks/task-tUmtraHGU2CZ1cFt/results/response.md) | failed | 5 | 0 | 1.000 |
| unsupported-safety-conclusion | [`task-Fk4Lrn1gwd5vJhjI`](../agents/nl-rule-review-agent/tasks/task-Fk4Lrn1gwd5vJhjI/results/response.md) | failed | 5 | 0 | 1.000 |
| generate-compliant-procedure | [`task-ukqENI41EY_4UDEz`](../agents/nl-rule-review-agent/tasks/task-ukqENI41EY_4UDEz/results/response.md) | failed | 5 | 6 | 1.000 |

## Aggregate metrics

- precision: 1.0000
- recall: 1.0000
- f1: 1.0000
- anchorValidity: 1.0000
- replayEquivalent: 1.0000
- responseContract: 0.0000
- responseReplayEquivalent: 1.0000
- authoringCompletion: 1.0000
- elapsedMilliseconds: 60.8161

The linked task artifact is the primary human-facing response. See `authoring.md` for every Codex phase, `assurance.md` for auxiliary debug evidence, and `artifacts.md` for all retained files.
