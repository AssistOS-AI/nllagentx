export function planQuery(store, query) {
  const pattern = query.descriptor().pattern;
  const constraints = [];
  if (pattern?.descriptor?.().concept) constraints.push({ kind: "type", value: pattern.descriptor().concept, estimated: store.query(pattern).length });
  for (const binding of pattern?.bindings?.() ?? []) {
    constraints.push({ kind: "role", value: binding.role().identity ?? binding.role(), bound: binding.value().sort?.() !== "PatternVariable" });
  }
  constraints.sort((left, right) => Number(Boolean(right.bound)) - Number(Boolean(left.bound)) || (left.estimated ?? Infinity) - (right.estimated ?? Infinity));
  return Object.freeze({ kind: "left-deep", constraints: Object.freeze(constraints), snapshot: store.snapshotId });
}
