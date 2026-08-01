import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { resolve } from "node:path";
import { initializeAgentAt } from "../tools/workspace.mjs";
import { runCli } from "../cli/main.mjs";
import { importFresh } from "../tools/module-loader.mjs";

function capture() { let stdout = ""; let stderr = ""; return { io: { stdout: { write: (value) => { stdout += value; } }, stderr: { write: (value) => { stderr += value; } } }, result: () => ({ stdout, stderr }) }; }

test("CLI resolves explicit agent/task folders and ingests source", async () => {
  const projectRoot = resolve(import.meta.dirname, "../.."); const temporary = await mkdtemp(resolve(tmpdir(), "nll-cli-")); const agentRoot = resolve(temporary, "agent");
  try {
    await initializeAgentAt(projectRoot, agentRoot, "temporary-agent", { profile: "minimal-core", packs: ["core-language"] }); const source = resolve(temporary, "source.txt"); await writeFile(source, "A stable source sentence.\n\nA second unit.");
    const created = capture(); assert.equal(await runCli(["task", "create", "--project-root", projectRoot, "--agent-dir", agentRoot, "--source", source, "--profile", "minimal-core"], created.io), 0); const taskId = created.result().stdout.match(/Task ID: (\S+)/)[1];
    const sdkCheck = capture(); assert.equal(await runCli(["sdk", "check", "--project-root", projectRoot], sdkCheck.io), 0); assert.match(sdkCheck.result().stdout, /"valid": true/);
    const sdkUsage = capture(); assert.equal(await runCli(["sdk", "usage", "--project-root", projectRoot, "--surface", "longtext"], sdkUsage.io), 0); assert.match(sdkUsage.result().stdout, /framework\/sdk\/longtext\/index\.mjs/);
    const ingest = capture(); assert.equal(await runCli(["source", "ingest", "--project-root", projectRoot, "--agent-dir", agentRoot, "--task", taskId], ingest.io), 0); assert.match(ingest.result().stdout, /source-001/);
    const outline = capture(); assert.equal(await runCli(["source", "outline", "--project-root", projectRoot, "--agent-dir", agentRoot, "--task", taskId], outline.io), 0); assert.match(outline.result().stdout, /A stable source sentence/);
    const check = capture(); assert.equal(await runCli(["agent", "check", "--project-root", projectRoot, "--agent-dir", agentRoot], check.io), 0); assert.match(check.result().stdout, /"valid": true/);
    const plan = capture(); assert.equal(await runCli(["plan", "show", "--project-root", projectRoot, "--agent-dir", agentRoot, "--task", taskId], plan.io), 0); assert.match(plan.result().stdout, /# Execution Plan/);
    const context = capture(); assert.equal(await runCli(["context", "build", "--project-root", projectRoot, "--agent-dir", agentRoot, "--task", taskId, "--phase", "sdk"], context.io), 0);
    const runRoot = context.result().stdout.match(/Run: (.+)/)[1].trim();
    const instructions = await readFile(resolve(runRoot, "INSTRUCTIONS.md"), "utf8");
    assert.match(instructions, /DS039-sdk-public-surfaces-and-tooling\.md/);
    const run = capture(); assert.equal(await runCli(["run", "--project-root", projectRoot, "--agent-dir", agentRoot, "--task", taskId], run.io), 0);
    const findings = (await importFresh(resolve(agentRoot, "tasks", taskId, "results", "findings.mjs"))).default; assert.ok(Array.isArray(findings));
  } finally { await rm(temporary, { recursive: true, force: true }); }
});
