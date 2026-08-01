import { QueryNode, PredicateCondition } from "../../sdk/circuit/query.mjs";
import { TRUE } from "../../sdk/core/logic.mjs";

export function executeQuery(store, query, options = {}) {
  if (!(query instanceof QueryNode)) throw new TypeError("executeQuery requires a CircuitJS match query");
  let rows = store.query(query.descriptor().pattern);
  for (const filter of query.descriptor().filters) {
    if (!(filter instanceof PredicateCondition)) continue;
    rows = rows.filter((row) => filter.evaluate({ store, row, options }) === TRUE);
  }
  return rows;
}

export function referenceScan(store, pattern) {
  return store.allTerms().filter((term) => store.query(pattern).some((row) => row.term.identity() === term.identity()));
}
