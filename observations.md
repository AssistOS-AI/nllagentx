# Review Observations and Decision Focus

This file is the user-requested review index for decisions that were not explicit in the original `design-specifications/` set, areas where implementation judgment was required, and topics that merit a later focused discussion. It is not a parallel source of truth. Normative decisions live in the linked files under `docs/specs/`.

## 1. Semantic JSON prohibition versus integration manifests

Decision: the prohibition applies to OntologyJS, LongTextJS, IntentJS, semantic CircuitJS, response circuits, CNL, agent/task/profile/evaluation semantics, fixtures, gold structures, and snapshots. The project has no semantic JSON format. Environment-owned Codex/plugin configuration is outside the project boundary and is neither copied into documentation nor required by a generator, runtime command, test or published page. This interpretation is recorded in DS001 Question #2, DS000 Core Content, DS032 and DS040.

Review focus: keep future integration manifests outside the semantic artifact model. No semantic module currently depends on JSON.

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

Decision: `school-smoke` is an executable infrastructure suite, not a claimed quality benchmark. Without `--invoke-agent`, it measures isolated creation, replay, retention, anchor accounting, and runtime plumbing. Its historical authoring mode covers task IntentJS and LongTextJS only; it does not prove that Codex learned a reusable agent ontology and circuits from a natural-language brief. The `agentic-nl-e2e` suite is the stronger acceptance path for that claim.

Review focus: add held-out executable gold modules and capability-specific semantic metrics before using the suite to compare models or pack quality. Fixed model selection, corpus licensing, and target thresholds require explicit suite decisions.

## 11. Official DS numbering and preservation

Decision: the official GAMP sequence starts with mandatory DS000 vision and DS001 coding style. The original DS-000 through DS-019 are therefore embedded verbatim in DS002 through DS021, with source markers and additive implementation alignment. A verification command checks that each full source string remains present.

Review focus: always edit the original source file first when changing an inherited contract, regenerate the official set, and verify byte-for-byte inclusion. Do not hand-edit the embedded original block.

## 12. Large preserved specification files

Decision: DS001's file-size thresholds apply to cohesive executable source. Official DS files containing verbatim original specifications are allowed to exceed them because splitting or reflowing those blocks would violate source fidelity. Project-owned HTML generation is split across focused navigation, style, file-helper, DSL-reference, evaluation-case and page-composition modules.

Review focus: generated HTML and nllAgent executable source should still be decomposed normally. Preserved DS/context long lines do not automatically approve future executable growth.

## 13. Project-owned specification and documentation tooling

Decision: official specification generation, matrix generation, HTML generation, the Markdown specification loader, the diagram renderer, link verification and static-site verification are all project-owned under `tools/`. They do not read environment-managed skill folders. The matrix generator emits document-relative `specsLoader.html?spec=...` links so documentation remains valid below an arbitrary URL prefix.

Review focus: preserve this portability boundary when adding new documentation tooling; no generated page may require a home-directory path, localhost, an origin-root path or a CDN.

## 14. Semantic ownership inside generated ontology modules

Decision: DS038 defines explicit module ownership for each generated concept and frame in `tools/domain-module-allocations.mjs`. The generator rejects missing modules, missing symbols, unknown symbols, and duplicate assignments before it writes a pack. This replaces the earlier positional distribution, which preserved identities but could place a concept in a semantically unrelated module.

Review focus: treat the allocation catalog as part of pack review whenever the original domain appendix evolves. File placement can change only with an explicit migration decision because it is embedded in pack-qualified semantic identities.

## 15. Skill tools and mixed original/official DS context

Decision: executable nll skill workflows may reference preserved originals as `DS-003` and additive official contracts as `DS039`. The context resolver distinguishes these namespaces, filters original domain ranges to loaded packs, and includes the official cross-cutting DS files declared by the selected skill. A deterministic test verifies that every workflow dependency resolves and every declared `nllAgent` tool maps to an implemented CLI command.

Review focus: keep original hyphenated IDs and official compact IDs visibly distinct when adding future specifications. A new cross-cutting SDK, source, folder, or pack-generation decision should be added to the affected workflow instead of copied into every `SKILL.md`.

## 16. Natural-language authoring versus deterministic ingestion

Decision: DS041 now makes the intended boundary explicit. Source ingestion only decodes bytes, establishes stable source units and offsets, and exposes non-semantic outlines. A real coding-agent process, initially Codex with the resolved `nll-*` skills, authors reusable agent OntologyJS/CircuitJS and task-owned IntentJS/LongTextJS from natural-language inputs. Ordinary planning and execution then reuse those programs without a model call. No deterministic keyword extractor may silently replace the coding-agent authoring claim.

Review focus: inspect the retained `agentic-nl-e2e` Codex runs and generated files rather than accepting report prose. The most important follow-up question is how much reusable rule generalization a single agent brief should demand before ontology/circuit review becomes a separate approval workflow. Current acceptance requires four distinct behaviors, exact findings or CNL outputs, phase-specific checks, and model-free replay; it does not claim that four cases measure broad language understanding.

## 17. Strict evaluation oracles and retained iterations

Decision: an evaluation case with declared expected findings rejects both missing findings and additional material
`SATISFIED`, `VIOLATED`, `UNKNOWN`, or `CONFLICT` findings. Additional `NOT_APPLICABLE` findings remain permitted
because the all-compatible planner deliberately executes semantically compatible circuits before instance-level
applicability is known. A suite may opt into a partial oracle explicitly. Before a new suite invocation overwrites
the canonical report set, the runner archives the previous executable reports; task folders, coding runs, failures,
and generated programs are never removed by evaluation reruns.

Review focus: decide case by case whether a benchmark really has a complete oracle before leaving strict mode
enabled. A partial oracle is useful for exploratory corpora, but it must not be used to hide unintended material
findings in acceptance evaluations.

## 18. Adaptive task-local authoring and promotion boundary

Decision: DS042 adds an explicit `analyze --author-adaptive` mode for complex tasks whose inherited framework,
profile, and agent knowledge cannot express the requested operation. Codex authors or audits task IntentJS,
OntologyJS, LongTextJS, CircuitJS, and focused tests, while the planner composes inherited and task-local providers
dynamically. Acceptance defaults to concrete output plus convergent abstract and non-truncated symbolic evidence,
and a Codex review is mandatory even after an initially successful execution. The mode never promotes task code
into the reusable agent automatically, never accepts unknown-only output unless explicitly requested, and never
turns the composed plan into an opaque monolithic circuit.

The retained cold-chain case adds a deliberately stronger evaluation-only oracle: task-local OntologyJS and
CircuitJS must have been absent initially and generated by successful Codex phases; a selected non-core circuit
must violate the unsupported release conclusion; its evidence must cite both the expired calibration and the
missing receiving acknowledgement; and abstract, symbolic, and replay checks must pass. These domain phrases are
not hard-coded into the generic adaptive runtime.

The first retained adaptive attempt also exposed a naming trap: the historical `minimal-core` profile loads
`logic-basic` and `reasoning-errors` in addition to `core-language`. The real isolation case therefore uses an
agent-local `adaptive-core-only` profile. The interrupted attempt and its catalogs remain retained instead of
being rewritten as a success.

Review focus: decide when a repeatedly successful task-local ontology or circuit has enough independent
calibration cases to be promoted to an agent. The implementation intentionally records that possibility without
choosing a numeric promotion threshold. Also review whether particular legitimate indeterminate workloads should
declare `--adaptive-allow-unknown` in a saved executable profile rather than as a one-off CLI option.

## 19. Evaluation-backed tutorial generation fails closed

Decision: the HTML generator throws when any of the four DS041 tutorial results or the accepted DS042 adaptive
record is absent. It no longer emits a page that asks the documentation reader to run an evaluation. This makes a
successful documentation build evidence that the displayed semantic programs, Codex logs, execution artifacts,
and replay results actually exist. The generator still refuses to synthesize example output.

Review focus: retained evaluations make the documentation build intentionally dependent on repository artifacts.
If distribution size later requires omitting full run logs, define a signed or content-addressed evidence bundle
before weakening this fail-closed rule.

## 20. Relative interactive assets and complete evidence size

Decision: generated HTML uses only project-owned document-relative assets. Process diagrams were removed from the
published system explanation because they obscured the text-input/program/CNL story. The remaining interactive
artifact browser is loaded from `docs/assets/artifact-browser.mjs`, has no package or network dependency, and keeps
every displayed retained file in an inert local template. The link verifier scans `.mjs` assets and static imports
as well as HTML, Markdown, CSS, and ordinary JavaScript. No generated documentation resource assumes an origin
root, localhost, a workspace mount, or an external CDN.

The four strict tutorials and the adaptive tutorial intentionally exceed ordinary source-size thresholds because
they reproduce complete input, semantic programs, assurance projections, and retained results rather than
summaries. Run-local SDK catalogs are likewise immutable context evidence. The executable documentation logic was
split into focused file helpers, evaluation declarations, page composition, navigation, and styles. The remaining
warning-sized official-spec generator contains contract template data and stays below the 800-line decomposition
threshold.

Review focus: if more additive DS contracts make the official-spec generator materially larger, move cohesive
contract families into imported definition modules while preserving deterministic generation and byte-for-byte
original-spec inclusion. If future documentation needs a new interactive view, implement it as a reviewed local
asset and preserve the prose-first contract; do not restore an absolute CDN URL or replace the narrative with a
diagram.

## 21. Primary Markdown CNL and technical evidence boundary

Decision: `run`, `analyze` and `generate` write and return `results/response.md` by default. The response is tagged Markdown CNL containing only intent-visible, applicable semantic results. Raw executable findings, canonical frame projections, assurance paths, traces, diagnostics and logs remain linked from `artifacts.md` and `report.md`. Material problems suppress unrelated confirmations unless IntentJS explicitly requests a complete audit. Exact verified source spans are ranked and quoted so the answer explains the concrete text that caused a rule to pass, fail, conflict or remain unknown.

Review focus: review domain-specific wording and evidence ranking on new corpora. Response templates are deterministic and grounded, but a later formatter LLM may improve prose only after the tagged blocks and quotations have been produced.

## 22. Response circuits and local override precedence

Decision: post-semantic presentation is executable code. Framework defaults select material results, infer style, group/count findings and select generated frames. IntentJS supplies typed presentation directives. Agent policies load from `agent/cnl/*.response.circuit.mjs`, task policies load from `task/cnl/*.response.circuit.mjs`, and later identical identities replace earlier ones before deterministic priority ordering. Response circuits can filter, rank, group and explain existing outcomes; they cannot alter truth, invent evidence or write ontology facts. Adaptive acceptance includes the rendered response digest.

Review focus: a task-local response circuit is justified only by an actual presentation need orthogonal to semantic truth. Repeated policies with independent calibration cases are candidates for promotion to the agent layer, but promotion remains an explicit review decision.

## 23. Environment-managed Codex assets are not project assets

Decision: the repository does not edit, copy, publish or depend on environment-managed Codex skills. The `nll-skills/` directory is the project-owned executable skill set used by coding runs. DS032, DS033 and DS040 describe project-owned documentation/specification responsibilities rather than external maintenance packages.

Review focus: if an external tool is useful during maintenance, its effect must still be reproducible through checked-in project code before it becomes part of the build or runtime contract.

## 24. Same-process local module freshness

Decision: agent/task `.mjs` modules and their transitive local imports are versioned from nanosecond modification
time plus file size when imported through the long-running authoring/evaluation process. Framework modules remain
unversioned so SDK constructor and runtime class identity stays singular. A regression rewrites both the entry and
its dependency and verifies that the second import observes the new named export.

Review focus: metadata versioning is deterministic for the current local filesystems. If generated semantic code is
later stored on a filesystem that exposes only coarse timestamps, consider adding a content digest to the version
key; do not indiscriminately version framework modules because duplicate class identities break runtime boundaries.

## 25. Semantic oracle and public-response oracle are separate

Decision: complete evaluation gold is compared to every concrete finding. The Markdown CNL contract is compared
only to the findings selected by validated response circuits, plus exact case-declared decisive quotations. Internal
grounding confirmations and non-applicable results may therefore remain technical without creating false response
failures. Evaluation exits non-zero for any failed case, and retained replay revalidates the exact real-authoring
cohort without claiming a new Codex invocation.

Review focus: every new suite should decide deliberately whether its semantic gold is complete and which source
passages are decisive for public explanation. Do not infer public visibility merely from membership in semantic gold.

## 26. Cumulative adaptive lifecycle evidence

Decision: resuming an accepted historical adaptive task preserves the original empty-state proof and cumulative
Codex phase/run evidence. The state immediately before the resumed repair is recorded separately in
`adaptive-resume-state.mjs`/`.md`, and new cycle indices continue after retained cycles. The latest review repaired
the missing Markdown CNL output/presentation policy while the original natural-language authoring evidence remained
unchanged.

Review focus: cumulative records currently retain historical cycles that were accepted under the acceptance contract
available at that time. The final cycle must satisfy the current contract. If contract-version comparison becomes a
reporting requirement, add an explicit acceptance-contract identity rather than rewriting historical cycle decisions.

## 27. Tutorial artifact explorer delivery

Decision: each retained tutorial embeds escaped Input, Intermediate and Output files into inert HTML templates. A
two-level tree keeps all three stage branches visible in the left inventory and opens only the selected file in one
shared viewer, with the first natural-language input open by default. Each branch shows the real authoring,
validation, or replay command when one exists and explicitly identifies committed input when no generation command
is applicable. This keeps content and command provenance exact while allowing the generated documentation to work
under an arbitrary relative hosting prefix without fetching project-parent paths.

Review focus: exact retained code and outputs make tutorial pages intentionally large. If browser size becomes a
material distribution problem, define a project-owned content-addressed documentation bundle and relative fetch
contract; do not replace real files with summaries or absolute workspace URLs.

## 28. Public source quotations versus technical offsets

Decision: public Markdown CNL shows the exact verified source substring and a relative source link, but never the
decoded character interval. Start/end offsets remain available in SourceSpan descriptors, executable findings,
source maps, traces, and other technical evidence. This keeps replay and anchor validation precise without asking a
human reader to resolve machine coordinates.

Review focus: if future renderers add line/column or document-page locators, treat them as optional navigation aids
beside the exact quotation rather than replacing it or reintroducing coordinate-only evidence.

## 29. Manifest-scoped coding context and verification transparency

Decision: the context builder materializes exactly the supported context-artifact union declared by the selected
skills and their transitive dependencies. Unsupported names fail the run. Generated `INSTRUCTIONS.md` enumerates the
actual artifacts after the dependency-ordered skills and selected DS files. Skill documentation is generated from
the live Markdown and executable manifest and distinguishes commands Codex is instructed to run, the fast check
recorded in `run.mjs`, and stronger acceptance enforced by evaluation or adaptive authoring.

Review focus: ordinary direct `code` commands retain Codex process evidence and its final report but do not by
themselves claim the phase-specific end-to-end acceptance used by evaluation. If ordinary coding later enforces that
acceptance automatically, change the CLI contract, implementation, tests, and these explanations together rather
than quietly strengthening the documentation claim.

## 30. Public requirement statements and controlled CNL templates

Decision: requirement codes remain stable technical identities, but they are not public explanations. A semantic
circuit that places a code in `failedRequirements`, `uncertainRequirements`, `conflictingRequirements`, or
`satisfiedRequirements` must also provide a complete domain sentence through `requirementStatements`, unless the
array value is already a human-readable sentence. Response rendering applies fixed status-specific grammar, stable
group counts, and controlled next-action templates. It fails closed on an unmapped code-shaped value instead of
guessing meaning from underscore-separated tokens. Exact source passages are placed under distinct evidence and
source-quote markers so generated CNL and copied input remain visually and mechanically separable.

Review focus: the current statement map is English because the active response dialect is English. If multilingual
CNL becomes a requirement, add a typed dialect-aware statement contract rather than turning the map into ad hoc
translation strings inside the renderer. Review new semantic circuits for full statement coverage and for sentences
that preserve modality, actor, scope, and time rather than merely expanding the code name.

## 31. Narrative Understand documentation as a distinct generated module

Decision: the six Understand chapters are owned by `tools/docs-understand-pages.mjs`. They develop one connected
story from instruction and source, through coding-agent context and direct semantic authoring, into the shared SDK,
SemanticStore, capability plan, composed circuits, findings, and public CNL. The separate coding-agent chapter
connects the adapter, dependency-closed skills, live catalogs, canonical working directory, phase handoff, retained
logs, and independent acceptance. Earlier short bootstrap summaries were removed from the other generators so there
is one project-owned source for these explanations.

Review focus: these chapters are intentionally detailed and reuse the cold-chain and rule-review cases as recurring
examples. When architecture changes, update the causal explanation in this module rather than adding a detached
component list. If a chapter becomes substantially larger, split by a real conceptual boundary while preserving the
cross-links and the shared input-to-CNL thread.

## 32. Progress visibility for long coding-agent phases

Decision: the accepted adaptive run remains valid evidence even though the CLI emitted no phase progress while
Codex was working. The retained run directories, phase-specific `INSTRUCTIONS.md`, process records, final agent
reports, deterministic assessments, and accepted replay establish what actually ran. No synthetic progress messages
were added during this work because the current adapter exposes a completed-phase record, not a trustworthy live
event stream.

Review focus: `analyze --author-adaptive` can remain silent for several minutes across ontology, circuit, and review
phases. Add structured phase-start, phase-complete, and verification events to the adapter/CLI in a future reviewed
change so a user can distinguish model latency from a stalled process without inspecting the operating-system
process table. Do not print invented percentage completion, and keep the final retained evidence authoritative.

## 33. Retained replay selects provenance, not merely the current report

Decision: `evaluate --replay-retained` examines the canonical report and archived iterations from newest to oldest,
then selects the newest cohort containing actual coding-agent process evidence. Eligible evidence names an adapter,
run path, and integer exit code in an agent- or task-authoring record. The generated summary records the selected
report directory. An ordinary evaluation that creates new tasks without `--invoke-agent` is archived normally but
cannot replace the provenance source for a real-authoring replay.

Review focus: the selector currently treats any structurally complete adapter process record as real provenance and
the strict case evaluator separately decides semantic acceptance. If multiple adapter trust classes are introduced,
add a typed adapter-evidence policy rather than matching model names or folder conventions. Preserve failed ordinary
iterations because they explain the lifecycle and must not break links from archived reports.
