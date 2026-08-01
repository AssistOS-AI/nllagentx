# Agentic natural-language end-to-end evaluation

This suite is intentionally different from the infrastructure-only `school-smoke` replay. With
`--invoke-agent`, it creates an isolated agent scaffold, copies `agent-brief.md` into that agent, and invokes
the configured Codex adapter for agent-level `architect`, `ontology`, `circuit`, and `review` phases. It then
creates four random-ID tasks and invokes Codex for task-level `intent` and `longtext` phases before
deterministic execution and replay.

Run it from the project root:

```text
node nllAgent.mjs evaluate --suite agentic-nl-e2e --invoke-agent
```

The retained evaluation root contains the natural-language brief, generated agent program, reusable ontology
and circuits, generated tests, four task folders, every coding run with installed skills and context, task
IntentJS and LongTextJS, concrete results, replay metrics, and suite reports.
