import { Finding } from "./decisions.mjs";
import { SemanticValue } from "../core/handles.mjs";

export function evidenceReference(identity) { return new SemanticValue("EvidenceReference", identity, { sort: "Evidence" }); }
export function findingResult(code, status, evidence = [], details = {}, message = null, circuit = null) {
  return new Finding({ code, status, evidence: evidence.map((value) => typeof value === "string" ? evidenceReference(value) : value), details, message, circuit });
}
export function findingSet(...findings) { return Object.freeze(findings.flat()); }
