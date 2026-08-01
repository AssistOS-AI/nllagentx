import { codingRun } from "../../../../../../../../framework/sdk/agent/run.mjs";

export default codingRun("run-Fjy2bszt2jMKFLT2")
  .using("codex")
  .cwd("evaluations/adaptive-task-e2e/agents/adaptive-core-agent/tasks/task-cold-chain-transfer-core-only")
  .installSkills("nll-sdk", "nll-ontology", "nll-intent", "nll-longtext")
  .objective("Author complete source-grounded LongTextJS against the now-resolved ontology. Retain exact anchors, attribution, alternatives, coverage, and explicit unsupported meanings.")
  .allowEdits("evaluations/adaptive-task-e2e/agents/adaptive-core-agent/tasks/task-cold-chain-transfer-core-only")
  .check("node /home/salboaie/work/nllagentx/nllAgent.mjs test task --agent-dir /home/salboaie/work/nllagentx/evaluations/adaptive-task-e2e/agents/adaptive-core-agent --task-dir /home/salboaie/work/nllagentx/evaluations/adaptive-task-e2e/agents/adaptive-core-agent/tasks/task-cold-chain-transfer-core-only --level fast")
  .seal();
