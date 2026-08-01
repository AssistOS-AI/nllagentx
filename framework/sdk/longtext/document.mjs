import { SemanticHandle } from "../core/handles.mjs";
import { SemanticCollection, sequence, setOf, bagOf, allOf, anyOf, alternatives, orderedBy, coverageSet } from "../core/collections.mjs";
import { digestIdentity } from "../core/identity.mjs";
import { Claim, ClaimBuilder, claim, groundedAt, statedBy, asserted, denied, questioned, actual, permitted, obligatory, possible, necessary, confidence } from "./claims.mjs";
import { sourceUnit, taskSource, SourceRegistry, SourceSpan, SourceUnit } from "./source.mjs";
import { coverage } from "./coverage.mjs";

export class DocumentSection extends SemanticHandle {
  constructor(id, contents) { super({ sort: "DocumentSection", kind: "Section", descriptor: { id, contents } }); }
}
export const section = (id, contents) => new DocumentSection(id, contents);

function materializeClaim(value) { return value instanceof ClaimBuilder ? value.seal() : value; }
function walk(value, output) {
  const materialized = materializeClaim(value);
  if (materialized instanceof Claim) output.claims.push(materialized);
  if (materialized instanceof SemanticCollection) for (const entry of materialized) walk(entry, output);
  if (materialized instanceof DocumentSection) walk(materialized.descriptor().contents, output);
  if (materialized?.sort?.() === "Relation") output.relations.push(materialized);
  if (materialized?.sort?.() && ["Entity", "Event", "State", "Value", "Proposition"].includes(materialized.sort())) output.terms.push(materialized);
}

export class LongTextModel {
  constructor(builder) {
    const collected = { terms: [], claims: [], relations: [] };
    for (const entry of [...builder.sections, ...builder.relations]) walk(entry, collected);
    this.id = builder.id;
    this.identity = digestIdentity("nll.longtext", {
      id: builder.id,
      sections: builder.sections,
      relations: builder.relations,
      coverage: builder.coverageValues,
      includes: builder.includes
    });
    this.sections = Object.freeze([...builder.sections]);
    this.terms = Object.freeze([...new Map(collected.terms.map((term) => [term.identity(), term])).values()]);
    this.claims = Object.freeze(collected.claims);
    this.relations = Object.freeze(collected.relations);
    this.coverage = Object.freeze([...builder.coverageValues]);
    this.includes = Object.freeze([...builder.includes]);
    Object.freeze(this);
  }
}

export class DocumentBuilder {
  constructor(id) { this.id = id; this.sections = []; this.relations = []; this.coverageValues = []; this.includes = []; }
  section(...values) { this.sections.push(...values); return this; }
  relation(...values) { this.relations.push(...values); return this; }
  coverage(...values) { this.coverageValues.push(...values); return this; }
  include(...models) { this.includes.push(...models); return this; }
  commit() { return new LongTextModel(this); }
  seal() { return this.commit(); }
}

export const describe = (id) => new DocumentBuilder(id);
export {
  claim, groundedAt, statedBy, asserted, denied, questioned, actual, permitted, obligatory, possible, necessary, confidence,
  sourceUnit, taskSource, SourceRegistry, SourceSpan, SourceUnit, coverage,
  sequence, setOf, bagOf, allOf, anyOf, alternatives, orderedBy, coverageSet
};
