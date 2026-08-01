# nllAgent Coding Run

Goal: Read source/agent-brief.md and complete the architect authoring phase for this evaluation agent. Edit canonical agent files directly, use the installed skill and live SDK, ontology, semantic-circuit and response-circuit catalogs, create the required executable .mjs artifacts and focused tests, and do not replace semantics with JSON. Findings must carry qualitative messages, structured requirement details and exact evidence usable by the primary Markdown CNL response.

Project root: /home/salboaie/work/nllagentx
Canonical working directory: /home/salboaie/work/nllagentx/evaluations/agentic-nl-e2e/agents/nl-rule-review-agent
CLI invocation: `node /home/salboaie/work/nllagentx/nllAgent.mjs`

## Mandatory reading order

1. This file.
2. The selected skill files in dependency order:
- `runs/run-ilpNoyjREPp1f8Wl/skills/nll-architect/SKILL.md` (executable contract: `runs/run-ilpNoyjREPp1f8Wl/skills/nll-architect/workflow.mjs`)
3. The relevant design specifications:
- `../../../../design-specifications/DS-000_System_Architecture_and_Check_Catalog.md`
- `../../../../design-specifications/DS-004_IntentJS_Load_Profiles_and_Dynamic_Circuit_Selection.md`
- `../../../../docs/specs/DS035-context-and-dependency-resolution.md`
- `../../../../docs/specs/DS041-agentic-natural-language-authoring.md`
- `../../../../docs/specs/DS042-adaptive-task-local-authoring-and-verification.md`
- `../../../../docs/specs/DS043-primary-markdown-cnl-response.md`
- `../../../../docs/specs/DS044-response-circuit-composition-and-intent-presentation.md`
- `../../../../docs/specs/DS034-core-language-pack.md`
4. Context catalogs under `runs/run-ilpNoyjREPp1f8Wl/context`, including the resolved semantic and response-circuit catalogs.
5. Canonical source files needed for the requested change.

Use actual SDK constructors and resolved ontology identities. Keep semantic artifacts as executable `.mjs` modules. Do not create JSON or TypeScript semantic artifacts. Edit canonical agent/task/framework files directly, add tests, run the skill checks, and report typed diagnostics for genuinely unsupported operations.
