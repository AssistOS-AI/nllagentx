#!/usr/bin/env node
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { relative, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { buildAgenticDocumentationPages } from "./docs-agentic-pages.mjs";
import { buildUnderstandDocumentationPages } from "./docs-understand-pages.mjs";
import { artifactBrowser, filesBelow, loadDefaultIfPresent } from "./docs-file-helpers.mjs";
import { documentationHeader, documentationSectionNavigation } from "./docs-navigation.mjs";
import { documentationStyles } from "./docs-styles.mjs";
import { frameworkPacks } from "../framework/packs/index.mjs";
import { supportedContextArtifacts } from "../framework/tools/context-builder.mjs";
import { resolveSkillChain } from "../framework/tools/skill-loader.mjs";

const root = resolve(import.meta.dirname, ".."); const docs = resolve(root, "docs");
await mkdir(resolve(docs, "partials"), { recursive: true }); await mkdir(resolve(docs, "assets"), { recursive: true });

const documentScripts = `<script type="module" src="assets/artifact-browser.mjs"></script>`;
const escapeHtml = (value) => String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
const code = (value) => `<code>${escapeHtml(value)}</code>`;
const ownedArtifact = (owner, path, ownerRoot, localPath = relative(ownerRoot, path)) => Object.freeze({
  path,
  displayRoot: ownerRoot,
  label: `${owner}/${localPath.split("\\").join("/")}`
});

const contextArtifactExplanations = Object.freeze({
  "PROJECT_MAP.md": "An ownership-aware, repository-relative inventory of framework, agent, task, source, run, and result paths. Codex uses it to find canonical files without guessing where a similarly named artifact belongs.",
  "SDK_CATALOG.md": "A projection of the currently exported SDK surfaces, constructor families, descriptors, and import locations. It tells Codex which real local APIs exist before it opens the narrower implementation modules it must change or use.",
  "ONTOLOGY_CATALOG.md": "The ontology modules and semantic identities produced by the resolved framework profile, agent, and task precedence. Codex uses it to reuse exact concepts, roles, relations, frames, facts, laws, and capabilities instead of creating spelling-based duplicates.",
  "CIRCUIT_CATALOG.md": "The resolved semantic circuit providers, concerns, requirements, provisions, statuses, stages, and declared assurance. It lets Codex see whether a requested behavior already has a compatible provider and which capability gaps are real.",
  "RESPONSE_CIRCUIT_CATALOG.md": "The default, agent, and task response circuits after same-identity precedence, including stage reads, writes, applicability, and presentation purpose. It exposes how material findings become grouped Markdown CNL without allowing presentation to invent truth.",
  "PROFILE_RESOLUTION.md": "The selected profile, loaded packs, inherited agent modules, task extensions, and planner policy. Codex uses it to distinguish available default knowledge from knowledge that must genuinely be authored locally.",
  "SOURCE_OUTLINE.md": "Decoded task sources, stable source units, digests, and absolute bounds without semantic interpretation. It gives IntentJS and LongTextJS authoring a complete evidence inventory while leaving meaning to the coding agent.",
  "DIAGNOSTICS.md": "Existing source, import, planning, execution, or acceptance failures retained for the next coding or review phase. An empty file states that no prior diagnostic exists; it never silently hides a failed resolution."
});

function markdownSection(markdown, title) {
  const marker = `## ${title}`;
  const start = markdown.indexOf(marker);
  if (start < 0) return "";
  const contentStart = start + marker.length;
  const next = markdown.indexOf("\n## ", contentStart);
  return markdown.slice(contentStart, next < 0 ? markdown.length : next).trim();
}

function inlineMarkdown(value) {
  return escapeHtml(value).replace(/`([^`]+)`/g, "<code>$1</code>");
}

function markdownParagraphs(value) {
  return value.split(/\n\s*\n/).filter(Boolean).map((paragraph) => `<p>${inlineMarkdown(paragraph)}</p>`).join("\n");
}

function workflowHtml(markdown) {
  const steps = [...markdownSection(markdown, "Workflow").matchAll(/^(\d+)\.\s+(.+)$/gm)];
  return steps.map(([, order, body]) => `<p><strong>Step ${escapeHtml(order)}.</strong> ${inlineMarkdown(body)}</p>`).join("\n");
}

function commandExplanation(command) {
  const value = command.replace(/^nllAgent\s+/, "");
  if (value === "files index") return "Walks the selected project and emits an ownership-aware file index. The skill uses it to locate canonical edit targets and avoid confusing framework, agent, task, run, and generated-result files.";
  if (value === "catalog sdk") return "Reads live SDK descriptors and prints the public semantic surfaces and import paths. This is the discovery view used before choosing or extending a constructor.";
  if (value === "catalog ontology") return "Loads the resolved runtime and prints ontology modules and identities after profile, agent, and task precedence. This prevents duplicate concepts and reveals the exact vocabulary available to source and circuit code.";
  if (value === "catalog circuit") return "Loads resolved semantic circuits and prints concerns, requirements, providers, statuses, stages, and assurance. It shows whether the requested capability already exists and what a new circuit must compose with.";
  if (value === "catalog response") return "Prints resolved response circuits and their stage dataflow. The skill uses it to reuse or extend filtering, grouping, evidence selection, and Markdown CNL policy without changing semantic truth.";
  if (value === "profile resolve") return "Explains the chosen profile, loaded packs, local overrides, and planner policy. It establishes which knowledge is inherited and which missing capability is allowed to become local code.";
  if (value === "context build") return "Creates a run folder, installs the dependency-closed skill set, selects DS files, and materializes the declared live context artifacts without invoking Codex.";
  if (value === "context show") return "Lists the exact context files in the prepared run so a programmer or Codex can verify what was made available rather than relying on a prompt claim.";
  if (value.startsWith("agent ")) return "Creates, inspects, validates, or catalogs the reusable agent owner named by the second word. The result is agent-scoped state that may be reused by more than one task.";
  if (value.startsWith("task ")) return "Creates or inspects one task owner and its retained sources/runs. Task commands preserve the boundary between one source interpretation and reusable agent knowledge.";
  if (value.startsWith("code ")) return "Prepares the named authoring phase and, unless prepare-only is selected, invokes the configured coding-agent adapter with run-local skills, specifications, catalogs, edit ownership, and retained process evidence.";
  if (value === "source ingest") return "Decodes retained source bytes, chooses a task extractor or built-in decoder, creates stable source units and digests, and writes the executable source map; it performs no semantic inference.";
  if (value === "source outline") return "Prints decoded sources and stable units with their bounds so authoring can account for the entire input before selecting exact evidence.";
  if (value === "source show") return "Returns one decoded source or unit exactly as registered, allowing LongTextJS authoring to inspect the evidence rather than a summary.";
  if (value === "source search") return "Finds exact decoded occurrences and reports candidate bounds. It supports anchor selection but does not decide what the passage means.";
  if (value === "source span") return "Prints the exact substring for an explicit decoded interval so an author can verify a proposed SourceSpan before committing it.";
  if (value === "source verify-anchors") return "Rechecks every committed LongTextJS SourceSpan against source identity, bounds, digest, and selected-text hash; stale or invented evidence fails deterministically.";
  if (value === "sdk check") return "Imports the SDK registry and validates export, descriptor, namespace, and constructor consistency before a new primitive is treated as public.";
  if (value === "sdk usage") return "Prints focused live usage for a requested SDK surface, including import shape and fluent composition, so Codex can load a narrow implementation context on demand.";
  if (value === "ontology show") return "Shows the resolved definition of selected ontology identities, including roles and inheritance, for precise reuse during authoring.";
  if (value === "ontology check") return "Runs uniqueness, subtype, disjointness, frame-role, lexicalization, and cross-module diagnostics over the resolved ontology set.";
  if (value === "ontology build") return "Executes ontology modules and regenerates the constructor facade used by LongTextJS and circuits; an importable facade is concrete evidence that the schema is usable.";
  if (value === "ontology affected") return "Finds circuits and semantic programs that consume changed ontology identities so their compatibility tests can be included in the same change.";
  if (value === "longtext check") return "Imports task LongTextJS and validates semantic structure, ownership, references, and composition before committing it to a store.";
  if (value === "longtext execute") return "Commits the composed LongTextJS transaction to a SemanticStore, exposing constructor, identity, role, and transaction failures that static inspection cannot prove.";
  if (value === "longtext query") return "Runs focused semantic queries over the materialized task to confirm that decisive terms, claims, alternatives, and relationships are represented as intended.";
  if (value === "longtext coverage") return "Reports typed source and concept coverage so a circuit can distinguish verified absence from missing inspection.";
  if (value === "intent check") return "Imports IntentJS and validates its mode, concerns, outputs, evidence, assurance, exclusions, fallback, and Markdown CNL presentation contract.";
  if (value === "intent infer-signals") return "Reports cheap lexical and already-materialized semantic signals as advice. It does not author or silently mutate the canonical IntentJS module.";
  if (value === "intent explain") return "Explains how explicit directives, profile policy, source signals, and fallback produced the selected task intent.";
  if (value === "plan show") return "Builds and prints provider selection, capability closure, rejected alternatives, blocked dependencies, and response composition for the resolved task.";
  if (value === "circuit check") return "Imports circuit modules and validates identities, typed requirements/provisions, stages, data dependencies, emissions, and declared method support.";
  if (value === "circuit plan") return "Closes required capabilities and schedules compatible circuit providers without executing their semantic stages.";
  if (value === "circuit run") return "Executes the concrete scheduled circuit stages against the materialized store and retains typed findings, frames, evidence, and traces.";
  if (value === "circuit abstract") return "Runs declared abstract preflight and checks convergence, possible status sets, and any precision loss for circuits that claim this assurance.";
  if (value === "circuit symbolic") return "Explores declared symbolic decision coverage, retaining feasible paths, selected rows, pruning, and truncation so decision behavior is inspectable.";
  if (value === "trace slice") return "Reduces a retained trace to the dependencies of one result, allowing tests and reviews to inspect why that result occurred without reading unrelated execution.";
  if (value === "trace explain") return "Renders the semantic derivation and provenance for a selected retained value or finding.";
  if (value === "trace compare") return "Compares two retained executions by semantic identities, findings, frames, assurance, and response digest rather than process noise.";
  if (value === "cnl render") return "Renders typed CNL frames or selected semantic results through the controlled renderer.";
  if (value === "cnl parse") return "Parses supported canonical CNL back into typed frame structure for validation and downstream tooling.";
  if (value === "cnl roundtrip") return "Renders and reparses supported frames, then compares semantic slots to detect wording that loses or invents meaning.";
  if (value === "review bundle") return "Builds a failure-oriented context that survives a broken task import and retains diagnostics, selected skills, DS contracts, and canonical paths for a repair run.";
  if (value.startsWith("test ")) return "Runs the selected deterministic Node test scope. Tests never invoke Codex; they assert semantic structure, evidence, diagnostics, response behavior, and replay independently of authoring.";
  if (value === "evaluate") return "Runs an isolated evaluation suite, optionally invoking real Codex phases, then retains authored programs, process evidence, semantic metrics, concrete execution, and model-free replay.";
  return "Routes this declared operation through the real project CLI; the skill workflow treats its observable output as phase evidence.";
}

const skillAcceptance = Object.freeze({
  "nll-architect": "Agent authoring acceptance imports the resulting agent, checks reusable ontology and circuit modules, verifies declared stages and capabilities, and runs agent tests. A plan document alone does not satisfy this phase.",
  "nll-orchestrator": "Workspace changes are accepted through temporary-directory CLI and path-resolution tests, lock and process evidence, portable context construction, and deterministic command exit behavior.",
  "nll-sdk": "SDK work must pass live export/descriptor checks and focused framework tests. A new fluent name is not accepted until its semantic sort, identity, provenance, diagnostics, and import surface execute consistently.",
  "nll-runtime": "Runtime work is checked through concrete execution, deterministic scheduling, trace reasons, invalidation/replay tests, and differential reference behavior where a second implementation is practical.",
  "nll-intent": "Task authoring acceptance requires an importable IntentJS module with Markdown CNL output and a presentation policy, followed by intent and plan checks that expose selected and rejected providers.",
  "nll-ontology": "Ontology acceptance requires an importable task or agent module, clean ontology diagnostics, a generated usable constructor facade where applicable, and affected-consumer tests.",
  "nll-longtext": "LongText acceptance requires an importable composed root, non-empty verified SourceSpans, clean anchor checks, successful store materialization, and focused task tests. Unsupported semantic slots cannot be filled merely to satisfy a later circuit.",
  "nll-circuit": "Circuit acceptance requires importable stages and capabilities, focused applicable/violated/unknown/conflict cases, concrete findings with reachable evidence, and every auxiliary method the circuit claims. Response stages are checked separately for truth preservation.",
  "nll-test": "The test skill proves wrong-reason failures with semantic assertions, mutations, deterministic generators, trace/evidence checks, response checks, and model-free execution. Its own tests may not call a coding agent or the network.",
  "nll-evaluate": "Evaluation acceptance retains real authoring provenance when Codex is claimed, validates phase-created artifacts, computes semantic metrics, executes concrete and required auxiliary methods, checks the public CNL independently, and proves ordinary replay equivalence."
});
function shell(title, kicker, content) {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>nllAgent Documentation — ${escapeHtml(title)}</title>
  <link rel="stylesheet" href="styles.css">
  ${documentScripts}
</head>
<body>
  <div data-include="partials/header.html"></div>
  <main class="page">
    <article class="page__panel content">
      <nav class="breadcrumb" aria-label="Breadcrumb"><a href="index.html">nllAgent Documentation</a><span>/</span>${escapeHtml(title)}</nav>
      <p class="kicker">${escapeHtml(kicker)}</p>
      <h1>${escapeHtml(title)}</h1>
      ${documentationSectionNavigation(title)}
      ${content}
    </article>
  </main>
  <div data-include="partials/footer.html"></div>
  <script src="partials-loader.js"></script>
</body>
</html>`;
}

function semanticName(value) {
  return value?.name ?? value?.identity ?? value?.id ?? String(value);
}

function packKnowledgeHtml() {
  return frameworkPacks.map((pack) => {
    const ontologyRows = pack.ontologies.map((ontology) => {
      const concepts = ontology.concepts.map((concept) => `${concept.name} (${concept.sort})`).join(", ");
      const roles = ontology.roles.map(semanticName).join(", ") || "none";
      const relations = ontology.relations.map(semanticName).join(", ") || "none";
      const reusableKnowledge = [
        ...ontology.facts.map((fact) => `fact: ${semanticName(fact)}`),
        ...ontology.laws.map((law) => `law: ${semanticName(law)}`)
      ].join(", ") || "none";
      return `<tr><td><code>${escapeHtml(ontology.identity)}</code></td><td>${escapeHtml(concepts)}</td><td>${escapeHtml(roles)}</td><td>${escapeHtml(relations)}</td><td>${escapeHtml(reusableKnowledge)}</td></tr>`;
    }).join("");
    const circuitRows = pack.circuits.map((circuit) => `<tr><td><code>${escapeHtml(circuit.identity)}</code></td><td>${escapeHtml(circuit.concerns.join(", ") || "general")}</td><td>${escapeHtml(circuit.requirements.map(semanticName).join(", ") || "none")}</td><td>${escapeHtml(circuit.provisions.map(semanticName).join(", ") || "none")}</td><td>${escapeHtml(circuit.statuses.join(", "))}</td><td>${escapeHtml(circuit.assurances.map(semanticName).join(", ") || "concrete only")}</td></tr>`).join("");
    const signals = pack.signals.map((signal) => `${signal.kind}: ${signal.values.join(", ")}`).join("; ");
    return `<details class="knowledge-pack"><summary><code>${escapeHtml(pack.id)}</code> — ${pack.ontologies.length} ontology modules, ${pack.circuits.length} circuits</summary>
<p><strong>Identity:</strong> <code>${escapeHtml(pack.identity)}</code>. <strong>Tier:</strong> <code>${escapeHtml(pack.tier)}</code>. <strong>Knowledge level:</strong> <code>${escapeHtml(pack.knowledgeLevel)}</code>.</p>
<p><strong>Selection signals:</strong> ${escapeHtml(signals || "none")}. <strong>Pack capabilities:</strong> ${escapeHtml(pack.capabilities.map(semanticName).join(", ") || "none")}. <strong>Requirements:</strong> ${escapeHtml(pack.requirements.map(semanticName).join(", ") || "none")}. <strong>Incompatibilities:</strong> ${escapeHtml(pack.incompatibilities.map(semanticName).join(", ") || "none")}.</p>
<h3>Predefined ontology knowledge</h3><div class="table-wrap"><table><thead><tr><th>Module</th><th>Concepts and sorts</th><th>Roles</th><th>Relations</th><th>Stable facts/laws</th></tr></thead><tbody>${ontologyRows}</tbody></table></div>
<h3>Executable circuit knowledge</h3><div class="table-wrap"><table><thead><tr><th>Circuit</th><th>Concern</th><th>Semantic requirements</th><th>Capabilities/guarantees</th><th>Possible statuses</th><th>Auxiliary assurance</th></tr></thead><tbody>${circuitRows}</tbody></table></div></details>`;
  }).join("\n");
}

const pages = new Map();
pages.set("semantic-dsls.html", shell("Semantic DSLs and SDK", "Executable .mjs contracts", `
<p class="lead">The DSLs share stable semantic identities while preserving separate responsibilities. The root SDK offers namespace exports for cases where two DSLs intentionally use the same fluent name.</p>
<h2>OntologyJS</h2><p>Ontology builders declare pack-qualified concepts, roles, relations, lexicalizations, facts, laws, capabilities, and cardinalities. Sealed modules expose generated constructors through <code>constructorFor()</code> and diagnostic construction through <code>tryConstruct()</code>. Ground terms enforce declared role cardinality and direct range constraints; pattern terms may omit roles for partial queries. Read the <a href="ontologyjs.html">detailed OntologyJS chapter</a>.</p>
<h2>Live public API inventory</h2><p><code>framework/sdk/public-api.mjs</code> inventories nine narrow surfaces from their imported namespaces. Run <code>node nllAgent.mjs sdk check</code> to validate the live export sets and <code>node nllAgent.mjs sdk usage --surface longtext</code> for canonical paths, exports, and composition examples. Repeated fluent names are reported and resolved through narrow imports or root namespaces. See <a href="specsLoader.html?spec=DS039-sdk-public-surfaces-and-tooling.md">DS039</a>.</p>
<h2>LongTextJS</h2><p>LongTextJS separates terms from claims, anchors claims to exact <code>SourceSpan</code> values, represents context and alternatives, and commits coverage witnesses explicitly. Source verification checks source identity, digest, unit identity, bounds, and text hashes before an anchor is considered valid. Read the <a href="longtextjs.html">detailed LongTextJS chapter</a>.</p>
<h2>IntentJS and profiles</h2><p>Intent modules express modes, domains, concerns, evidence policy, assurance, outputs, exclusions, scope, resources, and fallback. Profiles are executable modules that choose packs and selection policy. CLI domains, exclusions, checks, and text signals can refine runtime resolution without replacing the canonical task module. Read the <a href="intentjs.html">detailed IntentJS chapter</a>.</p>
<h2>CircuitJS and CNL</h2><p>Circuits declare requirements and provisions, then compose queries, decision tables, procedural stages, emissions, and assurance requests. The scheduler infers stage dependencies from semantic references. CNL frames retain typed slots and provenance, render to a canonical textual form, and parse back for semantic comparison. Read the <a href="circuitjs.html">detailed CircuitJS chapter</a>.</p>
<h2>How the DSL files cooperate</h2>
<table><thead><tr><th>File family</th><th>Reads</th><th>Defines</th><th>Feeds</th></tr></thead><tbody>
<tr><td>OntologyJS</td><td>Reusable domain design</td><td>Typed concepts, roles, relations and constructors</td><td>LongTextJS and CircuitJS</td></tr>
<tr><td>IntentJS</td><td>Task instruction</td><td>Requested operation, evidence and presentation policy</td><td>Planner and response composer</td></tr>
<tr><td>LongTextJS</td><td>Decoded source text and ontology constructors</td><td>Grounded claims, contexts, alternatives and coverage</td><td>SemanticStore</td></tr>
<tr><td>CircuitJS</td><td>Intent-selected capabilities and SemanticStore values</td><td>Queries, decisions, findings and generated frames</td><td>Response circuits</td></tr>
<tr><td>Markdown CNL</td><td>Filtered material findings and exact source evidence</td><td>The human-readable answer</td><td>Application user or a later formatting LLM</td></tr>
</tbody></table>
<h2>Minimal executable composition</h2>
<pre><code>const model = describe("task-model")
  .section(section("body", sequence(
    claim(event).grounding(groundedAt(source.spanByText("exact words")))
  )))
  .coverage(coverage(Event).forScope("body").complete())
  .commit();</code></pre>
<p>The complete runnable version is in <code>examples/validation-agent/tasks/task-symbolic-validation/longtext/root.longtext.mjs</code>.</p>`));

pages.set("runtime.html", shell("Runtime and Analysis Methods", "Deterministic semantic execution", `
<p class="lead">The runtime combines an indexed transactional store with small analysis kernels. Methods are selected by circuit contracts and remain inspectable; unsupported fragments retain explicit diagnostics or symbolic forms.</p>
<h2>Store, query, and schedule</h2><p><code>SemanticStore</code> indexes concepts, roles, reverse roles, claims, groundings, provenance, relations, coverage, capabilities, and subtype links. A transaction validates all staged claims before a commit changes any index. Query execution uses typed patterns and returns bindings plus evidence, interpretation, and scope. The scheduler discovers semantic dependencies, orders ready nodes deterministically, and keys cached outputs by content identity.</p>
<h2>Implemented method families</h2>
<table><thead><tr><th>Family</th><th>Implementation</th><th>Declared boundary</th></tr></thead><tbody>
<tr><td>Constraints</td><td>exact rationals, finite domains, difference constraints, DPLL, union-find</td><td>exact for supported finite/theory fragments</td></tr>
<tr><td>Temporal</td><td>Allen classification, inverse, composition, path consistency</td><td>path-consistent network</td></tr>
<tr><td>Relations</td><td>semi-naive finite fixed point and transitive closure</td><td>least fixed point within round bound</td></tr>
<tr><td>Program analysis</td><td>abstract worklist, symbolic paths, BFS, cycle detection</td><td>conservative or bounded as reported</td></tr>
<tr><td>Optimization</td><td>decision DAG, rewriting/e-graph, slicing, specialization</td><td>registered-rule and supplied-runner equivalence</td></tr>
<tr><td>Probabilistic</td><td>finite exact factor enumeration and explicit approximate fallback</td><td>guarantee recorded in result</td></tr>
</tbody></table>
<h2>Planner closure</h2>
<table><thead><tr><th>Step</th><th>Planner input</th><th>Decision</th><th>Retained output</th></tr></thead><tbody>
<tr><td>1. Establish demand</td><td>IntentJS concerns, modes and requested outputs</td><td>Convert the request into required capabilities.</td><td>Root capability demand.</td></tr>
<tr><td>2. Inspect availability</td><td>SemanticStore concepts plus registered circuit provisions</td><td>Reject providers whose required meanings or explicit constraints are unavailable.</td><td>Compatible and rejected provider sets.</td></tr>
<tr><td>3. Close dependencies</td><td>Requirements of compatible providers</td><td>Recursively select stable lowest-cost providers; detect missing providers and cycles.</td><td>Closed executable circuit plan or typed failure.</td></tr>
<tr><td>4. Explain</td><td>Selected, rejected and blocked providers</td><td>Retain the exact reason for each selection result.</td><td>Execution plan and diagnostics.</td></tr>
</tbody></table>
<p>The all-compatible pass continues until no newly compatible circuit remains. Provider order is stable by cost and semantic identity. A missing provider produces <code>PLAN_NO_PROVIDER</code>; cycles produce <code>PLAN_CAPABILITY_CYCLE</code>.</p>`));

pages.set("cli-reference.html", shell("CLI Reference", "Commands and parameters", `
<p class="lead">All command families are implemented by <code>framework/cli/main.mjs</code> and use Node.js built-ins. Run <code>node nllAgent.mjs help</code> for the compact grammar.</p>
<h2>Workspace and coding commands</h2>
<pre><code># Create the reusable agent folder and choose its default pack-selection profile.
node nllAgent.mjs agent create --agent reviewer --profile general-broad
# Create one task from a source file and keep its instruction separate from source claims.
node nllAgent.mjs task create --agent reviewer --source notes.md \
  --title "Policy review" --instruction "Find grounded contradictions"
# Ask Codex to turn the retained agent brief into a reusable architecture plan.
node nllAgent.mjs code architect --agent reviewer \
  --goal "Read source/agent-brief.md and create the reusable agent plan"
# Ask Codex to author reusable agent ontology that the planned circuits require.
node nllAgent.mjs code ontology --agent reviewer
# Ask Codex to encode this task's requested operation and selection policy as IntentJS.
node nllAgent.mjs code intent --agent reviewer --task task-ID
# Ask the selected Codex model to ground this task's source as executable LongTextJS.
node nllAgent.mjs code longtext --agent reviewer --task task-ID --model MODEL
# Feed retained diagnostics to Codex so it can review and repair the task's semantic code.
node nllAgent.mjs code review --agent reviewer --task task-ID --diagnostics failures.md
# Build the circuit-authoring context for inspection without starting Codex.
node nllAgent.mjs code circuit --agent-dir path/to/agent --task-dir path/to/task --prepare-only</code></pre>
<p><code>--prepare-only</code> builds the exact context and skill dependency chain without invoking Codex. Coding runs retain instructions, context catalogs, installed skills, executable run metadata, process logs, and the final coding-agent response.</p>
<h2>Prompt-like authoring and replay</h2>
<p>There are two explicit prompt-like workflows. To teach reusable semantics, retain the natural-language brief at <code>agents/reviewer/source/agent-brief.md</code>, then run agent-level <code>code architect</code>, <code>code ontology</code>, <code>code circuit</code>, and <code>code review</code>. To analyze one source, create a task with its separate instruction and use <code>--author-missing</code> once; later <code>run</code> calls replay the generated programs without Codex.</p>
<pre><code># Author the reusable circuits required by the reviewer agent's natural-language brief.
node nllAgent.mjs code circuit --agent reviewer
# Validate and refine the complete reusable agent before giving it tasks.
node nllAgent.mjs code review --agent reviewer

# Create a source-specific task and retain the exact analysis request as task input.
node nllAgent.mjs task create --agent reviewer \
  --source inputs/policy.txt \
  --instruction "Find contradictions and unsupported conclusions"

# Author any missing task semantics, execute all assurance modes, and use the printed random task ID.
node nllAgent.mjs analyze --agent reviewer --task task-ID \
  --author-missing --assurance all
# Replay the accepted task programs deterministically to prove no further Codex call is needed.
node nllAgent.mjs run --agent reviewer --task task-ID --assurance all</code></pre>
<p>The first <code>analyze</code> authors missing IntentJS and LongTextJS through Codex and then executes them. The second command imports the retained <code>.mjs</code> programs directly. The complete evaluation automating both reusable-agent and per-task authoring is <code>node nllAgent.mjs evaluate --suite agentic-nl-e2e --invoke-agent</code>.</p>
<h2>Adaptive task-local authoring</h2>
<p>Use the distinct adaptive mode when the inherited agent may lack ontology meanings or a realistic circuit for a complex task. It audits and creates only task-owned semantic modules, executes deterministic acceptance, invokes a mandatory Codex review, and repeats within the explicit cycle bound.</p>
<pre><code># Let Codex add only missing task-local meanings and circuits, iterating until strict acceptance.
node nllAgent.mjs analyze \\
  --agent-dir evaluations/adaptive-task-e2e/agents/adaptive-core-agent \\
  --task-dir evaluations/adaptive-task-e2e/agents/adaptive-core-agent/tasks/task-cold-chain-transfer-core-only \\
  --author-adaptive --authoring-cycles 3 --assurance all

# Accepted programs replay without Codex.
node nllAgent.mjs run \\
  --agent-dir evaluations/adaptive-task-e2e/agents/adaptive-core-agent \\
  --task-dir evaluations/adaptive-task-e2e/agents/adaptive-core-agent/tasks/task-cold-chain-transfer-core-only \\
  --assurance all</code></pre>
<p><code>--author-adaptive</code> and <code>--author-missing</code> are mutually exclusive. See <a href="adaptive-authoring.html">the adaptive lifecycle</a> and <a href="tutorial-adaptive-cold-chain.html">the retained real run</a>.</p>
<h2>Execution and selection</h2>
<pre><code># Analyze the task with the legal-policy profile to constrain available knowledge and checks.
node nllAgent.mjs analyze --agent reviewer --task task-ID --profile legal-policy
# Execute the validation task and print its human-facing Markdown CNL response.
node nllAgent.mjs run --agent-dir examples/validation-agent --task task-symbolic-validation
# Execute the same task but print the machine projection for integrations and debugging.
node nllAgent.mjs run --agent-dir examples/validation-agent --task task-symbolic-validation --format json
# Inspect why providers were selected, rejected, or blocked before executing the task.
node nllAgent.mjs plan --agent reviewer --task task-ID --explain-plan
# Run a generation intent and request the named typed output frame.
node nllAgent.mjs generate --agent reviewer --task task-ID --output PolicySpecificationPlan
# Execute a task-owned semantic query against the materialized store.
node nllAgent.mjs query --agent reviewer --task task-ID --expression queries/open-events.mjs</code></pre>
<p>Selection controls include repeatable <code>--domain</code> and <code>--check</code>, <code>--exclude-domain</code>, <code>--exclude-check</code>, <code>--only</code>, <code>--all-compatible</code>, <code>--profile</code>, <code>--intent</code>, and <code>--assurance abstract|symbolic|all</code>.</p>
<h2>Authoring parameters</h2>
<table><thead><tr><th>Parameter</th><th>Meaning</th></tr></thead><tbody>
<tr><td><code>--agent</code> / <code>--agent-dir</code></td><td>Resolve an agent by default name/path or by an explicit folder.</td></tr>
<tr><td><code>--task</code> / <code>--task-dir</code></td><td>Resolve a random task ID/path or an explicit task folder.</td></tr>
<tr><td><code>--source</code></td><td>Source file copied into a newly created task; repeat the task workflow for additional cases.</td></tr>
<tr><td><code>--instruction</code></td><td>Persistent task direction, kept separate from claims made by the source.</td></tr>
<tr><td><code>--goal</code></td><td>Additional coding-phase objective retained in the run instructions.</td></tr>
<tr><td><code>--model</code></td><td>Explicit coding-agent model override; omitted means local Codex configuration.</td></tr>
<tr><td><code>--coding-agent</code></td><td>Executable used by the current Codex adapter.</td></tr>
<tr><td><code>--resume</code></td><td>Explicit Codex resume identifier for a follow-up authoring run.</td></tr>
<tr><td><code>--prepare-only</code></td><td>Build context and installed skills but do not invoke the adapter.</td></tr>
<tr><td><code>--author-missing</code></td><td>Permit <code>analyze</code> to author missing task semantic programs before deterministic execution.</td></tr>
<tr><td><code>--author-adaptive</code></td><td>Run the task-local intent, ontology, LongText, circuit, deterministic acceptance, and mandatory review lifecycle.</td></tr>
<tr><td><code>--authoring-cycles</code></td><td>Maximum adaptive Codex review cycles, an integer from 1 through 10; default 3.</td></tr>
<tr><td><code>--adaptive-allow-unknown</code></td><td>Permit unknown-only output to satisfy the adaptive material-output gate for intentionally indeterminate tasks.</td></tr>
<tr><td><code>--assurance</code></td><td><code>none</code>, <code>abstract</code>, <code>symbolic</code>, or <code>all</code>; adaptive authoring defaults to <code>all</code>.</td></tr>
<tr><td><code>--format response|json</code></td><td><code>response</code> is the default for run/analyze/generate and prints the grounded Markdown CNL; <code>json</code> prints a machine projection containing its path.</td></tr>
</tbody></table>
<h2>Inspection tools</h2>
<p>The CLI implements <code>context</code>, <code>files</code>, <code>catalog</code>, <code>sdk</code>, <code>profile</code>, <code>source</code>, <code>ontology</code>, <code>longtext</code>, <code>intent</code>, <code>circuit</code>, <code>trace</code>, <code>cnl</code>, and <code>review</code> families. Each reads the same resolved modules used by execution. <code>catalog response</code> enumerates default, agent and task response circuits; <code>sdk check</code>, <code>sdk usage --surface &lt;id&gt;</code>, and <code>plan show</code> expose the remaining live contracts.</p>
<h2>Exit status</h2><table><thead><tr><th>Status</th><th>Meaning</th></tr></thead><tbody><tr><td>0</td><td>Tool completed and requested outputs were written.</td></tr><tr><td>2</td><td>CLI usage error.</td></tr><tr><td>3</td><td>Import, validation, execution, or I/O failure.</td></tr><tr><td>4</td><td>Explicit coding-agent process failed.</td></tr></tbody></table>`));

pages.set("packs.html", shell("Ontology and Circuit Packs", "Default knowledge without hidden facts", `
<p class="lead">Fourteen executable packs are registered: the mandatory core-language vocabulary plus thirteen knowledge packs corresponding to the preserved domain specifications.</p>
<h2>Pack inventory</h2>
<p><code>core-language</code>, <code>core-commonsense</code>, <code>world-basic</code>, <code>math-basic</code>, <code>physics-basic</code>, <code>chemistry-basic</code>, <code>biology-basic</code>, <code>psychology-basic</code>, <code>anthropology-basic</code>, <code>sociology-basic</code>, <code>logic-basic</code>, <code>reasoning-errors</code>, <code>law-basic</code>, and <code>social-interaction</code> are exported by <code>framework/packs/index.mjs</code>.</p>
<h2>Complete predefined knowledge by domain</h2>
<p>The following inventory is generated from every live pack, ontology module, circuit, signal and capability. It distinguishes reusable ontology vocabulary and stable knowledge from executable review/generation behavior; task source claims are never listed as predefined facts.</p>
${packKnowledgeHtml()}
<h2>Pack contract</h2><p>Each domain pack seals ontology modules, consistency or analysis circuits, a generation circuit, lexical and semantic intent signals, capability declarations, tier, knowledge level, and tests. Domain ontology modules reuse the core-language role constructors, preventing cross-pack role identity drift. Pack facts remain distinguishable from task claims through their source class.</p>
<p>Every concept and event frame is assigned explicitly in <code>tools/domain-module-allocations.mjs</code>. Generation fails on a missing or unknown module, missing or unknown symbol, or duplicate assignment; positional distribution is prohibited because module ownership is part of the pack-qualified identity. See <a href="specsLoader.html?spec=DS038-domain-pack-generation-and-module-ownership.md">DS038</a>.</p>
<h2>How a pack participates in one task</h2>
<table><thead><tr><th>Pack part</th><th>What it contributes</th><th>Who consumes it</th><th>What remains task-owned</th></tr></thead><tbody>
<tr><td>Ontology modules</td><td>Reusable typed vocabulary and stable domain knowledge</td><td>LongTextJS constructors and CircuitJS patterns</td><td>Claims asserted by the current source</td></tr>
<tr><td>Intent signals</td><td>Hints that a domain or concern may be relevant</td><td>Profile and intent resolver</td><td>The explicit requested operation</td></tr>
<tr><td>Capabilities and circuits</td><td>Reusable checks or generation behavior</td><td>Capability planner and runner</td><td>Task-only checks when reusable behavior is insufficient</td></tr>
<tr><td>CNL support</td><td>Domain-aware labels and presentation policy</td><td>Response composer</td><td>The actual findings and exact quotations</td></tr>
</tbody></table>
<h2>Profiles and local extension</h2><p>Profiles select a stable pack set or every compatible pack. Agent-local modules extend reusable knowledge; task-local modules override only task ownership. <code>ontology build</code> writes a task/agent-local facade with qualified exports and unqualified names only when collision-free.</p>
<h2>Validation</h2><p>Pack tests check sealed distinct ontologies, real execution through <code>SemanticStore</code>, deterministic intent signals, and canonical CNL round trips. Cross-pack ontology checks detect duplicate identities, subtype cycles, disjoint parents, and invalid inverse references.</p>`));

pages.set("testing-evaluation.html", shell("Testing and Evaluation", "Deterministic checks and isolated benchmarks", `
<p class="lead">Testing verifies existing code without a coding agent. Evaluation measures isolated end-to-end behavior and may include explicit Codex authoring.</p>
<h2>Test commands</h2>
<pre><code># Run the fast framework regression set while developing SDK or runtime code.
node nllAgent.mjs test framework --level fast
# Run every pack's standard ontology, circuit, intent, and CNL checks.
node nllAgent.mjs test packs --level standard
# Run a focused fast check for only the chemistry knowledge pack.
node nllAgent.mjs test packs --pack chemistry-basic --level fast
# Validate one reusable agent's imports, ontology, circuits, response policy, and tests.
node nllAgent.mjs test agent --agent-dir examples/validation-agent
# Validate one task's sources, IntentJS, LongTextJS, anchors, and integration tests.
node nllAgent.mjs test task --agent-dir examples/validation-agent --task task-symbolic-validation
# Run all framework, pack, agent, and task checks at the exhaustive level before release.
node nllAgent.mjs test all --level exhaustive</code></pre>
<p>The framework suite covers logic, collections, ontology validation, transactional atomicity, indexed queries, constraint kernels, temporal closure, fixed points, automata, exploration, decision DAGs, rewriting, slicing, factor inference, planning, CNL, source anchors, and a temporary external agent/task CLI workflow. Pack and example tests execute real modules.</p>
<h2>Evaluation commands</h2>
<pre><code># Exercise deterministic evaluation plumbing without claiming real natural-language agent authoring.
node nllAgent.mjs evaluate --suite school-smoke
# Invoke Codex inside the smoke suite to validate adapter plumbing and retained process evidence.
node nllAgent.mjs evaluate --suite school-smoke --invoke-agent
# Build the reusable rule-review agent and four tasks through real Codex authoring, then execute them.
node nllAgent.mjs evaluate --suite agentic-nl-e2e --invoke-agent
# Re-run the retained real tasks without Codex to detect semantic or response regressions.
node nllAgent.mjs evaluate --suite agentic-nl-e2e --replay-retained
# Run a custom suite with real Codex authoring and an explicit model override.
node nllAgent.mjs evaluate --suite path/to/suite.mjs --invoke-agent --model MODEL</code></pre>
<p>The infrastructure-only school smoke run creates one isolated random-ID task per declared profile, completes deterministic execution and replay, compares the profile ablation, and writes aggregate anchor validity, replay equivalence, and elapsed-time metrics. It is not evidence that a reusable agent was learned from natural language. The <code>agentic-nl-e2e</code> suite retains a natural-language agent brief, runs real architect/ontology/circuit Codex phases, creates four tasks, runs real intent/longtext phases, checks expected findings or generation frames, and proves model-free replay.</p>
<p><code>--replay-retained</code> reuses those exact random-ID tasks and their retained real Codex provenance, but invokes no coding agent. It re-executes current semantic and response code, regenerates reports, and fails non-zero if any strict case, exact quotation, response contract, or replay digest fails. It is mutually exclusive with <code>--invoke-agent</code>.</p>
<p>The DS042 adaptive validation starts with a core-only agent and a cold-chain task that demonstrably lacks task intent, ontology, LongText, circuits, tests, runs, and results. The public <code>analyze --author-adaptive</code> command must generate the missing executable programs through Codex, pass concrete plus abstract and symbolic acceptance, complete mandatory review, and then replay through ordinary <code>run</code>. Its full retained evidence is reproduced in <a href="tutorial-adaptive-cold-chain.html">the adaptive tutorial</a>.</p>
<h2>What an end-to-end evaluation actually does</h2>
<table><thead><tr><th>Step</th><th>Input</th><th>Produced files</th><th>Acceptance question</th></tr></thead><tbody>
<tr><td>1. Author reusable agent knowledge</td><td>Natural-language agent brief</td><td>Agent profile, OntologyJS, CircuitJS, response policy and tests</td><td>Did real Codex runs create importable reusable programs?</td></tr>
<tr><td>2. Author one task</td><td>Task instruction and source text</td><td>Task declaration, IntentJS, LongTextJS and task tests</td><td>Are all claims grounded at exact source offsets?</td></tr>
<tr><td>3. Execute</td><td>Agent and task programs</td><td><code>response.md</code> plus separate findings, trace and assurance files</td><td>Does the public CNL contain the expected real result and decisive evidence?</td></tr>
<tr><td>4. Replay</td><td>The same retained programs, without Codex</td><td>A second deterministic result and response digest</td><td>Are semantic findings and the public response equivalent?</td></tr>
</tbody></table>
<h2>Retained reports</h2><p>Evaluation reports distinguish completed and failed cases and keep failure stacks under <code>reports/failures/</code>. Authoring reports link each real subprocess to instructions, installed skills, context, stdout, stderr, final response and created/modified code. Gold expectations may be executable <code>.gold.mjs</code> modules. Precision, recall, F1, anchor validity, replay equivalence, runtime, generated frames and assurance artifacts remain tied to task IDs.</p>`));

async function validationTutorialContent() {
  const agentRoot = resolve(root, "examples/validation-agent");
  const taskRoot = resolve(agentRoot, "tasks/task-symbolic-validation");
  const resultRoot = resolve(taskRoot, "results");
  const taskPath = resolve(taskRoot, "task.mjs");
  const sourcePath = resolve(taskRoot, "source/incident.txt");
  const task = await loadDefaultIfPresent(taskPath, null);
  const instruction = (task?.instructions ?? [])
    .filter((directive) => directive.kind === "instruction")
    .map((directive) => directive.value)
    .join("\n\n");
  const taskFiles = [
    taskPath,
    resolve(taskRoot, "source/source-map.mjs"),
    ...await filesBelow(resolve(taskRoot, "intent"), ".mjs"),
    ...await filesBelow(resolve(taskRoot, "longtext"), ".mjs"),
    ...await filesBelow(resolve(taskRoot, "tests"), ".mjs")
  ].map((path) => ownedArtifact("task", path, taskRoot));
  const agentFiles = [
    resolve(agentRoot, "agent.mjs"),
    ...await filesBelow(resolve(agentRoot, "ontologies"), ".mjs"),
    ...await filesBelow(resolve(agentRoot, "circuits"), ".mjs"),
    ...await filesBelow(resolve(agentRoot, "cnl"), ".mjs")
  ].map((path) => ownedArtifact("agent", path, agentRoot));
  const resolvedAgentDependencies = [
    ownedArtifact(
      "agent",
      resolve(root, "examples/ontologies/facility.ontology.mjs"),
      agentRoot,
      "imports/examples/ontologies/facility.ontology.mjs"
    ),
    ownedArtifact(
      "agent",
      resolve(root, "examples/circuits/facility-order.circuit.mjs"),
      agentRoot,
      "imports/examples/circuits/facility-order.circuit.mjs"
    )
  ];
  const responsePath = resolve(resultRoot, "response.md");
  const explorer = await artifactBrowser({
    Input: Object.freeze({
      provenance: Object.freeze({ description: "The instruction and incident are committed example input; no coding command generated them." }),
      entries: [Object.freeze({ label: "task/task-instruction.txt", content: instruction, language: "text" }), ownedArtifact("task", sourcePath, taskRoot)]
    }),
    Intermediate: Object.freeze({
      provenance: Object.freeze({
        description: "These are committed agent and task programs; this fast task command validates them without invoking Codex.",
        command: "node nllAgent.mjs test task --agent-dir examples/validation-agent --task task-symbolic-validation --level fast"
      }),
      entries: [...agentFiles, ...resolvedAgentDependencies, ...taskFiles]
    }),
    Output: Object.freeze({
      provenance: Object.freeze({
        description: "This deterministic execution uses the committed programs and regenerates the public CNL response.",
        command: "node nllAgent.mjs run --agent-dir examples/validation-agent --task task-symbolic-validation --assurance all"
      }),
      entries: [ownedArtifact("task", responsePath, taskRoot)]
    })
  }, root, escapeHtml);
  return `<p class="lead">This committed example answers one concrete question: did Ana open the north gate after the facility alarm? It uses a pre-existing validation agent, translates the two incident sentences into typed events and an explicit temporal relation, then returns one grounded Markdown CNL confirmation.</p>
<h2>Input ownership and requested result</h2>
<p><strong>Agent input:</strong> none. The validation agent and its imported facility ontology and ordering circuit already exist before this task runs. <strong>Task input:</strong> <code>task/task-instruction.txt</code> asks for the order check with retained evidence, and <code>task/source/incident.txt</code> states that the alarm sounded at 08:57 and the gate opened at 09:00.</p>
<p>The desired result is a decision about that ordering, not a state-machine trace or a symbolic-path tutorial. Auxiliary assurance still runs and is retained elsewhere, but the application-facing output is one CNL answer.</p>
<h2>Retained input, executable interpretation, and public answer</h2>
<p>The artifact tree keeps every stage visible. <strong>Input</strong> contains only task text because this run does not author an agent. <strong>Intermediate</strong> lists the pre-existing <code>agent/</code> modules and their resolved shared imports before the task-owned declaration, source map, IntentJS, LongTextJS, and test. <strong>Output</strong> contains only <code>task/results/response.md</code>. The branch notes distinguish committed inputs and programs from the commands that validate and execute them.</p>
${explorer}
<h2>How the incident text became executable meaning</h2>
<p>The facility ontology defines <code>Alarm</code> and <code>Open</code> events with typed locations, actors, gates, and clock times. The task's LongTextJS constructs an alarm event at 08:57 in Building A and an opening event at 09:00 by Ana, anchors each claim with <code>spanByText</code>, and states <code>before(alarmEvent, openingEvent)</code>. Complete coverage for <code>Alarm</code> and <code>Open</code> tells the runtime that both relevant event classes were inspected.</p>
<p><code>task/intent/facility.intent.mjs</code> selects the reusable <code>FacilityOrderFinding</code> capability. The circuit queries typed alarm and opening values, evaluates their <code>before</code> relation, and has separate satisfied, violated, and unknown decision rows. For these times, the satisfied row emits <code>ORDER_OK</code> with both event claims as evidence.</p>
<h2>Why the CNL answer is <code>ORDER_OK</code></h2>
<p><code>task/results/response.md</code> reports one <code>ORDER_OK:SATISFIED</code> confirmation and reproduces both exact source sentences directly, with relative links back to the source. It does not show character offsets, abstract domains, or symbolic paths because those values support validation and debugging rather than answer the task's natural-language question.</p>`;
}

pages.set("tutorial-agent-task.html", shell(
  "Tutorial: Minimal Text-to-CNL Run",
  "One input, inspectable programs, one grounded response",
  await validationTutorialContent()
));

pages.set("results.html", shell("Artifacts and Retained Results", "Inspectable outputs rather than opaque responses", `
<p class="lead">Every important intermediate and final result is a file owned by an agent run, task result, or evaluation suite.</p>
<h2>Task results</h2>
<table><thead><tr><th>Artifact</th><th>Purpose</th></tr></thead><tbody>
<tr><td><code>response.md</code></td><td>primary tagged, grounded, human-readable Markdown CNL answer</td></tr>
<tr><td><code>artifacts.md</code></td><td>relative links to semantic programs, Codex runs, and technical evidence</td></tr>
<tr><td><code>response-circuits.mjs</code></td><td>technical response-policy selection and stage trace</td></tr>
<tr><td><code>execution-plan.md</code></td><td>profile, loaded packs, selected/rejected circuits, and blocked capabilities</td></tr>
<tr><td><code>findings.mjs</code></td><td>executable finding structures reconstructed through the SDK</td></tr>
<tr><td><code>findings.cnl</code></td><td>canonical evidence-bearing finding frames</td></tr>
<tr><td><code>observations.cnl</code></td><td>findings and generated CNL frames</td></tr>
<tr><td><code>generation-plan.cnl</code></td><td>semantic plan frames usable by a later expansion circuit or coding agent</td></tr>
<tr><td><code>coverage.md</code></td><td>coverage witnesses and executed pack summary</td></tr>
<tr><td><code>diagnostics.md</code></td><td>typed planning and execution failures</td></tr>
<tr><td><code>trace.bin</code></td><td>Node V8 binary serialization of semantic trace projections</td></tr>
<tr><td><code>assurance.mjs</code></td><td>executable abstract/symbolic auxiliary results</td></tr>
<tr><td><code>report.md</code></td><td>technical task-level execution summary</td></tr>
</tbody></table>
<h2>Coding-run context</h2><p>A run directory contains <code>INSTRUCTIONS.md</code>, executable <code>run.mjs</code>, installed skill folders, context catalogs, checks, scratch space, and process logs. Exact design-specification paths and the project CLI invocation are resolved for the selected working directory.</p>
<h2>Source artifacts</h2><p><code>source/source-map.mjs</code> registers decoded text, extractor metadata, and stable units. Its generated import path points to the selected project's SDK even for an explicit agent directory. UTF-8 formats and ordinary unencrypted PDF text streams have built-in extraction. A task can add or override a decoder with <code>source/extractors/&lt;extension&gt;.extractor.mjs</code>; unsupported filters, scans, encryption, or formats retain typed diagnostics rather than fabricated text. DS037 defines decoded-offset provenance.</p>
<h2>No semantic JSON</h2><p>Findings, gold expectations, source maps, run declarations, suite declarations, and catalogs use executable modules or human-readable Markdown/CNL. Environment-managed Codex/plugin configuration is outside the project artifact model and is not a build or runtime dependency.</p>`));

const skillIds = ["nll-architect", "nll-orchestrator", "nll-sdk", "nll-runtime", "nll-intent", "nll-ontology", "nll-longtext", "nll-circuit", "nll-test", "nll-evaluate"];
const skillLinks = skillIds.map((id) => `<tr><td><a href="skill-${id}.html"><code>${id}</code></a></td><td>${escapeHtml(skillAcceptance[id])}</td></tr>`).join("");
pages.set("skills.html", shell("Skill Catalog", "Executable coding workflows", `
<p class="lead">The ten project-owned skills are executable authoring contracts between a coding phase and Codex. A skill does more than name a specialty: its Markdown explains the decisions Codex must make, while its adjacent JavaScript manifest tells the framework which contracts, live context, commands, dependencies, owners, and phases make those decisions possible.</p>
<h2>Why there are two files</h2>
<p><code>SKILL.md</code> is read by Codex after the run instructions. It explains the semantic boundary, the ordered work, implementation rules, and completion criterion in operational language. <code>workflow.mjs</code> is imported by nllAgent before Codex starts. The immutable <code>CodingSkill</code> value created by that module is the machine-checkable source for dependency closure, context selection, CLI availability, edit ownership, and phase applicability. Keeping both files in the same folder lets framework tests compare executable declarations with the project that must satisfy them.</p>
<h2>How a request becomes a bounded coding context</h2>
<p>A command such as <code>code longtext</code> first maps the phase to <code>nll-longtext</code>. The loader recursively imports every declared dependency, rejects a cycle, and orders dependencies before their consumer. Only those folders are copied below the new run's <code>skills/</code> directory. The context builder then takes the union of their declared context artifact names and DS references. It materializes that exact union from the currently selected project, profile, agent, task, and decoded sources; it does not paste a generic repository summary into every run.</p>
<p>The resulting <code>INSTRUCTIONS.md</code> gives Codex the goal, project root, canonical working directory, CLI entry point, dependency-ordered skill files, exact DS files, and exact context inventory. These compact files are discovery projections. They show real imports and semantic identities so Codex can deliberately open canonical modules for additional implementation detail. They never replace the SDK, ontology, circuit, or source programs from which they were generated.</p>
<h2>How completion is established</h2>
<p>The skill workflow names narrow commands that Codex must run while editing. The generated <code>run.mjs</code> also records the standard owner-level fast test. An ordinary direct coding command retains Codex's process evidence and final report; evaluation and adaptive authoring add stronger framework-controlled phase acceptance over imports, ontology diagnostics, source anchors, providers, focused tests, concrete results, auxiliary assurance, and public CNL. The individual pages identify this boundary for each skill instead of calling every layer simply “validation.”</p>
<h2>The ten contracts</h2>
<table><thead><tr><th>Skill</th><th>What its acceptance must prove</th></tr></thead><tbody>${skillLinks}</tbody></table>
<p>Environment-managed maintenance skills remain outside this catalog. They may guide a development session, but they are neither copied into coding runs nor published as nllAgent runtime capability.</p>`));

for (const skillId of skillIds) {
  const skillRoot = resolve(root, "nll-skills", skillId);
  const workflowPath = resolve(skillRoot, "workflow.mjs");
  const workflow = (await import(`${pathToFileURL(workflowPath).href}?docs=${Date.now()}`)).default;
  const chain = await resolveSkillChain(root, [skillId]);
  const markdown = await readFile(resolve(skillRoot, "SKILL.md"), "utf8");
  const manifestSource = await readFile(workflowPath, "utf8");
  const purpose = markdownSection(markdown, "Purpose and invocation").split(/\n\n/)[0] || "See the local skill contract.";
  const completion = markdownSection(markdown, "Completion criterion");
  const dependencyOrder = chain.map((entry) => entry.id);
  const contextNames = supportedContextArtifacts.filter((name) => chain.some((entry) => entry.workflow.contextArtifacts.some((artifact) => artifact.name === name)));
  const contextRows = contextNames.map((name) => `<tr><td>${code(name)}</td><td>${escapeHtml(contextArtifactExplanations[name])}</td></tr>`).join("");
  const toolRows = workflow.tools.map((entry) => `<tr><td>${code(entry.command)}</td><td>${escapeHtml(commandExplanation(entry.command))}</td></tr>`).join("");
  const manifestRows = [
    [".specs(...) — design contracts", workflow.designSpecifications.map(code).join(" ")],
    [".context(...) — this skill's context", workflow.contextArtifacts.map((entry) => code(entry.name)).join(" ")],
    [".tools(...) — routed CLI dependencies", `${workflow.tools.length} commands, each explained in the tool section below`],
    [".dependsOn(...) — installed order", dependencyOrder.map(code).join(" → ")],
    [".edits(...) — canonical owners", workflow.editRoots.map((entry) => code(entry.value)).join(" ")],
    [".phase(...) — applicable lifecycle", workflow.phases.map(code).join(" → ")]
  ].map(([name, value]) => `<tr><td>${name}</td><td>${value || "none"}</td></tr>`).join("");
  pages.set(`skill-${skillId}.html`, shell(`${skillId} Skill`, "Coding workflow contract", `
<p class="lead">${inlineMarkdown(purpose)}</p>
<h2>What the executable manifest controls</h2>
<p>When this skill is a phase root, nllAgent imports its adjacent <code>workflow.mjs</code> through the local SDK's <code>CodingSkill</code> builder. The manifest values below are not copied documentation; they are the live values used to prepare a coding run. Dependency order determines which skill instructions Codex reads first. The dependency-closed context union determines which projections exist. Edit roots communicate ownership, while the tool declarations identify the project commands the workflow depends on.</p>
<table><thead><tr><th>Manifest field</th><th>Live value and effect</th></tr></thead><tbody>${manifestRows}</tbody></table>
<h2>How this skill receives enough context</h2>
<p>The context builder first resolves the selected profile plus framework, agent, and task modules. It then materializes only the following artifacts requested by this skill and its dependencies. Each artifact is generated from live objects or retained source state; Codex follows its identities and paths into canonical code whenever the phase requires more detail.</p>
<table><thead><tr><th>Generated context</th><th>What it contains and why it is present</th></tr></thead><tbody>${contextRows}</tbody></table>
<p><code>INSTRUCTIONS.md</code> places these files after the installed skills and exact DS contracts in the mandatory reading order. The adjacent <code>run.mjs</code> records the Codex adapter, canonical working directory, dependency-ordered skill IDs, objective, edit owner, and owner-level fast test. This keeps the prompt short without hiding where deeper knowledge lives.</p>
<h2>What its declared tools actually do</h2>
<p>These commands are routed through the same CLI used by a programmer and by retained evaluations. Framework tests reject a declared command that has no real route. The skill uses their observable outputs as discovery or validation evidence, not as prose suggestions.</p>
<table><thead><tr><th>Declared command</th><th>Purpose and observable evidence</th></tr></thead><tbody>${toolRows}</tbody></table>
<h2>The authoring workflow Codex follows</h2>
<p>The following sequence is taken directly from this skill's <code>SKILL.md</code>. Earlier steps establish semantic responsibility and reuse; later steps author canonical modules and obtain deterministic evidence. Codex may open more canonical code as needed, but it may not replace these boundaries with JSON descriptions or ungrounded text.</p>
${workflowHtml(markdown)}
<h2>How this skill verifies its result</h2>
<p>${escapeHtml(skillAcceptance[skillId])}</p>
<p>There are three separate verification responsibilities. Codex runs the narrow commands declared above while it edits. The generated run manifest records the owner-level fast test. Evaluation or adaptive authoring, when used, independently inspects created and modified canonical files and applies phase-specific acceptance before it claims successful natural-language authoring. An ordinary <code>code</code> invocation retains the agent's report but must not be confused with those stronger evaluation gates.</p>
<h3>Completion criterion from the skill</h3>
${markdownParagraphs(completion)}
<h2>The complete live manifest</h2>
<p>This is the executable module imported by the loader. It is shown in full so dependencies, context, tools, edit roots, and phases can be reviewed against the prose above.</p>
<pre><code class="language-javascript">${escapeHtml(manifestSource.trimEnd())}</code></pre>
<p>The authoritative skill contract is <a href="specsLoader.html?spec=DS${String(22 + skillIds.indexOf(skillId)).padStart(3, "0")}-${skillId}.md">its DS entry</a>, synchronized with <code>nll-skills/${skillId}/SKILL.md</code> and <code>workflow.mjs</code>.</p>`));
}

pages.set("documentation-ownership.html", shell("Documentation ownership", "Project and environment boundary", `
<p class="lead">All published documentation, templates, assets, generators, and verifiers are project-owned. Environment-managed agent skills may guide maintenance but are not product source or runtime capabilities.</p>
<h2>Self-contained generation</h2><p>The generators read <code>design-specifications/</code>, <code>nll-skills/</code>, project code, retained evaluations, and project-owned files under <code>tools/</code>. They do not read environment-managed skill directories, home folders, a CDN, or a fixed deployment path.</p>
<table><thead><tr><th>Generated product</th><th>Project-owned input</th><th>Verification</th></tr></thead><tbody>
<tr><td>DS000 through DS044</td><td>Preserved design specifications plus additive specification sources</td><td>Contiguous numbering and verbatim-source fidelity</td></tr>
<tr><td>Technical HTML pages</td><td>Live SDK, runtime, packs, skills and documentation generators</td><td>Relative-link and static-site checks</td></tr>
<tr><td>Tutorial pages</td><td>Accepted retained input, semantic programs and <code>response.md</code></td><td>Generation fails when required retained evidence is missing</td></tr>
</tbody></table>
<p>See <a href="specsLoader.html?spec=DS032-documentation-and-specification-ownership.md">DS032</a>.</p>`));

pages.set("specification-review.html", shell("Specification review", "Project-owned contract synchronization", `
<p class="lead">A review identifies affected DS files, code, tests, CLI behavior, HTML pages, tutorials, and unresolved decisions before editing.</p>
<h2>Review sequence</h2>
<ol><li>Identify the new requirement or observed failure and list every affected DS and implementation surface.</li><li>Compare the current contract with actual code and retained evidence.</li><li>Update normative Core Content before recording rationale in the next numbered question.</li><li>Synchronize code, tests, CLI help, tutorials and other companion documentation.</li><li>Regenerate the official DS set and HTML, then run fidelity, behavior and link checks.</li></ol>
<p>Initial specifications remain byte-for-byte preserved. Additive contracts are regenerated from project-owned sources and verified in numeric order. See <a href="specsLoader.html?spec=DS033-specification-review-contract.md">DS033</a>.</p>`));

pages.set("documentation-generation.html", shell("Documentation generation", "Detailed, portable, evidence-backed HTML", `
<p class="lead">The HTML set is rebuilt from implementation and retained accepted evaluations. Tutorials fail closed rather than inventing a source, semantic module, agent run, or result.</p>
<h2>Portability</h2><p>Every link, asset import, specification query, and partial fetch is document-relative. The generated site is verified under a non-root path, including the matrix query and project-owned artifact explorer.</p>
<h2>Tutorial boundary</h2><p>Every tutorial presents the same programmer-facing sequence: exact text input, inspectable intermediate semantic files, then one public <code>response.md</code>. Coding-run logs, assurance projections and evaluation metrics remain in the dedicated workflow and result documentation instead of becoming separate tutorial stories.</p>
<p>See <a href="specsLoader.html?spec=DS040-html-documentation-generation-and-portability.md">DS040</a>.</p>`));

for (const page of await buildAgenticDocumentationPages({ root, escapeHtml })) {
  pages.set(page.name, shell(page.title, page.kicker, page.content));
}
for (const page of buildUnderstandDocumentationPages()) {
  pages.set(page.name, shell(page.title, page.kicker, page.content));
}

await writeFile(resolve(docs, "styles.css"), documentationStyles);
await writeFile(resolve(docs, "partials", "header.html"), documentationHeader());
await writeFile(resolve(docs, "partials", "footer.html"), `<footer class="site-footer">nllAgent technical documentation. The DS set is authoritative; generated catalogs report the current executable implementation.</footer>`);
await writeFile(resolve(docs, "partials-loader.js"), `document.addEventListener("DOMContentLoaded", async () => { for (const node of document.querySelectorAll("[data-include]")) { const response = await fetch(node.dataset.include); if (!response.ok) { node.textContent = \`Unable to load \${node.dataset.include}\`; continue; } node.innerHTML = await response.text(); } });\n`);
await writeFile(
  resolve(docs, "assets", "artifact-browser.mjs"),
  await readFile(resolve(root, "tools", "docs-assets", "artifact-browser.mjs"), "utf8")
);
await writeFile(
  resolve(docs, "specsLoader.html"),
  await readFile(resolve(root, "tools", "docs-assets", "specsLoader.html"), "utf8")
);
for (const [name, html] of pages) await writeFile(resolve(docs, name), html);
await rm(resolve(docs, "tutorial-symbolic.html"), { force: true });
await rm(resolve(docs, "assets", "diagram-renderer.mjs"), { force: true });
console.log(`Generated ${pages.size} detailed HTML documentation pages.`);
