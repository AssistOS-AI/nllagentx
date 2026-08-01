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

let artifactBrowserSequence = 0;

function artifactLanguage(path) {
  if (path.endsWith(".mjs") || path.endsWith(".js")) return "javascript";
  if (path.endsWith(".md") || path.endsWith(".cnl")) return "markdown";
  return "text";
}

function portablePath(path) {
  return path.split("\\").join("/");
}

function artifactDescriptor(entry, projectRoot) {
  if (typeof entry === "object" && Object.hasOwn(entry, "content")) {
    const label = entry.label;
    return Object.freeze({
      path: null,
      label,
      projectLabel: entry.projectLabel ?? label,
      content: String(entry.content),
      language: entry.language ?? artifactLanguage(label)
    });
  }
  const path = typeof entry === "string" ? entry : entry.path;
  const displayRoot = typeof entry === "string" ? projectRoot : entry.displayRoot ?? projectRoot;
  const contextualLabel = portablePath(relative(displayRoot, path));
  const projectLabel = portablePath(relative(projectRoot, path));
  const inferredLabel = contextualLabel && contextualLabel !== ".." && !contextualLabel.startsWith("../")
    ? contextualLabel
    : projectLabel;
  const label = typeof entry === "object" && entry.label ? entry.label : inferredLabel;
  return Object.freeze({ path, label, projectLabel, content: null, language: artifactLanguage(path) });
}

export async function artifactBrowser(groups, projectRoot, escapeHtml) {
  const browserId = `artifact-browser-${++artifactBrowserSequence}`;
  const branches = [];
  const templates = [];
  let fileIndex = 0;
  let firstFileId = null;
  let firstArtifact = null;
  for (const [groupName, declaration] of Object.entries(groups)) {
    const entries = Array.isArray(declaration) ? declaration : declaration.entries;
    const provenance = Array.isArray(declaration) ? null : declaration.provenance ?? null;
    const fileButtons = [];
    for (const entry of entries) {
      const descriptor = artifactDescriptor(entry, projectRoot);
      const { path, label, projectLabel, language } = descriptor;
      const fileId = `${browserId}-file-${++fileIndex}`;
      const content = descriptor.content ?? await readFile(path, "utf8");
      if (firstFileId === null) {
        firstFileId = fileId;
        firstArtifact = { label, content, language };
      }
      fileButtons.push(`<button type="button" data-artifact-file="${fileId}" aria-current="${fileId === firstFileId ? "true" : "false"}" title="${escapeHtml(projectLabel)}"><code>${escapeHtml(label)}</code></button>`);
      templates.push(`<template id="${fileId}" data-label="${escapeHtml(label)}" data-project-path="${escapeHtml(projectLabel)}" data-language="${language}">${escapeHtml(content)}</template>`);
    }
    const provenanceHtml = !provenance ? "" : provenance.command
      ? `<div class="artifact-browser__provenance"><pre><code># ${escapeHtml(provenance.description)}\n${escapeHtml(provenance.command)}</code></pre></div>`
      : `<p class="artifact-browser__provenance artifact-browser__provenance--note">${escapeHtml(provenance.description)}</p>`;
    branches.push(`<details class="artifact-browser__branch" open><summary>${escapeHtml(groupName)}</summary>${provenanceHtml}<div class="artifact-browser__files" role="group" aria-label="${escapeHtml(groupName)} files">${fileButtons.join("") || "<p>No retained files in this category.</p>"}</div></details>`);
  }
  return `<section class="artifact-browser" data-artifact-browser data-initial-file="${firstFileId ?? ""}">
<div class="artifact-browser__body"><nav class="artifact-browser__inventory" aria-label="Input, intermediate, and output artifact tree" role="tree">${branches.join("")}</nav>
<div class="artifact-browser__viewer"><p class="artifact-browser__path" data-artifact-path>${escapeHtml(firstArtifact?.label ?? "")}</p><pre><code class="language-${firstArtifact?.language ?? "text"}" data-artifact-content>${escapeHtml(firstArtifact?.content ?? "")}</code></pre></div></div>
${templates.join("")}</section>`;
}

export async function loadDefaultIfPresent(path, fallback) {
  if (!await exists(path)) return fallback;
  const module = await import(`${pathToFileURL(path).href}?docs=${Date.now()}`);
  return module.default;
}
