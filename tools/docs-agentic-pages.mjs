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
  const adaptiveCommand = `node nllAgent.mjs analyze --agent-dir evaluations/adaptive-task-e2e/agents/adaptive-core-agent --task-dir ${adaptiveTaskRelativePath} --author-adaptive --authoring-cycles 3 --assurance all`;
  const replayCommand = `node nllAgent.mjs run --agent-dir evaluations/adaptive-task-e2e/agents/adaptive-core-agent --task-dir ${adaptiveTaskRelativePath} --assurance all`;
  const artifactStages = await artifactBrowser({
    Input: Object.freeze({
      provenance: Object.freeze({ description: "These natural-language files are committed evaluation input; no authoring command created their meaning." }),
      entries: [textArtifact("task/task-instruction.txt", taskInstructionText(task)), ownedArtifact("task", sourcePath, taskRoot)]
    }),
    Intermediate: Object.freeze({
      provenance: Object.freeze({ description: "This real adaptive Codex run authored the missing task-local programs and applied its acceptance gates.", command: adaptiveCommand }),
      entries: [ownedArtifact("task", taskPath, taskRoot), ...ownedArtifacts("task", semanticFiles, taskRoot)]
    }),
    Output: Object.freeze({
      provenance: Object.freeze({ description: "This model-free replay executed the retained programs and regenerated the public CNL response.", command: replayCommand }),
      entries: [ownedArtifact("task", primaryResponse, taskRoot)]
    })
  }, projectRoot, escapeHtml);
  return `<p class="lead">This run asks whether sample AX-17 may be released after a custody transfer. The inherited agent deliberately contains only core-language knowledge, so Codex must add the missing cold-chain vocabulary and executable review behavior inside this task before the source can be evaluated.</p>
<h2>Input ownership and requested result</h2>
<p><strong>Agent input:</strong> none. <code>adaptive-core-agent</code> is a pre-existing minimal agent and is not authored from a brief in this run. <strong>Task input:</strong> <code>task/task-instruction.txt</code> requests a complete release-support audit, while <code>task/source/cold-chain-transfer.txt</code> supplies three policy rules, the AX-17 transfer record, and the memo's release conclusion.</p>
<p>The desired answer is not a generic cold-chain summary. It must decide whether every release precondition is supported, preserve unknowns, quote decisive evidence, and remain replayable from committed semantic code.</p>
<h2>Retained input, authored code, and public answer</h2>
<p>The artifact tree keeps all three ownership levels visible. <strong>Input</strong> contains only the task's natural-language material. <strong>Intermediate</strong> contains only task-owned executable programs and tests created by the adaptive run. <strong>Output</strong> contains only the public Markdown CNL answer. Each branch states the real command that authored, validated, or replayed its files when a command exists, and every visible path starts with its semantic owner.</p>
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
  const evaluationCommand = "node nllAgent.mjs evaluate --suite agentic-nl-e2e --invoke-agent";
  const replayCommand = `node nllAgent.mjs run --agent-dir ${agentRelativePath} --task-dir ${result.taskPath} --assurance all`;
  const artifactStages = await artifactBrowser({
    Input: Object.freeze({
      provenance: Object.freeze({ description: "This suite invocation created isolated folders and retained the exact brief, task instruction, and source before authoring.", command: evaluationCommand }),
      entries: [ownedArtifact("agent", agentBriefPath, agentRoot), textArtifact("task/task-instruction.txt", result.instruction ?? ""), ownedArtifact("task", sourcePath, taskRoot)]
    }),
    Intermediate: Object.freeze({
      provenance: Object.freeze({ description: "The same real invocation ran Codex architect, ontology, circuit, intent, and LongText phases, then accepted these executable programs.", command: evaluationCommand }),
      entries: [
        ownedArtifact("agent", agentModulePath, agentRoot),
        ownedArtifact("agent", agentProfilePath, agentRoot),
        ...ownedArtifacts("agent", ontologyFiles, agentRoot),
        ...(await exists(circuitPath) ? [ownedArtifact("agent", circuitPath, agentRoot)] : []),
        ownedArtifact("task", taskModulePath, taskRoot),
        ...ownedArtifacts("task", intentFiles, taskRoot),
        ...ownedArtifacts("task", longTextFiles, taskRoot)
      ]
    }),
    Output: Object.freeze({
      provenance: Object.freeze({ description: "This ordinary model-free run executes the retained programs and regenerates the public response shown here.", command: replayCommand }),
      entries: [ownedArtifact("task", primaryResponse, taskRoot)]
    })
  }, projectRoot, escapeHtml);
  return `<p class="lead">${escapeHtml(definition.purpose)}</p>
<div class="callout"><strong>Retained result.</strong> The run completed with target result <code>${escapeHtml(expected)}</code>; generated frames <code>${result.generatedFrames ?? 0}</code>; model-free replay equivalence <code>${result.metrics?.replayEquivalent ?? "not recorded"}</code>. Other circuits that returned <code>NOT_APPLICABLE</code> remain technical evidence and are not rendered as public findings.</div>
<h2>Input ownership and requested behavior</h2>
<p><strong>Agent input:</strong> <code>agent/source/agent-brief.md</code> asks Codex to create reusable operational-policy vocabulary and four source-independent circuit capabilities. <strong>Task input:</strong> <code>task/task-instruction.txt</code> selects what this run must do, and <code>task/source/source-001.txt</code> is the exact evidence it must interpret. The agent brief is shared by all four cases; the task instruction and source are case-specific.</p>
<h2>Retained input, executable interpretation, and public answer</h2>
<p>The left-hand tree keeps <strong>Input</strong>, <strong>Intermediate</strong>, and <strong>Output</strong> visible together. Input contains only natural-language material. Intermediate first lists reusable <code>agent/</code> programs authored from the brief, then <code>task/</code> programs authored for this source. Output contains only <code>task/results/response.md</code>. Each branch names the command that produced or replayed it, while the visible file labels keep only the ownership boundary needed to understand the example.</p>
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
      content: `<p class="lead">A coding skill turns a broad request such as “ground this source” or “add a reusable contradiction check” into a bounded Codex run with enough local knowledge to write executable semantic code. It is split between instructions the coding agent follows and a manifest the framework validates before that agent starts.</p>
<h2>The two halves of one executable contract</h2>
<p>Every project skill lives under <code>nll-skills/&lt;id&gt;/</code>. <code>SKILL.md</code> explains semantic responsibility: what belongs in the target DSL, which shortcuts are forbidden, what order the work follows, which project commands reveal or verify the relevant state, and what must be true at completion. Codex reads that file after the generated run instructions.</p>
<p>The adjacent <code>workflow.mjs</code> is imported by nllAgent itself. It creates an immutable <code>CodingSkill</code> and declares <code>.specs(...)</code>, <code>.context(...)</code>, <code>.tools(...)</code>, <code>.dependsOn(...)</code>, <code>.edits(...)</code>, and <code>.phase(...)</code>. These fields select DS contracts, generated context, implemented CLI routes, dependency order, edit ownership, and applicability. A dependency cycle, unknown context name, or unavailable command is therefore an implementation failure rather than vague prompt behavior.</p>
<h2>How the framework constructs the reading context</h2>
<p>The CLI maps an authoring phase to one or more root skills in <code>framework/tools/context-builder.mjs</code>. For example, <code>longtext</code> selects <code>nll-longtext</code>, while review combines testing, intent, ontology, grounding, circuit, and runtime skills. <code>framework/tools/skill-loader.mjs</code> imports adjacent manifests, walks their dependencies depth first, rejects cycles, and returns dependency-first order. Only those project-owned skill folders are copied under the run; environment-managed skill folders are neither searched nor treated as product capability.</p>
<p>The builder decodes task sources and resolves the actual project, profile, agent, and task runtime before it generates context. It then takes the union of DS references and context artifact names across the complete skill chain. The supported artifacts are generated from live descriptors or retained evidence, which means they describe the same constructors, identities, providers, profile, and sources the task will execute.</p>
<table><thead><tr><th>Context artifact</th><th>What Codex learns from it</th></tr></thead><tbody>
<tr><td><code>PROJECT_MAP.md</code></td><td>Which paths belong to framework, agent, task, run, and results, so edits reach canonical owners.</td></tr>
<tr><td><code>SDK_CATALOG.md</code></td><td>Which public constructor surfaces and real local import paths are available.</td></tr>
<tr><td><code>ONTOLOGY_CATALOG.md</code></td><td>Which semantic identities are loaded after framework, profile, agent, and task precedence.</td></tr>
<tr><td><code>CIRCUIT_CATALOG.md</code></td><td>Which concerns, capabilities, requirements, stages, statuses, and assurance providers already exist.</td></tr>
<tr><td><code>RESPONSE_CIRCUIT_CATALOG.md</code></td><td>Which validated presentation stages select, group, rank, and explain immutable results.</td></tr>
<tr><td><code>PROFILE_RESOLUTION.md</code></td><td>Which packs and local modules are inherited and which planner policy is active.</td></tr>
<tr><td><code>SOURCE_OUTLINE.md</code></td><td>Which decoded sources and stable units need interpretation, without claiming ingestion inferred meaning.</td></tr>
<tr><td><code>DIAGNOSTICS.md</code></td><td>Which prior source, import, execution, or acceptance failure the next phase must address.</td></tr>
</tbody></table>
<p>These files are indexes into canonical knowledge, not replacements for it. Codex follows identities and import paths into the SDK, ontology, circuit, or source module when it needs more detail. This progressive loading provides a coherent map first and consumes detailed context only for the semantic surfaces needed by the phase.</p>
<h2>What Codex receives and edits</h2>
<p>The generated <code>INSTRUCTIONS.md</code> records the goal, canonical working directory, project CLI, installed skills in dependency order, exact selected DS files, and exact context inventory. The adjacent <code>run.mjs</code> records the adapter, working directory, skill IDs, objective, allowed owner, and standard fast check. <code>framework/tools/coding-agent.mjs</code> starts <code>codex exec</code> in that working directory, retains stdout, stderr, final report, status, and timing, and gives the process the project, agent, and run roots.</p>
<p>Codex edits canonical <code>.mjs</code> programs directly. Agent-level architect, ontology, and circuit phases may create reusable profiles, semantic vocabulary, source-independent checks, response policies, and tests from an agent brief. Task-level intent and LongText phases interpret one instruction and its decoded sources. A task-local ontology or circuit is added only when inherited knowledge cannot express the requested meaning or behavior, so one source's claims never become default agent knowledge by accident.</p>
<h2>How correctness is established</h2>
<p>The first layer is the skill's own workflow: its declared tools tell Codex which catalogs to inspect and which narrow semantic checks to run while authoring. The second layer is the owner-level fast check recorded in <code>run.mjs</code>. The third layer is framework-controlled acceptance in evaluation and adaptive authoring. Those paths snapshot changed canonical files, import required artifacts, and apply phase-specific gates. Intent requires executable output and presentation policy; ontology requires clean diagnostics; LongText requires non-empty verified anchors and store materialization; circuits require usable capabilities, stages, focused tests, concrete results, and every assurance they claim.</p>
<p>Adaptive acceptance continues through material non-core findings or frames, qualitative quoted Markdown CNL, non-truncated auxiliary assurance, a mandatory Codex review, and a second model-free replay. An ordinary <code>code</code> run retains Codex's process evidence and report, but it must not be described as equivalent to those stronger evaluation gates. Each skill page explains this enforcement boundary and its own completion criterion.</p>
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
<h2>Where public requirement wording comes from</h2>
<p>A semantic circuit may keep stable requirement codes for decisions and tests, but public prose needs the domain meaning that only that circuit knows. The finding therefore pairs its status arrays with <code>requirementStatements</code>. The renderer chooses the statement by code and inserts it into a fixed status template. It never guesses domain semantics by splitting underscores. A code-shaped requirement without a statement fails with <code>PUBLIC_REQUIREMENT_STATEMENT_REQUIRED</code> before a low-quality answer can be written.</p>
<pre><code>details: Object.freeze({
  failedRequirements: Object.freeze([
    "RECEIVING_PARTY_ACKNOWLEDGED"
  ]),
  requirementStatements: Object.freeze({
    RECEIVING_PARTY_ACKNOWLEDGED:
      "The receiving party acknowledged the custody transfer."
  })
})</code></pre>
<p>The rendered group begins with <code>[CNL:REQUIREMENT-GROUP] [STATUS:VIOLATED] [COUNT:1]</code>, explains in controlled prose that a required condition is not satisfied, and lists “The receiving party acknowledged the custody transfer.” The code remains available in executable findings and the finding marker; it is not exposed as the explanation.</p>
<h2>How copied input is separated from generated explanation</h2>
<p>The conclusion, status interpretation, requirement templates, and next actions are generated CNL. Exact source material appears only inside a section marked <code>[CNL:EVIDENCE]</code>. Every verified passage is introduced by <code>[CNL:SOURCE-QUOTE] [SOURCE:...]</code>, rendered as a Markdown blockquote, and attributed as exact source text copied from a relative source link. Decoded offsets remain technical verification data and are not shown to the reader.</p>
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
<tr><td><code>[CNL:REQUIREMENT-GROUP]</code></td><td>Declares the already-established requirement status and the exact number of public domain statements in that group.</td></tr>
<tr><td><code>[CNL:EVIDENCE]</code> and <code>[CNL:SOURCE-QUOTE]</code></td><td>Separate generated explanation from digest-verified text copied exactly from one source.</td></tr>
<tr><td><code>[CNL:NEXT-ACTION]</code></td><td>Declares how many controlled actions follow from the failed or unresolved conditions.</td></tr>
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
