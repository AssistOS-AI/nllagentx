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
