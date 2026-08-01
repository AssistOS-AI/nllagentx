export class UnionFind {
  #parent = new Map();
  #rank = new Map();
  #disequalities = new Set();
  add(value) { if (!this.#parent.has(value)) { this.#parent.set(value, value); this.#rank.set(value, 0); } return value; }
  find(value) {
    this.add(value);
    const parent = this.#parent.get(value);
    if (parent !== value) this.#parent.set(value, this.find(parent));
    return this.#parent.get(value);
  }
  union(left, right) {
    let rootLeft = this.find(left); let rootRight = this.find(right);
    if (rootLeft === rootRight) return rootLeft;
    if (this.areDisequal(rootLeft, rootRight)) throw new Error("CONSTRAINT_EQUALITY_DISEQUALITY_CONFLICT");
    const rankLeft = this.#rank.get(rootLeft); const rankRight = this.#rank.get(rootRight);
    if (rankLeft < rankRight) [rootLeft, rootRight] = [rootRight, rootLeft];
    this.#parent.set(rootRight, rootLeft);
    if (rankLeft === rankRight) this.#rank.set(rootLeft, rankLeft + 1);
    this.#rewriteDisequalities(rootRight, rootLeft);
    return rootLeft;
  }
  disequal(left, right) {
    const rootLeft = this.find(left); const rootRight = this.find(right);
    if (rootLeft === rootRight) throw new Error("CONSTRAINT_EQUALITY_DISEQUALITY_CONFLICT");
    this.#disequalities.add(this.#pair(rootLeft, rootRight));
  }
  areEqual(left, right) { return this.find(left) === this.find(right); }
  areDisequal(left, right) { return this.#disequalities.has(this.#pair(this.find(left), this.find(right))); }
  classes() {
    const classes = new Map();
    for (const value of this.#parent.keys()) {
      const root = this.find(value);
      if (!classes.has(root)) classes.set(root, new Set());
      classes.get(root).add(value);
    }
    return classes;
  }
  #pair(left, right) { return [String(left), String(right)].sort().join("\0"); }
  #rewriteDisequalities(previous, replacement) {
    const rewritten = new Set();
    for (const pair of this.#disequalities) {
      const [left, right] = pair.split("\0");
      rewritten.add(this.#pair(left === String(previous) ? replacement : left, right === String(previous) ? replacement : right));
    }
    this.#disequalities = rewritten;
  }
}
