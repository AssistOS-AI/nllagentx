import { declaredIdentity } from "../core/identity.mjs";

export class Cardinality {
  constructor(minimum, maximum) {
    if (!Number.isInteger(minimum) || minimum < 0) throw new TypeError("Cardinality minimum must be a non-negative integer");
    if (maximum !== Infinity && (!Number.isInteger(maximum) || maximum < minimum)) {
      throw new TypeError("Cardinality maximum must be Infinity or an integer at least equal to the minimum");
    }
    this.minimum = minimum;
    this.maximum = maximum;
    Object.freeze(this);
  }
}

export const exactlyOne = () => new Cardinality(1, 1);
export const atMostOne = () => new Cardinality(0, 1);
export const atLeastOne = () => new Cardinality(1, Infinity);
export const optional = () => new Cardinality(0, 1);
export const repeatable = () => new Cardinality(0, Infinity);

export class RoleUse {
  constructor(role, cardinality, required) {
    this.role = role;
    this.cardinality = cardinality;
    this.required = required;
    Object.freeze(this);
  }
}

export const requires = (roleValue, cardinality = exactlyOne()) => new RoleUse(roleValue, cardinality, true);
export const allows = (roleValue, cardinality = optional()) => new RoleUse(roleValue, cardinality, false);

export class KindBuilder {
  constructor(sort, name) {
    if (!name) throw new TypeError(`${sort} kinds require a name`);
    this.sort = sort;
    this.name = name;
    this.roleUses = [];
    this.capabilities = [];
    this.parents = [];
    this.disjoint = [];
  }
  role(roleUse) { this.roleUses.push(roleUse); return this; }
  provide(capabilityValue) { this.capabilities.push(capabilityValue); return this; }
  subtypeOf(...parents) { this.parents.push(...parents); return this; }
  disjointWith(...others) { this.disjoint.push(...others); return this; }
}

export const entityKind = (name) => new KindBuilder("Entity", name);
export const eventKind = (name) => new KindBuilder("Event", name);
export const stateKind = (name) => new KindBuilder("State", name);
export const qualityKind = (name) => new KindBuilder("Quality", name);
export const valueKind = (name) => new KindBuilder("Value", name);
export const propositionKind = (name) => new KindBuilder("Proposition", name);
export const documentArtifactKind = (name) => new KindBuilder("DocumentArtifact", name);

export class RoleBuilder {
  constructor(name) { this.name = name; this.rangeValue = null; this.domainValue = null; this.inverseValue = null; }
  range(value) { this.rangeValue = value; return this; }
  domain(value) { this.domainValue = value; return this; }
  inverse(value) { this.inverseValue = value; return this; }
}

export const role = (name) => new RoleBuilder(name);

export class RelationBuilder extends RoleBuilder {
  constructor(name) {
    super(name);
    this.symmetricValue = false;
    this.transitiveValue = false;
  }
  symmetric(value = true) { this.symmetricValue = value; return this; }
  transitive(value = true) { this.transitiveValue = value; return this; }
}

export const relation = (name) => new RelationBuilder(name);

export class Capability {
  constructor(name) { this.name = name; Object.freeze(this); }
  identity() { return declaredIdentity("capability", this.name); }
  toString() { return this.identity(); }
}

export class Guarantee {
  constructor(name) { this.name = name; Object.freeze(this); }
  identity() { return declaredIdentity("guarantee", this.name); }
  toString() { return this.identity(); }
}

export const capability = (name) => new Capability(name);
export const guarantee = (name) => new Guarantee(name);
export const concept = (nameOrConstructor) => ({
  identity: typeof nameOrConstructor?.identity === "function" ? nameOrConstructor.identity() : String(nameOrConstructor)
});

export class LexicalizationBuilder {
  constructor(target) { this.target = target; this.entries = []; }
  language(language, ...forms) { this.entries.push(Object.freeze({ language, forms: Object.freeze(forms) })); return this; }
  english(...forms) { return this.language("en", ...forms); }
}

export const lexicalize = (target) => new LexicalizationBuilder(target);

export class FactBuilder {
  constructor(identity, proposition = null) {
    this.factIdentity = identity;
    this.proposition = proposition;
    this.sourceClassValue = "design-convention";
    this.scopeValue = "declared";
  }
  states(proposition) { this.proposition = proposition; return this; }
  sourceClass(sourceClass) { this.sourceClassValue = sourceClass; return this; }
  scope(scope) { this.scopeValue = scope; return this; }
}

export const fact = (identity, proposition = null) => new FactBuilder(identity, proposition);

export class LawBuilder {
  constructor(identity) { this.lawIdentity = identity; this.whenValue = null; this.statement = null; this.strengthValue = "model-relative"; }
  when(value) { this.whenValue = value; return this; }
  states(value) { this.statement = value; return this; }
  strength(value) { this.strengthValue = value; return this; }
}

export const law = (identity) => new LawBuilder(identity);
export const subtypeOf = (...values) => Object.freeze({ relation: "subtypeOf", values });
export const disjointWith = (...values) => Object.freeze({ relation: "disjointWith", values });
