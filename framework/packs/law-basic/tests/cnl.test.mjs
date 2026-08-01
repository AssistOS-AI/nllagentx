import test from "node:test";
import assert from "node:assert/strict";
import pack from "../pack.mjs";
import { SemanticStore, CircuitRunner } from "../../../runtime/index.mjs";
import { renderCanonicalCNL, parseCanonicalCNL } from "../../../sdk/cnl/index.mjs";
import { compareFrames } from "../../../sdk/cnl/compare.mjs";

const generationCircuits = pack.circuits.filter(
  (circuit) => circuit.emissions.some((entry) => entry.kind === "cnl-emission")
);
for (const circuit of generationCircuits) {
  test(`law-basic ${circuit.id} CNL round-trips`, async () => {
    const result = await new CircuitRunner().run(circuit, new SemanticStore());
    assert.equal(result.frames.length, 1);
    const text = renderCanonicalCNL(result.frames[0]);
    assert.equal(compareFrames(result.frames[0], parseCanonicalCNL(text)).equivalent, true);
  });
}
