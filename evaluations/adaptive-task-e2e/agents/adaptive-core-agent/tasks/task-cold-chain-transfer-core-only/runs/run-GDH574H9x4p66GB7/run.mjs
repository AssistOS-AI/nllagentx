import { codingRun } from "../../../../../../../../framework/sdk/agent/run.mjs";

export default codingRun("run-GDH574H9x4p66GB7")
  .using("codex")
  .cwd("evaluations/adaptive-task-e2e/agents/adaptive-core-agent/tasks/task-cold-chain-transfer-core-only")
  .installSkills("nll-sdk", "nll-ontology", "nll-intent")
  .objective("Author task IntentJS from the exact instruction and sources. Preserve instruction provenance and request the concrete plus adaptive auxiliary outputs.")
  .allowEdits("evaluations/adaptive-task-e2e/agents/adaptive-core-agent/tasks/task-cold-chain-transfer-core-only")
  .check("node /home/salboaie/work/nllagentx/nllAgent.mjs test task --agent-dir /home/salboaie/work/nllagentx/evaluations/adaptive-task-e2e/agents/adaptive-core-agent --task-dir /home/salboaie/work/nllagentx/evaluations/adaptive-task-e2e/agents/adaptive-core-agent/tasks/task-cold-chain-transfer-core-only --level fast")
  .seal();
