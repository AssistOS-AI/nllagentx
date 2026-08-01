import { SemanticHandle } from "./handles.mjs";
import { digestIdentity } from "./identity.mjs";

export class Diagnostic extends SemanticHandle {
  constructor(code, message, { severity = "error", responsible = null, details = {}, suggestions = [] } = {}) {
    super({
      sort: "Diagnostic",
      kind: severity,
      identity: digestIdentity("nll.diagnostic", { code, message, responsible, details }),
      descriptor: { code, message, severity, responsible, details, suggestions: [...suggestions] }
    });
  }

  code() { return this.descriptor().code; }
  message() { return this.descriptor().message; }
  severity() { return this.descriptor().severity; }
}

export class DiagnosticBag {
  #items = [];
  add(codeOrDiagnostic, message, options) {
    const diagnostic = codeOrDiagnostic instanceof Diagnostic
      ? codeOrDiagnostic
      : new Diagnostic(codeOrDiagnostic, message, options);
    this.#items.push(diagnostic);
    return diagnostic;
  }
  all() { return [...this.#items]; }
  errors() { return this.#items.filter((item) => item.severity() === "error"); }
  warnings() { return this.#items.filter((item) => item.severity() === "warning"); }
  hasErrors() { return this.errors().length > 0; }
  merge(items) { for (const item of items) this.add(item); return this; }
}

export class NllError extends Error {
  constructor(message, diagnostics = []) {
    super(message);
    this.name = "NllError";
    this.diagnostics = Object.freeze([...diagnostics]);
  }
}

export function diagnostic(code, message, options) {
  return new Diagnostic(code, message, options);
}
