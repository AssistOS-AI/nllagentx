import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { SemanticHandle } from "../core/handles.mjs";
import { digestIdentity } from "../core/identity.mjs";

function sha256(value) { return createHash("sha256").update(value).digest("hex"); }

export class SourceSpan extends SemanticHandle {
  constructor({ sourceId, sourceDigest = null, unitId, start, end, text = null, page = null, line = null }) {
    if (!sourceId || !unitId) throw new TypeError("SourceSpan requires sourceId and unitId");
    if (!Number.isInteger(start) || !Number.isInteger(end) || start < 0 || end < start) {
      throw new RangeError("SourceSpan offsets must be ordered non-negative integers");
    }
    super({
      sort: "SourceSpan",
      kind: "ExactSpan",
      identity: digestIdentity("nll.source-span", { sourceId, sourceDigest, unitId, start, end, textHash: text === null ? null : sha256(text) }),
      descriptor: { sourceId, sourceDigest, unitId, start, end, textHash: text === null ? null : sha256(text), page, line }
    });
  }
  sourceId() { return this.descriptor().sourceId; }
  unitId() { return this.descriptor().unitId; }
  start() { return this.descriptor().start; }
  end() { return this.descriptor().end; }
}

export class SourceUnit extends SemanticHandle {
  constructor(id, { sourceId = id, sourceDigest = null, start = 0, end = null, text = null, metadata = {} } = {}) {
    super({
      sort: "SourceUnit",
      kind: "SourceUnit",
      identity: digestIdentity("nll.source-unit", { id, sourceId, sourceDigest, start, end, metadata }),
      descriptor: { id, sourceId, sourceDigest, start, end, text, metadata }
    });
  }
  span(start, end) {
    const text = this.descriptor().text;
    const absoluteStart = this.descriptor().start + start;
    const absoluteEnd = this.descriptor().start + end;
    return new SourceSpan({
      sourceId: this.descriptor().sourceId,
      sourceDigest: this.descriptor().sourceDigest,
      unitId: this.descriptor().id,
      start: absoluteStart,
      end: absoluteEnd,
      text: text === null ? null : text.slice(start, end)
    });
  }
}

export class SourceRegistry {
  #sources = new Map();
  register({ id, path = null, text, units = null, metadata = {} }) {
    if (!id || typeof text !== "string") throw new TypeError("Registered sources require an id and decoded text");
    const digest = sha256(text);
    const sourceUnits = units ?? [new SourceUnit(`${id}:unit-0001`, { sourceId: id, sourceDigest: digest, text, end: text.length, metadata })];
    const source = Object.freeze({ id, path, text, digest, units: Object.freeze(sourceUnits), metadata: Object.freeze({ ...metadata }) });
    this.#sources.set(id, source);
    return source;
  }
  async registerFile(id, path, options = {}) {
    const text = await readFile(path, options.encoding ?? "utf8");
    return this.register({ id, path, text, metadata: options.metadata });
  }
  source(id) { return this.#sources.get(id) ?? null; }
  unit(id) { return [...this.#sources.values()].flatMap((source) => source.units).find((unit) => unit.descriptor().id === id) ?? null; }
  all() { return [...this.#sources.values()]; }
  verify(span) {
    const source = this.source(span.sourceId());
    if (!source) return Object.freeze({ valid: false, code: "SOURCE_UNKNOWN", span });
    if (!source.units.some((unit) => unit.descriptor().id === span.unitId())) return Object.freeze({ valid: false, code: "SOURCE_UNIT_UNKNOWN", span });
    if (span.start() < 0 || span.end() > source.text.length) return Object.freeze({ valid: false, code: "SOURCE_SPAN_OUT_OF_BOUNDS", span });
    if (span.descriptor().sourceDigest && span.descriptor().sourceDigest !== source.digest) {
      return Object.freeze({ valid: false, code: "SOURCE_DIGEST_MISMATCH", span });
    }
    const selected = source.text.slice(span.start(), span.end());
    if (span.descriptor().textHash && sha256(selected) !== span.descriptor().textHash) {
      return Object.freeze({ valid: false, code: "SOURCE_SPAN_TEXT_MISMATCH", span });
    }
    return Object.freeze({ valid: true, code: "SOURCE_SPAN_VALID", span });
  }
}

export const sourceUnit = (id, options) => new SourceUnit(id, options);
export const taskSource = (id, registry) => {
  const source = registry?.source(id);
  if (!source) return new SourceUnit(`${id}:unit-0001`, { sourceId: id });
  const spanAt = (start, end) => {
    const unit = source.units.find((candidate) => candidate.descriptor().start <= start && candidate.descriptor().end >= end);
    if (!unit) throw new Error(`Source span ${start}-${end} crosses a unit boundary in ${id}`);
    return unit.span(start - unit.descriptor().start, end - unit.descriptor().start);
  };
  return Object.freeze({
    id,
    units: source.units,
    span: spanAt,
    spanByText: (needle) => {
      const start = source.text.indexOf(needle);
      if (start < 0) throw new Error(`Text not found in source ${id}`);
      return spanAt(start, start + needle.length);
    }
  });
};
