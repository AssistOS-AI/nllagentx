import test from "node:test";
import assert from "node:assert/strict";
import pack from "../pack.mjs";
import { SemanticStore, CircuitRunner } from "../../../runtime/index.mjs";
import { describe, section, claim, groundedAt, sourceUnit, sequence } from "../../../sdk/longtext/index.mjs";

const checkCircuits = pack.circuits.filter(
  (circuit) => circuit.emissions.some((entry) => entry.kind === "finding-emission")
);
for (const circuit of checkCircuits) {
  test(`sociology-basic ${circuit.id} executes with grounded applicable evidence`, async () => {
    const store = new SemanticStore();
    for (const ontology of pack.ontologies) store.installOntology(ontology);
    const requiredIdentity = circuit.requirements[0]?.identity;
    const ontology = pack.ontologies.find(
      (candidate) => candidate.concepts.some((concept) => concept.identity === requiredIdentity)
    );
    assert.ok(ontology, `Missing ontology for ${requiredIdentity}`);
    const definition = ontology.concepts.find((concept) => concept.identity === requiredIdentity);
    const term = ontology.constructorFor(definition.name)();
    const unit = sourceUnit("fixture", { sourceId: "fixture", text: "grounded semantic fixture" });
    const model = describe("fixture")
      .section(section("body", sequence(claim(term).grounding(groundedAt(unit.span(0, 8))))))
      .commit();
    store.beginTransaction("fixture").longText(model).commit();
    const result = await new CircuitRunner().run(circuit, store);
    assert.equal(result.findings.length, 1);
    assert.notEqual(result.findings[0].status(), "NOT_APPLICABLE");
    assert.ok(result.findings[0].evidence().size() > 0);
  });
}
