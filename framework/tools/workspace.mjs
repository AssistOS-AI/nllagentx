import { copyFile, mkdir, readdir, rm } from "node:fs/promises";
import { extname, relative, resolve, sep } from "node:path";
import { randomBytes } from "node:crypto";
import { exists, atomicWrite, ensureDirectory, jsString } from "./filesystem.mjs";
import { validateAgentName } from "./project-resolver.mjs";

export function randomId(prefix = "") { return `${prefix}${randomBytes(12).toString("base64url")}`; }

function moduleSpecifier(fromDirectory, target) {
  let value = relative(fromDirectory, target).split(sep).join("/");
  if (!value.startsWith(".")) value = `./${value}`;
  return value;
}

export async function createAgent(projectRoot, name, { profile = "general-broad" } = {}) {
  validateAgentName(name);
  const root = resolve(projectRoot, "agents", name);
  return initializeAgentAt(projectRoot, root, name, { profile });
}

export async function initializeAgentAt(projectRoot, root, name, { profile = "general-broad", packs = ["core-language", "core-commonsense", "logic-basic", "reasoning-errors"] } = {}) {
  validateAgentName(name);
  if (await exists(root)) throw new Error(`AGENT_ALREADY_EXISTS: ${root}`);
  for (const directory of ["ontologies", "circuits", "methods", "profiles", "lexicons", "cnl", "tests", "tasks"]) await mkdir(resolve(root, directory), { recursive: true });
  const sdkPath = moduleSpecifier(root, resolve(projectRoot, "framework", "sdk", "agent", "agent.mjs"));
  const source = `import { semanticAgent, usePack, useProfile, useSkillPolicy, codingAgent } from ${jsString(sdkPath)};

export default semanticAgent(${jsString(name)})
  .use(${packs.map((pack) => `usePack(${jsString(pack)})`).join(", ")})
  .defaultProfile(useProfile(${jsString(profile)}))
  .skills(useSkillPolicy("standard-authoring"))
  .coding(codingAgent("codex").directEditing())
  .seal();
`;
  await atomicWrite(resolve(root, "agent.mjs"), source);
  await atomicWrite(resolve(root, "README.md"), `# ${name}\n\nPersistent nllAgent package. Reusable ontologies and circuits belong here; task-specific source interpretations belong under \`tasks/\`.\n`);
  return root;
}

export async function createTask(agentRoot, { projectRoot = null, sourcePath = null, title = null, instruction = null, profile = null } = {}) {
  const id = randomId("task-"); const root = resolve(agentRoot, "tasks", id);
  for (const directory of ["source", "intent", "longtext/units", "ontologies", "circuits", "tests", "runs", "results"]) await mkdir(resolve(root, directory), { recursive: true });
  let sourceDirective = null;
  if (sourcePath) {
    const extension = extname(sourcePath).toLocaleLowerCase("en") || ".txt";
    const target = resolve(root, "source", `source-001${extension}`);
    await copyFile(resolve(sourcePath), target);
    sourceDirective = `sourceFile(${jsString(`source/source-001${extension}`)})`;
  }
  const resolvedProjectRoot = projectRoot ?? resolve(agentRoot, "../..");
  const sdkPath = moduleSpecifier(root, resolve(resolvedProjectRoot, "framework", "sdk", "agent", "task.mjs"));
  const lines = [
    `import { semanticTask, sourceFile, requestedOutput, taskInstruction, taskProfile } from ${jsString(sdkPath)};`,
    "",
    `export default semanticTask(${jsString(id)})`
  ];
  if (title) lines.push(`  .title(${jsString(title)})`);
  if (sourceDirective) lines.push(`  .source(${sourceDirective})`);
  if (instruction) lines.push(`  .instruction(taskInstruction(${jsString(instruction)}))`);
  if (profile) lines.push(`  .profile(taskProfile(${jsString(profile)}))`);
  lines.push(`  .output(requestedOutput("findings"), requestedOutput("cnl-observations"))`, "  .seal();", "");
  await atomicWrite(resolve(root, "task.mjs"), lines.join("\n"));
  return Object.freeze({ id, root });
}

export async function cleanRuns(taskRoot) {
  const runsRoot = resolve(taskRoot, "runs");
  if (!(await exists(runsRoot))) return [];
  const entries = await readdir(runsRoot, { withFileTypes: true }); const removed = [];
  for (const entry of entries) if (entry.isDirectory()) { const target = resolve(runsRoot, entry.name); await rm(target, { recursive: true, force: true }); removed.push(target); }
  return removed;
}

export async function acquireWriteLock(root) {
  const lockPath = resolve(root, ".nll-writer-lock");
  try { await mkdir(lockPath); } catch (error) { if (error.code === "EEXIST") throw new Error(`WORKSPACE_WRITE_LOCKED: ${root}`); throw error; }
  return Object.freeze({ path: lockPath, async release() { await rm(lockPath, { recursive: true, force: true }); } });
}
