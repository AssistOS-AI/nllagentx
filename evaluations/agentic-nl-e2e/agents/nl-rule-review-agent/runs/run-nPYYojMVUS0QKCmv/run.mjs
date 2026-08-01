import { codingRun } from "../../../../../../framework/sdk/agent/run.mjs";

export default codingRun("run-nPYYojMVUS0QKCmv")
  .using("codex")
  .cwd("evaluations/agentic-nl-e2e/agents/nl-rule-review-agent")
  .installSkills("nll-test", "nll-sdk", "nll-ontology", "nll-intent", "nll-longtext", "nll-runtime", "nll-circuit")
  .objective("Review the failed circuit authoring iteration end to end. Verify every new local import and export, including requirementDetails from circuits/review-support.mjs; run the agent tests; inspect whether each material semantic finding has a concise qualitative message, structured requirement details, and exact source-grounded evidence suitable for the primary Markdown CNL response; repair any defect without removing valid response improvements. The earlier parent validation observed a stale-module named-export error after a same-process coding phase, so distinguish source defects from loader-cache defects.")
  .allowEdits("evaluations/agentic-nl-e2e/agents/nl-rule-review-agent")
  .check("node /home/salboaie/work/nllagentx/nllAgent.mjs test agent --agent-dir /home/salboaie/work/nllagentx/evaluations/agentic-nl-e2e/agents/nl-rule-review-agent --level fast")
  .seal();
