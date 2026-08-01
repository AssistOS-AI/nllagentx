---
id: DS000
title: nllAgent Vision and System Boundary
status: implemented
owner: nllAgent maintainers
summary: Defines nllAgent as an executable semantic-program workbench and fixes its architectural boundaries.
---

# DS000 — nllAgent Vision and System Boundary

## Introduction

nllAgent turns natural-language source material into executable semantic programs and applies reusable semantic circuits to those programs. The repository is a production-oriented experimental system: its semantic artifacts are ordinary JavaScript modules, while their semantic effects are constrained by the OntologyJS, LongTextJS, IntentJS, CircuitJS, CNL, agent, and evaluation SDK contracts.

## Core Content

The system must preserve source provenance, explicit uncertainty, alternative interpretations, modality, polarity, scope, and coverage. It must distinguish a claim made by a source from a fact asserted by an ontology pack. Semantic artifacts must remain executable `.mjs` modules; JSON and TypeScript must not be used as substitute semantic languages. Integration manifests that configure external tooling are outside that prohibition.

Execution must build one logical `SemanticStore`, resolve default, profile, agent-local, and task-local knowledge in a documented precedence order, plan circuits by declared requirements and provisions, execute compatible circuits deterministically, and retain findings, CNL frames, plans, traces, diagnostics, and auxiliary assurance results. Coding-agent invocation is an explicit authoring or review operation; ordinary semantic execution must not invoke a coding agent.

The project must remain dependency-free at runtime and must expose its operations through the `nllAgent.mjs` CLI. Agents and tasks are directory-owned units. An agent directory owns reusable semantic extensions; a task directory owns sources, IntentJS, LongTextJS, local extensions, tests, coding runs, and results. Both name-based and explicit-folder resolution are required.

The original `design-specifications/DS-000` through `DS-019` remain preserved source contracts. Their official copies are embedded verbatim in DS002 through DS021. DS022 onward defines the executable skill catalog and orthogonal implementation contracts discovered during construction.

## Decisions & Questions

### Question #1: Why are executable JavaScript DSLs the semantic source of truth?

Response: Full JavaScript provides composition, abstraction, and direct SDK use without introducing a second serialization language. Stable semantic identities, sealed builders, transactions, and validation preserve the required discipline at the semantic boundary.

### Question #2: What is the boundary between deterministic runtime work and coding-agent work?

Response: Runtime commands import and execute existing artifacts. Only explicit `code ...` commands and evaluation runs requested with `--invoke-agent` may start Codex through the adapter interface.

### Question #3: Where are uncertain implementation decisions recorded?

Response: Normative rationale resides in the affected DS file. The user-requested `observations.md` is a review index that links uncertainties and follow-up topics back to those authoritative entries.

## Conclusion

nllAgent is complete only when semantic modules, planning, execution, tests, evaluation, documentation, and retained evidence operate as one reproducible system without replacing semantic code with inert data.
