# Review Observations and Decision Focus

This file is the user-requested review index for decisions that were not explicit in the original `design-specifications/` set, areas where implementation judgment was required, and topics that merit a later focused discussion. It is not a parallel source of truth. Normative decisions live in the linked files under `docs/specs/`.

## 1. Semantic JSON prohibition versus integration manifests

Decision: the prohibition applies to OntologyJS, LongTextJS, IntentJS, CircuitJS, CNL, agent/task/profile/evaluation semantics, fixtures, gold structures, and snapshots. Existing `.agents/**/skill.json` and `ploinky-skills-manifest.json` files remain because they configure Codex/plugin integration rather than semantic knowledge. Article-build asset and build manifests describe document-build mechanics within an explicit article root. This interpretation is recorded in DS001 Question #2, DS000 Core Content, and DS040 Question #2.

Review focus: confirm whether future marketplace manifests should remain in this repository or be generated outside it. No semantic module currently depends on JSON.

## 2. Binary and PDF source extraction

Decision: DS037 defines and the tools implement a deterministic extraction boundary. Text formats use UTF-8, ordinary unencrypted PDF content streams use the dependency-free PDF extractor, and `source/extractors/<extension>.extractor.mjs` can override or extend decoding per task. Source spans address decoded text; extractor identity and metadata are retained. Unsupported filters, encrypted documents, scanned images, and invalid adapters produce typed diagnostics rather than fabricated text.

Review focus: the built-in PDF implementation intentionally covers literal and hexadecimal text operands in unfiltered or Flate-compressed streams. Select a task-local OCR/font-map adapter when a corpus contains scanned pages or custom encodings, and retain that adapter with the task for replay.

## 3. Mandatory `core-language` pack

Decision: every profile loads `core-language`, including `--only` resolution. The original specifications assumed shared language constructors but did not define a separate pack. DS034 makes it orthogonal to `core-commonsense`, preventing minimal profiles from silently inheriting world facts.

Review focus: inspect the current common constructor inventory before stabilizing version `2.0.0`; additions are safe, but renaming shared role identities would affect every generated pack.

## 4. Explicit agent/task directories outside default workspace roots

Decision: `--agent-dir` and `--task-dir` may name folders outside `agents/<name>` and `<agent>/tasks/<id>`. Generated task, source-map, context, and run modules calculate imports relative to the explicit project root. DS035 defines this behavior.

Review focus: determine whether explicit folders should later carry a small project-binding module for relocatable archival replay. The current modules are relocatable together with the repository but intentionally bind to the selected SDK through relative imports.

## 5. Repeated fluent names across SDKs

Decision: DS039 defines the live SDK inventory and tooling. Separate DSL entry points retain familiar names such as `usePack`. The broad `framework/sdk/index.mjs` exports each DSL as a namespace (`ontologyDsl`, `intentDsl`, `agentDsl`, and `evaluationDsl`) so callers can access every primitive without inventing renamed semantic vocabulary. `sdk check` reports repeated names and `sdk usage` directs coding skills to narrow imports.

Review focus: decide whether a future major version should remove ambiguous star exports and expose only namespaces at the root. Existing domain and task modules import narrow DSL entry points and are unaffected.

## 6. Coding-agent model selection

Decision: the Codex adapter accepts `--model` but does not hard-code a model identifier. If absent, the installed Codex configuration chooses its default. This avoids embedding a time-sensitive routing decision in the semantic framework. DS036 records the adapter boundary.

Review focus: if evaluation comparisons require fixed model routing, declare the model in each suite and retain it as evaluation metadata rather than changing the global runtime default.

## 7. Symbolic decision-table exclusivity

Decision: truth-facet rows derived from the same operand are mutually exclusive. They form an exactly-one group only when `isTrue`, `isFalse`, `isUnknown`, and `isConflict` are all declared; an incomplete table uses at-most-one constraints so the omitted four-valued case remains visible. The facility table therefore reports four paths, prunes three contradictory partial assignments, and exposes the missing conflict row as `alarm-before-opening.no-row` rather than silently reinterpreting it.

Review focus: decide whether the facility example should add an explicit `isConflict` row and a domain-specific conflict finding. The current missing-row path intentionally demonstrates that symbolic coverage can reveal a non-exhaustive decision table.

## 8. All-compatible planning and `NOT_APPLICABLE`

Decision: all-compatible means every circuit whose declared ontology/capability prerequisites can be satisfied is scheduled. A circuit may still return `NOT_APPLICABLE` when the store has no relevant task instances. This preserves the original rule that silence must not make the planner run almost nothing.

Review focus: many generated domain circuits currently use ontology availability as the planning prerequisite and instance presence as an execution applicability test. Consider adding a first-class evidence-demand requirement if large profiles need cheaper pre-execution filtering. Such a change must preserve explanation of skipped checks.

## 9. Domain-circuit depth and calibration

Decision: every specified pack, ontology module, named capability circuit, CNL surface, signal set, and isolated test family is executable. Shared structural evaluators provide evidence-aware baseline behavior; exact algorithms such as rational arithmetic, finite constraints, Boolean solving, Allen relations, fixed points, automata, symbolic exploration, rewriting, slicing, and factor inference are implemented separately and available to specialized circuits.

Review focus: this is the highest-value semantic review area. Named school-domain circuits should accumulate capability-specific calibration cases and connect more of the exact kernels to domain terms. The current architecture deliberately keeps evaluators replaceable, but a generic structurally correct result is not evidence that every nuanced domain rule has been calibrated. Review DS009 through DS021 alongside `framework/packs/shared/check-runtime.mjs` and each pack's tests.

## 10. Evaluation baseline interpretation

Decision: `school-smoke` is an executable infrastructure suite, not a claimed quality benchmark. Without `--invoke-agent`, it measures isolated creation, replay, retention, anchor accounting, and runtime plumbing. With `--invoke-agent`, its declared modes request IntentJS and LongTextJS authoring.

Review focus: add held-out executable gold modules and capability-specific semantic metrics before using the suite to compare models or pack quality. Fixed model selection, corpus licensing, and target thresholds require explicit suite decisions.

## 11. Official DS numbering and preservation

Decision: the official GAMP sequence starts with mandatory DS000 vision and DS001 coding style. The original DS-000 through DS-019 are therefore embedded verbatim in DS002 through DS021, with source markers and additive implementation alignment. A verification command checks that each full source string remains present.

Review focus: always edit the original source file first when changing an inherited contract, regenerate the official set, and verify byte-for-byte inclusion. Do not hand-edit the embedded original block.

## 12. Large preserved specification files

Decision: DS001's file-size thresholds apply to cohesive executable source. Official DS files containing verbatim original specifications are allowed to exceed them because splitting or reflowing those blocks would violate source fidelity. The pre-existing self-contained article-build implementation also contains two warning-sized modules (`skill.mjs` and `bibliography.mjs`); this nllAgent implementation did not rewrite or split that user-owned workflow.

Review focus: generated HTML and nllAgent executable source should still be decomposed normally. `fileSizesCheck.sh` reports the preserved DS/context long lines and those two article-build modules; it does not automatically approve future growth. Review article-build decomposition separately if that skill is next modified.

## 13. GAMP helper path correction

Decision: the bundled GAMP scripts originally assumed `skills/gamp-specs/`, while this repository stores the skill under `.agents/skills/gamp-specs/`. Their repository-root calculation was corrected by one parent level, and the matrix generator now emits the required `/specsLoader.html?spec=...` links.

Review focus: if the skill is packaged into a different depth, replace depth-based root discovery with upward marker discovery. The current correction is exact for this repository layout.

## 14. Semantic ownership inside generated ontology modules

Decision: DS038 defines explicit module ownership for each generated concept and frame in `tools/domain-module-allocations.mjs`. The generator rejects missing modules, missing symbols, unknown symbols, and duplicate assignments before it writes a pack. This replaces the earlier positional distribution, which preserved identities but could place a concept in a semantically unrelated module.

Review focus: treat the allocation catalog as part of pack review whenever the original domain appendix evolves. File placement can change only with an explicit migration decision because it is embedded in pack-qualified semantic identities.

## 15. Skill tools and mixed original/official DS context

Decision: executable nll skill workflows may reference preserved originals as `DS-003` and additive official contracts as `DS039`. The context resolver distinguishes these namespaces, filters original domain ranges to loaded packs, and includes the official cross-cutting DS files declared by the selected skill. A deterministic test verifies that every workflow dependency resolves and every declared `nllAgent` tool maps to an implemented CLI command.

Review focus: keep original hyphenated IDs and official compact IDs visibly distinct when adding future specifications. A new cross-cutting SDK, source, folder, or pack-generation decision should be added to the affected workflow instead of copied into every `SKILL.md`.
