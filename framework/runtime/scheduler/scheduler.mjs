import { digestIdentity } from "../../sdk/core/identity.mjs";

function keyOf(node) { return (typeof node?.identity === "function" ? node.identity() : node?.identity) ?? node?.id ?? String(node); }

function discoverDependencies(value, nodeSet, output, seen = new Set()) {
  if (value === null || value === undefined || seen.has(value)) return;
  if (typeof value === "function") return;
  if (typeof value?.identity === "function") {
    seen.add(value);
    const identity = value.identity();
    if (nodeSet.has(identity)) output.add(identity);
    if (typeof value.descriptor === "function") discoverDependencies(value.descriptor(), nodeSet, output, seen);
    return;
  }
  if (typeof value !== "object") return;
  seen.add(value);
  if (Array.isArray(value)) {
    for (const entry of value) discoverDependencies(entry, nodeSet, output, seen);
  } else {
    for (const entry of Object.values(value)) discoverDependencies(entry, nodeSet, output, seen);
  }
}

export class DataflowScheduler {
  constructor({ cache = null, trace = null } = {}) { this.cache = cache; this.trace = trace; }
  async run(nodes, execute) {
    const nodeSet = new Map(nodes.map((node) => [keyOf(node), node]));
    const dependencies = new Map(nodes.map((node) => {
      const key = keyOf(node);
      const discovered = new Set();
      discoverDependencies(node.descriptor?.() ?? {}, nodeSet, discovered);
      discovered.delete(key);
      return [key, discovered];
    }));
    const values = new Map();
    const ready = [...nodes].filter((node) => dependencies.get(keyOf(node)).size === 0).sort((left, right) => keyOf(left).localeCompare(keyOf(right)));
    const completed = new Set();
    while (ready.length) {
      const node = ready.shift();
      const key = keyOf(node);
      if (completed.has(key)) continue;
      const inputs = [...dependencies.get(key)].map((dependency) => values.get(dependency));
      const cacheKey = digestIdentity("nll.scheduler-value", { key, inputs });
      let output = await this.cache?.get(cacheKey);
      const cached = output !== undefined;
      if (!cached) {
        output = await execute(node, inputs, values);
        await this.cache?.set(cacheKey, output);
      }
      values.set(key, output);
      completed.add(key);
      this.trace?.record("scheduler-node", { node: key, inputs, outputs: Array.isArray(output) ? output : [output], cached });
      for (const candidate of nodes) {
        const candidateKey = keyOf(candidate);
        if (completed.has(candidateKey)) continue;
        if ([...dependencies.get(candidateKey)].every((dependency) => completed.has(dependency))) ready.push(candidate);
      }
      ready.sort((left, right) => keyOf(left).localeCompare(keyOf(right)));
    }
    const unresolved = nodes.filter((node) => !completed.has(keyOf(node)));
    return Object.freeze({ values, unresolved });
  }
}
