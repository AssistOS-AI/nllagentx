---
id: DS008
title: Preserved Evaluation Agents, Isolated Tasks and End-to-End Benchmarks
status: normative-implemented
owner: nllAgent architecture
summary: Preserves DS-006_Evaluation_Agents_Tasks_and_Benchmarks.md verbatim and records additive implementation alignment.
---

# DS008 — Preserved Evaluation Agents, Isolated Tasks and End-to-End Benchmarks

## Introduction

This official specification preserves the complete original design contract. No wording from the source specification has been removed, shortened, or rewritten.

## Core Content

The following source specification is included verbatim from `design-specifications/DS-006_Evaluation_Agents_Tasks_and_Benchmarks.md`.

<!-- ORIGINAL SPECIFICATION START: DS-006_Evaluation_Agents_Tasks_and_Benchmarks.md -->
# DS-006 — Evaluation Agents, Isolated Tasks and End-to-End Benchmarks

**Status:** Normative evaluation specification  
**Primary skill:** `nll-evaluate`  
**Depends on:** DS-000–DS-005  
**Distinct from:** unit and integration testing in DS-005

## 1. Purpose

Evaluation measures the complete system, including the coding agent’s ability to author IntentJS, LongTextJS, ontology extensions and circuits from natural-language instructions and long documents. It therefore uses isolated custom agents and may invoke Codex. The evaluation unit is not a prompt response; it is an agent directory, one or more random-ID task directories, generated semantic code, deterministic execution and retained CNL results.

## 2. Evaluation isolation

Each suite creates its own directory:

```text
evaluations/<suite-id>/
  suite.mjs
  README.md
  corpora/
  gold/
  agents/
    <evaluation-agent>/
      agent.mjs
      ontologies/
      circuits/
      profiles/
      skills-policy.mjs
      tests/
      tasks/
  reports/
```

The evaluation agent loads only the ontology and circuit packs declared by the suite. It must not see unrelated agent-local artifacts. Framework packs may be enabled individually or through a profile. This isolation makes it possible to measure the effect of a domain pack or intent policy.

## 3. Evaluation task lifecycle

For each document:

1. `nllAgent task create` generates a random task ID under the evaluation agent.
2. Source files and task instructions are copied or linked into `source/`.
3. nllAgent builds a run context containing only permitted DS files, skills, packs and examples.
4. Codex is invoked with `nll-intent` to create `intent/intent.mjs` and tests.
5. Codex is invoked with `nll-longtext` to create multi-file LongTextJS and source anchors.
6. If the suite permits task-local ontology extensions, Codex may invoke `nll-ontology` under the task.
7. Existing agent circuits are planned and executed. If the suite measures circuit authoring, Codex may create task-local or reusable circuits using `nll-circuit`.
8. nllAgent runs deterministic tests and materializes the SemanticStore.
9. Selected circuits execute concretely. Abstract, symbolic or other assurance methods execute where required by the suite or declared plan.
10. Results remain in the task directory as CNL observations, findings, plans, traces and reports.

The coding agent edits canonical task files directly. Evaluation records process and result data; it does not approve patches.

## 4. Required task layout

```text
agents/<evaluation-agent>/tasks/<random-id>/
  task.mjs
  source/
  intent/
    intent.mjs
    intent-signals.mjs
    plan.mjs
  longtext/
    root.longtext.mjs
    units/
  ontologies/
  circuits/
  tests/
  runs/
  results/
    execution-plan.md
    findings.mjs
    findings.cnl
    observations.cnl
    generation-plan.cnl
    report.md
    coverage.md
    diagnostics.md
    trace.bin
```

All generated semantic code remains available for inspection. The evaluation report must link each metric to task IDs and artifact paths.

## 5. Evaluation modes

### 5.1 Materialization-only

Codex receives source and an existing ontology stack. It must produce LongTextJS. Metrics focus on anchors, frame accuracy, alternatives, coverage and unknown preservation.

### 5.2 Intent-selection

Codex receives a source and task instruction with a large available pack registry. It must produce IntentJS. Metrics focus on domain/check selection, omissions, unnecessary selection and plan explanation.

### 5.3 Circuit authoring

Codex receives natural-language rules and calibration examples. It must create CircuitJS and tests. Metrics include rule decision accuracy, evidence fidelity, mutation sensitivity and reuse of SDK primitives.

### 5.4 End-to-end analysis

Codex creates intent and LongText code; predefined circuits execute. This is the default system evaluation.

### 5.5 End-to-end generation

The task asks for a CNL plan, controlled clause, book/document outline or repair. The evaluation checks semantic slot coverage, constraints, provenance and optional round-trip.

### 5.6 Pack ablation

The same tasks run under different load profiles to measure the contribution and interference of each predefined ontology/circuit pack.

### 5.7 Ordinary replay

After authoring, tasks are rerun without Codex. This checks reproducibility and verifies that results do not depend on an unrecorded model state.

## 6. Dataset design

Evaluation corpora should include short micro-documents and long realistic documents. Each task specifies which aspects are gold-annotated.

Recommended groups:

- literary continuity and character-knowledge cases;
- legal and policy rules with definitions, exceptions and deadlines;
- internal procedures with authorization and eventual completion;
- textbook explanations with formulas, examples and prerequisites;
- scientific claims with evidence, units and causal language;
- argumentative essays with fallacies and counterarguments;
- mixed-domain documents;
- generation tasks for compositions, chapters, policies and controlled specifications;
- adversarial ambiguity and incomplete-coverage cases.

Gold data may be represented by `.mjs` expected frames and CNL files. No JSON annotations are required.

## 7. Metrics

### 7.1 Authoring metrics

- coding-run completion rate;
- import/test success after first run;
- number of review runs;
- unnecessary code duplication;
- proportion of reusable SDK primitives versus ad hoc helpers;
- source-anchor validity;
- generated test adequacy;
- elapsed coding-agent time and token/cost metadata when available.

### 7.2 Intent metrics

- domain-pack precision and recall;
- concern/check precision and recall;
- output selection accuracy;
- all-compatible fallback correctness;
- plan minimality subject to required coverage;
- explanation fidelity;
- frequency of inappropriate exclusions.

### 7.3 LongText metrics

- concept/frame precision and recall for annotated spans;
- exact or overlap anchor quality;
- role accuracy;
- entity/coreference accuracy;
- modality, negation and scope accuracy;
- temporal relation accuracy;
- meaningful-alternative preservation;
- unsupported completion rate;
- coverage declaration accuracy.

### 7.4 Circuit result metrics

- status accuracy;
- evidence precision/recall;
- explanation trace fidelity;
- correct handling of unknown, conflict and exception;
- ontology-blocking correctness;
- symbolic path/decision coverage where applicable;
- robust versus conditional finding accuracy.

### 7.5 Generation metrics

- required CNLFrame slot coverage;
- semantic constraint satisfaction;
- provenance of generated slots;
- round-trip equivalence;
- plan completeness and dependency order;
- absence of unauthorized additions;
- usefulness to a separate LLM expansion step, evaluated independently from formal correctness.

### 7.6 Runtime metrics

- materialization and execution time;
- peak semantic terms and circuit instances;
- cache reuse;
- incremental recomputation ratio;
- planner-selected versus executed circuits;
- blocked/deferred analysis counts;
- trace size and explanation-slice reduction.

## 8. Evaluation of the 12–14-year baseline

The basic knowledge packs are evaluated for breadth and restraint. Tasks should test whether the system can:

- detect ordinary physical impossibilities and continuity gaps;
- verify basic arithmetic, units and school science statements;
- understand simple motives, emotions, roles and social interactions;
- recognize elementary logical contradiction and common fallacies;
- analyze basic legal/normative structure;
- create a coherent CNL composition or document plan.

It must also avoid expert overreach. Evaluation includes cases where the correct result is `UNKNOWN`, `BLOCKED_ONTOLOGY` or a request for specialized knowledge.

## 9. Concrete semantic execution and auxiliary interpretations

Every end-to-end evaluation executes the generated IntentJS and LongTextJS modules and then runs the selected CircuitJS plan through the explicit concrete semantic runtime. This mandatory step is deterministic for the same source modules, ontology stack, circuit versions and captured services. It must not be confused with symbolic execution in the compiler-analysis sense.

When a circuit declares symbolic, abstract, constraint or other assurance support, the suite may additionally require:

- abstract must/may outcome comparison;
- symbolic decision-row coverage;
- bounded counterexample generation;
- constraint witness or unsatisfiable core;
- refinement demand quality.

A circuit without symbolic support is not automatically invalid, but a suite can require it for selected rule families.

## 10. Review protocol

A review run may be invoked after deterministic failures or as an independent evaluation condition. It receives:

- relevant DS files and skill;
- current canonical code;
- source slices;
- failing tests and diagnostics;
- execution-plan explanation;
- trace slices;
- metric failures.

Codex decides how to repair the code and updates tests. nllAgent reruns checks. The number and nature of review cycles are recorded as evaluation data.

## 11. Suite declaration

`suite.mjs` is a fluent executable module:

```js
export default evaluationSuite("school-general-v1")
  .agentTemplate("general-school-review")
  .profiles("general-school", "all-compatible")
  .tasks(fromCorpus("corpora/school-general"))
  .modes(intentSelection(), materialization(), endToEndAnalysis(), generation())
  .codingAgent("codex")
  .metrics(defaultSemanticMetrics(), runtimeMetrics())
  .retainAllArtifacts()
  .seal();
```

## 12. Reports

The suite produces:

```text
reports/
  summary.md
  task-results.mjs
  intent-selection.md
  materialization.md
  circuit-results.md
  generation.md
  runtime.md
  failures/
```

Reports distinguish framework failure, coding-agent authoring failure, ontology insufficiency, intent-selection failure, LongText materialization error, circuit error and evaluation-data uncertainty.

## 13. Acceptance criteria

The evaluation subsystem is complete when it can:

- create an isolated custom agent with only declared packs;
- generate random-ID task folders;
- invoke Codex to create IntentJS and LongTextJS;
- optionally author ontology/circuit code under suite policy;
- execute concrete and declared symbolic/abstract passes;
- retain CNL findings and generation plans per task;
- compute metrics from semantic structures rather than only string answers;
- rerun authored tasks without Codex;
- compare load profiles and pack ablations;
- produce a complete report without JSON/TypeScript or third-party runtime dependencies.
<!-- ORIGINAL SPECIFICATION END: DS-006_Evaluation_Agents_Tasks_and_Benchmarks.md -->

### Additive implementation alignment

The evaluation SDK and runner create isolated evaluation agents and random-ID tasks. A suite can retain an agent brief and declare agent-level architect/ontology/circuit phases plus task-level intent/longtext/ontology/circuit phases. With --invoke-agent, each declared phase runs the real Codex adapter, snapshots created and modified canonical artifacts, applies phase-specific deterministic acceptance, and retains instructions, installed skills, context, logs, and final response. Concrete execution, declared abstract/symbolic assurance, expected findings or generation frames, and model-free replay are then reported in Markdown plus executable .mjs artifacts. DS041 defines the complete natural-language authoring evidence contract.

## Decisions & Questions

### Question #1: Why is the original specification embedded instead of replaced by a normalized rewrite?

Response: Source fidelity is an explicit project requirement. The embedded body remains byte-for-byte identical to the original file; official metadata, implementation alignment, and decision records are additive.

### Question #2: Which text wins if an additive note appears narrower than the preserved contract?

Response: The preserved normative requirement remains authoritative. An implementation-alignment note reports confirmed current behavior and cannot silently weaken the original contract.



## Conclusion

Future changes must preserve the embedded source contract, extend implementation and tests to meet it, and record contract-shaping rationale in numbered entries here.
