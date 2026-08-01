class CheckFamilyBuilder {
  constructor(id) { this.id = id; this.targetValues = []; this.concernValues = []; this.outputValues = []; }
  targets(...values) { this.targetValues.push(...values); return this; }
  concerns(...values) { this.concernValues.push(...values); return this; }
  outputs(...values) { this.outputValues.push(...values); return this; }
}
export const checkFamily = (id) => new CheckFamilyBuilder(id);
export const targetText = (id) => ({ kind: "target-text", id });
export const concern = (id) => ({ kind: "concern", id });
export const outputKind = (id) => ({ kind: "output-kind", id });
export class CheckCatalogBuilder {
  constructor(id) { this.id = id; this.entries = []; }
  add(...entries) { this.entries.push(...entries); return this; }
  seal() { return Object.freeze({ id: this.id, entries: Object.freeze([...this.entries]) }); }
}
export const checkCatalog = (id) => new CheckCatalogBuilder(id);
