import { codingRun } from "../../../../../../framework/sdk/agent/run.mjs";

export default codingRun("run-dJm20Pp65culRlpA")
  .using("codex")
  .cwd("examples/validation-agent/tasks/task-symbolic-validation")
  .installSkills("nll-test", "nll-sdk", "nll-runtime", "nll-ontology", "nll-circuit")
  .objective("Review and repair the supplied deterministic failures without weakening tests.")
  .allowEdits("examples/validation-agent/tasks/task-symbolic-validation")
  .check("node /home/salboaie/work/nllagentx/nllAgent.mjs test task --agent-dir /home/salboaie/work/nllagentx/examples/validation-agent --task-dir /home/salboaie/work/nllagentx/examples/validation-agent/tasks/task-symbolic-validation --level fast")
  .seal();
