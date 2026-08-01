export const ALLEN_RELATIONS = Object.freeze([
  "before", "meets", "overlaps", "starts", "during", "finishes", "equal",
  "finished-by", "contains", "started-by", "overlapped-by", "met-by", "after"
]);

export const inverseAllen = Object.freeze({
  before: "after", meets: "met-by", overlaps: "overlapped-by", starts: "started-by", during: "contains",
  finishes: "finished-by", equal: "equal", "finished-by": "finishes", contains: "during", "started-by": "starts",
  "overlapped-by": "overlaps", "met-by": "meets", after: "before"
});

export function classifyInterval(left, right) {
  const [a, b] = left; const [c, d] = right;
  if (b < c) return "before";
  if (b === c) return "meets";
  if (a < c && c < b && b < d) return "overlaps";
  if (a === c && b < d) return "starts";
  if (c < a && b < d) return "during";
  if (c < a && b === d) return "finishes";
  if (a === c && b === d) return "equal";
  if (a < c && b === d) return "finished-by";
  if (a < c && d < b) return "contains";
  if (a === c && d < b) return "started-by";
  if (c < a && a < d && d < b) return "overlapped-by";
  if (a === d) return "met-by";
  return "after";
}

const COMPOSITION = new Map();
const ENUMERATION_INTERVALS = (() => {
  const intervals = [];
  for (let start = 0; start < 7; start += 1) for (let end = start + 1; end < 8; end += 1) intervals.push([start, end]);
  return intervals;
})();
export function composeAllen(leftRelation, rightRelation) {
  const key = `${leftRelation}\0${rightRelation}`;
  if (!COMPOSITION.has(key)) {
    const result = new Set();
    for (const left of ENUMERATION_INTERVALS) for (const middle of ENUMERATION_INTERVALS) for (const right of ENUMERATION_INTERVALS) {
      if (classifyInterval(left, middle) === leftRelation && classifyInterval(middle, right) === rightRelation) result.add(classifyInterval(left, right));
    }
    COMPOSITION.set(key, result.size ? result : new Set(ALLEN_RELATIONS));
  }
  return new Set(COMPOSITION.get(key));
}

export class TemporalNetwork {
  constructor() { this.intervals = new Set(); this.relations = new Map(); }
  #key(left, right) { return `${left}\0${right}`; }
  addInterval(id) { this.intervals.add(id); this.relations.set(this.#key(id, id), new Set(["equal"])); return this; }
  constrain(left, right, allowed) {
    this.addInterval(left).addInterval(right);
    const values = new Set(Array.isArray(allowed) ? allowed : [allowed]);
    const key = this.#key(left, right);
    const current = this.relations.get(key) ?? new Set(ALLEN_RELATIONS);
    this.relations.set(key, new Set([...current].filter((value) => values.has(value))));
    this.relations.set(this.#key(right, left), new Set([...this.relations.get(key)].map((value) => inverseAllen[value])));
    return this;
  }
  possible(left, right) { return new Set(this.relations.get(this.#key(left, right)) ?? ALLEN_RELATIONS); }
  close() {
    const nodes = [...this.intervals].sort();
    let changed = true;
    while (changed) {
      changed = false;
      for (const left of nodes) for (const middle of nodes) for (const right of nodes) {
        if (left === right) continue;
        const composed = new Set();
        for (const first of this.possible(left, middle)) for (const second of this.possible(middle, right)) for (const relation of composeAllen(first, second)) composed.add(relation);
        const current = this.possible(left, right);
        const narrowed = new Set([...current].filter((relation) => composed.has(relation)));
        if (narrowed.size === 0) return Object.freeze({ consistent: false, diagnostic: "TEMPORAL_INCONSISTENT", triple: [left, middle, right] });
        if (narrowed.size < current.size) { this.relations.set(this.#key(left, right), narrowed); this.relations.set(this.#key(right, left), new Set([...narrowed].map((value) => inverseAllen[value]))); changed = true; }
      }
    }
    return Object.freeze({ consistent: true, relations: new Map(this.relations), guarantee: "path-consistent" });
  }
}
