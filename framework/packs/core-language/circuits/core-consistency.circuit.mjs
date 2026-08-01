import { createCheckCircuit } from "../../shared/check-runtime.mjs";
import { Finding } from "../../../sdk/circuit/decisions.mjs";

function evaluateGrounding({ store, circuit }) {
  const claims = store.allClaims();
  if (claims.length === 0) {
    return [new Finding({
      code: "CoreGroundingFinding.not-applicable", status: "NOT_APPLICABLE", circuit: circuit.identity, evidence: [],
      details: { claims: 0, grounded: 0 }
    })];
  }
  const ungrounded = claims.filter((claim) => claim.groundings().length === 0);
  const evidence = claims.flatMap((claim) => claim.groundings());
  return [new Finding({
    code: `CoreGroundingFinding.${ungrounded.length ? "missing-grounding" : "grounded"}`,
    status: ungrounded.length ? "UNKNOWN" : "SATISFIED",
    circuit: circuit.identity,
    evidence,
    details: { claims: claims.length, grounded: claims.length - ungrounded.length, ungrounded: ungrounded.map((claim) => claim.identity()) }
  })];
}

export default createCheckCircuit("core-language", "CoreGroundingFinding", [], evaluateGrounding);
