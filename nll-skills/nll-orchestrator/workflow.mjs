import { codingSkill, contextArtifact, cliTool, editRoot } from "../../framework/sdk/agent/skill.mjs";

export default codingSkill("nll-orchestrator")
  .specs(
    "DS-001",
    "DS035",
    "DS036",
    "DS037",
    "DS041",
    "DS042",
    "DS043",
    "DS044"
  )
  .context(
    contextArtifact("PROJECT_MAP.md"),
    contextArtifact("RESPONSE_CIRCUIT_CATALOG.md"),
    contextArtifact("DIAGNOSTICS.md")
  )
  .tools(
    cliTool("nllAgent files index"),
    cliTool("nllAgent context build"),
    cliTool("nllAgent context show"),
    cliTool("nllAgent source ingest"),
    cliTool("nllAgent source outline"),
    cliTool("nllAgent review bundle")
  )
  .dependsOn()
  .edits(
    editRoot("framework/cli"),
    editRoot("framework/tools"),
    editRoot("runs")
  )
  .phase("discover", "author", "validate", "handoff")
  .seal();
