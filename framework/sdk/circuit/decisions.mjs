import { SemanticHandle } from "../core/handles.mjs";
import { setOf } from "../core/collections.mjs";
import { digestIdentity } from "../core/identity.mjs";
import { TRUE } from "../core/logic.mjs";

export const STATUSES = Object.freeze([
  "SATISFIED", "VIOLATED", "NOT_APPLICABLE", "UNKNOWN", "CONFLICT", "ACCEPTED_EXCEPTION",
  "BLOCKED_ONTOLOGY", "BLOCKED_COVERAGE", "BLOCKED_RESOURCE", "BLOCKED_METHOD", "POSSIBLE_PROBLEM"
]);

export class EvidenceTemplate {
  constructor(references) { this.references = Object.freeze(references.flat()); Object.freeze(this); }
}
export const evidence = (...references) => new EvidenceTemplate(references);

export class Finding extends SemanticHandle {
  constructor({ code, status, evidence: evidenceValues = [], message = null, circuit = null, trace = [], interpretation = null, details = {} }) {
    if (!STATUSES.includes(status)) throw new TypeError(`Unknown finding status: ${status}`);
    super({
      sort: "Finding",
      kind: status,
      identity: digestIdentity("nll.finding", { code, status, evidence: evidenceValues, circuit, interpretation, details }),
      descriptor: { code, status, evidence: setOf(...evidenceValues), message, circuit, trace: [...trace], interpretation, details }
    });
  }
  code() { return this.descriptor().code; }
  status() { return this.descriptor().status; }
  evidence() { return this.descriptor().evidence; }
  message() { return this.descriptor().message; }
  trace() { return this.descriptor().trace; }
}

export class FindingTemplate {
  constructor(status, code, evidenceValue = null, message = null) {
    this.status = status;
    this.code = code;
    this.evidence = evidenceValue;
    this.message = message;
    Object.freeze(this);
  }
  instantiate(context = {}) {
    const references = this.evidence?.references ?? [];
    const resolved = references
      .flatMap((reference) => context.values?.get(typeof reference?.identity === "function" ? reference.identity() : reference?.identity) ?? [reference])
      .flatMap((value) => value?.evidence?.length ? value.evidence : value?.term ? [value.term] : [value]);
    return new Finding({ code: this.code, status: this.status, evidence: resolved, message: this.message, circuit: context.circuit?.identity });
  }
}

const template = (status) => (code, evidenceValue = null, message = null) => new FindingTemplate(status, code, evidenceValue, message);
export const satisfied = template("SATISFIED");
export const violated = template("VIOLATED");
export const unknown = template("UNKNOWN");
export const conflict = template("CONFLICT");
export const notApplicable = template("NOT_APPLICABLE");
export const acceptedException = template("ACCEPTED_EXCEPTION");
export const blockedOntology = template("BLOCKED_ONTOLOGY");
export const blockedCoverage = template("BLOCKED_COVERAGE");
export const blockedResource = template("BLOCKED_RESOURCE");
export const blockedMethod = template("BLOCKED_METHOD");
export const possibleProblem = template("POSSIBLE_PROBLEM");

export class DecisionRow {
  constructor(condition, result) { this.condition = condition; this.result = result; Object.freeze(this); }
}
export const when = (condition) => condition;
export const row = (condition, result) => new DecisionRow(condition, result);

export class DecisionTable extends SemanticHandle {
  constructor(id, rows, overlapPolicy, exhaustive) {
    super({ sort: "CircuitNode", kind: "DecisionTable", descriptor: { id, rows, overlapPolicy, exhaustive } });
  }
  evaluate(context) {
    const matches = this.descriptor().rows.filter((entry) => entry.condition.evaluate(context) === TRUE);
    if (matches.length === 0) return new Finding({ code: `${this.descriptor().id}.no-row`, status: "UNKNOWN", evidence: [] });
    if (matches.length > 1 && this.descriptor().overlapPolicy === "error") {
      return new Finding({ code: `${this.descriptor().id}.overlap`, status: "CONFLICT", evidence: [] });
    }
    return matches[0].result.instantiate(context);
  }
}

export class DecisionTableBuilder {
  constructor(id) { this.id = id; this.rows = []; this.overlapPolicyValue = "error"; this.exhaustiveValue = false; }
  add(...rows) { this.rows.push(...rows); return this; }
  overlapPolicy(value) { this.overlapPolicyValue = value; return this; }
  exhaustive(value = true) { this.exhaustiveValue = value; return this; }
  seal() { return new DecisionTable(this.id, this.rows, this.overlapPolicyValue, this.exhaustiveValue); }
}
export const decisionTable = (id) => new DecisionTableBuilder(id);
