export class AssuranceRequest {
  constructor(kind, options = {}) { this.kind = kind; this.options = Object.freeze({ ...options }); Object.freeze(this); }
}
export const abstractPreflight = (options) => new AssuranceRequest("abstract-preflight", options);
export const symbolicDecisionCoverage = (options) => new AssuranceRequest("symbolic-decision-coverage", options);
export const concreteExecution = (options) => new AssuranceRequest("concrete-execution", options);
export const constraintProof = (options) => new AssuranceRequest("constraint-proof", options);
export const boundedCounterexampleSearch = (options) => new AssuranceRequest("bounded-counterexample-search", options);
export const cnlRoundTrip = (options) => new AssuranceRequest("cnl-roundtrip", options);
