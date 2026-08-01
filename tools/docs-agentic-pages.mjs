import { relative, resolve } from "node:path";
import {
  artifactBrowser,
  exists,
  filesBelow,
  loadDefaultIfPresent
} from "./docs-file-helpers.mjs";
import {
  adaptiveTaskRelativePath,
  agentRelativePath,
  caseDefinitions,
  evaluationId
} from "./docs-evaluation-cases.mjs";
import { dslReference } from "./docs-dsl-reference.mjs";

function ownedArtifact(owner, path, ownerRoot) {
  const localPath = relative(ownerRoot, path).split("\\").join("/");
  return Object.freeze({ path, displayRoot: ownerRoot, label: `${owner}/${localPath}` });
}

function ownedArtifacts(owner, paths, ownerRoot) {
  return paths.map((path) => ownedArtifact(owner, path, ownerRoot));
}

function textArtifact(label, content, language = "text") {
  return Object.freeze({ label, content, language });
}

function taskInstructionText(task) {
  return (task?.instructions ?? [])
    .filter((directive) => directive.kind === "instruction")
    .map((directive) => directive.value)
    .join("\n\n");
}

async function loadResults(projectRoot) {
  const path = resolve(projectRoot, "evaluations", evaluationId, "reports", "task-results.mjs");
  return await loadDefaultIfPresent(path, []);
}

async function loadAdaptiveRecord(projectRoot) {
  const path = resolve(projectRoot, adaptiveTaskRelativePath, "results", "adaptive-authoring.mjs");
  return await loadDefaultIfPresent(path, null);
}

async function adaptiveTutorialContent(record, projectRoot, escapeHtml) {
  const taskRoot = resolve(projectRoot, adaptiveTaskRelativePath);
  if (!record?.accepted) {
    throw new Error("Adaptive tutorial generation requires a retained, accepted DS042 evaluation result");
  }
  const taskPath = resolve(taskRoot, "task.mjs");
  const sourcePath = resolve(taskRoot, "source", "cold-chain-transfer.txt");
  const task = await loadDefaultIfPresent(taskPath, null);
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
  const primaryResponse = resolve(taskRoot, "results", "response.md");
  const artifactStages = await artifactBrowser({
    Input: [
      textArtifact("task/task-instruction.txt", taskInstructionText(task)),
      ownedArtifact("task", sourcePath, taskRoot)
    ],
    Intermediate: [
      ownedArtifact("task", taskPath, taskRoot),
      ...ownedArtifacts("task", semanticFiles, taskRoot)
    ],
    Output: [ownedArtifact("task", primaryResponse, taskRoot)]
  }, projectRoot, escapeHtml);
  return `<p class="lead">This run asks whether sample AX-17 may be released after a custody transfer. The inherited agent deliberately contains only core-language knowledge, so Codex must add the missing cold-chain vocabulary and executable review behavior inside this task before the source can be evaluated.</p>
<h2>Input ownership and requested result</h2>
<p><strong>Agent input:</strong> none. <code>adaptive-core-agent</code> is a pre-existing minimal agent and is not authored from a brief in this run. <strong>Task input:</strong> <code>task/task-instruction.txt</code> requests a complete release-support audit, while <code>task/source/cold-chain-transfer.txt</code> supplies three policy rules, the AX-17 transfer record, and the memo's release conclusion.</p>
<p>The desired answer is not a generic cold-chain summary. It must decide whether every release precondition is supported, preserve unknowns, quote decisive evidence, and remain replayable from committed semantic code.</p>
<h2>Retained input, authored code, and public answer</h2>
<p>The three tabs are strict stage boundaries. <strong>Input</strong> contains only the task's natural-language material. <strong>Intermediate</strong> contains only task-owned executable programs and tests created by the adaptive run. <strong>Output</strong> contains only the public Markdown CNL answer. Every visible path starts with its semantic owner.</p>
${artifactStages}
<h2>How the task text became executable semantics</h2>
<p><code>task/intent/intent.mjs</code> selects <code>ColdChainTransferReleaseSupport</code>, complete-source scope, evidence-led presentation, and concrete plus auxiliary assurance. The task-local ontology introduces transfers, seals, readings, calibration validity, acknowledgements, excursions, quarantine support, and release conclusions because the inherited agent has none of those meanings. LongTextJS then grounds the CT-1 prerequisites, the CT-2 limits on what a record proves, the CT-3 quarantine alternative, and every relevant AX-17 fact at exact source spans.</p>
<p>The important translation is semantic, not lexical: the recorded 6.2 °C and 6.7 °C readings satisfy the range terms, but the expired TH-9 certificate becomes invalid calibration at transfer time; “no acknowledgement by Vale Laboratory” becomes denied receiving-party acknowledgement. The task circuit joins those values to the release conclusion and keeps the excursion/quarantine branch unresolved because the source reports no excursion rather than supplying a stability-study path.</p>
<h2>Why the retained answer is a violation</h2>
<p><code>task/results/response.md</code> reports one material <code>COLD_CHAIN_RELEASE_UNSUPPORTED:VIOLATED</code> result. It names the failed calibration and receiving-acknowledgement requirements, quotes the policy prerequisites, the expired certificate, North Courier's acknowledgement, Vale Laboratory's missing acknowledgement, and the conclusion being tested. Internal authoring logs and symbolic projections are deliberately absent from this answer because they explain validation mechanics, not whether AX-17 may be released.</p>`;
}

async function tutorialContent(definition, result, projectRoot, escapeHtml) {
  if (!result) {
    throw new Error(`Tutorial generation requires a retained result for ${definition.id}`);
  }
  const taskRoot = resolve(projectRoot, result.taskPath);
  const agentRoot = resolve(projectRoot, agentRelativePath);
  const sourcePath = resolve(taskRoot, "source", "source-001.txt");
  const intentFiles = await filesBelow(resolve(taskRoot, "intent"), ".mjs");
  const longTextFiles = await filesBelow(resolve(taskRoot, "longtext"), ".mjs");
  const ontologyFiles = await filesBelow(resolve(projectRoot, agentRelativePath, "ontologies"), ".mjs");
  const circuitPath = resolve(projectRoot, agentRelativePath, "circuits", definition.circuit);
  const agentBriefPath = resolve(agentRoot, "source", "agent-brief.md");
  const agentModulePath = resolve(agentRoot, "agent.mjs");
  const agentProfilePath = resolve(agentRoot, "profiles", "minimal-core.profile.mjs");
  const taskModulePath = resolve(taskRoot, "task.mjs");
  const primaryResponse = resolve(taskRoot, "results", "response.md");
  const expected = result.expectedFindings?.join(", ") || definition.expectation;
  const artifactStages = await artifactBrowser({
    Input: [
      ownedArtifact("agent", agentBriefPath, agentRoot),
      textArtifact("task/task-instruction.txt", result.instruction ?? ""),
      ownedArtifact("task", sourcePath, taskRoot)
    ],
    Intermediate: [
      ownedArtifact("agent", agentModulePath, agentRoot),
      ownedArtifact("agent", agentProfilePath, agentRoot),
      ...ownedArtifacts("agent", ontologyFiles, agentRoot),
      ...(await exists(circuitPath) ? [ownedArtifact("agent", circuitPath, agentRoot)] : []),
      ownedArtifact("task", taskModulePath, taskRoot),
      ...ownedArtifacts("task", intentFiles, taskRoot),
      ...ownedArtifacts("task", longTextFiles, taskRoot)
    ],
    Output: [ownedArtifact("task", primaryResponse, taskRoot)]
  }, projectRoot, escapeHtml);
  return `<p class="lead">${escapeHtml(definition.purpose)}</p>
<div class="callout"><strong>Retained result.</strong> The run completed with target result <code>${escapeHtml(expected)}</code>; generated frames <code>${result.generatedFrames ?? 0}</code>; model-free replay equivalence <code>${result.metrics?.replayEquivalent ?? "not recorded"}</code>. Other circuits that returned <code>NOT_APPLICABLE</code> remain technical evidence and are not rendered as public findings.</div>
<h2>Input ownership and requested behavior</h2>
<p><strong>Agent input:</strong> <code>agent/source/agent-brief.md</code> asks Codex to create reusable operational-policy vocabulary and four source-independent circuit capabilities. <strong>Task input:</strong> <code>task/task-instruction.txt</code> selects what this run must do, and <code>task/source/source-001.txt</code> is the exact evidence it must interpret. The agent brief is shared by all four cases; the task instruction and source are case-specific.</p>
<h2>Retained input, executable interpretation, and public answer</h2>
<p><strong>Input</strong> contains only natural-language material. <strong>Intermediate</strong> first lists reusable <code>agent/</code> programs authored from the brief, then <code>task/</code> programs authored for this source. <strong>Output</strong> contains only <code>task/results/response.md</code>. The full repository path remains attached as metadata, but the visible labels keep only the ownership boundary needed to understand the example.</p>
${artifactStages}
<h2>From the agent brief to reusable behavior</h2>
<p><code>agent/ontologies/operational-policy.ontology.mjs</code> supplies stable identities for operational rules, exception invocations, justification records, safety conclusions, support relations, and procedure requests. <code>agent/circuits/${escapeHtml(definition.circuit)}</code> implements the selected capability over semantic store values; it does not search the raw source. <code>agent/agent.mjs</code> and the minimal profile load only core language plus this agent-owned knowledge, which keeps source-specific facts inside the task.</p>
<h2>From this task's text to executable meaning</h2>
<p>${escapeHtml(definition.translation)}</p>
<p>The visible <code>task/intent/intent.mjs</code> contains that operation and presentation policy. The files below <code>task/longtext/</code> contain the actual terms, claims, polarities, modalities, exact source spans, and coverage witnesses used by the circuit.</p>
<h2>Why this CNL answer follows</h2>
<p>${escapeHtml(definition.interpretation)}</p>`;
}

async function tutorialIndexContent(completed, escapeHtml) {
  const cases = caseDefinitions.map((definition) => `<article class="card"><h3><a href="${definition.name}">${definition.title.replace("Tutorial: ", "")}</a></h3><p>${escapeHtml(definition.purpose)}</p><p>The retained public result is <code>${definition.expectation}</code>; evaluation evidence is ${completed.has(definition.id) ? "present and accepted" : "missing, so regeneration must fail"}.</p></article>`).join("");
  return `<p class="lead">These tutorials show the system's real public contract: natural-language material is authored into inspectable JavaScript semantic programs, those programs execute deterministically, and the user receives one grounded Markdown CNL answer.</p>
<h2>Two kinds of natural-language input</h2>
<p>An <strong>agent input</strong> is a reusable brief. Codex translates it into agent-owned OntologyJS, CircuitJS, profiles, CNL behavior, and tests that apply to many tasks. A <strong>task input</strong> is one instruction plus one or more source texts. Codex translates it into task-owned IntentJS and LongTextJS, with local ontology or circuits only when inherited behavior is insufficient. The file explorers retain these owners explicitly as <code>agent/…</code> and <code>task/…</code>.</p>
<h2>Reusable rule-review agent with four different tasks</h2>
<div class="card-grid">${cases}</div>
<h2>Fixed and adaptive variants</h2>
<div class="card-grid"><article class="card"><h3><a href="tutorial-agent-task.html">Minimal fixed-agent example</a></h3><p>A small pre-existing validation agent processes one incident text and returns <code>ORDER_OK:SATISFIED</code>. There is no agent brief in this run, so only task text appears under Input.</p></article>
<article class="card"><h3><a href="tutorial-adaptive-cold-chain.html">Adaptive cold-chain audit</a></h3><p>A core-only pre-existing agent cannot represent the input domain. Codex therefore authors task-local ontology, LongTextJS, circuit, response policy, and tests before returning <code>COLD_CHAIN_RELEASE_UNSUPPORTED:VIOLATED</code>.</p></article></div>
<p>CLI commands, Codex process logs, abstract interpretation, symbolic coverage and evaluation metrics are documented under Workflows. They are intentionally not separate tutorial stories because they do not change the application-facing input-to-CNL contract.</p>`;
}

function staticPages() {
  return [
    {
      name: "agentic-authoring.html",
      title: "Agentic Natural-Language Authoring",
      kicker: "Natural language to inspectable programs",
      content: `<p class="lead">nllAgent behaves like a prompt-driven semantic system at its operator boundary, but it separates model-dependent authoring from deterministic reasoning. Codex reads a natural-language agent brief or task, uses installed nll skills and live catalogs, and writes canonical JavaScript DSL programs. The runtime subsequently executes and replays those programs without a model call.</p>
<h2>What happens from the programmer's perspective</h2>
<table><thead><tr><th>Step</th><th>Input</th><th>Who acts</th><th>Output</th></tr></thead><tbody>
<tr><td>1. Teach reusable behavior</td><td>Natural-language agent brief</td><td>Codex uses architect, ontology and circuit skills.</td><td>Agent profiles, OntologyJS, CircuitJS, response policies and tests.</td></tr>
<tr><td>2. Describe one task</td><td>Task instruction and exact source text</td><td>Codex uses IntentJS and LongTextJS skills, plus task-local ontology/circuit skills when required.</td><td>Task-owned executable semantic programs.</td></tr>
<tr><td>3. Run deterministically</td><td>Agent and task programs</td><td>The planner, SemanticStore and selected circuits execute without a model call.</td><td>Typed findings or generation frames.</td></tr>
<tr><td>4. Present and replay</td><td>Material results and IntentJS presentation policy</td><td>Response circuits render Markdown CNL; a second run verifies equivalence.</td><td><code>response.md</code> plus separate technical evidence.</td></tr>
</tbody></table>
<h2>What the framework does</h2><p>It creates folders, decodes source bytes into stable units and spans, resolves project and agent dependencies, builds compact catalogs, installs the selected skill chain, starts the coding-agent adapter, retains logs and before/after artifact paths, and runs deterministic acceptance checks.</p>
<h2>What the framework does not do</h2><p>It does not infer ontology concepts, source claims, IntentJS policy, circuit logic, findings, or generated answers during ingestion. Those are coding-agent authoring decisions. The durable boundary is executable <code>.mjs</code> code, never a JSON approximation or an uninspectable completion.</p>
<h2>Real end-to-end command</h2><pre><code># Ask Codex to author the reusable agent and four task programs, then execute and replay every case.
node nllAgent.mjs evaluate --suite agentic-nl-e2e --invoke-agent</code></pre>
<p>The suite first builds an isolated reusable agent from a natural-language brief, then creates four random-ID tasks and asks Codex to author each task's intent and grounding. It accepts results only after semantic checks, concrete execution, expected outcomes and ordinary replay. See <a href="tutorials.html">the four concrete tutorials</a> and <a href="specsLoader.html?spec=DS041-agentic-natural-language-authoring.md">DS041</a>.</p>
<h2>When inherited semantics are insufficient</h2><p>The optional <a href="adaptive-authoring.html">adaptive analysis loop</a> additionally audits task ontology and circuits, creates only missing task-local code, and iterates mandatory Codex review over concrete, abstract, and symbolic evidence. The complete executed case is in <a href="tutorial-adaptive-cold-chain.html">the adaptive cold-chain tutorial</a>.</p>`
    },
    {
      name: "project-structure.html",
      title: "Project Folders and Ownership",
      kicker: "Where code, knowledge, tasks and evidence live",
      content: `<p class="lead">Folder placement is part of the semantic contract. Framework code is reusable infrastructure, packs are default knowledge, an agent owns reusable local expertise, and a task owns one instruction, its sources, grounded interpretation, local code and results.</p>
<div class="tree">
<div><strong>AGENTS.md</strong><span>Repository-wide coding, ownership, testing and documentation instructions.</span></div>
<div><strong>observations.md</strong><span>Uncertain or review-sensitive implementation decisions that need later discussion.</span></div>
<div><strong>insights.md</strong><span>Observed classes of problems found by real coding-agent runs and the regression controls added for them.</span></div>
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
<p><a href="../observations.md">Review the decision log</a> and <a href="../insights.md">inspect coding-agent validation insights</a>. Environment-managed <code>.agents/</code> content is deliberately outside the project product/build boundary and is neither edited nor published as nllAgent source.</p>
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
<h2>Adaptive lifecycle, step by step</h2>
<table><thead><tr><th>Step</th><th>Input</th><th>Action</th><th>Output or decision</th></tr></thead><tbody>
<tr><td>1. Audit inherited knowledge</td><td>Task instruction, source, framework/profile/agent catalogs</td><td>Resolve which requested meanings and capabilities already have providers.</td><td>Exact missing IntentJS, ontology, grounding, circuit or response responsibilities.</td></tr>
<tr><td>2. Author only task-local gaps</td><td>Missing responsibilities and coding-skill context</td><td>Codex writes task-owned semantic modules and tests.</td><td>New files under <code>intent/</code>, <code>ontologies/</code>, <code>longtext/</code>, <code>circuits/</code>, <code>cnl/</code> or <code>tests/</code>.</td></tr>
<tr><td>3. Compose and execute</td><td>Inherited providers plus task-local additions</td><td>The planner builds one combined executable plan and response policy.</td><td>Concrete result, Markdown CNL and requested auxiliary evidence.</td></tr>
<tr><td>4. Validate and review</td><td>Programs, tests, anchors, findings and response</td><td>Deterministic gates run, followed by mandatory Codex review.</td><td>Accepted result or exact failures for the next bounded repair cycle.</td></tr>
<tr><td>5. Replay</td><td>Accepted task programs</td><td>Run without Codex and compare semantic results and response digest.</td><td>Reproducible task or typed failure.</td></tr>
</tbody></table>
<h2>CLI contract</h2>
<pre><code># Author missing task-local semantics, run strict checks, and iterate Codex review up to three cycles.
node nllAgent.mjs analyze \\
  --agent-dir path/to/agent --task-dir path/to/task \\
  --author-adaptive --authoring-cycles 3 --assurance all

# Validate the retained cold-chain result against its domain-specific DS042 acceptance rules.
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
<h2>One coding phase, step by step</h2>
<table><thead><tr><th>Step</th><th>Framework input</th><th>Action</th><th>Programmer-visible result</th></tr></thead><tbody>
<tr><td>1. Select workflow</td><td>CLI coding phase</td><td>Resolve the owning skill and transitive dependencies from executable workflows.</td><td>Run-local skill folders in deterministic order.</td></tr>
<tr><td>2. Build context</td><td>Project, agent, task, profile and sources</td><td>Generate only the SDK, ontology, circuit, response, profile, source and DS catalogs requested by those skills.</td><td>Inspectable context files with real local imports.</td></tr>
<tr><td>3. Invoke Codex</td><td>Instructions, skills, context and allowed edit roots</td><td>Codex edits canonical agent or task files directly.</td><td>New or modified <code>.mjs</code> programs and tests plus retained process logs.</td></tr>
<tr><td>4. Accept or reject</td><td>Edited files</td><td>Run imports, ontology checks, anchors, circuits and focused tests.</td><td>Acceptance or a typed failure supplied to review.</td></tr>
</tbody></table>
<h2>How dependencies are found</h2><p>The requested phase maps to a root skill. The loader imports its adjacent <code>workflow.mjs</code>, closes declared dependencies, and copies only those skill folders into the run. It never searches a hidden global skill directory. SDK and ontology knowledge comes from live project modules and generated run-local catalogs, so task code imports the real constructors instead of duplicating theory.</p>
<h2>Agent-level phases</h2><p><code>code architect</code>, <code>code ontology</code> and <code>code circuit</code> can work at agent scope from a retained brief. Their outputs are reusable profiles, ontologies, circuits, CNL and tests. Evaluation invokes the same adapter and context path.</p>
<h2>Task-level phases</h2><p><code>code intent</code> translates the requested operation into executable selection policy. <code>code longtext</code> translates decoded source text into grounded claims and coverage. Optional ontology or circuit phases are task-local only when the meaning or behavior is not reusable.</p>
<h2>Inspect before invoking Codex</h2><pre><code># Build LongTextJS authoring context from the resolved agent, task, SDK, and source catalogs.
node nllAgent.mjs context build --phase longtext \\
  --agent-dir path/to/agent --task-dir path/to/task
# Print the prepared context paths so their exact dependencies can be inspected.
node nllAgent.mjs context show \\
  --agent-dir path/to/agent --task-dir path/to/task
# Prepare LongTextJS instructions and skills without invoking Codex or editing task programs.
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
<h2>How a circuit is planned and executed</h2><table><thead><tr><th>Step</th><th>Runtime operation</th><th>Inspectable evidence</th></tr></thead><tbody>
<tr><td>1. Registry</td><td>Every loaded framework, agent and task circuit registers each provided capability, semantic requirement, cost and stable identity.</td><td><code>catalog circuits</code> and <code>context/CIRCUIT_CATALOG.md</code>.</td></tr>
<tr><td>2. Selection</td><td>Explicit concerns and exclusions win; otherwise the declared fallback considers all compatible providers inside the already loaded packs.</td><td><code>results/execution-plan.md</code> records selected, rejected and blocked providers.</td></tr>
<tr><td>3. Capability closure</td><td>The planner recursively selects providers for required capabilities, orders equal-cost providers by identity, rejects cycles and reports a missing provider.</td><td><code>PLAN_NO_PROVIDER</code> or <code>PLAN_CAPABILITY_CYCLE</code> diagnostics retain the unresolved edge.</td></tr>
<tr><td>4. Stage dependency graph</td><td>Declared reads/writes and query references form a deterministic DAG. A stage runs only after every referenced value exists.</td><td>The binary trace and trace summary retain stage order, inputs, outputs and timing.</td></tr>
<tr><td>5. Concrete truth</td><td>Queries bind actual SemanticStore values; decisions/procedures emit typed findings or frames. This is the only truth-bearing interpretation.</td><td><code>findings.mjs</code>, canonical <code>*.cnl</code> and exact source evidence identities.</td></tr>
<tr><td>6. Auxiliary assurance</td><td>Abstract preflight propagates declared finite domains; symbolic coverage explores decision conditions. Neither replaces concrete output.</td><td><code>assurance.mjs</code> and <code>assurance.md</code>, including convergence, path completeness and truncation.</td></tr>
</tbody></table>
<h2>Strong composition patterns</h2><table><thead><tr><th>Pattern</th><th>Construction</th><th>Use and boundary</th></tr></thead><tbody>
<tr><td>Capability pipeline</td><td><code>requireCapability</code>, <code>provideCapability</code>, <code>connect</code>, <code>composeByCapability</code></td><td>Builds reusable multi-circuit dependencies without importing a provider by filename.</td></tr>
<tr><td>Relational analysis</td><td><code>match</code>, <code>join</code>, <code>where</code>, <code>groupBy</code>, <code>aggregate</code>, <code>closure</code></td><td>Executes indexed typed queries while preserving bindings and deterministic ordering.</td></tr>
<tr><td>Four-valued decision</td><td><code>decisionTable</code> with satisfied, violated, unknown and conflict rows</td><td>Makes incomplete and inconsistent evidence explicit; coverage gates any conclusion based on absence.</td></tr>
<tr><td>Procedural kernel</td><td><code>proceduralStage().reads().writes().run().abstract().symbolic()</code></td><td>Hosts algorithms that do not fit declarative queries while declaring all semantic and assurance interfaces.</td></tr>
<tr><td>Typed generation</td><td><code>emitCNLFrame</code>, <code>emitCollection</code>, <code>generationPlan</code></td><td>Produces semantic frames for later composition; it does not smuggle a preformatted prose answer into a finding.</td></tr>
</tbody></table>
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
<h2>What enters and what leaves the response layer</h2>
<table><thead><tr><th>Input</th><th>Response-layer responsibility</th><th>Output</th></tr></thead><tbody>
<tr><td>Typed findings and generated frames</td><td>Select only material entries without changing their semantic status.</td><td>Filtered response entries; raw values remain available separately.</td></tr>
<tr><td>IntentJS presentation directives</td><td>Choose grouping, style, evidence and satisfied-result visibility.</td><td>Ordered non-empty groups and exact counts.</td></tr>
<tr><td>Verified source registry and rule metadata</td><td>Attach only exact digest-verified quotations and concise rule explanations.</td><td>Tagged human-readable <code>response.md</code>.</td></tr>
</tbody></table>
<h2>Response super-circuit execution</h2><table><thead><tr><th>Ordered phase</th><th>Input</th><th>Output/invariant</th></tr></thead><tbody>
<tr><td>Applicability</td><td>Resolved IntentJS, selected semantic findings and generated frames</td><td>Only response circuits whose executable predicate applies enter the plan.</td></tr>
<tr><td>Material selection</td><td>Finding status, tags, circuit identity and IntentJS include/exclude directives</td><td>Internal grounding and <code>NOT_APPLICABLE</code> are suppressed; no semantic status is changed.</td></tr>
<tr><td>Grouping/counting</td><td>Selected entries and <code>groupResultsBy</code></td><td>Stable non-empty groups plus exact counts; empty requests produce one no-material marker.</td></tr>
<tr><td>Evidence enrichment</td><td>Finding evidence identities, source registry, rule/details fields</td><td>Only digest-verified exact spans are quotable; failed requirements and decisive negative evidence remain visible.</td></tr>
<tr><td>Generated-frame selection</td><td>Typed procedure, clarification, repair or plan frames</td><td>Frames relevant to the requested operation are ordered and rendered before or beside findings according to style.</td></tr>
<tr><td>Layout/render</td><td>Composed response model and IntentJS style directives</td><td>Tagged human-readable Markdown CNL; executable/debug modules remain separate artifacts.</td></tr>
</tbody></table>
<p>Framework, agent and task response modules are ordered deterministically by identity and priority. A local module may extend the stage chain or deliberately replace the same semantic identity; unrelated policies compose. The composer validates stage reads/writes before running and rejects missing inputs or duplicate incompatible writes.</p>
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
  const adaptiveRecord = await loadAdaptiveRecord(root);
  const pages = [...staticPages(), ...dslPages(escapeHtml)];
  const completed = new Map(results.filter((result) => result.status === "completed").map((result) => [result.sourceCaseId, result]));
  pages.push({
    name: "tutorials.html",
    title: "Agentic Tutorial Index",
    kicker: "Four real natural-language authoring cases",
    content: await tutorialIndexContent(completed, escapeHtml)
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
