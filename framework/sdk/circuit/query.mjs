import { SemanticHandle } from "../core/handles.mjs";
import { digestIdentity } from "../core/identity.mjs";
import { TRUE, FALSE, UNKNOWN, CONFLICT, logicValue } from "../core/logic.mjs";

export const variable = (concept = null, name = null) => new SemanticHandle({
  sort: "PatternVariable",
  kind: "Variable",
  identity: digestIdentity("nll.pattern-variable", { concept: (typeof concept?.identity === "function" ? concept.identity() : concept?.identity) ?? String(concept ?? "Any"), name }),
  descriptor: { concept: (typeof concept?.identity === "function" ? concept.identity() : concept?.identity) ?? concept, name }
});

export class QueryNode extends SemanticHandle {
  constructor(pattern, filters = [], alias = null) {
    super({
      sort: "CircuitNode",
      kind: "MatchQuery",
      identity: digestIdentity("nll.query.match", { pattern, filters, alias }),
      descriptor: { pattern, filters, alias }
    });
  }
  where(...filters) { return new QueryNode(this.descriptor().pattern, [...this.descriptor().filters, ...filters], this.descriptor().alias); }
  as(alias) { return new QueryNode(this.descriptor().pattern, this.descriptor().filters, alias); }
}
export const match = (pattern) => new QueryNode(pattern);

export class PredicateCondition extends SemanticHandle {
  constructor(kind, descriptor, evaluator = null) {
    super({ sort: "PredicateCondition", kind, descriptor: { ...descriptor, evaluator } });
  }
  evaluate(context) {
    const evaluator = this.descriptor().evaluator;
    return logicValue(evaluator ? evaluator(context) : UNKNOWN);
  }
  isTrue() { return new PredicateCondition("IsTrue", { operand: this }, (context) => this.evaluate(context) === TRUE); }
  isFalse() { return new PredicateCondition("IsFalse", { operand: this }, (context) => this.evaluate(context) === FALSE); }
  isUnknown() { return new PredicateCondition("IsUnknown", { operand: this }, (context) => this.evaluate(context) === UNKNOWN); }
  isConflict() { return new PredicateCondition("IsConflict", { operand: this }, (context) => this.evaluate(context) === CONFLICT); }
}

function rowsFor(value, context) {
  if (value instanceof QueryNode) return context.values?.get(value.identity()) ?? [];
  if (Array.isArray(value)) return value;
  return [value];
}

function relationCondition(kind, left, right) {
  return new PredicateCondition(kind, { left, right }, (context) => {
    const leftRows = rowsFor(left, context);
    const rightRows = rowsFor(right, context);
    if (leftRows.length === 0 || rightRows.length === 0) return UNKNOWN;
    let supported = false;
    let refuted = false;
    for (const leftRow of leftRows) {
      for (const rightRow of rightRows) {
        const relation = context.store?.relationBetween?.(kind, leftRow.term ?? leftRow, rightRow.term ?? rightRow);
        if (relation === TRUE) supported = true;
        if (relation === FALSE) refuted = true;
      }
    }
    if (supported && refuted) return CONFLICT;
    if (supported) return TRUE;
    if (refuted) return FALSE;
    return UNKNOWN;
  });
}

export const before = (left, right) => relationCondition("Before", left, right);
export const after = (left, right) => relationCondition("After", left, right);
export const overlaps = (left, right) => relationCondition("Overlaps", left, right);
export const during = (left, right) => relationCondition("During", left, right);
export const sameEntity = (left, right) => relationCondition("MustAlias", left, right);
export const mayAlias = (left, right) => relationCondition("MayAlias", left, right);
export const differentEntity = (left, right) => relationCondition("CannotAlias", left, right);

export const groundedBy = (pattern) => new PredicateCondition("GroundedBy", { pattern }, ({ row }) => row?.evidence?.length ? TRUE : UNKNOWN);
export const anySourceSpan = () => new SemanticHandle({ sort: "Pattern", kind: "AnySourceSpan" });
export const withinScope = (scope) => new PredicateCondition("WithinScope", { scope });
export const inWorld = (world) => new PredicateCondition("InWorld", { world });

export const exists = (query) => new PredicateCondition("Exists", { query }, (context) => rowsFor(query, context).length > 0);
export const notExists = (query, coverage = null) => new PredicateCondition("NotExists", { query, coverage }, (context) => {
  if (!coverage || coverage.descriptor?.().status !== "closed") return UNKNOWN;
  return rowsFor(query, context).length === 0;
});
export const none = notExists;
export const count = (query) => ({ kind: "count", query });
export const select = (...fields) => ({ kind: "select", fields });
export const project = select;
export const orderBy = (...fields) => ({ kind: "orderBy", fields });
export const groupBy = (...fields) => ({ kind: "groupBy", fields });
export const aggregate = (operation, value) => ({ kind: "aggregate", operation, value });
export const min = (value) => aggregate("min", value);
export const max = (value) => aggregate("max", value);
export const sum = (value) => aggregate("sum", value);
export const path = (relation, start, end) => ({ kind: "path", relation, start, end });
export const reachable = path;
export const closure = (relation) => ({ kind: "closure", relation });
export const bind = (variableValue, expression) => ({ kind: "bind", variable: variableValue, expression });
export const join = (...queries) => ({ kind: "join", queries });
export const on = (...conditions) => ({ kind: "on", conditions });
export const where = (...conditions) => ({ kind: "where", conditions });
export const all = (query, condition, coverage = null) => ({ kind: "all", query, condition, coverage });
