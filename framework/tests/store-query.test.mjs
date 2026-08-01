import test from "node:test";
import assert from "node:assert/strict";
import ontology, { Person, Gate, Open, actor, theme } from "../../examples/ontologies/facility.ontology.mjs";
import longText from "../../examples/longtexts/facility-task.longtext.mjs";
import { SemanticStore } from "../runtime/store/semantic-store.mjs";
import { variable, match } from "../sdk/circuit/query.mjs";
import { executeQuery, referenceScan } from "../runtime/query/execute.mjs";
import { planQuery } from "../runtime/query/planner.mjs";

test("transaction materializes indexed terms, claims, roles, provenance, and coverage", () => {
  const store = new SemanticStore({ id: "store-test" }).installOntology(ontology); const transaction = store.beginTransaction("fixture").longText(longText); const commit = transaction.commit();
  assert.equal(transaction.state(), "committed"); assert.equal(commit.counts.claims, 2); assert.equal(store.allCoverage().length, 2);
  const open = store.query(Open(theme(variable(Gate))))[0].term; assert.equal(store.targets(open, actor).length, 1); assert.equal(store.claimsAbout(open).length, 1); assert.ok(store.grounding(open).length > 0);
});

test("optimized query agrees with reference scan and creates a stable plan", () => {
  const store = new SemanticStore({ id: "query-test" }).installOntology(ontology); store.beginTransaction("fixture").longText(longText).commit();
  const query = match(Open(theme(variable(Gate))).as?.("unused") ?? Open(theme(variable(Gate))));
  const actualQuery = query.descriptor ? query : match(query); const rows = executeQuery(store, actualQuery); const scan = referenceScan(store, actualQuery.descriptor().pattern);
  assert.deepEqual(rows.map((row) => row.term.identity()), scan.map((term) => term.identity())); assert.equal(planQuery(store, actualQuery).kind, "left-deep");
});

test("failed ungrounded transaction is atomic", () => {
  const store = new SemanticStore({ id: "atomicity" }).installOntology(ontology); const proposition = Person("No source");
  const fakeClaim = { identity: () => "fake", proposition: () => proposition, groundings: () => [], descriptor: () => ({}) };
  assert.throws(() => store.beginTransaction("bad").claim(fakeClaim).commit(), /failed/); assert.equal(store.allClaims().length, 0);
});
