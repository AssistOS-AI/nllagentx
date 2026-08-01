import { declaredIdentity } from "../core/identity.mjs";

export class ResponseDirective {
  constructor(kind, value = kind) {
    this.kind = kind;
    this.value = value;
    Object.freeze(this);
  }
}

const directive = (kind) => (value = kind) => new ResponseDirective(kind, value);

export const responseStyle = directive("style");
export const evidenceLed = () => responseStyle("evidence-led");
export const analytical = () => responseStyle("analytical");
export const concise = () => responseStyle("concise");
export const procedural = () => responseStyle("procedural");
export const groupResultsBy = directive("group-by");
export const includeResultStatus = directive("include-status");
export const excludeResultStatus = directive("exclude-status");
export const includeResultTag = directive("include-tag");
export const excludeResultTag = directive("exclude-tag");
export const explainMatchedRules = () => new ResponseDirective("feature", "explain-rules");
export const quoteSourceEvidence = () => new ResponseDirective("feature", "quote-evidence");
export const countResultGroups = () => new ResponseDirective("feature", "count-groups");
export const emitStableCnlTags = () => new ResponseDirective("feature", "stable-tags");
export const includeSatisfiedResults = () => new ResponseDirective("feature", "include-satisfied");

export class ResponseStage {
  constructor(id, transform) {
    if (!id || typeof transform !== "function") throw new TypeError("responseStage(id, transform) is required");
    this.id = id;
    this.transform = transform;
    Object.freeze(this);
  }
}

export const responseStage = (id, transform) => new ResponseStage(id, transform);

export class ResponseCircuitModel {
  constructor(builder) {
    this.id = builder.id;
    this.version = builder.version;
    this.identity = declaredIdentity("response-circuit", builder.id, builder.version);
    this.priority = builder.priorityValue;
    this.applies = builder.applicability;
    this.stages = Object.freeze([...builder.stages]);
    Object.freeze(this);
  }
}

export class ResponseCircuitBuilder {
  constructor(id, version) {
    if (!id || !version) throw new TypeError("responseCircuit(id, version) requires both arguments");
    this.id = id;
    this.version = version;
    this.priorityValue = 0;
    this.applicability = () => true;
    this.stages = [];
  }
  priority(value) { this.priorityValue = Number(value); return this; }
  when(predicate) { this.applicability = predicate; return this; }
  use(...stages) { this.stages.push(...stages); return this; }
  seal() { return new ResponseCircuitModel(this); }
}

export const responseCircuit = (id, version = "1.0.0") => new ResponseCircuitBuilder(id, version);

