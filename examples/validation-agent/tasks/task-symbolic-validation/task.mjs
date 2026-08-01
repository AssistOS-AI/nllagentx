import { semanticTask, sourceFile, requestedOutput, taskInstruction, taskProfile } from "../../../../framework/sdk/agent/task.mjs";

export default semanticTask("task-symbolic-validation")
  .title("Facility alarm ordering validation")
  .source(sourceFile("source/incident.txt"))
  .instruction(taskInstruction("Check whether the gate opening happened after the facility alarm and retain source evidence."))
  .profile(taskProfile("minimal-core"))
  .output(requestedOutput("findings"), requestedOutput("cnl-observations"))
  .seal();
