import test from "node:test";
import assert from "node:assert/strict";
import pack from "../pack.mjs";
import ontology from "../ontologies/core.ontology.mjs";
import circuit from "../circuits/core-consistency.circuit.mjs";
import { SemanticStore } from "../../../runtime/store/semantic-store.mjs";
import { CircuitRunner } from "../../../runtime/circuit-runner.mjs";
import { claim, groundedAt } from "../../../sdk/longtext/claims.mjs";
import { sourceUnit } from "../../../sdk/longtext/source.mjs";

test("core-language is a real base pack with executable ontology and circuit", async () => {
  assert.equal(pack.id, "core-language"); assert.ok(ontology.concepts.length > 0); assert.ok(circuit.stages.length > 0);
  const empty = await new CircuitRunner().run(circuit, new SemanticStore().installOntology(ontology));
  assert.equal(empty.findings[0].status(), "NOT_APPLICABLE");
  const store = new SemanticStore().installOntology(ontology); const proposition = ontology.constructorFor("Proposition")();
  const unit = sourceUnit("core-source", { sourceId: "core-source", text: "grounded", end: 8 });
  store.beginTransaction("grounded").claim(claim(proposition).grounding(groundedAt(unit.span(0, 8)))).commit();
  const grounded = await new CircuitRunner().run(circuit, store);
  assert.equal(grounded.findings[0].status(), "SATISFIED");
  assert.equal(grounded.findings[0].evidence().size(), 1);
});
