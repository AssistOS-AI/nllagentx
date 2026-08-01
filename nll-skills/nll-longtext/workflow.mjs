import { codingSkill, contextArtifact, cliTool, editRoot } from "../../framework/sdk/agent/skill.mjs";

export default codingSkill("nll-longtext")
  .specs(
    "DS-002",
    "DS-004",
    "DS-007-DS-019",
    "DS037",
    "DS041",
    "DS042",
    "DS043"
  )
  .context(
    contextArtifact("SOURCE_OUTLINE.md"),
    contextArtifact("ONTOLOGY_CATALOG.md"),
    contextArtifact("PROFILE_RESOLUTION.md")
  )
  .tools(
    cliTool("nllAgent source outline"),
    cliTool("nllAgent source show"),
    cliTool("nllAgent source search"),
    cliTool("nllAgent source span"),
    cliTool("nllAgent source verify-anchors"),
    cliTool("nllAgent catalog ontology"),
    cliTool("nllAgent ontology show"),
    cliTool("nllAgent longtext check"),
    cliTool("nllAgent longtext execute"),
    cliTool("nllAgent longtext query"),
    cliTool("nllAgent longtext coverage")
  )
  .dependsOn(
    "nll-intent",
    "nll-ontology"
  )
  .edits(
    editRoot("task/longtext"),
    editRoot("task/tests")
  )
  .phase("discover", "author", "validate", "handoff")
  .seal();
