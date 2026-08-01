# Coding-agent validation insights

This project-owned log records recurring problem classes observed during real Codex authoring, review, and
model-free replay. It is descriptive evidence, not a substitute for the normative DS specifications. Entries name
the symptom, the underlying boundary, and the regression control added after the observation.

## 1. Same-process semantic-module cache drift

**Observed by:** the first real `agentic-nl-e2e --invoke-agent` circuit phase.

**Symptom:** Codex added `requirementDetails` to `circuits/review-support.mjs` and imported it from a circuit, but
the parent evaluator still held the old transitive dependency in Node's module cache. Importing the changed circuit
then reported that the new named export did not exist even though the source file was correct.

**Problem class:** a coding phase can change a local dependency graph inside a long-running evaluator; cache-busting
only the top-level module is insufficient.

**Remedy and control:** `importFresh()` versions every local `.mjs` dependency below the owning agent root by
nanosecond modification time and size while leaving framework module identities stable. The module-loader regression
test rewrites both an entry module and its local dependency between imports and requires the new export to resolve.

## 2. Available response tooling omitted from the agent architecture plan

**Observed by:** the real Codex architect phase during the accepted authoring iteration.

**Symptom:** `RESPONSE_CIRCUIT_CATALOG.md` was installed in context, but the reusable agent plan did not list
`nllAgent catalog response` among the tools available to later skills.

**Problem class:** context availability and planning visibility can diverge. A capability that exists but is not
declared in the agent plan is easy for later coding phases to ignore.

**Remedy and control:** the architect phase added the response-catalog CLI command to `architecture-plan.mjs` and a
focused test that requires both the context artifact and the executable catalog command.

## 3. Semantic gold findings confused with public-response findings

**Observed by:** the completed real four-case evaluation after all Codex phases passed.

**Symptom:** semantic precision, recall, F1, anchors, replay, and authoring all scored 1.0, but every case failed the
response contract because the evaluator required `CoreGroundingFinding.grounded:SATISFIED` in Markdown CNL.

**Problem class:** internal semantic expectations and the public answer boundary are different contracts. Response
circuits intentionally suppress internal grounding confirmations and non-applicable findings.

**Remedy and control:** semantic expectations remain checked against all runtime findings, while the response
contract is checked against only the entries selected by the validated response composer. The suite also declares
case-specific exact source quotations that must appear in the answer, so filtering cannot hide a weak explanation.

## 4. Correct verdict with incomplete decisive evidence

**Observed by:** manual inspection of the real exception-justification and safety-conclusion `response.md` files.

**Symptom:** both circuits emitted the correct `VIOLATED` result, but their findings initially cited only the
positive subject and policy claims. They omitted the input's explicit negative statement that no justification or
supporting evidence existed.

**Problem class:** closed coverage can prove absence, but when an explicit denied claim is also present it is part of
the human explanation and must survive into finding evidence. A renderer must not rediscover that evidence by text
search because doing so would move semantic inference into presentation.

**Remedy and control:** false-result branches now retain compatible denied claims as decisive evidence. The safety
task represents the source's denial as a denied `SupportsSafetyConclusion` relation rather than an unrelated generic
proposition. Task tests require all decisive source offsets, and evaluation cases require the exact negative quotes.

## 5. Style-insensitive response assertions

**Observed by:** the independent real Codex review after the cache repair.

**Symptom:** an intentionally strict probe required every structured requirement string to appear in every response.
It failed for procedural output, which correctly prioritized ordered generated steps and quotations over analytical
detail rows.

**Problem class:** qualitative response guarantees are shared, but presentation obligations vary by IntentJS style.

**Remedy and control:** response tests are style-aware. Evidence-led and analytical answers expose requirement
details; procedural answers expose the generated plan, its readiness finding, and exact supporting quotations. All
styles retain stable CNL tags and reject raw assurance or executable projections.

## 6. Missing end-to-end tests at the CNL boundary

**Observed by:** the real Codex agent review phase.

**Symptom:** circuit tests covered semantic outcomes and symbolic paths, but the agent had no focused test that ran
findings through response composition and Markdown rendering.

**Problem class:** correct circuit semantics do not by themselves guarantee a usable primary answer.

**Remedy and control:** Codex added agent-level response integration tests for contradiction analysis and procedure
generation. They require selected material results, exact quotations, ordered procedure steps, stable tags, replay
stability, and absence of `NOT_APPLICABLE`, raw frames, source-span identities, and assurance internals.

## 7. CLI option discovery errors during authoring

**Observed by:** the real procedure LongTextJS phase.

**Symptom:** Codex first called `source search --query`, received the typed error `USAGE_OPTION_REQUIRED: --text`,
then corrected the command and obtained the exact source offset.

**Problem class:** a discoverable tool can still be invoked with a plausible but unsupported option name. Typed
usage failures are useful evidence, but the documentation and context catalog must make canonical parameters easy to
find.

**Remedy and control:** retain the failed and corrected commands in the Codex log, document exact CLI parameters in
the tutorials and command tables, and keep CLI help and skill workflow tool declarations synchronized.

## 8. Excess boilerplate and flattened requirement arrays in primary CNL

**Observed by:** manual review of all four real generated answers.

**Symptom:** early answers repeated task IDs, input inventories, generic uncertainty disclaimers, and artifact notes.
Requirement arrays were joined into comma-separated prose, reducing readability.

**Problem class:** technically valid output can still be verbose and difficult to hand to another LLM or a human
reviewer.

**Remedy and control:** the renderer now keeps the answer, intent-selected groups, finding explanations, structured
requirements, decisive citations, and material next action. Technical inventories remain in `artifacts.md`; generic
non-findings and non-blocking disclaimers are omitted. Each requirement is rendered as its own Markdown list item.

## 9. Semantic output requested without an executable presentation policy

**Observed by:** deterministic acceptance before the resumed real Codex adaptive review.

**Symptom:** the cold-chain circuit, ontology, LongTextJS, concrete result, abstract convergence, symbolic paths,
and replay were all valid, but the historical IntentJS requested only findings and canonical observations. It did
not request `markdown-cnl` and contained no `.present(...)` directives.

**Problem class:** a task can define what truth-bearing artifacts to compute without defining the qualitative
public answer. A renderer default may hide this omission and make an incomplete task appear finished.

**Remedy and control:** adaptive acceptance now requires both `markdown-cnl` and a non-empty executable presentation
policy. The real Codex review added evidence-led style, status-family grouping, matched-rule explanations, exact
evidence quotation, group counts, stable tags, and a focused IntentJS test. The rejected cycle and repaired cycle
remain separately retained.

## 10. Human paraphrase used as an evidence oracle

**Observed by:** the independent DS042 validator after the repaired adaptive run passed its internal acceptance.

**Symptom:** the response quoted the exact source sentence “The calibration certificate for TH-9 expired…”, while
the validator searched for the reordered paraphrase “expired calibration certificate” and incorrectly failed.

**Problem class:** a fuzzy or hand-written phrase oracle can reject stronger exact provenance and couples acceptance
to incidental word order.

**Remedy and control:** the validator now requires the two complete decisive source sentences exactly: the expired
certificate and the absent receiving-party acknowledgement. This strengthens evidence validation without asking the
renderer to synthesize a validator-specific paraphrase.

## 11. Machine anchor coordinates leaked into the human citation

**Observed by:** coding-agent review of the retained tutorial responses.

**Symptom:** each public finding already reproduced the exact verified source substring, but its attribution ended
with a decoded interval such as `characters 42–77`. A reader had to interpret machine coordinates even though the
useful evidence was visible immediately above them.

**Problem class:** provenance needed for validation and replay can become interface noise when it crosses unchanged
into a human-facing projection. Retaining technical detail does not require displaying every detail in the primary
answer.

**Remedy and control:** `SourceSpan` start/end values remain in executable and technical artifacts, while public
Markdown CNL renders the exact verified substring, identifies it as exact source text, and links the source through
a relative path. Renderer and tutorial tests reject character-range citations in the public response.

## 12. Skill context declarations did not constrain the generated context

**Observed by:** coding-agent review while tracing how the skill documentation obtained its claimed context.

**Symptom:** every `workflow.mjs` declared a focused set of context artifacts, but the context builder materialized
all standard catalogs for every phase. The documentation therefore described a manifest-selected context that the
implementation did not actually enforce.

**Problem class:** an executable manifest can look authoritative while one of its fields is only descriptive. This
creates context bloat, obscures missing dependency declarations, and makes it impossible to verify what a coding
agent truly received.

**Remedy and control:** the builder now validates context artifact names and materializes exactly the union declared
by the dependency-closed skill chain. `INSTRUCTIONS.md` enumerates that actual inventory. A temporary-workspace
regression proves that the SDK phase receives only its three declared catalogs, and generated skill pages expose the
live manifest, dependency order, context provenance, declared tools, and distinct verification layers.

## 13. Internal requirement identifiers leaked into public CNL

**Observed by:** human review of the retained adaptive cold-chain `response.md`, then verified by the real Codex
circuit-authoring and final-review phases.

**Symptom:** the semantic verdict and evidence were correct, but the explanation listed
`RECEIVING_PARTY_ACKNOWLEDGED`, `THERMOMETER_CALIBRATION_VALID`, and `EXCURSION_QUARANTINE_PATH` as failed or
unresolved requirements. The values were useful circuit/test identities but not useful sentences for a reader.

**Problem class:** a technical semantic descriptor crossed the presentation boundary without a public-language
contract. Generic formatting cannot reconstruct domain modality, actor, scope, or time from an identifier.

**Remedy and control:** the cold-chain circuit now owns complete public requirement statements and uses them in both
the Markdown response and canonical observation. The general renderer groups those statements through controlled
status templates, quotes them in counted next actions, and throws `PUBLIC_REQUIREMENT_STATEMENT_REQUIRED` for a raw
unmapped code. Focused tests cover successful mapping, fail-closed behavior, absence of the internal identifiers,
and the real cold-chain result.

## 14. Documentation contracts passed while the architecture story remained shallow

**Observed by:** human review of every page in the Understand menu after the first narrative documentation pass.

**Symptom:** the pages contained correct component names and several paragraphs, yet they still read as compressed
inventories. Phrases such as “natural-language interpretation benefits from a coding agent” named a boundary without
explaining the actual input state, how Codex obtains SDK/ontology knowledge, what it writes, how ownership changes
reuse, or how the next runtime layer consumes the artifact.

**Problem class:** structural documentation checks can count prose and reject diagrams while still accepting a
caricature of the architecture. Correct nouns and headings are not a usable causal model.

**Remedy and control:** DS040 now requires six connected chapters and a dedicated coding-agent story. The generated
pages follow recurring concrete cases through source, authoring, DSL values, transaction, planning, execution,
response composition, evidence, and replay. A focused test includes the coding-agent page and requires its adapter,
skill closure, live catalog, instruction, direct-editing, process/acceptance, and model-free boundaries; paragraph
and table checks remain only lower-level guards.

## 15. An adaptive authoring phase can correctly conclude that no code is missing

**Observed by:** the real Codex ontology phase and mandatory final review in the resumed cold-chain evaluation.

**Symptom:** the adaptive workflow always asks Codex to audit the resolved ontology and later review the complete
execution. A naive implementation could interpret every invoked phase as an obligation to create or rewrite a file,
even though this task already had 17 domain concepts, four roles, correct core identity reuse, complete anchored
LongTextJS, and passing ontology tests.

**Problem class:** agentic authoring can introduce semantic churn when phase completion is confused with file
mutation. Extra ontology concepts or source-specific facts would make the task less reusable while still appearing
to be productive work.

**Remedy and control:** the ontology goal explicitly permits task-local additions only for genuinely missing
meanings, and the review goal tells Codex to avoid semantic churn when acceptance is already satisfied. In the real
run, Codex regenerated the facade deterministically, found no diff, retained the existing ontology and IntentJS, and
reported the no-change decision with 5/5 focused ontology tests, 20/20 task tests, 50/50 framework tests, and 26/26
valid source anchors. A no-change audit is therefore a successful evidence-bearing outcome, not an incomplete phase.

## 16. An ordinary evaluation hid the retained real-authoring cohort

**Observed by:** final replay validation of the four agentic tutorial cases.

**Symptom:** invoking the suite without `--invoke-agent` or `--replay-retained` correctly created four fresh tasks,
but they had no generated IntentJS or LongTextJS and therefore returned only non-applicable findings. The runner
archived the preceding successful real-authoring report and made this ordinary result canonical. A subsequent
retained replay would previously have reused the fresh incomplete tasks instead of the archived Codex-authored ones.

**Problem class:** a mutable “latest report” pointer is not the same thing as retained authoring provenance. Report
chronology alone cannot distinguish an authored cohort from a deterministic run that intentionally invoked no
coding agent.

**Remedy and control:** retained replay now searches current and archived reports newest-first and requires an
adapter, run path, and exit code in agent- or task-authoring evidence. A focused temporary-workspace regression
reproduces the overwritten-pointer case. The repaired replay automatically recovered the archived four-task cohort
and passed precision, recall, F1, anchor validity, semantic replay, Markdown CNL contract, CNL replay, and authoring
completion at 1.0.
