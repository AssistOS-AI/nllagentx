import { declaredIdentity, digestIdentity } from "../core/identity.mjs";

export class IntentFragment {
  constructor(kind, value = null, { priority = 0, provenance = null, mode = "allow" } = {}) {
    this.kind = kind;
    this.value = value;
    this.priority = priority;
    this.provenance = provenance;
    this.mode = mode;
    Object.freeze(this);
  }
  identity() {
    return digestIdentity("nll.intent-fragment", {
      kind: this.kind,
      value: this.value,
      priority: this.priority,
      provenance: this.provenance,
      mode: this.mode
    });
  }
}

const fragment = (kind) => (value = kind) => new IntentFragment(kind, value);
export const analyze = fragment("analyze");
export const validate = fragment("validate");
export const compare = fragment("compare");
export const explain = fragment("explain");
export const repair = fragment("repair");
export const canonicalize = fragment("canonicalize");
export const generate = fragment("generate");
export const plan = fragment("plan");
export const summarizeSemantically = fragment("summarize-semantically");
export const askForClarification = fragment("ask-for-clarification");
export const analyzeAndPlan = fragment("analyze-and-plan");
export const longDocument = fragment("long-document");
export const narrativeText = fragment("narrative-text");
export const legalText = fragment("legal-text");
export const scientificText = fragment("scientific-text");
export const argumentText = fragment("argument-text");
export const explicitDomain = (value) => new IntentFragment("domain", value, { mode: "require" });
export const preferDomain = (value) => new IntentFragment("domain", value, { mode: "prefer" });
export const allowDomain = (value) => new IntentFragment("domain", value, { mode: "allow" });
export const excludeDomain = (value) => new IntentFragment("domain", value, { mode: "exclude" });
export const inferDomainsFromSource = () => new IntentFragment("domain-inference", "source");
export const inferFromSource = inferDomainsFromSource;
export const concern = (value) => new IntentFragment("concern", value);
export const findings = () => new IntentFragment("output", "findings");
export const cnlObservations = () => new IntentFragment("output", "cnl-observations");
export const markdownCnl = () => new IntentFragment("output", "markdown-cnl");
export const compositionPlan = () => new IntentFragment("output", "composition-plan");
export const structuralTrace = () => new IntentFragment("output", "structural-trace");
export const repairFrames = () => new IntentFragment("output", "repair-frames");
export const clarificationQuestions = () => new IntentFragment("output", "clarification-questions");
export const concreteExecution = () => new IntentFragment("assurance", "concrete-execution");
export const abstractPreflight = () => new IntentFragment("assurance", "abstract-preflight");
export const symbolicWhereSupported = () => new IntentFragment("assurance", "symbolic-where-supported");
export const symbolicDecisionCoverage = () => new IntentFragment("assurance", "symbolic-decision-coverage");
export const interpretationRobust = () => new IntentFragment("evidence", "interpretation-robust");
export const sourceGrounded = () => new IntentFragment("evidence", "source-grounded");
export const allCompatible = () => new IntentFragment("fallback", "all-compatible");

export class IntentModel {
  constructor(builder) {
    this.id = builder.id;
    this.identity = declaredIdentity("intent", builder.id);
    this.modes = Object.freeze([...builder.modes]);
    this.targets = Object.freeze([...builder.targets]);
    this.domains = Object.freeze([...builder.domainValues]);
    this.concerns = Object.freeze([...builder.concernValues]);
    this.evidence = Object.freeze([...builder.evidenceValues]);
    this.assurances = Object.freeze([...builder.assuranceValues]);
    this.outputs = Object.freeze([...builder.outputValues]);
    this.presentation = Object.freeze([...builder.presentationValues]);
    this.exclusions = Object.freeze([...builder.exclusionValues]);
    this.scope = builder.scopeValue;
    this.resourcePolicy = builder.resourcePolicyValue;
    this.fallback = builder.fallbackValue ?? allCompatible();
    this.provenance = Object.freeze([...builder.provenanceValues]);
    this.planIdentity = digestIdentity("nll.intent-plan-input", this);
    Object.freeze(this);
  }
}

export class IntentBuilder {
  constructor(id) {
    this.id = id; this.modes = []; this.targets = []; this.domainValues = []; this.concernValues = [];
    this.evidenceValues = []; this.assuranceValues = []; this.outputValues = []; this.presentationValues = [];
    this.exclusionValues = [];
    this.scopeValue = null; this.resourcePolicyValue = null; this.fallbackValue = null; this.provenanceValues = [];
  }
  mode(...values) { this.modes.push(...values); return this; }
  target(...values) { this.targets.push(...values); return this; }
  domains(...values) { this.domainValues.push(...values); return this; }
  concerns(...values) { this.concernValues.push(...values); return this; }
  evidence(...values) { this.evidenceValues.push(...values); return this; }
  assurance(...values) { this.assuranceValues.push(...values); return this; }
  outputs(...values) { this.outputValues.push(...values); return this; }
  present(...values) { this.presentationValues.push(...values); return this; }
  exclude(...values) { this.exclusionValues.push(...values); return this; }
  scope(value) { this.scopeValue = value; return this; }
  resources(value) { this.resourcePolicyValue = value; return this; }
  whenUnclear(value) { this.fallbackValue = value; return this; }
  provenance(...values) { this.provenanceValues.push(...values); return this; }
  seal() { return new IntentModel(this); }
}

export const intent = (id) => new IntentBuilder(id);
export const resourcePolicy = (options = {}) => Object.freeze({ ...options });
export const taskScope = (value) => new IntentFragment("scope", value);
