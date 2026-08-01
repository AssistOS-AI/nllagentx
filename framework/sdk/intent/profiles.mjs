export class ProfileDirective {
  constructor(kind, value = null) { this.kind = kind; this.value = value; Object.freeze(this); }
}
export const usePack = (id) => new ProfileDirective("use-pack", id);
export const useEveryCompatiblePack = () => new ProfileDirective("use-every-compatible-pack");
export const concreteFirst = () => new ProfileDirective("concrete-first");
export const abstractPreflightForSelectedCircuits = () => new ProfileDirective("abstract-preflight");
export const symbolicWhereSupported = () => new ProfileDirective("symbolic-where-supported");
export const allCompatibleWithinLoadedPacks = () => new ProfileDirective("all-compatible-within-loaded-packs");
export const runEveryCompatibleCircuit = () => new ProfileDirective("run-every-compatible-circuit");
export const explainAllSelection = () => new ProfileDirective("explain-all-selection");
export const preferConcern = (id) => new ProfileDirective("prefer-concern", id);
export const requireEvidenceBearing = () => new ProfileDirective("require-evidence-bearing");

export class LoadProfile {
  constructor(builder) {
    this.id = builder.id;
    this.packs = Object.freeze([...builder.packs]);
    this.preferences = Object.freeze([...builder.preferences]);
    this.assurance = Object.freeze([...builder.assuranceValues]);
    this.fallback = builder.fallbackValue;
    this.selection = builder.selectionValue;
    this.explanation = builder.explanationValue;
    this.requirements = Object.freeze([...builder.requirements]);
    Object.freeze(this);
  }
}

export class LoadProfileBuilder {
  constructor(id) { this.id = id; this.packs = []; this.preferences = []; this.assuranceValues = []; this.requirements = []; this.fallbackValue = null; this.selectionValue = null; this.explanationValue = null; }
  use(...values) { this.packs.push(...values); return this; }
  prefer(...values) { this.preferences.push(...values); return this; }
  assure(...values) { this.assuranceValues.push(...values); return this; }
  require(...values) { this.requirements.push(...values); return this; }
  fallback(value) { this.fallbackValue = value; return this; }
  selection(value) { this.selectionValue = value; return this; }
  explain(value) { this.explanationValue = value; return this; }
  seal() { return new LoadProfile(this); }
}
export const loadProfile = (id) => new LoadProfileBuilder(id);
