import { semanticTask, sourceFile, requestedOutput, taskInstruction } from "../../framework/sdk/agent/task.mjs";

export default semanticTask("random-task-id-example")
  .source(sourceFile("source/source-001.txt"))
  .instruction(taskInstruction("Check all compatible event-order and contradiction rules and produce CNL observations."))
  .output(requestedOutput("findings"), requestedOutput("cnl-observations"))
  .seal();
