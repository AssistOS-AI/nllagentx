import test from "node:test";
import assert from "node:assert/strict";
import { TRUE, FALSE, UNKNOWN, CONFLICT, and, or, not, implies } from "../sdk/core/logic.mjs";
import { setOf, bagOf, sequence, alternatives } from "../sdk/core/collections.mjs";
import { ontology, entityKind, eventKind, role, requires, exactlyOne } from "../sdk/ontology/ontology.mjs";
import { checkSdkSurfaces, sdkSurfaces, sdkUsage } from "../sdk/public-api.mjs";
import { helpText } from "../cli/help.mjs";

test("four-valued logic preserves unknown and conflict", () => {
  assert.equal(and(TRUE, UNKNOWN), UNKNOWN); assert.equal(and(TRUE, CONFLICT), CONFLICT);
  assert.equal(or(FALSE, UNKNOWN), UNKNOWN); assert.equal(or(FALSE, CONFLICT), CONFLICT);
  assert.equal(not(CONFLICT), CONFLICT); assert.equal(implies(TRUE, FALSE), FALSE);
});

test("semantic collections implement set, bag, sequence, and alternatives", () => {
  assert.equal(setOf("b", "a", "a").size(), 2); assert.equal(bagOf("a", "a").size(), 2);
  assert.deepEqual([...sequence("a", "b")], ["a", "b"]); assert.equal(alternatives("x", "y").kind(), "Alternatives");
});

test("OntologyJS enforces role cardinality/range and offers diagnostic construction", () => {
  const O = ontology("test.cardinality", "1.0.0"); const Person = O.entity(entityKind("Person")); const Door = O.entity(entityKind("Door"));
  const actor = O.role(role("actor").range(Person)); const Open = O.event(eventKind("Open").role(requires(actor, exactlyOne()))); const sealed = O.seal();
  const person = Person("Ada"); assert.equal(Open(actor(person)).sort(), "Event");
  assert.throws(() => Open(), /ONTOLOGY_CARDINALITY_MINIMUM/); assert.throws(() => Open(actor(Door("D"))), /ONTOLOGY_ROLE_RANGE/);
  assert.equal(sealed.tryConstruct("Open").diagnostics[0].code, "ONTOLOGY_CARDINALITY_MINIMUM");
});

test("public SDK surfaces and usage examples reference live local exports", () => {
  const checked = checkSdkSurfaces();
  assert.equal(checked.valid, true);
  assert.equal(checked.surfaces, 9);
  assert.ok(checked.exports > 300);
  assert.match(sdkUsage("ontology"), /framework\/sdk\/ontology\/index\.mjs/);
  assert.throws(() => sdkUsage("missing-surface"), /SDK_SURFACE_UNKNOWN/);
  for (const surface of sdkSurfaces) assert.match(helpText, new RegExp(`\\b${surface.id}\\b`));
});
