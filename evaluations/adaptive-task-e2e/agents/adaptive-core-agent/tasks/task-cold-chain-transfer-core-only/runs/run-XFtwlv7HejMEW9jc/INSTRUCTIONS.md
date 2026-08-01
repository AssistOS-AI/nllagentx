# nllAgent Coding Run

Goal: Audit the task instruction and sources against the resolved ontology. Create a minimal task-local OntologyJS extension and tests only for genuinely missing meanings; reuse agent and framework identities exactly and do not encode source facts as ontology facts.

Project root: /home/salboaie/work/nllagentx
Canonical working directory: /home/salboaie/work/nllagentx/evaluations/adaptive-task-e2e/agents/adaptive-core-agent/tasks/task-cold-chain-transfer-core-only
CLI invocation: `node /home/salboaie/work/nllagentx/nllAgent.mjs`

## Mandatory reading order

1. This file.
2. The selected skill files in dependency order:
- `runs/run-XFtwlv7HejMEW9jc/skills/nll-sdk/SKILL.md` (executable contract: `runs/run-XFtwlv7HejMEW9jc/skills/nll-sdk/workflow.mjs`)
- `runs/run-XFtwlv7HejMEW9jc/skills/nll-ontology/SKILL.md` (executable contract: `runs/run-XFtwlv7HejMEW9jc/skills/nll-ontology/workflow.mjs`)
3. The relevant design specifications:
- `../../../../../../design-specifications/DS-002_Internal_MJS_DSLs_and_SDK.md`
- `../../../../../../docs/specs/DS039-sdk-public-surfaces-and-tooling.md`
- `../../../../../../docs/specs/DS043-primary-markdown-cnl-response.md`
- `../../../../../../docs/specs/DS044-response-circuit-composition-and-intent-presentation.md`
- `../../../../../../docs/specs/DS038-domain-pack-generation-and-module-ownership.md`
- `../../../../../../docs/specs/DS041-agentic-natural-language-authoring.md`
- `../../../../../../docs/specs/DS042-adaptive-task-local-authoring-and-verification.md`
- `../../../../../../docs/specs/DS034-core-language-pack.md`
4. Context catalogs under `runs/run-XFtwlv7HejMEW9jc/context`, including the resolved semantic and response-circuit catalogs.
5. Canonical source files needed for the requested change.

Use actual SDK constructors and resolved ontology identities. Keep semantic artifacts as executable `.mjs` modules. Do not create JSON or TypeScript semantic artifacts. Edit canonical agent/task/framework files directly, add tests, run the skill checks, and report typed diagnostics for genuinely unsupported operations.
