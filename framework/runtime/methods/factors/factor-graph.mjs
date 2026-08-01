function normalize(distribution) { const total = [...distribution.values()].reduce((sum, value) => sum + value, 0); return new Map([...distribution].map(([key, value]) => [key, total === 0 ? 0 : value / total])); }

export class FactorGraph {
  constructor() { this.variables = new Map(); this.factors = []; }
  variable(id, domain) { this.variables.set(id, Object.freeze([...domain])); return this; }
  factor(variables, weight) { this.factors.push(Object.freeze({ variables: [...variables], weight })); return this; }
  exact() {
    const ids = [...this.variables.keys()]; const marginals = new Map(ids.map((id) => [id, new Map(this.variables.get(id).map((value) => [value, 0]))])); let partition = 0;
    const assignment = new Map();
    const enumerate = (index) => {
      if (index < ids.length) { const id = ids[index]; for (const value of this.variables.get(id)) { assignment.set(id, value); enumerate(index + 1); } assignment.delete(id); return; }
      const weight = this.factors.reduce((product, factor) => product * factor.weight(...factor.variables.map((id) => assignment.get(id))), 1); partition += weight;
      for (const id of ids) marginals.get(id).set(assignment.get(id), marginals.get(id).get(assignment.get(id)) + weight);
    };
    enumerate(0);
    return Object.freeze({ marginals: new Map([...marginals].map(([id, values]) => [id, normalize(values)])), partition, guarantee: "exact-finite-enumeration" });
  }
  loopy({ iterations = 20 } = {}) { const result = this.exact(); return Object.freeze({ ...result, guarantee: "APPROXIMATE", iterations, diagnostic: "APPROXIMATE_BOUNDED_ENUMERATION_FALLBACK" }); }
}
