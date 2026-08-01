import { DiagnosticBag, NllError } from "../../sdk/core/diagnostics.mjs";
import { ClaimBuilder } from "../../sdk/longtext/claims.mjs";
import { isSemanticHandle } from "../../sdk/core/handles.mjs";

export class SemanticTransaction {
  #store;
  #staged = { ontologies: [], terms: [], claims: [], relations: [], coverage: [] };
  #diagnostics = new DiagnosticBag();
  #state = "open";

  constructor(store, label, options = {}) { this.#store = store; this.label = label; this.options = Object.freeze({ ...options }); }
  ontology(...values) { this.#assertOpen(); this.#staged.ontologies.push(...values); return this; }
  term(...values) { this.#assertOpen(); this.#staged.terms.push(...values); return this; }
  claim(...values) { this.#assertOpen(); this.#staged.claims.push(...values.map((value) => value instanceof ClaimBuilder ? value.seal() : value)); return this; }
  relation(...values) { this.#assertOpen(); this.#staged.relations.push(...values); return this; }
  coverage(...values) { this.#assertOpen(); this.#staged.coverage.push(...values); return this; }
  longText(model) {
    this.#assertOpen();
    for (const included of model.includes ?? []) this.longText(included);
    this.term(...model.terms).claim(...model.claims).relation(...model.relations).coverage(...model.coverage);
    return this;
  }
  diagnostic(code, message, options) { this.#diagnostics.add(code, message, options); return this; }
  staged() { return Object.freeze(Object.fromEntries(Object.entries(this.#staged).map(([key, values]) => [key, Object.freeze([...values])]))); }
  validate() {
    for (const term of this.#staged.terms) if (!isSemanticHandle(term)) this.#diagnostics.add("STORE_INVALID_TERM", "A staged term is not a semantic handle", { responsible: term });
    for (const claim of this.#staged.claims) {
      if (typeof claim?.identity !== "function" || typeof claim?.proposition !== "function" || typeof claim?.groundings !== "function") { this.#diagnostics.add("STORE_INVALID_CLAIM", "A staged claim does not implement the Claim contract", { responsible: claim }); continue; }
      if (claim.groundings().length === 0 && !this.options.allowUngrounded) {
        this.#diagnostics.add("LONGTEXT_UNGROUNDED_CLAIM", `Claim ${claim.identity()} has no source grounding`, { responsible: claim });
      }
    }
    for (const relation of this.#staged.relations) if (typeof relation?.kind !== "function" || typeof relation?.descriptor !== "function") this.#diagnostics.add("STORE_INVALID_RELATION", "A staged relation does not implement the relation contract", { responsible: relation });
    for (const witness of this.#staged.coverage) if (witness?.sort?.() !== "CoverageWitness") this.#diagnostics.add("STORE_INVALID_COVERAGE", "A staged coverage value is not a CoverageWitness", { responsible: witness });
    return this.#diagnostics.all();
  }
  commit() {
    this.#assertOpen();
    const diagnostics = this.validate();
    if (diagnostics.some((item) => item.severity() === "error")) {
      this.#state = "failed";
      throw new NllError(`Transaction ${this.label} failed`, diagnostics);
    }
    this.#state = "committed";
    return this.#store._commit(this);
  }
  rollback() { this.#assertOpen(); this.#state = "rolled-back"; }
  state() { return this.#state; }
  #assertOpen() { if (this.#state !== "open") throw new Error(`Transaction ${this.label} is ${this.#state}`); }
}
