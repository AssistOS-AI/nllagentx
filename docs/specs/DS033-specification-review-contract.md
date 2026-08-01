---
id: DS033
title: Specification Review and Companion Synchronization
status: implemented
owner: nllAgent maintainers
summary: Defines how project-owned DS contracts are reviewed against implementation and synchronized companions.
---

# DS033 — Specification Review and Companion Synchronization

## Introduction

New user requirements and observed failures can change several contracts at once. This project-owned review contract prevents a local wording patch from leaving code, tests, tutorials, and related DS files inconsistent.

## Core Content

A review must identify every affected DS, implementation area, test surface, generated documentation page, and unresolved decision before editing. It must compare each DS against the current implementation and the new evidence. Contract changes belong in `Core Content`; detailed rationale and alternatives belong in consecutively numbered `Decisions & Questions` entries.

Initial preserved specifications must remain byte-for-byte included in their official DS wrappers. Additive contracts may be strengthened or corrected, but a generator must remain their reproducible source. A behavior-changing review must update code, focused tests, exhaustive test expectations, CLI help, HTML documentation, tutorials, README or AGENTS guidance, and observations requiring human review in the same change set.

The final audit must reread affected DS files in numeric order, verify contiguous numbering, run the original-specification fidelity check, and compare documented examples with retained real execution artifacts. An unresolved multi-option question must remain visible and unimplemented until a choice is selected.

## Decisions & Questions

### Question #1: Why is review policy project-owned rather than copied from a maintenance skill?

Response: The project contract must survive changes to the agent environment. External skills may help apply this method, but this DS and its tests define what nllAgent itself preserves.

## Conclusion

Specification review is complete only when the authoritative contracts and every exposed companion describe the same verified implementation.
