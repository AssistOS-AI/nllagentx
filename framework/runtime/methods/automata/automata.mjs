export class FiniteAutomaton {
  constructor({ initial, accepting = [], transitions = [], deterministic = true }) {
    this.initial = initial; this.accepting = new Set(accepting); this.deterministic = deterministic;
    this.transitions = new Map();
    for (const { from, symbol, to, weight = 0 } of transitions) {
      const key = `${from}\0${symbol}`;
      if (!this.transitions.has(key)) this.transitions.set(key, []);
      this.transitions.get(key).push(Object.freeze({ to, weight }));
    }
  }
  run(symbols, { combine = (left, right) => left + right, zero = 0 } = {}) {
    let states = new Map([[this.initial, zero]]);
    const trace = [];
    for (const symbol of symbols) {
      const next = new Map();
      for (const [state, score] of states) for (const transition of this.transitions.get(`${state}\0${symbol}`) ?? []) {
        const value = combine(score, transition.weight);
        if (!next.has(transition.to) || value < next.get(transition.to)) next.set(transition.to, value);
        trace.push(Object.freeze({ state, symbol, next: transition.to, value }));
      }
      states = next;
      if (states.size === 0) break;
    }
    const accepted = [...states.keys()].some((state) => this.accepting.has(state));
    return Object.freeze({ accepted, states, trace: Object.freeze(trace) });
  }
}

export function monitorPattern(kind, event, response = null, bound = Infinity) {
  if (kind === "absence") return Object.freeze({ run(trace) { const index = trace.indexOf(event); return index < 0 ? { accepted: true } : { accepted: false, witness: trace[index], index }; } });
  if (kind === "precedence") return Object.freeze({
    run(trace) { let seen = false; for (const item of trace) { if (item === event) seen = true; if (item === response && !seen) return { accepted: false, witness: item }; } return { accepted: true }; }
  });
  if (kind === "response") return Object.freeze({
    run(trace) { let pending = null; for (let index = 0; index < trace.length; index += 1) { if (trace[index] === event) pending = index; if (trace[index] === response) pending = null; if (pending !== null && index - pending >= bound) return { accepted: false, witness: trace.slice(pending, index + 1) }; } return { accepted: pending === null, inconclusive: pending !== null }; }
  });
  throw new Error(`Unknown monitor pattern: ${kind}`);
}
