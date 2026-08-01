import { codingRun } from "../../../../../../../../framework/sdk/agent/run.mjs";

export default codingRun("run-pby0aK4QlAuZV9P5")
  .using("codex")
  .cwd("evaluations/agentic-nl-e2e/agents/nl-rule-review-agent/tasks/task-Fk4Lrn1gwd5vJhjI")
  .installSkills("nll-sdk", "nll-ontology", "nll-intent", "nll-longtext")
  .objective("Read task.mjs, the registered source files, and the existing agent ontology, semantic-circuit and response-circuit catalogs. Complete the longtext authoring phase for case unsupported-safety-conclusion. Preserve the task instruction exactly, create executable source-grounded semantic code and focused tests, and leave unsupported meanings explicit rather than inventing evidence. IntentJS must request markdownCnl() and declare an appropriate .present(...) policy; ground the decisive source passages needed for a concise qualitative response.")
  .allowEdits("evaluations/agentic-nl-e2e/agents/nl-rule-review-agent/tasks/task-Fk4Lrn1gwd5vJhjI")
  .check("node /home/salboaie/work/nllagentx/nllAgent.mjs test task --agent-dir /home/salboaie/work/nllagentx/evaluations/agentic-nl-e2e/agents/nl-rule-review-agent --task-dir /home/salboaie/work/nllagentx/evaluations/agentic-nl-e2e/agents/nl-rule-review-agent/tasks/task-Fk4Lrn1gwd5vJhjI --level fast")
  .seal();
