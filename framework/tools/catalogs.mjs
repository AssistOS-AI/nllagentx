import { relative } from "node:path";
import { listDescriptors } from "../sdk/core/descriptors.mjs";
import { sdkSurfaces } from "../sdk/public-api.mjs";
import { listFiles, fileSummary } from "./filesystem.mjs";

export function sdkCatalog() {
  const descriptors = listDescriptors();
  const lines = ["# SDK Catalog", "", `Public surfaces: ${sdkSurfaces.length}. Registered semantic descriptors: ${descriptors.length}.`, "", "## Import surfaces", "", "| Surface | Module | Exports | Purpose |", "| --- | --- | ---: | --- |"]; 
  for (const surface of sdkSurfaces) lines.push(`| \`${surface.id}\` | \`${surface.modulePath}\` | ${surface.exports.length} | ${surface.purpose} |`);
  lines.push("", "## Registered semantic descriptors", "", "| Identity | Module | Signature | Determinism | Provenance |", "| --- | --- | --- | --- | --- |");
  for (const descriptor of descriptors) lines.push(`| \`${descriptor.identity}\` | ${descriptor.module ?? "SDK"} | \`${descriptor.signature ?? "not declared"}\` | ${descriptor.determinism ?? "not declared"} | ${descriptor.provenance ?? "not declared"} |`);
  return `${lines.join("\n")}\n`;
}

export function ontologyCatalog(ontologies) {
  const lines = ["# Ontology Catalog", "", `Resolved ontology modules: ${ontologies.length}.`, ""];
  for (const ontology of ontologies) {
    lines.push(`## ${ontology.id} ${ontology.version}`, "", `Identity: \`${ontology.identity}\`. Concepts: ${ontology.concepts.length}. Roles: ${ontology.roles.length}.`, "", "| Concept | Sort | Parents | Capabilities |", "| --- | --- | --- | --- |");
    for (const concept of ontology.concepts) lines.push(`| \`${concept.identity}\` | ${concept.sort} | ${concept.parents.map((value) => `\`${value}\``).join(", ") || "—"} | ${concept.capabilities.map((value) => `\`${value.name}\``).join(", ") || "—"} |`);
    lines.push("");
  }
  return `${lines.join("\n")}\n`;
}

export function circuitCatalog(circuits) {
  const lines = ["# Circuit Catalog", "", `Resolved circuits: ${circuits.length}.`, "", "| Circuit | Requires | Provides | Stages | Assurance |", "| --- | --- | --- | ---: | --- |"]; 
  for (const circuit of circuits) lines.push(`| \`${circuit.identity}\` | ${circuit.requirements.map(label).join(", ") || "—"} | ${circuit.provisions.map(label).join(", ") || "—"} | ${circuit.stages.length} | ${circuit.assurances.map((entry) => entry.kind).join(", ") || "concrete"} |`);
  return `${lines.join("\n")}\n`;
}

function label(value) { return `\`${value?.name ?? (typeof value?.identity === "function" ? value.identity() : value?.identity) ?? String(value)}\``; }

export function profileResolutionCatalog(runtime) {
  const lines = ["# Profile Resolution", "", `Profile: \`${runtime.profile.id}\`.`, "", "## Loaded packs", "", ...runtime.packs.map((pack, index) => `${index + 1}. \`${pack.id}\` (${pack.tier}, ${pack.knowledgeLevel})`), "", "## Precedence", "", "1. framework SDK and core packs", "2. resolved load profile", "3. agent-local ontology and circuit modules", "4. task-local ontology, circuit, and IntentJS modules", "5. generated context (informational only)"];
  return `${lines.join("\n")}\n`;
}

export async function projectMap(projectRoot, roots = [projectRoot]) {
  const lines = ["# Project Map", ""];
  for (const root of roots) {
    lines.push(`## ${relative(projectRoot, root) || "."}`, "");
    const files = await listFiles(root, { exclude: [".git", "node_modules", "cache", "logs", "runs", "results"] });
    for (const path of files) lines.push(await fileSummary(path, projectRoot));
    lines.push("");
  }
  return `${lines.join("\n")}\n`;
}
