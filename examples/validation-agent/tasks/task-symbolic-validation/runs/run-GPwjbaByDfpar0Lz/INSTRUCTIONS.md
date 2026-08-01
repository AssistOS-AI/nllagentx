# nllAgent Coding Run

Goal: Review and repair the supplied deterministic failures without weakening tests.

Project root: /home/salboaie/work/nllagentx
Canonical working directory: /home/salboaie/work/nllagentx/examples/validation-agent/tasks/task-symbolic-validation
CLI invocation: `node /home/salboaie/work/nllagentx/nllAgent.mjs`

## Mandatory reading order

1. This file.
2. The selected skill files in dependency order:
- `runs/run-GPwjbaByDfpar0Lz/skills/nll-test/SKILL.md` (executable contract: `runs/run-GPwjbaByDfpar0Lz/skills/nll-test/workflow.mjs`)
- `runs/run-GPwjbaByDfpar0Lz/skills/nll-sdk/SKILL.md` (executable contract: `runs/run-GPwjbaByDfpar0Lz/skills/nll-sdk/workflow.mjs`)
- `runs/run-GPwjbaByDfpar0Lz/skills/nll-runtime/SKILL.md` (executable contract: `runs/run-GPwjbaByDfpar0Lz/skills/nll-runtime/workflow.mjs`)
- `runs/run-GPwjbaByDfpar0Lz/skills/nll-ontology/SKILL.md` (executable contract: `runs/run-GPwjbaByDfpar0Lz/skills/nll-ontology/workflow.mjs`)
- `runs/run-GPwjbaByDfpar0Lz/skills/nll-circuit/SKILL.md` (executable contract: `runs/run-GPwjbaByDfpar0Lz/skills/nll-circuit/workflow.mjs`)
3. The relevant original design specifications:
- `../../../../design-specifications/DS-005_Testing_and_Developer_Verification.md`
- `../../../../design-specifications/DS-002_Internal_MJS_DSLs_and_SDK.md`
- `../../../../design-specifications/DS-003_SemanticStore_Circuit_Runtime_and_Analysis_Algorithms.md`
- `../../../../design-specifications/DS-007_Core_Common_Sense_Ontology_and_Circuits.md`
- `../../../../design-specifications/DS-008_General_World_Knowledge_Ontology_and_Circuits.md`
- `../../../../design-specifications/DS-009_Mathematics_Ontology_and_Circuits.md`
- `../../../../design-specifications/DS-010_Physics_Ontology_and_Circuits.md`
- `../../../../design-specifications/DS-011_Chemistry_Ontology_and_Circuits.md`
- `../../../../design-specifications/DS-012_Biology_Ontology_and_Circuits.md`
- `../../../../design-specifications/DS-013_Psychology_Emotion_and_Motivation_Ontology_and_Circuits.md`
- `../../../../design-specifications/DS-014_Anthropology_Ontology_and_Circuits.md`
- `../../../../design-specifications/DS-015_Sociology_Ontology_and_Circuits.md`
- `../../../../design-specifications/DS-016_Elementary_Logic_Ontology_and_Circuits.md`
- `../../../../design-specifications/DS-017_Contradiction_Fallacy_and_Reasoning_Error_Circuits.md`
- `../../../../design-specifications/DS-018_Law_Legality_and_Normative_Documents_Ontology_and_Circuits.md`
- `../../../../design-specifications/DS-019_Social_Interaction_Communication_and_Everyday_Norms.md`
- `../../../../design-specifications/DS-000_System_Architecture_and_Check_Catalog.md`
4. Context catalogs under `runs/run-GPwjbaByDfpar0Lz/context`.
5. Canonical source files needed for the requested change.

Use actual SDK constructors and resolved ontology identities. Keep semantic artifacts as executable `.mjs` modules. Do not create JSON or TypeScript semantic artifacts. Edit canonical agent/task/framework files directly, add tests, run the skill checks, and report typed diagnostics for genuinely unsupported operations.
