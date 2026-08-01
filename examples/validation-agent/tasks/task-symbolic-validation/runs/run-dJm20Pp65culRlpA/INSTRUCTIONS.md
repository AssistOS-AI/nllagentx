# nllAgent Coding Run

Goal: Review and repair the supplied deterministic failures without weakening tests.

Project root: /home/salboaie/work/nllagentx
Canonical working directory: /home/salboaie/work/nllagentx/examples/validation-agent/tasks/task-symbolic-validation
CLI invocation: `node /home/salboaie/work/nllagentx/nllAgent.mjs`

## Mandatory reading order

1. This file.
2. The selected skill files in dependency order:
- `runs/run-dJm20Pp65culRlpA/skills/nll-test/SKILL.md` (executable contract: `runs/run-dJm20Pp65culRlpA/skills/nll-test/workflow.mjs`)
- `runs/run-dJm20Pp65culRlpA/skills/nll-sdk/SKILL.md` (executable contract: `runs/run-dJm20Pp65culRlpA/skills/nll-sdk/workflow.mjs`)
- `runs/run-dJm20Pp65culRlpA/skills/nll-runtime/SKILL.md` (executable contract: `runs/run-dJm20Pp65culRlpA/skills/nll-runtime/workflow.mjs`)
- `runs/run-dJm20Pp65culRlpA/skills/nll-ontology/SKILL.md` (executable contract: `runs/run-dJm20Pp65culRlpA/skills/nll-ontology/workflow.mjs`)
- `runs/run-dJm20Pp65culRlpA/skills/nll-circuit/SKILL.md` (executable contract: `runs/run-dJm20Pp65culRlpA/skills/nll-circuit/workflow.mjs`)
3. The relevant original design specifications:
- `../../../../design-specifications/DS-005_Testing_and_Developer_Verification.md`
- `../../../../design-specifications/DS-002_Internal_MJS_DSLs_and_SDK.md`
- `../../../../design-specifications/DS-003_SemanticStore_Circuit_Runtime_and_Analysis_Algorithms.md`
- `../../../../design-specifications/DS-016_Elementary_Logic_Ontology_and_Circuits.md`
- `../../../../design-specifications/DS-017_Contradiction_Fallacy_and_Reasoning_Error_Circuits.md`
- `../../../../design-specifications/DS-000_System_Architecture_and_Check_Catalog.md`
- `../../../../docs/specs/DS034-core-language-pack.md`
4. Context catalogs under `runs/run-dJm20Pp65culRlpA/context`.
5. Canonical source files needed for the requested change.

Use actual SDK constructors and resolved ontology identities. Keep semantic artifacts as executable `.mjs` modules. Do not create JSON or TypeScript semantic artifacts. Edit canonical agent/task/framework files directly, add tests, run the skill checks, and report typed diagnostics for genuinely unsupported operations.
