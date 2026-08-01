function tupleKey(tuple) { return tuple.map((value) => (typeof value?.identity === "function" ? value.identity() : value?.identity) ?? String(value)).join("\0"); }

export class RelationProgram {
  constructor() { this.relations = new Map(); this.rules = []; }
  relation(name, tuples = []) { this.relations.set(name, new Map(tuples.map((tuple) => [tupleKey(tuple), Object.freeze([...tuple])]))); return this; }
  rule(output, inputs, evaluate, { negative = [] } = {}) { this.rules.push(Object.freeze({ output, inputs: [...inputs], negative: [...negative], evaluate })); return this; }
}

export function semiNaiveFixedPoint(program, { maxRounds = 1000 } = {}) {
  const all = new Map([...program.relations].map(([name, tuples]) => [name, new Map(tuples)]));
  for (const rule of program.rules) if (!all.has(rule.output)) all.set(rule.output, new Map());
  let delta = new Map([...all].map(([name, tuples]) => [name, new Map(tuples)]));
  let round = 0;
  while ([...delta.values()].some((values) => values.size > 0)) {
    if (round++ >= maxRounds) return Object.freeze({ converged: false, diagnostic: "FIXPOINT_NON_TERMINATING_DOMAIN", relations: all, rounds: round });
    const next = new Map([...all.keys()].map((name) => [name, new Map()]));
    for (const rule of program.rules) {
      if (rule.negative.some((name) => !all.has(name))) return Object.freeze({ converged: false, diagnostic: "FIXPOINT_UNSTRATIFIED_NEGATION", relations: all, rounds: round });
      for (let deltaIndex = 0; deltaIndex < rule.inputs.length; deltaIndex += 1) {
        const sources = rule.inputs.map((name, index) => [...(index === deltaIndex ? delta.get(name) : all.get(name))?.values() ?? []]);
        for (const tuple of rule.evaluate(sources, all) ?? []) {
          const key = tupleKey(tuple);
          if (!all.get(rule.output)?.has(key)) next.get(rule.output).set(key, Object.freeze([...tuple]));
        }
      }
    }
    for (const [name, tuples] of next) {
      if (!all.has(name)) all.set(name, new Map());
      for (const [key, tuple] of tuples) all.get(name).set(key, tuple);
    }
    delta = next;
  }
  return Object.freeze({ converged: true, relations: all, rounds: round, guarantee: "least-fixed-point" });
}

export function naiveFixedPoint(program, options = {}) {
  const copy = new RelationProgram();
  for (const [name, tuples] of program.relations) copy.relation(name, [...tuples.values()]);
  copy.rules = program.rules.map((rule) => ({ ...rule, inputs: rule.inputs.map((name) => name) }));
  return semiNaiveFixedPoint(copy, options);
}

export function transitiveClosure(edges) {
  const program = new RelationProgram().relation("path", edges);
  program.rule("path", ["path", "path"], ([left, right]) => {
    const output = [];
    for (const [a, b] of left) for (const [c, d] of right) if (b === c) output.push([a, d]);
    return output;
  });
  return [...semiNaiveFixedPoint(program).relations.get("path").values()];
}
