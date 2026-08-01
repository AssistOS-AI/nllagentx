import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { resolve } from "node:path";
import {
  adaptiveAssuranceFailures,
  adaptiveReplayEquivalent,
  hasAdaptiveMaterialOutput,
  runAdaptiveAuthoring
} from "../tools/adaptive-authoring.mjs";
import { runCli } from "../cli/main.mjs";
import { buildReviewBundle } from "../tools/context-builder.mjs";
import { createTask, initializeAgentAt } from "../tools/workspace.mjs";

const projectRoot = resolve(import.meta.dirname, "../..");

function capture() {
  let stdout = "";
  let stderr = "";
  return Object.freeze({
    io: Object.freeze({
      stdout: Object.freeze({ write: (value) => { stdout += value; } }),
      stderr: Object.freeze({ write: (value) => { stderr += value; } })
    }),
    result: () => Object.freeze({ stdout, stderr })
  });
}

function circuit(id, methods) {
  return Object.freeze({
    id,
    identity: `circuit:${id}@1.0.0`,
    assurances: Object.freeze(methods.map((kind) => Object.freeze({ kind })))
  });
}

test("adaptive assurance requires non-core abstract and symbolic evidence", () => {
  const reviewed = circuit("task.review", ["abstract-preflight", "symbolic-decision-coverage"]);
  const execution = Object.freeze({
    plan: Object.freeze({ circuits: Object.freeze([circuit("core-language.grounding", []), reviewed]) }),
    assurance: Object.freeze([
      Object.freeze({
        circuit: reviewed.identity,
        method: "abstract-preflight",
        result: Object.freeze({ converged: true })
      }),
      Object.freeze({
        circuit: reviewed.identity,
        method: "symbolic-decision-coverage",
        result: Object.freeze({ paths: Object.freeze([Object.freeze({})]), truncated: false })
      })
    ])
  });
  assert.deepEqual(adaptiveAssuranceFailures(execution, "all"), []);
});

test("adaptive assurance exposes missing and truncated symbolic work", () => {
  const reviewed = circuit("task.review", ["symbolic-decision-coverage"]);
  const execution = Object.freeze({
    plan: Object.freeze({ circuits: Object.freeze([reviewed]) }),
    assurance: Object.freeze([
      Object.freeze({
        circuit: reviewed.identity,
        method: "symbolic-decision-coverage",
        result: Object.freeze({ paths: Object.freeze([]), truncated: true })
      })
    ])
  });
  assert.deepEqual(adaptiveAssuranceFailures(execution, "all"), [
    "circuit task.review does not declare abstract-preflight",
    "circuit task.review symbolic exploration was truncated",
    "circuit task.review produced no symbolic paths"
  ]);
});

test("adaptive material output cannot be satisfied by core grounding alone", () => {
  const core = circuit("core-language.grounding", []);
  const reviewed = circuit("task.review", []);
  const finding = (status, circuitIdentity) => Object.freeze({
    status: () => status,
    descriptor: () => Object.freeze({ circuit: circuitIdentity })
  });
  const execution = Object.freeze({
    plan: Object.freeze({ circuits: Object.freeze([core, reviewed]) }),
    findings: Object.freeze([
      finding("SATISFIED", core.identity),
      finding("NOT_APPLICABLE", reviewed.identity)
    ]),
    executions: Object.freeze([
      Object.freeze({ circuit: core, frames: Object.freeze([]) }),
      Object.freeze({ circuit: reviewed, frames: Object.freeze([]) })
    ])
  });
  assert.equal(hasAdaptiveMaterialOutput(execution), false);
  const unknownExecution = Object.freeze({
    ...execution,
    findings: Object.freeze([finding("UNKNOWN", reviewed.identity)])
  });
  assert.equal(hasAdaptiveMaterialOutput(unknownExecution), false);
  assert.equal(hasAdaptiveMaterialOutput(unknownExecution, true), true);
});

test("adaptive replay comparison covers circuits, findings, frames, assurance, and Markdown CNL", () => {
  const reviewed = circuit("task.review", []);
  const finding = Object.freeze({ code: () => "REVIEW", status: () => "VIOLATED" });
  const frame = Object.freeze({ identity: () => "cnl:remediation" });
  const execution = Object.freeze({
    plan: Object.freeze({ circuits: Object.freeze([reviewed]) }),
    findings: Object.freeze([finding]),
    frames: Object.freeze([frame]),
    assurance: Object.freeze([Object.freeze({ circuit: reviewed.identity, method: "abstract-preflight" })]),
    response: "[CNL:DOCUMENT]\nA grounded response."
  });
  assert.equal(adaptiveReplayEquivalent(execution, execution), true);
  assert.equal(adaptiveReplayEquivalent(execution, Object.freeze({ ...execution, frames: Object.freeze([]) })), false);
  assert.equal(adaptiveReplayEquivalent(execution, Object.freeze({ ...execution, response: "changed" })), false);
});

test("adaptive CLI rejects ambiguous authoring modes before invoking Codex", async () => {
  const output = capture();
  const exitCode = await runCli([
    "analyze", "--project-root", projectRoot,
    "--author-adaptive", "--author-missing"
  ], output.io);
  assert.equal(exitCode, 2);
  assert.match(output.result().stderr, /USAGE_AUTHORING_MODE_CONFLICT/);
});

test("adaptive CLI validates cycle and assurance controls before invoking Codex", async () => {
  const selectors = [
    "--project-root", projectRoot,
    "--agent-dir", resolve(projectRoot, "examples/validation-agent"),
    "--task-dir", resolve(projectRoot, "examples/validation-agent/tasks/task-symbolic-validation"),
    "--author-adaptive"
  ];
  const cycleOutput = capture();
  assert.equal(await runCli(["analyze", ...selectors, "--authoring-cycles", "0"], cycleOutput.io), 2);
  assert.match(cycleOutput.result().stderr, /USAGE_AUTHORING_CYCLES_RANGE/);
  const assuranceOutput = capture();
  assert.equal(await runCli(["analyze", ...selectors, "--assurance", "random"], assuranceOutput.io), 2);
  assert.match(assuranceOutput.result().stderr, /USAGE_ASSURANCE_VALUE/);
});

test("adaptive review context survives a broken task semantic module", async () => {
  const temporary = await mkdtemp(resolve(tmpdir(), "nll-adaptive-context-"));
  const agentRoot = resolve(temporary, "agent");
  try {
    await initializeAgentAt(projectRoot, agentRoot, "adaptive-context-agent", {
      profile: "minimal-core",
      packs: ["core-language"]
    });
    const sourcePath = resolve(temporary, "source.txt");
    await writeFile(sourcePath, "A source sentence.");
    const task = await createTask(agentRoot, {
      projectRoot,
      sourcePath,
      instruction: "Review the source.",
      profile: "minimal-core"
    });
    await writeFile(resolve(task.root, "intent", "broken.intent.mjs"), "throw new Error('broken adaptive intent');\n");
    const context = await buildReviewBundle({ projectRoot, agentRoot, taskRoot: task.root });
    const diagnostics = await readFile(resolve(context.runRoot, "context", "DIAGNOSTICS.md"), "utf8");
    assert.match(diagnostics, /Runtime resolution failure/);
    assert.match(diagnostics, /broken adaptive intent/);
    assert.match(await readFile(resolve(context.runRoot, "INSTRUCTIONS.md"), "utf8"), /nll-ontology/);
    const phases = [];
    await assert.rejects(
      runAdaptiveAuthoring({
        projectRoot,
        agentRoot,
        taskRoot: task.root,
        executionOptions: { projectRoot, agentRoot, taskRoot: task.root },
        maxReviewCycles: 1,
        authorPhase: async (phase) => {
          phases.push(phase);
          return Object.freeze({ phase, adapter: "test", exitCode: 0 });
        }
      }),
      /ADAPTIVE_AUTHORING_NOT_ACCEPTED/
    );
    assert.deepEqual(phases, ["ontology", "longtext", "circuit", "review"]);
  } finally {
    await rm(temporary, { recursive: true, force: true });
  }
});
