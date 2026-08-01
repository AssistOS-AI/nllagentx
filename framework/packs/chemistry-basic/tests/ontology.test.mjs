import test from "node:test";
import assert from "node:assert/strict";
import pack from "../pack.mjs";

test("chemistry-basic ontologies are sealed and distinct", () => {
  assert.equal(pack.id, "chemistry-basic");
  assert.equal(pack.ontologies.length, 7);
  assert.equal(new Set(pack.ontologies.map((ontology) => ontology.identity)).size, 7);
  assert.ok(pack.ontologies.every((ontology) => ontology.concepts.length > 0));
});
