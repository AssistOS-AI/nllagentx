# DS-009 — Mathematics Ontology and Circuits

**Status:** Normative predefined-pack specification  
**Pack identity:** `math-basic`  
**Primary skills:** `nll-ontology, nll-circuit`  
**Depends on:** DS-000–DS-004  
**Testing:** DS-005  
**Evaluation:** DS-006


## 1. Role in the architecture

This pack is one modular source of ontology constructors, stable background knowledge, reusable circuits, CNL frames and intent-recognition metadata. It does not replace the common language ontology or the task-specific LongText interpretation. LongTextJS uses the pack's generated constructors to describe source claims; CircuitJS uses the same identities to query, derive and evaluate; IntentJS uses the pack descriptor to decide whether loading and execution are relevant.

The target breadth is comparable to a careful 12–14-year-old with ordinary lower-secondary education. The pack should be useful and conservative. It should recognize basic relationships and common errors, but it must report uncertainty rather than simulate expert knowledge. Every domain assertion is either a source-grounded claim, a declared pack fact, or a derived fact with provenance.

The pack is implemented entirely as `.mjs` modules with Node.js built-ins. It introduces no JSON or TypeScript artifacts and no third-party dependency. Ontologies, circuits and tests are written by coding agents using the SDK and the relevant nll-* skills.


## 2. Scope and non-goals

This pack covers lower-secondary arithmetic, fractions, ratios, percentages, elementary algebra, geometry, measurement, simple probability and descriptive statistics. It verifies explicit calculations and relations. It is not a computer algebra system for advanced mathematics.

The pack must distinguish internal document reasoning from claims about the external world. It may flag a statement as inconsistent with loaded basic knowledge, but it should say which pack fact or relation was used. It must not upgrade a plausible heuristic into a universal law.

## 3. Conceptual and scientific basis

Mathematical statements are represented as typed expressions and propositions with exact rational values where possible. Equations, inequalities and geometric constraints become solver-friendly terms. The pack separates symbolic expression structure from the source claim that states it. Verification uses exact arithmetic, finite search and small constraint kernels rather than floating-point guessing.

The practical ontology should favor event/state frames with typed roles over flat subject–predicate–object triples. Reified events make time, place, participants, causes, instruments, modality and evidence attachable without inventing a different predicate arity for every sentence. Claims and contexts remain separate from the situations they describe.

## 4. Ontology modules

The pack is divided into the following modules:

- numbers-arithmetic — integers, rationals, decimals, operations and order
- ratios-percentages — proportionality, rates and percent change
- algebra — variables, expressions, equations and inequalities
- geometry — points, lengths, angles, polygons, area and volume
- measurement — dimensions, units and conversions
- probability-statistics — finite outcomes, mean, median, mode and range
- proof-explanation — assumptions, steps, conclusions and counterexamples

The module boundaries are semantic and operational. A coding agent may split a large module further, but imports must preserve pack-qualified identities and avoid circular initialization.

## 5. Core concept inventory

- Number, Integer, Rational, DecimalApproximation
- Expression, Variable, Equation, Inequality
- Ratio, Rate, Percentage and Proportion
- Length, Area, Volume, Angle and Dimension
- GeometricFigure — line, triangle, quadrilateral, circle and solid
- Dataset, Observation, Mean, Median, Mode and Range
- FiniteExperiment, Outcome and Probability
- MathematicalClaim and DerivationStep

Concepts should include English lexicalizations and may add other languages in separate lexicon modules. Lexical forms are recognition aids; they do not define semantic identity.

## 6. Canonical frames and relations

- Add, Subtract, Multiply, Divide, Power and Root
- Equals, LessThan, GreaterThan and Between
- EquivalentExpression(exprA, exprB)
- HasMeasure(object, quantity)
- Perimeter, Area and Volume frames
- ProportionalTo and RateOfChange
- ProbabilityOf(event, experiment)
- DerivedFrom(step, premises)

Every frame declares role domains, ranges and cardinalities. Relations with inverses or symmetry properties register those laws in OntologyJS. Application-specific judgments remain in circuits.

## 7. Stable knowledge seed

The initial pack should encode a deliberately small, inspectable seed rather than an opaque encyclopaedia. Recommended seed categories are:

- integer and rational arithmetic laws
- division by zero is undefined
- percent means per hundred
- basic unit and dimensional conversion relations
- triangle angle sum in Euclidean geometry
- common area and volume formulas at lower-secondary level
- probability of a finite event lies between zero and one
- mean, median, mode and range definitions
- equality substitution and order-preserving operations under stated sign conditions

Pack facts are versioned and carry a provenance note such as `school-textbook-consensus`, `definition`, `unit-standard` or `design-convention`. Current, jurisdiction-dependent or contested facts are not part of the baseline pack.

## 8. Predefined circuit catalog

| Capability | Design |
|---|---|
| ArithmeticConsistencyFinding | recomputes explicit arithmetic and reports mismatches |
| EquationSatisfactionFinding | checks whether stated values satisfy an equation or inequality |
| PercentageRatioFinding | checks percentages, proportions, rates and base quantities |
| UnitDimensionFinding | checks compatible dimensions and declared conversions |
| GeometryFormulaFinding | checks lower-secondary perimeter, area, angle and volume claims |
| StatisticsExampleFinding | recomputes mean, median, mode and range from finite data |
| ProbabilityBoundFinding | checks finite probability claims and impossible values |
| DerivationStepFinding | checks local algebraic transformations and identifies the first unsupported step |
| MathExplanationPlan | produces CNL problem data, method, steps, result and check |

A circuit may use several methods. The table describes its semantic responsibility, not a rigid implementation class. For example, a consistency circuit may use indexed queries, a relation closure, a constraint network and a bounded symbolic witness search.

## 9. Controlled generation and planning

The pack contributes CNL frames and generation circuits for:

- worked-solution plans with givens, unknowns, formula, substitution and result
- CNL definitions and examples
- error explanations naming the first inconsistent step
- exercise-generation frames with bounded values and expected solution
- table/graph interpretation plans when data are materialized

Generated plans preserve the distinction between a pack fact, a source claim, an inferred relation and an open question. A downstream LLM may improve style, but it should receive the CNL plan plus immutable semantic constraints.

## 10. Intent recognition and profile behavior

Cheap and semantic intent signals include:

- digits, equations, percentages, units, geometric terms or datasets
- textbook exercises and worked examples
- requests to calculate, verify, compare or prove an elementary relation
- claims containing explicit numerical dependence

The pack descriptor declares these signals through fluent functions. Signal matches only influence loading and ranking; they do not produce findings. When this pack is loaded under `all-compatible`, every circuit whose prerequisites are satisfied is eligible. Domain-specific profiles may choose a smaller circuit subset.

## 11. Algorithm and implementation guidance

- use reduced BigInt rational pairs for exact arithmetic
- normalize decimals to rationals when finite and preserve stated precision separately
- represent algebraic expressions as canonical term DAGs and use directed rewrite rules
- solve simple linear equations by normalization and interval/difference constraints
- verify formulas by reconstructing expected expressions, not by lexical matching
- use bounded symbolic generation for exercise cases and boundary mutations
- record approximation tolerance only when source explicitly uses approximate values

All algorithms operate over SemanticStore handles and provenance-preserving views. A specialized view may be cached, but the store remains the logical authority. Procedural stages are allowed when they are simpler than forcing an algorithm into declarative primitives; the stage must declare semantic reads, writes and trace output.

## 12. Fluent pack shape

A pack is ordinary JavaScript, not a manifest object:

```js
import {
  ontology, entityKind, eventKind, role, relation,
  capability, domainPack, lexicalSignals, semanticSignals
} from "../../sdk/index.mjs";

const O = ontology("math-basic", "1.0.0");
export const Number = O.entity(entityKind("Number"));
export const Expression = O.entity(entityKind("Expression"));
export const Ratio = O.entity(entityKind("Ratio"));

export const ontologyModule = O.seal();

export default domainPack("math-basic")
  .ontology(ontologyModule)
  .recognize(
    lexicalSignals(/* pack-specific terms */),
    semanticSignals(/* pack-specific frame identities */)
  )
  .provide(capability("ArithmeticConsistencyFinding"))
  .provide(capability("EquationSatisfactionFinding"))
  .provide(capability("PercentageRatioFinding"))
  .targetKnowledgeLevel("lower-secondary")
  .seal();
```

The real implementation should define event/state frames, role constructors, lexicalizations, facts, circuits and tests in separate files as described below.

## 13. Required directory structure

```text
framework/packs/math-basic/
  pack.mjs
  ontologies/
    numbers-arithmetic.ontology.mjs
    ratios-percentages.ontology.mjs
    algebra.ontology.mjs
    geometry.ontology.mjs
    measurement.ontology.mjs
    probability-statistics.ontology.mjs
    proof-explanation.ontology.mjs
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

- exact and incorrect arithmetic
- fraction/decimal equivalence
- percentage with wrong base
- unit mismatch and valid conversion
- linear equation solution
- triangle angle and area examples
- mean versus median confusion
- probability outside [0,1]
- worked-solution CNL round-trip

Tests use Node's built-in test runner. Every finding test asserts evidence and trace dependencies. CNL tests assert frame slots and, where parsers exist, round-trip equivalence.

## 15. Limitations and extension policy

Advanced calculus, abstract algebra, non-Euclidean geometry, formal proof and numerical analysis are outside the baseline. Geometry assumes the declared model; statistical circuits do not infer causal conclusions. Approximate decimal comparisons require explicit tolerance and provenance.

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

Exact arithmetic, refinement types [FRE91][RON08], constraint propagation, term rewriting [BN98] and symbolic execution [KIN76].

## Appendix A. Minimum mathematical operation inventory

### A.1 Arithmetic and number representation

Implement exact integers and rationals with `BigInt`. Decimal source forms preserve scale and significant-digit metadata. Required operations are addition, subtraction, multiplication, division, integer exponentiation, absolute value, comparison, greatest common divisor, least common multiple and simplification. Roots may remain symbolic unless they simplify exactly.

### A.2 Ratios, rates and percentages

Represent a ratio with ordered compared quantities, a rate with numerator/denominator dimensions, and a percentage with an explicit base. Circuits must detect a correct percentage value applied to the wrong base, confusion between percentage points and percent change, and inversion of rates.

### A.3 Elementary algebra

Support variables, constants, sums, products, powers, equalities and inequalities. Directed normalization should flatten associative forms, order commutative operands canonically, combine rational constants and preserve noncommutative operators. Implement linear one-variable and small multi-variable equation solving through coefficient extraction and rational Gaussian elimination or interval propagation. Unsupported nonlinear forms remain symbolic.

### A.4 Geometry

Minimum figures: line segment, ray, angle, triangle, rectangle, square, parallelogram, trapezoid, circle, rectangular prism, cylinder and sphere. Required relations include parallel, perpendicular, congruent, similar, radius, diameter, perimeter, area and volume. Every formula circuit declares Euclidean/model assumptions.

### A.5 Statistics and probability

Implement finite datasets, count, sum, minimum, maximum, mean, median, mode, range and simple proportions. Probability circuits cover finite equally likely outcomes only when that assumption is explicit. Distinguish empirical frequency from theoretical probability.

### A.6 Required symbolic benchmark generators

Generate boundary cases for zero, one, negative values, equal bounds, just-below/just-above thresholds, unit conversions, repeated median values, empty datasets, division by zero and probability extremes. Every math circuit should have exact expected values in `.expected.mjs` fixtures.

