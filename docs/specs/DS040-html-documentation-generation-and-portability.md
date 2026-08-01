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

`tools/generate-html-docs.mjs` and its project-owned helper modules must generate the complete HTML set, shared navigation, styles, specification loader, and local diagram assets. Generation must not read `.agents/`, a home directory, a CDN, localhost, or a fixed deployment prefix. Every internal link, script import, stylesheet, fetch target, and specification query must be document-relative.

Documentation must provide detailed project structure, skill operation, OntologyJS, IntentJS, LongTextJS, CircuitJS, response-circuit, runtime, CLI, testing, evaluation, and tutorial pages. DSL reference pages must include comprehensive tables of the current exported constructors and fluent operations, their parameters, result types, invariants, and concrete usage. Tables must be generated from or checked against live SDK exports so documentation drift is visible.

Tutorials must be built from retained accepted evaluations and fail closed when evidence is absent. Each natural-language case must show the exact input, instruction, task and agent semantic programs, real coding-agent runs, primary `response.md` Markdown CNL, deterministic replay, and links to technical evidence. Raw `.mjs` assurance projections may be linked from a technical section but must not be presented as the semantic answer.

The documentation verifier must scan HTML, Markdown, CSS, JavaScript, and MJS assets for missing local targets and prohibited root-relative or machine-local URLs. A static-site verification must serve the generated tree under a non-root prefix and request the index, local assets, tutorials, and `specsLoader.html?spec=matrix.md`.

## Decisions & Questions

### Question #1: Why are large tutorial pages permitted?

Response: Exact retained source, semantic code, CNL output, and run evidence can be large, and hiding them would make the tutorial unverifiable. Generator source remains modular; evidence-heavy output is allowed when sections and local navigation keep it usable.

### Question #2: Why must the renderer and loader be project-owned?

Response: Documentation must regenerate when environment-managed maintenance skills are unavailable. Project ownership also makes relative-URL and no-external-dependency guarantees testable in this repository.

## Conclusion

The HTML documentation is complete only when it is detailed, evidence-backed, independently regenerable, and portable under arbitrary URL prefixes.
