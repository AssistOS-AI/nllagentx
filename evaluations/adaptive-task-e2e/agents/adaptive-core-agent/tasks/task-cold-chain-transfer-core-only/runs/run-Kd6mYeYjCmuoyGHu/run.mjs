import { codingRun } from "../../../../../../../../framework/sdk/agent/run.mjs";

export default codingRun("run-Kd6mYeYjCmuoyGHu")
  .using("codex")
  .cwd("evaluations/adaptive-task-e2e/agents/adaptive-core-agent/tasks/task-cold-chain-transfer-core-only")
  .installSkills("nll-sdk", "nll-ontology")
  .objective("Audit the task instruction and sources against the resolved ontology. Create a minimal task-local OntologyJS extension and tests only for genuinely missing meanings; reuse agent and framework identities exactly and do not encode source facts as ontology facts.")
  .allowEdits("evaluations/adaptive-task-e2e/agents/adaptive-core-agent/tasks/task-cold-chain-transfer-core-only")
  .check("node /home/salboaie/work/nllagentx/nllAgent.mjs test task --agent-dir /home/salboaie/work/nllagentx/evaluations/adaptive-task-e2e/agents/adaptive-core-agent --task-dir /home/salboaie/work/nllagentx/evaluations/adaptive-task-e2e/agents/adaptive-core-agent/tasks/task-cold-chain-transfer-core-only --level fast")
  .seal();
