#!/usr/bin/env node
import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const definitions = [
  ["nll-architect", ["DS-000", "DS-004", "DS035", "DS041", "DS042", "DS043", "DS044"], ["PROJECT_MAP.md", "SDK_CATALOG.md", "ONTOLOGY_CATALOG.md", "CIRCUIT_CATALOG.md", "RESPONSE_CIRCUIT_CATALOG.md", "PROFILE_RESOLUTION.md", "SOURCE_OUTLINE.md"], ["files index", "catalog sdk", "catalog ontology", "catalog circuit", "catalog response", "profile resolve", "source outline", "context show"], [], ["agent", "task", "architecture-plan", "work-plan"]],
  ["nll-orchestrator", ["DS-001", "DS035", "DS036", "DS037", "DS041", "DS042", "DS043", "DS044"], ["PROJECT_MAP.md", "RESPONSE_CIRCUIT_CATALOG.md", "DIAGNOSTICS.md"], ["files index", "context build", "context show", "source ingest", "source outline", "review bundle"], [], ["framework/cli", "framework/tools", "runs"]],
  ["nll-sdk", ["DS-002", "DS039", "DS043", "DS044"], ["SDK_CATALOG.md", "ONTOLOGY_CATALOG.md", "RESPONSE_CIRCUIT_CATALOG.md"], ["catalog sdk", "catalog response", "sdk check", "sdk usage", "ontology build", "ontology check", "test framework --level fast"], [], ["framework/sdk"]],
  ["nll-runtime", ["DS-003", "DS043", "DS044"], ["SDK_CATALOG.md", "CIRCUIT_CATALOG.md", "RESPONSE_CIRCUIT_CATALOG.md", "DIAGNOSTICS.md"], ["catalog response", "sdk check", "ontology check", "longtext execute", "circuit plan", "circuit run", "circuit abstract", "circuit symbolic", "trace slice", "test framework"], ["nll-sdk"], ["framework/runtime", "framework/sdk/analysis"]],
  ["nll-intent", ["DS-004", "DS035", "DS041", "DS042", "DS043", "DS044"], ["SOURCE_OUTLINE.md", "ONTOLOGY_CATALOG.md", "CIRCUIT_CATALOG.md", "RESPONSE_CIRCUIT_CATALOG.md", "PROFILE_RESOLUTION.md"], ["source outline", "source search", "catalog ontology", "catalog circuit", "catalog response", "profile resolve", "intent infer-signals", "intent check", "intent explain", "plan show"], ["nll-ontology"], ["task/intent", "task/profiles"]],
  ["nll-ontology", ["DS-002", "DS-007-DS-019", "DS038", "DS041", "DS042"], ["ONTOLOGY_CATALOG.md", "SDK_CATALOG.md", "SOURCE_OUTLINE.md"], ["catalog ontology", "ontology show", "ontology check", "ontology build", "ontology affected", "sdk usage", "source search", "test packs"], ["nll-sdk"], ["framework/packs", "agent/ontologies", "task/ontologies"]],
  ["nll-longtext", ["DS-002", "DS-004", "DS-007-DS-019", "DS037", "DS041", "DS042", "DS043"], ["SOURCE_OUTLINE.md", "ONTOLOGY_CATALOG.md", "PROFILE_RESOLUTION.md"], ["source outline", "source show", "source search", "source span", "source verify-anchors", "catalog ontology", "ontology show", "longtext check", "longtext execute", "longtext query", "longtext coverage"], ["nll-intent", "nll-ontology"], ["task/longtext", "task/tests"]],
  ["nll-circuit", ["DS-003", "DS-000", "DS-007-DS-019", "DS005", "DS041", "DS042", "DS043", "DS044"], ["CIRCUIT_CATALOG.md", "RESPONSE_CIRCUIT_CATALOG.md", "ONTOLOGY_CATALOG.md", "SDK_CATALOG.md", "DIAGNOSTICS.md"], ["catalog circuit", "catalog response", "catalog ontology", "sdk usage", "longtext query", "circuit check", "circuit plan", "circuit run", "circuit abstract", "circuit symbolic", "trace slice", "cnl roundtrip", "test task"], ["nll-runtime", "nll-ontology"], ["framework/packs", "agent/circuits", "agent/cnl", "task/circuits", "task/cnl"]],
  ["nll-test", ["DS-005", "DS042", "DS043", "DS044"], ["PROJECT_MAP.md", "DIAGNOSTICS.md", "SDK_CATALOG.md", "RESPONSE_CIRCUIT_CATALOG.md"], ["test framework", "test packs", "test agent", "test task", "review bundle"], [], ["tests", "test-support"]],
  ["nll-evaluate", ["DS-006", "DS036", "DS041", "DS042", "DS043", "DS044"], ["PROJECT_MAP.md", "PROFILE_RESOLUTION.md", "RESPONSE_CIRCUIT_CATALOG.md", "DIAGNOSTICS.md"], ["agent create", "task create", "context build", "code architect", "code intent", "code ontology", "code longtext", "code circuit", "evaluate", "trace compare"], ["nll-intent", "nll-longtext", "nll-circuit", "nll-test"], ["evaluations"]]
];

const marker = "## Executable SDK integration";

for (const [id, specs, context, tools, dependencies, editRoots] of definitions) {
  const skillRoot = resolve(root, "nll-skills", id);
  const workflow = `import { codingSkill, contextArtifact, cliTool, editRoot } from "../../framework/sdk/agent/skill.mjs";

export default codingSkill(${JSON.stringify(id)})
  .specs(
    ${specs.map((value) => JSON.stringify(value)).join(",\n    ")}
  )
  .context(
    ${context.map((value) => `contextArtifact(${JSON.stringify(value)})`).join(",\n    ")}
  )
  .tools(
    ${tools.map((value) => `cliTool(${JSON.stringify(`nllAgent ${value}`)})`).join(",\n    ")}
  )
${dependencies.length > 0
    ? `  .dependsOn(\n    ${dependencies.map((value) => JSON.stringify(value)).join(",\n    ")}\n  )`
    : "  .dependsOn()"}
  .edits(
    ${editRoots.map((value) => `editRoot(${JSON.stringify(value)})`).join(",\n    ")}
  )
  .phase("discover", "author", "validate", "handoff")
  .seal();
`;
  await writeFile(resolve(skillRoot, "workflow.mjs"), workflow);
  const skillPath = resolve(skillRoot, "SKILL.md");
  const current = await readFile(skillPath, "utf8");
  if (!current.includes(marker)) {
    const appendix = `

${marker}

The adjacent \`workflow.mjs\` is the executable skill contract. The CLI loads it through the SDK, resolves its skill dependencies transitively, and generates only the context artifacts declared there. The workflow never searches hidden skill directories.

At runtime, \`nllAgent context build\` resolves either \`--agent <name>\` or \`--agent-dir <path>\`, and either \`--task <id>\` or \`--task-dir <path>\`. It imports framework default knowledge, then profile, agent, and task ontologies, semantic circuits and response circuits in that precedence order. Generated \`SDK_CATALOG.md\`, \`ONTOLOGY_CATALOG.md\`, \`CIRCUIT_CATALOG.md\`, \`RESPONSE_CIRCUIT_CATALOG.md\`, and \`PROFILE_RESOLUTION.md\` describe the actual resolved modules. Skill code must use those SDK constructors and ontology identities; it must not copy catalog prose into semantic modules or replace executable DSL code with data manifests.

The task folder owns source, IntentJS, LongTextJS, task-local ontology/semantic-circuit/response-circuit code, tests, runs, and results. The agent folder owns reusable extensions. A reusable dependency belongs in the framework or agent layer, while a source-specific interpretation belongs in the task layer.
`;
    await writeFile(skillPath, `${current.trimEnd()}${appendix}`);
  }
}

console.log(`Generated ${definitions.length} executable skill workflows.`);
