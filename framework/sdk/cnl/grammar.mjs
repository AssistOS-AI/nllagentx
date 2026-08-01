import { CNLFrameBuilder, literalSlot } from "./frames.mjs";

function flatten(value) {
  if (value === null || value === undefined) return "";
  if (Array.isArray(value)) return value.map(flatten).join(" | ");
  if (typeof value?.descriptor === "function") {
    const descriptor = value.descriptor();
    if (Object.hasOwn(descriptor, "value")) return String(descriptor.value);
    if (Object.hasOwn(descriptor, "values")) return descriptor.values.map(flatten).join(" | ");
    if (value.sort?.() === "SourceSpan") return `${descriptor.sourceId}:${descriptor.start}-${descriptor.end}`;
    return Object.entries(descriptor)
      .filter(([key]) => !["evaluator", "implementation"].includes(key))
      .map(([key, entry]) => `${key}=${flatten(entry)}`)
      .join("; ");
  }
  if (typeof value === "object") return Object.entries(value).map(([key, entry]) => `${key}=${flatten(entry)}`).join("; ");
  return String(value);
}

function escapeLine(value) { return value.replaceAll("\\", "\\\\").replaceAll("\n", "\\n"); }
function unescapeLine(value) { return value.replaceAll("\\n", "\n").replaceAll("\\\\", "\\"); }

export function renderCanonicalCNL(frame) {
  const lines = [`FRAME ${frame.kind()} ${escapeLine(frame.id())}`];
  for (const [name, value] of Object.entries(frame.slots()).sort(([left], [right]) => left.localeCompare(right))) {
    lines.push(`${name.toUpperCase()}: ${escapeLine(flatten(value))}`);
  }
  lines.push("END FRAME");
  return lines.join("\n");
}

export function parseCanonicalCNL(text) {
  const lines = text.trim().split(/\r?\n/);
  const header = lines.shift()?.match(/^FRAME\s+(\S+)\s+(.+)$/);
  if (!header) throw new Error("CNL_PARSE_INVALID_HEADER");
  if (lines.pop() !== "END FRAME") throw new Error("CNL_PARSE_MISSING_END");
  const builder = new CNLFrameBuilder(header[1], unescapeLine(header[2]));
  for (const line of lines) {
    const separator = line.indexOf(":");
    if (separator < 1) throw new Error(`CNL_PARSE_INVALID_SLOT: ${line}`);
    const name = line.slice(0, separator).trim().toLocaleLowerCase("en");
    builder.set(name, literalSlot(unescapeLine(line.slice(separator + 1).trim())));
  }
  return builder.seal();
}

export function frameProjection(frame) {
  return Object.freeze({
    kind: frame.kind(),
    id: frame.id(),
    slots: Object.freeze(Object.fromEntries(Object.entries(frame.slots()).map(([name, value]) => [name, flatten(value)])))
  });
}
