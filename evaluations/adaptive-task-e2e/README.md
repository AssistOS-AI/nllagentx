# Retained adaptive task-local authoring evaluation

This directory is the real DS042 validation target. The agent initially provides only `core-language`; the task
initially provides only its declaration and exact natural-language source. `initial-inventory.mjs` records that
precondition. Running the public adaptive CLI invokes Codex to author the missing task semantic programs and then
retains concrete, abstract, symbolic, review, and model-free replay evidence in this tree.

The interrupted `task-cold-chain-transfer` attempt is retained because it exposed that the repository's historical
`minimal-core` profile also loads `logic-basic` and `reasoning-errors`. The accepted target is
`task-cold-chain-transfer-core-only`, which uses the agent-local `adaptive-core-only` profile and resolves exactly
one inherited ontology and one inherited circuit before authoring.

After adaptive authoring, run `node evaluations/adaptive-task-e2e/validate.mjs`. This executable oracle rejects
generic core grounding and requires task-local ontology/circuit code, the invalid calibration and missing
receiving acknowledgement in finding evidence, complete auxiliary passes, and equivalent replay.
