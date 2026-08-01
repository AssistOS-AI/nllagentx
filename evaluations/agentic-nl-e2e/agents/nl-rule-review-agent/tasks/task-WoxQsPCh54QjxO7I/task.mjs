import { semanticTask, sourceFile, requestedOutput, taskInstruction, taskProfile } from "../../../../../../framework/sdk/agent/task.mjs";

export default semanticTask("task-WoxQsPCh54QjxO7I")
  .title("Check emergency exception evidence")
  .source(sourceFile("source/source-001.txt"))
  .instruction(taskInstruction("Determine whether every invoked emergency exception has the justification required by the policy. Report missing evidence without inventing a reason."))
  .profile(taskProfile("minimal-core"))
  .output(requestedOutput("findings"), requestedOutput("cnl-observations"))
  .seal();
