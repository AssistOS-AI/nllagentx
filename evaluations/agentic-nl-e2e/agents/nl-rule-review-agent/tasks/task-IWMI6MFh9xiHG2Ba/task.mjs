import { semanticTask, sourceFile, requestedOutput, taskInstruction, taskProfile } from "../../../../../../framework/sdk/agent/task.mjs";

export default semanticTask("task-IWMI6MFh9xiHG2Ba")
  .title("Detect incompatible access rules")
  .source(sourceFile("source/source-001.txt"))
  .instruction(taskInstruction("Analyze the policy for mutually incompatible rules. Produce evidence-grounded findings and preserve the absence of any stated priority or exception."))
  .profile(taskProfile("minimal-core"))
  .output(requestedOutput("findings"), requestedOutput("cnl-observations"))
  .seal();
