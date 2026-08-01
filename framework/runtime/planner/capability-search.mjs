function requirementName(requirement) { return requirement?.name ?? (typeof requirement?.identity === "function" ? requirement.identity() : requirement?.identity) ?? String(requirement); }
function costValue(circuit) { return { low: 1, medium: 10, high: 100 }[circuit.cost] ?? 10; }

export class CapabilityPlanner {
  constructor(registry) { this.registry = registry; }
  plan({ requested = [], store, allCompatible = false, allowedCircuits = null }) {
    const selected = new Map(); const rejected = []; const blocked = []; const visiting = new Set();
    const available = new Set([...store.capabilities().keys()]);
    const candidates = allowedCircuits ?? this.registry.allCircuits();

    const satisfy = (requirement, chain = []) => {
      const name = requirementName(requirement);
      if (available.has(name) || store.hasConcept(name)) return true;
      if (visiting.has(name)) { blocked.push({ capability: name, code: "PLAN_CAPABILITY_CYCLE", chain: [...chain, name] }); return false; }
      visiting.add(name);
      const providers = this.registry.providersFor(name).filter((provider) => candidates.includes(provider)).sort((left, right) => costValue(left) - costValue(right) || left.identity.localeCompare(right.identity));
      for (const provider of providers) {
        if (provider.requirements.every((child) => satisfy(child, [...chain, name]))) {
          selected.set(provider.identity, provider); for (const provision of provider.provisions) available.add(requirementName(provision)); visiting.delete(name); return true;
        }
        rejected.push({ circuit: provider.identity, reason: "unmet-requirement", capability: name });
      }
      visiting.delete(name); blocked.push({ capability: name, code: "PLAN_NO_PROVIDER", chain }); return false;
    };

    for (const requirement of requested) satisfy(requirement);
    if (allCompatible) {
      let changed = true;
      while (changed) {
        changed = false;
        for (const circuit of candidates) {
          if (selected.has(circuit.identity)) continue;
          const before = blocked.length;
          if (circuit.requirements.every((requirement) => satisfy(requirement, [circuit.identity]))) {
            selected.set(circuit.identity, circuit); for (const provision of circuit.provisions) available.add(requirementName(provision)); changed = true;
          } else {
            blocked.splice(before);
          }
        }
      }
      for (const circuit of candidates) if (!selected.has(circuit.identity)) rejected.push({ circuit: circuit.identity, reason: "incompatible-with-current-store" });
    }
    const circuits = [...selected.values()].sort((left, right) => left.identity.localeCompare(right.identity));
    return Object.freeze({ circuits: Object.freeze(circuits), available: Object.freeze([...available].sort()), rejected: Object.freeze(rejected), blocked: Object.freeze(blocked), complete: blocked.length === 0 });
  }
}
