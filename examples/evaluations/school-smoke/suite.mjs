import {
  evaluationSuite, fromCorpus, intentSelection, materialization,
  endToEndAnalysis, ordinaryReplay, packAblation, defaultSemanticMetrics, runtimeMetrics
} from "../../../framework/sdk/evaluation/index.mjs";

export default evaluationSuite("school-smoke")
  .agentTemplate("school-smoke-agent")
  .profiles("minimal-core", "general-school")
  .tasks(fromCorpus("corpora", { instruction: "Materialize grounded claims and run every compatible basic check." }))
  .modes(intentSelection(), materialization(), endToEndAnalysis(), ordinaryReplay(), packAblation())
  .codingAgent("codex")
  .metrics(defaultSemanticMetrics(), runtimeMetrics())
  .retainAllArtifacts()
  .seal();
