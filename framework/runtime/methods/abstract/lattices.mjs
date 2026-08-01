export class FiniteLattice {
  constructor({ elements, bottom, top, leq, join, meet = null, widen = null }) {
    this.elements = Object.freeze([...elements]); this.bottom = bottom; this.top = top;
    this.leq = leq; this.join = join; this.meet = meet ?? ((left, right) => this.elements.filter((value) => leq(value, left) && leq(value, right)).at(-1) ?? bottom);
    this.widen = widen ?? join; Object.freeze(this);
  }
  validateLaws() {
    const failures = [];
    for (const left of this.elements) for (const right of this.elements) {
      if (this.join(left, right) !== this.join(right, left)) failures.push(["join-commutative", left, right]);
      if (this.join(left, left) !== left) failures.push(["join-idempotent", left]);
      if (!this.leq(left, this.join(left, right))) failures.push(["join-upper-bound", left, right]);
    }
    return Object.freeze({ valid: failures.length === 0, failures: Object.freeze(failures) });
  }
}

export const evidenceLattice = new FiniteLattice({
  elements: ["none", "support", "refute", "conflict"], bottom: "none", top: "conflict",
  leq: (left, right) => left === right || left === "none" || right === "conflict",
  join: (left, right) => left === right ? left : left === "none" ? right : right === "none" ? left : "conflict"
});

export const coverageLattice = new FiniteLattice({
  elements: ["open", "partial", "closed"], bottom: "open", top: "closed",
  leq: (left, right) => ["open", "partial", "closed"].indexOf(left) <= ["open", "partial", "closed"].indexOf(right),
  join: (left, right) => ["open", "partial", "closed"][Math.max(["open", "partial", "closed"].indexOf(left), ["open", "partial", "closed"].indexOf(right))]
});

export class IntervalDomain {
  constructor(lower = -Infinity, upper = Infinity) { if (lower > upper) throw new RangeError("ABSTRACT_EMPTY_INTERVAL"); this.lower = lower; this.upper = upper; Object.freeze(this); }
  join(other) { return new IntervalDomain(Math.min(this.lower, other.lower), Math.max(this.upper, other.upper)); }
  meet(other) { const lower = Math.max(this.lower, other.lower); const upper = Math.min(this.upper, other.upper); return lower <= upper ? new IntervalDomain(lower, upper) : null; }
  add(other) { return new IntervalDomain(this.lower + other.lower, this.upper + other.upper); }
  widen(other) { return new IntervalDomain(other.lower < this.lower ? -Infinity : this.lower, other.upper > this.upper ? Infinity : this.upper); }
}
