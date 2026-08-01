import { capability, guarantee } from "../ontology/definitions.mjs";

export const viewKind = (id) => ({ kind: "view", id });
export const costClass = (id) => ({ kind: "cost", id });
export const low = () => costClass("low");
export const medium = () => costClass("medium");
export const high = () => costClass("high");

export class MethodDescriptorBuilder {
  constructor(id) { this.id = id; this.accepted = []; this.provided = []; this.guarantees = []; this.costValue = null; this.applicability = null; this.executor = null; this.explainer = null; }
  accepts(...values) { this.accepted.push(...values); return this; }
  provides(...values) { this.provided.push(...values); return this; }
  guarantee(...values) { this.guarantees.push(...values); return this; }
  cost(value) { this.costValue = value; return this; }
  applicable(value) { this.applicability = value; return this; }
  execute(value) { this.executor = value; return this; }
  explain(value) { this.explainer = value; return this; }
  seal() { return Object.freeze({ ...this, accepted: Object.freeze(this.accepted), provided: Object.freeze(this.provided), guarantees: Object.freeze(this.guarantees) }); }
}
export const method = (id) => new MethodDescriptorBuilder(id);
export const methodProvider = method;

export class MethodCatalogBuilder {
  constructor(id) { this.id = id; this.entries = []; }
  add(...entries) { this.entries.push(...entries); return this; }
  seal() { return Object.freeze({ id: this.id, entries: Object.freeze(this.entries.map((entry) => entry.seal?.() ?? entry)) }); }
}
export const methodCatalog = (id) => new MethodCatalogBuilder(id);
export { capability, guarantee };
