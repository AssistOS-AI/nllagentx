function stateKey(value) { return (typeof value?.identity === "function" ? value.identity() : value?.identity) ?? String(value); }

export function breadthFirstReachability({ initial, successors, isGoal, maxStates = 10000 }) {
  const queue = [initial]; const parents = new Map([[stateKey(initial), null]]); const states = new Map([[stateKey(initial), initial]]);
  while (queue.length) {
    const state = queue.shift(); const key = stateKey(state);
    if (isGoal(state)) {
      const witness = []; let cursor = key;
      while (cursor !== null) { witness.push(states.get(cursor)); cursor = parents.get(cursor); }
      return Object.freeze({ reached: true, witness: Object.freeze(witness.reverse()), visited: states.size });
    }
    if (states.size >= maxStates) return Object.freeze({ reached: false, blocked: true, diagnostic: "BLOCKED_RESOURCE", visited: states.size });
    const nextStates = [...successors(state)].sort((left, right) => stateKey(left).localeCompare(stateKey(right)));
    for (const next of nextStates) { const nextKey = stateKey(next); if (states.has(nextKey)) continue; states.set(nextKey, next); parents.set(nextKey, key); queue.push(next); }
  }
  return Object.freeze({ reached: false, blocked: false, visited: states.size });
}

export function detectCycle(initial, successors) {
  const visiting = new Set(); const visited = new Set(); const stack = [];
  function visit(state) {
    const key = stateKey(state);
    if (visiting.has(key)) return stack.slice(stack.findIndex((entry) => stateKey(entry) === key)).concat(state);
    if (visited.has(key)) return null;
    visiting.add(key); stack.push(state);
    for (const next of successors(state)) { const cycle = visit(next); if (cycle) return cycle; }
    stack.pop(); visiting.delete(key); visited.add(key); return null;
  }
  const cycle = visit(initial);
  return Object.freeze({ cyclic: Boolean(cycle), witness: Object.freeze(cycle ?? []) });
}
