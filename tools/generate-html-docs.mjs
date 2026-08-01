#!/usr/bin/env node
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const root = resolve(import.meta.dirname, ".."); const docs = resolve(root, "docs");
await mkdir(resolve(docs, "partials"), { recursive: true }); await mkdir(resolve(docs, "assets"), { recursive: true });

const mermaid = `<script type="module">
    import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs';
    mermaid.initialize({ startOnLoad: true, theme: 'neutral' });
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
  ${mermaid}
</head>
<body>
  <div data-include="partials/header.html"></div>
  <main class="page">
    <article class="page__panel content">
      <nav class="breadcrumb" aria-label="Breadcrumb"><a href="index.html">nllAgent Documentation</a><span>/</span>${escapeHtml(title)}</nav>
      <p class="kicker">${escapeHtml(kicker)}</p>
      <h1>${escapeHtml(title)}</h1>
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
  Runner --> Results[Findings, CNL, trace, assurance]
  Skills[Coding skills] --> Context[Run-local context]
  Context --> Codex[Explicit coding-agent adapter]
  Codex --> Intent
  Codex --> LongText</pre>
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
<p class="lead">Source ingestion turns retained files into deterministic decoded text before LongTextJS can claim exact evidence. It supports UTF-8 formats, ordinary PDF text streams, and task-owned decoder modules without introducing semantic JSON.</p>
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
<p>See <a href="specsLoader.html?spec=DS037-source-extraction-and-stable-offsets.md">DS037</a> for the normative extraction and decoded-offset contract.</p>`));

pages.set("semantic-dsls.html", shell("Semantic DSLs and SDK", "Executable .mjs contracts", `
<p class="lead">The DSLs share stable semantic identities while preserving separate responsibilities. The root SDK offers namespace exports for cases where two DSLs intentionally use the same fluent name.</p>
<h2>OntologyJS</h2><p>Ontology builders declare pack-qualified concepts, roles, relations, lexicalizations, facts, laws, capabilities, and cardinalities. Sealed modules expose generated constructors through <code>constructorFor()</code> and diagnostic construction through <code>tryConstruct()</code>. Ground terms enforce declared role cardinality and direct range constraints; pattern terms may omit roles for partial queries.</p>
<h2>Live public API inventory</h2><p><code>framework/sdk/public-api.mjs</code> inventories nine narrow surfaces from their imported namespaces. Run <code>node nllAgent.mjs sdk check</code> to validate the live export sets and <code>node nllAgent.mjs sdk usage --surface longtext</code> for canonical paths, exports, and composition examples. Repeated fluent names are reported and resolved through narrow imports or root namespaces. See <a href="specsLoader.html?spec=DS039-sdk-public-surfaces-and-tooling.md">DS039</a>.</p>
<h2>LongTextJS</h2><p>LongTextJS separates terms from claims, anchors claims to exact <code>SourceSpan</code> values, represents context and alternatives, and commits coverage witnesses explicitly. Source verification checks source identity, digest, unit identity, bounds, and text hashes before an anchor is considered valid.</p>
<h2>IntentJS and profiles</h2><p>Intent modules express modes, domains, concerns, evidence policy, assurance, outputs, exclusions, scope, resources, and fallback. Profiles are executable modules that choose packs and selection policy. CLI domains, exclusions, checks, and text signals can refine runtime resolution without replacing the canonical task module.</p>
<h2>CircuitJS and CNL</h2><p>Circuits declare requirements and provisions, then compose queries, decision tables, procedural stages, emissions, and assurance requests. The scheduler infers stage dependencies from semantic references. CNL frames retain typed slots and provenance, render to a canonical textual form, and parse back for semantic comparison.</p>
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
node nllAgent.mjs task create --agent reviewer --source notes.md --title "Policy review"
node nllAgent.mjs code intent --agent reviewer --task task-ID
node nllAgent.mjs code longtext --agent reviewer --task task-ID --model MODEL
node nllAgent.mjs code review --agent reviewer --task task-ID --diagnostics failures.md
node nllAgent.mjs code circuit --agent-dir path/to/agent --task-dir path/to/task --prepare-only</code></pre>
<p><code>--prepare-only</code> builds the exact context and skill dependency chain without invoking Codex. Coding runs retain instructions, context catalogs, installed skills, executable run metadata, process logs, and the final coding-agent response.</p>
<h2>Execution and selection</h2>
<pre><code>node nllAgent.mjs analyze --agent reviewer --task task-ID --profile legal-policy
node nllAgent.mjs run --agent-dir examples/validation-agent --task task-symbolic-validation
node nllAgent.mjs plan --agent reviewer --task task-ID --explain-plan
node nllAgent.mjs generate --agent reviewer --task task-ID --output PolicySpecificationPlan
node nllAgent.mjs query --agent reviewer --task task-ID --expression queries/open-events.mjs</code></pre>
<p>Selection controls include repeatable <code>--domain</code> and <code>--check</code>, <code>--exclude-domain</code>, <code>--exclude-check</code>, <code>--only</code>, <code>--all-compatible</code>, <code>--profile</code>, <code>--intent</code>, and <code>--assurance abstract|symbolic|all</code>.</p>
<h2>Inspection tools</h2>
<p>The CLI implements <code>context</code>, <code>files</code>, <code>catalog</code>, <code>sdk</code>, <code>profile</code>, <code>source</code>, <code>ontology</code>, <code>longtext</code>, <code>intent</code>, <code>circuit</code>, <code>trace</code>, <code>cnl</code>, and <code>review</code> families. Each reads the same resolved modules used by execution. <code>sdk check</code>, <code>sdk usage --surface &lt;id&gt;</code>, and <code>plan show</code> are the agent-facing discovery commands declared by the installed skill workflows.</p>
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
node nllAgent.mjs evaluate --suite path/to/suite.mjs --invoke-agent --model MODEL</code></pre>
<p>The infrastructure-only school smoke run creates one isolated random-ID task per declared profile, completes deterministic execution and replay, compares the profile ablation, and writes aggregate anchor validity, replay equivalence, and elapsed-time metrics. With <code>--invoke-agent</code>, the runner uses the suite modes to start intent, longtext, or circuit authoring phases before replay.</p>
<pre class="mermaid">sequenceDiagram
  participant Suite
  participant Agent as Isolated agent
  participant Codex
  participant Runtime
  Suite->>Agent: create random-ID task and copy source
  opt --invoke-agent
    Agent->>Codex: intent/longtext/circuit contexts
    Codex-->>Agent: executable semantic modules and tests
  end
  Agent->>Runtime: deterministic execution and assurance
  Runtime-->>Suite: findings, CNL, trace, metrics
  Suite->>Suite: Markdown and executable .mjs reports</pre>
<h2>Retained reports</h2><p>Evaluation reports distinguish completed and failed cases and keep failure stacks under <code>reports/failures/</code>. Gold expectations may be executable <code>.gold.mjs</code> modules. Precision, recall, F1, anchor validity, runtime, and assurance artifacts remain tied to task IDs.</p>`));

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
<pre><code>node nllAgent.mjs trace explain \\
  --trace examples/validation-agent/tasks/task-symbolic-validation/results/trace.bin
node nllAgent.mjs cnl parse \\
  --file examples/validation-agent/tasks/task-symbolic-validation/results/findings.cnl</code></pre>
<p>For multiple CNL frames, inspect <code>observations.cnl</code> or import <code>findings.mjs</code>; the single-frame parser intentionally accepts one canonical frame at a time.</p>`));

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
<tr><td><code>execution-plan.md</code></td><td>profile, loaded packs, selected/rejected circuits, and blocked capabilities</td></tr>
<tr><td><code>findings.mjs</code></td><td>executable finding structures reconstructed through the SDK</td></tr>
<tr><td><code>findings.cnl</code></td><td>canonical evidence-bearing finding frames</td></tr>
<tr><td><code>observations.cnl</code></td><td>findings and generated CNL frames</td></tr>
<tr><td><code>generation-plan.cnl</code></td><td>semantic plan frames usable by a later expansion circuit or coding agent</td></tr>
<tr><td><code>coverage.md</code></td><td>coverage witnesses and executed pack summary</td></tr>
<tr><td><code>diagnostics.md</code></td><td>typed planning and execution failures</td></tr>
<tr><td><code>trace.bin</code></td><td>Node V8 binary serialization of semantic trace projections</td></tr>
<tr><td><code>assurance.mjs</code></td><td>executable abstract/symbolic auxiliary results</td></tr>
<tr><td><code>report.md</code></td><td>task-level outcome index</td></tr>
</tbody></table>
<h2>Coding-run context</h2><p>A run directory contains <code>INSTRUCTIONS.md</code>, executable <code>run.mjs</code>, installed skill folders, context catalogs, checks, scratch space, and process logs. Exact design-specification paths and the project CLI invocation are resolved for the selected working directory.</p>
<h2>Source artifacts</h2><p><code>source/source-map.mjs</code> registers decoded text, extractor metadata, and stable units. Its generated import path points to the selected project's SDK even for an explicit agent directory. UTF-8 formats and ordinary unencrypted PDF text streams have built-in extraction. A task can add or override a decoder with <code>source/extractors/&lt;extension&gt;.extractor.mjs</code>; unsupported filters, scans, encryption, or formats retain typed diagnostics rather than fabricated text. DS037 defines decoded-offset provenance.</p>
<h2>No semantic JSON</h2><p>Findings, gold expectations, source maps, run declarations, suite declarations, and catalogs use executable modules or human-readable Markdown/CNL. The repository retains existing JSON only where Codex/plugin integration requires a manifest; those files do not encode semantic programs.</p>`));

const skillIds = ["nll-architect", "nll-orchestrator", "nll-sdk", "nll-runtime", "nll-intent", "nll-ontology", "nll-longtext", "nll-circuit", "nll-test", "nll-evaluate"];
const skillLinks = [...skillIds, "article-build", "gamp-specs", "review-specs"].map((id) => `<li><a href="skill-${id}.html"><code>${id}</code></a></li>`).join("");
pages.set("skills.html", shell("Skill Catalog", "Executable coding workflows", `
<p class="lead">The repository contains ten nllAgent authoring skills, the self-contained article-build skill, and two documentation/specification maintenance skills. Each locally owned skill has a dedicated HTML chapter and official DS contract.</p>
<ul class="catalog-list">${skillLinks}</ul>
<h2>Resolution model</h2><pre class="mermaid">flowchart LR
  Requested[Requested phase skill] --> Loader[Skill loader]
  Loader --> Dependencies[Transitive workflow dependencies]
  Dependencies --> Installed[Run-local skill folders]
  Installed --> Catalogs[Declared context catalogs]
  Catalogs --> CodingAgent[Coding agent reads and edits canonical files]</pre>
<p>The adjacent <code>workflow.mjs</code> is machine-resolvable and the <code>SKILL.md</code> is agent-facing. Context is generated from live SDK descriptors and resolved ontologies/circuits. Skills do not search hidden folders and do not copy the framework theory into task artifacts.</p>`));

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
  Context[Resolved SDK, ontology, circuit, profile, source catalogs] --> P1</pre>
<h2>Required tools</h2><ul>${tools}</ul>
<h2>Canonical edit roots</h2><ul>${roots}</ul>
<h2>Context and completion</h2><p>The loader installs this folder and every dependency under the coding run, then writes only the catalogs needed to understand the active SDK, knowledge, source, and plan. The coding agent edits canonical agent, task, or framework files directly, adds focused tests, and runs the commands named by the skill. Natural-language completion is not acceptance; imports, semantic checks, and tests decide completion.</p>
<p>The authoritative skill contract is <a href="specsLoader.html?spec=DS${String(22 + skillIds.indexOf(skillId)).padStart(3, "0")}-${skillId}.md">its DS entry</a>, synchronized with <code>nll-skills/${skillId}/SKILL.md</code> and <code>workflow.mjs</code>.</p>`));
}

pages.set("skill-gamp-specs.html", shell("gamp-specs Skill", "Documentation structure authority", `
<p class="lead">This repository-local skill governs the AGENTS, HTML, specification, matrix, loader, and verification layout.</p>
<h2>Owned artifacts</h2><p>It requires <code>AGENTS.md</code>, a single primary HTML navigation model, Mermaid support on every page, <code>docs/specsLoader.html</code>, contiguous DS numbering, generated <code>matrix.md</code>, coding-style authority in DS001, one page and DS per current local skill, and post-generation link/static checks.</p>
<h2>Preservation and synchronization</h2><p>Existing guidance is ingested before normalization. Contract changes update implementation, affected DS files, HTML pages, AGENTS guidance, and the skill catalog together. The original nllAgent design specifications are therefore embedded intact in the official sequence instead of being replaced by shorter prose.</p>
<pre class="mermaid">flowchart TD
  Sources[Code, README, original DS, skills] --> Official[Official DS set]
  Official --> Matrix[Generated matrix]
  Sources --> HTML[Technical HTML]
  Official --> HTML
  Matrix --> Verify[Link and static verification]
  HTML --> Verify
  Agents[AGENTS.md] --> Verify</pre>
<p>See <a href="specsLoader.html?spec=DS032-gamp-specs.md">DS032</a> for the complete preserved skill instructions.</p>`));

pages.set("skill-article-build.html", shell("article-build Skill", "Self-contained research-article regeneration", `
<p class="lead">This repository-local skill incrementally rebuilds a research article from article-owned plans, chapters, bibliography evidence, and SVG assets. It is cataloged here because the repository owns it, while remaining independent of nllAgent semantic execution.</p>
<h2>Article-owned pipeline</h2>
<pre class="mermaid">flowchart TD
  Plan[plan.md and plan_chN.md] --> Chapters[Generated chapter Markdown]
  Bibliography[bibliography source and evidence cache] --> Validate[Citation support validation]
  Assets[assets declaration and source SVG] --> SVG[Copy and geometry validation]
  Chapters --> HTML[index.html]
  Validate --> HTML
  SVG --> HTML
  HTML --> Review[Agent structural and visual review]
  Review -->|substantive gap| Plan
  Review --> Manifest[Incremental build manifest]</pre>
<h2>Ownership boundary</h2><p>The skill reads an explicit article root and only its own self-contained modules. It does not import the nllAgent runtime or install itself into nllAgent task coding runs. Chapter Markdown and final HTML are generated from article plans; bibliography checks retain supporting snippets and spans; figures remain separate SVG assets; a second unchanged build verifies incremental stability.</p>
<h2>Manifest distinction</h2><p>Article asset and build manifests describe document-build mechanics. They are not semantic nllAgent artifacts and do not weaken the prohibition on JSON OntologyJS, LongTextJS, IntentJS, CircuitJS, task, profile, evaluation, or test-oracle representations.</p>
<p>See <a href="specsLoader.html?spec=DS040-article-build.md">DS040</a> for the complete preserved local skill contract.</p>`));

pages.set("skill-review-specs.html", shell("review-specs Skill", "Contract-focused specification review", `
<p class="lead">This skill reviews each affected DS against implementation, user instructions, repository guidance, and observed failures.</p>
<h2>Review boundary</h2><p><code>Core Content</code> remains the contract backbone. Detailed rationale, trade-offs, and unresolved choices belong in consecutively numbered <code>Decisions &amp; Questions</code> subchapters. An unresolved multiple-option question is not implemented until one option is selected.</p>
<h2>Companion synchronization</h2><p>When a review changes interfaces, behavior, architecture, constraints, or workflows, the review also updates tests, HTML pages, AGENTS guidance, README content, and local skill summaries that expose the same contract.</p>
<pre class="mermaid">flowchart LR
  Context[New context or failure] --> Compare[Compare affected DS and code]
  Compare --> Core[Update Core Content]
  Core --> Decisions[Record numbered rationale]
  Decisions --> Companions[Synchronize code, tests, HTML, guidance]
  Companions --> Reread[Sequential reread and verification]</pre>
<p>See <a href="specsLoader.html?spec=DS033-review-specs.md">DS033</a> for the complete skill contract.</p>`));

await writeFile(resolve(docs, "styles.css"), `:root { color-scheme: light; --ink:#17212b; --muted:#566371; --line:#d8dee5; --paper:#fff; --wash:#f4f7f9; --accent:#075985; --accent2:#0f766e; }
* { box-sizing:border-box; } body { margin:0; color:var(--ink); background:var(--wash); font:16px/1.65 system-ui,-apple-system,Segoe UI,sans-serif; }
a { color:var(--accent); text-decoration-thickness:.08em; text-underline-offset:.15em; } code { font: .9em ui-monospace,SFMono-Regular,Consolas,monospace; background:#eef3f6; padding:.08rem .28rem; border-radius:.2rem; }
.site-header { background:#102a3a; color:white; border-bottom:4px solid #14b8a6; } .site-header__inner { max-width:1240px; margin:auto; padding:1rem 1.5rem; display:flex; align-items:center; gap:2rem; }
.brand { color:white; text-decoration:none; font-weight:760; letter-spacing:.01em; white-space:nowrap; } .primary-nav { display:flex; flex-wrap:wrap; gap:.35rem 1rem; } .primary-nav a { color:#dceef6; }
.page { max-width:1120px; margin:2rem auto; padding:0 1.25rem; } .page__panel { background:var(--paper); padding:clamp(1.5rem,4vw,3.5rem); border:1px solid var(--line); box-shadow:0 12px 35px #17304212; }
.content { max-width:100%; } .content > p,.content > ul,.content > ol { max-width:78ch; } h1 { font-size:clamp(2rem,5vw,3.3rem); line-height:1.1; margin:.25rem 0 1.5rem; } h2 { margin-top:2.5rem; line-height:1.25; } h3 { margin-top:1.75rem; }
.lead { font-size:1.18rem; color:#334554; } .kicker { color:var(--accent2); text-transform:uppercase; letter-spacing:.11em; font-size:.76rem; font-weight:800; } .breadcrumb { display:flex; gap:.55rem; color:var(--muted); font-size:.88rem; }
.callout { max-width:82ch; border-left:4px solid #14b8a6; background:#ecfdf9; padding:1rem 1.2rem; margin:1.5rem 0; } pre:not(.mermaid) { overflow:auto; background:#102a3a; color:#e8f3f7; padding:1rem 1.2rem; border-radius:.35rem; } pre code { background:transparent; padding:0; color:inherit; }
.mermaid { margin:2rem 0; overflow:auto; } table { border-collapse:collapse; width:100%; margin:1rem 0 2rem; font-size:.94rem; } th,td { border:1px solid var(--line); padding:.65rem .75rem; text-align:left; vertical-align:top; } th { background:#edf4f7; }
.tree { border-left:2px solid #8fb3c4; margin:1.5rem 0; } .tree div { display:grid; grid-template-columns:minmax(13rem,1fr) 2fr; gap:1rem; border-bottom:1px solid var(--line); padding:.7rem 1rem; } .tree span { color:var(--muted); }
.catalog-list { columns:2; max-width:55rem; } .site-footer { max-width:1120px; margin:0 auto; padding:1rem 1.25rem 3rem; color:var(--muted); font-size:.88rem; }
.loader-frame { min-height:60vh; } .loader-heading { display:flex; justify-content:space-between; gap:1rem; align-items:start; } .loading { color:var(--muted); }
@media (max-width:760px) { .site-header__inner { align-items:flex-start; flex-direction:column; gap:.6rem; } .page { margin:1rem auto; padding:0 .6rem; } .page__panel { padding:1.25rem; } .tree div { grid-template-columns:1fr; gap:.1rem; } .catalog-list { columns:1; } .loader-heading { flex-direction:column; } }
`);
await writeFile(resolve(docs, "partials", "header.html"), `<header class="site-header"><div class="site-header__inner"><a class="brand" href="index.html">nllAgent Documentation</a><nav class="primary-nav" aria-label="Primary"><a href="architecture.html">Architecture</a><a href="source-ingestion.html">Sources</a><a href="semantic-dsls.html">SDK &amp; DSLs</a><a href="runtime.html">Runtime</a><a href="cli-reference.html">CLI</a><a href="packs.html">Packs</a><a href="testing-evaluation.html">Tests</a><a href="tutorial-agent-task.html">Tutorials</a><a href="skills.html">Skills</a><a href="specsLoader.html?spec=matrix.md">Specifications</a></nav></div></header>`);
await writeFile(resolve(docs, "partials", "footer.html"), `<footer class="site-footer">nllAgent technical documentation. The DS set is authoritative; generated catalogs report the current executable implementation.</footer>`);
await writeFile(resolve(docs, "partials-loader.js"), `document.addEventListener("DOMContentLoaded", async () => { for (const node of document.querySelectorAll("[data-include]")) { const response = await fetch(node.dataset.include); if (!response.ok) { node.textContent = \`Unable to load \${node.dataset.include}\`; continue; } node.innerHTML = await response.text(); } });\n`);
for (const [name, html] of pages) await writeFile(resolve(docs, name), html);
console.log(`Generated ${pages.size} detailed HTML documentation pages.`);
