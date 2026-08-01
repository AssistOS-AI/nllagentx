# nllAgent Coding Run

Goal: Author task IntentJS from the exact instruction and sources. Preserve instruction provenance and request the concrete plus adaptive auxiliary outputs.

Project root: /home/salboaie/work/nllagentx
Canonical working directory: /home/salboaie/work/nllagentx/evaluations/adaptive-task-e2e/agents/adaptive-core-agent/tasks/task-cold-chain-transfer
CLI invocation: `node /home/salboaie/work/nllagentx/nllAgent.mjs`

## Mandatory reading order

1. This file.
2. The selected skill files in dependency order:
- `runs/run-PufYTYg4sTGJqg3D/skills/nll-sdk/SKILL.md` (executable contract: `runs/run-PufYTYg4sTGJqg3D/skills/nll-sdk/workflow.mjs`)
- `runs/run-PufYTYg4sTGJqg3D/skills/nll-ontology/SKILL.md` (executable contract: `runs/run-PufYTYg4sTGJqg3D/skills/nll-ontology/workflow.mjs`)
- `runs/run-PufYTYg4sTGJqg3D/skills/nll-intent/SKILL.md` (executable contract: `runs/run-PufYTYg4sTGJqg3D/skills/nll-intent/workflow.mjs`)
3. The relevant design specifications:
- `../../../../../../design-specifications/DS-002_Internal_MJS_DSLs_and_SDK.md`
- `../../../../../../docs/specs/DS039-sdk-public-surfaces-and-tooling.md`
- `../../../../../../design-specifications/DS-016_Elementary_Logic_Ontology_and_Circuits.md`
- `../../../../../../design-specifications/DS-017_Contradiction_Fallacy_and_Reasoning_Error_Circuits.md`
- `../../../../../../docs/specs/DS038-domain-pack-generation-and-module-ownership.md`
- `../../../../../../docs/specs/DS041-agentic-natural-language-authoring.md`
- `../../../../../../docs/specs/DS042-adaptive-task-local-authoring-and-verification.md`
- `../../../../../../design-specifications/DS-004_IntentJS_Load_Profiles_and_Dynamic_Circuit_Selection.md`
- `../../../../../../docs/specs/DS035-context-and-dependency-resolution.md`
- `../../../../../../docs/specs/DS034-core-language-pack.md`
4. Context catalogs under `runs/run-PufYTYg4sTGJqg3D/context`.
5. Canonical source files needed for the requested change.

Use actual SDK constructors and resolved ontology identities. Keep semantic artifacts as executable `.mjs` modules. Do not create JSON or TypeScript semantic artifacts. Edit canonical agent/task/framework files directly, add tests, run the skill checks, and report typed diagnostics for genuinely unsupported operations.
