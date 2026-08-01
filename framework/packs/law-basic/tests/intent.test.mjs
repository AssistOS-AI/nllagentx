import test from "node:test";
import assert from "node:assert/strict";
import pack from "../pack.mjs";

test("law-basic exposes deterministic intent signals", () => {
  const result = pack.recognizes("This source discusses must.");
  assert.equal(result.matched, true);
  assert.ok(result.matches.includes("must"));
});
