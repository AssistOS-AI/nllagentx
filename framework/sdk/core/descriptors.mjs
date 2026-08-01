import { canonicalText } from "./identity.mjs";

const descriptors = new Map();

export function registerDescriptor(descriptor) {
  if (!descriptor?.identity) throw new TypeError("Public descriptors require an identity");
  const existing = descriptors.get(descriptor.identity);
  if (existing && canonicalText(existing) !== canonicalText(descriptor)) {
    throw new Error(`Duplicate public descriptor: ${descriptor.identity}`);
  }
  if (existing) return existing;
  descriptors.set(descriptor.identity, Object.freeze({ ...descriptor }));
  return descriptors.get(descriptor.identity);
}

export function descriptor(identity) { return descriptors.get(identity) ?? null; }
export function listDescriptors() {
  return [...descriptors.values()].sort((left, right) => left.identity.localeCompare(right.identity));
}
export function clearDescriptorsForTests() { descriptors.clear(); }
