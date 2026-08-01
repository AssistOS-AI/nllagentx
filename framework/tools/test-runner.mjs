import { spawn } from "node:child_process";
import { resolve } from "node:path";
import { listFiles, exists } from "./filesystem.mjs";

async function testFiles(root) { return listFiles(root, { include: (path) => path.endsWith(".test.mjs"), exclude: ["node_modules", ".git", "runs", "results"] }); }

export async function selectTests({ projectRoot, scope, agentRoot = null, taskRoot = null, pack = null }) {
  const roots = [];
  if (scope === "framework" || scope === "all") roots.push(resolve(projectRoot, "framework", "tests"), resolve(projectRoot, "framework", "sdk"), resolve(projectRoot, "framework", "runtime"), resolve(projectRoot, "test-support"), resolve(projectRoot, "examples", "tests"));
  if (scope === "packs" || scope === "all") roots.push(pack ? resolve(projectRoot, "framework", "packs", pack, "tests") : resolve(projectRoot, "framework", "packs"));
  if (scope === "agent" || (scope === "all" && agentRoot)) { if (!agentRoot) throw new Error("TEST_AGENT_ROOT_REQUIRED"); roots.push(resolve(agentRoot, "tests")); }
  if (scope === "task" || (scope === "all" && taskRoot)) { if (!taskRoot) throw new Error("TEST_TASK_ROOT_REQUIRED"); roots.push(resolve(taskRoot, "tests")); }
  const files = []; for (const root of roots) if (await exists(root)) files.push(...await testFiles(root));
  return [...new Set(files)].sort();
}

export async function runTests(options) {
  const files = await selectTests(options);
  if (files.length === 0) return Object.freeze({ exitCode: 0, files, message: "No matching tests." });
  const args = ["--test"];
  if (options.level === "fast") args.push("--test-concurrency=4");
  args.push(...files);
  const exitCode = await new Promise((resolveExit, reject) => {
    const child = spawn(process.execPath, args, { cwd: options.projectRoot, stdio: "inherit", env: { ...process.env, NLL_TEST_LEVEL: options.level ?? "standard" } });
    child.on("error", reject); child.on("close", (code) => resolveExit(code ?? 3));
  });
  return Object.freeze({ exitCode, files });
}
