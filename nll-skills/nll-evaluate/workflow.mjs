import { codingSkill, contextArtifact, cliTool, editRoot } from "../../framework/sdk/agent/skill.mjs";

export default codingSkill("nll-evaluate")
  .specs(
    "DS-006",
    "DS036",
    "DS041",
    "DS042",
    "DS043",
    "DS044"
  )
  .context(
    contextArtifact("PROJECT_MAP.md"),
    contextArtifact("PROFILE_RESOLUTION.md"),
    contextArtifact("RESPONSE_CIRCUIT_CATALOG.md"),
    contextArtifact("DIAGNOSTICS.md")
  )
  .tools(
    cliTool("nllAgent agent create"),
    cliTool("nllAgent task create"),
    cliTool("nllAgent context build"),
    cliTool("nllAgent code architect"),
    cliTool("nllAgent code intent"),
    cliTool("nllAgent code ontology"),
    cliTool("nllAgent code longtext"),
    cliTool("nllAgent code circuit"),
    cliTool("nllAgent evaluate"),
    cliTool("nllAgent trace compare")
  )
  .dependsOn(
    "nll-intent",
    "nll-longtext",
    "nll-circuit",
    "nll-test"
  )
  .edits(
    editRoot("evaluations")
  )
  .phase("discover", "author", "validate", "handoff")
  .seal();
