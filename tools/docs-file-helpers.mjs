import { access, readFile, readdir } from "node:fs/promises";
import { relative, resolve } from "node:path";
import { pathToFileURL } from "node:url";

export async function exists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

export async function textIfPresent(path) {
  return await exists(path) ? await readFile(path, "utf8") : "";
}

export async function filesBelow(root, suffix = "") {
  if (!await exists(root)) return [];
  const output = [];
  async function visit(folder) {
    for (const entry of await readdir(folder, { withFileTypes: true })) {
      const path = resolve(folder, entry.name);
      if (entry.isDirectory()) await visit(path);
      else if (!suffix || entry.name.endsWith(suffix)) output.push(path);
    }
  }
  await visit(root);
  return output.sort((left, right) => left.localeCompare(right, "en"));
}

export function codeBlock(value, escapeHtml, language = "text") {
  return `<pre><code class="language-${language}">${escapeHtml(value.trimEnd())}</code></pre>`;
}

export function fullFile(path, content, projectRoot, escapeHtml) {
  const label = relative(projectRoot, path).split("\\").join("/");
  const language = path.endsWith(".mjs") ? "javascript" : "text";
  return `<details class="source-file" open><summary><code>${escapeHtml(label)}</code> — complete file</summary>${codeBlock(content, escapeHtml, language)}</details>`;
}

export async function sourceFilesHtml(paths, projectRoot, escapeHtml) {
  const sections = [];
  for (const path of paths) {
    sections.push(fullFile(path, await readFile(path, "utf8"), projectRoot, escapeHtml));
  }
  return sections.join("\n");
}

export async function loadDefaultIfPresent(path, fallback) {
  if (!await exists(path)) return fallback;
  const module = await import(`${pathToFileURL(path).href}?docs=${Date.now()}`);
  return module.default;
}
