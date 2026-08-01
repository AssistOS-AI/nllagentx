#!/usr/bin/env node
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const specificationsRoot = resolve(root, "docs", "specs");
await mkdir(specificationsRoot, { recursive: true });
await mkdir(resolve(root, "docs", "assets"), { recursive: true });

function frontmatter({ id, title, status = "implemented", owner = "nllAgent maintainers", summary }) {
  return `---\nid: ${id}\ntitle: ${title}\nstatus: ${status}\nowner: ${owner}\nsummary: ${summary}\n---\n`;
}

async function writeSpecification(number, slug, metadata, body) {
  const id = `DS${String(number).padStart(3, "0")}`;
  const path = resolve(specificationsRoot, `${id}-${slug}.md`);
  await writeFile(path, `${frontmatter({ id, ...metadata })}\n# ${id} — ${metadata.title}\n\n${body.trim()}\n`);
  return path;
}

await writeSpecification(0, "vision", {
  title: "nllAgent Vision and System Boundary",
  summary: "Defines nllAgent as an executable semantic-program workbench and fixes its architectural boundaries."
}, `## Introduction

nllAgent turns natural-language source material into executable semantic programs and applies reusable semantic circuits to those programs. The repository is a production-oriented experimental system: its semantic artifacts are ordinary JavaScript modules, while their semantic effects are constrained by the OntologyJS, LongTextJS, IntentJS, CircuitJS, CNL, agent, and evaluation SDK contracts.

## Core Content

The system must preserve source provenance, explicit uncertainty, alternative interpretations, modality, polarity, scope, and coverage. It must distinguish a claim made by a source from a fact asserted by an ontology pack. Semantic artifacts must remain executable \`.mjs\` modules; JSON and TypeScript must not be used as substitute semantic languages. Integration manifests that configure external tooling are outside that prohibition.

Execution must build one logical \`SemanticStore\`, resolve default, profile, agent-local, and task-local knowledge in a documented precedence order, plan circuits by declared requirements and provisions, execute compatible circuits deterministically, and retain findings, CNL frames, plans, traces, diagnostics, and auxiliary assurance results. Coding-agent invocation is an explicit authoring or review operation; ordinary semantic execution must not invoke a coding agent.

The project must remain dependency-free at runtime and must expose its operations through the \`nllAgent.mjs\` CLI. Agents and tasks are directory-owned units. An agent directory owns reusable semantic extensions; a task directory owns sources, IntentJS, LongTextJS, local extensions, tests, coding runs, and results. Both name-based and explicit-folder resolution are required.

The original \`design-specifications/DS-000\` through \`DS-019\` remain preserved source contracts. Their official copies are embedded verbatim in DS002 through DS021. DS022 onward defines the executable skill catalog and orthogonal implementation contracts discovered during construction.

## Decisions & Questions

### Question #1: Why are executable JavaScript DSLs the semantic source of truth?

Response: Full JavaScript provides composition, abstraction, and direct SDK use without introducing a second serialization language. Stable semantic identities, sealed builders, transactions, and validation preserve the required discipline at the semantic boundary.

### Question #2: What is the boundary between deterministic runtime work and coding-agent work?

Response: Runtime commands import and execute existing artifacts. Only explicit \`code ...\` commands and evaluation runs requested with \`--invoke-agent\` may start Codex through the adapter interface.

### Question #3: Where are uncertain implementation decisions recorded?

Response: Normative rationale resides in the affected DS file. The user-requested \`observations.md\` is a review index that links uncertainties and follow-up topics back to those authoritative entries.

## Conclusion

nllAgent is complete only when semantic modules, planning, execution, tests, evaluation, documentation, and retained evidence operate as one reproducible system without replacing semantic code with inert data.`);

await writeSpecification(1, "coding-style", {
  title: "Coding Style, Module Structure, and Test Organization",
  summary: "Establishes the coding-style authority for dependency-free production modules, generated artifacts, and deterministic tests."
}, `## Introduction

This specification is the coding-style authority for the repository. Future agents must read it before changing source layout, module APIs, generators, tests, documentation, or command behavior.

## Core Content

All runtime, SDK, semantic, tool, test, and generated code must use ECMAScript modules with the \`.mjs\` suffix and Node.js built-ins only. Public DSL APIs should use small immutable value objects and fluent builders that seal into stable semantic models. Modules must have one coherent responsibility, depend on narrower layers, and expose extension points through registries, adapters, builders, or explicit interfaces. Domain-specific behavior belongs in packs or agent-local modules rather than conditional code in the CLI.

Semantic identities must be deterministic. Collections that have set semantics must canonicalize order; sequences must preserve order; bags must preserve multiplicity. Public handles and sealed models must be immutable. Transactions must validate before commit and must never partially mutate the \`SemanticStore\` after failure. Typed diagnostic codes are stable interfaces; prose messages may evolve.

The source layout is authoritative: \`framework/sdk\` owns constructors and semantic values, \`framework/runtime\` owns execution and analysis algorithms, \`framework/packs\` owns default knowledge, \`framework/tools\` owns workspace adapters, \`framework/cli\` owns routing, \`nll-skills\` owns coding-agent workflows, \`profiles\` owns executable load policy, \`examples\` owns runnable examples, and \`test-support\` or \`framework/test-support\` owns reusable deterministic test utilities. Agent-specific code must remain under its agent folder; source-specific code must remain under its task folder.

Tests must use \`node:test\` and \`node:assert/strict\`. Test files end in \`.test.mjs\`. Unit tests cover public constructor boundaries and algorithms; pack tests cover ontology, circuit, intent, and CNL behavior; integration tests execute semantic modules through the real store and runner; evaluation suites remain separate from tests because they may invoke Codex. Fixtures and expected semantic structures must remain executable modules or text/CNL, never JSON snapshots.

Files should remain cohesive. The repository uses \`fileSizesCheck.sh\` to expose files above 500 lines as review candidates and above 800 lines as strong decomposition candidates. Generated preserved specifications may legitimately exceed these thresholds because splitting them would destroy source fidelity. Human-authored source lines should normally remain below 120 characters; generated tables and literal source preservation are exceptions when reflow would change meaning.

Edits must use additive, backward-compatible APIs where possible. Existing user content must not be deleted or silently reformatted. Generators must be deterministic, retained in \`tools/\`, and rerun whenever their inputs change. Generated output must pass syntax/import checks and focused behavioral tests.

All documentation, specifications, and code comments must be written in English. Code identifiers retain the project vocabulary. HTML documentation and affected DS files must be updated in the same change set as contract-shaping code changes. DS numbering must remain contiguous.

## Decisions & Questions

### Question #1: Why are large preserved DS files exempt from ordinary file-size decomposition?

Response: The user requires the original specification content to remain intact and unsummarized. The exemption applies only to preserved contract copies; executable source must still be decomposed by responsibility.

### Question #2: Are tooling manifests prohibited by the no-JSON semantic rule?

Response: No. The prohibition covers semantic artifacts and test oracles. Existing plugin and external-tool integration manifests may remain JSON because they are not OntologyJS, LongTextJS, IntentJS, CircuitJS, CNL, or evaluation semantics.

### Question #3: How are generated files reviewed?

Response: Review the generator and representative outputs, run the full generated test set, check reproducibility by rerunning the generator, and use \`fileSizesCheck.sh\` to identify exceptional artifacts.

## Conclusion

Repository code must remain modular, deterministic, executable, evidence-aware, and testable with Node.js alone. This file remains the single coding-style authority.`);

const originals = (await readdir(resolve(root, "design-specifications"))).filter((name) => /^DS-\d{3}_.+\.md$/.test(name)).sort();
const alignments = [
  "The implementation maps the architecture to framework/sdk, framework/runtime, framework/packs, framework/tools, framework/cli, profiles, agents/tasks, and executable examples. The CLI retains findings, CNL frames, coverage, diagnostics, binary traces, execution plans, and auxiliary assurance artifacts.",
  "The executable CLI implements the declared workspace, coding, execution, test, evaluation, context, source, semantic inspection, trace, CNL, and review command families. Folder resolution accepts --agent or --agent-dir and --task or --task-dir.",
  "The SDK is decomposed by DSL under framework/sdk. Builders seal immutable OntologyJS, LongTextJS, IntentJS, CircuitJS, CNL, agent, skill, run, and evaluation models; the root SDK also exports DSL namespaces to disambiguate intentionally repeated fluent names.",
  "The runtime implements transactional storage, indexed queries, deterministic scheduling, capability planning, traces, caching, exact rationals, finite-domain and Boolean solving, difference constraints, union-find, Allen relations, fixed points, automata, abstract interpretation, symbolic paths, state exploration, decision DAGs, rewriting, slicing, specialization, and factor inference.",
  "Intent and profile modules are executable .mjs. Resolution combines core defaults, profile packs, agent packs, task-local modules, explicit CLI domains/checks, exclusions, natural-language pack signals, and all-compatible fallback with a retained plan explanation.",
  "The deterministic test layer uses node:test, a real fixture harness, semantic assertions, seeded finite generators, mutation helpers, framework algorithm tests, pack tests, example tests, CLI workspace tests, and explicit fast/standard/exhaustive selection.",
  "The evaluation SDK and runner create isolated evaluation agents and random-ID tasks. A suite can retain an agent brief and declare agent-level architect/ontology/circuit phases plus task-level intent/longtext/ontology/circuit phases. With --invoke-agent, each declared phase runs the real Codex adapter, snapshots created and modified canonical artifacts, applies phase-specific deterministic acceptance, and retains instructions, installed skills, context, logs, and final response. Concrete execution, declared abstract/symbolic assurance, expected findings or generation frames, and model-free replay are then reported in Markdown plus executable .mjs artifacts. DS041 defines the complete natural-language authoring evidence contract.",
  ...Array.from({ length: 13 }, (_, index) => `The corresponding executable pack is installed under framework/packs and includes ontology modules, a sealed pack descriptor, capability-providing circuits, CNL support, lexical/semantic intent signals, and isolated ontology/circuit/intent/CNL tests. Pack ${index + 1} of the preserved domain sequence is also loadable through framework/packs/index.mjs.`)
];
const additionalDecisions = new Map([
  ["DS-003_SemanticStore_Circuit_Runtime_and_Analysis_Algorithms.md", `### Question #3: How does symbolic decision coverage handle an omitted four-valued truth facet?

Response: Truth facets for one operand are mutually exclusive. They are exactly-one only when TRUE, FALSE, UNKNOWN, and CONFLICT are all declared. A partial table uses at-most-one constraints, so an omitted facet remains a path with no matching row. Symbolic path artifacts attach the selected row or missing-row output and its evidence identities without changing concrete decision semantics.`]
]);

for (let index = 0; index < originals.length; index += 1) {
  const source = await readFile(resolve(root, "design-specifications", originals[index]), "utf8");
  const originalTitle = source.match(/^#\s+(.+)$/m)?.[1] ?? originals[index];
  const title = `Preserved ${originalTitle.replace(/^DS-\d{3}\s+[—-]\s+/, "")}`;
  await writeSpecification(index + 2, `preserved-${originals[index].replace(/^DS-\d{3}_/, "").replace(/\.md$/, "").toLocaleLowerCase("en").replaceAll("_", "-")}`, {
    title,
    status: "normative-implemented",
    owner: "nllAgent architecture",
    summary: `Preserves ${originals[index]} verbatim and records additive implementation alignment.`
  }, `## Introduction

This official specification preserves the complete original design contract. No wording from the source specification has been removed, shortened, or rewritten.

## Core Content

The following source specification is included verbatim from \`design-specifications/${originals[index]}\`.

<!-- ORIGINAL SPECIFICATION START: ${originals[index]} -->
${source}<!-- ORIGINAL SPECIFICATION END: ${originals[index]} -->

### Additive implementation alignment

${alignments[index]}

## Decisions & Questions

### Question #1: Why is the original specification embedded instead of replaced by a normalized rewrite?

Response: Source fidelity is an explicit project requirement. The embedded body remains byte-for-byte identical to the original file; official metadata, implementation alignment, and decision records are additive.

### Question #2: Which text wins if an additive note appears narrower than the preserved contract?

Response: The preserved normative requirement remains authoritative. An implementation-alignment note reports confirmed current behavior and cannot silently weaken the original contract.

${additionalDecisions.get(originals[index]) ?? ""}

## Conclusion

Future changes must preserve the embedded source contract, extend implementation and tests to meet it, and record contract-shaping rationale in numbered entries here.`);
}

const skillSpecs = [
  ["nll-architect", "Architect Skill Contract", "Decomposes requests into artifact ownership, pack selection, and ordered work phases."],
  ["nll-orchestrator", "Orchestrator Skill Contract", "Builds workspaces, file-based context, direct coding runs, and deterministic handoff checks."],
  ["nll-sdk", "SDK Skill Contract", "Authors reusable fluent semantic constructors and stable public SDK primitives."],
  ["nll-runtime", "Runtime Skill Contract", "Implements the SemanticStore, planner, scheduler, analysis methods, traces, and caches."],
  ["nll-intent", "Intent Skill Contract", "Authors IntentJS and resolves profiles, pack signals, concerns, and fallback selection."],
  ["nll-ontology", "Ontology Skill Contract", "Authors pack-qualified OntologyJS modules and constructor facades."],
  ["nll-longtext", "LongText Skill Contract", "Materializes grounded source semantics with contexts, alternatives, and coverage."],
  ["nll-circuit", "Circuit Skill Contract", "Authors reusable query, decision, procedural, generation, and assurance circuits."],
  ["nll-test", "Test Skill Contract", "Builds deterministic structural, differential, mutation, and integration checks."],
  ["nll-evaluate", "Evaluation Skill Contract", "Builds isolated suites, coding-agent runs, semantic metrics, and retained reports."]
];
for (let index = 0; index < skillSpecs.length; index += 1) {
  const [skillId, title, summary] = skillSpecs[index]; const source = await readFile(resolve(root, "nll-skills", skillId, "SKILL.md"), "utf8");
  await writeSpecification(22 + index, skillId, { title, owner: skillId, summary }, `## Introduction

This specification makes the \`${skillId}\` coding workflow part of the official contract. The executable companion is \`nll-skills/${skillId}/workflow.mjs\`.

## Core Content

The CLI must load the executable workflow through the SDK, resolve its dependencies transitively, copy only the required skill folders into a run directory, and generate the union of context artifacts declared by the complete dependency closure. The coding agent must read the installed skill contract, dependency-ordered instructions, exact selected specifications, and resolved live catalogs before editing canonical files.

The executable manifest is not a decorative index. Its specification references determine the DS files copied into the reading order; its context declarations select named run-local projections generated from live project modules; its tool declarations must resolve to implemented CLI commands; its dependency declarations determine installation and reading order; its edit roots state the ownership boundary; and its phases state where the workflow is applicable. Every declared context name and tool command must be validated by framework tests so a misspelling or stale declaration fails before a coding run is presented as usable.

The generated coding instructions must explain the goal, canonical working directory, project CLI, installed skill order, selected specifications, and exact context artifact inventory. Context artifacts remain compact projections for discovery: they name real SDK imports, loaded ontology identities, available semantic and response circuits, profile resolution, source units, or diagnostics. Codex must inspect canonical modules when it needs implementation detail and must write executable \`.mjs\` programs through the real SDK rather than translating catalog prose into inert data.

Correctness has two explicit layers. The skill's Markdown workflow tells Codex which narrow CLI checks to run while authoring. The run manifest records the standard deterministic check for the edited owner. Evaluation and adaptive authoring additionally apply phase-specific acceptance to imported modules, ontology diagnostics, source anchors, provider availability, focused tests, concrete findings, requested auxiliary assurance, and the public CNL response. Documentation must identify which layer runs automatically for each command and must not describe a suggested check as if the framework had already executed it.

### Preserved skill instructions

${source}

## Decisions & Questions

### Question #1: Why does the skill have both Markdown and executable forms?

Response: \`SKILL.md\` provides operational guidance to the coding agent; \`workflow.mjs\` provides machine-resolvable specifications, dependencies, tools, edit roots, and phases. Both are loaded from the same skill folder and must remain synchronized.

### Question #2: How does the skill obtain SDK and ontology knowledge?

Response: It consumes run-local \`SDK_CATALOG.md\`, \`ONTOLOGY_CATALOG.md\`, \`CIRCUIT_CATALOG.md\`, \`PROFILE_RESOLUTION.md\`, source outlines, and the exact DS files selected by its workflow. It must use resolved constructors rather than duplicating theory into task code.

### Question #3: How is sufficient context selected without copying the whole project?

Response: The requested phase selects one or more root skills. Dependency-first closure produces the installed skill order, and the union of their manifest declarations produces the exact DS and context inventory. Each catalog is generated from the currently resolved project, profile, agent, task, and decoded source state. Codex follows identities and import paths from those projections into canonical code only when the phase needs more detail.

### Question #4: What proves that a skill declaration is executable?

Response: Framework tests load every manifest, close every dependency graph, reject cycles, validate every context artifact name, and route every declared tool through the real CLI. Authoring evaluations then retain the installed skill, instructions, catalogs, process evidence, edited paths, and phase-specific deterministic acceptance. The Markdown instructions alone are not proof of a successful run.

## Conclusion

The skill is complete only when its workflow resolves through the real SDK, its edit boundary is respected, and its mandatory deterministic checks pass.`);
}

await writeSpecification(32, "documentation-and-specification-ownership", {
  title: "Documentation, Specification, and Tooling Ownership Boundary",
  owner: "nllAgent maintainers",
  summary: "Separates project-owned documentation generators and contracts from environment-managed agent skills."
}, `## Introduction

nllAgent may be maintained with environment-provided coding skills, but those skills are not project source and may be upgraded or removed independently. This specification makes the ownership boundary explicit.

## Core Content

Project code, tests, DS files, documentation sources, generated HTML, templates, link verifiers, and static-site checks must be owned under this repository outside \`.agents/\`. No project generator, runtime module, test, CLI command, or published document may require a file under \`.agents/\` in order to run or regenerate the project.

Environment-managed skills may be read and followed during a maintenance session. Their source must not be edited as part of nllAgent implementation, embedded wholesale into official DS files, copied into the project skill catalog, or presented as an nllAgent runtime capability. The project-owned coding skills are the executable \`nll-skills/\` modules installed into coding-agent runs.

Official DS generation must preserve the original \`design-specifications/\` files, add project-owned implementation contracts, and remain reproducible when \`.agents/\` is absent. HTML generation must use project-owned templates and assets. Documentation navigation may describe the role of external maintenance tooling only as an environment boundary, never as a project-owned skill page.

## Decisions & Questions

### Question #1: Why may an external skill guide work without becoming project source?

Response: A maintenance process can use tools supplied by its environment while the resulting code and contracts remain self-contained. Treating the tool itself as project input would make regeneration depend on mutable workstation state.

### Question #2: Which skills are part of the product contract?

Response: Only the ten visible executable skills under \`nll-skills/\`. They are installed into run-local coding contexts and are tested against the local SDK. Environment-maintenance skills are outside this catalog.

## Conclusion

nllAgent remains regenerable, testable, and understandable from project-owned files alone.`);

await writeSpecification(33, "specification-review-contract", {
  title: "Specification Review and Companion Synchronization",
  owner: "nllAgent maintainers",
  summary: "Defines how project-owned DS contracts are reviewed against implementation and synchronized companions."
}, `## Introduction

New user requirements and observed failures can change several contracts at once. This project-owned review contract prevents a local wording patch from leaving code, tests, tutorials, and related DS files inconsistent.

## Core Content

A review must identify every affected DS, implementation area, test surface, generated documentation page, and unresolved decision before editing. It must compare each DS against the current implementation and the new evidence. Contract changes belong in \`Core Content\`; detailed rationale and alternatives belong in consecutively numbered \`Decisions & Questions\` entries.

Initial preserved specifications must remain byte-for-byte included in their official DS wrappers. Additive contracts may be strengthened or corrected, but a generator must remain their reproducible source. A behavior-changing review must update code, focused tests, exhaustive test expectations, CLI help, HTML documentation, tutorials, README or AGENTS guidance, and observations requiring human review in the same change set.

The final audit must reread affected DS files in numeric order, run \`node tools/verify-spec-fidelity.mjs\` to verify contiguous numbering and byte-for-byte original inclusion, and compare documented examples with retained real execution artifacts. An unresolved multi-option question must remain visible and unimplemented until a choice is selected.

## Decisions & Questions

### Question #1: Why is review policy project-owned rather than copied from a maintenance skill?

Response: The project contract must survive changes to the agent environment. External skills may help apply this method, but this DS and its tests define what nllAgent itself preserves.

## Conclusion

Specification review is complete only when the authoritative contracts and every exposed companion describe the same verified implementation.`);

await writeSpecification(34, "core-language-pack", {
  title: "Core Language Ontology Pack",
  owner: "nll-ontology",
  summary: "Defines the mandatory common semantic vocabulary that all profiles and task-local programs may import."
}, `## Introduction

Every load profile requires a shared semantic vocabulary, yet the original domain series starts with common-sense knowledge rather than a separate language pack. This orthogonal specification defines the implemented \`core-language\` boundary.

## Core Content

\`framework/packs/core-language\` must provide pack-qualified constructors for general entities, events, states, propositions, claims, documents, mentions, contexts, values, quantities, and common semantic roles. Domain packs must import these constructors instead of redefining shared role identities. The pack must provide a grounding-integrity circuit, intent signals, a sealed pack descriptor, and isolated executable tests.

The pack is mandatory even when \`--only\` is used. It is language-semantic infrastructure rather than broad world knowledge; loading it does not license unsupported real-world facts. Task LongTextJS must continue to distinguish source claims, ontology facts, and coverage witnesses.

## Decisions & Questions

### Question #1: Why is core-language separate from core-commonsense?

Response: Shared term and role vocabulary is required to connect DSLs and domain packs, while common-sense facts and checks are optional knowledge selected by profiles. Combining them would make minimal execution silently inherit broader world assumptions.

### Question #2: Why is this a new DS rather than an amendment hidden in a domain DS?

Response: The dependency is orthogonal to every domain pack and every skill. A separate contract prevents duplicated definitions and makes the mandatory load rule explicit.

## Conclusion

All profiles and task programs may rely on a stable core language without implicitly loading common-sense or specialized domain claims.`);

await writeSpecification(35, "context-and-dependency-resolution", {
  title: "Agent, Task, Context, and Dependency Resolution",
  owner: "nll-orchestrator",
  summary: "Defines folder-based ownership and non-redundant SDK, ontology, source, specification, and skill context resolution."
}, `## Introduction

This specification formalizes the user-required notion that agents and tasks are folders and that coding skills must obtain real SDK and ontology dependencies without copied theory.

## Core Content

Every semantic command must resolve an agent from \`--agent <name-or-path>\` or \`--agent-dir <path>\`. Task commands must additionally resolve \`--task <id-or-path>\` or \`--task-dir <path>\`. Name resolution uses \`agents/<name>\` and \`<agent>/tasks/<id>\`; explicit paths may be outside those defaults while still importing the selected project SDK.

Runtime resolution must load framework defaults, the selected profile, agent-local ontologies/circuits, and task-local ontologies/circuits/IntentJS/LongTextJS in documented precedence. The context builder must ingest task sources, resolve the selected skill dependency graph, install run-local skill folders, identify exact DS filenames, and generate exactly the supported context-artifact union declared by that dependency graph. Those artifacts are compact projections from live SDK descriptors, resolved ontology/circuit objects, profile selection, decoded sources, project paths, and retained diagnostics. Unsupported manifest names are configuration errors. Catalogs are informational and must not replace canonical modules.

\`INSTRUCTIONS.md\` must enumerate the actual generated context files and place them after the installed skills and selected DS files in the mandatory reading order. It must not claim that an undeclared catalog is present. The adjacent executable run manifest records the adapter, canonical working directory, installed skills, edit root, objective, and deterministic owner-level check. A prepare-only command may stop after creating this auditable context; invoking the coding adapter is a separate, explicit action.

A long-running authoring or evaluation process must observe changes to transitive agent/task modules made by a coding phase in the same process. Fresh import applies to the entire local semantic dependency graph below the resolved agent ownership root, not only to its entry module. Framework SDK/runtime modules retain stable process identities so constructors and \`instanceof\` boundaries are not duplicated. Freshness keys must be derived from local file metadata and covered by a regression that rewrites an entry module and one imported dependency between two resolutions.

Skill workflows may name preserved original contracts with hyphenated references such as \`DS-003\` and additive official contracts with compact references such as \`DS039\`. The context resolver must distinguish both namespaces, expand original domain ranges only for the packs loaded in the active profile, and include every official cross-cutting DS explicitly declared by the resolved skill chain.

The agent folder owns reusable ontologies, circuits, methods, profiles, lexicons, CNL, tests, tasks, and agent-level coding runs. The task folder owns source maps, intent, longtext units and root, task-local ontologies/circuits, tests, runs, and retained results. A source interpretation must not be promoted to default knowledge without an explicit reusable contract and tests.

Natural-language semantic authoring is an explicit two-level coding workflow. Agent-level authoring reads an agent brief and may create reusable OntologyJS, CircuitJS, CNL, profile, and test modules. Task-level authoring reads the task instruction plus decoded sources and may create task-owned IntentJS, LongTextJS, local ontology or circuit extensions, and tests. In both cases the context builder supplies the installed skill chain and live SDK, ontology, circuit, profile, source, and specification catalogs; it does not synthesize the semantic programs itself.

An evaluation suite that claims coding-agent authoring must retain the brief, task instruction, exact source text, every generated canonical module, installed run-local skills, generated context, process logs, final response, deterministic verification results, and concrete or symbolic execution results. A fixture copied into place by the suite is not evidence that the coding agent learned the semantic program from natural language.

Only one coding run may hold a write lock for a given target folder. Independent agent/task folders may proceed independently. Deterministic test and execution commands must never acquire the coding-agent adapter implicitly.

## Decisions & Questions

### Question #1: How are local SDK paths made portable for agents outside the default agents directory?

Response: Generated module specifiers are calculated relative to each target file and the explicit project root. The context records a repository-relative project map and gives the coding agent an exact \`node nllAgent.mjs\` invocation.

### Question #2: How is default theory exposed without copying it into ten skills?

Response: Framework SDK modules and pack descriptors remain canonical. Skills declare which catalogs and specifications they require; the context builder derives those artifacts once per run from the resolved runtime.

### Question #3: Why are original and official DS references both supported?

Response: The original twenty files must remain intact and use their established hyphenated IDs, while cross-cutting implementation decisions live in the gap-free official series. Explicitly different reference syntax avoids accidental renumbering and lets each skill request only the contracts it actually needs.

### Question #4: Why version transitive local modules but not framework modules?

Response: Coding phases edit the agent/task dependency graph while an evaluator remains alive, so every local dependency must be fresh. Duplicating framework constructors would instead split semantic class identity inside one runtime. The module hook therefore versions only files below the resolved ownership root.

### Question #5: Why does the manifest select context artifacts by name?

Response: A phase needs enough information to choose correct SDK constructors and reuse loaded semantic identities, but an undifferentiated project dump hides ownership and wastes the coding agent's context. A small validated vocabulary of generated artifacts makes the dependency explicit, inspectable, and testable while canonical modules remain available for deliberate follow-up reading.

## Conclusion

Folder ownership, dependency order, and generated context are executable contracts rather than prompt conventions.`);

await writeSpecification(36, "coding-agent-model-strategy", {
  title: "Coding-Agent Adapter and Model Strategy",
  owner: "nll-orchestrator",
  summary: "Defines explicit Codex invocation, adapter boundaries, retained logs, and deterministic post-agent verification."
}, `## Introduction

nllAgent uses a coding agent for semantic authoring and review. This specification defines the model boundary without making model output part of deterministic runtime semantics.

## Core Content

\`CodingAgentAdapter\` is the extension boundary. \`CodexAdapter\` is the first implementation and must invoke the locally installed \`codex exec\` command in direct-editing mode, set the canonical working directory, provide a file-based instruction path, and retain standard output, standard error, final response, start/finish times, and exit status under the run directory.

The CLI may accept \`--model <id>\` and pass it through without embedding a hard-coded current model name. Absent an explicit model, the local Codex configuration selects its default. This avoids time-sensitive model routing inside the semantic framework. Resume identifiers may be passed only through explicit coding commands.

Coding-agent success means process completion, not semantic acceptance. The workflow must run deterministic import, ontology, anchor, circuit, and test checks separately. Ordinary \`run\`, \`plan\`, \`query\`, source, and inspection commands must never invoke Codex. Evaluation invokes it only with \`--invoke-agent\` because authoring performance is then part of the measured system.

Coding-agent phases are semantic authoring phases, not labels around fixture replay. Agent phases such as \`architect\`, \`ontology\`, and \`circuit\` operate on the agent brief and reusable agent folder. Task phases such as \`intent\`, \`longtext\`, optional \`ontology\` or \`circuit\`, \`test\`, and \`review\` operate on a concrete task instruction and its sources. Every phase must snapshot canonical artifacts before and after the process, retain created and modified paths, and run the deterministic checks appropriate to that phase.

The adapter may report process success only from the actual subprocess exit. Evaluation acceptance additionally requires importable semantic code, valid ontology references, valid source anchors, declared circuit contracts, passing tests, and the expected execution behavior. Reports must link to the real run directory and generated files; placeholder phase pages are insufficient authoring evidence.

## Decisions & Questions

### Question #1: Why is there no fixed default model in repository code?

Response: Model availability and recommended defaults change independently of the semantic contracts. The adapter preserves an explicit override while delegating the absent case to the installed Codex configuration.

### Question #2: Why are coding-agent logs not interpreted as semantic results?

Response: Natural-language completion text is not a stable oracle. Acceptance comes from executable artifacts, typed diagnostics, retained semantic results, and deterministic tests.

## Conclusion

The coding-agent layer remains replaceable, explicit, observable, and separated from reproducible semantic execution.`);

await writeSpecification(37, "source-extraction-and-stable-offsets", {
  title: "Source Extraction, Adapters, and Stable Decoded Offsets",
  owner: "nll-longtext",
  summary: "Defines deterministic UTF-8 and PDF ingestion plus task-local extractor extension contracts."
}, `## Introduction

Source provenance begins before LongTextJS: bytes must be decoded into stable text before claims can reference exact offsets. This contract is orthogonal to the semantic DSLs and applies to every agent and task.

## Core Content

\`framework/tools/source-extractors.mjs\` is the extraction boundary. UTF-8 text, Markdown, CNL, CSV, and HTML use the built-in UTF-8 extractor. PDF input uses the dependency-free PDF text extractor, which validates the header, rejects encrypted documents, decodes unfiltered or Flate-compressed content streams, interprets literal and hexadecimal text operands, and records extractor and page metadata. Decoded text—not binary byte position—is the canonical coordinate space used by \`SourceUnit\` and \`SourceSpan\`.

This boundary is deliberately non-semantic. Source ingestion may decode bytes, normalize stable source units, calculate digests, expose exact spans, and build a source outline. It must not infer IntentJS, ontology concepts, LongTextJS claims, circuit logic, contradiction results, or generated answers from natural language. Those artifacts are authored by a coding agent running the appropriate \`nll-*\` skills against the decoded source and live project catalogs. After authoring, deterministic runtime commands import and execute the resulting JavaScript DSL modules without another model call.

A task may override or add a format through \`source/extractors/<extension>.extractor.mjs\`. The module exports \`default\` or \`extractSource\`, receives an immutable object containing path, extension, bytes, and task root, and returns a text string or \`{ text, metadata }\`. The ingestion tool validates this result, segments it deterministically, hashes the entire decoded text, and generates executable \`source-map.mjs\` with stable offsets and metadata.

Extraction failure must never fabricate text. Unsupported formats, invalid modules, encryption, unsupported PDF encodings, and decoding failures produce typed source diagnostics. Scanned PDFs require a task-local OCR/extractor adapter because Node.js built-ins cannot infer glyphs from images. Source IDs remain deterministic under a lexically sorted source-file list.

## Decisions & Questions

### Question #1: Why are PDF offsets based on extracted text rather than file bytes?

Response: PDF text is stored through drawing operators, compression, and font encodings, so a human-visible phrase generally has no contiguous byte interval. Provenance remains replayable by retaining the source digest, extractor identity, decoded text digest, source unit, and decoded interval.

### Question #2: Why may a task-local extractor override a built-in?

Response: Specialized documents may require a known font map, OCR capture, or domain decoder. The explicit task-owned module makes that choice reviewable and reproducible while preserving the common ingestion contract.

### Question #3: Does source extraction translate natural language into semantic DSL code?

Response: No. It produces stable decoded evidence only. Explicit coding-agent phases use that evidence, the task instruction, the selected skills, and resolved SDK or ontology catalogs to author IntentJS, LongTextJS, OntologyJS, or CircuitJS. Conflating these operations would hide model-dependent interpretation inside deterministic ingestion and make the claimed authoring evaluation meaningless.

## Conclusion

Every accepted source produces deterministic decoded text and verifiable semantic spans, while unsupported decoding remains a visible diagnostic rather than an implicit loss of evidence.`);

await writeSpecification(38, "domain-pack-generation-and-module-ownership", {
  title: "Domain-Pack Generation and Semantic Module Ownership",
  owner: "nll-ontology",
  summary: "Defines validated generation of the thirteen domain packs and explicit ownership of every ontology symbol."
}, `## Introduction

The thirteen domain specifications share an executable pack shape but retain different ontology modules and capability inventories. This specification defines their deterministic generation boundary without replacing any preserved domain contract.

## Core Content

\`tools/generate-domain-packs.mjs\` must generate only source-controlled \`.mjs\` ontology, circuit, CNL, pack, and test modules. \`tools/domain-module-allocations.mjs\` explicitly assigns every declared concept and event frame to one semantic module. Before writing output, generation must reject an unknown or missing module and every missing, unknown, or multiply assigned symbol. Positional, round-robin, or filename-order assignment is prohibited because module ownership contributes to pack-qualified identity.

Every generated pack must seal all modules, reuse core-language role identities, expose deterministic lexical and semantic recognition signals, declare capabilities, and retain isolated ontology, circuit, intent, and CNL tests. Every named check circuit must declare an explicit applicability concept, emit an evidence-bearing finding, preserve \`NOT_APPLICABLE\` when relevant terms are absent, and return \`UNKNOWN\` rather than a false success when the implemented evaluator lacks enough semantic structure. Generation and repair circuits must emit typed CNL frames and pass semantic round-trip comparison.

Shared evaluators are extension points, not a waiver of domain contracts. A capability-specific evaluator or agent-local replacement may use exact runtime kernels and richer role schemas without changing CLI selection. Calibration cases must ground required terms and test satisfied, violated, unknown, conflict, and not-applicable behavior where the capability admits those outcomes.

## Decisions & Questions

### Question #1: Why is symbol ownership an explicit catalog instead of inferred from names?

Response: Domain vocabulary includes names that legitimately cross ordinary keyword boundaries. Explicit ownership is inspectable against each DS appendix and generator validation makes inventory drift fail immediately.

### Question #2: May generated circuits conservatively return UNKNOWN?

Response: Yes, when their evidence does not establish a stronger result. They may not report SATISFIED merely because no violation was found. The preserved domain DS remains authoritative, and specialized calibration progressively strengthens results without weakening uncertainty semantics.

## Conclusion

Generated packs are reproducible executable knowledge modules with stable semantic ownership, conservative result semantics, and replaceable capability-specific evaluation boundaries.`);

await writeSpecification(39, "sdk-public-surfaces-and-tooling", {
  title: "SDK Public Surfaces, Usage Catalog, and Skill Tooling",
  owner: "nll-sdk",
  summary: "Defines executable SDK export inventories and the check, usage, and catalog commands consumed by coding skills."
}, `## Introduction

Coding skills need actual local SDK dependencies and concise usage information, not copied theory or guessed imports. This specification defines the executable documentation boundary shared by the SDK, context builder, CLI, and skill workflows.

## Core Content

\`framework/sdk/public-api.mjs\` must import and inventory the core, ontology, longtext, circuit, CNL, intent, agent, evaluation, and analysis surfaces. Each surface records its canonical module path, purpose, sorted live exports, and a minimal executable usage example. The inventory is derived from imported namespaces so a removed or renamed export becomes visible in the next check and generated context.

\`nllAgent sdk check\` validates that each surface is non-empty and every public export name is a valid ECMAScript binding, then reports repeated names across narrow surfaces. Repeated fluent names are informational because callers import the narrow module; the broad SDK root exposes explicit DSL namespaces where ambiguity exists. \`nllAgent sdk usage [--surface <id>]\` renders module paths, exports, and examples from this canonical inventory. \`catalog sdk\` combines the surface inventory with registered semantic constructor descriptors.

Every tool declared in a skill's executable \`workflow.mjs\` must correspond to an implemented CLI command. The integration suite must exercise the SDK check, filtered usage, and \`plan show\` commands through the same CLI router used by coding runs. Run-local \`SDK_CATALOG.md\` is generated from these live sources and remains informational; skills import SDK modules rather than copying catalog text into semantic artifacts.

## Decisions & Questions

### Question #1: Why are repeated export names not SDK-check failures?

Response: OntologyJS, CircuitJS, IntentJS, and agent contracts intentionally share vocabulary such as \`capability\`, \`guarantee\`, or \`usePack\`. Narrow imports retain the intended meaning, while namespace exports make broad-root use explicit.

### Question #2: Why keep examples in an executable SDK catalog?

Response: It gives coding skills one versioned local source for import paths and composition shape. HTML and run-local catalogs can render that source without duplicating API theory in ten skill files.

## Conclusion

SDK discovery is a tested executable contract: skills can inspect live exports, select a narrow surface, and invoke only commands that the local CLI implements.`);

await writeSpecification(40, "html-documentation-generation-and-portability", {
  title: "Project-Owned HTML Documentation Generation and Portability",
  owner: "nllAgent maintainers",
  summary: "Defines detailed generated HTML, project-owned assets, relative URLs, and retained-example fidelity."
}, `## Introduction

The HTML documentation is a generated product interface. It must explain the executable system from project-owned sources and remain portable below any hosting prefix.

## Core Content

\`tools/generate-html-docs.mjs\` and its project-owned helper modules must generate the complete HTML set, shared navigation, styles, specification loader, and local interactive assets. Generation must not read \`.agents/\`, a home directory, a CDN, localhost, or a fixed deployment prefix. Every internal link, script import, stylesheet, fetch target, and specification query must be document-relative.

Documentation must provide detailed project structure, skill operation, OntologyJS, IntentJS, LongTextJS, CircuitJS, response-circuit, runtime, CLI, testing, evaluation, and tutorial pages. DSL reference pages must include comprehensive tables of the current exported constructors and fluent operations, their parameters, result types, invariants, and concrete usage. Tables must be generated from or checked against live SDK exports so documentation drift is visible.

The six Understand pages must explain the system as a connected implementation story derived from the preserved architecture and workspace specifications. They must explain why authoring and deterministic execution are separate, why the semantic programs exist, how folder ownership controls reuse, how decoded source evidence becomes grounded claims, how planning composes compatible circuits, and how result circuits produce the public CNL answer. A dedicated coding-agent chapter must explain the adapter process, canonical working directory, skill dependency closure, live context generation, mandatory reading order, direct semantic-code editing, phase handoff, retained logs, and the distinction between process completion and deterministic semantic acceptance. It must connect that process to both reusable agent authoring and source-specific task authoring instead of treating Codex as an unexplained external box.

Every Understand chapter must develop its subject through connected causes and consequences. A subsection must explain what state exists when it begins, which component changes that state, which semantic boundary constrains the change, what inspectable artifact results, and why the next component can rely on it. Short slogans, one-sentence component summaries, repeated “what/why” templates, and component inventories presented as architecture are insufficient. Headings and coherent prose carry the explanation; concrete examples must recur across component boundaries so a reader can follow one instruction and source into authored programs, runtime values, findings, and public CNL. Bullet inventories and process tables may support the prose only when they clarify a dense vocabulary; they must not substitute for the narrative. Tables in these chapters are limited to simple two-column concept/explanation references.

The global skill workflow page and every individual skill page must be generated from the live \`SKILL.md\` and \`workflow.mjs\`. They must explain the manifest fields and show their actual values, dependency-first installation, context selection and provenance, the purpose and observable output of every declared CLI tool, the generated instructions and run manifest, edit ownership, the exact authoring workflow, and the completion criterion. They must distinguish checks Codex is instructed to run, the owner-level check recorded in \`run.mjs\`, and phase-specific acceptance enforced by evaluation or adaptive authoring. Generic statements that a skill “uses context” or “runs checks” are insufficient.

The pack chapter must enumerate live predefined knowledge for every registered domain: ontology modules, concepts and sorts, roles, relations, stable facts/laws, lexical and semantic signals, capabilities, circuit requirements/provisions, possible statuses, and declared assurance. The circuit chapters must expose capability closure, provider ordering, stage dependency scheduling, concrete truth execution, auxiliary interpretations, response-stage dataflow, local composition, and retained inspection artifacts through explicit stepwise explanations rather than high-level visual abstractions.

Tutorials must be built from retained accepted evaluations and fail closed when evidence is absent. Each natural-language case must show the exact input, instruction, task and agent semantic programs, and primary \`response.md\` Markdown CNL. Real coding-agent runs, deterministic replay, metrics, raw \`.mjs\` assurance projections, and other technical evidence remain retained and reachable from dedicated workflow, result, and evaluation pages; they must not be presented as the semantic answer or as competing tutorial stages.

Each retained tutorial must provide one two-level artifact tree in its left inventory. The first level is Input, Intermediate, or Output and is always visible; selecting a file at the second level opens only that file in the shared viewer. Input contains only natural-language authoring material: the exact reusable agent brief when that case authors an agent, followed by the exact task instruction and task source text. A case that uses a pre-existing fixed agent must say so directly instead of presenting agent code as task input. Intermediate contains the executable task declaration, IntentJS, LongTextJS, agent- or task-owned OntologyJS, CircuitJS, response policy, generated facade, and tests that materially explain how the input is interpreted. Output contains the single public Markdown CNL response; logs, assurance projections, state exploration, metrics, and raw findings belong to dedicated workflow or result pages rather than separate tutorial stories.

Each tree level must be accompanied by the exact retained or reproducible CLI command responsible for creating, authoring, executing, or validating that level when such a command exists. The command is explanation, not a fabricated transcript: natural-language corpus material may be described as retained suite input; coding phases name the real evaluation or adaptive command that invoked Codex; and Output names the ordinary deterministic run or replay that produced \`response.md\`. Every displayed invocation still carries its explanatory shell comment.

Tutorial prose must explain the concrete case rather than describe documentation pedagogy. It must identify the behavior requested by the agent brief and by the task instruction, explain which reusable agent modules implement the former, trace decisive source clauses into IntentJS selection and LongTextJS claims or coverage, explain why the applicable circuit reaches the observed result, and interpret what the retained Markdown CNL says about that exact source. Generic sections such as “What a programmer should learn” or stage-contract tables that merely restate Input / Intermediate / Output are prohibited. The explanation must name actual constructs, claims, rules, decisions, and output evidence visible in the adjacent files.

Each tree branch lists only files belonging to that semantic stage, one shared viewer materializes only the selected file, and the first input is open by default. Visible labels must start with the short semantic owner \`agent/\` or \`task/\` and continue relative to that owner; they must not repeat evaluation prefixes, random task identifiers, or repository roots. A synthetic natural-language instruction uses \`task/task-instruction.txt\`, and the public answer uses \`task/results/response.md\`. The complete repository-relative identity remains retained as inert metadata. File viewers must wrap long lines and identifiers within the available viewport and must not introduce a horizontal scrollbar. File content is generated from retained artifacts without summaries or fabricated examples, and the explorer must work under the same document-relative static-site boundary.

Every runnable CLI invocation displayed in a documentation code block must be immediately preceded by a shell comment that explains both its observable action and why the reader would run it at that point. The comment is explanatory documentation and is not part of the copied command. Multiple commands in one block each require their own comment; a paragraph after the block is not a substitute.

The documentation shell must use the available viewport rather than imposing a narrow fixed reading column. Outer margins and panel padding must remain compact, prose and callouts may use the full content width, and artifact inventory width must leave most horizontal space to the selected file. Responsive collapse still applies when the inventory and viewer no longer fit side by side.

Technical process pages must explain sequences as explicit steps or Input / Action / Output tables grounded in real files and observable results. Abstract flow, state, class, and sequence diagrams must not replace that narrative. The primary Reference menu must expose one specification-browser entry rather than duplicating individual DS links already available through the matrix.

The documentation verifier must scan HTML, Markdown, CSS, JavaScript, and MJS assets for missing local targets and prohibited root-relative or machine-local URLs. A static-site verification must serve the generated tree under a non-root prefix and request the index, local assets, tutorials, and \`specsLoader.html?spec=matrix.md\`.

HTML verification must distinguish executable markup/scripts from displayed examples and inert artifact templates.
Attribute URLs are scanned outside script/template bodies; imports and fetch targets are scanned from executable
script blocks. Markdown matrix links are resolved in the specification viewer's document context. This prevents a
literal SDK import shown in a tutorial from being mistaken for a documentation asset without weakening real asset
validation.

## Decisions & Questions

### Question #1: Why are large tutorial pages permitted?

Response: Exact retained source, semantic code, and CNL output can be large, and hiding them would make the input-to-output explanation unverifiable. Generator source remains modular; technical run evidence stays in dedicated reports instead of inflating the tutorial story.

### Question #2: Why must the renderer and loader be project-owned?

Response: Documentation must regenerate when environment-managed maintenance skills are unavailable. Project ownership also makes relative-URL and no-external-dependency guarantees testable in this repository.

### Question #3: Why embed retained artifact content in the tutorial explorer?

Response: A documentation server may expose only the generated tree and cannot safely fetch arbitrary parent paths. Escaped retained content keeps the page portable; the client materializes only the selected template in one viewer, so the interface does not expand every large file at once.

### Question #4: Why does the link verifier treat code examples differently from scripts?

Response: An example such as \`import ... from "./framework/..."\` describes task code and is not executed by the
documentation page. Real \`<script>\` imports and markup URLs are deployment dependencies and must resolve. Parsing
those contexts separately avoids both false failures and skipped runtime assets.

### Question #5: Why do artifact labels retain \`agent/\` or \`task/\` while omitting repository prefixes?

Response: The owner prefix answers the important question—whether a file teaches reusable agent behavior or interprets one task—without repeating evaluation paths and random identifiers on every row. Keeping the complete path in inert metadata preserves exact provenance. A wide, compact shell exposes more code and tabular information before wrapping; wrapping remains mandatory inside file viewers for content that still exceeds the viewport.

### Question #6: Why do tutorials exclude assurance stories and process diagrams?

Response: A programmer must first be able to trace the public contract from exact text input through inspectable semantic programs to one Markdown CNL output. Abstract/symbolic assurance, coding-process logs, metrics, and internal state remain valuable technical evidence, but presenting them as peer tutorial narratives obscures that contract. Dedicated workflow and result chapters retain those details, while explicit step tables explain technical processes without requiring readers to decode an abstract diagram.

### Question #7: Why are generic learning-objective sections prohibited?

Response: A heading that says what a programmer should learn does not perform the explanation. Case-specific prose must connect visible source clauses to visible DSL constructs, circuit decisions, and the retained answer, so the tutorial remains useful even when read without prior knowledge of the evaluation harness. This also makes documentation drift testable against real artifacts instead of against reusable meta-text.

### Question #8: Why is the tutorial inventory a tree instead of stage tabs?

Response: Input, Intermediate, and Output are ownership levels in one causal story, not mutually exclusive views. A two-level tree keeps all three stages visible while the reader moves among individual files, and the adjacent command provenance explains how each branch was produced without mixing logs or assurance artifacts into the public answer.

### Question #9: Why must skill pages expose actual manifests and verification layers?

Response: The coding agent's behavior depends on executable dependency, context, tool, edit-root, and phase declarations. Showing only a purpose sentence makes it impossible to determine what context Codex actually receives or which result was truly checked. Rendering live values and the distinct verification layers turns the documentation into an auditable account of the implementation.

### Question #10: Why are the Understand chapters primarily narrative?

Response: Architecture is a chain of reasons and boundaries: ambiguity belongs to authoring, deterministic behavior belongs to executable semantic programs, reuse belongs to agents and packs, and source interpretation belongs to tasks. Tables enumerate components but do not explain those causal relationships. Coherent prose makes the model usable before the reader consults the detailed API references.

### Question #11: Why does the coding agent need its own Understand chapter when skill pages already exist?

Response: A skill page explains one executable workflow contract. The coding-agent chapter explains the complete actor across workflows: how nllAgent constructs its world, how dependency-ordered skills and live catalogs become context, how Codex changes canonical semantic programs, how ownership limits those changes, and how independent checks decide whether the resulting system is acceptable. Without that connecting account, individual skill manifests remain accurate but the authoring architecture remains fragmented.

## Conclusion

The HTML documentation is complete only when it is detailed, evidence-backed, independently regenerable, and portable under arbitrary URL prefixes.`);

await writeSpecification(41, "agentic-natural-language-authoring", {
  title: "Agentic Natural-Language Semantic Authoring and End-to-End Evaluation",
  owner: "nll-architect",
  summary: "Defines prompt-like authoring through a real coding agent, deterministic semantic replay, and retained end-to-end evidence."
}, `## Introduction

nllAgent presents a prompt-like workflow to its operator, but it is intentionally not a monolithic hidden model call. A natural-language brief or task first drives a coding agent that authors inspectable semantic programs; the deterministic nllAgent runtime then executes those programs and can replay them without another coding-agent call. This specification makes that lifecycle explicit and closes the boundary left implicit by the source-extraction contract.

## Core Content

### Authoring and execution are separate stages

The natural-language inputs are an agent brief, a task instruction, and one or more task source files. Agent-level coding phases use the brief to create reusable agent-owned profiles, OntologyJS concepts, CircuitJS behavior, CNL forms, and tests. Task-level coding phases use the instruction and decoded sources to create task-owned IntentJS, LongTextJS, optional task-local ontology or circuit extensions, and tests. Codex is the first supported author through \`CodingAgentAdapter\`; the architecture must remain adapter-based.

The framework may prepare folders, decode sources, resolve dependencies, build catalogs, install skills, invoke the adapter, record artifacts, and validate the result. It must not replace the coding agent with keyword extraction or generate inert JSON descriptions of the DSLs. The coding agent directly edits canonical \`.mjs\` files through the SDK constructors exposed by the run-local catalogs and specifications.

Once semantic code exists, \`plan\`, \`run\`, \`query\`, assurance, replay, and inspection are deterministic framework operations. Reusing the same agent on a new task normally requires task-level IntentJS and LongTextJS authoring, not regeneration of the reusable agent ontology and circuits. Replaying an unchanged task requires no coding-agent invocation.

### Folder and evidence contract

The evaluation root owns one isolated agent folder. Its \`source/agent-brief.md\` is the exact reusable natural-language requirement. Reusable generated programs live in \`profiles/\`, \`ontologies/\`, \`circuits/\`, \`cnl/\`, and \`tests/\`. Every coding phase has a retained \`runs/<run-id>/\` directory containing \`INSTRUCTIONS.md\`, installed skills, resolved context, stdout, stderr, final response, timings, exit status, and the created or modified canonical paths.

Each evaluation case creates a new random-ID task folder. It retains the exact task instruction, original source files and decoded source map, generated \`intent/\`, generated \`longtext/\`, optional local extensions, tests, task-level coding runs, and deterministic \`results/\`. Reports must connect the human-readable case identifier to that concrete task folder and expose source text, generated code, findings or CNL frames, assurance outputs, and replay metrics.

The primary case output is \`results/response.md\`: tagged, human-readable Markdown CNL selected and organized by
response circuits according to IntentJS. Raw findings, executable result modules, assurance projections, logs,
and traces are separate technical evidence. Evaluation acceptance must verify response tags, expected material
results, exact source quotations, absence of non-applicable results, and model-free response replay in addition
to semantic finding keys. Semantic gold is checked against the full concrete finding set, while the public response
contract is checked against the exact findings selected by response circuits; internal grounding confirmations are
not forced back into the answer. A case may declare decisive source passages that must be quoted, including explicit
negative evidence used by a violation.

Before a later suite invocation replaces the canonical report set, the runner must archive the previous executable
agent-authoring and task-result records. Archived records continue to reference their original random-ID task and
run folders. Evaluation reruns must not erase earlier coding-agent attempts, generated programs, logs, failures, or
semantic results. Retained replay must select the newest current or archived cohort that contains actual coding-agent
process evidence; an intervening ordinary run with no authoring must not hide the most recent real cohort.

The evaluator command is fail-closed: any failed case produces a non-zero command result even when report generation
completed. \`evaluate --replay-retained\` may re-execute the exact random-ID tasks from the preceding real authoring
record without invoking Codex. It must preserve the real adapter provenance, regenerate semantic/response/replay
metrics against the current runtime, reject simultaneous \`--invoke-agent\`, and label the report as retained replay
rather than a new coding-agent run.

### Acceptance and iteration

A real authoring evaluation invokes the coding agent. Prewritten semantic fixtures, copied expected modules, or a report that merely says a phase occurred do not validate natural-language authoring. Each phase must be accepted by phase-specific deterministic checks. Each case must then execute through the real planner and SemanticStore, satisfy its semantic expectations, and reproduce its result during ordinary replay. Failed attempts remain retained as evidence; repairs use another explicit coding-agent phase or a new evaluation iteration until the suite meets its contract.

When a case declares expected findings, acceptance rejects both missing expected findings and unexpected material findings. Additional \`NOT_APPLICABLE\` results from compatible but irrelevant circuits are permitted because they demonstrate correct filtering; additional \`SATISFIED\`, \`VIOLATED\`, \`UNKNOWN\`, or \`CONFLICT\` findings fail the case unless the suite explicitly declares a partial oracle. Generation cases also enforce their minimum typed-frame count.

The minimum end-to-end validation covers materially different outcomes: contradiction detection, missing-justification detection, unsupported-conclusion detection, and controlled generation. At least one reusable agent ontology and the corresponding reusable circuits must be learned from the brief. Every task must obtain its own IntentJS and LongTextJS from its instruction and source. The controlled-generation case must produce a typed CNL frame rather than only a prose completion.

## Decisions & Questions

### Question #1: In what sense does nllAgent behave like an LLM?

Response: Its operator can supply a natural-language instruction and source and receive an analysis or generated artifact. Internally, however, the first encounter is an explicit coding-agent authoring operation that leaves inspectable programs; subsequent execution is deterministic and replayable. This is a deliberate semantic-program architecture, not an attempt to implement neural inference inside the runtime.

### Question #2: Why are agent-level and task-level authoring separate?

Response: Reusable domain distinctions and checks belong to the agent, while claims grounded in one source and the requested operation belong to the task. The separation prevents source assertions from becoming default knowledge and lets many tasks reuse one reviewed semantic agent.

### Question #3: May the source ingester infer enough semantics to skip Codex?

Response: No. It may expose stable text, units, spans, digests, and non-semantic outlines. Semantic selection, grounding, ontology design, and circuit authoring remain coding-agent responsibilities. Deterministic execution may skip Codex only after the required canonical programs already exist.

### Question #4: What proves that an evaluation is real?

Response: Retained subprocess evidence, generated canonical code absent before the run, phase-specific validation, concrete and auxiliary execution artifacts, expected semantic outcomes, and model-free replay together prove the complete path. Hand-authored fixtures remain useful unit tests but are not authoring evaluations.

### Question #5: Why have a retained replay mode if ordinary task replay already exists?

Response: Ordinary replay validates one task. Retained suite replay reuses the exact real-authoring cohort and strict per-case oracles, regenerates aggregate reports against current runtime code, and proves explicitly that no new coding agent was invoked.

### Question #6: What happens if an ordinary evaluation is run after the real authoring evaluation?

Response: Its report is archived like every other iteration, but it is not eligible to become the source of retained
authoring because it has no adapter process evidence. The replay selector searches the current report and archived
iterations from newest to oldest, then uses the newest cohort whose agent or task authoring records name the adapter,
run path, and exit code. The summary records which report directory supplied that provenance.

## Conclusion

Natural language enters nllAgent through an observable coding-agent authoring lifecycle and leaves behind executable semantic programs. Those programs—not hidden extraction heuristics or completion prose—are the durable interface between model-dependent interpretation and deterministic reasoning.`);

await writeSpecification(42, "adaptive-task-local-authoring-and-verification", {
  title: "Adaptive Task-Local Semantic Authoring and Verification Loop",
  owner: "nll-orchestrator",
  summary: "Defines an explicit deep-authoring CLI mode that fills missing task semantics and iterates Codex review over concrete, abstract, and symbolic evidence."
}, `## Introduction

Most production tasks should use an agent whose ontology and circuits are already reviewed, calibrated, and reusable.
Some inputs nevertheless introduce meanings or checks that the selected agent cannot express. This specification
defines an explicit optional mode that can extend the current task through a coding-agent loop without mutating
the reusable agent or hiding model-dependent work inside deterministic execution.

## Core Content

### Explicit CLI boundary

\`nllAgent analyze --author-adaptive\` enables deep task-local authoring. It is distinct from ordinary \`run\`
and \`analyze\`, which never invoke a coding agent, and from the narrower backward-compatible
\`--author-missing\`, which only fills the historically expected task artifacts. Adaptive authoring accepts
\`--authoring-cycles <1..10>\`, \`--assurance none|abstract|symbolic|all\`, and
\`--adaptive-allow-unknown\`. The default auxiliary requirement is \`all\`; unknown-only output is not material
acceptance unless the operator explicitly permits it.

### Authoring and inheritance sequence

The task begins with framework packs, the selected profile, reusable agent ontologies and semantic circuits, and
resolved framework/agent response circuits. Codex
authors IntentJS when absent, audits semantic vocabulary through the ontology skill, authors only genuinely
missing task-local OntologyJS, then authors source-grounded LongTextJS. It audits the combined circuit registry
and creates task-local CircuitJS only when the requested behavior is not already provided realistically. It adds a
task-local response circuit only when the default presentation cannot express the requested filtering or grouping. Every
phase edits canonical \`.mjs\` modules and focused tests directly and retains its run-local skills, catalogs,
instructions, logs, and final response.

The resulting execution plan is the dynamic composition boundary sometimes described as a super-circuit. It is
not one generated monolith. The capability registry and planner merge framework, profile, agent, and task-local
circuits, close their declared requirements and provisions, and retain the selected, rejected, and blocked
explanation. This preserves SOLID ownership and lets a later reusable agent absorb a proven task extension through
an explicit review rather than an implicit promotion.

### Deterministic acceptance and Codex review

After initial authoring, nllAgent imports the complete runtime, checks ontology closure, verifies all source
anchors, requires focused task tests, and validates that IntentJS retains instruction provenance, a semantic
concern, source-grounded evidence, the primary \`markdown-cnl\` output, concrete execution, and the requested auxiliary modes. It checks that every
requested concern has a circuit provider and executes the
real planner and SemanticStore. Acceptance requires a selected non-core circuit to produce a material finding or
typed generated frame, so generic core grounding alone cannot pass; it also requires no blocking
diagnostics, and the requested auxiliary interpretations for every selected non-core circuit. Abstract execution
must converge. Symbolic decision coverage must produce at least one non-truncated path. The primary response must
contain tagged, applicable Markdown CNL, include every response-selected material finding, quote exact input spans
for finding-bearing analysis, and exclude raw executable projections and non-applicable branches. A second ordinary
model-free execution must reproduce the selected circuits, finding keys, generated-frame identities, assurance
selection, and SHA-256 digest of \`response.md\` before the cycle can be accepted.

Intent acceptance must require an executable CNL presentation policy in addition to requesting \`markdown-cnl\`.
The policy must make selection, grouping, evidence, matched-rule explanation, tags, and style visible to response
composition; a bare output name is not a qualitative answer contract.

The tool writes a cycle-specific diagnostic bundle containing failures, selected circuits, findings, generated
frame counts, public response-result count and digest, abstract convergence, symbolic path counts, and truncation status. Codex then runs the review skill
chain with access to IntentJS, OntologyJS, LongTextJS, CircuitJS, runtime, and test guidance. It may repair only the
task-owned programs and tests and must not weaken acceptance. Deterministic acceptance reruns after every review
until it succeeds or the explicit cycle limit is exhausted. Exhaustion is a typed command failure, never a partial
success. If a task-local module cannot be imported, the review context falls back to inherited catalogs, retains
the complete resolution exception as a diagnostic, and still invokes Codex so syntax or construction failures are
repairable rather than preventing the repair phase itself.

### Retained artifacts

The task retains a pre-authoring \`results/adaptive-initial-state.mjs\` inventory,
\`adaptive-authoring-cycle-<n>.md\`, \`adaptive-authoring.mjs\`, \`adaptive-authoring.md\`, normal
findings/CNL/trace outputs, and complete auxiliary assurance artifacts. The
executable record names every authoring phase, review cycle, failure, circuit, finding, frame count, and assurance
summary. The task also retains the primary \`response.md\`, its semantic-program manifest, and the selected
response-circuit trace. \`adaptive-replay.mjs\` records the accepted model-free replay projection including the
Markdown CNL digest, and ordinary \`run\` can then
replay the accepted task without Codex.

When adaptive authoring resumes an earlier retained lifecycle, it must preserve the first pre-authoring inventory
and cumulative real Codex phase/run evidence. It writes a separate \`adaptive-resume-state.mjs\` plus Markdown view
for the state observed before the new repair iteration, appends new cycles with non-colliding indices, and validates
the final record against the original absence proof. Resumption must not rewrite a previously non-empty task as if
it had started empty.

## Decisions & Questions

### Question #1: Why is adaptive authoring task-local by default?

Response: A complex source can justify new representational code without proving that the code is stable reusable
knowledge. Keeping it under the task prevents source claims and one-off rule interpretations from silently
changing every future task. Promotion to the agent requires a separate reusable contract, calibration cases, and
review.

### Question #2: Can deterministic code decide that an ontology is semantically sufficient?

Response: It can detect missing imports, invalid identities, unsatisfied providers, failed tests, and incomplete
assurance, but not every conceptual omission in natural language. The ontology and circuit coding phases therefore
ask Codex to audit semantic sufficiency against the source while deterministic checks enforce the executable
boundary.

### Question #3: Why require a review even when the first concrete run succeeds?

Response: A single successful output may hide weak provenance, overfitted rules, absent unknown behavior, or an
empty symbolic model. The mandatory first review receives both successes and failures and audits the complete
concrete/abstract/symbolic evidence. It should make no changes when the task is already robust.

### Question #4: When should unknown-only output be accepted?

Response: Only when the operator selects \`--adaptive-allow-unknown\`. The default treats unknown-only output as a
signal that semantic authoring or evidence coverage remains incomplete, while the explicit option supports tasks
whose correct outcome is genuinely indeterminate.

### Question #5: Why preserve both initial and resume state?

Response: The initial inventory proves what Codex had to author from natural language. A later repair necessarily
starts from generated programs. Recording that later state separately preserves both claims and prevents cumulative
validation from fabricating a new empty starting point.

## Conclusion

Adaptive authoring is a bounded, observable fallback for complex inputs, not the default execution path. It
inherits reviewed knowledge, adds minimal task-local semantic programs through Codex, composes them dynamically,
and accepts them only after repeatable concrete, abstract, symbolic, provenance, and test evidence.`);

await writeSpecification(43, "primary-markdown-cnl-response", {
  title: "Primary Human-Facing Markdown CNL Response",
  owner: "nll-runtime",
  summary: "Defines NL input to qualitative tagged Markdown CNL output and separate technical execution evidence."
}, await readFile(resolve(root, "tools", "specifications", "DS043-primary-markdown-cnl-response.md"), "utf8"));

await writeSpecification(44, "response-circuit-composition-and-intent-presentation", {
  title: "Response Circuit Composition and Intent-Selected Presentation",
  owner: "nll-circuit",
  summary: "Defines response-circuit DSL, dynamic filtering, grouping, counting, evidence, and presentation styles."
}, await readFile(resolve(root, "tools", "specifications", "DS044-response-circuit-composition.md"), "utf8"));

console.log("Generated DS000 through DS044 from project-owned inputs.");
