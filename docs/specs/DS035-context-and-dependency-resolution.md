---
id: DS035
title: Agent, Task, Context, and Dependency Resolution
status: implemented
owner: nll-orchestrator
summary: Defines folder-based ownership and non-redundant SDK, ontology, source, specification, and skill context resolution.
---

# DS035 — Agent, Task, Context, and Dependency Resolution

## Introduction

This specification formalizes the user-required notion that agents and tasks are folders and that coding skills must obtain real SDK and ontology dependencies without copied theory.

## Core Content

Every semantic command must resolve an agent from `--agent <name-or-path>` or `--agent-dir <path>`. Task commands must additionally resolve `--task <id-or-path>` or `--task-dir <path>`. Name resolution uses `agents/<name>` and `<agent>/tasks/<id>`; explicit paths may be outside those defaults while still importing the selected project SDK.

Runtime resolution must load framework defaults, the selected profile, agent-local ontologies/circuits, and task-local ontologies/circuits/IntentJS/LongTextJS in documented precedence. The context builder must ingest task sources, resolve the selected skill dependency graph, install run-local skill folders, identify exact DS filenames, and generate compact catalogs from live SDK descriptors and resolved ontology/circuit objects. Catalogs are informational and must not replace canonical modules.

Skill workflows may name preserved original contracts with hyphenated references such as `DS-003` and additive official contracts with compact references such as `DS039`. The context resolver must distinguish both namespaces, expand original domain ranges only for the packs loaded in the active profile, and include every official cross-cutting DS explicitly declared by the resolved skill chain.

The agent folder owns reusable ontologies, circuits, methods, profiles, lexicons, CNL, tests, tasks, and agent-level coding runs. The task folder owns source maps, intent, longtext units and root, task-local ontologies/circuits, tests, runs, and retained results. A source interpretation must not be promoted to default knowledge without an explicit reusable contract and tests.

Only one coding run may hold a write lock for a given target folder. Independent agent/task folders may proceed independently. Deterministic test and execution commands must never acquire the coding-agent adapter implicitly.

## Decisions & Questions

### Question #1: How are local SDK paths made portable for agents outside the default agents directory?

Response: Generated module specifiers are calculated relative to each target file and the explicit project root. The context records a repository-relative project map and gives the coding agent an exact `node nllAgent.mjs` invocation.

### Question #2: How is default theory exposed without copying it into ten skills?

Response: Framework SDK modules and pack descriptors remain canonical. Skills declare which catalogs and specifications they require; the context builder derives those artifacts once per run from the resolved runtime.

### Question #3: Why are original and official DS references both supported?

Response: The original twenty files must remain intact and use their established hyphenated IDs, while cross-cutting implementation decisions live in the gap-free official series. Explicitly different reference syntax avoids accidental renumbering and lets each skill request only the contracts it actually needs.

## Conclusion

Folder ownership, dependency order, and generated context are executable contracts rather than prompt conventions.
