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

A long-running authoring or evaluation process must observe changes to transitive agent/task modules made by a coding phase in the same process. Fresh import applies to the entire local semantic dependency graph below the resolved agent ownership root, not only to its entry module. Framework SDK/runtime modules retain stable process identities so constructors and `instanceof` boundaries are not duplicated. Freshness keys must be derived from local file metadata and covered by a regression that rewrites an entry module and one imported dependency between two resolutions.

Skill workflows may name preserved original contracts with hyphenated references such as `DS-003` and additive official contracts with compact references such as `DS039`. The context resolver must distinguish both namespaces, expand original domain ranges only for the packs loaded in the active profile, and include every official cross-cutting DS explicitly declared by the resolved skill chain.

The agent folder owns reusable ontologies, circuits, methods, profiles, lexicons, CNL, tests, tasks, and agent-level coding runs. The task folder owns source maps, intent, longtext units and root, task-local ontologies/circuits, tests, runs, and retained results. A source interpretation must not be promoted to default knowledge without an explicit reusable contract and tests.

Natural-language semantic authoring is an explicit two-level coding workflow. Agent-level authoring reads an agent brief and may create reusable OntologyJS, CircuitJS, CNL, profile, and test modules. Task-level authoring reads the task instruction plus decoded sources and may create task-owned IntentJS, LongTextJS, local ontology or circuit extensions, and tests. In both cases the context builder supplies the installed skill chain and live SDK, ontology, circuit, profile, source, and specification catalogs; it does not synthesize the semantic programs itself.

An evaluation suite that claims coding-agent authoring must retain the brief, task instruction, exact source text, every generated canonical module, installed run-local skills, generated context, process logs, final response, deterministic verification results, and concrete or symbolic execution results. A fixture copied into place by the suite is not evidence that the coding agent learned the semantic program from natural language.

Only one coding run may hold a write lock for a given target folder. Independent agent/task folders may proceed independently. Deterministic test and execution commands must never acquire the coding-agent adapter implicitly.

## Decisions & Questions

### Question #1: How are local SDK paths made portable for agents outside the default agents directory?

Response: Generated module specifiers are calculated relative to each target file and the explicit project root. The context records a repository-relative project map and gives the coding agent an exact `node nllAgent.mjs` invocation.

### Question #2: How is default theory exposed without copying it into ten skills?

Response: Framework SDK modules and pack descriptors remain canonical. Skills declare which catalogs and specifications they require; the context builder derives those artifacts once per run from the resolved runtime.

### Question #3: Why are original and official DS references both supported?

Response: The original twenty files must remain intact and use their established hyphenated IDs, while cross-cutting implementation decisions live in the gap-free official series. Explicitly different reference syntax avoids accidental renumbering and lets each skill request only the contracts it actually needs.

### Question #4: Why version transitive local modules but not framework modules?

Response: Coding phases edit the agent/task dependency graph while an evaluator remains alive, so every local dependency must be fresh. Duplicating framework constructors would instead split semantic class identity inside one runtime. The module hook therefore versions only files below the resolved ownership root.

## Conclusion

Folder ownership, dependency order, and generated context are executable contracts rather than prompt conventions.
