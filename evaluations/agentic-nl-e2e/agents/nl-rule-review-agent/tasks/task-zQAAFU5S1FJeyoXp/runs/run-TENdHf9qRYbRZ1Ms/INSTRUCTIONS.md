# nllAgent Coding Run

Goal: Read task.mjs, the registered source files, and the existing agent ontology/circuit catalog. Complete the longtext authoring phase for case unsupported-safety-conclusion. Preserve the task instruction exactly, create executable source-grounded semantic code and focused tests, and leave unsupported meanings explicit rather than inventing evidence.

Project root: /home/salboaie/work/nllagentx
Canonical working directory: /home/salboaie/work/nllagentx/evaluations/agentic-nl-e2e/agents/nl-rule-review-agent/tasks/task-zQAAFU5S1FJeyoXp
CLI invocation: `node /home/salboaie/work/nllagentx/nllAgent.mjs`

## Mandatory reading order

1. This file.
2. The selected skill files in dependency order:
- `runs/run-TENdHf9qRYbRZ1Ms/skills/nll-sdk/SKILL.md` (executable contract: `runs/run-TENdHf9qRYbRZ1Ms/skills/nll-sdk/workflow.mjs`)
- `runs/run-TENdHf9qRYbRZ1Ms/skills/nll-ontology/SKILL.md` (executable contract: `runs/run-TENdHf9qRYbRZ1Ms/skills/nll-ontology/workflow.mjs`)
- `runs/run-TENdHf9qRYbRZ1Ms/skills/nll-intent/SKILL.md` (executable contract: `runs/run-TENdHf9qRYbRZ1Ms/skills/nll-intent/workflow.mjs`)
- `runs/run-TENdHf9qRYbRZ1Ms/skills/nll-longtext/SKILL.md` (executable contract: `runs/run-TENdHf9qRYbRZ1Ms/skills/nll-longtext/workflow.mjs`)
3. The relevant design specifications:
- `../../../../../../design-specifications/DS-002_Internal_MJS_DSLs_and_SDK.md`
- `../../../../../../docs/specs/DS039-sdk-public-surfaces-and-tooling.md`
- `../../../../../../docs/specs/DS038-domain-pack-generation-and-module-ownership.md`
- `../../../../../../docs/specs/DS041-agentic-natural-language-authoring.md`
- `../../../../../../design-specifications/DS-004_IntentJS_Load_Profiles_and_Dynamic_Circuit_Selection.md`
- `../../../../../../docs/specs/DS035-context-and-dependency-resolution.md`
- `../../../../../../docs/specs/DS037-source-extraction-and-stable-offsets.md`
- `../../../../../../docs/specs/DS034-core-language-pack.md`
4. Context catalogs under `runs/run-TENdHf9qRYbRZ1Ms/context`.
5. Canonical source files needed for the requested change.

Use actual SDK constructors and resolved ontology identities. Keep semantic artifacts as executable `.mjs` modules. Do not create JSON or TypeScript semantic artifacts. Edit canonical agent/task/framework files directly, add tests, run the skill checks, and report typed diagnostics for genuinely unsupported operations.
