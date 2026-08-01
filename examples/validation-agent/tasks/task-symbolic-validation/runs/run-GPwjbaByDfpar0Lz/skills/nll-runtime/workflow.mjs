import { codingSkill, contextArtifact, cliTool, editRoot } from "../../framework/sdk/agent/skill.mjs";

export default codingSkill("nll-runtime")
  .specs("DS-003")
  .context(contextArtifact("SDK_CATALOG.md"), contextArtifact("CIRCUIT_CATALOG.md"), contextArtifact("DIAGNOSTICS.md"))
  .tools(cliTool("nllAgent sdk check"), cliTool("nllAgent ontology check"), cliTool("nllAgent longtext execute"), cliTool("nllAgent circuit plan"), cliTool("nllAgent circuit run"), cliTool("nllAgent circuit abstract"), cliTool("nllAgent circuit symbolic"), cliTool("nllAgent trace slice"), cliTool("nllAgent test framework"))
  .dependsOn("nll-sdk")
  .edits(editRoot("framework/runtime"), editRoot("framework/sdk/analysis"))
  .phase("discover", "author", "validate", "handoff")
  .seal();
