export default Object.freeze({
  capturedBeforeAuthoring: true,
  agentProvides: Object.freeze(["core-language", "adaptive-core-only"]),
  taskProvides: Object.freeze(["task.mjs", "source/cold-chain-transfer.txt"]),
  absentTaskPaths: Object.freeze([
    "intent",
    "longtext",
    "ontologies",
    "circuits",
    "tests",
    "runs",
    "results"
  ]),
  requiredOutcome: Object.freeze({
    concern: "cold-chain transfer release support",
    concrete: true,
    abstract: true,
    symbolic: true,
    codexReview: true,
    modelFreeReplay: true
  })
});
