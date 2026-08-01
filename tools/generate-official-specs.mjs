#!/usr/bin/env node
import { copyFile, mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const specificationsRoot = resolve(root, "docs", "specs");
await mkdir(specificationsRoot, { recursive: true });

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
  "The evaluation SDK and runner create isolated evaluation agents and random-ID tasks, optionally invoke Codex, execute concrete and declared auxiliary analyses, retain task artifacts, load executable gold modules, calculate semantic classification and runtime metrics, and write Markdown plus .mjs reports.",
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

The CLI must load the executable workflow through the SDK, resolve its dependencies transitively, copy only the required skill folders into a run directory, and generate the context artifacts declared by that workflow. The coding agent must read the installed skill contract and resolved catalogs before editing canonical files.

### Preserved skill instructions

${source}

## Decisions & Questions

### Question #1: Why does the skill have both Markdown and executable forms?

Response: \`SKILL.md\` provides operational guidance to the coding agent; \`workflow.mjs\` provides machine-resolvable specifications, dependencies, tools, edit roots, and phases. Both are loaded from the same skill folder and must remain synchronized.

### Question #2: How does the skill obtain SDK and ontology knowledge?

Response: It consumes run-local \`SDK_CATALOG.md\`, \`ONTOLOGY_CATALOG.md\`, \`CIRCUIT_CATALOG.md\`, \`PROFILE_RESOLUTION.md\`, source outlines, and the exact DS files selected by its workflow. It must use resolved constructors rather than duplicating theory into task code.

## Conclusion

The skill is complete only when its workflow resolves through the real SDK, its edit boundary is respected, and its mandatory deterministic checks pass.`);
}

const metaSkills = [
  [32, "gamp-specs", "GAMP Documentation and Specification Skill", ".agents/skills/gamp-specs/SKILL.md"],
  [33, "review-specs", "Specification Review Skill", ".agents/skills/review-specs/SKILL.md"]
];
for (const [number, slug, title, path] of metaSkills) {
  const source = await readFile(resolve(root, path), "utf8");
  await writeSpecification(number, slug, { title, owner: slug, summary: `Defines the repository-local ${slug} workflow and its documentation contract.` }, `## Introduction

This repository-local skill governs how the official documentation and specifications are maintained.

## Core Content

${source}

## Decisions & Questions

### Question #1: Is this an imported downstream skill?

Response: No. It is retained inside this repository and actively governs the project documentation workflow, so it is represented in the local skill catalog, HTML documentation, AGENTS.md, and DS matrix.

## Conclusion

Changes to this workflow must be synchronized with AGENTS.md, the documentation shell, and the specification matrix.`);
}

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

Runtime resolution must load framework defaults, the selected profile, agent-local ontologies/circuits, and task-local ontologies/circuits/IntentJS/LongTextJS in documented precedence. The context builder must ingest task sources, resolve the selected skill dependency graph, install run-local skill folders, identify exact DS filenames, and generate compact catalogs from live SDK descriptors and resolved ontology/circuit objects. Catalogs are informational and must not replace canonical modules.

Skill workflows may name preserved original contracts with hyphenated references such as \`DS-003\` and additive official contracts with compact references such as \`DS039\`. The context resolver must distinguish both namespaces, expand original domain ranges only for the packs loaded in the active profile, and include every official cross-cutting DS explicitly declared by the resolved skill chain.

The agent folder owns reusable ontologies, circuits, methods, profiles, lexicons, CNL, tests, tasks, and agent-level coding runs. The task folder owns source maps, intent, longtext units and root, task-local ontologies/circuits, tests, runs, and retained results. A source interpretation must not be promoted to default knowledge without an explicit reusable contract and tests.

Only one coding run may hold a write lock for a given target folder. Independent agent/task folders may proceed independently. Deterministic test and execution commands must never acquire the coding-agent adapter implicitly.

## Decisions & Questions

### Question #1: How are local SDK paths made portable for agents outside the default agents directory?

Response: Generated module specifiers are calculated relative to each target file and the explicit project root. The context records a repository-relative project map and gives the coding agent an exact \`node nllAgent.mjs\` invocation.

### Question #2: How is default theory exposed without copying it into ten skills?

Response: Framework SDK modules and pack descriptors remain canonical. Skills declare which catalogs and specifications they require; the context builder derives those artifacts once per run from the resolved runtime.

### Question #3: Why are original and official DS references both supported?

Response: The original twenty files must remain intact and use their established hyphenated IDs, while cross-cutting implementation decisions live in the gap-free official series. Explicitly different reference syntax avoids accidental renumbering and lets each skill request only the contracts it actually needs.

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

A task may override or add a format through \`source/extractors/<extension>.extractor.mjs\`. The module exports \`default\` or \`extractSource\`, receives an immutable object containing path, extension, bytes, and task root, and returns a text string or \`{ text, metadata }\`. The ingestion tool validates this result, segments it deterministically, hashes the entire decoded text, and generates executable \`source-map.mjs\` with stable offsets and metadata.

Extraction failure must never fabricate text. Unsupported formats, invalid modules, encryption, unsupported PDF encodings, and decoding failures produce typed source diagnostics. Scanned PDFs require a task-local OCR/extractor adapter because Node.js built-ins cannot infer glyphs from images. Source IDs remain deterministic under a lexically sorted source-file list.

## Decisions & Questions

### Question #1: Why are PDF offsets based on extracted text rather than file bytes?

Response: PDF text is stored through drawing operators, compression, and font encodings, so a human-visible phrase generally has no contiguous byte interval. Provenance remains replayable by retaining the source digest, extractor identity, decoded text digest, source unit, and decoded interval.

### Question #2: Why may a task-local extractor override a built-in?

Response: Specialized documents may require a known font map, OCR capture, or domain decoder. The explicit task-owned module makes that choice reviewable and reproducible while preserving the common ingestion contract.

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

const articleBuildSkill = await readFile(resolve(root, ".agents", "skills", "article-build", "SKILL.md"), "utf8");
await writeSpecification(40, "article-build", {
  title: "Article Build Skill Contract",
  owner: "article-build",
  summary: "Preserves the repository-local incremental research-article build and validation workflow."
}, `## Introduction

This repository-local skill is independent of nllAgent semantic execution but is owned by the same repository and therefore participates in the local GAMP skill catalog.

## Core Content

${articleBuildSkill}

## Decisions & Questions

### Question #1: Why is this skill documented although it is not an nllAgent coding phase?

Response: GAMP requires one DS and one HTML page for every skill owned by the current project. The documentation records the ownership boundary without installing article-build into nllAgent coding runs or changing its self-contained article workflow.

### Question #2: Do article build manifests violate the semantic JSON prohibition?

Response: No. Article asset and incremental-build manifests describe document build mechanics, not OntologyJS, LongTextJS, IntentJS, CircuitJS, CNL, profile, task, test-oracle, or evaluation semantics. They remain confined to an explicit article root as required by the preserved skill contract.

## Conclusion

The article workflow remains self-contained, incrementally reproducible, and cataloged as a local skill without becoming a dependency of the nllAgent runtime.`);

await copyFile(resolve(root, ".agents", "skills", "gamp-specs", "assets", "specsLoader.html"), resolve(root, "docs", "specsLoader.html"));
await copyFile(resolve(root, ".agents", "skills", "gamp-specs", "assets", "fileSizesCheck.sh"), resolve(root, "fileSizesCheck.sh"));
console.log("Generated DS000 through DS040 and installed canonical GAMP assets.");
