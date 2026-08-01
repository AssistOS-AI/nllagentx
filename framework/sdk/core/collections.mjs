import { SemanticHandle, isSemanticHandle } from "./handles.mjs";
import { digestIdentity } from "./identity.mjs";

export class SemanticCollection extends SemanticHandle {
  #items;

  constructor(kind, items, { deduplicate = false, ordered = true, descriptor = {} } = {}) {
    const normalized = deduplicate
      ? [...new Map(items.map((item) => [semanticKey(item), item])).values()]
      : [...items];
    const stable = ordered ? normalized : normalized.sort((left, right) => semanticKey(left).localeCompare(semanticKey(right)));
    super({
      sort: "Collection",
      kind,
      identity: digestIdentity(`nll.collection.${kind}`, stable),
      descriptor: { size: stable.length, ordered, deduplicated: deduplicate, ...descriptor }
    });
    this.#items = Object.freeze(stable);
    Object.freeze(this);
  }

  [Symbol.iterator]() { return this.#items[Symbol.iterator](); }
  at(index) { return this.#items.at(index); }
  size() { return this.#items.length; }
  toArray() { return [...this.#items]; }
  has(value) { return this.#items.some((item) => semanticKey(item) === semanticKey(value)); }
  map(mapper) { return this.#items.map(mapper); }
}

function semanticKey(value) {
  if (isSemanticHandle(value)) return value.identity();
  if (typeof value === "bigint") return `bigint:${value}`;
  return `${typeof value}:${String(value)}`;
}

function flatten(values) {
  return values.flatMap((value) => value instanceof SemanticCollection ? value.toArray() : [value]);
}

export const sequence = (...items) => new SemanticCollection("Sequence", flatten(items));
export const setOf = (...items) => new SemanticCollection("Set", flatten(items), { deduplicate: true, ordered: false });
export const bagOf = (...items) => new SemanticCollection("Bag", flatten(items), { ordered: false });
export const allOf = (...items) => new SemanticCollection("Conjunction", flatten(items));
export const anyOf = (...items) => new SemanticCollection("Disjunction", flatten(items));
export const alternatives = (...items) => new SemanticCollection("Alternatives", flatten(items), { deduplicate: true });
export const orderedBy = (relation, ...items) => new SemanticCollection("RelationOrder", flatten(items), { descriptor: { relation } });
export const coverageSet = (scope, ...items) => new SemanticCollection("CoverageSet", flatten(items), { descriptor: { scope } });
