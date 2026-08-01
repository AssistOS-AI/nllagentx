import { capability, guarantee } from "./definitions.mjs";
import { declaredIdentity } from "../core/identity.mjs";

class SignalSet {
  constructor(kind, values) { this.kind = kind; this.values = Object.freeze(values.flat()); Object.freeze(this); }
}

export const lexicalSignals = (...values) => new SignalSet("lexical", values);
export const semanticSignals = (...values) => new SignalSet("semantic", values);
export const ontologyModule = (module) => module;
export const circuitModule = (module) => module;
export const baselineTier = () => "baseline";
export const coreTier = () => "core";
export const domainTier = () => "domain";
export const specializedTier = () => "specialized";
export const loadTier = (value) => value;
export const lowerSecondary = () => "lower-secondary";
export const knowledgeLevel = (value) => value;

export class DomainPack {
  constructor(builder) {
    this.id = builder.id;
    this.version = builder.version;
    this.identity = declaredIdentity("pack", builder.id, builder.version);
    this.ontologies = Object.freeze([...builder.ontologies]);
    this.circuits = Object.freeze([...builder.circuits]);
    this.signals = Object.freeze([...builder.signals]);
    this.capabilities = Object.freeze([...builder.capabilities]);
    this.requirements = Object.freeze([...builder.requirements]);
    this.incompatibilities = Object.freeze([...builder.incompatibilities]);
    this.tier = builder.tierValue;
    this.knowledgeLevel = builder.knowledgeLevelValue;
    this.tests = Object.freeze([...builder.tests]);
    Object.freeze(this);
  }

  recognizes(text) {
    const normalized = text.toLocaleLowerCase("en");
    const lexical = this.signals.filter((signal) => signal.kind === "lexical").flatMap((signal) => signal.values);
    const matches = lexical.filter((signal) => normalized.includes(String(signal).toLocaleLowerCase("en")));
    return Object.freeze({ matched: matches.length > 0, matches });
  }
}

export class DomainPackBuilder {
  constructor(id, version) {
    this.id = id;
    this.version = version;
    this.ontologies = [];
    this.circuits = [];
    this.signals = [];
    this.capabilities = [];
    this.requirements = [];
    this.incompatibilities = [];
    this.tests = [];
    this.tierValue = "domain";
    this.knowledgeLevelValue = "lower-secondary";
  }
  ontology(...modules) { this.ontologies.push(...modules); return this; }
  circuit(...modules) { this.circuits.push(...modules); return this; }
  recognize(...signals) { this.signals.push(...signals); return this; }
  provide(...capabilities) { this.capabilities.push(...capabilities); return this; }
  requires(...requirements) { this.requirements.push(...requirements); return this; }
  incompatible(...packs) { this.incompatibilities.push(...packs); return this; }
  tier(value) { this.tierValue = value; return this; }
  knowledgeLevel(value) { this.knowledgeLevelValue = value; return this; }
  targetKnowledgeLevel(value) { return this.knowledgeLevel(value); }
  test(...tests) { this.tests.push(...tests); return this; }
  seal() { return new DomainPack(this); }
}

export const domainPack = (id, version = "1.0.0") => new DomainPackBuilder(id, version);

export class PackReference {
  constructor(id) { this.id = id; this.tierValue = null; this.levelValue = null; }
  tier(value) { this.tierValue = value; return this; }
  level(value) { this.levelValue = value; return this; }
}
export const packRef = (id) => new PackReference(id);

export class PackIndexBuilder {
  constructor(id) { this.id = id; this.entries = []; }
  add(...entries) { this.entries.push(...entries); return this; }
  seal() { return Object.freeze({ id: this.id, entries: Object.freeze([...this.entries]) }); }
}
export const packIndex = (id) => new PackIndexBuilder(id);

export { capability, guarantee };
