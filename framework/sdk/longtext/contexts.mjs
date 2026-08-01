import { SemanticHandle, SemanticValue } from "../core/handles.mjs";
import { digestIdentity } from "../core/identity.mjs";

export class ContextBuilder {
  constructor(kind, value = null) { this.kind = kind; this.value = value; this.entries = []; }
  assume(...entries) { this.entries.push(...entries); return this; }
  include(...entries) { this.entries.push(...entries); return this; }
  seal() {
    return new SemanticHandle({
      sort: "Context",
      kind: this.kind,
      identity: digestIdentity(`nll.context.${this.kind}`, { value: this.value, entries: this.entries }),
      descriptor: { value: this.value, entries: [...this.entries] }
    });
  }
  identity() { return this.seal().identity(); }
}

export const context = (kind, value = null) => new ContextBuilder(kind, value);
export const interpretation = (id) => new ContextBuilder("Interpretation", id);
export const condition = (value) => new ContextBuilder("Condition", value);
export const exception = (value) => new ContextBuilder("Exception", value);
export const hypothetical = (value) => new ContextBuilder("Hypothetical", value);
export const reportedBy = (value) => new ContextBuilder("ReportedSpeech", value);
export const definedIn = (value) => new ContextBuilder("DefinitionScope", value);
export const appliesTo = (value) => new ContextBuilder("ApplicabilityScope", value);
export const within = (contextValue, ...entries) => new ContextBuilder("Within", contextValue).include(...entries).seal();
export const scopeClosed = (value) => new SemanticValue("ScopeStatus", `closed:${value}`, { sort: "ScopeStatus" });
export const scopeOpen = (value) => new SemanticValue("ScopeStatus", `open:${value}`, { sort: "ScopeStatus" });

export const sameEntity = (left, right, evidence = null) => new SemanticHandle({ sort: "IdentityRelation", kind: "MustAlias", descriptor: { left, right, evidence } });
export const possibleSameEntity = (left, right, evidence = null) => new SemanticHandle({ sort: "IdentityRelation", kind: "MayAlias", descriptor: { left, right, evidence } });
export const differentEntity = (left, right, evidence = null) => new SemanticHandle({ sort: "IdentityRelation", kind: "CannotAlias", descriptor: { left, right, evidence } });
export const refersTo = (mention, entity) => new SemanticHandle({ sort: "IdentityRelation", kind: "RefersTo", descriptor: { mention, entity } });
