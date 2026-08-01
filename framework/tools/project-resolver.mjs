import { dirname, isAbsolute, resolve } from "node:path";
import { exists, filesystemSafeName } from "./filesystem.mjs";

export async function findProjectRoot(start = process.cwd()) {
  let current = resolve(start);
  while (true) {
    if (await exists(resolve(current, "framework")) && await exists(resolve(current, "nll-skills"))) return current;
    const parent = dirname(current);
    if (parent === current) throw new Error(`PROJECT_ROOT_NOT_FOUND from ${start}`);
    current = parent;
  }
}

function pathLike(value) { return value && (isAbsolute(value) || value.includes("/") || value.startsWith(".")); }

export async function resolveAgentRoot(projectRoot, options, { required = true, allowMissing = false } = {}) {
  const explicit = options["agent-dir"];
  const nameOrPath = options.agent;
  if (!explicit && !nameOrPath) { if (required) throw new Error("USAGE_AGENT_REQUIRED: pass --agent <name> or --agent-dir <path>"); return null; }
  const path = resolve(explicit ?? (pathLike(nameOrPath) ? nameOrPath : resolve(projectRoot, "agents", nameOrPath)));
  if (!allowMissing && !(await exists(path))) throw new Error(`AGENT_NOT_FOUND: ${path}`);
  return path;
}

export async function resolveTaskRoot(agentRoot, options, { required = true, allowMissing = false } = {}) {
  const explicit = options["task-dir"];
  const idOrPath = options.task;
  if (!explicit && !idOrPath) { if (required) throw new Error("USAGE_TASK_REQUIRED: pass --task <id> or --task-dir <path>"); return null; }
  const path = resolve(explicit ?? (pathLike(idOrPath) ? idOrPath : resolve(agentRoot, "tasks", idOrPath)));
  if (!allowMissing && !(await exists(path))) throw new Error(`TASK_NOT_FOUND: ${path}`);
  return path;
}

export function validateAgentName(name) { if (!filesystemSafeName(name)) throw new Error(`AGENT_NAME_INVALID: ${name}`); return name; }

export function taskIdFromRoot(taskRoot) { return taskRoot.split(/[\\/]/).filter(Boolean).at(-1); }
export function agentNameFromRoot(agentRoot) { return agentRoot.split(/[\\/]/).filter(Boolean).at(-1); }
