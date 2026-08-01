---
id: DS034
title: Core Language Ontology Pack
status: implemented
owner: nll-ontology
summary: Defines the mandatory common semantic vocabulary that all profiles and task-local programs may import.
---

# DS034 — Core Language Ontology Pack

## Introduction

Every load profile requires a shared semantic vocabulary, yet the original domain series starts with common-sense knowledge rather than a separate language pack. This orthogonal specification defines the implemented `core-language` boundary.

## Core Content

`framework/packs/core-language` must provide pack-qualified constructors for general entities, events, states, propositions, claims, documents, mentions, contexts, values, quantities, and common semantic roles. Domain packs must import these constructors instead of redefining shared role identities. The pack must provide a grounding-integrity circuit, intent signals, a sealed pack descriptor, and isolated executable tests.

The pack is mandatory even when `--only` is used. It is language-semantic infrastructure rather than broad world knowledge; loading it does not license unsupported real-world facts. Task LongTextJS must continue to distinguish source claims, ontology facts, and coverage witnesses.

## Decisions & Questions

### Question #1: Why is core-language separate from core-commonsense?

Response: Shared term and role vocabulary is required to connect DSLs and domain packs, while common-sense facts and checks are optional knowledge selected by profiles. Combining them would make minimal execution silently inherit broader world assumptions.

### Question #2: Why is this a new DS rather than an amendment hidden in a domain DS?

Response: The dependency is orthogonal to every domain pack and every skill. A separate contract prevents duplicated definitions and makes the mandatory load rule explicit.

## Conclusion

All profiles and task programs may rely on a stable core language without implicitly loading common-sense or specialized domain claims.
