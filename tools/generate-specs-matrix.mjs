#!/usr/bin/env node
import { readdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, ".."); const specificationsRoot = resolve(root, "docs", "specs");
function metadata(markdown) {
  const end = markdown.indexOf("\n---\n", 4); if (!markdown.startsWith("---\n") || end < 0) throw new Error("SPEC_FRONTMATTER_REQUIRED");
  return Object.fromEntries(markdown.slice(4, end).trim().split("\n").map((line) => { const separator = line.indexOf(":"); return [line.slice(0, separator), line.slice(separator + 1).trim()]; }));
}
const names = (await readdir(specificationsRoot)).filter((name) => /^DS\d{3}-.+\.md$/.test(name)).sort(); const rows = [];
for (let index = 0; index < names.length; index += 1) {
  const expected = `DS${String(index).padStart(3, "0")}`; const data = metadata(await readFile(resolve(specificationsRoot, names[index]), "utf8"));
  if (data.id !== expected) throw new Error(`DS numbering is not contiguous: expected ${expected}, found ${data.id ?? names[index]}`);
  for (const field of ["title", "status", "owner", "summary"]) if (!data[field]) throw new Error(`${names[index]} is missing ${field}`);
  rows.push(`| [${data.id}](specsLoader.html?spec=${names[index]}) | ${data.title.replaceAll("|", "\\|")} | [[status:${data.status}]] | ${data.owner.replaceAll("|", "\\|")} | ${data.summary.replaceAll("|", "\\|")} |`);
}
await writeFile(resolve(specificationsRoot, "matrix.md"), `# Specification Matrix\n\nGenerated from DS frontmatter by \`tools/generate-specs-matrix.mjs\`. Edit the DS files and rerun the generator instead of editing this file manually.\n\n| Specification | Title | Status | Owner | Summary |\n| --- | --- | --- | --- | --- |\n${rows.join("\n")}\n`);
console.log(`Generated a contiguous ${names.length}-specification matrix.`);
