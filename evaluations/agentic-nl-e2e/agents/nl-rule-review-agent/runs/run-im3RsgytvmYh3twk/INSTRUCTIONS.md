# nllAgent Coding Run

Goal: Read source/agent-brief.md and complete the circuit authoring phase for this evaluation agent. Edit canonical agent files directly, use the installed skill and live SDK, ontology, semantic-circuit and response-circuit catalogs, create the required executable .mjs artifacts and focused tests, and do not replace semantics with JSON. Findings must carry qualitative messages, structured requirement details and exact evidence usable by the primary Markdown CNL response.

Project root: /home/salboaie/work/nllagentx
Canonical working directory: /home/salboaie/work/nllagentx/evaluations/agentic-nl-e2e/agents/nl-rule-review-agent
CLI invocation: `node /home/salboaie/work/nllagentx/nllAgent.mjs`

## Mandatory reading order

1. This file.
2. The selected skill files in dependency order:
- `runs/run-im3RsgytvmYh3twk/skills/nll-sdk/SKILL.md` (executable contract: `runs/run-im3RsgytvmYh3twk/skills/nll-sdk/workflow.mjs`)
- `runs/run-im3RsgytvmYh3twk/skills/nll-runtime/SKILL.md` (executable contract: `runs/run-im3RsgytvmYh3twk/skills/nll-runtime/workflow.mjs`)
- `runs/run-im3RsgytvmYh3twk/skills/nll-ontology/SKILL.md` (executable contract: `runs/run-im3RsgytvmYh3twk/skills/nll-ontology/workflow.mjs`)
- `runs/run-im3RsgytvmYh3twk/skills/nll-circuit/SKILL.md` (executable contract: `runs/run-im3RsgytvmYh3twk/skills/nll-circuit/workflow.mjs`)
3. The relevant design specifications:
- `../../../../design-specifications/DS-002_Internal_MJS_DSLs_and_SDK.md`
- `../../../../docs/specs/DS039-sdk-public-surfaces-and-tooling.md`
- `../../../../docs/specs/DS043-primary-markdown-cnl-response.md`
- `../../../../docs/specs/DS044-response-circuit-composition-and-intent-presentation.md`
- `../../../../design-specifications/DS-003_SemanticStore_Circuit_Runtime_and_Analysis_Algorithms.md`
- `../../../../docs/specs/DS038-domain-pack-generation-and-module-ownership.md`
- `../../../../docs/specs/DS041-agentic-natural-language-authoring.md`
- `../../../../docs/specs/DS042-adaptive-task-local-authoring-and-verification.md`
- `../../../../design-specifications/DS-000_System_Architecture_and_Check_Catalog.md`
- `../../../../docs/specs/DS005-preserved-semanticstore-circuit-runtime-and-analysis-algorithms.md`
- `../../../../docs/specs/DS034-core-language-pack.md`
4. Context catalogs under `runs/run-im3RsgytvmYh3twk/context`, including the resolved semantic and response-circuit catalogs.
5. Canonical source files needed for the requested change.

Use actual SDK constructors and resolved ontology identities. Keep semantic artifacts as executable `.mjs` modules. Do not create JSON or TypeScript semantic artifacts. Edit canonical agent/task/framework files directly, add tests, run the skill checks, and report typed diagnostics for genuinely unsupported operations.
