import { declaredIdentity } from "../core/identity.mjs";
import { registerDescriptor } from "../core/descriptors.mjs";
import { capability, guarantee, concept } from "../ontology/definitions.mjs";

export class CircuitModel {
  constructor(builder) {
    this.id = builder.id;
    this.version = builder.version;
    this.identity = declaredIdentity("circuit", builder.id, builder.version);
    this.kind = builder.kind;
    this.concerns = Object.freeze([...builder.concernValues]);
    this.targets = Object.freeze([...builder.targetValues]);
    this.requirements = Object.freeze([...builder.requirements]);
    this.provisions = Object.freeze([...builder.provisions]);
    this.stages = Object.freeze([...builder.stages]);
    this.compositions = Object.freeze([...builder.compositions]);
    this.emissions = Object.freeze([...builder.emissions]);
    this.assurances = Object.freeze([...builder.assurances]);
    this.statuses = Object.freeze([...builder.statusValues]);
    this.cost = builder.costValue;
    Object.freeze(this);
    registerDescriptor({
      identity: this.identity,
      exportName: builder.id,
      module: "CircuitJS",
      signature: `${builder.id} SemanticStore -> Finding*`,
      semanticSorts: ["CircuitModel", "Finding"],
      provenance: "evidence-required",
      determinism: "declared-stage-order"
    });
  }
}

export class CircuitBuilder {
  constructor(id, version, kind = "circuit") {
    if (!id || !version) throw new TypeError("circuit(id, version) requires both arguments");
    this.id = id;
    this.version = version;
    this.kind = kind;
    this.concernValues = [];
    this.targetValues = [];
    this.requirements = [];
    this.provisions = [];
    this.stages = [];
    this.compositions = [];
    this.emissions = [];
    this.assurances = [];
    this.statusValues = [];
    this.costValue = "low";
  }
  concern(...values) { this.concernValues.push(...values); return this; }
  targets(...values) { this.targetValues.push(...values); return this; }
  requires(...values) { this.requirements.push(...values); return this; }
  provides(...values) { this.provisions.push(...values); return this; }
  use(...values) { this.stages.push(...values.map((value) => value?.seal && !value.sort ? value.seal() : value)); return this; }
  compose(...values) { this.compositions.push(...values); return this; }
  emit(...values) { this.emissions.push(...values); return this; }
  assurance(...values) { this.assurances.push(...values); return this; }
  statuses(...values) { this.statusValues.push(...values); return this; }
  cost(value) { this.costValue = value; return this; }
  seal() { return new CircuitModel(this); }
}

export const circuit = (id, version = "1.0.0") => new CircuitBuilder(id, version);
export const compositeCircuit = (id, version = "1.0.0") => new CircuitBuilder(id, version, "composite");
export const coverageRequirement = (conceptValue, policy = null) => ({ kind: "coverage-requirement", concept: conceptValue, policy });
export const closedForRelevantScope = () => "closed-for-relevant-scope";
export const compliance = () => "compliance";
export { capability, guarantee, concept };
