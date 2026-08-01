import { codingRun } from "../../../../framework/sdk/agent/index.mjs";

export const ontologyPhase = codingRun("nl-rule-review-agent.ontology")
  .using("codex")
  .cwd(".")
  .installSkills("nll-ontology")
  .objective(
    "Author ontologies/operational-policy.ontology.mjs from architecture-plan.mjs. " +
    "Reuse resolved core-language identities, expose the allocated agent capabilities, " +
    "and add no source facts or finding-emitting laws."
  )
  .allowEdits("ontologies/operational-policy.ontology.mjs", "tests/ontology.test.mjs")
  .check(
    "node ../../../../nllAgent.mjs ontology check --agent-dir .",
    "node --test tests/ontology.test.mjs"
  )
  .seal();

export const circuitPhase = codingRun("nl-rule-review-agent.circuit")
  .using("codex")
  .cwd(".")
  .installSkills("nll-circuit")
  .objective(
    "Implement the four circuit contracts in architecture-plan.mjs over SemanticStore terms and claims. " +
    "Require evidence and closed coverage for negative absence conclusions, preserve interpretation contexts, " +
    "and emit a provenance-retaining typed CNL procedure plan."
  )
  .allowEdits(
    "circuits/rule-contradiction.circuit.mjs",
    "circuits/exception-justification.circuit.mjs",
    "circuits/safety-evidence.circuit.mjs",
    "circuits/procedure-plan.circuit.mjs",
    "tests/circuits.test.mjs",
    "tests/cnl.test.mjs"
  )
  .check(
    "node ../../../../nllAgent.mjs catalog circuit --agent-dir .",
    "node --test tests/circuits.test.mjs tests/cnl.test.mjs"
  )
  .seal();

export const testPhase = codingRun("nl-rule-review-agent.test")
  .using("codex")
  .cwd(".")
  .installSkills("nll-test")
  .objective(
    "Complete deterministic store-and-runner tests for conflict, satisfied, violated, UNKNOWN, " +
    "NOT_APPLICABLE, evidence identity, interpretation context, coverage, and CNL round-trip boundaries."
  )
  .allowEdits(
    "tests/ontology.test.mjs",
    "tests/circuits.test.mjs",
    "tests/cnl.test.mjs"
  )
  .check("node ../../../../nllAgent.mjs test agent --agent-dir . --level fast")
  .seal();

export const taskAuthoringHandoff = codingRun("nl-rule-review-agent.task-authoring")
  .using("codex")
  .cwd("tasks/<task-id>")
  .installSkills("nll-intent", "nll-longtext")
  .objective(
    "For each task, preserve task.mjs instructions, select the narrow agent capability, and materialize " +
    "only source-grounded rules, records, evidence links, alternatives, anchors, and coverage."
  )
  .allowEdits(
    "tasks/<task-id>/intent/intent.mjs",
    "tasks/<task-id>/longtext/root.longtext.mjs",
    "tasks/<task-id>/longtext/units/*.longtext.mjs",
    "tasks/<task-id>/tests/*.test.mjs"
  )
  .check(
    "node ../../../../../../nllAgent.mjs intent check --agent-dir ../.. --task-dir .",
    "node ../../../../../../nllAgent.mjs longtext check --agent-dir ../.. --task-dir .",
    "node ../../../../../../nllAgent.mjs test task --agent-dir ../.. --task-dir . --level fast"
  )
  .seal();

export default Object.freeze([
  ontologyPhase,
  circuitPhase,
  testPhase,
  taskAuthoringHandoff
]);
