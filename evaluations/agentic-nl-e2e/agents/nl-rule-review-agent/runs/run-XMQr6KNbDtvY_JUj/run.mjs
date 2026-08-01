import { codingRun } from "../../../../../../framework/sdk/agent/run.mjs";

export default codingRun("run-XMQr6KNbDtvY_JUj")
  .using("codex")
  .cwd("evaluations/agentic-nl-e2e/agents/nl-rule-review-agent")
  .installSkills("nll-sdk", "nll-ontology")
  .objective("Read source/agent-brief.md and complete the ontology authoring phase for this evaluation agent. Edit canonical agent files directly, use the installed skill and live SDK catalogs, create the required executable .mjs artifacts and focused tests, and do not replace semantics with JSON.")
  .allowEdits("evaluations/agentic-nl-e2e/agents/nl-rule-review-agent")
  .check("node /home/salboaie/work/nllagentx/nllAgent.mjs test agent --agent-dir /home/salboaie/work/nllagentx/evaluations/agentic-nl-e2e/agents/nl-rule-review-agent --level fast")
  .seal();
