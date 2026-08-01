# nllAgent Coding Run

Goal: Read task.mjs, the registered source files, and the existing agent ontology, semantic-circuit and response-circuit catalogs. Complete the longtext authoring phase for case generate-compliant-procedure. Preserve the task instruction exactly, create executable source-grounded semantic code and focused tests, and leave unsupported meanings explicit rather than inventing evidence. IntentJS must request markdownCnl() and declare an appropriate .present(...) policy; ground the decisive source passages needed for a concise qualitative response.

Project root: /home/salboaie/work/nllagentx
Canonical working directory: /home/salboaie/work/nllagentx/evaluations/agentic-nl-e2e/agents/nl-rule-review-agent/tasks/task-ukqENI41EY_4UDEz
CLI invocation: `node /home/salboaie/work/nllagentx/nllAgent.mjs`

## Mandatory reading order

1. This file.
2. The selected skill files in dependency order:
- `runs/run-ZpUu8oAYVQj3rwGX/skills/nll-sdk/SKILL.md` (executable contract: `runs/run-ZpUu8oAYVQj3rwGX/skills/nll-sdk/workflow.mjs`)
- `runs/run-ZpUu8oAYVQj3rwGX/skills/nll-ontology/SKILL.md` (executable contract: `runs/run-ZpUu8oAYVQj3rwGX/skills/nll-ontology/workflow.mjs`)
- `runs/run-ZpUu8oAYVQj3rwGX/skills/nll-intent/SKILL.md` (executable contract: `runs/run-ZpUu8oAYVQj3rwGX/skills/nll-intent/workflow.mjs`)
- `runs/run-ZpUu8oAYVQj3rwGX/skills/nll-longtext/SKILL.md` (executable contract: `runs/run-ZpUu8oAYVQj3rwGX/skills/nll-longtext/workflow.mjs`)
3. The relevant design specifications:
- `../../../../../../design-specifications/DS-002_Internal_MJS_DSLs_and_SDK.md`
- `../../../../../../docs/specs/DS039-sdk-public-surfaces-and-tooling.md`
- `../../../../../../docs/specs/DS043-primary-markdown-cnl-response.md`
- `../../../../../../docs/specs/DS044-response-circuit-composition-and-intent-presentation.md`
- `../../../../../../docs/specs/DS038-domain-pack-generation-and-module-ownership.md`
- `../../../../../../docs/specs/DS041-agentic-natural-language-authoring.md`
- `../../../../../../docs/specs/DS042-adaptive-task-local-authoring-and-verification.md`
- `../../../../../../design-specifications/DS-004_IntentJS_Load_Profiles_and_Dynamic_Circuit_Selection.md`
- `../../../../../../docs/specs/DS035-context-and-dependency-resolution.md`
- `../../../../../../docs/specs/DS037-source-extraction-and-stable-offsets.md`
- `../../../../../../docs/specs/DS034-core-language-pack.md`
4. Context catalogs under `runs/run-ZpUu8oAYVQj3rwGX/context`, including the resolved semantic and response-circuit catalogs.
5. Canonical source files needed for the requested change.

Use actual SDK constructors and resolved ontology identities. Keep semantic artifacts as executable `.mjs` modules. Do not create JSON or TypeScript semantic artifacts. Edit canonical agent/task/framework files directly, add tests, run the skill checks, and report typed diagnostics for genuinely unsupported operations.
