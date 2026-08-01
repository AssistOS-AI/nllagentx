# nllAgent Coding Run

Goal: Audit whether the combined framework, agent, and task circuit registry can perform the requested operation realistically. Create task-local CircuitJS and focused tests only for missing behavior. Integrate through declared capabilities, concrete execution, abstract preflight, symbolic decision coverage, evidence-bearing findings, and typed CNL generation where requested.

Project root: /home/salboaie/work/nllagentx
Canonical working directory: /home/salboaie/work/nllagentx/evaluations/adaptive-task-e2e/agents/adaptive-core-agent/tasks/task-cold-chain-transfer-core-only
CLI invocation: `node /home/salboaie/work/nllagentx/nllAgent.mjs`

## Mandatory reading order

1. This file.
2. The selected skill files in dependency order:
- `runs/run-JG6l_vqaIyOcf5W2/skills/nll-sdk/SKILL.md` (executable contract: `runs/run-JG6l_vqaIyOcf5W2/skills/nll-sdk/workflow.mjs`)
- `runs/run-JG6l_vqaIyOcf5W2/skills/nll-runtime/SKILL.md` (executable contract: `runs/run-JG6l_vqaIyOcf5W2/skills/nll-runtime/workflow.mjs`)
- `runs/run-JG6l_vqaIyOcf5W2/skills/nll-ontology/SKILL.md` (executable contract: `runs/run-JG6l_vqaIyOcf5W2/skills/nll-ontology/workflow.mjs`)
- `runs/run-JG6l_vqaIyOcf5W2/skills/nll-circuit/SKILL.md` (executable contract: `runs/run-JG6l_vqaIyOcf5W2/skills/nll-circuit/workflow.mjs`)
3. The relevant design specifications:
- `../../../../../../design-specifications/DS-002_Internal_MJS_DSLs_and_SDK.md`
- `../../../../../../docs/specs/DS039-sdk-public-surfaces-and-tooling.md`
- `../../../../../../design-specifications/DS-003_SemanticStore_Circuit_Runtime_and_Analysis_Algorithms.md`
- `../../../../../../docs/specs/DS038-domain-pack-generation-and-module-ownership.md`
- `../../../../../../docs/specs/DS041-agentic-natural-language-authoring.md`
- `../../../../../../docs/specs/DS042-adaptive-task-local-authoring-and-verification.md`
- `../../../../../../design-specifications/DS-000_System_Architecture_and_Check_Catalog.md`
- `../../../../../../docs/specs/DS005-preserved-semanticstore-circuit-runtime-and-analysis-algorithms.md`
- `../../../../../../docs/specs/DS034-core-language-pack.md`
4. Context catalogs under `runs/run-JG6l_vqaIyOcf5W2/context`.
5. Canonical source files needed for the requested change.

Use actual SDK constructors and resolved ontology identities. Keep semantic artifacts as executable `.mjs` modules. Do not create JSON or TypeScript semantic artifacts. Edit canonical agent/task/framework files directly, add tests, run the skill checks, and report typed diagnostics for genuinely unsupported operations.
