# nllAgent Coding Run

Goal: Review and repair the supplied deterministic failures without weakening tests.

Project root: /home/salboaie/work/nllagentx
Canonical working directory: /home/salboaie/work/nllagentx/evaluations/agentic-nl-e2e/agents/nl-rule-review-agent
CLI invocation: `node /home/salboaie/work/nllagentx/nllAgent.mjs`

## Mandatory reading order

1. This file.
2. The selected skill files in dependency order:
- `runs/run-EZluncqzSttBkMKO/skills/nll-test/SKILL.md` (executable contract: `runs/run-EZluncqzSttBkMKO/skills/nll-test/workflow.mjs`)
- `runs/run-EZluncqzSttBkMKO/skills/nll-sdk/SKILL.md` (executable contract: `runs/run-EZluncqzSttBkMKO/skills/nll-sdk/workflow.mjs`)
- `runs/run-EZluncqzSttBkMKO/skills/nll-ontology/SKILL.md` (executable contract: `runs/run-EZluncqzSttBkMKO/skills/nll-ontology/workflow.mjs`)
- `runs/run-EZluncqzSttBkMKO/skills/nll-intent/SKILL.md` (executable contract: `runs/run-EZluncqzSttBkMKO/skills/nll-intent/workflow.mjs`)
- `runs/run-EZluncqzSttBkMKO/skills/nll-longtext/SKILL.md` (executable contract: `runs/run-EZluncqzSttBkMKO/skills/nll-longtext/workflow.mjs`)
- `runs/run-EZluncqzSttBkMKO/skills/nll-runtime/SKILL.md` (executable contract: `runs/run-EZluncqzSttBkMKO/skills/nll-runtime/workflow.mjs`)
- `runs/run-EZluncqzSttBkMKO/skills/nll-circuit/SKILL.md` (executable contract: `runs/run-EZluncqzSttBkMKO/skills/nll-circuit/workflow.mjs`)
3. The relevant design specifications:
- `../../../../design-specifications/DS-005_Testing_and_Developer_Verification.md`
- `../../../../docs/specs/DS042-adaptive-task-local-authoring-and-verification.md`
- `../../../../design-specifications/DS-002_Internal_MJS_DSLs_and_SDK.md`
- `../../../../docs/specs/DS039-sdk-public-surfaces-and-tooling.md`
- `../../../../docs/specs/DS038-domain-pack-generation-and-module-ownership.md`
- `../../../../docs/specs/DS041-agentic-natural-language-authoring.md`
- `../../../../design-specifications/DS-004_IntentJS_Load_Profiles_and_Dynamic_Circuit_Selection.md`
- `../../../../docs/specs/DS035-context-and-dependency-resolution.md`
- `../../../../docs/specs/DS037-source-extraction-and-stable-offsets.md`
- `../../../../design-specifications/DS-003_SemanticStore_Circuit_Runtime_and_Analysis_Algorithms.md`
- `../../../../design-specifications/DS-000_System_Architecture_and_Check_Catalog.md`
- `../../../../docs/specs/DS005-preserved-semanticstore-circuit-runtime-and-analysis-algorithms.md`
- `../../../../docs/specs/DS034-core-language-pack.md`
4. Context catalogs under `runs/run-EZluncqzSttBkMKO/context`.
5. Canonical source files needed for the requested change.

Use actual SDK constructors and resolved ontology identities. Keep semantic artifacts as executable `.mjs` modules. Do not create JSON or TypeScript semantic artifacts. Edit canonical agent/task/framework files directly, add tests, run the skill checks, and report typed diagnostics for genuinely unsupported operations.
