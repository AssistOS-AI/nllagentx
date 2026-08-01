# Evaluation suite agentic-nl-e2e

Modes: `intent-selection`, `materialization`, `end-to-end-analysis`, `end-to-end-generation`, `ordinary-replay`. Coding agent invoked this iteration: no. Retained real authoring replayed: no. Agent authoring phases: `architect`, `ontology`, `circuit`, `review`. Task authoring phases: `intent`, `longtext`.

| Case | Primary Markdown CNL response | Status | Findings | Frames | F1 |
| --- | --- | --- | ---: | ---: | ---: |
| contradictory-rules | [`task-dddH2akHGf1YhjRl`](../agents/nl-rule-review-agent/tasks/task-dddH2akHGf1YhjRl/results/response.md) | failed | 5 | 0 | 0.000 |
| missing-exception-justification | [`task-5pCDItgeJ0no0XXb`](../agents/nl-rule-review-agent/tasks/task-5pCDItgeJ0no0XXb/results/response.md) | failed | 5 | 0 | 0.000 |
| unsupported-safety-conclusion | [`task-zfVJ4is-14Debn0S`](../agents/nl-rule-review-agent/tasks/task-zfVJ4is-14Debn0S/results/response.md) | failed | 5 | 0 | 0.000 |
| generate-compliant-procedure | [`task-dFq6wvV_d972yDE5`](../agents/nl-rule-review-agent/tasks/task-dFq6wvV_d972yDE5/results/response.md) | failed | 5 | 0 | 0.000 |

## Aggregate metrics

- precision: 1.0000
- recall: 0.0000
- f1: 0.0000
- anchorValidity: 1.0000
- replayEquivalent: 1.0000
- responseContract: 0.0000
- responseReplayEquivalent: 1.0000
- authoringCompletion: 1.0000
- elapsedMilliseconds: 49.3273

The linked task artifact is the primary human-facing response. See `authoring.md` for every retained Codex phase, `assurance.md` for auxiliary debug evidence, and `artifacts.md` for all retained files.
