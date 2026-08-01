import { codingSkill, contextArtifact, cliTool, editRoot } from "../../framework/sdk/agent/skill.mjs";

export default codingSkill("nll-sdk")
  .specs(
    "DS-002",
    "DS039",
    "DS043",
    "DS044"
  )
  .context(
    contextArtifact("SDK_CATALOG.md"),
    contextArtifact("ONTOLOGY_CATALOG.md"),
    contextArtifact("RESPONSE_CIRCUIT_CATALOG.md")
  )
  .tools(
    cliTool("nllAgent catalog sdk"),
    cliTool("nllAgent sdk check"),
    cliTool("nllAgent sdk usage"),
    cliTool("nllAgent ontology build"),
    cliTool("nllAgent ontology check"),
    cliTool("nllAgent test framework --level fast")
  )
  .dependsOn(
    
  )
  .edits(
    editRoot("framework/sdk")
  )
  .phase("discover", "author", "validate", "handoff")
  .seal();
