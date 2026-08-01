export function abstractWorklist({ nodes, initial = new Map(), transfer, successors, join, equal = Object.is, widen = null, widenAfter = 8, maxSteps = 10000 }) {
  const values = new Map(initial); const counts = new Map(); const precisionLoss = [];
  const queue = [...nodes].sort((left, right) => String(left).localeCompare(String(right)));
  let steps = 0;
  while (queue.length) {
    if (steps++ >= maxSteps) return Object.freeze({ converged: false, values, diagnostic: "ABSTRACT_WIDENED_TO_TOP", precisionLoss });
    const node = queue.shift();
    const next = transfer(node, values);
    const previous = values.get(node);
    let combined = previous === undefined ? next : join(previous, next);
    const count = (counts.get(node) ?? 0) + 1; counts.set(node, count);
    if (previous !== undefined && widen && count > widenAfter) { combined = widen(previous, combined); precisionLoss.push({ node, reason: "widening" }); }
    if (previous !== undefined && equal(previous, combined)) continue;
    values.set(node, combined);
    for (const successor of successors(node)) if (!queue.includes(successor)) queue.push(successor);
    queue.sort((left, right) => String(left).localeCompare(String(right)));
  }
  return Object.freeze({ converged: true, values, precisionLoss: Object.freeze(precisionLoss), steps });
}

export function abstractCircuit(circuit, inputs = new Map()) {
  const nodes = circuit.stages.map((stage) => stage.identity());
  const byId = new Map(circuit.stages.map((stage) => [stage.identity(), stage]));
  return abstractWorklist({
    nodes,
    initial: inputs,
    transfer: (id, values) => byId.get(id).descriptor?.().abstractSummary?.(values) ?? new Set(["SATISFIED", "VIOLATED", "UNKNOWN", "CONFLICT"]),
    successors: (id) => nodes.filter((candidate) => candidate !== id),
    join: (left, right) => new Set([...left, ...right]),
    equal: (left, right) => left.size === right.size && [...left].every((value) => right.has(value)),
    widen: () => new Set(["SATISFIED", "VIOLATED", "UNKNOWN", "CONFLICT"])
  });
}
