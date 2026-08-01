import { codingRun } from "../../../../../../../../framework/sdk/agent/run.mjs";

export default codingRun("run-67GxvPT3pqjztK8I")
  .using("codex")
  .cwd("evaluations/agentic-nl-e2e/agents/nl-rule-review-agent/tasks/task-OdEYKCfza1g-k2ly")
  .installSkills("nll-sdk", "nll-ontology", "nll-intent")
  .objective("Read task.mjs, the registered source files, and the existing agent ontology/circuit catalog. Complete the intent authoring phase for case generate-compliant-procedure. Preserve the task instruction exactly, create executable source-grounded semantic code and focused tests, and leave unsupported meanings explicit rather than inventing evidence.")
  .allowEdits("evaluations/agentic-nl-e2e/agents/nl-rule-review-agent/tasks/task-OdEYKCfza1g-k2ly")
  .check("node /home/salboaie/work/nllagentx/nllAgent.mjs test task --agent-dir /home/salboaie/work/nllagentx/evaluations/agentic-nl-e2e/agents/nl-rule-review-agent --task-dir /home/salboaie/work/nllagentx/evaluations/agentic-nl-e2e/agents/nl-rule-review-agent/tasks/task-OdEYKCfza1g-k2ly --level fast")
  .seal();
