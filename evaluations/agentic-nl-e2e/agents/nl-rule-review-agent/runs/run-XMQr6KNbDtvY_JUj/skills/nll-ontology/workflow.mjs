import { codingSkill, contextArtifact, cliTool, editRoot } from "../../framework/sdk/agent/skill.mjs";

export default codingSkill("nll-ontology")
  .specs(
    "DS-002",
    "DS-007-DS-019",
    "DS038"
  )
  .context(
    contextArtifact("ONTOLOGY_CATALOG.md"),
    contextArtifact("SDK_CATALOG.md"),
    contextArtifact("SOURCE_OUTLINE.md")
  )
  .tools(
    cliTool("nllAgent catalog ontology"),
    cliTool("nllAgent ontology show"),
    cliTool("nllAgent ontology check"),
    cliTool("nllAgent ontology build"),
    cliTool("nllAgent ontology affected"),
    cliTool("nllAgent sdk usage"),
    cliTool("nllAgent source search"),
    cliTool("nllAgent test packs")
  )
  .dependsOn(
    "nll-sdk"
  )
  .edits(
    editRoot("framework/packs"),
    editRoot("agent/ontologies"),
    editRoot("task/ontologies")
  )
  .phase("discover", "author", "validate", "handoff")
  .seal();
