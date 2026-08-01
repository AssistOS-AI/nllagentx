import { codingSkill, contextArtifact, cliTool, editRoot } from "../../framework/sdk/agent/skill.mjs";

export default codingSkill("nll-architect")
  .specs(
    "DS-000",
    "DS-004",
    "DS035",
    "DS041"
  )
  .context(
    contextArtifact("PROJECT_MAP.md"),
    contextArtifact("SDK_CATALOG.md"),
    contextArtifact("ONTOLOGY_CATALOG.md"),
    contextArtifact("CIRCUIT_CATALOG.md"),
    contextArtifact("PROFILE_RESOLUTION.md"),
    contextArtifact("SOURCE_OUTLINE.md")
  )
  .tools(
    cliTool("nllAgent files index"),
    cliTool("nllAgent catalog sdk"),
    cliTool("nllAgent catalog ontology"),
    cliTool("nllAgent catalog circuit"),
    cliTool("nllAgent profile resolve"),
    cliTool("nllAgent source outline"),
    cliTool("nllAgent context show")
  )
  .dependsOn(
    
  )
  .edits(
    editRoot("agent"),
    editRoot("task"),
    editRoot("architecture-plan"),
    editRoot("work-plan")
  )
  .phase("discover", "author", "validate", "handoff")
  .seal();
