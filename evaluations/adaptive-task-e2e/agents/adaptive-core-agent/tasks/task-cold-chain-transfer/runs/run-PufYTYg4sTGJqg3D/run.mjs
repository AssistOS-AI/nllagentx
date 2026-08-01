import { codingRun } from "../../../../../../../../framework/sdk/agent/run.mjs";

export default codingRun("run-PufYTYg4sTGJqg3D")
  .using("codex")
  .cwd("evaluations/adaptive-task-e2e/agents/adaptive-core-agent/tasks/task-cold-chain-transfer")
  .installSkills("nll-sdk", "nll-ontology", "nll-intent")
  .objective("Author task IntentJS from the exact instruction and sources. Preserve instruction provenance and request the concrete plus adaptive auxiliary outputs.")
  .allowEdits("evaluations/adaptive-task-e2e/agents/adaptive-core-agent/tasks/task-cold-chain-transfer")
  .check("node /home/salboaie/work/nllagentx/nllAgent.mjs test task --agent-dir /home/salboaie/work/nllagentx/evaluations/adaptive-task-e2e/agents/adaptive-core-agent --task-dir /home/salboaie/work/nllagentx/evaluations/adaptive-task-e2e/agents/adaptive-core-agent/tasks/task-cold-chain-transfer --level fast")
  .seal();
