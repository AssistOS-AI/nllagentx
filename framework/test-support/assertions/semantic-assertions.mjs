import assert from "node:assert/strict";

export function assertDiagnostic(run, code, { circuit = null } = {}) {
  const diagnostic = (run.diagnostics ?? []).find((entry) => (entry.code?.() ?? entry.code) === code && (!circuit || (entry.responsible?.() ?? entry.circuit) === circuit));
  assert.ok(diagnostic, `Expected diagnostic ${code}`); return diagnostic;
}
export function assertFinding(run, code, status, evidenceMinimum = 0) {
  const finding = (run.findings ?? []).find((entry) => entry.code() === code);
  assert.ok(finding, `Expected finding ${code}`); assert.equal(finding.status(), status); assert.ok(finding.evidence().size() >= evidenceMinimum); return finding;
}
export function assertSemanticIdentity(left, right) { assert.equal(left.identity(), right.identity()); }
