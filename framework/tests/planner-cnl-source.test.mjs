import test from "node:test";
import assert from "node:assert/strict";
import facilityPack from "../../examples/packs/facility.pack.mjs";
import facilityCircuit from "../../examples/circuits/facility-order.circuit.mjs";
import { CapabilityRegistry } from "../runtime/planner/registry.mjs";
import { CapabilityPlanner } from "../runtime/planner/capability-search.mjs";
import { SemanticStore } from "../runtime/store/semantic-store.mjs";
import facilityOntology from "../../examples/ontologies/facility.ontology.mjs";
import { findingFrame, literalSlot } from "../sdk/cnl/frames.mjs";
import { renderCanonicalCNL, parseCanonicalCNL, frameProjection } from "../sdk/cnl/grammar.mjs";
import { SourceRegistry, SourceUnit, taskSource } from "../sdk/longtext/source.mjs";

test("capability planner closes dependencies and reports missing providers", () => {
  const registry = new CapabilityRegistry().registerPack(facilityPack); const store = new SemanticStore().installOntology(facilityOntology); const planner = new CapabilityPlanner(registry);
  assert.deepEqual(planner.plan({ requested: ["FacilityOrderFinding"], store }).circuits.map((entry) => entry.identity), [facilityCircuit.identity]);
  assert.equal(planner.plan({ requested: ["Nonexistent"], store }).blocked[0].code, "PLAN_NO_PROVIDER");
});
test("CNL canonical render/parse is semantically stable", () => {
  const frame = findingFrame("case").set("status", literalSlot("UNKNOWN")).set("message", literalSlot("Needs evidence")).seal(); const parsed = parseCanonicalCNL(renderCanonicalCNL(frame)); assert.deepEqual(frameProjection(parsed), frameProjection(frame));
});
test("source anchors verify digest, unit, bounds, and exact text", () => {
  const registry = new SourceRegistry(); const source = registry.register({ id: "s", text: "alpha beta" }); assert.equal(registry.verify(source.units[0].span(0, 5)).valid, true);
  assert.equal(registry.verify(source.units[0].span(0, 20)).code, "SOURCE_SPAN_OUT_OF_BOUNDS");
  const segmented = new SourceRegistry(); segmented.register({ id: "long", text: "alpha beta", units: [new SourceUnit("long:u1", { sourceId: "long", start: 0, end: 6, text: "alpha " }), new SourceUnit("long:u2", { sourceId: "long", start: 6, end: 10, text: "beta" })] });
  assert.equal(taskSource("long", segmented).spanByText("beta").unitId(), "long:u2");
});
