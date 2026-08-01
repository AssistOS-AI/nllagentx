class DecisionNode { constructor(id, variable, low, high) { this.id = id; this.variable = variable; this.low = low; this.high = high; Object.freeze(this); } }

export function compileDecisionDag(variables, evaluate, { maxNodes = 100000 } = {}) {
  const unique = new Map(); const memo = new Map(); let nodeCount = 0;
  function build(index, assignment) {
    const memoKey = `${index}\0${variables.slice(0, index).map((name) => `${name}=${assignment.get(name)}`).join("|")}`;
    if (memo.has(memoKey)) return memo.get(memoKey);
    if (index === variables.length) return Boolean(evaluate(assignment));
    const variable = variables[index];
    assignment.set(variable, false); const low = build(index + 1, assignment);
    assignment.set(variable, true); const high = build(index + 1, assignment); assignment.delete(variable);
    if (low === high) return low;
    const uniqueKey = `${variable}\0${typeof low === "boolean" ? low : low.id}:${typeof high === "boolean" ? high : high.id}`;
    let node = unique.get(uniqueKey);
    if (!node) { if (++nodeCount > maxNodes) throw new Error("KNOWLEDGE_COMPILE_BLOWUP"); node = new DecisionNode(nodeCount, variable, low, high); unique.set(uniqueKey, node); }
    memo.set(memoKey, node); return node;
  }
  const root = build(0, new Map());
  return Object.freeze({ root, nodeCount, evaluate(assignment) { let current = root; while (current instanceof DecisionNode) current = assignment.get(current.variable) ? current.high : current.low; return current; } });
}
