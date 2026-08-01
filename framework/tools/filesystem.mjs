import { access, mkdir, readdir, readFile, stat, writeFile, rename } from "node:fs/promises";
import { dirname, relative, resolve } from "node:path";

export async function exists(path) { try { await access(path); return true; } catch { return false; } }
export async function ensureDirectory(path) { await mkdir(path, { recursive: true }); return path; }

export async function atomicWrite(path, contents) {
  await ensureDirectory(dirname(path));
  const temporary = `${path}.${process.pid}.tmp`;
  await writeFile(temporary, contents);
  await rename(temporary, path);
}

export async function listFiles(root, { include = null, exclude = [".git", "node_modules", "cache", "logs"] } = {}) {
  const output = [];
  async function visit(directory) {
    const entries = await readdir(directory, { withFileTypes: true });
    entries.sort((left, right) => left.name.localeCompare(right.name));
    for (const entry of entries) {
      if (exclude.includes(entry.name)) continue;
      const path = resolve(directory, entry.name);
      if (entry.isDirectory()) await visit(path);
      else if (!include || include(path)) output.push(path);
    }
  }
  if (await exists(root)) await visit(root);
  return output;
}

export async function fileSummary(path, root) {
  const info = await stat(path); const extension = path.split(".").at(-1);
  let summary = `${info.size} bytes`;
  if (["mjs", "md", "txt", "html", "css", "cnl"].includes(extension)) {
    const text = await readFile(path, "utf8"); const first = text.split(/\r?\n/).find((line) => line.trim())?.trim() ?? "empty";
    summary = `${text.split(/\r?\n/).length} lines — ${first.slice(0, 120)}`;
  }
  return `- \`${relative(root, path)}\`: ${summary}`;
}

export function jsString(value) { return JSON.stringify(String(value)); }
export function filesystemSafeName(value) { return /^[A-Za-z0-9][A-Za-z0-9._-]{0,127}$/.test(value); }
