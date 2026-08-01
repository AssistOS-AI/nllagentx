#!/usr/bin/env node
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { buildAgenticDocumentationPages } from "./docs-agentic-pages.mjs";
import { documentationHeader, documentationSectionNavigation } from "./docs-navigation.mjs";
import { documentationStyles } from "./docs-styles.mjs";

const root = resolve(import.meta.dirname, ".."); const docs = resolve(root, "docs");
await mkdir(resolve(docs, "partials"), { recursive: true }); await mkdir(resolve(docs, "assets"), { recursive: true });

const diagrams = `<script type="module">
    import diagrams from './assets/diagram-renderer.mjs';
    diagrams.initialize({ startOnLoad: true });
  </script>`;
const escapeHtml = (value) => String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
const code = (value) => `<code>${escapeHtml(value)}</code>`;
function shell(title, kicker, content) {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>nllAgent Documentation — ${escapeHtml(title)}</title>
  <link rel="stylesheet" href="styles.css">
  ${diagrams}
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

const pages = new Map();
pages.set("index.html", shell("System Guide", "Executable semantic programs", `
<p class="lead">nllAgent is a dependency-free Node.js workbench for authoring source-grounded semantic programs, selecting reusable semantic circuits, and retaining evidence-bearing findings and controlled-language artifacts. Its semantic languages are executable <code>.mjs</code> modules rather than serialized data formats.</p>
<div class="callout"><strong>Specification authority.</strong> The contiguous DS set is authoritative. Start with <a href="specsLoader.html?spec=DS000-vision.md">DS000</a> and the <a href="specsLoader.html?spec=DS001-coding-style.md">coding-style contract</a>; use the <a href="specsLoader.html?spec=matrix.md">specification matrix</a> for the complete set.</div>
<h2>How the system fits together</h2>
<pre class="mermaid">flowchart LR
  Source[Source files] --> SourceMap[Source registry and units]
  Intent[IntentJS and profile] --> Resolver[Runtime resolver]
  Packs[Default and local packs] --> Resolver
  SourceMap --> LongText[LongTextJS]
  LongText --> Store[SemanticStore]
  Resolver --> Planner[Capability planner]
  Store --> Planner
  Planner --> Runner[Circuit runner]
  Runner --> SemanticResults[Findings and typed CNL frames]
  SemanticResults --> ResponseCircuits[Intent-selected response circuits]
  ResponseCircuits --> Results[Grounded response.md]
  SemanticResults --> Technical[Trace, assurance, diagnostics]
  Skills[Coding skills] --> Context[Run-local context]
  Context --> Codex[Explicit coding-agent adapter]
  Codex --> Ontology[OntologyJS]
  Codex --> Circuits[Semantic CircuitJS]
  Codex --> ResponseCircuits
  Codex --> Intent
  Codex --> LongText
  Ontology --> Store
  Circuits --> Planner</pre>
<h2>Repository structure and ownership</h2>
<p>The SDK defines semantic values and fluent builders. The runtime materializes one logical store, closes circuit dependencies, schedules stages, and executes concrete or declared auxiliary methods. Framework packs provide default ontology and circuit modules. Agent folders own reusable extensions; task folders own source interpretation, intent, task-local code, tests, coding runs, and retained results.</p>
<div class="tree" role="group" aria-label="Repository layout">
  <div><strong>framework/sdk/</strong><span>OntologyJS, LongTextJS, IntentJS, CircuitJS, CNL, agents, evaluation</span></div>
  <div><strong>framework/runtime/</strong><span>store, planner, scheduler, algorithms, cache, trace</span></div>
  <div><strong>framework/packs/</strong><span>core language and thirteen default knowledge packs</span></div>
  <div><strong>framework/tools/ + framework/cli/</strong><span>workspace, context, execution, tests, evaluation, CLI</span></div>
  <div><strong>nll-skills/</strong><span>ten executable coding workflows</span></div>
  <div><strong>docs/specs/</strong><span>official gap-free contract set</span></div>
</div>
<p>For a folder-by-folder ownership map, see <a href="project-structure.html">Project folders and ownership</a>. For the natural-language-to-program lifecycle, see <a href="agentic-authoring.html">Agentic natural-language authoring</a>.</p>
<h2>Runtime defaults</h2>
<p>Commands use <code>node nllAgent.mjs</code>. Semantic configuration always names an agent through <code>--agent</code> or <code>--agent-dir</code>; task operations also use <code>--task</code> or <code>--task-dir</code>. The mandatory <code>core-language</code> pack supplies shared vocabulary. Profiles and explicit CLI controls select additional packs. When intent remains open, the planner executes every compatible circuit in the resolved pack set and records the selection.</p>
<h2>Tests and documentation maintenance</h2>
<p>Tests use <code>node:test</code>, executable fixtures, semantic assertions, deterministic generators, and mutation helpers. They never invoke a coding agent. Evaluation is separate and may invoke Codex only when requested. Code changes that alter a contract must update both the relevant HTML page and DS file. The <a href="testing-evaluation.html">testing and evaluation chapter</a> gives the runnable commands.</p>`));

pages.set("architecture.html", shell("Architecture and Execution Model", "Boundaries and data flow", `
<p class="lead">The implementation separates authoring, semantic materialization, capability planning, execution, and retained explanation. Full JavaScript remains available to authors, but semantic state changes pass through explicit SDK and runtime boundaries.</p>
<h2>Layer responsibilities</h2>
<table><thead><tr><th>Layer</th><th>Owns</th><th>Does not own</th></tr></thead><tbody>
<tr><td>SDK</td><td>immutable handles, fluent builders, identities, DSL contracts</td><td>workspace discovery or process invocation</td></tr>
<tr><td>Runtime</td><td>transactional store, queries, planner, scheduler, methods, traces</td><td>source interpretation authored by Codex</td></tr>
<tr><td>Packs</td><td>default ontology, circuits, CNL support, selection signals</td><td>task-specific claims</td></tr>
<tr><td>Tools and CLI</td><td>folders, sources, context, execution, tests, evaluation</td><td>hidden semantic inference outside modules</td></tr>
<tr><td>Coding skills</td><td>agent-facing workflow, dependencies, edit roots, checks</td><td>runtime acceptance decisions</td></tr>
</tbody></table>
<h2>Agent and task resolution</h2>
<pre class="mermaid">flowchart TD
  CLI[CLI options] --> A{Agent selector}
  A -->|--agent name| DefaultAgent[agents/name]
  A -->|path-like or --agent-dir| ExplicitAgent[explicit folder]
  DefaultAgent --> T{Task selector}
  ExplicitAgent --> T
  T -->|--task id| DefaultTask[agent/tasks/id]
  T -->|path-like or --task-dir| ExplicitTask[explicit folder]
  DefaultTask --> R[Runtime resolution]
  ExplicitTask --> R
  R --> Core[core-language]
  R --> Profile[profile packs]
  R --> Local[agent and task modules]</pre>
<p>Module specifiers generated for agents and tasks are relative to the target file and the explicit project root. This allows an agent directory to live outside the default <code>agents/</code> directory while using the same framework SDK.</p>
<h2>Concrete execution and assurance</h2>
<p><code>executeTask()</code> loads ontologies, commits LongTextJS through a transaction, plans capability closure, and schedules each selected circuit. Findings and frames are derived from actual stage values. If both the intent/profile and circuit declare auxiliary support, abstract preflight and symbolic decision coverage are also retained in <code>results/assurance.mjs</code> and <code>assurance.md</code>.</p>
<h2>Failure semantics</h2>
<p>Process exit status describes tool success. Semantic outcomes remain findings such as <code>UNKNOWN</code>, <code>CONFLICT</code>, <code>BLOCKED_ONTOLOGY</code>, or <code>BLOCKED_COVERAGE</code>. Source decoding failures retain typed diagnostics without pretending that binary extraction succeeded.</p>`));

pages.set("source-ingestion.html", shell("Source Ingestion and Provenance", "Deterministic bytes-to-spans pipeline", `
<p class="lead">Source ingestion turns retained files into deterministic decoded text before a coding agent can author LongTextJS with exact evidence. It supports UTF-8 formats, ordinary PDF text streams, and task-owned decoder modules without introducing semantic JSON or hidden semantic extraction.</p>
<div class="callout"><strong>Boundary.</strong> Ingestion stops at text, units, digests, offsets and non-semantic outlines. It does not infer IntentJS, LongTextJS, ontology, circuits, findings or generated answers. Codex performs that semantic authoring in explicit skill phases; deterministic runtime commands reuse the resulting code.</div>
<h2>Run and inspect ingestion</h2>
<pre><code>node nllAgent.mjs source ingest \
  --agent-dir examples/validation-agent \
  --task task-symbolic-validation

node nllAgent.mjs source outline \
  --agent-dir examples/validation-agent \
  --task task-symbolic-validation

node nllAgent.mjs source search \
  --agent-dir examples/validation-agent \
  --task task-symbolic-validation \
  --text "alarm"

node nllAgent.mjs source verify-anchors \
  --agent-dir examples/validation-agent \
  --task task-symbolic-validation</code></pre>
<h2>Extraction dispatch</h2>
<pre class="mermaid">flowchart TD
  Bytes[Retained source bytes] --> Custom{Task extractor exists?}
  Custom -->|yes| Adapter[source/extractors/ext.extractor.mjs]
  Custom -->|no| Format{Known built-in?}
  Format -->|UTF-8 text| UTF8[Deterministic UTF-8 decode]
  Format -->|PDF| PDF[Header, encryption, stream/filter, text-operator decode]
  Format -->|unsupported| Diagnostic[Typed source diagnostic]
  Adapter --> Validate[Validate text and metadata]
  UTF8 --> Validate
  PDF --> Validate
  Validate --> Segment[Stable SourceUnits]
  Segment --> Hash[Decoded-text digest]
  Hash --> Map[Executable source-map.mjs]</pre>
<h2>Task-local extractor contract</h2>
<p>Create <code>source/extractors/bin.extractor.mjs</code> when a task owns <code>.bin</code> material. The adapter receives the bytes and returns decoded text plus replay metadata:</p>
<pre><code>export function extractSource({ bytes }) {
  const text = decodeKnownCorpusFormat(bytes);
  return Object.freeze({
    text,
    metadata: Object.freeze({ format: "known-corpus-v1" })
  });
}</code></pre>
<p>The generated registry records extractor metadata, a SHA-256 digest of decoded text, and absolute decoded offsets. A LongTextJS anchor is valid only when the source, unit, bounds, digest, and selected text hash all match. Encrypted, scanned, or custom-font PDFs require a retained task adapter; the built-in never invents OCR text.</p>
<h2>Observed output</h2>
<p>The validation task produces one source unit, and its two facility-event claims verify against exact source spans. <code>results/source-diagnostics.md</code> states <code>No source extraction diagnostics.</code> after a clean ingestion, avoiding stale errors from earlier source revisions.</p>
<p>See <a href="specsLoader.html?spec=DS037-source-extraction-and-stable-offsets.md">DS037</a> for extraction and decoded offsets and <a href="specsLoader.html?spec=DS041-agentic-natural-language-authoring.md">DS041</a> for the coding-agent authoring boundary.</p>`));

pages.set("semantic-dsls.html", shell("Semantic DSLs and SDK", "Executable .mjs contracts", `
<p class="lead">The DSLs share stable semantic identities while preserving separate responsibilities. The root SDK offers namespace exports for cases where two DSLs intentionally use the same fluent name.</p>
<h2>OntologyJS</h2><p>Ontology builders declare pack-qualified concepts, roles, relations, lexicalizations, facts, laws, capabilities, and cardinalities. Sealed modules expose generated constructors through <code>constructorFor()</code> and diagnostic construction through <code>tryConstruct()</code>. Ground terms enforce declared role cardinality and direct range constraints; pattern terms may omit roles for partial queries. Read the <a href="ontologyjs.html">detailed OntologyJS chapter</a>.</p>
<h2>Live public API inventory</h2><p><code>framework/sdk/public-api.mjs</code> inventories nine narrow surfaces from their imported namespaces. Run <code>node nllAgent.mjs sdk check</code> to validate the live export sets and <code>node nllAgent.mjs sdk usage --surface longtext</code> for canonical paths, exports, and composition examples. Repeated fluent names are reported and resolved through narrow imports or root namespaces. See <a href="specsLoader.html?spec=DS039-sdk-public-surfaces-and-tooling.md">DS039</a>.</p>
<h2>LongTextJS</h2><p>LongTextJS separates terms from claims, anchors claims to exact <code>SourceSpan</code> values, represents context and alternatives, and commits coverage witnesses explicitly. Source verification checks source identity, digest, unit identity, bounds, and text hashes before an anchor is considered valid. Read the <a href="longtextjs.html">detailed LongTextJS chapter</a>.</p>
<h2>IntentJS and profiles</h2><p>Intent modules express modes, domains, concerns, evidence policy, assurance, outputs, exclusions, scope, resources, and fallback. Profiles are executable modules that choose packs and selection policy. CLI domains, exclusions, checks, and text signals can refine runtime resolution without replacing the canonical task module. Read the <a href="intentjs.html">detailed IntentJS chapter</a>.</p>
<h2>CircuitJS and CNL</h2><p>Circuits declare requirements and provisions, then compose queries, decision tables, procedural stages, emissions, and assurance requests. The scheduler infers stage dependencies from semantic references. CNL frames retain typed slots and provenance, render to a canonical textual form, and parse back for semantic comparison. Read the <a href="circuitjs.html">detailed CircuitJS chapter</a>.</p>
<pre class="mermaid">classDiagram
  SemanticHandle <|-- SemanticTerm
  SemanticHandle <|-- Claim
  SemanticHandle <|-- QueryNode
  SemanticHandle <|-- Finding
  SemanticHandle <|-- CNLFrame
  OntologyModule --> SemanticTerm : constructors
  LongTextModel --> Claim : contains
  CircuitModel --> QueryNode : stages
  CircuitModel --> Finding : emits
  CircuitModel --> CNLFrame : emits</pre>
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
<pre class="mermaid">sequenceDiagram
  participant I as Intent/Profile
  participant P as Capability planner
  participant S as SemanticStore
  participant R as Circuit registry
  I->>P: requested concerns and outputs
  P->>S: available concepts and capabilities
  P->>R: ranked providers
  P->>P: recursively satisfy requirements
  P-->>I: selected, rejected, blocked, explanation</pre>
<p>The all-compatible pass continues until no newly compatible circuit remains. Provider order is stable by cost and semantic identity. A missing provider produces <code>PLAN_NO_PROVIDER</code>; cycles produce <code>PLAN_CAPABILITY_CYCLE</code>.</p>`));

pages.set("cli-reference.html", shell("CLI Reference", "Commands and parameters", `
<p class="lead">All command families are implemented by <code>framework/cli/main.mjs</code> and use Node.js built-ins. Run <code>node nllAgent.mjs help</code> for the compact grammar.</p>
<h2>Workspace and coding commands</h2>
<pre><code>node nllAgent.mjs agent create --agent reviewer --profile general-broad
node nllAgent.mjs task create --agent reviewer --source notes.md \
  --title "Policy review" --instruction "Find grounded contradictions"
node nllAgent.mjs code architect --agent reviewer \
  --goal "Read source/agent-brief.md and create the reusable agent plan"
node nllAgent.mjs code ontology --agent reviewer
node nllAgent.mjs code intent --agent reviewer --task task-ID
node nllAgent.mjs code longtext --agent reviewer --task task-ID --model MODEL
node nllAgent.mjs code review --agent reviewer --task task-ID --diagnostics failures.md
node nllAgent.mjs code circuit --agent-dir path/to/agent --task-dir path/to/task --prepare-only</code></pre>
<p><code>--prepare-only</code> builds the exact context and skill dependency chain without invoking Codex. Coding runs retain instructions, context catalogs, installed skills, executable run metadata, process logs, and the final coding-agent response.</p>
<h2>Prompt-like authoring and replay</h2>
<p>There are two explicit prompt-like workflows. To teach reusable semantics, retain the natural-language brief at <code>agents/reviewer/source/agent-brief.md</code>, then run agent-level <code>code architect</code>, <code>code ontology</code>, <code>code circuit</code>, and <code>code review</code>. To analyze one source, create a task with its separate instruction and use <code>--author-missing</code> once; later <code>run</code> calls replay the generated programs without Codex.</p>
<pre><code>node nllAgent.mjs code circuit --agent reviewer
node nllAgent.mjs code review --agent reviewer

node nllAgent.mjs task create --agent reviewer \
  --source inputs/policy.txt \
  --instruction "Find contradictions and unsupported conclusions"

# Replace task-ID with the random identifier printed by task create.
node nllAgent.mjs analyze --agent reviewer --task task-ID \
  --author-missing --assurance all
node nllAgent.mjs run --agent reviewer --task task-ID --assurance all</code></pre>
<p>The first <code>analyze</code> authors missing IntentJS and LongTextJS through Codex and then executes them. The second command imports the retained <code>.mjs</code> programs directly. The complete evaluation automating both reusable-agent and per-task authoring is <code>node nllAgent.mjs evaluate --suite agentic-nl-e2e --invoke-agent</code>.</p>
<h2>Adaptive task-local authoring</h2>
<p>Use the distinct adaptive mode when the inherited agent may lack ontology meanings or a realistic circuit for a complex task. It audits and creates only task-owned semantic modules, executes deterministic acceptance, invokes a mandatory Codex review, and repeats within the explicit cycle bound.</p>
<pre><code>node nllAgent.mjs analyze \\
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
<pre><code>node nllAgent.mjs analyze --agent reviewer --task task-ID --profile legal-policy
node nllAgent.mjs run --agent-dir examples/validation-agent --task task-symbolic-validation
node nllAgent.mjs run --agent-dir examples/validation-agent --task task-symbolic-validation --format json
node nllAgent.mjs plan --agent reviewer --task task-ID --explain-plan
node nllAgent.mjs generate --agent reviewer --task task-ID --output PolicySpecificationPlan
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
<h2>Pack contract</h2><p>Each domain pack seals ontology modules, consistency or analysis circuits, a generation circuit, lexical and semantic intent signals, capability declarations, tier, knowledge level, and tests. Domain ontology modules reuse the core-language role constructors, preventing cross-pack role identity drift. Pack facts remain distinguishable from task claims through their source class.</p>
<p>Every concept and event frame is assigned explicitly in <code>tools/domain-module-allocations.mjs</code>. Generation fails on a missing or unknown module, missing or unknown symbol, or duplicate assignment; positional distribution is prohibited because module ownership is part of the pack-qualified identity. See <a href="specsLoader.html?spec=DS038-domain-pack-generation-and-module-ownership.md">DS038</a>.</p>
<pre class="mermaid">flowchart LR
  Descriptor[DomainPack] --> Ontologies[OntologyJS modules]
  Descriptor --> Circuits[CircuitJS modules]
  Descriptor --> Signals[Lexical and semantic signals]
  Descriptor --> Capabilities[Provided capabilities]
  Ontologies --> Constructors[Pack-qualified constructors]
  Constructors --> LongText[Task LongTextJS]
  Circuits --> Planner[Capability registry]</pre>
<h2>Profiles and local extension</h2><p>Profiles select a stable pack set or every compatible pack. Agent-local modules extend reusable knowledge; task-local modules override only task ownership. <code>ontology build</code> writes a task/agent-local facade with qualified exports and unqualified names only when collision-free.</p>
<h2>Validation</h2><p>Pack tests check sealed distinct ontologies, real execution through <code>SemanticStore</code>, deterministic intent signals, and canonical CNL round trips. Cross-pack ontology checks detect duplicate identities, subtype cycles, disjoint parents, and invalid inverse references.</p>`));

pages.set("testing-evaluation.html", shell("Testing and Evaluation", "Deterministic checks and isolated benchmarks", `
<p class="lead">Testing verifies existing code without a coding agent. Evaluation measures isolated end-to-end behavior and may include explicit Codex authoring.</p>
<h2>Test commands</h2>
<pre><code>node nllAgent.mjs test framework --level fast
node nllAgent.mjs test packs --level standard
node nllAgent.mjs test packs --pack chemistry-basic --level fast
node nllAgent.mjs test agent --agent-dir examples/validation-agent
node nllAgent.mjs test task --agent-dir examples/validation-agent --task task-symbolic-validation
node nllAgent.mjs test all --level exhaustive</code></pre>
<p>The framework suite covers logic, collections, ontology validation, transactional atomicity, indexed queries, constraint kernels, temporal closure, fixed points, automata, exploration, decision DAGs, rewriting, slicing, factor inference, planning, CNL, source anchors, and a temporary external agent/task CLI workflow. Pack and example tests execute real modules.</p>
<h2>Evaluation commands</h2>
<pre><code>node nllAgent.mjs evaluate --suite school-smoke
node nllAgent.mjs evaluate --suite school-smoke --invoke-agent
node nllAgent.mjs evaluate --suite agentic-nl-e2e --invoke-agent
node nllAgent.mjs evaluate --suite path/to/suite.mjs --invoke-agent --model MODEL</code></pre>
<p>The infrastructure-only school smoke run creates one isolated random-ID task per declared profile, completes deterministic execution and replay, compares the profile ablation, and writes aggregate anchor validity, replay equivalence, and elapsed-time metrics. It is not evidence that a reusable agent was learned from natural language. The <code>agentic-nl-e2e</code> suite retains a natural-language agent brief, runs real architect/ontology/circuit Codex phases, creates four tasks, runs real intent/longtext phases, checks expected findings or generation frames, and proves model-free replay.</p>
<p>The DS042 adaptive validation starts with a core-only agent and a cold-chain task that demonstrably lacks task intent, ontology, LongText, circuits, tests, runs, and results. The public <code>analyze --author-adaptive</code> command must generate the missing executable programs through Codex, pass concrete plus abstract and symbolic acceptance, complete mandatory review, and then replay through ordinary <code>run</code>. Its full retained evidence is reproduced in <a href="tutorial-adaptive-cold-chain.html">the adaptive tutorial</a>.</p>
<pre class="mermaid">sequenceDiagram
  participant Suite
  participant Agent as Isolated agent
  participant Codex
  participant Runtime
  Suite->>Agent: retain natural-language agent brief
  Agent->>Codex: architect, ontology and circuit contexts
  Codex-->>Agent: reusable executable programs and tests
  Suite->>Agent: create random-ID task and copy source
  Agent->>Codex: task intent and longtext contexts
  Codex-->>Agent: grounded task programs and tests
  Agent->>Runtime: deterministic execution and assurance
  Runtime-->>Suite: primary response.md plus technical findings, trace and metrics
  Suite->>Runtime: ordinary replay without Codex
  Suite->>Suite: Markdown and executable .mjs reports</pre>
<h2>Retained reports</h2><p>Evaluation reports distinguish completed and failed cases and keep failure stacks under <code>reports/failures/</code>. Authoring reports link each real subprocess to instructions, installed skills, context, stdout, stderr, final response and created/modified code. Gold expectations may be executable <code>.gold.mjs</code> modules. Precision, recall, F1, anchor validity, replay equivalence, runtime, generated frames and assurance artifacts remain tied to task IDs.</p>`));

pages.set("tutorial-agent-task.html", shell("Tutorial: Agent, Task, and Concrete Run", "Reproducible folder workflow", `
<p class="lead">This tutorial uses the committed validation agent so every command can be rerun without network access or a coding agent.</p>
<h2>1. Inspect resolved knowledge</h2>
<pre><code>node nllAgent.mjs agent check \\
  --agent-dir examples/validation-agent --profile minimal-core
node nllAgent.mjs profile resolve \\
  --agent-dir examples/validation-agent \\
  --task task-symbolic-validation</code></pre>
<p>The resolver loads <code>core-language</code>, <code>logic-basic</code>, <code>reasoning-errors</code>, plus the validation agent's facility ontology and circuit.</p>
<h2>2. Ingest and verify sources</h2>
<pre><code>node nllAgent.mjs source ingest \\
  --agent-dir examples/validation-agent --task task-symbolic-validation
node nllAgent.mjs source verify-anchors \\
  --agent-dir examples/validation-agent --task task-symbolic-validation</code></pre>
<p>The recorded run registered one source with SHA-256 digest <code>4dae9611…c3354</code>. Both LongTextJS spans returned <code>SOURCE_SPAN_VALID</code>.</p>
<h2>3. Plan and run</h2>
<pre><code>node nllAgent.mjs plan \\
  --agent-dir examples/validation-agent --task task-symbolic-validation --explain
node nllAgent.mjs run \\
  --agent-dir examples/validation-agent --task task-symbolic-validation</code></pre>
<p>The concrete facility circuit returned <code>ORDER_OK</code> with status <code>SATISFIED</code> and two exact source-span identities. Broad fallback circuits whose required task terms were absent returned <code>NOT_APPLICABLE</code>; no blocking diagnostic was produced.</p>
<h2>4. Inspect results</h2>
<pre><code># The run command already prints results/response.md by default.
node nllAgent.mjs run \\
  --agent-dir examples/validation-agent --task task-symbolic-validation
node nllAgent.mjs catalog response \\
  --agent-dir examples/validation-agent --task task-symbolic-validation
node nllAgent.mjs trace explain \\
  --trace examples/validation-agent/tasks/task-symbolic-validation/results/trace.bin
node nllAgent.mjs cnl parse \\
  --file examples/validation-agent/tasks/task-symbolic-validation/results/findings.cnl</code></pre>
<p><code>response.md</code> is the human answer. For technical inspection, <code>artifacts.md</code> links canonical frames, executable findings, response-circuit trace and assurance. The single-frame parser intentionally accepts one canonical frame at a time.</p>`));

pages.set("tutorial-symbolic.html", shell("Tutorial: Abstract and Symbolic Validation", "Auxiliary circuit interpretations", `
<p class="lead">Concrete execution is mandatory. Abstract and symbolic methods add assurance where a circuit explicitly declares support.</p>
<h2>Abstract preflight</h2>
<pre><code>node nllAgent.mjs circuit abstract \\
  --agent-dir examples/validation-agent \\
  --task task-symbolic-validation \\
  --circuit example.facility-order</code></pre>
<p>The recorded abstract worklist converged in six steps with no precision-loss entries. Each query and decision node conservatively retained <code>SATISFIED</code>, <code>VIOLATED</code>, <code>UNKNOWN</code>, and <code>CONFLICT</code>.</p>
<h2>Symbolic row coverage</h2>
<pre><code>node nllAgent.mjs circuit symbolic \\
  --agent-dir examples/validation-agent \\
  --task task-symbolic-validation \\
  --circuit example.facility-order</code></pre>
<p>The symbolic explorer returned four path-complete cases and pruned three infeasible partial assignments. The three declared facets—<code>isTrue</code>, <code>isFalse</code>, and <code>isUnknown</code>—are mutually exclusive, but not exhaustive in four-valued logic. The fourth path has no matching row and exposes the omitted <code>CONFLICT</code> case as <code>alarm-before-opening.no-row</code>.</p>
<pre class="mermaid">stateDiagram-v2
  [*] --> RelationValue
  RelationValue --> Satisfied: TRUE
  RelationValue --> Violated: FALSE
  RelationValue --> Unknown: UNKNOWN
  RelationValue --> MissingRow: CONFLICT not declared
  Satisfied --> [*]
  Violated --> [*]
  Unknown --> [*]
  MissingRow --> [*]</pre>
<h2>Automatic assurance</h2><p>The committed IntentJS requests both methods and the circuit declares them. Therefore an ordinary <code>run</code> writes two entries to <code>results/assurance.md</code> and the executable <code>assurance.mjs</code> artifact. Passing <code>--assurance all</code> can explicitly request every method supported by selected circuits.</p>`));

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
const skillLinks = skillIds.map((id) => `<li><a href="skill-${id}.html"><code>${id}</code></a></li>`).join("");
pages.set("skills.html", shell("Skill Catalog", "Executable coding workflows", `
<p class="lead">The repository contains ten project-owned nllAgent authoring skills. Each skill has a dedicated HTML chapter, executable workflow and official DS contract. Environment-managed skills are not copied, published or required by this project.</p>
<ul class="catalog-list">${skillLinks}</ul>
<h2>Resolution model</h2><pre class="mermaid">flowchart LR
  Requested[Requested phase skill] --> Loader[Skill loader]
  Loader --> Dependencies[Transitive workflow dependencies]
  Dependencies --> Installed[Run-local skill folders]
  Installed --> Catalogs[Declared context catalogs]
  Catalogs --> CodingAgent[Coding agent reads and edits canonical files]</pre>
<p>The adjacent <code>workflow.mjs</code> is machine-resolvable and the <code>SKILL.md</code> is agent-facing. Context is generated from live SDK descriptors and resolved ontologies, semantic circuits and response circuits. Skills do not search hidden folders and do not copy the framework theory into task artifacts.</p>`));

for (const skillId of skillIds) {
  const skillRoot = resolve(root, "nll-skills", skillId); const workflow = (await import(`${pathToFileURL(resolve(skillRoot, "workflow.mjs")).href}?docs=${Date.now()}`)).default;
  const markdown = await readFile(resolve(skillRoot, "SKILL.md"), "utf8"); const purpose = markdown.match(/## Purpose and invocation\n\n([^\n]+)/)?.[1] ?? "See the local skill contract.";
  const dependencies = workflow.dependencies.length ? workflow.dependencies.map(code).join(" → ") : "none";
  const tools = workflow.tools.map((entry) => `<li>${code(entry.command)}</li>`).join(""); const roots = workflow.editRoots.map((entry) => `<li>${code(entry.value)}</li>`).join("");
  const phases = workflow.phases.map((phase, index) => `P${index + 1}[${phase}]`).join(" --> ");
  pages.set(`skill-${skillId}.html`, shell(`${skillId} Skill`, "Coding workflow contract", `
<p class="lead">${escapeHtml(purpose)}</p>
<h2>Executable workflow</h2><p>The workflow references ${workflow.designSpecifications.map(code).join(", ")}. Dependency order: ${dependencies}. Its declared phases are ${workflow.phases.map(code).join(", ")}.</p>
<pre class="mermaid">flowchart LR
  ${phases}
  Context[Resolved SDK, ontology, semantic circuit, response circuit, profile, source catalogs] --> P1</pre>
<h2>Required tools</h2><ul>${tools}</ul>
<h2>Canonical edit roots</h2><ul>${roots}</ul>
<h2>Context and completion</h2><p>The loader installs this folder and every dependency under the coding run, then writes only the catalogs needed to understand the active SDK, knowledge, source, and plan. The coding agent edits canonical agent, task, or framework files directly, adds focused tests, and runs the commands named by the skill. Natural-language completion is not acceptance; imports, semantic checks, and tests decide completion.</p>
<p>The authoritative skill contract is <a href="specsLoader.html?spec=DS${String(22 + skillIds.indexOf(skillId)).padStart(3, "0")}-${skillId}.md">its DS entry</a>, synchronized with <code>nll-skills/${skillId}/SKILL.md</code> and <code>workflow.mjs</code>.</p>`));
}

pages.set("documentation-ownership.html", shell("Documentation ownership", "Project and environment boundary", `
<p class="lead">All published documentation, templates, assets, generators, and verifiers are project-owned. Environment-managed agent skills may guide maintenance but are not product source or runtime capabilities.</p>
<h2>Self-contained generation</h2><p>The generators read <code>design-specifications/</code>, <code>nll-skills/</code>, project code, retained evaluations, and project-owned files under <code>tools/</code>. They do not read environment-managed skill directories, home folders, a CDN, or a fixed deployment path.</p>
<pre class="mermaid">flowchart LR
  Project[Project-owned sources] --> Specs[DS000 through DS044]
  Project --> HTML[Detailed HTML pages]
  Evaluations[Accepted evaluations] --> Tutorials[Real tutorials]
  Specs --> Verify[Project-owned verification]
  HTML --> Verify
  Tutorials --> Verify</pre>
<p>See <a href="specsLoader.html?spec=DS032-documentation-and-specification-ownership.md">DS032</a>.</p>`));

pages.set("specification-review.html", shell("Specification review", "Project-owned contract synchronization", `
<p class="lead">A review identifies affected DS files, code, tests, CLI behavior, HTML pages, tutorials, and unresolved decisions before editing.</p>
<h2>Review sequence</h2><pre class="mermaid">flowchart LR
  Context[New requirement or failure] --> Compare[Compare DS and implementation]
  Compare --> Contract[Update Core Content]
  Contract --> Rationale[Number decisions]
  Rationale --> Companions[Synchronize code tests docs]
  Companions --> Evidence[Run fidelity and behavior checks]</pre>
<p>Initial specifications remain byte-for-byte preserved. Additive contracts are regenerated from project-owned sources and verified in numeric order. See <a href="specsLoader.html?spec=DS033-specification-review-contract.md">DS033</a>.</p>`));

pages.set("documentation-generation.html", shell("Documentation generation", "Detailed, portable, evidence-backed HTML", `
<p class="lead">The HTML set is rebuilt from implementation and retained accepted evaluations. Tutorials fail closed rather than inventing a source, semantic module, agent run, or result.</p>
<h2>Portability</h2><p>Every link, asset import, specification query, and partial fetch is document-relative. The generated site is verified under a non-root path, including the matrix query and project-owned diagram renderer.</p>
<h2>Evidence hierarchy</h2><p>Tutorials show <code>response.md</code> first. Exact input, generated semantic code, Codex runs, tests, replay, and technical assurance remain available in dedicated sections without presenting raw projections as the answer.</p>
<p>See <a href="specsLoader.html?spec=DS040-html-documentation-generation-and-portability.md">DS040</a>.</p>`));

for (const page of await buildAgenticDocumentationPages({ root, escapeHtml })) {
  pages.set(page.name, shell(page.title, page.kicker, page.content));
}

await writeFile(resolve(docs, "styles.css"), documentationStyles);
await writeFile(resolve(docs, "partials", "header.html"), documentationHeader());
await writeFile(resolve(docs, "partials", "footer.html"), `<footer class="site-footer">nllAgent technical documentation. The DS set is authoritative; generated catalogs report the current executable implementation.</footer>`);
await writeFile(resolve(docs, "partials-loader.js"), `document.addEventListener("DOMContentLoaded", async () => { for (const node of document.querySelectorAll("[data-include]")) { const response = await fetch(node.dataset.include); if (!response.ok) { node.textContent = \`Unable to load \${node.dataset.include}\`; continue; } node.innerHTML = await response.text(); } });\n`);
await writeFile(
  resolve(docs, "assets", "diagram-renderer.mjs"),
  await readFile(resolve(root, "tools", "docs-assets", "diagram-renderer.mjs"), "utf8")
);
await writeFile(
  resolve(docs, "specsLoader.html"),
  await readFile(resolve(root, "tools", "docs-assets", "specsLoader.html"), "utf8")
);
for (const [name, html] of pages) await writeFile(resolve(docs, name), html);
console.log(`Generated ${pages.size} detailed HTML documentation pages.`);
