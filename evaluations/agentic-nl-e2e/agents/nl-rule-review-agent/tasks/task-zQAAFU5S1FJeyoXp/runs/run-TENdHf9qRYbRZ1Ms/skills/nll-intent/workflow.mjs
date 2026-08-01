import { codingSkill, contextArtifact, cliTool, editRoot } from "../../framework/sdk/agent/skill.mjs";

export default codingSkill("nll-intent")
  .specs(
    "DS-004",
    "DS035",
    "DS041"
  )
  .context(
    contextArtifact("SOURCE_OUTLINE.md"),
    contextArtifact("ONTOLOGY_CATALOG.md"),
    contextArtifact("CIRCUIT_CATALOG.md"),
    contextArtifact("PROFILE_RESOLUTION.md")
  )
  .tools(
    cliTool("nllAgent source outline"),
    cliTool("nllAgent source search"),
    cliTool("nllAgent catalog ontology"),
    cliTool("nllAgent catalog circuit"),
    cliTool("nllAgent profile resolve"),
    cliTool("nllAgent intent infer-signals"),
    cliTool("nllAgent intent check"),
    cliTool("nllAgent intent explain"),
    cliTool("nllAgent plan show")
  )
  .dependsOn(
    "nll-ontology"
  )
  .edits(
    editRoot("task/intent"),
    editRoot("task/profiles")
  )
  .phase("discover", "author", "validate", "handoff")
  .seal();
