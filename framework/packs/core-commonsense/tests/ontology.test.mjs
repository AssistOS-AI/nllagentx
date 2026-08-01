import test from "node:test";
import assert from "node:assert/strict";
import pack from "../pack.mjs";

test("core-commonsense ontologies are sealed and distinct", () => {
  assert.equal(pack.id, "core-commonsense");
  assert.equal(pack.ontologies.length, 6);
  assert.equal(new Set(pack.ontologies.map((ontology) => ontology.identity)).size, 6);
  assert.ok(pack.ontologies.every((ontology) => ontology.concepts.length > 0));
});
