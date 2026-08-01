import test from "node:test";
import assert from "node:assert/strict";
import pack from "../pack.mjs";

test("biology-basic exposes deterministic intent signals", () => {
  const result = pack.recognizes("This source discusses cell.");
  assert.equal(result.matched, true);
  assert.ok(result.matches.includes("cell"));
});
