import { codingRun } from "../../../../../../../../framework/sdk/agent/run.mjs";

export default codingRun("run-gTqQpKTtEIkFGY_W")
  .using("codex")
  .cwd("evaluations/adaptive-task-e2e/agents/adaptive-core-agent/tasks/task-cold-chain-transfer-core-only")
  .installSkills("nll-test", "nll-sdk", "nll-ontology", "nll-intent", "nll-longtext", "nll-runtime", "nll-circuit")
  .objective("Review the complete adaptive execution evidence. Repair task-owned IntentJS, OntologyJS, LongTextJS, CircuitJS, and tests without weakening acceptance. Inspect concrete findings, abstract convergence, symbolic paths, provenance, the primary Markdown CNL response, response-circuit selection, generated CNL, and every supplied failure. If the task is already valid, audit it and avoid semantic churn.")
  .allowEdits("evaluations/adaptive-task-e2e/agents/adaptive-core-agent/tasks/task-cold-chain-transfer-core-only")
  .check("node /home/salboaie/work/nllagentx/nllAgent.mjs test task --agent-dir /home/salboaie/work/nllagentx/evaluations/adaptive-task-e2e/agents/adaptive-core-agent --task-dir /home/salboaie/work/nllagentx/evaluations/adaptive-task-e2e/agents/adaptive-core-agent/tasks/task-cold-chain-transfer-core-only --level fast")
  .seal();
