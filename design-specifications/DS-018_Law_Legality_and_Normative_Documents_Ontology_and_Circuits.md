# DS-018 — Law, Legality and Normative Documents Ontology and Circuits

**Status:** Normative predefined-pack specification  
**Pack identity:** `law-basic`  
**Primary skills:** `nll-ontology, nll-circuit`  
**Depends on:** DS-000–DS-004  
**Testing:** DS-005  
**Evaluation:** DS-006


## 1. Role in the architecture

This pack is one modular source of ontology constructors, stable background knowledge, reusable circuits, CNL frames and intent-recognition metadata. It does not replace the common language ontology or the task-specific LongText interpretation. LongTextJS uses the pack's generated constructors to describe source claims; CircuitJS uses the same identities to query, derive and evaluate; IntentJS uses the pack descriptor to decide whether loading and execution are relevant.

The target breadth is comparable to a careful 12–14-year-old with ordinary lower-secondary education. The pack should be useful and conservative. It should recognize basic relationships and common errors, but it must report uncertainty rather than simulate expert knowledge. Every domain assertion is either a source-grounded claim, a declared pack fact, or a derived fact with provenance.

The pack is implemented entirely as `.mjs` modules with Node.js built-ins. It introduces no JSON or TypeScript artifacts and no third-party dependency. Ontologies, circuits and tests are written by coding agents using the SDK and the relevant nll-* skills.


## 2. Scope and non-goals

This pack represents basic normative and procedural structure: authority, jurisdiction, actor, right, duty, prohibition, permission, power, definition, condition, exception, deadline, evidence and remedy. It supports internal consistency and basic legality reasoning at a civic-education level. It is not legal advice and contains no implicit current jurisdiction law.

The pack must distinguish internal document reasoning from claims about the external world. It may flag a statement as inconsistent with loaded basic knowledge, but it should say which pack fact or relation was used. It must not upgrade a plausible heuristic into a universal law.

## 3. Conceptual and scientific basis

Normative text differs from ordinary factual description. A rule creates or reports obligations, permissions, powers and consequences under an authority and scope. Exceptions and definitions modify applicability. The ontology therefore reifies norms and legal acts rather than treating 'must' as a Boolean property. Circuits distinguish validity within a loaded rule system from real-world legal validity.

The practical ontology should favor event/state frames with typed roles over flat subject–predicate–object triples. Reified events make time, place, participants, causes, instruments, modality and evidence attachable without inventing a different predicate arity for every sentence. Claims and contexts remain separate from the situations they describe.

## 4. Ontology modules

The pack is divided into the following modules:

- authority-jurisdiction — legal source, issuer, hierarchy, territorial and subject scope
- persons-roles — natural/legal person, public body, official, party and beneficiary
- norms — obligation, prohibition, permission, right, power and recommendation
- conditions-exceptions — trigger, prerequisite, exception, defense and exemption
- time-procedure — deadline, notice, approval, appeal, review and termination
- definitions-references — defined term, cross-reference and annex
- evidence-remedy — record, burden, decision, sanction, remedy and compliance finding

The module boundaries are semantic and operational. A coding agent may split a large module further, but imports must preserve pack-qualified identities and avoid circular initialization.

## 5. Core concept inventory

- NormativeAuthority, Jurisdiction and LegalSource
- LegalPerson, NaturalPerson, Organization and PublicBody
- LegalRole, Party, Beneficiary and DecisionMaker
- Norm, Obligation, Prohibition, Permission, Right and Power
- Condition, Exception, Exemption and Defense
- Procedure, Notice, Approval, Appeal and Deadline
- DefinedTerm and CrossReference
- LegalEvidence, Decision, Sanction and Remedy

Concepts should include English lexicalizations and may add other languages in separate lexicon modules. Lexical forms are recognition aids; they do not define semantic identity.

## 6. Canonical frames and relations

- IssuedBy(norm, authority)
- AppliesIn(norm, jurisdiction)
- Binds(norm, actor)
- Benefits(norm, beneficiary)
- Requires(norm, action), Forbids(norm, action), Permits(norm, action)
- ConditionalOn(norm, condition)
- ExceptWhen(norm, exception)
- Overrides(specificRule, generalRule, scope)
- MustPrecede(stepA, stepB)
- DefinedAs(term, definition, scope)
- RemediedBy(violation, remedy)

Every frame declares role domains, ranges and cardinalities. Relations with inverses or symmetry properties register those laws in OntologyJS. Application-specific judgments remain in circuits.

## 7. Stable knowledge seed

The initial pack should encode a deliberately small, inspectable seed rather than an opaque encyclopaedia. Recommended seed categories are:

- obligation, permission and prohibition are distinct modalities
- an action can be permitted without being required
- a rule applies only under its authority, jurisdiction, actor and temporal scope
- specific exceptions can qualify general rules when precedence is represented
- procedural rights and duties often depend on notice, deadline and authorized decision-maker
- defined terms inherit their declared scope rather than ordinary-language meaning
- lack of an observed authorization is not proof of illegality without closed coverage
- jurisdiction-specific law must come from an explicit sourced pack

Pack facts are versioned and carry a provenance note such as `school-textbook-consensus`, `definition`, `unit-standard` or `design-convention`. Current, jurisdiction-dependent or contested facts are not part of the baseline pack.

## 8. Predefined circuit catalog

| Capability | Design |
|---|---|
| NormFrameCompletenessFinding | checks actor, modality, action, object, condition, authority and scope slots |
| DefinitionConsistencyFinding | checks defined-term use, duplicate definitions and scope |
| NormConflictFinding | detects incompatible duties/permissions after exception and precedence analysis |
| AuthorityJurisdictionFinding | checks whether a norm or decision has represented authority and scope |
| ProcedureOrderFinding | checks notice, approval, action, review and appeal order |
| DeadlineFinding | normalizes dates/durations and checks deadlines or conflicting periods |
| CrossReferenceFinding | checks internal section/annex references |
| ExceptionCoverageFinding | checks that exception conclusions use complete relevant scope |
| LegalBasisFinding | checks whether an action requiring a basis has one represented, without inventing current law |
| NormativeCNLRepair | produces obligation/permission/prohibition frames with conditions and exceptions |
| PolicySpecificationPlan | builds definitions, scope, roles, rules, procedure, evidence and remedy sections |

A circuit may use several methods. The table describes its semantic responsibility, not a rigid implementation class. For example, a consistency circuit may use indexed queries, a relation closure, a constraint network and a bounded symbolic witness search.

## 9. Controlled generation and planning

The pack contributes CNL frames and generation circuits for:

- canonical clauses with explicit actor, modality, action, object, condition, deadline and exception
- policy and regulation outlines
- procedure and appeal plans
- definition sections and cross-reference tables
- clarification questions about authority, jurisdiction and scope
- internal-consistency findings stated without claiming external legal advice

Generated plans preserve the distinction between a pack fact, a source claim, an inferred relation and an open question. A downstream LLM may improve style, but it should receive the CNL plan plus immutable semantic constraints.

## 10. Intent recognition and profile behavior

Cheap and semantic intent signals include:

- must, shall, may, prohibited, entitled, authority, jurisdiction, article, section or appeal
- contract, policy, regulation, law, procedure or terms document
- defined terms, numbered clauses and cross-references
- requests for legal structure, compliance, obligations or controlled clause generation

The pack descriptor declares these signals through fluent functions. Signal matches only influence loading and ranking; they do not produce findings. When this pack is loaded under `all-compatible`, every circuit whose prerequisites are satisfied is eligible. Domain-specific profiles may choose a smaller circuit subset.

## 11. Algorithm and implementation guidance

- represent norms as first-class terms with authority and scope
- compile conditions/exceptions to decision tables with multi-valued logic
- use temporal constraints for deadlines and procedure order
- use stratified fixed points for inherited applicability and precedence
- require coverage before concluding absence of authorization or exception
- use bounded consistency solving for conflicting obligations
- keep jurisdiction packs separate and explicitly versioned
- generate CNLFrames and validate modality, actor, scope and exception round-trip

All algorithms operate over SemanticStore handles and provenance-preserving views. A specialized view may be cached, but the store remains the logical authority. Procedural stages are allowed when they are simpler than forcing an algorithm into declarative primitives; the stage must declare semantic reads, writes and trace output.

## 12. Fluent pack shape

A pack is ordinary JavaScript, not a manifest object:

```js
import {
  ontology, entityKind, eventKind, role, relation,
  capability, domainPack, lexicalSignals, semanticSignals
} from "../../sdk/index.mjs";

const O = ontology("law-basic", "1.0.0");
export const NormativeAuthority = O.entity(entityKind("NormativeAuthority"));
export const LegalPerson = O.entity(entityKind("LegalPerson"));
export const LegalRole = O.entity(entityKind("LegalRole"));

export const ontologyModule = O.seal();

export default domainPack("law-basic")
  .ontology(ontologyModule)
  .recognize(
    lexicalSignals(/* pack-specific terms */),
    semanticSignals(/* pack-specific frame identities */)
  )
  .provide(capability("NormFrameCompletenessFinding"))
  .provide(capability("DefinitionConsistencyFinding"))
  .provide(capability("NormConflictFinding"))
  .targetKnowledgeLevel("lower-secondary")
  .seal();
```

The real implementation should define event/state frames, role constructors, lexicalizations, facts, circuits and tests in separate files as described below.

## 13. Required directory structure

```text
framework/packs/law-basic/
  pack.mjs
  ontologies/
    authority-jurisdiction.ontology.mjs
    persons-roles.ontology.mjs
    norms.ontology.mjs
    conditions-exceptions.ontology.mjs
    time-procedure.ontology.mjs
    definitions-references.ontology.mjs
    evidence-remedy.ontology.mjs
  circuits/
    selection.circuit.mjs
    consistency.circuit.mjs
    generation.circuit.mjs
    index.mjs
  cnl/
    frames.mjs
    lexicon.en.mjs
    renderer.mjs
  tests/
    ontology.test.mjs
    circuits.test.mjs
    intent.test.mjs
    cnl.test.mjs
```

File names may be refined, but the pack must expose one `pack.mjs`, one circuit index and one test entry point. Agent-level specializations import the pack instead of copying it.

## 14. Testing requirements

Minimum tests include:

- permission versus obligation
- general rule plus specific exception
- conflicting duties in same versus different scope
- defined term before/after definition
- authorized versus unauthorized decision maker
- deadline calculation
- procedure order and missing notice
- open-scope absence of legal basis
- cross-reference validity
- normative CNL round-trip

Tests use Node's built-in test runner. Every finding test asserts evidence and trace dependencies. CNL tests assert frame slots and, where parsers exist, round-trip equivalence.

## 15. Limitations and extension policy

The baseline does not know current law of any jurisdiction. It can check internal legality structure only relative to loaded norms. Jurisdiction-specific advice, criminal/civil classification and case-law interpretation require sourced expert packs and human review. The pack must state this limitation in user-facing findings where relevant.

A specialized agent can add a new module under `agents/<agent>/ontologies/` or `circuits/`. Task-local additions are allowed under the task directory. Reusable additions should be promoted by a coding-agent run after tests demonstrate that the concept or circuit is not task-specific.

## 16. Acceptance criteria

The pack is acceptable when:

1. its ontology imports with the core stack and has no identity or closure conflict;
2. LongTextJS can use generated constructors without generic field objects;
3. its major circuits produce evidence-bearing findings on micro-cases;
4. IntentJS can select the pack from both explicit instructions and semantic source signals;
5. `all-compatible` loads and executes all applicable pack circuits;
6. CNL planning or explanation outputs preserve provenance;
7. pack tests pass without a coding agent, network or external dependency;
8. ambiguous or expert-level cases produce explicit uncertainty or a refinement demand.

## 17. Relevant foundations

Deontic/normative framing, four-valued decision logic [BEL77], temporal relations [ALL83], relational fixed points [AHV95] and controlled natural languages [KUH14].

## Appendix A. Minimum normative model

### A.1 Norm identity

A norm has source/authority, jurisdiction or organizational scope, temporal validity, regulated actor, modality, action, object, beneficiary, conditions, exceptions and consequence/remedy. Not every slot is mandatory for every text, but the circuit contract declares which are required for a particular analysis.

### A.2 Deontic relations

Implement distinct constructors for `Obligation`, `Prohibition`, `Permission`, `Right`, `Power`, `Immunity`, `Recommendation` and `PolicyGoal`. Do not derive obligation from permission or performance from obligation. A right may correspond to another actor's duty only when the loaded normative model states that relation.

### A.3 Applicability and precedence

Rules can be general or specific, primary or exception, higher/lower authority, earlier/later, mandatory/default. The baseline planner uses explicit relations such as `Overrides`, `Excepts`, `Implements` and `ConflictsWith`; it does not invent a jurisdictional precedence rule.

### A.4 Procedure state model

Represent procedure states and events: application/request, notice, evidence submission, review, authorization, execution, decision, communication, appeal, expiry and remedy. Monitor circuits check precedence and eventual response under declared complete traces.

### A.5 Definition and reference model

Definitions create scoped mappings from terms to concepts or frames. Cross-reference circuits resolve section, clause, annex and external-source handles. Broken references, recursive definitions and changed term scope are first-class findings.

### A.6 Jurisdiction-pack boundary

A jurisdiction-specific pack must identify legal source versions and effective dates. `law-basic` supplies structure only. User-facing output must say “internally inconsistent with the loaded rules” rather than “illegal” when no authoritative jurisdiction pack is loaded.

