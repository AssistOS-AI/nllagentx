import test from "node:test";
import assert from "node:assert/strict";
import pack from "../pack.mjs";

test("anthropology-basic exposes deterministic intent signals", () => {
  const result = pack.recognizes("This source discusses culture.");
  assert.equal(result.matched, true);
  assert.ok(result.matches.includes("culture"));
});
