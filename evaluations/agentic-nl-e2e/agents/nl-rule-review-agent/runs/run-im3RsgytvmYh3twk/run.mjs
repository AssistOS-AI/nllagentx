import { codingRun } from "../../../../../../framework/sdk/agent/run.mjs";

export default codingRun("run-im3RsgytvmYh3twk")
  .using("codex")
  .cwd("evaluations/agentic-nl-e2e/agents/nl-rule-review-agent")
  .installSkills("nll-sdk", "nll-runtime", "nll-ontology", "nll-circuit")
  .objective("Read source/agent-brief.md and complete the circuit authoring phase for this evaluation agent. Edit canonical agent files directly, use the installed skill and live SDK, ontology, semantic-circuit and response-circuit catalogs, create the required executable .mjs artifacts and focused tests, and do not replace semantics with JSON. Findings must carry qualitative messages, structured requirement details and exact evidence usable by the primary Markdown CNL response.")
  .allowEdits("evaluations/agentic-nl-e2e/agents/nl-rule-review-agent")
  .check("node /home/salboaie/work/nllagentx/nllAgent.mjs test agent --agent-dir /home/salboaie/work/nllagentx/evaluations/agentic-nl-e2e/agents/nl-rule-review-agent --level fast")
  .seal();
