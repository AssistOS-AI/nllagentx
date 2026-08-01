---
id: DS038
title: Domain-Pack Generation and Semantic Module Ownership
status: implemented
owner: nll-ontology
summary: Defines validated generation of the thirteen domain packs and explicit ownership of every ontology symbol.
---

# DS038 — Domain-Pack Generation and Semantic Module Ownership

## Introduction

The thirteen domain specifications share an executable pack shape but retain different ontology modules and capability inventories. This specification defines their deterministic generation boundary without replacing any preserved domain contract.

## Core Content

`tools/generate-domain-packs.mjs` must generate only source-controlled `.mjs` ontology, circuit, CNL, pack, and test modules. `tools/domain-module-allocations.mjs` explicitly assigns every declared concept and event frame to one semantic module. Before writing output, generation must reject an unknown or missing module and every missing, unknown, or multiply assigned symbol. Positional, round-robin, or filename-order assignment is prohibited because module ownership contributes to pack-qualified identity.

Every generated pack must seal all modules, reuse core-language role identities, expose deterministic lexical and semantic recognition signals, declare capabilities, and retain isolated ontology, circuit, intent, and CNL tests. Every named check circuit must declare an explicit applicability concept, emit an evidence-bearing finding, preserve `NOT_APPLICABLE` when relevant terms are absent, and return `UNKNOWN` rather than a false success when the implemented evaluator lacks enough semantic structure. Generation and repair circuits must emit typed CNL frames and pass semantic round-trip comparison.

Shared evaluators are extension points, not a waiver of domain contracts. A capability-specific evaluator or agent-local replacement may use exact runtime kernels and richer role schemas without changing CLI selection. Calibration cases must ground required terms and test satisfied, violated, unknown, conflict, and not-applicable behavior where the capability admits those outcomes.

## Decisions & Questions

### Question #1: Why is symbol ownership an explicit catalog instead of inferred from names?

Response: Domain vocabulary includes names that legitimately cross ordinary keyword boundaries. Explicit ownership is inspectable against each DS appendix and generator validation makes inventory drift fail immediately.

### Question #2: May generated circuits conservatively return UNKNOWN?

Response: Yes, when their evidence does not establish a stronger result. They may not report SATISFIED merely because no violation was found. The preserved domain DS remains authoritative, and specialized calibration progressively strengthens results without weakening uncertainty semantics.

## Conclusion

Generated packs are reproducible executable knowledge modules with stable semantic ownership, conservative result semantics, and replaceable capability-specific evaluation boundaries.
