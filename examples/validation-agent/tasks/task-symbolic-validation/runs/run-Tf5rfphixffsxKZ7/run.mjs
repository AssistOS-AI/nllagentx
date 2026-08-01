import { codingRun } from "../../../../../../framework/sdk/agent/run.mjs";

export default codingRun("run-Tf5rfphixffsxKZ7")
  .using("codex")
  .cwd("examples/validation-agent/tasks/task-symbolic-validation")
  .installSkills("nll-sdk")
  .objective("sdk phase")
  .allowEdits("examples/validation-agent/tasks/task-symbolic-validation")
  .check("node /home/salboaie/work/nllagentx/nllAgent.mjs test task --agent-dir /home/salboaie/work/nllagentx/examples/validation-agent --task-dir /home/salboaie/work/nllagentx/examples/validation-agent/tasks/task-symbolic-validation --level fast")
  .seal();
