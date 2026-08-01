# Adaptive task-local authoring evaluation

This declaration points to the retained evaluation under `evaluations/adaptive-task-e2e/` and validates DS042
through the public CLI and the real Codex adapter. The retained starting task has
only `task.mjs` plus its exact natural-language source. It deliberately has no task `intent/`, `longtext/`,
`ontologies/`, `circuits/`, `tests/`, `runs/`, or `results/` directory.

The initial agent supplies only the framework `core-language` pack and the `minimal-core` profile. Consequently,
the inherited catalogs contain neither cold-chain meanings nor a provider for the requested transfer-release
audit. Adaptive authoring must add those meanings and behavior under the task, execute concrete, abstract, and
symbolic validation, complete a Codex review, and leave a model-free replayable task.

From the repository root, the real validation command is:

```sh
node nllAgent.mjs analyze \
  --agent-dir evaluations/adaptive-task-e2e/agents/adaptive-core-agent \
  --task-dir evaluations/adaptive-task-e2e/agents/adaptive-core-agent/tasks/task-cold-chain-transfer-core-only \
  --author-adaptive --authoring-cycles 3 --assurance all
```

The generated evidence remains in the task folder. `evaluations/adaptive-task-e2e/initial-inventory.mjs` is the executable precondition record;
it is intentionally not regenerated after the run.
