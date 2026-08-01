import { relative, resolve, sep } from "node:path";
import { listFiles, atomicWrite, exists } from "./filesystem.mjs";
import { importFresh } from "./module-loader.mjs";

function importPath(from, target) { let value = relative(from, target).split(sep).join("/"); if (!value.startsWith(".")) value = `./${value}`; return value; }
function exportName(ontology, concept) { return `${ontology.id}_${concept.name}`.replace(/[^A-Za-z0-9_$]/g, "_").replace(/^[0-9]/, "_$&"); }

export async function checkOntologies(ontologies) {
  const diagnostics = []; const identities = new Map();
  const parents = new Map(); const roleDefinitions = new Map();
  for (const ontology of ontologies) {
    for (const role of ontology.roles) roleDefinitions.set(role.identity, role);
    for (const concept of ontology.concepts) {
      if (identities.has(concept.identity)) diagnostics.push({ code: "ONTOLOGY_DUPLICATE_IDENTITY", identity: concept.identity, modules: [identities.get(concept.identity), ontology.id] });
      identities.set(concept.identity, ontology.id);
      parents.set(concept.identity, concept.parents);
      if (concept.parents.includes(concept.identity)) diagnostics.push({ code: "ONTOLOGY_SUBTYPE_CYCLE", identity: concept.identity });
      if (concept.parents.some((parent) => concept.disjoint.includes(parent))) diagnostics.push({ code: "ONTOLOGY_DISJOINT_PARENT", identity: concept.identity });
    }
  }
  const visiting = new Set(); const visited = new Set();
  function visit(identity, path = []) {
    if (visiting.has(identity)) { diagnostics.push({ code: "ONTOLOGY_SUBTYPE_CYCLE", identity, path: [...path, identity] }); return; }
    if (visited.has(identity)) return; visiting.add(identity);
    for (const parent of parents.get(identity) ?? []) visit(parent, [...path, identity]);
    visiting.delete(identity); visited.add(identity);
  }
  for (const identity of parents.keys()) visit(identity);
  for (const role of roleDefinitions.values()) if (role.inverse) {
    const inverse = roleDefinitions.get(role.inverse);
    if (!inverse) diagnostics.push({ code: "ONTOLOGY_INVERSE_UNKNOWN", identity: role.identity, inverse: role.inverse });
    else if (inverse.inverse && inverse.inverse !== role.identity) diagnostics.push({ code: "ONTOLOGY_INVERSE_ASYMMETRIC", identity: role.identity, inverse: role.inverse });
  }
  return Object.freeze(diagnostics);
}

export async function generateOntologyFacade({ projectRoot, agentRoot, taskRoot = null, runtime }) {
  const roots = [resolve(projectRoot, "framework", "packs"), resolve(agentRoot, "ontologies"), ...(taskRoot ? [resolve(taskRoot, "ontologies")] : [])];
  const candidates = []; for (const root of roots) if (await exists(root)) candidates.push(...await listFiles(root, { include: (path) => path.endsWith(".ontology.mjs"), exclude: ["tests"] }));
  const modulePaths = new Map();
  for (const path of candidates) { try { const ontology = (await importFresh(path)).default; if (ontology?.identity) modulePaths.set(ontology.identity, path); } catch { /* ontology check reports import failures separately */ } }
  const outputRoot = resolve(taskRoot ?? agentRoot, "sdk"); const outputPath = resolve(outputRoot, "ontology.generated.mjs");
  const imports = []; const exports = []; const usedNames = new Map();
  runtime.ontologies.forEach((ontology, index) => {
    const sourcePath = modulePaths.get(ontology.identity); if (!sourcePath) return;
    imports.push(`import ontology${index} from ${JSON.stringify(importPath(outputRoot, sourcePath))};`);
    for (const concept of ontology.concepts) {
      const qualified = exportName(ontology, concept); exports.push(`export const ${qualified} = ontology${index}.constructorFor(${JSON.stringify(concept.name)});`);
      if (!usedNames.has(concept.name)) usedNames.set(concept.name, []); usedNames.get(concept.name).push({ index, qualified });
    }
    for (const role of ontology.roles) { const qualified = exportName(ontology, role); exports.push(`export const ${qualified} = ontology${index}.constructorFor(${JSON.stringify(role.name)});`); if (!usedNames.has(role.name)) usedNames.set(role.name, []); usedNames.get(role.name).push({ index, qualified }); }
  });
  for (const [name, entries] of usedNames) if (entries.length === 1 && /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(name)) exports.push(`export const ${name} = ${entries[0].qualified};`);
  await atomicWrite(outputPath, `${imports.join("\n")}\n\n${exports.join("\n")}\n`);
  return outputPath;
}
