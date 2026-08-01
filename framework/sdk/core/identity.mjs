import { createHash } from "node:crypto";

function escapeText(value) {
  return value.replaceAll("\\", "\\\\").replaceAll("|", "\\|").replaceAll(":", "\\:");
}

function encodeObject(value, seen) {
  if (seen.has(value)) {
    throw new TypeError("Canonical identity cannot contain cyclic objects");
  }

  seen.add(value);
  const entries = Object.entries(value)
    .filter(([, entry]) => entry !== undefined)
    .sort(([left], [right]) => left.localeCompare(right));
  const encoded = entries
    .map(([key, entry]) => `${escapeText(key)}:${canonicalText(entry, seen)}`)
    .join("|");
  seen.delete(value);
  return `object(${encoded})`;
}

export function canonicalText(value, seen = new Set()) {
  if (value === null) return "null";
  if (value === undefined) return "undefined";
  if (typeof value === "string") return `string:${escapeText(value)}`;
  if (typeof value === "boolean") return value ? "boolean:true" : "boolean:false";
  if (typeof value === "bigint") return `bigint:${value}`;
  if (typeof value === "number") {
    if (!Number.isFinite(value)) return `number:${String(value)}`;
    return `number:${Object.is(value, -0) ? "-0" : String(value)}`;
  }
  if (typeof value === "function") return `function:${value.name || "anonymous"}`;
  if (typeof value.identity === "function") return `handle:${value.identity()}`;
  if (Array.isArray(value)) return `array(${value.map((item) => canonicalText(item, seen)).join("|")})`;
  if (value instanceof Set) {
    return `set(${[...value].map((item) => canonicalText(item, seen)).sort().join("|")})`;
  }
  if (value instanceof Map) {
    const entries = [...value.entries()]
      .map(([key, entry]) => `${canonicalText(key, seen)}:${canonicalText(entry, seen)}`)
      .sort();
    return `map(${entries.join("|")})`;
  }
  if (value instanceof Date) return `date:${value.toISOString()}`;
  if (typeof value === "object") return encodeObject(value, seen);
  return `${typeof value}:${escapeText(String(value))}`;
}

export function digestIdentity(namespace, value) {
  const digest = createHash("sha256")
    .update(namespace)
    .update("\0")
    .update(canonicalText(value))
    .digest("hex");
  return `${namespace}:${digest}`;
}

export function declaredIdentity(namespace, localName, version = null) {
  if (!namespace || !localName) throw new TypeError("Declared identities require namespace and local name");
  return version ? `${namespace}:${localName}@${version}` : `${namespace}:${localName}`;
}

export function shortIdentity(identity, length = 12) {
  const suffix = identity.includes(":") ? identity.slice(identity.lastIndexOf(":") + 1) : identity;
  return suffix.slice(0, length);
}
