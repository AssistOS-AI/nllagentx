import { canonicalText, digestIdentity } from "./identity.mjs";

export const HANDLE_BRAND = Symbol.for("nllAgent.semantic-handle");

function freezeDescriptor(value, seen = new Set()) {
  if (value === null || typeof value !== "object" || seen.has(value)) return value;
  if (value[HANDLE_BRAND]) return value;
  seen.add(value);
  for (const entry of Object.values(value)) freezeDescriptor(entry, seen);
  return Object.freeze(value);
}

export class SemanticHandle {
  #identity;
  #sort;
  #kind;
  #descriptor;
  #provenance;

  constructor({ identity, sort, kind, descriptor = {}, provenance = [] }) {
    if (!sort || !kind) throw new TypeError("Semantic handles require sort and kind");
    this.#sort = sort;
    this.#kind = kind;
    this.#descriptor = freezeDescriptor({ ...descriptor });
    this.#provenance = Object.freeze([...provenance]);
    this.#identity = identity ?? digestIdentity(`nll.${sort}.${kind}`, {
      descriptor: this.#descriptor,
      provenance: this.#provenance
    });
    Object.defineProperty(this, HANDLE_BRAND, { value: true });
    if (new.target === SemanticHandle) Object.freeze(this);
  }

  identity() { return this.#identity; }
  sort() { return this.#sort; }
  kind() { return this.#kind; }
  descriptor() { return this.#descriptor; }
  provenance() { return this.#provenance; }
  equals(other) { return Boolean(other?.[HANDLE_BRAND]) && other.identity() === this.#identity; }
  toString() { return `${this.#sort}<${this.#identity}>`; }
  toCanonicalText() { return canonicalText(this); }
}

export class SemanticTerm extends SemanticHandle {
  constructor(options) { super({ ...options, sort: options.sort ?? "Term" }); }
  concept() { return this.descriptor().concept; }
  bindings() { return this.descriptor().bindings ?? Object.freeze([]); }
}

export class SemanticValue extends SemanticHandle {
  constructor(kind, value, options = {}) {
    super({
      ...options,
      sort: options.sort ?? "Value",
      kind,
      descriptor: { value, ...(options.descriptor ?? {}) }
    });
  }

  value() { return this.descriptor().value; }
}

export class RoleBinding extends SemanticHandle {
  constructor(role, value) {
    super({
      sort: "RoleBinding",
      kind: "RoleBinding",
      descriptor: { role, value },
      identity: digestIdentity("nll.role-binding", { role, value })
    });
  }

  role() { return this.descriptor().role; }
  value() { return this.descriptor().value; }
}

export function isSemanticHandle(value, sort = null) {
  return Boolean(value?.[HANDLE_BRAND]) && (sort === null || value.sort() === sort);
}

export function handleIdentity(value) {
  return isSemanticHandle(value) ? value.identity() : null;
}
