#!/usr/bin/env node
import { access, readFile, readdir } from "node:fs/promises";
import { dirname, extname, resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const docsRoot = resolve(root, "docs");
const textExtensions = new Set([".html", ".md", ".css", ".js", ".mjs"]);

async function exists(path) {
  try { await access(path); return true; } catch { return false; }
}

async function filesUnder(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await filesUnder(path)));
    else if (textExtensions.has(extname(entry.name))) files.push(path);
  }
  return files.sort();
}

function targetsFor(path, source) {
  const extension = extname(path);
  const targets = [];
  if (extension === ".html") {
    for (const match of source.matchAll(/\b(?:href|src|data-include)\s*=\s*["']([^"']+)["']/gi)) targets.push(match[1]);
  }
  if (extension === ".md") {
    for (const match of source.matchAll(/!?\[[^\]]*\]\(\s*(?:<([^>]+)>|([^\s)]+))/g)) targets.push(match[1] || match[2]);
  }
  if (extension === ".css") {
    for (const match of source.matchAll(/url\(\s*["']?([^)\s"']+)/g)) targets.push(match[1]);
  }
  if ([".html", ".js", ".mjs"].includes(extension)) {
    for (const match of source.matchAll(/\bimport\s+(?:[^'";]+?\s+from\s+)?["']([^"']+)["']/g)) targets.push(match[1]);
    for (const match of source.matchAll(/\bfetch\s*\(\s*["'`]([^"'`]+)["'`]/g)) targets.push(match[1]);
    for (const match of source.matchAll(/(?:window\.)?location(?:\.href)?\s*=\s*["']([^"']+)["']/g)) targets.push(match[1]);
  }
  return targets;
}

function isExternal(target) {
  return /^(?:https?:|mailto:|tel:|data:)/i.test(target);
}

function stripTarget(target) {
  return target.split("#")[0].split("?")[0];
}

async function verifyTarget(file, target, issues) {
  if (!target || target === "#" || target.startsWith("#") || target.includes("${")) return;
  if (target.startsWith("/") || target.startsWith("file:") || /(?:localhost|127\.0\.0\.1|workspace-files)/i.test(target)) {
    issues.push(`${file}: non-portable URL ${target}`);
    return;
  }
  if (isExternal(target)) return;
  const raw = stripTarget(target);
  if (!raw) return;
  const base = file.includes(`${resolve(docsRoot, "partials")}/`) ? docsRoot : dirname(file);
  const resolved = resolve(base, raw);
  if (!await exists(resolved)) issues.push(`${file}: ${target} resolves to missing ${resolved}`);
  if (raw === "specsLoader.html" && target.includes("?spec=")) {
    const query = new URLSearchParams(target.split("?")[1]?.split("#")[0]);
    const spec = query.get("spec");
    if (!spec || !await exists(resolve(docsRoot, "specs", spec))) issues.push(`${file}: missing specification target ${target}`);
  }
}

async function main() {
  const files = await filesUnder(docsRoot);
  const issues = [];
  for (const file of files) {
    const source = await readFile(file, "utf8");
    if (/\/home\/[^\s<"']+|https?:\/\/(?:localhost|127\.0\.0\.1)|\/workspace-files\//i.test(source)) {
      issues.push(`${file}: contains a machine-specific path or URL`);
    }
    for (const target of targetsFor(file, source)) await verifyTarget(file, target, issues);
    if (extname(file) === ".html" && !source.includes("./assets/diagram-renderer.mjs")) {
      issues.push(`${file}: missing project-owned relative diagram renderer import`);
    }
    if (file === resolve(docsRoot, "specs", "matrix.md")) {
      for (const match of source.matchAll(/\[DS\d{3}\]\(([^)]+)\)/g)) {
        if (!/^specsLoader\.html\?spec=DS\d{3}-[A-Za-z0-9-]+\.md$/.test(match[1])) {
          issues.push(`${file}: matrix target must be document-relative: ${match[1]}`);
        }
      }
    }
  }
  if (issues.length > 0) throw new Error(`Documentation verification failed:\n${issues.join("\n")}`);
  const counts = Object.groupBy(files, (file) => extname(file));
  console.log(`Verified ${files.length} documentation files (${Object.entries(counts).map(([kind, values]) => `${values.length} ${kind}`).join(", ")}); all local URLs and assets are relative.`);
}

main().catch((error) => { console.error(error.message); process.exitCode = 1; });
