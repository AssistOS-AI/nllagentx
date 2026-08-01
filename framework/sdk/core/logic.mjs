import { SemanticValue } from "./handles.mjs";

export class LogicValue extends SemanticValue {
  constructor(name, support, refute) {
    super("LogicValue", name, { sort: "LogicValue", descriptor: { support, refute } });
  }

  support() { return this.descriptor().support; }
  refute() { return this.descriptor().refute; }
  isTrue() { return this === TRUE; }
  isFalse() { return this === FALSE; }
  isUnknown() { return this === UNKNOWN; }
  isConflict() { return this === CONFLICT; }
}

export const TRUE = new LogicValue("TRUE", true, false);
export const FALSE = new LogicValue("FALSE", false, true);
export const UNKNOWN = new LogicValue("UNKNOWN", false, false);
export const CONFLICT = new LogicValue("CONFLICT", true, true);

export function logicValue(value) {
  if (value instanceof LogicValue) return value;
  if (value === true || value === "TRUE") return TRUE;
  if (value === false || value === "FALSE") return FALSE;
  if (value === "CONFLICT") return CONFLICT;
  return UNKNOWN;
}

function fromEvidence(support, refute) {
  if (support && refute) return CONFLICT;
  if (support) return TRUE;
  if (refute) return FALSE;
  return UNKNOWN;
}

export const not = (value) => fromEvidence(logicValue(value).refute(), logicValue(value).support());
export const and = (...values) => {
  const normalized = values.map(logicValue);
  return fromEvidence(normalized.every((value) => value.support()), normalized.some((value) => value.refute()));
};
export const or = (...values) => {
  const normalized = values.map(logicValue);
  return fromEvidence(normalized.some((value) => value.support()), normalized.every((value) => value.refute()));
};
export const implies = (left, right) => or(not(left), right);
export const equivalent = (left, right) => and(implies(left, right), implies(right, left));
export const bothTrue = (left, right) => logicValue(left).support() && logicValue(right).support();
export const possiblyTrue = (value) => !logicValue(value).refute() || logicValue(value).support();

export const Logic = Object.freeze({ TRUE, FALSE, UNKNOWN, CONFLICT, not, and, or, implies, equivalent });
