function stableValues(values) { return [...values].sort((left, right) => String(left).localeCompare(String(right))); }

export class FiniteDomainProblem {
  constructor() { this.variables = new Map(); this.constraints = []; }
  variable(name, domain) { const values = new Set(domain); if (values.size === 0) throw new Error("CONSTRAINT_EMPTY_DOMAIN"); this.variables.set(name, values); return this; }
  constraint(variables, predicate, id = `constraint-${this.constraints.length}`) { this.constraints.push(Object.freeze({ id, variables: [...variables], predicate })); return this; }
  clone() { const copy = new FiniteDomainProblem(); for (const [name, domain] of this.variables) copy.variables.set(name, new Set(domain)); copy.constraints = [...this.constraints]; return copy; }
}

function consistentPartial(problem, assignment) {
  return problem.constraints.every((constraint) => {
    const values = constraint.variables.map((name) => assignment.get(name));
    if (values.some((value) => value === undefined)) return true;
    return Boolean(constraint.predicate(...values));
  });
}

export function propagateFiniteDomains(problem) {
  const reduced = problem.clone();
  let changed = true;
  while (changed) {
    changed = false;
    for (const constraint of reduced.constraints) {
      for (const variable of constraint.variables) {
        const domain = reduced.variables.get(variable);
        for (const value of [...domain]) {
          const assignment = new Map([[variable, value]]);
          const remaining = constraint.variables.filter((name) => name !== variable);
          const supported = searchSupport(reduced, constraint, remaining, assignment, 0);
          if (!supported) { domain.delete(value); changed = true; }
        }
        if (domain.size === 0) return Object.freeze({ satisfiable: false, problem: reduced, reason: constraint.id });
      }
    }
  }
  return Object.freeze({ satisfiable: true, problem: reduced });
}

function searchSupport(problem, constraint, variables, assignment, index) {
  if (index === variables.length) return constraint.predicate(...constraint.variables.map((name) => assignment.get(name)));
  const variable = variables[index];
  for (const value of stableValues(problem.variables.get(variable))) {
    assignment.set(variable, value);
    if (searchSupport(problem, constraint, variables, assignment, index + 1)) return true;
  }
  assignment.delete(variable);
  return false;
}

export function solveFiniteDomains(problem, { all = false, objective = null } = {}) {
  const propagated = propagateFiniteDomains(problem);
  if (!propagated.satisfiable) return Object.freeze({ satisfiable: false, models: Object.freeze([]), reason: propagated.reason });
  const models = [];
  let best = Infinity;
  function search(assignment) {
    if (!consistentPartial(propagated.problem, assignment)) return;
    if (assignment.size === propagated.problem.variables.size) {
      const score = objective ? objective(assignment) : 0;
      if (score < best) { best = score; models.length = 0; }
      if (score === best) models.push(new Map(assignment));
      return;
    }
    const [name, domain] = [...propagated.problem.variables.entries()]
      .filter(([candidate]) => !assignment.has(candidate))
      .sort((left, right) => left[1].size - right[1].size || left[0].localeCompare(right[0]))[0];
    for (const value of stableValues(domain)) {
      assignment.set(name, value); search(assignment); assignment.delete(name);
      if (!all && models.length > 0 && !objective) return;
    }
  }
  search(new Map());
  return Object.freeze({ satisfiable: models.length > 0, models: Object.freeze(models), cost: best === Infinity ? null : best });
}
