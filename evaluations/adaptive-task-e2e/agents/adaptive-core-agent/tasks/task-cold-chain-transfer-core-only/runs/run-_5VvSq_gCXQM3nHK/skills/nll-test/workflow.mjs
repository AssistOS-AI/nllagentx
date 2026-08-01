import { codingSkill, contextArtifact, cliTool, editRoot } from "../../framework/sdk/agent/skill.mjs";

export default codingSkill("nll-test")
  .specs(
    "DS-005",
    "DS042",
    "DS043",
    "DS044"
  )
  .context(
    contextArtifact("PROJECT_MAP.md"),
    contextArtifact("DIAGNOSTICS.md"),
    contextArtifact("SDK_CATALOG.md"),
    contextArtifact("RESPONSE_CIRCUIT_CATALOG.md")
  )
  .tools(
    cliTool("nllAgent test framework"),
    cliTool("nllAgent test packs"),
    cliTool("nllAgent test agent"),
    cliTool("nllAgent test task"),
    cliTool("nllAgent review bundle")
  )
  .dependsOn(
    
  )
  .edits(
    editRoot("tests"),
    editRoot("test-support")
  )
  .phase("discover", "author", "validate", "handoff")
  .seal();
