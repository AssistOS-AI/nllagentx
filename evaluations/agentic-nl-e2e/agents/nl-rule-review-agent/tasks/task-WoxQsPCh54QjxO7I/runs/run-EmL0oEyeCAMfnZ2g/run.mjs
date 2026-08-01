import { codingRun } from "../../../../../../../../framework/sdk/agent/run.mjs";

export default codingRun("run-EmL0oEyeCAMfnZ2g")
  .using("codex")
  .cwd("evaluations/agentic-nl-e2e/agents/nl-rule-review-agent/tasks/task-WoxQsPCh54QjxO7I")
  .installSkills("nll-sdk", "nll-ontology", "nll-intent", "nll-longtext")
  .objective("Read task.mjs, the registered source files, and the existing agent ontology/circuit catalog. Complete the longtext authoring phase for case missing-exception-justification. Preserve the task instruction exactly, create executable source-grounded semantic code and focused tests, and leave unsupported meanings explicit rather than inventing evidence.")
  .allowEdits("evaluations/agentic-nl-e2e/agents/nl-rule-review-agent/tasks/task-WoxQsPCh54QjxO7I")
  .check("node /home/salboaie/work/nllagentx/nllAgent.mjs test task --agent-dir /home/salboaie/work/nllagentx/evaluations/agentic-nl-e2e/agents/nl-rule-review-agent --task-dir /home/salboaie/work/nllagentx/evaluations/agentic-nl-e2e/agents/nl-rule-review-agent/tasks/task-WoxQsPCh54QjxO7I --level fast")
  .seal();
