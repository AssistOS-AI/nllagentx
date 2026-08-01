import { semanticTask, sourceFile, requestedOutput, taskInstruction, taskProfile } from "../../../../../../framework/sdk/agent/task.mjs";

export default semanticTask("task-Fk4Lrn1gwd5vJhjI")
  .title("Audit support for a safety conclusion")
  .source(sourceFile("source/source-001.txt"))
  .instruction(taskInstruction("Check whether the memo's safety conclusion is supported by evidence contained in the source. Distinguish the author's claim from verified evidence."))
  .profile(taskProfile("minimal-core"))
  .output(requestedOutput("findings"), requestedOutput("cnl-observations"), requestedOutput("markdown-cnl"))
  .seal();
