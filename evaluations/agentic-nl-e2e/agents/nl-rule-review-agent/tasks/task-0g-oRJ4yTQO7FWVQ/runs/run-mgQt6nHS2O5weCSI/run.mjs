import { codingRun } from "../../../../../../../../framework/sdk/agent/run.mjs";

export default codingRun("run-mgQt6nHS2O5weCSI")
  .using("codex")
  .cwd("evaluations/agentic-nl-e2e/agents/nl-rule-review-agent/tasks/task-0g-oRJ4yTQO7FWVQ")
  .installSkills("nll-sdk", "nll-ontology", "nll-intent", "nll-longtext")
  .objective("Read task.mjs, the registered source files, and the existing agent ontology/circuit catalog. Complete the longtext authoring phase for case unsupported-safety-conclusion. Preserve the task instruction exactly, create executable source-grounded semantic code and focused tests, and leave unsupported meanings explicit rather than inventing evidence.")
  .allowEdits("evaluations/agentic-nl-e2e/agents/nl-rule-review-agent/tasks/task-0g-oRJ4yTQO7FWVQ")
  .check("node /home/salboaie/work/nllagentx/nllAgent.mjs test task --agent-dir /home/salboaie/work/nllagentx/evaluations/agentic-nl-e2e/agents/nl-rule-review-agent --task-dir /home/salboaie/work/nllagentx/evaluations/agentic-nl-e2e/agents/nl-rule-review-agent/tasks/task-0g-oRJ4yTQO7FWVQ --level fast")
  .seal();
