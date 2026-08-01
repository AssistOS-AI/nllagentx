import { semanticTask, sourceFile, requestedOutput, taskInstruction, taskProfile } from "../../../../../../framework/sdk/agent/task.mjs";

export default semanticTask("task-OdEYKCfza1g-k2ly")
  .title("Generate an evidence-preserving procedure")
  .source(sourceFile("source/source-001.txt"))
  .instruction(taskInstruction("Generate a controlled procedure plan that orders acknowledgement, authorization, gate action, exception justification, and audit recording without adding unstated permissions."))
  .profile(taskProfile("minimal-core"))
  .output(requestedOutput("findings"), requestedOutput("cnl-observations"))
  .seal();
