# nllAgent Coding Run

Goal: Complete the sdk phase according to the selected skill contracts.

Project root: /home/salboaie/work/nllagentx
Canonical working directory: /home/salboaie/work/nllagentx/examples/validation-agent/tasks/task-symbolic-validation
CLI invocation: `node /home/salboaie/work/nllagentx/nllAgent.mjs`

## Mandatory reading order

1. This file.
2. The selected skill files in dependency order:
- `runs/run-Tf5rfphixffsxKZ7/skills/nll-sdk/SKILL.md` (executable contract: `runs/run-Tf5rfphixffsxKZ7/skills/nll-sdk/workflow.mjs`)
3. The relevant original design specifications:
- `../../../../design-specifications/DS-002_Internal_MJS_DSLs_and_SDK.md`
- `../../../../docs/specs/DS034-core-language-pack.md`
4. Context catalogs under `runs/run-Tf5rfphixffsxKZ7/context`.
5. Canonical source files needed for the requested change.

Use actual SDK constructors and resolved ontology identities. Keep semantic artifacts as executable `.mjs` modules. Do not create JSON or TypeScript semantic artifacts. Edit canonical agent/task/framework files directly, add tests, run the skill checks, and report typed diagnostics for genuinely unsupported operations.
