---
id: DS032
title: Documentation, Specification, and Tooling Ownership Boundary
status: implemented
owner: nllAgent maintainers
summary: Separates project-owned documentation generators and contracts from environment-managed agent skills.
---

# DS032 — Documentation, Specification, and Tooling Ownership Boundary

## Introduction

nllAgent may be maintained with environment-provided coding skills, but those skills are not project source and may be upgraded or removed independently. This specification makes the ownership boundary explicit.

## Core Content

Project code, tests, DS files, documentation sources, generated HTML, templates, link verifiers, and static-site checks must be owned under this repository outside `.agents/`. No project generator, runtime module, test, CLI command, or published document may require a file under `.agents/` in order to run or regenerate the project.

Environment-managed skills may be read and followed during a maintenance session. Their source must not be edited as part of nllAgent implementation, embedded wholesale into official DS files, copied into the project skill catalog, or presented as an nllAgent runtime capability. The project-owned coding skills are the executable `nll-skills/` modules installed into coding-agent runs.

Official DS generation must preserve the original `design-specifications/` files, add project-owned implementation contracts, and remain reproducible when `.agents/` is absent. HTML generation must use project-owned templates and assets. Documentation navigation may describe the role of external maintenance tooling only as an environment boundary, never as a project-owned skill page.

## Decisions & Questions

### Question #1: Why may an external skill guide work without becoming project source?

Response: A maintenance process can use tools supplied by its environment while the resulting code and contracts remain self-contained. Treating the tool itself as project input would make regeneration depend on mutable workstation state.

### Question #2: Which skills are part of the product contract?

Response: Only the ten visible executable skills under `nll-skills/`. They are installed into run-local coding contexts and are tested against the local SDK. Environment-maintenance skills are outside this catalog.

## Conclusion

nllAgent remains regenerable, testable, and understandable from project-owned files alone.
