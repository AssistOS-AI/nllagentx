function normalizeClause(clause) { return [...new Set(clause)].sort((left, right) => Math.abs(left) - Math.abs(right) || left - right); }

export class BooleanProblem {
  constructor() { this.clauses = []; this.names = new Map(); this.nextVariable = 1; }
  variable(name) { if (!this.names.has(name)) this.names.set(name, this.nextVariable++); return this.names.get(name); }
  clause(...literals) { this.clauses.push(normalizeClause(literals.flat())); return this; }
}

function simplify(clauses, literal) {
  const result = [];
  for (const clause of clauses) {
    if (clause.includes(literal)) continue;
    const reduced = clause.filter((entry) => entry !== -literal);
    if (reduced.length === 0) return null;
    result.push(reduced);
  }
  return result;
}

function dpll(clauses, assignment) {
  if (clauses.length === 0) return assignment;
  if (clauses.some((clause) => clause.length === 0)) return null;
  const unit = clauses.find((clause) => clause.length === 1)?.[0];
  if (unit) {
    const next = new Map(assignment); next.set(Math.abs(unit), unit > 0);
    const reduced = simplify(clauses, unit); return reduced === null ? null : dpll(reduced, next);
  }
  const polarity = new Map();
  for (const literal of clauses.flat()) {
    const variable = Math.abs(literal); const values = polarity.get(variable) ?? new Set(); values.add(literal > 0); polarity.set(variable, values);
  }
  const pure = [...polarity].find(([, values]) => values.size === 1);
  if (pure) {
    const literal = pure[1].has(true) ? pure[0] : -pure[0];
    const next = new Map(assignment); next.set(pure[0], literal > 0);
    return dpll(simplify(clauses, literal), next);
  }
  const variable = [...polarity.keys()].sort((a, b) => a - b)[0];
  for (const literal of [variable, -variable]) {
    const next = new Map(assignment); next.set(variable, literal > 0);
    const result = dpll(simplify(clauses, literal), next);
    if (result) return result;
  }
  return null;
}

export function solveBoolean(problem) {
  const assignment = dpll(problem.clauses.map(normalizeClause), new Map());
  const named = new Map([...problem.names].map(([name, variable]) => [name, assignment?.get(variable) ?? false]));
  return Object.freeze({ satisfiable: Boolean(assignment), assignment: assignment ?? new Map(), named });
}
