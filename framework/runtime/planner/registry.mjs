export class CapabilityRegistry {
  constructor() { this.packs = new Map(); this.circuits = new Map(); this.methods = new Map(); this.providers = new Map(); }
  registerPack(pack) { this.packs.set(pack.id, pack); for (const circuit of pack.circuits.flat()) this.registerCircuit(circuit); return this; }
  registerCircuit(circuit) {
    this.circuits.set(circuit.identity, circuit);
    for (const provision of circuit.provisions) {
      const name = provision?.name ?? (typeof provision?.identity === "function" ? provision.identity() : provision?.identity) ?? String(provision);
      if (!this.providers.has(name)) this.providers.set(name, []);
      this.providers.get(name).push(circuit);
    }
    return this;
  }
  registerMethod(method) { this.methods.set(method.id, method); return this; }
  providersFor(capability) { const name = capability?.name ?? (typeof capability?.identity === "function" ? capability.identity() : capability?.identity) ?? String(capability); return [...(this.providers.get(name) ?? [])].sort((left, right) => left.identity.localeCompare(right.identity)); }
  allCircuits() { return [...this.circuits.values()].sort((left, right) => left.identity.localeCompare(right.identity)); }
}
