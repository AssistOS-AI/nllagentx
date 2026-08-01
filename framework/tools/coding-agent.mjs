import { createWriteStream } from "node:fs";
import { mkdir, readFile } from "node:fs/promises";
import { spawn } from "node:child_process";
import { relative, resolve } from "node:path";
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
    const exitCode = await new Promise((resolveExit, reject) => {
      const child = spawn(this.executable, args, { cwd: workingDirectory, env: environment, stdio: ["ignore", "pipe", "pipe"] });
      const stdout = createWriteStream(stdoutPath); const stderr = createWriteStream(stderrPath);
      child.stdout.pipe(stdout); child.stderr.pipe(stderr);
      child.on("error", reject);
      child.on("close", (code) => { stdout.end(); stderr.end(); resolveExit(code ?? 4); });
    });
    const finishedAt = new Date().toISOString();
    await atomicWrite(resolve(runRoot, "logs", "process.md"), `# Coding-agent process\n\n- Adapter: Codex\n- Started: ${startedAt}\n- Finished: ${finishedAt}\n- Exit status: ${exitCode}\n- Working directory: ${relative(projectRoot, workingDirectory)}\n- Standard output: \`logs/codex.stdout.log\`\n- Standard error: \`logs/codex.stderr.log\`\n- Final response: \`logs/codex.final.md\`\n`);
    return Object.freeze({ exitCode, stdoutPath, stderrPath, summaryPath, startedAt, finishedAt });
  }
}
