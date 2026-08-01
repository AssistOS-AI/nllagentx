import { inflateRawSync, inflateSync } from "node:zlib";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { exists } from "./filesystem.mjs";

export const TEXT_SOURCE_EXTENSIONS = Object.freeze(new Set([".txt", ".md", ".cnl", ".csv", ".html"]));

function decodePdfTextBytes(bytes) {
  if (bytes.length >= 2 && bytes[0] === 0xfe && bytes[1] === 0xff) {
    const codeUnits = [];
    for (let index = 2; index + 1 < bytes.length; index += 2) codeUnits.push((bytes[index] << 8) | bytes[index + 1]);
    return String.fromCharCode(...codeUnits);
  }
  return Buffer.from(bytes).toString("latin1");
}

function readLiteralString(source, opening) {
  const bytes = []; let depth = 1; let index = opening + 1;
  while (index < source.length && depth > 0) {
    const code = source.charCodeAt(index++);
    if (code === 0x5c) {
      if (index >= source.length) break;
      const escaped = source.charCodeAt(index++);
      const named = new Map([[0x6e, 0x0a], [0x72, 0x0d], [0x74, 0x09], [0x62, 0x08], [0x66, 0x0c]]);
      if (named.has(escaped)) bytes.push(named.get(escaped));
      else if (escaped === 0x0d) { if (source.charCodeAt(index) === 0x0a) index += 1; }
      else if (escaped === 0x0a) { /* PDF line continuation */ }
      else if (escaped >= 0x30 && escaped <= 0x37) {
        let octal = String.fromCharCode(escaped);
        for (let count = 1; count < 3 && index < source.length && /[0-7]/.test(source[index]); count += 1) octal += source[index++];
        bytes.push(Number.parseInt(octal, 8) & 0xff);
      } else bytes.push(escaped);
      continue;
    }
    if (code === 0x28) { depth += 1; bytes.push(code); continue; }
    if (code === 0x29) { depth -= 1; if (depth > 0) bytes.push(code); continue; }
    bytes.push(code);
  }
  return { text: decodePdfTextBytes(bytes), end: index };
}

function extractTextOperands(content) {
  const fragments = [];
  for (const match of content.matchAll(/BT\b([\s\S]*?)\bET/g)) {
    const block = match[1]; let index = 0;
    while (index < block.length) {
      if (block[index] === "(") {
        const parsed = readLiteralString(block, index); fragments.push(parsed.text); index = parsed.end; continue;
      }
      if (block[index] === "<" && block[index + 1] !== "<") {
        const end = block.indexOf(">", index + 1);
        if (end > index) {
          const hexadecimal = block.slice(index + 1, end).replace(/\s+/g, "");
          const padded = hexadecimal.length % 2 ? `${hexadecimal}0` : hexadecimal;
          if (/^[0-9a-f]*$/i.test(padded)) fragments.push(decodePdfTextBytes(Buffer.from(padded, "hex")));
          index = end + 1; continue;
        }
      }
      index += 1;
    }
    fragments.push("\n");
  }
  return fragments.join(" ").replace(/[ \t\f\v]+/g, " ").replace(/ *\n */g, "\n").trim();
}

function inflatePdfStream(bytes, dictionary) {
  if (!/\/Filter\s*(?:\/FlateDecode|\[\s*\/FlateDecode\s*\])/.test(dictionary)) return bytes;
  try { return inflateSync(bytes); } catch (firstError) {
    try { return inflateRawSync(bytes); } catch { throw new Error(`PDF_FLATE_DECODE_FAILED: ${firstError.message}`); }
  }
}

export function extractPdfText(bytes) {
  const source = bytes.toString("latin1");
  if (!source.startsWith("%PDF-")) throw new Error("PDF_HEADER_INVALID: source does not begin with a PDF header.");
  if (/\/Encrypt\b/.test(source)) throw new Error("PDF_ENCRYPTED_UNSUPPORTED: encrypted PDFs require a task-local extractor.");
  const contentBlocks = [];
  for (const match of source.matchAll(/stream\r?\n([\s\S]*?)\r?\nendstream/g)) {
    const before = source.slice(Math.max(0, match.index - 2048), match.index);
    const dictionaryStart = before.lastIndexOf("<<");
    const dictionary = dictionaryStart >= 0 ? before.slice(dictionaryStart) : "";
    if (/\/Filter\b/.test(dictionary) && !/\/FlateDecode\b/.test(dictionary)) continue;
    const streamBytes = Buffer.from(match[1], "latin1");
    contentBlocks.push(inflatePdfStream(streamBytes, dictionary).toString("latin1"));
  }
  if (contentBlocks.length === 0) contentBlocks.push(source);
  const text = contentBlocks.map(extractTextOperands).filter(Boolean).join("\n").trim();
  if (!text) throw new Error("PDF_TEXT_UNAVAILABLE: no supported text-showing operands were found; provide a task-local extractor for scanned or custom-encoded content.");
  return Object.freeze({
    text,
    metadata: Object.freeze({ format: "pdf", extractor: "builtin-pdf-text-v1", pages: [...source.matchAll(/\/Type\s*\/Page\b/g)].length || null })
  });
}

async function taskExtractor(taskRoot, extension) {
  const path = resolve(taskRoot, "source", "extractors", `${extension.slice(1)}.extractor.mjs`);
  if (!(await exists(path))) return null;
  const url = pathToFileURL(path); url.searchParams.set("extractor", `${Date.now()}-${Math.random()}`);
  const module = await import(url.href); const extractor = module.extractSource ?? module.default;
  if (typeof extractor !== "function") throw new Error(`SOURCE_EXTRACTOR_INVALID: ${path} must export a function.`);
  return Object.freeze({ path, extractor });
}

function normalizeExtraction(value, extractor) {
  const result = typeof value === "string" ? { text: value } : value;
  if (!result || typeof result.text !== "string") throw new Error(`${extractor} must return text or an object with a text string.`);
  return Object.freeze({ text: result.text, metadata: Object.freeze({ extractor, ...(result.metadata ?? {}) }) });
}

export async function extractSourceFile(path, extension, { taskRoot } = {}) {
  const bytes = await readFile(path); const custom = taskRoot ? await taskExtractor(taskRoot, extension) : null;
  if (custom) return normalizeExtraction(await custom.extractor(Object.freeze({ path, extension, bytes, taskRoot })), `task:${custom.path}`);
  if (TEXT_SOURCE_EXTENSIONS.has(extension)) return Object.freeze({ text: bytes.toString("utf8"), metadata: Object.freeze({ extractor: "builtin-utf8-v1", format: extension.slice(1) }) });
  if (extension === ".pdf") return extractPdfText(bytes);
  throw new Error(`SOURCE_EXTRACTOR_UNAVAILABLE: add source/extractors/${extension.slice(1)}.extractor.mjs.`);
}
