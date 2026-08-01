#!/usr/bin/env node
import { readFile, readdir } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const originalsRoot = resolve(root, "design-specifications");
const officialRoot = resolve(root, "docs", "specs");
const originals = (await readdir(originalsRoot))
  .filter((name) => /^DS-\d{3}_.+\.md$/.test(name))
  .sort();
const official = (await readdir(officialRoot))
  .filter((name) => /^DS\d{3}-.+\.md$/.test(name))
  .sort();
const failures = [];

const byNumber = new Map();
for (const name of official) {
  const number = Number(name.slice(2, 5));
  if (!byNumber.has(number)) byNumber.set(number, []);
  byNumber.get(number).push(name);
}
const highest = Math.max(...byNumber.keys());
for (let number = 0; number <= highest; number += 1) {
  const names = byNumber.get(number) ?? [];
  if (names.length !== 1) failures.push(`DS${String(number).padStart(3, "0")} has ${names.length} official files`);
}

for (let index = 0; index < originals.length; index += 1) {
  const sourceName = originals[index];
  const officialNumber = index + 2;
  const officialName = (byNumber.get(officialNumber) ?? [])[0];
  if (!officialName) continue;
  const source = await readFile(resolve(originalsRoot, sourceName), "utf8");
  const document = await readFile(resolve(officialRoot, officialName), "utf8");
  const startMarker = `<!-- ORIGINAL SPECIFICATION START: ${sourceName} -->\n`;
  const endMarker = `<!-- ORIGINAL SPECIFICATION END: ${sourceName} -->`;
  const start = document.indexOf(startMarker);
  const end = document.indexOf(endMarker, start + startMarker.length);
  if (start < 0 || end < 0) {
    failures.push(`${officialName} lacks exact preservation markers for ${sourceName}`);
    continue;
  }
  const embedded = document.slice(start + startMarker.length, end);
  if (embedded !== source) failures.push(`${officialName} does not preserve ${sourceName} byte-for-byte`);
}

if (failures.length > 0) {
  throw new Error(`SPECIFICATION_FIDELITY_FAILED:\n${failures.map((failure) => `- ${failure}`).join("\n")}`);
}
console.log(`Verified ${originals.length} verbatim source specifications and ${official.length} contiguous official DS files.`);
