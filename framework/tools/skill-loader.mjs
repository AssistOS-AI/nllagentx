import { access, cp, mkdir, readdir } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";

async function exists(path) { try { await access(path); return true; } catch { return false; } }

export async function loadSkill(projectRoot, id) {
  const skillRoot = resolve(projectRoot, "nll-skills", id);
  const workflowPath = resolve(skillRoot, "workflow.mjs");
  if (!(await exists(workflowPath))) throw new Error(`SKILL_WORKFLOW_MISSING: ${id}`);
  const module = await import(`${pathToFileURL(workflowPath).href}?loaded=${Date.now()}`);
  return Object.freeze({ id, root: skillRoot, workflow: module.default });
}

export async function resolveSkillChain(projectRoot, requested) {
  const resolved = new Map(); const visiting = new Set();
  async function visit(id) {
    if (resolved.has(id)) return;
    if (visiting.has(id)) throw new Error(`SKILL_DEPENDENCY_CYCLE: ${[...visiting, id].join(" -> ")}`);
    visiting.add(id); const skill = await loadSkill(projectRoot, id);
    for (const dependency of skill.workflow.dependencies) await visit(dependency);
    visiting.delete(id); resolved.set(id, skill);
  }
  for (const id of requested) await visit(id);
  return Object.freeze([...resolved.values()]);
}

export async function installSkills(projectRoot, runRoot, requested) {
  const skills = await resolveSkillChain(projectRoot, requested);
  const destination = resolve(runRoot, "skills"); await mkdir(destination, { recursive: true });
  for (const skill of skills) await cp(skill.root, resolve(destination, skill.id), { recursive: true, force: true });
  return skills;
}

export async function listSkills(projectRoot) {
  const root = resolve(projectRoot, "nll-skills");
  const entries = await readdir(root, { withFileTypes: true });
  return entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name).sort();
}
