export function resolveProfile(profile, registry, { inferredPacks = [], explicitPacks = [], excludedPacks = [], allCompatible = false } = {}) {
  const selectedIds = new Set(); const reasons = new Map();
  for (const directive of profile?.packs ?? []) if (directive.kind === "use-pack") { selectedIds.add(directive.value); reasons.set(directive.value, "profile"); }
  for (const id of inferredPacks) if (!excludedPacks.includes(id)) { selectedIds.add(id); reasons.set(id, "source-signal"); }
  for (const id of explicitPacks) { selectedIds.add(id); reasons.set(id, "explicit"); }
  if (allCompatible || profile?.packs?.some((entry) => entry.kind === "use-every-compatible-pack")) for (const id of registry.packs.keys()) { selectedIds.add(id); reasons.set(id, "all-compatible"); }
  for (const id of excludedPacks) { selectedIds.delete(id); reasons.set(id, "excluded"); }
  let changed = true;
  while (changed) {
    changed = false;
    for (const id of [...selectedIds]) for (const requirement of registry.packs.get(id)?.requirements ?? []) {
      const requirementId = requirement.id ?? requirement.value ?? String(requirement);
      if (!selectedIds.has(requirementId)) { selectedIds.add(requirementId); reasons.set(requirementId, `required-by:${id}`); changed = true; }
    }
  }
  const conflicts = [];
  for (const id of selectedIds) for (const incompatible of registry.packs.get(id)?.incompatibilities ?? []) if (selectedIds.has(incompatible.id ?? incompatible)) conflicts.push([id, incompatible.id ?? incompatible]);
  const packs = [...selectedIds].map((id) => registry.packs.get(id)).filter(Boolean).sort((left, right) => left.id.localeCompare(right.id));
  return Object.freeze({ profile: profile?.id ?? null, packs: Object.freeze(packs), reasons, conflicts: Object.freeze(conflicts), valid: conflicts.length === 0 });
}
