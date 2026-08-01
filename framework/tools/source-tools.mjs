import { createHash } from "node:crypto";
import { readdir, stat } from "node:fs/promises";
import { basename, extname, relative, resolve, sep } from "node:path";
import { pathToFileURL } from "node:url";
import { SourceRegistry, SourceUnit } from "../sdk/longtext/source.mjs";
import { atomicWrite, exists, jsString } from "./filesystem.mjs";
import { extractSourceFile } from "./source-extractors.mjs";

function moduleSpecifier(fromDirectory, target) { let value = relative(fromDirectory, target).split(sep).join("/"); if (!value.startsWith(".")) value = `./${value}`; return value; }

const digest = (value) => createHash("sha256").update(value).digest("hex");

export function segmentText(sourceId, text, { maxCharacters = 4000 } = {}) {
  const units = []; let start = 0; let index = 1;
  const boundaries = [...text.matchAll(/(?:\r?\n){2,}|(?<=\.)\s+(?=[A-Z])/g)].map((match) => match.index + match[0].length);
  boundaries.push(text.length);
  for (const boundary of boundaries) {
    if (boundary - start < maxCharacters && boundary !== text.length) continue;
    let cursor = start;
    while (boundary - cursor > maxCharacters) {
      let end = text.lastIndexOf("\n", cursor + maxCharacters);
      if (end <= cursor) end = cursor + maxCharacters;
      units.push(new SourceUnit(`${sourceId}:unit-${String(index++).padStart(4, "0")}`, { sourceId, sourceDigest: digest(text), start: cursor, end, text: text.slice(cursor, end) })); cursor = end;
    }
    if (boundary > cursor) units.push(new SourceUnit(`${sourceId}:unit-${String(index++).padStart(4, "0")}`, { sourceId, sourceDigest: digest(text), start: cursor, end: boundary, text: text.slice(cursor, boundary) }));
    start = boundary;
  }
  return units;
}

export async function ingestTaskSources(taskRoot, { projectRoot = resolve(taskRoot, "../../../..") } = {}) {
  const sourceRoot = resolve(taskRoot, "source"); const entries = (await readdir(sourceRoot, { withFileTypes: true })).filter((entry) => entry.isFile() && entry.name !== "source-map.mjs").sort((left, right) => left.name.localeCompare(right.name));
  const sources = []; const diagnostics = [];
  for (let index = 0; index < entries.length; index += 1) {
    const entry = entries[index]; const path = resolve(sourceRoot, entry.name); const extension = extname(entry.name).toLocaleLowerCase("en"); const sourceId = `source-${String(index + 1).padStart(3, "0")}`;
    try {
      const extraction = await extractSourceFile(path, extension, { taskRoot }); const text = extraction.text; const units = segmentText(sourceId, text);
      sources.push({ id: sourceId, path: relative(taskRoot, path), digest: digest(text), text, units, metadata: extraction.metadata });
    } catch (error) {
      const code = String(error.message).match(/^([A-Z][A-Z0-9_]+):/)?.[1] ?? "SOURCE_EXTRACTION_FAILED";
      diagnostics.push({ code, sourceId, path: relative(taskRoot, path), extension, message: error.message });
    }
  }
  const sourceSdk = moduleSpecifier(sourceRoot, resolve(projectRoot, "framework", "sdk", "longtext", "source.mjs"));
  const lines = [`import { SourceRegistry, SourceUnit } from ${jsString(sourceSdk)};`, "", "const registry = new SourceRegistry();"];
  for (const source of sources) {
    const unitCode = source.units.map((unit) => {
      const descriptor = unit.descriptor();
      return `new SourceUnit(${jsString(descriptor.id)}, { sourceId: ${jsString(source.id)}, sourceDigest: ${jsString(source.digest)}, start: ${descriptor.start}, end: ${descriptor.end}, text: ${jsString(descriptor.text)} })`;
    }).join(",\n    ");
    lines.push(`registry.register({ id: ${jsString(source.id)}, path: ${jsString(source.path)}, text: ${jsString(source.text)}, metadata: ${JSON.stringify(source.metadata)}, units: [\n    ${unitCode}\n  ] });`);
  }
  lines.push("", "export default registry;", "");
  await atomicWrite(resolve(sourceRoot, "source-map.mjs"), lines.join("\n"));
  await atomicWrite(resolve(taskRoot, "results", "source-diagnostics.md"), `# Source diagnostics\n\n${diagnostics.length ? diagnostics.map((entry) => `- \`${entry.code}\` for \`${entry.path}\`: ${entry.message}`).join("\n") : "No source extraction diagnostics."}\n`);
  return Object.freeze({ sources, diagnostics });
}

export async function loadSourceRegistry(taskRoot, options = {}) {
  const path = resolve(taskRoot, "source", "source-map.mjs");
  if (!(await exists(path))) await ingestTaskSources(taskRoot, options);
  const url = pathToFileURL(path);
  url.searchParams.set("sourceMap", `${Date.now()}-${Math.random()}`);
  return (await import(url.href)).default;
}

export function sourceOutline(registry) {
  const lines = ["# Source Outline", ""];
  for (const source of registry.all()) {
    lines.push(`## ${source.id}`, "", `Digest: \`${source.digest}\`. Characters: ${source.text.length}.`, "");
    for (const unit of source.units) { const descriptor = unit.descriptor(); lines.push(`- \`${descriptor.id}\` [${descriptor.start}, ${descriptor.end}): ${descriptor.text.trim().replace(/\s+/g, " ").slice(0, 140)}`); }
    lines.push("");
  }
  return `${lines.join("\n")}\n`;
}

export function showSource(registry, { sourceId = null, unitId = null, start = null, end = null } = {}) {
  if (unitId) { const unit = registry.unit(unitId); if (!unit) throw new Error(`SOURCE_UNIT_NOT_FOUND: ${unitId}`); return unit.descriptor().text; }
  const source = registry.source(sourceId ?? registry.all()[0]?.id); if (!source) throw new Error("SOURCE_NOT_FOUND"); return source.text.slice(start ?? 0, end ?? source.text.length);
}

export function searchSource(registry, needle, { caseSensitive = false } = {}) {
  if (!needle) throw new Error("SOURCE_SEARCH_NEEDLE_REQUIRED"); const results = [];
  for (const source of registry.all()) { const haystack = caseSensitive ? source.text : source.text.toLocaleLowerCase("en"); const target = caseSensitive ? needle : needle.toLocaleLowerCase("en"); let offset = 0; while ((offset = haystack.indexOf(target, offset)) >= 0) { results.push({ sourceId: source.id, start: offset, end: offset + needle.length, text: source.text.slice(offset, offset + needle.length) }); offset += Math.max(1, needle.length); } }
  return Object.freeze(results);
}

export async function sourceFileInfo(taskRoot) {
  const paths = await readdir(resolve(taskRoot, "source"), { withFileTypes: true });
  return Promise.all(paths.filter((entry) => entry.isFile()).map(async (entry) => { const path = resolve(taskRoot, "source", entry.name); const info = await stat(path); return { name: basename(path), bytes: info.size }; }));
}
