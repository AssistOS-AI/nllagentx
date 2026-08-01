---
id: DS042
title: Adaptive Task-Local Semantic Authoring and Verification Loop
status: implemented
owner: nll-orchestrator
summary: Defines an explicit deep-authoring CLI mode that fills missing task semantics and iterates Codex review over concrete, abstract, and symbolic evidence.
---

# DS042 — Adaptive Task-Local Semantic Authoring and Verification Loop

## Introduction

Most production tasks should use an agent whose ontology and circuits are already reviewed, calibrated, and reusable.
Some inputs nevertheless introduce meanings or checks that the selected agent cannot express. This specification
defines an explicit optional mode that can extend the current task through a coding-agent loop without mutating
the reusable agent or hiding model-dependent work inside deterministic execution.

## Core Content

### Explicit CLI boundary

`nllAgent analyze --author-adaptive` enables deep task-local authoring. It is distinct from ordinary `run`
and `analyze`, which never invoke a coding agent, and from the narrower backward-compatible
`--author-missing`, which only fills the historically expected task artifacts. Adaptive authoring accepts
`--authoring-cycles <1..10>`, `--assurance none|abstract|symbolic|all`, and
`--adaptive-allow-unknown`. The default auxiliary requirement is `all`; unknown-only output is not material
acceptance unless the operator explicitly permits it.

### Authoring and inheritance sequence

The task begins with framework packs, the selected profile, reusable agent ontologies and semantic circuits, and
resolved framework/agent response circuits. Codex
authors IntentJS when absent, audits semantic vocabulary through the ontology skill, authors only genuinely
missing task-local OntologyJS, then authors source-grounded LongTextJS. It audits the combined circuit registry
and creates task-local CircuitJS only when the requested behavior is not already provided realistically. It adds a
task-local response circuit only when the default presentation cannot express the requested filtering or grouping. Every
phase edits canonical `.mjs` modules and focused tests directly and retains its run-local skills, catalogs,
instructions, logs, and final response.

The resulting execution plan is the dynamic composition boundary sometimes described as a super-circuit. It is
not one generated monolith. The capability registry and planner merge framework, profile, agent, and task-local
circuits, close their declared requirements and provisions, and retain the selected, rejected, and blocked
explanation. This preserves SOLID ownership and lets a later reusable agent absorb a proven task extension through
an explicit review rather than an implicit promotion.

### Deterministic acceptance and Codex review

After initial authoring, nllAgent imports the complete runtime, checks ontology closure, verifies all source
anchors, requires focused task tests, and validates that IntentJS retains instruction provenance, a semantic
concern, source-grounded evidence, the primary `markdown-cnl` output, concrete execution, and the requested auxiliary modes. It checks that every
requested concern has a circuit provider and executes the
real planner and SemanticStore. Acceptance requires a selected non-core circuit to produce a material finding or
typed generated frame, so generic core grounding alone cannot pass; it also requires no blocking
diagnostics, and the requested auxiliary interpretations for every selected non-core circuit. Abstract execution
must converge. Symbolic decision coverage must produce at least one non-truncated path. The primary response must
contain tagged, applicable Markdown CNL, include every response-selected material finding, quote exact input spans
for finding-bearing analysis, and exclude raw executable projections and non-applicable branches. A second ordinary
model-free execution must reproduce the selected circuits, finding keys, generated-frame identities, assurance
selection, and SHA-256 digest of `response.md` before the cycle can be accepted.

Intent acceptance must require an executable CNL presentation policy in addition to requesting `markdown-cnl`.
The policy must make selection, grouping, evidence, matched-rule explanation, tags, and style visible to response
composition; a bare output name is not a qualitative answer contract.

The tool writes a cycle-specific diagnostic bundle containing failures, selected circuits, findings, generated
frame counts, public response-result count and digest, abstract convergence, symbolic path counts, and truncation status. Codex then runs the review skill
chain with access to IntentJS, OntologyJS, LongTextJS, CircuitJS, runtime, and test guidance. It may repair only the
task-owned programs and tests and must not weaken acceptance. Deterministic acceptance reruns after every review
until it succeeds or the explicit cycle limit is exhausted. Exhaustion is a typed command failure, never a partial
success. If a task-local module cannot be imported, the review context falls back to inherited catalogs, retains
the complete resolution exception as a diagnostic, and still invokes Codex so syntax or construction failures are
repairable rather than preventing the repair phase itself.

### Retained artifacts

The task retains a pre-authoring `results/adaptive-initial-state.mjs` inventory,
`adaptive-authoring-cycle-<n>.md`, `adaptive-authoring.mjs`, `adaptive-authoring.md`, normal
findings/CNL/trace outputs, and complete auxiliary assurance artifacts. The
executable record names every authoring phase, review cycle, failure, circuit, finding, frame count, and assurance
summary. The task also retains the primary `response.md`, its semantic-program manifest, and the selected
response-circuit trace. `adaptive-replay.mjs` records the accepted model-free replay projection including the
Markdown CNL digest, and ordinary `run` can then
replay the accepted task without Codex.

When adaptive authoring resumes an earlier retained lifecycle, it must preserve the first pre-authoring inventory
and cumulative real Codex phase/run evidence. It writes a separate `adaptive-resume-state.mjs` plus Markdown view
for the state observed before the new repair iteration, appends new cycles with non-colliding indices, and validates
the final record against the original absence proof. Resumption must not rewrite a previously non-empty task as if
it had started empty.

## Decisions & Questions

### Question #1: Why is adaptive authoring task-local by default?

Response: A complex source can justify new representational code without proving that the code is stable reusable
knowledge. Keeping it under the task prevents source claims and one-off rule interpretations from silently
changing every future task. Promotion to the agent requires a separate reusable contract, calibration cases, and
review.

### Question #2: Can deterministic code decide that an ontology is semantically sufficient?

Response: It can detect missing imports, invalid identities, unsatisfied providers, failed tests, and incomplete
assurance, but not every conceptual omission in natural language. The ontology and circuit coding phases therefore
ask Codex to audit semantic sufficiency against the source while deterministic checks enforce the executable
boundary.

### Question #3: Why require a review even when the first concrete run succeeds?

Response: A single successful output may hide weak provenance, overfitted rules, absent unknown behavior, or an
empty symbolic model. The mandatory first review receives both successes and failures and audits the complete
concrete/abstract/symbolic evidence. It should make no changes when the task is already robust.

### Question #4: When should unknown-only output be accepted?

Response: Only when the operator selects `--adaptive-allow-unknown`. The default treats unknown-only output as a
signal that semantic authoring or evidence coverage remains incomplete, while the explicit option supports tasks
whose correct outcome is genuinely indeterminate.

### Question #5: Why preserve both initial and resume state?

Response: The initial inventory proves what Codex had to author from natural language. A later repair necessarily
starts from generated programs. Recording that later state separately preserves both claims and prevents cumulative
validation from fabricating a new empty starting point.

## Conclusion

Adaptive authoring is a bounded, observable fallback for complex inputs, not the default execution path. It
inherits reviewed knowledge, adds minimal task-local semantic programs through Codex, composes them dynamically,
and accepts them only after repeatable concrete, abstract, symbolic, provenance, and test evidence.
