---
id: DS040
title: Project-Owned HTML Documentation Generation and Portability
status: implemented
owner: nllAgent maintainers
summary: Defines detailed generated HTML, project-owned assets, relative URLs, and retained-example fidelity.
---

# DS040 — Project-Owned HTML Documentation Generation and Portability

## Introduction

The HTML documentation is a generated product interface. It must explain the executable system from project-owned sources and remain portable below any hosting prefix.

## Core Content

`tools/generate-html-docs.mjs` and its project-owned helper modules must generate the complete HTML set, shared navigation, styles, specification loader, and local interactive assets. Generation must not read `.agents/`, a home directory, a CDN, localhost, or a fixed deployment prefix. Every internal link, script import, stylesheet, fetch target, and specification query must be document-relative.

Documentation must provide detailed project structure, skill operation, OntologyJS, IntentJS, LongTextJS, CircuitJS, response-circuit, runtime, CLI, testing, evaluation, and tutorial pages. DSL reference pages must include comprehensive tables of the current exported constructors and fluent operations, their parameters, result types, invariants, and concrete usage. Tables must be generated from or checked against live SDK exports so documentation drift is visible.

The pack chapter must enumerate live predefined knowledge for every registered domain: ontology modules, concepts and sorts, roles, relations, stable facts/laws, lexical and semantic signals, capabilities, circuit requirements/provisions, possible statuses, and declared assurance. The circuit chapters must expose capability closure, provider ordering, stage dependency scheduling, concrete truth execution, auxiliary interpretations, response-stage dataflow, local composition, and retained inspection artifacts through explicit stepwise explanations rather than high-level visual abstractions.

Tutorials must be built from retained accepted evaluations and fail closed when evidence is absent. Each natural-language case must show the exact input, instruction, task and agent semantic programs, and primary `response.md` Markdown CNL. Real coding-agent runs, deterministic replay, metrics, raw `.mjs` assurance projections, and other technical evidence remain retained and reachable from dedicated workflow, result, and evaluation pages; they must not be presented as the semantic answer or as competing tutorial stages.

Each retained tutorial must provide an Input / Intermediate / Output artifact explorer. Input contains only natural-language authoring material: the exact reusable agent brief when that case authors an agent, followed by the exact task instruction and task source text. A case that uses a pre-existing fixed agent must say so directly instead of presenting agent code as task input. Intermediate contains the executable task declaration, IntentJS, LongTextJS, agent- or task-owned OntologyJS, CircuitJS, response policy, generated facade, and tests that materially explain how the input is interpreted. Output contains the single public Markdown CNL response; logs, assurance projections, state exploration, metrics, and raw findings belong to dedicated workflow or result pages rather than separate tutorial stories.

Tutorial prose must explain the concrete case rather than describe documentation pedagogy. It must identify the behavior requested by the agent brief and by the task instruction, explain which reusable agent modules implement the former, trace decisive source clauses into IntentJS selection and LongTextJS claims or coverage, explain why the applicable circuit reaches the observed result, and interpret what the retained Markdown CNL says about that exact source. Generic sections such as “What a programmer should learn” or stage-contract tables that merely restate Input / Intermediate / Output are prohibited. The explanation must name actual constructs, claims, rules, decisions, and output evidence visible in the adjacent files.

A stage tab lists only files belonging to that semantic stage, one shared viewer materializes only the selected file, and the first input is open by default. Visible labels must start with the short semantic owner `agent/` or `task/` and continue relative to that owner; they must not repeat evaluation prefixes, random task identifiers, or repository roots. A synthetic natural-language instruction uses `task/task-instruction.txt`, and the public answer uses `task/results/response.md`. The complete repository-relative identity remains retained as inert metadata. File viewers must wrap long lines and identifiers within the available viewport and must not introduce a horizontal scrollbar. File content is generated from retained artifacts without summaries or fabricated examples, and the explorer must work under the same document-relative static-site boundary.

Every runnable CLI invocation displayed in a documentation code block must be immediately preceded by a shell comment that explains both its observable action and why the reader would run it at that point. The comment is explanatory documentation and is not part of the copied command. Multiple commands in one block each require their own comment; a paragraph after the block is not a substitute.

The documentation shell must use the available viewport rather than imposing a narrow fixed reading column. Outer margins and panel padding must remain compact, prose and callouts may use the full content width, and artifact inventory width must leave most horizontal space to the selected file. Responsive collapse still applies when the inventory and viewer no longer fit side by side.

Technical process pages must explain sequences as explicit steps or Input / Action / Output tables grounded in real files and observable results. Abstract flow, state, class, and sequence diagrams must not replace that narrative. The primary Reference menu must expose one specification-browser entry rather than duplicating individual DS links already available through the matrix.

The documentation verifier must scan HTML, Markdown, CSS, JavaScript, and MJS assets for missing local targets and prohibited root-relative or machine-local URLs. A static-site verification must serve the generated tree under a non-root prefix and request the index, local assets, tutorials, and `specsLoader.html?spec=matrix.md`.

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

Response: An example such as `import ... from "./framework/..."` describes task code and is not executed by the
documentation page. Real `<script>` imports and markup URLs are deployment dependencies and must resolve. Parsing
those contexts separately avoids both false failures and skipped runtime assets.

### Question #5: Why do artifact labels retain `agent/` or `task/` while omitting repository prefixes?

Response: The owner prefix answers the important question—whether a file teaches reusable agent behavior or interprets one task—without repeating evaluation paths and random identifiers on every row. Keeping the complete path in inert metadata preserves exact provenance. A wide, compact shell exposes more code and tabular information before wrapping; wrapping remains mandatory inside file viewers for content that still exceeds the viewport.

### Question #6: Why do tutorials exclude assurance stories and process diagrams?

Response: A programmer must first be able to trace the public contract from exact text input through inspectable semantic programs to one Markdown CNL output. Abstract/symbolic assurance, coding-process logs, metrics, and internal state remain valuable technical evidence, but presenting them as peer tutorial narratives obscures that contract. Dedicated workflow and result chapters retain those details, while explicit step tables explain technical processes without requiring readers to decode an abstract diagram.

### Question #7: Why are generic learning-objective sections prohibited?

Response: A heading that says what a programmer should learn does not perform the explanation. Case-specific prose must connect visible source clauses to visible DSL constructs, circuit decisions, and the retained answer, so the tutorial remains useful even when read without prior knowledge of the evaluation harness. This also makes documentation drift testable against real artifacts instead of against reusable meta-text.

## Conclusion

The HTML documentation is complete only when it is detailed, evidence-backed, independently regenerable, and portable under arbitrary URL prefixes.
