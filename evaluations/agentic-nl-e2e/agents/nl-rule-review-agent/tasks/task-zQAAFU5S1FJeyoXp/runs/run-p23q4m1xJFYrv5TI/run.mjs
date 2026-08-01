import { codingRun } from "../../../../../../../../framework/sdk/agent/run.mjs";

export default codingRun("run-p23q4m1xJFYrv5TI")
  .using("codex")
  .cwd("evaluations/agentic-nl-e2e/agents/nl-rule-review-agent/tasks/task-zQAAFU5S1FJeyoXp")
  .installSkills("nll-sdk", "nll-ontology", "nll-intent")
  .objective("Read task.mjs, the registered source files, and the existing agent ontology/circuit catalog. Complete the intent authoring phase for case unsupported-safety-conclusion. Preserve the task instruction exactly, create executable source-grounded semantic code and focused tests, and leave unsupported meanings explicit rather than inventing evidence.")
  .allowEdits("evaluations/agentic-nl-e2e/agents/nl-rule-review-agent/tasks/task-zQAAFU5S1FJeyoXp")
  .check("node /home/salboaie/work/nllagentx/nllAgent.mjs test task --agent-dir /home/salboaie/work/nllagentx/evaluations/agentic-nl-e2e/agents/nl-rule-review-agent --task-dir /home/salboaie/work/nllagentx/evaluations/agentic-nl-e2e/agents/nl-rule-review-agent/tasks/task-zQAAFU5S1FJeyoXp --level fast")
  .seal();
