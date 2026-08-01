import {
  semanticTask,
  sourceFile,
  requestedOutput,
  taskInstruction,
  taskProfile
} from "../../../../../../framework/sdk/agent/task.mjs";

export default semanticTask("task-cold-chain-transfer")
  .title("Cold-chain custody transfer release audit")
  .source(sourceFile("source/cold-chain-transfer.txt"))
  .instruction(taskInstruction(
    "Determine whether the stated release conclusion is supported under every custody-transfer precondition in " +
    "the source. Distinguish recorded evidence from valid evidence, report every absent or invalid required " +
    "support with exact source provenance, preserve uncertainty instead of assuming omitted facts, and produce " +
    "executable semantic results that can be replayed without another model call."
  ))
  .profile(taskProfile("minimal-core"))
  .output(requestedOutput("findings"), requestedOutput("cnl-observations"))
  .seal();
