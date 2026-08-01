function keyOf(value) { return (typeof value?.identity === "function" ? value.identity() : value?.identity) ?? String(value); }

export class DependencyGraph {
  constructor() { this.forward = new Map(); this.reverse = new Map(); this.values = new Map(); }
  addDependency(input, output) {
    const inputKey = keyOf(input); const outputKey = keyOf(output);
    this.values.set(inputKey, input); this.values.set(outputKey, output);
    if (!this.forward.has(inputKey)) this.forward.set(inputKey, new Set());
    if (!this.reverse.has(outputKey)) this.reverse.set(outputKey, new Set());
    this.forward.get(inputKey).add(outputKey); this.reverse.get(outputKey).add(inputKey); return this;
  }
  #walk(starts, edges) { const visited = new Set(starts.map(keyOf)); const queue = [...visited]; while (queue.length) { const current = queue.shift(); for (const next of edges.get(current) ?? []) if (!visited.has(next)) { visited.add(next); queue.push(next); } } return visited; }
  backward(...values) { return this.#values(this.#walk(values.flat(), this.reverse)); }
  forwardSlice(...values) { return this.#values(this.#walk(values.flat(), this.forward)); }
  chop(sources, targets) { const forward = new Set(this.forwardSlice(sources).map(keyOf)); const backward = new Set(this.backward(targets).map(keyOf)); return this.#values(new Set([...forward].filter((key) => backward.has(key)))); }
  differential(leftTargets, rightTargets) { const left = new Set(this.backward(leftTargets).map(keyOf)); const right = new Set(this.backward(rightTargets).map(keyOf)); return this.#values(new Set([...left, ...right].filter((key) => left.has(key) !== right.has(key)))); }
  #values(keys) { return Object.freeze([...keys].sort().map((key) => this.values.get(key) ?? key)); }
}
