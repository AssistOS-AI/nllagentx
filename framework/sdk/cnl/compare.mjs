import { frameProjection } from "./grammar.mjs";

export function compareFrames(left, right) {
  const leftProjection = frameProjection(left);
  const rightProjection = frameProjection(right);
  const differences = [];
  if (leftProjection.kind !== rightProjection.kind) differences.push({ slot: "kind", left: leftProjection.kind, right: rightProjection.kind });
  if (leftProjection.id !== rightProjection.id) differences.push({ slot: "id", left: leftProjection.id, right: rightProjection.id });
  for (const key of new Set([...Object.keys(leftProjection.slots), ...Object.keys(rightProjection.slots)])) {
    if (leftProjection.slots[key] !== rightProjection.slots[key]) {
      differences.push({ slot: key, left: leftProjection.slots[key], right: rightProjection.slots[key] });
    }
  }
  return Object.freeze({ equivalent: differences.length === 0, differences: Object.freeze(differences) });
}

export function roundTripFrame(frame, render, parse) {
  const text = render(frame);
  const parsed = parse(text);
  return Object.freeze({ text, parsed, comparison: compareFrames(frame, parsed) });
}
