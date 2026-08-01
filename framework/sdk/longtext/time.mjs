import { SemanticHandle, SemanticValue } from "../core/handles.mjs";
import { digestIdentity } from "../core/identity.mjs";

export const named = (label) => new SemanticValue("Name", label, { sort: "Name" });
export const ClockTime = (value) => new SemanticValue("ClockTime", value, { sort: "Time" });
export const DateValue = (value) => new SemanticValue("Date", value, { sort: "Time" });
export const Duration = (magnitude, unit) => new SemanticHandle({ sort: "Duration", kind: "Duration", descriptor: { magnitude, unit } });
export const Years = (value) => Duration(value, "year");
export const Months = (value) => Duration(value, "month");
export const Days = (value) => Duration(value, "day");

export class SemanticRelation extends SemanticHandle {
  constructor(kind, left, right, details = {}) {
    super({
      sort: "Relation",
      kind,
      identity: digestIdentity(`nll.relation.${kind}`, { left, right, details }),
      descriptor: { left, right, ...details }
    });
  }
}

export const before = (left, right) => new SemanticRelation("Before", left, right);
export const after = (left, right) => new SemanticRelation("After", left, right);
export const during = (left, right) => new SemanticRelation("During", left, right);
export const overlaps = (left, right) => new SemanticRelation("Overlaps", left, right);
export const interval = (start, end) => new SemanticHandle({ sort: "Time", kind: "Interval", descriptor: { start, end } });
