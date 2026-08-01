import test from "node:test";
import assert from "node:assert/strict";
import pack from "../pack.mjs";

test("social-interaction exposes deterministic intent signals", () => {
  const result = pack.recognizes("This source discusses request.");
  assert.equal(result.matched, true);
  assert.ok(result.matches.includes("request"));
});
