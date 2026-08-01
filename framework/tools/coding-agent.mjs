import { createWriteStream } from "node:fs";
import { mkdir } from "node:fs/promises";
import { spawn } from "node:child_process";
import { relative, resolve } from "node:path";
import { finished } from "node:stream/promises";
import { atomicWrite } from "./filesystem.mjs";

export class CodingAgentAdapter {
  async run() { throw new Error("CodingAgentAdapter.run must be implemented"); }
}

export class CodexAdapter extends CodingAgentAdapter {
  constructor({ executable = "codex" } = {}) { super(); this.executable = executable; }
  async run({ projectRoot, workingDirectory, runRoot, model = null, resume = null }) {
    await mkdir(resolve(runRoot, "logs"), { recursive: true });
    const stdoutPath = resolve(runRoot, "logs", "codex.stdout.log"); const stderrPath = resolve(runRoot, "logs", "codex.stderr.log");
    const summaryPath = resolve(runRoot, "logs", "codex.final.md");
    const instructionsRelative = relative(workingDirectory, resolve(runRoot, "INSTRUCTIONS.md"));
    const prompt = `Read ${instructionsRelative}, then execute the requested phase completely. Use the run-local skills and context in the order stated there.`;
    const args = ["exec", "--dangerously-bypass-approvals-and-sandbox", "--color", "never", "-C", workingDirectory, "-o", summaryPath];
    if (model) args.push("--model", model);
    if (resume) args.push("resume", resume, prompt); else args.push(prompt);
    const environment = {
      ...process.env,
      NLL_PROJECT_ROOT: projectRoot,
      NLL_AGENT_ROOT: workingDirectory,
      NLL_RUN_ROOT: runRoot
    };
    const startedAt = new Date().toISOString();
    const stdout = createWriteStream(stdoutPath);
    const stderr = createWriteStream(stderrPath);
    const processCompletion = new Promise((resolveExit, reject) => {
      const child = spawn(this.executable, args, { cwd: workingDirectory, env: environment, stdio: ["ignore", "pipe", "pipe"] });
      child.stdout.pipe(stdout); child.stderr.pipe(stderr);
      child.on("error", (error) => {
        stdout.destroy(error);
        stderr.destroy(error);
        reject(error);
      });
      child.on("close", (code) => resolveExit(code ?? 4));
    });
    const [exitCode] = await Promise.all([
      processCompletion,
      finished(stdout),
      finished(stderr)
    ]);
    const finishedAt = new Date().toISOString();
    await atomicWrite(resolve(runRoot, "logs", "process.md"), `# Coding-agent process\n\n- Adapter: Codex\n- Started: ${startedAt}\n- Finished: ${finishedAt}\n- Exit status: ${exitCode}\n- Working directory: ${relative(projectRoot, workingDirectory)}\n- Standard output: \`logs/codex.stdout.log\`\n- Standard error: \`logs/codex.stderr.log\`\n- Final response: \`logs/codex.final.md\`\n`);
    return Object.freeze({ adapterId: "codex", exitCode, stdoutPath, stderrPath, summaryPath, startedAt, finishedAt });
  }
}

export function createCodingAgentAdapter(id, options = {}) {
  if (id === "codex") return new CodexAdapter(options);
  throw new Error(`CODING_AGENT_ADAPTER_UNKNOWN: ${id}`);
}
