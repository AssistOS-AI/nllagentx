import { mkdir, readFile, readdir } from "node:fs/promises";
import { relative, resolve, sep } from "node:path";
import { randomId } from "./workspace.mjs";
import { atomicWrite, ensureDirectory, exists, jsString } from "./filesystem.mjs";
import { installSkills } from "./skill-loader.mjs";
import { resolveRuntime } from "./module-loader.mjs";
import { ingestTaskSources, loadSourceRegistry, sourceOutline } from "./source-tools.mjs";
import { sdkCatalog, ontologyCatalog, circuitCatalog, profileResolutionCatalog, projectMap } from "./catalogs.mjs";

export const phaseSkills = Object.freeze({
  architect: ["nll-architect"], intent: ["nll-intent"], ontology: ["nll-ontology"], longtext: ["nll-longtext"],
  circuit: ["nll-circuit"], sdk: ["nll-sdk"], runtime: ["nll-runtime"], test: ["nll-test"], evaluate: ["nll-evaluate"],
  review: ["nll-test", "nll-runtime", "nll-circuit"]
});

const packSpecificationNumber = Object.freeze({ "core-commonsense": 7, "world-basic": 8, "math-basic": 9, "physics-basic": 10, "chemistry-basic": 11, "biology-basic": 12, "psychology-basic": 13, "anthropology-basic": 14, "sociology-basic": 15, "logic-basic": 16, "reasoning-errors": 17, "law-basic": 18, "social-interaction": 19 });

async function resolvedSpecificationPaths(projectRoot, references, domainNumbers = null) {
  const entries = (await readdir(resolve(projectRoot, "design-specifications"))).filter((name) => name.endsWith(".md")).sort();
  const officialEntries = (await readdir(resolve(projectRoot, "docs", "specs"))).filter((name) => /^DS\d{3}-.+\.md$/.test(name)).sort();
  const selected = new Set();
  for (const reference of references) {
    const range = String(reference).match(/^DS-(\d{3})-DS-(\d{3})$/);
    if (range) { for (let number = Number(range[1]); number <= Number(range[2]); number += 1) { if (domainNumbers && number >= 7 && number <= 19 && !domainNumbers.has(number)) continue; for (const name of entries) if (name.startsWith(`DS-${String(number).padStart(3, "0")}_`)) selected.add(resolve(projectRoot, "design-specifications", name)); } continue; }
    const prefix = String(reference).match(/^DS-(\d{3})/)?.[0];
    for (const name of entries) if (name.startsWith(`${prefix}_`) || name === reference) selected.add(resolve(projectRoot, "design-specifications", name));
    const officialPrefix = String(reference).match(/^DS\d{3}/)?.[0];
    for (const name of officialEntries) if (name.startsWith(`${officialPrefix}-`) || name === reference) selected.add(resolve(projectRoot, "docs", "specs", name));
  }
  return [...selected];
}

function relativeImport(fromDirectory, target) {
  let value = relative(fromDirectory, target).split(sep).join("/");
  if (!value.startsWith(".")) value = `./${value}`;
  return value;
}

export async function buildContext({ projectRoot, agentRoot, taskRoot = null, phase = "architect", profileId = null, goal = null, selectedSkills = null, selection = {} }) {
  const runBase = resolve(taskRoot ?? agentRoot, "runs"); await ensureDirectory(runBase);
  const runId = randomId("run-"); const runRoot = resolve(runBase, runId);
  for (const directory of ["context", "skills", "logs", "checks", "scratch"]) await mkdir(resolve(runRoot, directory), { recursive: true });
  if (taskRoot) await ingestTaskSources(taskRoot, { projectRoot });
  const runtime = await resolveRuntime({ projectRoot, agentRoot, taskRoot, profileId, ...selection });
  const skillIds = selectedSkills ?? phaseSkills[phase] ?? ["nll-architect"];
  const skills = await installSkills(projectRoot, runRoot, skillIds);
  const contextRoot = resolve(runRoot, "context");
  await atomicWrite(resolve(contextRoot, "PROJECT_MAP.md"), await projectMap(projectRoot, [agentRoot, ...(taskRoot ? [taskRoot] : [])]));
  await atomicWrite(resolve(contextRoot, "SDK_CATALOG.md"), sdkCatalog());
  await atomicWrite(resolve(contextRoot, "ONTOLOGY_CATALOG.md"), ontologyCatalog(runtime.ontologies));
  await atomicWrite(resolve(contextRoot, "CIRCUIT_CATALOG.md"), circuitCatalog(runtime.circuits));
  await atomicWrite(resolve(contextRoot, "PROFILE_RESOLUTION.md"), profileResolutionCatalog(runtime));
  if (taskRoot) await atomicWrite(resolve(contextRoot, "SOURCE_OUTLINE.md"), sourceOutline(await loadSourceRegistry(taskRoot, { projectRoot })));
  else await atomicWrite(resolve(contextRoot, "SOURCE_OUTLINE.md"), "# Source Outline\n\nNo task source was selected for this run.\n");
  const diagnosticPaths = taskRoot ? [resolve(taskRoot, "results", "diagnostics.md"), resolve(taskRoot, "results", "source-diagnostics.md")] : [];
  const diagnosticTexts = []; for (const path of diagnosticPaths) if (await exists(path)) diagnosticTexts.push(await readFile(path, "utf8"));
  await atomicWrite(resolve(contextRoot, "DIAGNOSTICS.md"), diagnosticTexts.length ? diagnosticTexts.join("\n\n") : "# Diagnostics\n\nNo existing diagnostics.\n");
  const workingDirectory = taskRoot ?? agentRoot;
  const skillOrder = skills.map((skill) => {
    const installed = resolve(runRoot, "skills", skill.id);
    return `- \`${relative(workingDirectory, resolve(installed, "SKILL.md")).split(sep).join("/")}\` (executable contract: \`${relative(workingDirectory, resolve(installed, "workflow.mjs")).split(sep).join("/")}\`)`;
  }).join("\n");
  const domainNumbers = new Set(runtime.packs.map((pack) => packSpecificationNumber[pack.id]).filter(Number.isInteger));
  const specPaths = await resolvedSpecificationPaths(projectRoot, [...new Set(skills.flatMap((skill) => skill.workflow.designSpecifications))], domainNumbers);
  if (runtime.packs.some((pack) => pack.id === "core-language")) specPaths.push(resolve(projectRoot, "docs", "specs", "DS034-core-language-pack.md"));
  const specOrder = specPaths.map((path) => `- \`${relative(workingDirectory, path).split(sep).join("/")}\``).join("\n") || "- No additional DS file was selected.";
  const instructions = `# nllAgent Coding Run

Goal: ${goal ?? `Complete the ${phase} phase according to the selected skill contracts.`}

Project root: ${projectRoot}
Canonical working directory: ${workingDirectory}
CLI invocation: \`node ${resolve(projectRoot, "nllAgent.mjs")}\`

## Mandatory reading order

1. This file.
2. The selected skill files in dependency order:
${skillOrder}
3. The relevant design specifications:
${specOrder}
4. Context catalogs under \`${relative(workingDirectory, contextRoot).split(sep).join("/")}\`.
5. Canonical source files needed for the requested change.

Use actual SDK constructors and resolved ontology identities. Keep semantic artifacts as executable \`.mjs\` modules. Do not create JSON or TypeScript semantic artifacts. Edit canonical agent/task/framework files directly, add tests, run the skill checks, and report typed diagnostics for genuinely unsupported operations.
`;
  await atomicWrite(resolve(runRoot, "INSTRUCTIONS.md"), instructions);
  const runImport = relativeImport(runRoot, resolve(projectRoot, "framework", "sdk", "agent", "run.mjs"));
  const checkCommand = `node ${resolve(projectRoot, "nllAgent.mjs")} test ${taskRoot ? "task" : "agent"} --agent-dir ${agentRoot}${taskRoot ? ` --task-dir ${taskRoot}` : ""} --level fast`;
  const runSource = `import { codingRun } from ${jsString(runImport)};

export default codingRun(${jsString(runId)})
  .using("codex")
  .cwd(${jsString(relative(projectRoot, taskRoot ?? agentRoot))})
  .installSkills(${skills.map((skill) => jsString(skill.id)).join(", ")})
  .objective(${jsString(goal ?? `${phase} phase`)})
  .allowEdits(${jsString(relative(projectRoot, taskRoot ?? agentRoot))})
  .check(${jsString(checkCommand)})
  .seal();
`;
  await atomicWrite(resolve(runRoot, "run.mjs"), runSource);
  return Object.freeze({ runId, runRoot, runtime, skills });
}

export async function describeContext(runRoot) {
  const entries = await readdir(resolve(runRoot, "context"), { withFileTypes: true });
  return `Run: ${runRoot}\nContext artifacts:\n${entries.filter((entry) => entry.isFile()).map((entry) => `- context/${entry.name}`).sort().join("\n")}\n`;
}

export async function buildReviewBundle({ projectRoot, agentRoot, taskRoot = null, diagnosticsPath = null }) {
  const context = await buildContext({ projectRoot, agentRoot, taskRoot, phase: "review", goal: "Review and repair the supplied deterministic failures without weakening tests." });
  const diagnostics = diagnosticsPath && await exists(diagnosticsPath) ? await readFile(diagnosticsPath, "utf8") : "No explicit diagnostics file was supplied.";
  await atomicWrite(resolve(context.runRoot, "context", "REVIEW_BUNDLE.md"), `# Review Bundle\n\n${diagnostics}\n`);
  return context;
}
