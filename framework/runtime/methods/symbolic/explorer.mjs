import { BooleanProblem, solveBoolean } from "../constraints/boolean.mjs";

export class SymbolicState {
  constructor({ stage = 0, bindings = new Map(), path = [], outputs = [] } = {}) {
    this.stage = stage;
    this.bindings = new Map(bindings);
    this.path = Object.freeze([...path]);
    this.outputs = Object.freeze([...outputs]);
    Object.freeze(this);
  }
  fork(condition, truth) {
    return new SymbolicState({
      stage: this.stage + 1,
      bindings: this.bindings,
      path: [...this.path, { condition, truth }],
      outputs: this.outputs
    });
  }
  withOutputs(...outputs) {
    return new SymbolicState({ stage: this.stage, bindings: this.bindings, path: this.path, outputs: [...this.outputs, ...outputs] });
  }
}

function constrainAtMostOne(problem, group) {
  const variables = group.map((condition) => problem.variable(condition));
  for (let left = 0; left < variables.length; left += 1) {
    for (let right = left + 1; right < variables.length; right += 1) problem.clause(-variables[left], -variables[right]);
  }
  return variables;
}

function feasible(path, exclusiveGroups = [], atMostOneGroups = []) {
  const problem = new BooleanProblem();
  for (const { condition, truth } of path) { const variable = problem.variable(condition); problem.clause(truth ? variable : -variable); }
  for (const group of exclusiveGroups) {
    const variables = constrainAtMostOne(problem, group);
    problem.clause(variables);
  }
  for (const group of atMostOneGroups) constrainAtMostOne(problem, group);
  return solveBoolean(problem).satisfiable;
}

export function exploreDecisionConditions(conditions, { maxPaths = 1024, strategy = "depth-first", exclusiveGroups = [], atMostOneGroups = [] } = {}) {
  const pending = [new SymbolicState()]; const complete = []; let pruned = 0;
  while (pending.length && complete.length < maxPaths) {
    const state = strategy === "breadth-first" ? pending.shift() : pending.pop();
    if (state.stage >= conditions.length) { complete.push(state); continue; }
    const condition = conditions[state.stage];
    for (const truth of [false, true]) {
      const next = state.fork(condition, truth);
      if (feasible(next.path, exclusiveGroups, atMostOneGroups)) pending.push(next); else pruned += 1;
    }
  }
  return Object.freeze({ paths: Object.freeze(complete), pruned, truncated: pending.length > 0, guarantee: pending.length ? "bounded" : "path-complete" });
}

export function concolicNegations(path) {
  return path.map((entry, index) => Object.freeze(path.map((candidate, candidateIndex) => candidateIndex === index ? { ...candidate, truth: !candidate.truth } : candidate)));
}
