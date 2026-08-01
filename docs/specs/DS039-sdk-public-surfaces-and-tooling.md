---
id: DS039
title: SDK Public Surfaces, Usage Catalog, and Skill Tooling
status: implemented
owner: nll-sdk
summary: Defines executable SDK export inventories and the check, usage, and catalog commands consumed by coding skills.
---

# DS039 — SDK Public Surfaces, Usage Catalog, and Skill Tooling

## Introduction

Coding skills need actual local SDK dependencies and concise usage information, not copied theory or guessed imports. This specification defines the executable documentation boundary shared by the SDK, context builder, CLI, and skill workflows.

## Core Content

`framework/sdk/public-api.mjs` must import and inventory the core, ontology, longtext, circuit, CNL, intent, agent, evaluation, and analysis surfaces. Each surface records its canonical module path, purpose, sorted live exports, and a minimal executable usage example. The inventory is derived from imported namespaces so a removed or renamed export becomes visible in the next check and generated context.

`nllAgent sdk check` validates that each surface is non-empty and every public export name is a valid ECMAScript binding, then reports repeated names across narrow surfaces. Repeated fluent names are informational because callers import the narrow module; the broad SDK root exposes explicit DSL namespaces where ambiguity exists. `nllAgent sdk usage [--surface <id>]` renders module paths, exports, and examples from this canonical inventory. `catalog sdk` combines the surface inventory with registered semantic constructor descriptors.

Every tool declared in a skill's executable `workflow.mjs` must correspond to an implemented CLI command. The integration suite must exercise the SDK check, filtered usage, and `plan show` commands through the same CLI router used by coding runs. Run-local `SDK_CATALOG.md` is generated from these live sources and remains informational; skills import SDK modules rather than copying catalog text into semantic artifacts.

## Decisions & Questions

### Question #1: Why are repeated export names not SDK-check failures?

Response: OntologyJS, CircuitJS, IntentJS, and agent contracts intentionally share vocabulary such as `capability`, `guarantee`, or `usePack`. Narrow imports retain the intended meaning, while namespace exports make broad-root use explicit.

### Question #2: Why keep examples in an executable SDK catalog?

Response: It gives coding skills one versioned local source for import paths and composition shape. HTML and run-local catalogs can render that source without duplicating API theory in ten skill files.

## Conclusion

SDK discovery is a tested executable contract: skills can inspect live exports, select a narrow surface, and invoke only commands that the local CLI implements.
