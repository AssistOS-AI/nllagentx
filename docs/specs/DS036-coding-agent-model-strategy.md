---
id: DS036
title: Coding-Agent Adapter and Model Strategy
status: implemented
owner: nll-orchestrator
summary: Defines explicit Codex invocation, adapter boundaries, retained logs, and deterministic post-agent verification.
---

# DS036 — Coding-Agent Adapter and Model Strategy

## Introduction

nllAgent uses a coding agent for semantic authoring and review. This specification defines the model boundary without making model output part of deterministic runtime semantics.

## Core Content

`CodingAgentAdapter` is the extension boundary. `CodexAdapter` is the first implementation and must invoke the locally installed `codex exec` command in direct-editing mode, set the canonical working directory, provide a file-based instruction path, and retain standard output, standard error, final response, start/finish times, and exit status under the run directory.

The CLI may accept `--model <id>` and pass it through without embedding a hard-coded current model name. Absent an explicit model, the local Codex configuration selects its default. This avoids time-sensitive model routing inside the semantic framework. Resume identifiers may be passed only through explicit coding commands.

Coding-agent success means process completion, not semantic acceptance. The workflow must run deterministic import, ontology, anchor, circuit, and test checks separately. Ordinary `run`, `plan`, `query`, source, and inspection commands must never invoke Codex. Evaluation invokes it only with `--invoke-agent` because authoring performance is then part of the measured system.

## Decisions & Questions

### Question #1: Why is there no fixed default model in repository code?

Response: Model availability and recommended defaults change independently of the semantic contracts. The adapter preserves an explicit override while delegating the absent case to the installed Codex configuration.

### Question #2: Why are coding-agent logs not interpreted as semantic results?

Response: Natural-language completion text is not a stable oracle. Acceptance comes from executable artifacts, typed diagnostics, retained semantic results, and deterministic tests.

## Conclusion

The coding-agent layer remains replaceable, explicit, observable, and separated from reproducible semantic execution.
