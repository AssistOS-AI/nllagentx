import test from "node:test";
import assert from "node:assert/strict";
import { Rational, lcm } from "../runtime/methods/constraints/rational.mjs";
import { FiniteDomainProblem, solveFiniteDomains } from "../runtime/methods/constraints/finite-domain.mjs";
import { DifferenceConstraints } from "../runtime/methods/constraints/difference.mjs";
import { BooleanProblem, solveBoolean } from "../runtime/methods/constraints/boolean.mjs";
import { UnionFind } from "../runtime/methods/constraints/union-find.mjs";

test("exact rational arithmetic normalizes and rejects zero division", () => {
  assert.equal(Rational.parse("0.50").add(new Rational(1, 4)).toString(), "3/4"); assert.equal(lcm(6, 8), 24n); assert.throws(() => new Rational(1, 0), /RATIONAL_DIVISION_BY_ZERO/);
});
test("finite-domain propagation and search find every bounded model", () => {
  const problem = new FiniteDomainProblem().variable("x", [1, 2, 3]).variable("y", [1, 2, 3]).constraint(["x", "y"], (x, y) => x < y, "ordered");
  const result = solveFiniteDomains(problem, { all: true }); assert.equal(result.satisfiable, true); assert.deepEqual(result.models.map((model) => [model.get("x"), model.get("y")]), [[1, 2], [1, 3], [2, 3]]);
});
test("difference, Boolean, and equality kernels report conflicts", () => {
  assert.equal(new DifferenceConstraints().upper("x", 0).lower("x", 1).solve().satisfiable, false);
  const boolean = new BooleanProblem(); const x = boolean.variable("x"); boolean.clause(x).clause(-x); assert.equal(solveBoolean(boolean).satisfiable, false);
  const equalities = new UnionFind(); equalities.disequal("a", "b"); assert.throws(() => equalities.union("a", "b"), /CONSTRAINT_EQUALITY_DISEQUALITY_CONFLICT/);
});
