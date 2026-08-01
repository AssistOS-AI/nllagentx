import { Rational } from "./rational.mjs";

export class DifferenceConstraints {
  constructor() { this.variables = new Set(["$zero"]); this.edges = []; }
  add(left, right, maximum, id = `difference-${this.edges.length}`) {
    this.variables.add(left); this.variables.add(right);
    this.edges.push(Object.freeze({ from: right, to: left, weight: Rational.from(maximum), id }));
    return this;
  }
  upper(variable, maximum) { return this.add(variable, "$zero", maximum); }
  lower(variable, minimum) { return this.add("$zero", variable, Rational.from(minimum).negate()); }
  solve() {
    const distances = new Map([...this.variables].map((variable) => [variable, new Rational(0)]));
    const predecessor = new Map();
    const variables = [...this.variables];
    let changed = null;
    for (let round = 0; round < variables.length; round += 1) {
      changed = null;
      for (const edge of this.edges) {
        const candidate = distances.get(edge.from).add(edge.weight);
        if (candidate.compare(distances.get(edge.to)) < 0) {
          distances.set(edge.to, candidate); predecessor.set(edge.to, edge); changed = edge.to;
        }
      }
      if (changed === null) return Object.freeze({ satisfiable: true, distances });
    }
    let cursor = changed;
    for (let index = 0; index < variables.length; index += 1) cursor = predecessor.get(cursor)?.from ?? cursor;
    const cycle = []; const seen = new Set();
    while (!seen.has(cursor)) { seen.add(cursor); const edge = predecessor.get(cursor); if (!edge) break; cycle.push(edge); cursor = edge.from; }
    return Object.freeze({ satisfiable: false, diagnostic: "CONSTRAINT_UNSAT", negativeCycle: Object.freeze(cycle) });
  }
}
