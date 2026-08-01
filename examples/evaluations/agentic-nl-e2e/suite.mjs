import {
  evaluationSuite, taskCase, intentSelection, materialization,
  endToEndAnalysis, generation, ordinaryReplay,
  defaultSemanticMetrics, runtimeMetrics
} from "../../../framework/sdk/evaluation/index.mjs";

export default evaluationSuite("agentic-nl-e2e")
  .agentTemplate("nl-rule-review-agent")
  .agentBrief("agent-brief.md")
  .authorAgent("architect", "ontology", "circuit", "review")
  .authorTasks("intent", "longtext")
  .profiles("minimal-core")
  .tasks(
    taskCase("contradictory-rules", {
      source: "corpora/contradictory-rules.txt",
      title: "Detect incompatible access rules",
      instruction: "Analyze the policy for mutually incompatible rules. Produce evidence-grounded findings and preserve the absence of any stated priority or exception.",
      expectedFindings: [
        "CoreGroundingFinding.grounded:SATISFIED",
        "RULE_CONTRADICTION:CONFLICT"
      ]
    }),
    taskCase("missing-exception-justification", {
      source: "corpora/missing-exception-justification.txt",
      title: "Check emergency exception evidence",
      instruction: "Determine whether every invoked emergency exception has the justification required by the policy. Report missing evidence without inventing a reason.",
      expectedFindings: [
        "CoreGroundingFinding.grounded:SATISFIED",
        "MISSING_EXCEPTION_JUSTIFICATION:VIOLATED"
      ]
    }),
    taskCase("unsupported-safety-conclusion", {
      source: "corpora/unsupported-safety-conclusion.txt",
      title: "Audit support for a safety conclusion",
      instruction: "Check whether the memo's safety conclusion is supported by evidence contained in the source. Distinguish the author's claim from verified evidence.",
      expectedFindings: [
        "CoreGroundingFinding.grounded:SATISFIED",
        "UNSUPPORTED_SAFETY_CONCLUSION:VIOLATED"
      ]
    }),
    taskCase("generate-compliant-procedure", {
      source: "corpora/generate-compliant-procedure.txt",
      title: "Generate an evidence-preserving procedure",
      instruction: "Generate a controlled procedure plan that orders acknowledgement, authorization, gate action, exception justification, and audit recording without adding unstated permissions.",
      expectedFindings: [
        "CoreGroundingFinding.grounded:SATISFIED",
        "PROCEDURE_PLAN_READY:SATISFIED"
      ],
      minimumFrames: 1
    })
  )
  .modes(intentSelection(), materialization(), endToEndAnalysis(), generation(), ordinaryReplay())
  .codingAgent("codex")
  .metrics(defaultSemanticMetrics(), runtimeMetrics())
  .retainAllArtifacts()
  .seal();
