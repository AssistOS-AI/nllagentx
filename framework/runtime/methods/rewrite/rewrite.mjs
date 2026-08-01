import { canonicalText } from "../../../sdk/core/identity.mjs";

export class RewriteSystem {
  constructor() { this.rules = []; }
  rule(id, match, replace, { equivalence = false, context = null } = {}) { this.rules.push(Object.freeze({ id, match, replace, equivalence, context })); return this; }
  normalize(term, context = null, { maxSteps = 1000 } = {}) {
    let current = term; const trace = [];
    for (let step = 0; step < maxSteps; step += 1) {
      const rule = this.rules.find((candidate) => (!candidate.context || candidate.context(context)) && candidate.match(current, context));
      if (!rule) return Object.freeze({ term: current, trace: Object.freeze(trace), saturated: true });
      const next = rule.replace(current, context); trace.push(Object.freeze({ rule: rule.id, before: current, after: next }));
      if (canonicalText(next) === canonicalText(current)) return Object.freeze({ term: current, trace: Object.freeze(trace), saturated: true });
      current = next;
    }
    return Object.freeze({ term: current, trace: Object.freeze(trace), saturated: false, diagnostic: "REWRITE_BUDGET_EXCEEDED" });
  }
}

export class EGraphLite {
  constructor() { this.terms = new Map(); this.parent = new Map(); this.rules = []; }
  add(term) { const key = canonicalText(term); if (!this.terms.has(key)) { this.terms.set(key, term); this.parent.set(key, key); } return key; }
  find(key) { const parent = this.parent.get(key); if (parent !== key) this.parent.set(key, this.find(parent)); return this.parent.get(key); }
  union(leftTerm, rightTerm) { let left = this.find(this.add(leftTerm)); let right = this.find(this.add(rightTerm)); if (left !== right) { if (left > right) [left, right] = [right, left]; this.parent.set(right, left); } return left; }
  rule(id, apply) { this.rules.push(Object.freeze({ id, apply })); return this; }
  saturate({ rounds = 20, budget = 10000 } = {}) {
    const trace = []; let additions = 0;
    for (let round = 0; round < rounds; round += 1) {
      const before = additions;
      for (const [key, term] of [...this.terms]) for (const rule of this.rules) {
        for (const result of rule.apply(term) ?? []) { this.union(term, result); trace.push({ rule: rule.id, from: key, to: canonicalText(result) }); additions += 1; if (additions >= budget) return { saturated: false, diagnostic: "REWRITE_BUDGET_EXCEEDED", trace }; }
      }
      if (before === additions) return { saturated: true, trace };
    }
    return { saturated: false, diagnostic: "REWRITE_BUDGET_EXCEEDED", trace };
  }
  extract(term, cost = (value) => canonicalText(value).length) {
    const root = this.find(this.add(term));
    return [...this.terms].filter(([key]) => this.find(key) === root).map(([, value]) => value).sort((left, right) => cost(left) - cost(right) || canonicalText(left).localeCompare(canonicalText(right)))[0];
  }
}
