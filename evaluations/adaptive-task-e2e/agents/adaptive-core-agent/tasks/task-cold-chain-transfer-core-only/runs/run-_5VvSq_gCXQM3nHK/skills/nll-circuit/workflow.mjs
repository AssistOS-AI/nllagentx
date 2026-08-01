import { codingSkill, contextArtifact, cliTool, editRoot } from "../../framework/sdk/agent/skill.mjs";

export default codingSkill("nll-circuit")
  .specs(
    "DS-003",
    "DS-000",
    "DS-007-DS-019",
    "DS005",
    "DS041",
    "DS042",
    "DS043",
    "DS044"
  )
  .context(
    contextArtifact("CIRCUIT_CATALOG.md"),
    contextArtifact("RESPONSE_CIRCUIT_CATALOG.md"),
    contextArtifact("ONTOLOGY_CATALOG.md"),
    contextArtifact("SDK_CATALOG.md"),
    contextArtifact("DIAGNOSTICS.md")
  )
  .tools(
    cliTool("nllAgent catalog circuit"),
    cliTool("nllAgent catalog response"),
    cliTool("nllAgent catalog ontology"),
    cliTool("nllAgent sdk usage"),
    cliTool("nllAgent longtext query"),
    cliTool("nllAgent circuit check"),
    cliTool("nllAgent circuit plan"),
    cliTool("nllAgent circuit run"),
    cliTool("nllAgent circuit abstract"),
    cliTool("nllAgent circuit symbolic"),
    cliTool("nllAgent trace slice"),
    cliTool("nllAgent cnl roundtrip"),
    cliTool("nllAgent test task")
  )
  .dependsOn(
    "nll-runtime",
    "nll-ontology"
  )
  .edits(
    editRoot("framework/packs"),
    editRoot("agent/circuits"),
    editRoot("agent/cnl"),
    editRoot("task/circuits"),
    editRoot("task/cnl")
  )
  .phase("discover", "author", "validate", "handoff")
  .seal();
