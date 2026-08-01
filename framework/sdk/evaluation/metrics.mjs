function ratio(numerator, denominator) { return denominator === 0 ? 1 : numerator / denominator; }

export function classificationMetrics(actual, expected, identity = (value) => value) {
  const actualSet = new Set(actual.map(identity)); const expectedSet = new Set(expected.map(identity));
  const truePositive = [...actualSet].filter((value) => expectedSet.has(value)).length;
  const falsePositive = [...actualSet].filter((value) => !expectedSet.has(value)).length;
  const falseNegative = [...expectedSet].filter((value) => !actualSet.has(value)).length;
  const precision = ratio(truePositive, truePositive + falsePositive);
  const recall = ratio(truePositive, truePositive + falseNegative);
  return Object.freeze({ truePositive, falsePositive, falseNegative, precision, recall, f1: precision + recall === 0 ? 0 : 2 * precision * recall / (precision + recall) });
}

export function aggregateMetrics(results) {
  const numeric = new Map();
  for (const result of results) for (const [name, value] of Object.entries(result.metrics ?? {})) if (Number.isFinite(value)) {
    if (!numeric.has(name)) numeric.set(name, []); numeric.get(name).push(value);
  }
  return Object.freeze(Object.fromEntries([...numeric].map(([name, values]) => [name, values.reduce((sum, value) => sum + value, 0) / values.length])));
}
