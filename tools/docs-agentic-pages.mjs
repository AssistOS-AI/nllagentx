import { readFile, readdir } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import {
  codeBlock,
  exists,
  filesBelow,
  fullFile,
  loadDefaultIfPresent,
  sourceFilesHtml,
  textIfPresent
} from "./docs-file-helpers.mjs";
import {
  adaptiveAgentRelativePath,
  adaptiveTaskRelativePath,
  agentRelativePath,
  caseDefinitions,
  evaluationId
} from "./docs-evaluation-cases.mjs";
import { dslReference } from "./docs-dsl-reference.mjs";

async function loadResults(projectRoot) {
  const path = resolve(projectRoot, "evaluations", evaluationId, "reports", "task-results.mjs");
  return await loadDefaultIfPresent(path, []);
}

async function loadAgentAuthoring(projectRoot) {
  const path = resolve(projectRoot, "evaluations", evaluationId, "reports", "agent-authoring.mjs");
  return await loadDefaultIfPresent(path, []);
}

async function loadAdaptiveRecord(projectRoot) {
  const path = resolve(projectRoot, adaptiveTaskRelativePath, "results", "adaptive-authoring.mjs");
  return await loadDefaultIfPresent(path, null);
}

async function legacyArchivedAgentRuns(archiveRoot) {
  const path = resolve(archiveRoot, "authoring.md");
  if (!await exists(path)) return [];
  const markdown = await readFile(path, "utf8");
  const runs = [];
  const pattern = /^\| agent \| ([^|]+) \| (\d+) \| \[run\]\(([^)]+)\/INSTRUCTIONS\.md\) \| \[final response\]\(([^)]+)\) \| (\d+) \| (\d+) \|$/gm;
  for (const match of markdown.matchAll(pattern)) {
    const runPath = `evaluations/${evaluationId}/${match[3].replace(/^\.\.\//, "")}`;
    const finalResponsePath = `evaluations/${evaluationId}/${match[4].replace(/^\.\.\//, "")}`;
    runs.push(Object.freeze({
      scope: "agent",
      phase: match[1].trim(),
      adapter: "codex",
      exitCode: Number(match[2]),
      runPath,
      finalResponsePath,
      stderrPath: `${runPath}/logs/codex.stderr.log`,
      created: Object.freeze(Array.from({ length: Number(match[5]) }, (_, index) => `retained-created-${index + 1}`)),
      modified: Object.freeze(Array.from({ length: Number(match[6]) }, (_, index) => `retained-modified-${index + 1}`))
    }));
  }
  return runs;
}

async function archivedIterationsHtml(projectRoot, escapeHtml) {
  const root = resolve(projectRoot, "evaluations", evaluationId, "reports", "iterations");
  if (!await exists(root)) return "<p>No previous evaluation iteration has been archived.</p>";
  const entries = (await readdir(root, { withFileTypes: true }))
    .filter((entry) => entry.isDirectory())
    .sort((left, right) => left.name.localeCompare(right.name, "en"));
  if (entries.length === 0) return "<p>No previous evaluation iteration has been archived.</p>";
  const items = [];
  for (const entry of entries) {
    const base = `../evaluations/${evaluationId}/reports/iterations/${entry.name}`;
    const agentRecord = resolve(root, entry.name, "agent-authoring.mjs");
    const taskRecord = resolve(root, entry.name, "task-results.mjs");
    const archivedAgentRuns = await exists(agentRecord)
      ? (await import(`${pathToFileURL(agentRecord).href}?docs=${Date.now()}`)).default
      : await legacyArchivedAgentRuns(resolve(root, entry.name));
    const archivedTasks = await exists(taskRecord)
      ? (await import(`${pathToFileURL(taskRecord).href}?docs=${Date.now()}`)).default
      : [];
    const taskLinks = archivedTasks.map((result) => {
      const report = result.taskPath ? `../${result.taskPath}/results/report.md` : null;
      const label = `<code>${escapeHtml(result.sourceCaseId ?? result.caseId)}</code> → <code>${escapeHtml(result.taskId)}</code> (${escapeHtml(result.status)})`;
      return report ? `<li><a href="${report}">${label}</a></li>` : `<li>${label}</li>`;
    }).join("");
    const retainedLinks = [];
    if (await exists(agentRecord)) retainedLinks.push(`<a href="${base}/agent-authoring.mjs">executable agent-phase record</a>`);
    else if (await exists(resolve(root, entry.name, "authoring.md"))) retainedLinks.push(`<a href="${base}/authoring.md">retained agent-phase report</a>`);
    if (await exists(taskRecord)) retainedLinks.push(`<a href="${base}/task-results.mjs">executable task results</a>`);
    items.push(`<li><details><summary><code>${escapeHtml(entry.name)}</code> — ${archivedAgentRuns.length} agent phases, ${archivedTasks.length} tasks</summary>${authoringEvidence({ authoring: archivedAgentRuns }, escapeHtml)}<ul>${taskLinks}</ul><p>${retainedLinks.join("; ")}.</p></details></li>`);
  }
  return `<ul>${items.join("")}</ul>`;
}

function authoringEvidence(result, escapeHtml) {
  if (!result?.authoring?.length) return "<p>No retained task authoring phases were found.</p>";
  const rows = result.authoring.map((run) => {
    const runPath = `../${run.runPath}`;
    const finalPath = run.finalResponsePath ? `../${run.finalResponsePath}` : `${runPath}/logs/codex.final.md`;
    const stderrPath = run.stderrPath ? `../${run.stderrPath}` : `${runPath}/logs/codex.stderr.log`;
    return `<tr><td>${escapeHtml(run.phase)}</td><td>${escapeHtml(run.adapter ?? "codex")}</td><td>${run.exitCode}</td><td>${run.created.length}</td><td>${run.modified.length}</td><td><a href="${runPath}/INSTRUCTIONS.md">instructions</a></td><td><a href="${finalPath}">agent final</a></td><td><a href="${stderrPath}">full process log</a></td></tr>`;
  }).join("");
  return `<table><thead><tr><th>Phase</th><th>Adapter</th><th>Exit</th><th>Created</th><th>Modified</th><th colspan="3">Retained evidence</th></tr></thead><tbody>${rows}</tbody></table>`;
}

function adaptiveAuthoringEvidence(record, escapeHtml) {
  if (!record?.authoringRuns?.length) return "<p>No adaptive coding run is retained.</p>";
  const rows = record.authoringRuns.map((run) => {
    const runPath = `../${run.runPath}`;
    return `<tr><td>${escapeHtml(run.phase)}</td><td>${escapeHtml(run.adapter)}</td><td>${run.exitCode}</td><td>${escapeHtml(run.startedAt)}</td><td>${escapeHtml(run.finishedAt)}</td><td><a href="${runPath}/INSTRUCTIONS.md">instructions</a></td><td><a href="../${run.finalResponsePath}">agent final</a></td><td><a href="../${run.stderrPath}">full process log</a></td></tr>`;
  }).join("");
  return `<table><thead><tr><th>Phase</th><th>Adapter</th><th>Exit</th><th>Started</th><th>Finished</th><th colspan="3">Retained evidence</th></tr></thead><tbody>${rows}</tbody></table>`;
}

function adaptiveCyclesTable(record, escapeHtml) {
  const rows = record.cycles.map((cycle) => {
    const findings = (cycle.findings ?? []).join(", ") || "none";
    const failures = (cycle.failures ?? []).join("; ") || "none";
    const assurances = (cycle.assurances ?? []).map((entry) => `${entry.circuit}: ${entry.method}`).join("; ") || "none";
    return `<tr><td>${cycle.reviewIndex ?? cycle.cycle ?? "—"}</td><td>${cycle.accepted ? "accepted" : "review required"}</td><td>${escapeHtml(findings)}</td><td>${cycle.responseResults ?? "not recorded"}</td><td><code>${escapeHtml(cycle.responseDigest ?? "not recorded")}</code></td><td>${escapeHtml(failures)}</td><td>${escapeHtml(assurances)}</td></tr>`;
  }).join("");
  return `<table><thead><tr><th>Cycle</th><th>Decision</th><th>Material findings</th><th>Public results</th><th>Response digest</th><th>Failures sent to review</th><th>Auxiliary evidence</th></tr></thead><tbody>${rows}</tbody></table>`;
}

async function adaptiveTutorialContent(record, projectRoot, escapeHtml) {
  const taskRoot = resolve(projectRoot, adaptiveTaskRelativePath);
  if (!record?.accepted) {
    throw new Error("Adaptive tutorial generation requires a retained, accepted DS042 evaluation result");
  }
  const initialFiles = [
    resolve(projectRoot, "evaluations/adaptive-task-e2e/README.md"),
    resolve(projectRoot, "evaluations/adaptive-task-e2e/initial-inventory.mjs"),
    resolve(projectRoot, adaptiveAgentRelativePath, "agent.mjs"),
    resolve(projectRoot, adaptiveAgentRelativePath, "profiles", "adaptive-core-only.profile.mjs"),
    resolve(taskRoot, "task.mjs"),
    resolve(taskRoot, "source", "cold-chain-transfer.txt")
  ];
  const semanticFiles = [];
  for (const [folder, suffix] of [
    ["intent", ".mjs"],
    ["ontologies", ".ontology.mjs"],
    ["longtext", ".mjs"],
    ["circuits", ".mjs"],
    ["cnl", ".response.circuit.mjs"],
    ["tests", ".test.mjs"]
  ]) semanticFiles.push(...await filesBelow(resolve(taskRoot, folder), suffix));
  const generatedOntologyFacade = resolve(taskRoot, "sdk", "ontology.generated.mjs");
  if (await exists(generatedOntologyFacade)) semanticFiles.push(generatedOntologyFacade);
  const validationFiles = [resolve(projectRoot, "evaluations/adaptive-task-e2e/validate.mjs")];
  for (const name of ["validation.mjs", "validation.md"]) {
    const path = resolve(projectRoot, "evaluations/adaptive-task-e2e/reports", name);
    if (await exists(path)) validationFiles.push(path);
  }
  const resultFiles = [];
  for (const name of [
    "adaptive-initial-state.mjs", "adaptive-initial-state.md", "adaptive-authoring.mjs",
    "adaptive-authoring.md", "artifacts.md", "execution-plan.md", "findings.cnl",
    "observations.cnl", "generation-plan.cnl", "coverage.md", "diagnostics.md",
    "assurance.md", "adaptive-replay.mjs", "adaptive-replay.md", "trace-summary.md", "report.md"
  ]) {
    const path = resolve(taskRoot, "results", name);
    if (await exists(path)) resultFiles.push(path);
  }
  resultFiles.push(...(await filesBelow(resolve(taskRoot, "results"), ".md"))
    .filter((path) => path.includes("adaptive-authoring-cycle-")));
  const initialCommand = `node nllAgent.mjs analyze \\\n  --agent-dir ${adaptiveAgentRelativePath} \\\n  --task-dir ${adaptiveTaskRelativePath} \\\n  --author-adaptive --authoring-cycles 3 --assurance all`;
  const replayCommand = `node nllAgent.mjs run \\\n  --agent-dir ${adaptiveAgentRelativePath} \\\n  --task-dir ${adaptiveTaskRelativePath} --assurance all`;
  return `<p class="lead">This page is generated from the accepted DS042 task. The starting inventory proves that no task intent, ontology, LongText, semantic/response circuit, test, run, or result existed. The public CLI invoked Codex for each semantic phase, composed the generated task provider and response policy with inherited core knowledge, and accepted it only after deterministic review.</p>
<div class="callout"><strong>Observed adaptive acceptance.</strong> Accepted <code>${record.accepted}</code>; phases <code>${escapeHtml(record.phases.join(" → "))}</code>; deterministic assessments <code>${record.cycles.length}</code>; auxiliary requirement <code>${escapeHtml(record.assurance)}</code>.</div>
<h2>1. Exact starting state, agent, task, and natural-language source</h2>
${await sourceFilesHtml(initialFiles, projectRoot, escapeHtml)}
<h2>2. Public CLI command that invoked Codex</h2>
${codeBlock(initialCommand, escapeHtml, "shell")}
<p>The agent owns only core language. All missing semantics are discovered from the source and retained under this task; the CLI does not run a hidden extractor or copy a prepared semantic fixture.</p>
<h2>3. Complete generated IntentJS, OntologyJS, LongTextJS, semantic/response CircuitJS, and tests</h2>
${await sourceFilesHtml(semanticFiles, projectRoot, escapeHtml)}
<h2>4. Every real Codex phase and process log</h2>
${adaptiveAuthoringEvidence(record, escapeHtml)}
<h2>5. Deterministic assessment cycles</h2>
${adaptiveCyclesTable(record, escapeHtml)}
<p>Each rejected assessment feeds its exact failures into the next review bundle. Acceptance cannot remove tests or lower the requested assurance.</p>
<h2>6. Primary human-facing Markdown CNL response</h2>
${await sourceFilesHtml([resolve(taskRoot, "results", "response.md")], projectRoot, escapeHtml)}
<p>This is the prompt-like output. It contains only material, intent-visible results, the evaluated rule, failed and uncertain requirements, and ranked exact input quotations.</p>
<h2>7. Independent evaluation oracle and observed result</h2>
<p>The evaluator rejects generic grounding or a vague verdict. It requires newly authored task ontology and circuit code, successful real Codex phases, a non-core violation, cited evidence for the expired calibration and missing receiving acknowledgement, complete abstract and symbolic passes, and replay equivalence.</p>
${await sourceFilesHtml(validationFiles, projectRoot, escapeHtml)}
<h2>8. Supporting concrete, canonical CNL, assurance summaries, and trace outputs</h2>
${await sourceFilesHtml([...new Set(resultFiles)], projectRoot, escapeHtml)}
<p>Executable assurance projections and binary traces remain linked by <code>artifacts.md</code>; they are debug evidence and are not reproduced as the semantic answer.</p>
<h2>9. Model-free replay command</h2>
${codeBlock(replayCommand, escapeHtml, "shell")}
<p>The replay imports the generated <code>.mjs</code> programs and executes the planner and SemanticStore directly. It does not invoke Codex. The retained process evidence remains reachable through only relative links above.</p>`;
}

async function tutorialContent(definition, result, projectRoot, escapeHtml) {
  if (!result) {
    throw new Error(`Tutorial generation requires a retained result for ${definition.id}`);
  }
  const taskRoot = resolve(projectRoot, result.taskPath);
  const sourcePath = resolve(projectRoot, result.sourcePath);
  const intentFiles = await filesBelow(resolve(taskRoot, "intent"), ".mjs");
  const longTextFiles = await filesBelow(resolve(taskRoot, "longtext"), ".mjs");
  const ontologyFiles = await filesBelow(resolve(projectRoot, agentRelativePath, "ontologies"), ".mjs");
  const circuitPath = resolve(projectRoot, agentRelativePath, "circuits", definition.circuit);
  const taskModulePath = resolve(taskRoot, "task.mjs");
  const primaryResponse = resolve(taskRoot, "results", "response.md");
  const outputCandidates = ["artifacts.md", "report.md", "findings.cnl", "observations.cnl", "generation-plan.cnl", "coverage.md", "diagnostics.md", "assurance.md", "evaluation-assurance.md"];
  const outputPaths = [];
  for (const name of outputCandidates) {
    const path = resolve(taskRoot, "results", name);
    if (await exists(path)) outputPaths.push(path);
  }
  const command = `node nllAgent.mjs run \\\n  --agent-dir ${agentRelativePath} \\\n  --task-dir ${result.taskPath}`;
  const expected = result.expectedFindings?.join(", ") || definition.expectation;
  const observed = result.findings?.join(", ") || "none";
  return `
<p class="lead">This page is generated from the retained successful task, not from a hand-written fixture. It shows the exact natural-language evidence, task declaration, Codex-authored semantic programs, deterministic command, and retained outputs.</p>
<div class="callout"><strong>Observed acceptance.</strong> Status <code>${escapeHtml(result.status)}</code>; expected <code>${escapeHtml(expected)}</code>; observed <code>${escapeHtml(observed)}</code>; generated frames <code>${result.generatedFrames ?? 0}</code>; ordinary replay equivalence <code>${result.metrics?.replayEquivalent ?? "not recorded"}</code>.</div>
<h2>1. Natural-language source analyzed</h2>
<p>Retained at <code>${escapeHtml(result.sourcePath)}</code>.</p>
${codeBlock(await readFile(sourcePath, "utf8"), escapeHtml)}
<h2>2. Task instruction and generated task declaration</h2>
<p>The task identifier is <code>${escapeHtml(result.taskId)}</code>. The instruction passed to authoring was:</p>
${codeBlock(result.instruction ?? "See the complete task module below.", escapeHtml)}
${fullFile(taskModulePath, await readFile(taskModulePath, "utf8"), projectRoot, escapeHtml)}
<h2>3. Codex-generated IntentJS</h2>
<p>IntentJS selects the requested agent capability and output contract. The following is the complete task-owned code.</p>
${await sourceFilesHtml(intentFiles, projectRoot, escapeHtml)}
<h2>4. Codex-generated LongTextJS</h2>
<p>LongTextJS materializes only source-grounded meanings, exact anchors, contexts and coverage. All generated modules are included without shortening.</p>
${await sourceFilesHtml(longTextFiles, projectRoot, escapeHtml)}
<h2>5. Reusable ontology and applicable rule circuit</h2>
<p>The ontology and circuit were generated at agent scope from <code>examples/evaluations/${evaluationId}/agent-brief.md</code>, before this task was authored.</p>
${await sourceFilesHtml(ontologyFiles, projectRoot, escapeHtml)}
${await sourceFilesHtml(await exists(circuitPath) ? [circuitPath] : [], projectRoot, escapeHtml)}
<h2>6. Real coding-agent evidence</h2>
${authoringEvidence(result, escapeHtml)}
<p>The suite-level agent phases and their retained logs are indexed by <a href="../evaluations/${evaluationId}/reports/authoring.md">the authoring report</a>.</p>
<h2>7. Deterministic execution command</h2>
${codeBlock(command, escapeHtml, "shell")}
<p>This command does not invoke Codex. It imports the programs shown above, materializes the SemanticStore, plans compatible circuits, and writes task results.</p>
<h2>8. Primary human-facing Markdown CNL response</h2>
${await sourceFilesHtml([primaryResponse], projectRoot, escapeHtml)}
<p>The response circuit removed internal grounding and non-applicable results, grouped the material outcome, explained the matched semantic rule, and quoted only verified source spans. This is the result intended for a human or a later formatting/summarization LLM.</p>
<h2>9. Evaluation and model-free replay acceptance</h2>
<table><thead><tr><th>Check</th><th>Observed</th></tr></thead><tbody>
<tr><td>Response contract</td><td>${result.metrics?.responseContract ?? "not recorded"}</td></tr>
<tr><td>Finding replay equivalence</td><td>${result.metrics?.replayEquivalent ?? "not recorded"}</td></tr>
<tr><td>Response replay equivalence</td><td>${result.metrics?.responseReplayEquivalent ?? "not recorded"}</td></tr>
<tr><td>Abstract/symbolic auxiliary circuits</td><td>${result.assurance?.length ?? 0}</td></tr>
</tbody></table>
<p>The complete executable assurance projections remain in the task artifact manifest as technical evidence; they are not embedded in the answer.</p>
<h2>10. Complete retained supporting textual outputs</h2>
${await sourceFilesHtml(outputPaths, projectRoot, escapeHtml)}
<p>Executable findings, assurance modules, response-circuit trace, and the binary trace remain under <code>${escapeHtml(result.taskPath)}/results/</code>. See the <a href="../${result.taskPath}/results/artifacts.md">artifact manifest</a> and <a href="../evaluations/${evaluationId}/reports/summary.md">suite summary</a>.</p>`;
}

async function tutorialIndexContent(completed, agentAuthoring, projectRoot, escapeHtml) {
  const agentRoot = resolve(projectRoot, agentRelativePath);
  const agentFiles = [
    resolve(agentRoot, "source", "agent-brief.md"),
    resolve(agentRoot, "agent.mjs"),
    resolve(agentRoot, "profiles", "minimal-core.profile.mjs"),
    resolve(agentRoot, "architecture-plan.mjs"),
    resolve(agentRoot, "work-plan.mjs")
  ];
  const presentAgentFiles = [];
  for (const path of agentFiles) if (await exists(path)) presentAgentFiles.push(path);
  return `<p class="lead">These are not four copies of a run command. Each page is built from one retained evaluation task and contains the complete analyzed source, task instruction and declaration, Codex-generated IntentJS and LongTextJS, reusable ontology and applicable circuit, coding-agent evidence, exact deterministic command and complete textual outputs.</p>
<div class="tree">${caseDefinitions.map((definition) => `<div><strong><a href="${definition.name}">${definition.title.replace("Tutorial: ", "")}</a></strong><span>Expected semantic outcome <code>${definition.expectation}</code>; retained task ${completed.get(definition.id) ? `<code>${completed.get(definition.id).taskId}</code>` : "not yet available"}.</span></div>`).join("")}</div>
<h2>Complete reusable agent input and definition</h2>
<p>The first file is the exact natural-language brief. The remaining files are canonical agent programs produced by the real architect phase and used by later ontology, circuit and task phases.</p>
${await sourceFilesHtml(presentAgentFiles, projectRoot, escapeHtml)}
<h2>Real agent-level Codex runs</h2>
${authoringEvidence({ authoring: agentAuthoring }, escapeHtml)}
<h2>Retained earlier evaluation iterations</h2>
<p>Rerunning the suite never erases the preceding report set. Earlier reports point to their original random-ID tasks and coding runs, so creation, failure, repair, and final validation remain distinguishable.</p>
${await archivedIterationsHtml(projectRoot, escapeHtml)}
<h2>Run the authoring evaluation</h2><pre><code>node nllAgent.mjs evaluate --suite agentic-nl-e2e --invoke-agent</code></pre>
<p>The suite creates the isolated agent from the brief above, runs agent-level architect/ontology/circuit phases, creates four random-ID tasks, runs task-level intent/longtext phases, executes the semantic programs and replays them without Codex. Reports are retained under <code>evaluations/agentic-nl-e2e/reports/</code>.</p>`;
}

function staticPages() {
  return [
    {
      name: "agentic-authoring.html",
      title: "Agentic Natural-Language Authoring",
      kicker: "Natural language to inspectable programs",
      content: `<p class="lead">nllAgent behaves like a prompt-driven semantic system at its operator boundary, but it separates model-dependent authoring from deterministic reasoning. Codex reads a natural-language agent brief or task, uses installed nll skills and live catalogs, and writes canonical JavaScript DSL programs. The runtime subsequently executes and replays those programs without a model call.</p>
<pre class="mermaid">flowchart LR
  Brief[Agent brief] --> AgentCodex[Codex: architect, ontology, circuit]
  AgentCodex --> AgentPrograms[Agent profile, OntologyJS, CircuitJS, tests]
  Prompt[Task instruction plus source] --> TaskCodex[Codex: IntentJS, LongTextJS]
  AgentPrograms --> Context[Resolved catalogs and skills]
  Context --> TaskCodex
  TaskCodex --> TaskPrograms[Task intent, grounding, tests]
  AgentPrograms --> Runtime[Deterministic planner and store]
  TaskPrograms --> Runtime
  Runtime --> Semantic[Findings and typed CNL frames]
  Semantic --> Response[Intent-selected response circuits]
  Response --> Output[Grounded Markdown CNL plus separate technical evidence]
  Output --> Replay[Model-free replay]</pre>
<h2>What the framework does</h2><p>It creates folders, decodes source bytes into stable units and spans, resolves project and agent dependencies, builds compact catalogs, installs the selected skill chain, starts the coding-agent adapter, retains logs and before/after artifact paths, and runs deterministic acceptance checks.</p>
<h2>What the framework does not do</h2><p>It does not infer ontology concepts, source claims, IntentJS policy, circuit logic, findings, or generated answers during ingestion. Those are coding-agent authoring decisions. The durable boundary is executable <code>.mjs</code> code, never a JSON approximation or an uninspectable completion.</p>
<h2>Real end-to-end command</h2><pre><code>node nllAgent.mjs evaluate --suite agentic-nl-e2e --invoke-agent</code></pre>
<p>The suite first builds an isolated reusable agent from a natural-language brief, then creates four random-ID tasks and asks Codex to author each task's intent and grounding. It accepts results only after semantic checks, concrete execution, expected outcomes and ordinary replay. See <a href="tutorials.html">the four concrete tutorials</a> and <a href="specsLoader.html?spec=DS041-agentic-natural-language-authoring.md">DS041</a>.</p>
<h2>When inherited semantics are insufficient</h2><p>The optional <a href="adaptive-authoring.html">adaptive analysis loop</a> additionally audits task ontology and circuits, creates only missing task-local code, and iterates mandatory Codex review over concrete, abstract, and symbolic evidence. The complete executed case is in <a href="tutorial-adaptive-cold-chain.html">the adaptive cold-chain tutorial</a>.</p>`
    },
    {
      name: "project-structure.html",
      title: "Project Folders and Ownership",
      kicker: "Where code, knowledge, tasks and evidence live",
      content: `<p class="lead">Folder placement is part of the semantic contract. Framework code is reusable infrastructure, packs are default knowledge, an agent owns reusable local expertise, and a task owns one instruction, its sources, grounded interpretation, local code and results.</p>
<div class="tree">
<div><strong>design-specifications/</strong><span>Original DS-000 through DS-019, preserved without shortening.</span></div>
<div><strong>docs/specs/</strong><span>Official contiguous DS000+ set; generated from the originals, skills and additive contracts.</span></div>
<div><strong>framework/sdk/</strong><span>Fluent OntologyJS, IntentJS, LongTextJS, CircuitJS, CNL, agent and evaluation constructors.</span></div>
<div><strong>framework/runtime/</strong><span>SemanticStore, queries, planner, scheduler, concrete and assurance algorithms, traces and cache.</span></div>
<div><strong>framework/packs/</strong><span>Core language plus optional reusable domain ontology, circuits, signals, CNL and pack tests.</span></div>
<div><strong>framework/tools/</strong><span>Folder resolution, source decoding, context generation, coding-agent adapters and execution helpers.</span></div>
<div><strong>framework/cli/</strong><span>Thin command routing over reusable SDK, runtime and tool modules.</span></div>
<div><strong>nll-skills/</strong><span>Ten coding-agent workflows; each has human instructions and an executable dependency/tool contract.</span></div>
<div><strong>profiles/</strong><span>Executable default pack and planner policy; an agent can provide a same-name local override.</span></div>
<div><strong>agents/&lt;name&gt;/</strong><span>Reusable local ontology, circuits, CNL, profiles, tests, coding runs and tasks.</span></div>
<div><strong>agents/&lt;name&gt;/tasks/&lt;id&gt;/</strong><span>Instruction, decoded sources, IntentJS, LongTextJS, local extensions, tests, runs and results.</span></div>
<div><strong>examples/</strong><span>Committed executable agents, tasks and evaluation declarations.</span></div>
<div><strong>evaluations/</strong><span>Retained real evaluation agents, random-ID tasks, Codex logs, semantic programs and reports.</span></div>
<div><strong>tools/</strong><span>Deterministic generators and project-wide verification utilities.</span></div>
<div><strong>docs/</strong><span>Generated HTML documentation, relative navigation, loader and static assets.</span></div>
</div>
<h2>Resolution order</h2><p>The runtime loads mandatory framework defaults, the selected profile, agent-local modules, then task-local modules. Later layers may extend or explicitly override where the contract permits, but source assertions never become stable pack facts implicitly.</p>
<h2>Generated task anatomy</h2><pre><code>tasks/task-ID/
  task.mjs
  source/                 original files, source-map.mjs, extractors/
  intent/intent.mjs       requested concerns, outputs and selection
  longtext/               root and source-unit semantic programs
  ontologies/ circuits/   only genuinely task-local semantic extensions
  cnl/                    optional task-local response circuits
  tests/                  task semantic and anchor tests
  runs/run-ID/            skills, context, instructions and Codex logs
  results/response.md     primary tagged, grounded Markdown CNL answer
  results/artifacts.md    semantic programs and technical evidence index
  results/                plan, raw findings, canonical CNL, trace and assurance
                          adaptive cycle records when DS042 is enabled</code></pre>
<p>The CLI accepts either names or explicit folders: <code>--agent</code>/<code>--agent-dir</code> and <code>--task</code>/<code>--task-dir</code>. Generated imports are relative to the target module and selected project root.</p>`
    },
    {
      name: "adaptive-authoring.html",
      title: "Adaptive Analysis Loop",
      kicker: "Task-local semantic growth with deterministic acceptance",
      content: `<p class="lead">Adaptive analysis is the explicit fallback for a complex source whose requested operation is not covered realistically by inherited framework, profile, and agent knowledge. It uses Codex to add only missing task-local semantic programs, then tests and executes the dynamically composed plan until the bounded review contract passes.</p>
<pre class="mermaid">flowchart TD
  Input[Task instruction and exact source] --> Inherit[Resolve framework, profile, and agent knowledge]
  Inherit --> Intent[Codex: missing IntentJS]
  Intent --> Ontology[Codex: ontology sufficiency audit]
  Ontology --> LongText[Codex: source-grounded LongTextJS]
  LongText --> Circuit[Codex: circuit sufficiency audit]
  Circuit --> Response[Codex: response-policy sufficiency audit]
  Response --> Compose[Planner and response circuits compose inherited plus task-local behavior]
  Compose --> Validate[Tests, anchors, providers, concrete, Markdown CNL, abstract, symbolic]
  Validate --> Review[Mandatory Codex multi-skill review]
  Review -->|failures remain and cycles available| Compose
  Review -->|accepted| Replay[Model-free replay]</pre>
<h2>CLI contract</h2>
<pre><code>node nllAgent.mjs analyze \\
  --agent-dir path/to/agent --task-dir path/to/task \\
  --author-adaptive --authoring-cycles 3 --assurance all

# Domain-specific acceptance for the retained DS042 case.
node evaluations/adaptive-task-e2e/validate.mjs</code></pre>
<table><thead><tr><th>Parameter</th><th>Contract</th></tr></thead><tbody>
<tr><td><code>--author-adaptive</code></td><td>Explicitly permits Codex to audit and create missing task-owned semantic code.</td></tr>
<tr><td><code>--authoring-cycles 1..10</code></td><td>Maximum Codex review repairs after initial intent, ontology, LongText, and circuit phases; default 3.</td></tr>
<tr><td><code>--assurance none|abstract|symbolic|all</code></td><td>Auxiliary acceptance required from every selected non-core circuit; adaptive default is <code>all</code>.</td></tr>
<tr><td><code>--adaptive-allow-unknown</code></td><td>Allows unknown-only concrete output to be material when indeterminacy is the requested correct result.</td></tr>
</tbody></table>
<h2>What may change</h2><p>The task may gain executable <code>intent/</code>, <code>ontologies/</code>, <code>longtext/</code>, <code>circuits/</code>, <code>cnl/</code>, and <code>tests/</code> modules plus retained <code>runs/</code> and <code>results/</code>. Framework and reusable agent code remain inherited and unchanged. A proven task extension can be proposed for later promotion, but adaptive execution never promotes it silently.</p>
<h2>Acceptance boundary</h2><p>Ontology diagnostics, exact source anchors, requested capability providers, focused tests, blocking diagnostics, material non-core concrete findings or frames, qualitative tagged Markdown CNL with exact quotations, abstract convergence, non-empty non-truncated symbolic paths, an equivalent second model-free execution including the response digest, and mandatory review are all checked. Reaching the cycle limit is a typed failure, not a partial success.</p>
<p>See <a href="tutorial-adaptive-cold-chain.html">the complete real cold-chain run</a> and <a href="specsLoader.html?spec=DS042-adaptive-task-local-authoring-and-verification.md">DS042</a>.</p>`
    },
    {
      name: "skills-workflow.html",
      title: "How Coding Skills Work",
      kicker: "Executable dependencies and direct semantic authoring",
      content: `<p class="lead">A skill is not a prose prompt copied into ten places. Each <code>nll-skills/&lt;id&gt;/</code> folder contains <code>SKILL.md</code> for Codex and <code>workflow.mjs</code> for the framework. The executable workflow names specifications, context artifacts, CLI tools, dependent skills, edit roots and phases.</p>
<pre class="mermaid">sequenceDiagram
  participant CLI
  participant Context as Context builder
  participant Skills as Skill resolver
  participant Codex
  participant Canonical as Agent/task files
  participant Checks as Deterministic checks
  CLI->>Skills: requested phase
  Skills->>Skills: transitive dependency order
  CLI->>Context: project, agent, task, profile, sources
  Context-->>Codex: SDK/ontology/circuit/profile/source/DS catalogs
  Skills-->>Codex: run-local SKILL.md and workflow.mjs
  Codex->>Canonical: direct edits to allowed .mjs and tests
  Codex-->>CLI: retained stdout, stderr and final response
  CLI->>Checks: imports, ontology, anchors, circuits and tests
  Checks-->>CLI: acceptance or typed failure</pre>
<h2>How dependencies are found</h2><p>The requested phase maps to a root skill. The loader imports its adjacent <code>workflow.mjs</code>, closes declared dependencies, and copies only those skill folders into the run. It never searches a hidden global skill directory. SDK and ontology knowledge comes from live project modules and generated run-local catalogs, so task code imports the real constructors instead of duplicating theory.</p>
<h2>Agent-level phases</h2><p><code>code architect</code>, <code>code ontology</code> and <code>code circuit</code> can work at agent scope from a retained brief. Their outputs are reusable profiles, ontologies, circuits, CNL and tests. Evaluation invokes the same adapter and context path.</p>
<h2>Task-level phases</h2><p><code>code intent</code> translates the requested operation into executable selection policy. <code>code longtext</code> translates decoded source text into grounded claims and coverage. Optional ontology or circuit phases are task-local only when the meaning or behavior is not reusable.</p>
<h2>Inspect before invoking Codex</h2><pre><code>node nllAgent.mjs context build --phase longtext \\
  --agent-dir path/to/agent --task-dir path/to/task
node nllAgent.mjs context show \\
  --agent-dir path/to/agent --task-dir path/to/task
node nllAgent.mjs code longtext \\
  --agent-dir path/to/agent --task-dir path/to/task --prepare-only</code></pre>
<p><code>--prepare-only</code> creates inspectable instructions, installed skills and catalogs without starting Codex. A real authoring run omits that flag and retains its process evidence.</p>`
    }
  ];
}

function dslPages(escapeHtml) {
  return [
    {
      name: "ontologyjs.html",
      title: "OntologyJS in Detail",
      kicker: "Reusable semantic identities and constructors",
      content: `<p class="lead">OntologyJS defines what kinds of things may be represented. A sealed ontology module owns pack-qualified concepts, roles, relations, frames, lexicalizations, stable facts, laws and capabilities, then exposes constructors that LongTextJS and circuits share by identity.</p>
<h2>Authoring rules</h2><ul><li>Reuse core or loaded identities when their meaning is exact; never redefine by similar spelling.</li><li>Declare frame roles, ranges and cardinality explicitly.</li><li>Keep source claims in LongTextJS and application judgments in circuits.</li><li>Use stable ontology facts only for reusable scoped knowledge with provenance classification.</li><li>Test construction, closure, imports, affected circuits and cross-pack identity.</li></ul>
<h2>Program shape</h2><pre><code>const O = ontology("agent.operational-policy", "1.0.0");
export const action = O.role(role("action").range(Core.Event));
export const OperationalRule = O.entity(
  entityKind("OperationalRule")
    .subtypeOf(Core.SemanticEntity)
    .role(requires(action, exactlyOne()))
    .provide(capability("RuleContradictionReview"))
);
export default O.seal();

const rule = OperationalRule(action(actionTerm));</code></pre>
<p>Exact working ontology code generated from natural language is reproduced in each <a href="tutorials.html">agentic tutorial</a>. The live API is available with <code>node nllAgent.mjs sdk usage --surface ontology</code>.</p>
${dslReference("ontology", escapeHtml)}`
    },
    {
      name: "intentjs.html",
      title: "IntentJS in Detail",
      kicker: "Task selection, outputs and evidence policy",
      content: `<p class="lead">IntentJS states what one task asks the semantic runtime to do. It combines explicit instruction precedence, profile and pack constraints, concerns, target text, outputs, evidence policy, assurance, exclusions, resources and the fallback used when selection remains unclear.</p>
<h2>Resolution precedence</h2><ol><li>Explicit CLI and system restrictions.</li><li>Task IntentJS declarations.</li><li>Agent default and selected profile.</li><li>Cheap lexical and already-materialized semantic signals.</li><li>Declared fallback, normally all compatible within loaded packs.</li></ol>
<h2>Program shape</h2><pre><code>export default intent("review-contradictory-rules")
  .mode(analyze())
  .concerns(concern("RuleContradictionReview"))
  .outputs(findings(), structuralTrace())
  .evidence(sourceGrounded(), interpretationRobust())
  .assurance(concreteExecution(), symbolicDecisionCoverage())
  .whenUnclear(allCompatible())
  .seal();</code></pre>
<p>Signal inference can advise the coding agent and planner, but it does not silently author the canonical module. Presentation directives are imported from the CNL surface and passed through <code>.present(...)</code>. The complete generated intent for each concrete source is shown in the four tutorial pages.</p>
${dslReference("intent", escapeHtml)}`
    },
    {
      name: "longtextjs.html",
      title: "LongTextJS in Detail",
      kicker: "Grounded interpretation with explicit coverage",
      content: `<p class="lead">LongTextJS is executable source interpretation. Codex reads decoded evidence and creates terms, claims, contexts, alternatives, identity hypotheses, exact anchors and coverage witnesses. The ingester itself never performs that semantic translation.</p>
<h2>Core distinctions</h2><table><thead><tr><th>Value</th><th>Meaning</th></tr></thead><tbody><tr><td>Term</td><td>An entity, event, state, proposition or other ontology-constructed semantic value.</td></tr><tr><td>Claim</td><td>A source-attributed assertion about a term, with modality, polarity and context.</td></tr><tr><td>Grounding</td><td>An exact source span and provenance chain supporting the claim.</td></tr><tr><td>Alternative</td><td>A competing interpretation retained without premature collapse.</td></tr><tr><td>Coverage</td><td>An explicit witness that a region/concept was inspected; required before negative absence conclusions.</td></tr></tbody></table>
<h2>Program shape</h2><pre><code>const source = taskSource("source-001", registry);
const authorContext = reportedBy(author).seal();
const groundedRule = claim(ruleTerm)
  .within(authorContext)
  .grounding(groundedAt(source.spanByText("exact source words")));

export default describe("policy-source")
  .section(section("rules", sequence(groundedRule)))
  .coverage(coverage(OperationalRule).forScope("rules").complete())
  .commit();</code></pre>
<p>Run <code>source verify-anchors</code>, <code>longtext check</code>, <code>longtext execute</code> and focused queries before accepting the phase. Complete generated unit and root modules are included in every concrete tutorial.</p>
${dslReference("longtext", escapeHtml)}`
    },
    {
      name: "circuitjs.html",
      title: "CircuitJS in Detail",
      kicker: "Reusable analysis, generation and assurance",
      content: `<p class="lead">CircuitJS defines executable semantic behavior over the logical store. A circuit declares capability requirements and provisions, semantic reads and outputs, then composes queries, normalization, decisions, procedural algorithms, evidence-bearing findings, typed CNL frames and optional assurance interpretations.</p>
<h2>Stages and contracts</h2><table><thead><tr><th>Stage</th><th>Responsibility</th></tr></thead><tbody><tr><td>Query</td><td>Select typed semantic structures and retain bindings, contexts and evidence.</td></tr><tr><td>Normalize</td><td>Canonicalize values without erasing provenance or alternatives.</td></tr><tr><td>Reason/decide</td><td>Apply decision tables or a declared analysis method with explicit unknown/conflict behavior.</td></tr><tr><td>Emit</td><td>Create findings or CNL frames with stable codes, statuses and evidence identities.</td></tr><tr><td>Assure</td><td>Expose abstract or symbolic interpretations only where declared.</td></tr></tbody></table>
<h2>Program shape</h2><pre><code>const actionValue = variable(Core.Event, "action");
const conditionValue = variable(Core.Proposition, "condition");
const effectValue = variable(RuleEffect, "effect");
const rules = match(OperationalRule(
  action(actionValue), condition(conditionValue), effect(effectValue)
)).as("operational-rules");
const verdict = proceduralStage("compare-rule-effects")
  .reads(rules)
  .writes("Finding")
  .run(compareCompatibleScopes);

export default circuit("agent.rule-contradiction", "1.0.0")
  .requires(capability("RuleContradictionReview"))
  .provides(capability("RuleContradictionFinding"), guarantee("evidence-bearing"))
  .use(rules, verdict)
  .emit(emitFinding(verdict))
  .assurance(abstractPreflight(), symbolicDecisionCoverage())
  .seal();</code></pre>
<p>A missing fact is not automatically satisfaction. Circuits require coverage before absence, return <code>UNKNOWN</code> when evidence is incomplete, preserve <code>CONFLICT</code>, and use <code>NOT_APPLICABLE</code> for irrelevant stores. The four tutorial pages include the full reusable circuits generated by Codex.</p>
${dslReference("circuit", escapeHtml)}`
    },
    {
      name: "response-circuits.html",
      title: "Response Circuits and Markdown CNL",
      kicker: "Intent-selected filtering, grouping, evidence and presentation",
      content: `<p class="lead">Response circuits operate after semantic CircuitJS. They do not decide truth; they select applicable findings and typed frames, suppress internal or non-applicable results, group and count material conclusions, explain the matched rule, rank exact quotations, and render the tagged <code>response.md</code> document.</p>
<h2>Composition</h2><pre class="mermaid">flowchart LR
  Findings[Findings and typed frames] --> Material[Material selection circuit]
  Intent[IntentJS .present directives] --> Style[Intent style circuit]
  Material --> Group[Grouping and counting circuit]
  Style --> Group
  Group --> Evidence[Rule and source evidence enrichment]
  Evidence --> Markdown[Tagged Markdown CNL response]
  Findings --> Technical[Separate executable and debug artifacts]</pre>
<h2>IntentJS example</h2><pre><code>import { intent, analyze, markdownCnl } from "./framework/sdk/intent/index.mjs";
import { evidenceLed, groupResultsBy, quoteSourceEvidence } from "./framework/sdk/cnl/index.mjs";

export default intent("policy-review")
  .mode(analyze())
  .outputs(markdownCnl())
  .present(evidenceLed(), groupResultsBy("status-family"), quoteSourceEvidence())
  .seal();</code></pre>
<h2>Resolution and override points</h2><table><thead><tr><th>Layer</th><th>Executable path</th><th>Use</th></tr></thead><tbody>
<tr><td>Framework</td><td><code>framework/runtime/response/default-circuits.mjs</code></td><td>Material selection, default style, grouping/counting and generated-frame selection.</td></tr>
<tr><td>Agent</td><td><code>agent/cnl/*.response.circuit.mjs</code></td><td>Reusable audience or domain presentation policy.</td></tr>
<tr><td>Task</td><td><code>task/cnl/*.response.circuit.mjs</code></td><td>Source-specific extension or explicit same-identity override.</td></tr>
</tbody></table>
<h2>Stable Markdown CNL markers</h2><table><thead><tr><th>Marker</th><th>Purpose</th></tr></thead><tbody>
<tr><td><code>[CNL:DOCUMENT]</code></td><td>Declares style, grouping and selected result count.</td></tr>
<tr><td><code>[CNL:GROUP]</code></td><td>Declares a non-empty semantic group and exact count.</td></tr>
<tr><td><code>[CNL:FINDING]</code></td><td>Declares code, status, group and material/supporting classification.</td></tr>
<tr><td><code>[CNL:NO-MATERIAL-RESULT]</code></td><td>One compact statement used instead of listing non-applicable circuits.</td></tr>
</tbody></table>
<p>See <a href="specsLoader.html?spec=DS043-primary-markdown-cnl-response.md">DS043</a> and <a href="specsLoader.html?spec=DS044-response-circuit-composition-and-intent-presentation.md">DS044</a>.</p>
${dslReference("cnl", escapeHtml)}`
    }
  ];
}

export async function buildAgenticDocumentationPages({ root, escapeHtml }) {
  const results = await loadResults(root);
  const agentAuthoring = await loadAgentAuthoring(root);
  const adaptiveRecord = await loadAdaptiveRecord(root);
  const pages = [...staticPages(), ...dslPages(escapeHtml)];
  const completed = new Map(results.filter((result) => result.status === "completed").map((result) => [result.sourceCaseId, result]));
  pages.push({
    name: "tutorials.html",
    title: "Agentic Tutorial Index",
    kicker: "Four real natural-language authoring cases",
    content: await tutorialIndexContent(completed, agentAuthoring, root, escapeHtml)
  });
  for (const definition of caseDefinitions) {
    pages.push({
      name: definition.name,
      title: definition.title,
      kicker: "Retained source, generated programs and observed output",
      content: await tutorialContent(definition, completed.get(definition.id), root, escapeHtml)
    });
  }
  pages.push({
    name: "tutorial-adaptive-cold-chain.html",
    title: "Tutorial: Adaptive Cold-Chain Audit",
    kicker: "Missing semantics authored, composed, reviewed, and replayed",
    content: await adaptiveTutorialContent(adaptiveRecord, root, escapeHtml)
  });
  return pages;
}
