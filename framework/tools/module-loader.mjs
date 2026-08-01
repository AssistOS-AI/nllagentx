import { pathToFileURL } from "node:url";
import { basename, resolve } from "node:path";
import { listFiles, exists } from "./filesystem.mjs";
import { frameworkPackMap, frameworkPacks } from "../packs/index.mjs";
import { CapabilityRegistry } from "../runtime/planner/registry.mjs";

export async function importFresh(path) {
  const url = pathToFileURL(resolve(path));
  url.searchParams.set("nllFresh", `${Date.now()}-${Math.random()}`);
  return import(url.href);
}

async function loadDefault(path) { return (await importFresh(path)).default; }

export async function loadAgent(agentRoot) {
  const path = resolve(agentRoot, "agent.mjs");
  if (!(await exists(path))) throw new Error(`AGENT_MODULE_MISSING: ${path}`);
  return loadDefault(path);
}

export async function loadTask(taskRoot) {
  const path = resolve(taskRoot, "task.mjs");
  if (!(await exists(path))) throw new Error(`TASK_MODULE_MISSING: ${path}`);
  return loadDefault(path);
}

export async function loadProfile(projectRoot, id, roots = []) {
  const candidates = [...roots.map((root) => resolve(root, "profiles", `${id}.profile.mjs`)), resolve(projectRoot, "profiles", `${id}.profile.mjs`)];
  for (const candidate of candidates) if (await exists(candidate)) return loadDefault(candidate);
  throw new Error(`PROFILE_NOT_FOUND: ${id}`);
}

async function loadModules(root, suffix) {
  if (!root || !(await exists(root))) return [];
  const paths = await listFiles(root, { include: (path) => path.endsWith(suffix), exclude: ["runs", "results", "tests", ".git"] });
  const values = [];
  for (const path of paths) {
    const module = await importFresh(path); const exported = module.default;
    if (Array.isArray(exported)) values.push(...exported); else if (exported) values.push(exported);
  }
  return values;
}

export async function resolveRuntime({ projectRoot, agentRoot, taskRoot = null, profileId = null, allCompatible = false, domains = [], excludeDomains = [], only = false, checks = [], excludeChecks = [], intentText = null }) {
  const agent = await loadAgent(agentRoot);
  const task = taskRoot ? await loadTask(taskRoot) : null;
  const declaredProfile = profileId ?? task?.profiles?.at(-1)?.value ?? agent.defaultProfile?.value ?? "general-broad";
  const profile = await loadProfile(projectRoot, declaredProfile, [taskRoot, agentRoot].filter(Boolean));
  const profilePackIds = profile.packs.filter((entry) => entry.kind === "use-pack").map((entry) => entry.value);
  const agentPackIds = agent.packs.map((entry) => entry.value);
  const inferredPackIds = intentText ? frameworkPacks.filter((pack) => pack.recognizes(intentText).matched).map((pack) => pack.id) : [];
  for (const id of domains) if (!frameworkPackMap.has(id)) throw new Error(`PACK_NOT_FOUND: ${id}`);
  if (excludeDomains.includes("core-language")) throw new Error("PACK_CORE_REQUIRED: core-language cannot be excluded");
  const basePackIds = only ? ["core-language", ...domains] : allCompatible || profile.packs.some((entry) => entry.kind === "use-every-compatible-pack")
    ? [...frameworkPackMap.keys(), ...domains]
    : ["core-language", ...profilePackIds, ...agentPackIds, ...domains, ...inferredPackIds];
  const excludedPackIds = new Set(excludeDomains);
  const packIds = [...new Set(basePackIds)].filter((id) => !excludedPackIds.has(id));
  let changed = true;
  while (changed) {
    changed = false; const availableCapabilities = new Set(packIds.flatMap((id) => frameworkPackMap.get(id)?.capabilities.map((entry) => entry.name) ?? []));
    for (const id of [...packIds]) for (const requirement of frameworkPackMap.get(id)?.requirements ?? []) {
      const name = requirement?.name ?? requirement?.value ?? requirement?.id ?? String(requirement);
      if (availableCapabilities.has(name)) continue;
      const provider = frameworkPacks.find((pack) => pack.capabilities.some((entry) => entry.name === name) && !excludedPackIds.has(pack.id));
      if (!provider) throw new Error(`PACK_REQUIREMENT_UNSATISFIED: ${id} requires ${name}`);
      if (!packIds.includes(provider.id)) { packIds.push(provider.id); changed = true; }
    }
  }
  const packs = packIds.map((id) => frameworkPackMap.get(id)).filter(Boolean);
  for (const pack of packs) for (const incompatible of pack.incompatibilities) {
    const incompatibleId = incompatible?.id ?? incompatible?.value ?? String(incompatible);
    if (packIds.includes(incompatibleId)) throw new Error(`PACK_INCOMPATIBLE: ${pack.id} and ${incompatibleId}`);
  }
  const localOntologies = [
    ...(await loadModules(resolve(agentRoot, "ontologies"), ".ontology.mjs")),
    ...(taskRoot ? await loadModules(resolve(taskRoot, "ontologies"), ".ontology.mjs") : [])
  ];
  const localCircuits = [
    ...(await loadModules(resolve(agentRoot, "circuits"), ".circuit.mjs")),
    ...(taskRoot ? await loadModules(resolve(taskRoot, "circuits"), ".circuit.mjs") : [])
  ];
  const ontologies = [...packs.flatMap((pack) => pack.ontologies), ...localOntologies];
  const checkSet = new Set(checks); const excludedCheckSet = new Set(excludeChecks);
  const matchesCheck = (circuit, selected) => selected.has(circuit.id) || selected.has(circuit.identity) || circuit.provisions.some((value) => selected.has(value?.name ?? value?.identity ?? String(value)));
  const circuits = [...packs.flatMap((pack) => pack.circuits), ...localCircuits].filter((circuit) => !matchesCheck(circuit, excludedCheckSet) && (!only || checkSet.size === 0 || matchesCheck(circuit, checkSet)));
  const registry = new CapabilityRegistry(); for (const pack of packs) registry.registerPack(pack); for (const circuit of localCircuits) registry.registerCircuit(circuit);
  const intents = taskRoot ? await loadModules(resolve(taskRoot, "intent"), "intent.mjs") : [];
  let longTexts = [];
  if (taskRoot) {
    const rootLongText = resolve(taskRoot, "longtext", "root.longtext.mjs");
    longTexts = await exists(rootLongText) ? [await loadDefault(rootLongText)] : await loadModules(resolve(taskRoot, "longtext"), ".longtext.mjs");
  }
  return Object.freeze({ agent, task, profile, packs: Object.freeze(packs), ontologies: Object.freeze(ontologies), circuits: Object.freeze(circuits), registry, intent: intents.at(-1) ?? null, longTexts: Object.freeze(longTexts), allFrameworkPacks: frameworkPacks });
}

export function moduleLabel(value) { return value.id ?? value.identity ?? basename(String(value)); }
