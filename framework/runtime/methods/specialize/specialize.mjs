export function specializeCircuit(circuit, bindings = new Map()) {
  const stages = circuit.stages.filter((stage) => {
    const condition = stage.descriptor?.().staticCondition;
    return condition ? condition(bindings) : true;
  });
  return Object.freeze({
    ...circuit,
    identity: `${circuit.identity}:specialized:${[...bindings].map(([key, value]) => `${key}=${value}`).sort().join(",")}`,
    stages: Object.freeze(stages),
    specialization: Object.freeze({ bindings: new Map(bindings), original: circuit.identity })
  });
}

export async function compareSpecialization(original, specialized, cases, runner) {
  const differences = [];
  for (const testCase of cases) {
    const left = await runner(original, testCase); const right = await runner(specialized, testCase);
    if (String(left) !== String(right)) differences.push({ testCase, left, right });
  }
  return Object.freeze({ equivalent: differences.length === 0, differences: Object.freeze(differences) });
}
