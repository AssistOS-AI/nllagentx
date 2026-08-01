# nllAgent Coding Run

Goal: Read source/agent-brief.md and complete the ontology authoring phase for this evaluation agent. Edit canonical agent files directly, use the installed skill and live SDK catalogs, create the required executable .mjs artifacts and focused tests, and do not replace semantics with JSON.

Project root: /home/salboaie/work/nllagentx
Canonical working directory: /home/salboaie/work/nllagentx/evaluations/agentic-nl-e2e/agents/nl-rule-review-agent
CLI invocation: `node /home/salboaie/work/nllagentx/nllAgent.mjs`

## Mandatory reading order

1. This file.
2. The selected skill files in dependency order:
- `runs/run-DFQR2DRKZuuihgOk/skills/nll-sdk/SKILL.md` (executable contract: `runs/run-DFQR2DRKZuuihgOk/skills/nll-sdk/workflow.mjs`)
- `runs/run-DFQR2DRKZuuihgOk/skills/nll-ontology/SKILL.md` (executable contract: `runs/run-DFQR2DRKZuuihgOk/skills/nll-ontology/workflow.mjs`)
3. The relevant design specifications:
- `../../../../design-specifications/DS-002_Internal_MJS_DSLs_and_SDK.md`
- `../../../../docs/specs/DS039-sdk-public-surfaces-and-tooling.md`
- `../../../../docs/specs/DS038-domain-pack-generation-and-module-ownership.md`
- `../../../../docs/specs/DS041-agentic-natural-language-authoring.md`
- `../../../../docs/specs/DS034-core-language-pack.md`
4. Context catalogs under `runs/run-DFQR2DRKZuuihgOk/context`.
5. Canonical source files needed for the requested change.

Use actual SDK constructors and resolved ontology identities. Keep semantic artifacts as executable `.mjs` modules. Do not create JSON or TypeScript semantic artifacts. Edit canonical agent/task/framework files directly, add tests, run the skill checks, and report typed diagnostics for genuinely unsupported operations.
