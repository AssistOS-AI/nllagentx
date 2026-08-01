import test from "node:test";
import assert from "node:assert/strict";
import { TemporalNetwork, classifyInterval, composeAllen } from "../runtime/methods/temporal/allen.mjs";
import { transitiveClosure } from "../runtime/methods/relations/fixed-point.mjs";
import { FiniteAutomaton, monitorPattern } from "../runtime/methods/automata/automata.mjs";
import { breadthFirstReachability, detectCycle } from "../runtime/methods/transition/explore.mjs";
import { compileDecisionDag } from "../runtime/methods/decision/dag.mjs";
import { RewriteSystem, EGraphLite } from "../runtime/methods/rewrite/rewrite.mjs";
import { DependencyGraph } from "../runtime/methods/slicing/slice.mjs";
import { FactorGraph } from "../runtime/methods/factors/factor-graph.mjs";
import { exploreDecisionConditions } from "../runtime/methods/symbolic/explorer.mjs";

test("temporal path consistency composes Allen relations", () => {
  assert.equal(classifyInterval([0, 1], [2, 3]), "before"); assert.ok(composeAllen("before", "before").has("before"));
  const network = new TemporalNetwork().constrain("a", "b", "before").constrain("b", "c", "before"); assert.equal(network.close().consistent, true); assert.deepEqual([...network.possible("a", "c")], ["before"]);
});
test("fixed point, automata, and transition exploration return witnesses", () => {
  assert.deepEqual(transitiveClosure([["a", "b"], ["b", "c"]]), [["a", "b"], ["b", "c"], ["a", "c"]]);
  const automaton = new FiniteAutomaton({ initial: "q0", accepting: ["q1"], transitions: [{ from: "q0", symbol: "go", to: "q1" }] }); assert.equal(automaton.run(["go"]).accepted, true); assert.equal(monitorPattern("absence", "bad").run(["ok", "bad"]).accepted, false);
  assert.deepEqual(breadthFirstReachability({ initial: 0, successors: (x) => x < 3 ? [x + 1] : [], isGoal: (x) => x === 3 }).witness, [0, 1, 2, 3]); assert.equal(detectCycle("a", (x) => x === "a" ? ["b"] : ["a"]).cyclic, true);
});
test("decision DAG, rewriting, slicing, and factor inference preserve semantics", () => {
  const dag = compileDecisionDag(["a", "b"], (assignment) => assignment.get("a") && !assignment.get("b")); assert.equal(dag.evaluate(new Map([["a", true], ["b", false]])), true);
  const rewrite = new RewriteSystem().rule("zero", (term) => term?.op === "+" && term.right === 0, (term) => term.left, { equivalence: true }); assert.equal(rewrite.normalize({ op: "+", left: "x", right: 0 }).term, "x");
  const egraph = new EGraphLite(); egraph.union({ n: 1 }, { n: 1 }); assert.deepEqual(egraph.extract({ n: 1 }), { n: 1 });
  const graph = new DependencyGraph().addDependency("source", "middle").addDependency("middle", "finding").addDependency("irrelevant", "other"); assert.deepEqual(graph.backward("finding"), ["finding", "middle", "source"]);
  const factor = new FactorGraph().variable("x", [false, true]).factor(["x"], (x) => x ? 3 : 1).exact(); assert.equal(factor.marginals.get("x").get(true), 0.75);
});

test("symbolic decision exploration retains immutable reached outputs", () => {
  const explored = exploreDecisionConditions(["true", "false", "unknown"], {
    exclusiveGroups: [["true", "false", "unknown"]]
  });
  assert.equal(explored.guarantee, "path-complete");
  assert.equal(explored.paths.length, 3);
  assert.equal(explored.pruned, 4);

  const output = Object.freeze({ code: "REACHED_ROW", status: "SATISFIED" });
  const completed = explored.paths[0].withOutputs(output);
  const appended = completed.withOutputs(Object.freeze({ code: "SECOND", status: "UNKNOWN" }));
  assert.notEqual(completed, explored.paths[0]);
  assert.deepEqual(completed.outputs, [output]);
  assert.deepEqual(appended.outputs.map((entry) => entry.code), ["REACHED_ROW", "SECOND"]);
  assert.ok(Object.isFrozen(completed));
  assert.ok(Object.isFrozen(completed.outputs));
  assert.throws(() => completed.outputs.push(output), TypeError);
});

test("partial four-valued truth facets are at-most-one but retain the omitted conflict case", () => {
  const explored = exploreDecisionConditions(["true", "false", "unknown"], {
    atMostOneGroups: [["true", "false", "unknown"]]
  });
  assert.equal(explored.paths.length, 4);
  assert.equal(explored.pruned, 3);
  assert.ok(explored.paths.some((path) => path.path.every((entry) => entry.truth === false)));
});
