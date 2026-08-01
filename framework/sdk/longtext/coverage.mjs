import { SemanticHandle } from "../core/handles.mjs";
import { digestIdentity } from "../core/identity.mjs";

export class CoverageBuilder {
  constructor(concept) { this.concept = concept; this.scopeValue = null; this.sourceSet = []; }
  forScope(scope) { this.scopeValue = scope; return this; }
  sources(...sources) { this.sourceSet.push(...sources); return this; }
  #build(status) {
    return new SemanticHandle({
      sort: "CoverageWitness",
      kind: status,
      identity: digestIdentity("nll.coverage", { concept: this.concept, scope: this.scopeValue, sources: this.sourceSet, status }),
      descriptor: { concept: this.concept, scope: this.scopeValue, sources: [...this.sourceSet], status }
    });
  }
  complete() { return this.#build("closed"); }
  partial() { return this.#build("partial"); }
  open() { return this.#build("open"); }
}

export const coverage = (concept) => new CoverageBuilder(concept);
