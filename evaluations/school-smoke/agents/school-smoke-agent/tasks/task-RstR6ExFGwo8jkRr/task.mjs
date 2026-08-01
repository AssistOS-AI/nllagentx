import { semanticTask, sourceFile, requestedOutput, taskInstruction, taskProfile } from "../../../../../../framework/sdk/agent/task.mjs";

export default semanticTask("task-RstR6ExFGwo8jkRr")
  .title("facility-order")
  .source(sourceFile("source/source-001.txt"))
  .instruction(taskInstruction("Materialize grounded claims and run every compatible basic check."))
  .profile(taskProfile("general-school"))
  .output(requestedOutput("findings"), requestedOutput("cnl-observations"))
  .seal();
