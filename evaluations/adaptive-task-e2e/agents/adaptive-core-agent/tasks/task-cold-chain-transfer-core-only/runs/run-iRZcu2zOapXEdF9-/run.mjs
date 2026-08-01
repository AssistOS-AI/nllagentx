import { codingRun } from "../../../../../../../../framework/sdk/agent/run.mjs";

export default codingRun("run-iRZcu2zOapXEdF9-")
  .using("codex")
  .cwd("evaluations/adaptive-task-e2e/agents/adaptive-core-agent/tasks/task-cold-chain-transfer-core-only")
  .installSkills("nll-sdk", "nll-runtime", "nll-ontology", "nll-circuit")
  .objective("Audit whether the combined framework, agent, and task circuit registry can perform the requested operation realistically. Create task-local CircuitJS and focused tests only for missing behavior. Integrate through declared capabilities, concrete execution, abstract preflight, symbolic decision coverage, evidence-bearing findings, qualitative messages/details, and typed CNL generation where requested. When default response composition is insufficient, add a task-local executable response circuit under cnl/.")
  .allowEdits("evaluations/adaptive-task-e2e/agents/adaptive-core-agent/tasks/task-cold-chain-transfer-core-only")
  .check("node /home/salboaie/work/nllagentx/nllAgent.mjs test task --agent-dir /home/salboaie/work/nllagentx/evaluations/adaptive-task-e2e/agents/adaptive-core-agent --task-dir /home/salboaie/work/nllagentx/evaluations/adaptive-task-e2e/agents/adaptive-core-agent/tasks/task-cold-chain-transfer-core-only --level fast")
  .seal();
