import { codingRun } from "../../../../../../framework/sdk/agent/run.mjs";

export default codingRun("run-EZluncqzSttBkMKO")
  .using("codex")
  .cwd("evaluations/agentic-nl-e2e/agents/nl-rule-review-agent")
  .installSkills("nll-test", "nll-sdk", "nll-ontology", "nll-intent", "nll-longtext", "nll-runtime", "nll-circuit")
  .objective("Review and repair the supplied deterministic failures without weakening tests.")
  .allowEdits("evaluations/agentic-nl-e2e/agents/nl-rule-review-agent")
  .check("node /home/salboaie/work/nllagentx/nllAgent.mjs test agent --agent-dir /home/salboaie/work/nllagentx/evaluations/agentic-nl-e2e/agents/nl-rule-review-agent --level fast")
  .seal();
