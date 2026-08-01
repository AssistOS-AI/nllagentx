# DS-010 — Physics Ontology and Circuits

**Status:** Normative predefined-pack specification  
**Pack identity:** `physics-basic`  
**Primary skills:** `nll-ontology, nll-circuit`  
**Depends on:** DS-000–DS-004  
**Testing:** DS-005  
**Evaluation:** DS-006


## 1. Role in the architecture

This pack is one modular source of ontology constructors, stable background knowledge, reusable circuits, CNL frames and intent-recognition metadata. It does not replace the common language ontology or the task-specific LongText interpretation. LongTextJS uses the pack's generated constructors to describe source claims; CircuitJS uses the same identities to query, derive and evaluate; IntentJS uses the pack descriptor to decide whether loading and execution are relevant.

The target breadth is comparable to a careful 12–14-year-old with ordinary lower-secondary education. The pack should be useful and conservative. It should recognize basic relationships and common errors, but it must report uncertainty rather than simulate expert knowledge. Every domain assertion is either a source-grounded claim, a declared pack fact, or a derived fact with provenance.

The pack is implemented entirely as `.mjs` modules with Node.js built-ins. It introduces no JSON or TypeScript artifacts and no third-party dependency. Ontologies, circuits and tests are written by coding agents using the SDK and the relevant nll-* skills.


## 2. Scope and non-goals

This pack covers school-level mechanics, energy, heat, waves, light, sound, electricity, magnetism and matter. It supports qualitative and simple quantitative checks. It does not model advanced relativity, quantum theory or expert engineering safety.

The pack must distinguish internal document reasoning from claims about the external world. It may flag a statement as inconsistent with loaded basic knowledge, but it should say which pack fact or relation was used. It must not upgrade a plausible heuristic into a universal law.

## 3. Conceptual and scientific basis

Physical descriptions are represented through objects, systems, interactions, state quantities and processes. The pack distinguishes definitions, idealized school models and empirical claims. Quantitative circuits rely on the mathematics and measurement packs; qualitative circuits use conservation, direction, order-of-magnitude and compatibility relations with explicit model assumptions.

The practical ontology should favor event/state frames with typed roles over flat subject–predicate–object triples. Reified events make time, place, participants, causes, instruments, modality and evidence attachable without inventing a different predicate arity for every sentence. Claims and contexts remain separate from the situations they describe.

## 4. Ontology modules

The pack is divided into the following modules:

- motion — position, distance, displacement, speed, velocity and acceleration
- forces — interaction, force, mass, weight, friction and equilibrium
- energy — kinetic, potential, transfer, work and power
- thermal — temperature, heat transfer and phase change
- waves — oscillation, frequency, wavelength, sound and light
- electricity-magnetism — charge, current, voltage, resistance, circuit and magnet
- models-units — system boundary, approximation, quantity dimensions and measurement

The module boundaries are semantic and operational. A coding agent may split a large module further, but imports must preserve pack-qualified identities and avoid circular initialization.

## 5. Core concept inventory

- PhysicalSystem, PhysicalBody and ParticleCollection
- Position, MotionState, Velocity and Acceleration
- Force, Interaction and EquilibriumState
- Energy, Work, Power and EnergyTransfer
- Temperature, HeatTransfer and PhaseState
- Wave, Frequency, Wavelength and Amplitude
- ElectricCharge, Current, Voltage, Resistance and ElectricCircuit
- Measurement, ModelAssumption and BoundaryCondition

Concepts should include English lexicalizations and may add other languages in separate lexicon modules. Lexical forms are recognition aids; they do not define semantic identity.

## 6. Canonical frames and relations

- Move(body, trajectory, interval)
- ExertsForce(source, target, vector)
- TransfersEnergy(source, target, amount, mechanism)
- Heats(source, target) and ChangesPhase(substance, from, to)
- Propagates(wave, medium, speed)
- Flows(current, circuitPath)
- MeasuredAs(quantity, value, unit, uncertainty)
- UnderModel(proposition, assumptionSet)

Every frame declares role domains, ranges and cardinalities. Relations with inverses or symmetry properties register those laws in OntologyJS. Application-specific judgments remain in circuits.

## 7. Stable knowledge seed

The initial pack should encode a deliberately small, inspectable seed rather than an opaque encyclopaedia. Recommended seed categories are:

- school-level definitions of speed, acceleration, force, work, power and common electrical quantities
- dimensional relations among basic quantities
- energy is transferred or transformed within a declared system model rather than created from nothing
- heat flows spontaneously from higher to lower temperature in the ordinary macroscopic model
- sound requires a material medium in the basic model; light can propagate through vacuum
- electric current requires a conductive closed path in the simple circuit model
- mass and weight are distinct quantities
- idealized laws apply under stated assumptions and tolerances

Pack facts are versioned and carry a provenance note such as `school-textbook-consensus`, `definition`, `unit-standard` or `design-convention`. Current, jurisdiction-dependent or contested facts are not part of the baseline pack.

## 8. Predefined circuit catalog

| Capability | Design |
|---|---|
| DimensionAndUnitFinding | checks physical dimensions and unit conversions |
| KinematicsFinding | checks speed, distance, time and simple acceleration relations |
| ForceBalanceFinding | checks stated equilibrium and net-force reasoning in simple diagrams/text |
| EnergyAccountingFinding | tracks declared energy transfers and flags unexplained creation/loss under a closed model |
| ThermalDirectionFinding | checks qualitative heat-flow and phase-change claims |
| WaveRelationFinding | checks frequency, wavelength and speed relations in declared media |
| SimpleCircuitFinding | checks closed-path, series/parallel and basic Ohm-law claims |
| ModelAssumptionFinding | warns when an idealized relation is presented without required assumptions |
| PhysicsExplanationPlan | produces system, givens, law, calculation, result and limitations |

A circuit may use several methods. The table describes its semantic responsibility, not a rigid implementation class. For example, a consistency circuit may use indexed queries, a relation closure, a constraint network and a bounded symbolic witness search.

## 9. Controlled generation and planning

The pack contributes CNL frames and generation circuits for:

- school-level experiment and explanation plans
- problem-solving CNL frames with system boundary and assumptions
- unit-aware worked examples
- clarification questions for missing medium, force direction or circuit topology
- safety-neutral descriptions; hazardous procedural generation is outside the pack

Generated plans preserve the distinction between a pack fact, a source claim, an inferred relation and an open question. A downstream LLM may improve style, but it should receive the CNL plan plus immutable semantic constraints.

## 10. Intent recognition and profile behavior

Cheap and semantic intent signals include:

- physical quantities and units
- motion, force, energy, temperature, waves or circuits
- textbook problems, experiment reports and manuals
- requests for physical plausibility or formula verification

The pack descriptor declares these signals through fluent functions. Signal matches only influence loading and ranking; they do not produce findings. When this pack is loaded under `all-compatible`, every circuit whose prerequisites are satisfied is eligible. Domain-specific profiles may choose a smaller circuit subset.

## 11. Algorithm and implementation guidance

- reuse exact rational quantity and dimension primitives from math-basic
- build small constraint systems for formulas and inequalities
- represent vectors at minimum by magnitude plus declared direction relation; avoid implicit coordinate arithmetic unless supplied
- use transition summaries for energy and state changes
- apply conservation only within a declared system boundary and model
- use bounded state/trace checks for simple electric circuits and experiment procedures
- mark qualitative defaults and idealizations explicitly in findings

All algorithms operate over SemanticStore handles and provenance-preserving views. A specialized view may be cached, but the store remains the logical authority. Procedural stages are allowed when they are simpler than forcing an algorithm into declarative primitives; the stage must declare semantic reads, writes and trace output.

## 12. Fluent pack shape

A pack is ordinary JavaScript, not a manifest object:

```js
import {
  ontology, entityKind, eventKind, role, relation,
  capability, domainPack, lexicalSignals, semanticSignals
} from "../../sdk/index.mjs";

const O = ontology("physics-basic", "1.0.0");
export const PhysicalSystem = O.entity(entityKind("PhysicalSystem"));
export const Position = O.entity(entityKind("Position"));
export const Force = O.entity(entityKind("Force"));

export const ontologyModule = O.seal();

export default domainPack("physics-basic")
  .ontology(ontologyModule)
  .recognize(
    lexicalSignals(/* pack-specific terms */),
    semanticSignals(/* pack-specific frame identities */)
  )
  .provide(capability("DimensionAndUnitFinding"))
  .provide(capability("KinematicsFinding"))
  .provide(capability("ForceBalanceFinding"))
  .targetKnowledgeLevel("lower-secondary")
  .seal();
```

The real implementation should define event/state frames, role constructors, lexicalizations, facts, circuits and tests in separate files as described below.

## 13. Required directory structure

```text
framework/packs/physics-basic/
  pack.mjs
  ontologies/
    motion.ontology.mjs
    forces.ontology.mjs
    energy.ontology.mjs
    thermal.ontology.mjs
    waves.ontology.mjs
    electricity-magnetism.ontology.mjs
    models-units.ontology.mjs
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

- mass versus weight
- distance-speed-time calculation
- unit/dimension mismatch
- balanced and unbalanced forces
- energy accounting with open versus closed system
- heat-flow direction
- sound/light medium distinction
- simple open and closed electric circuits
- model assumption omitted
- CNL experiment plan

Tests use Node's built-in test runner. Every finding test asserts evidence and trace dependencies. CNL tests assert frame slots and, where parsers exist, round-trip equivalence.

## 15. Limitations and extension policy

Many physical laws require ideal conditions and continuous mathematics beyond the pack. The baseline should not reject a real phenomenon merely because it lies outside a school model. Findings must name the model assumptions. Engineering design, medical radiation advice and hazardous experiments require specialized packs.

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

Qualitative physics models, dimensional analysis, constraint solving, transition systems and monitor automata [HAV02][LEU09].

## Appendix A. Minimum school-physics model inventory

### A.1 Mechanics

Implement scalar distance, vector-like displacement with declared direction, speed, velocity, acceleration, mass, force, weight, momentum at an optional extension level, work, energy and power. Required formula frames include constant-speed distance, average speed, simple constant acceleration, `F = m a`, work as force times displacement under aligned-force assumptions, and power as work/energy per time.

### A.2 Energy and system boundary

Every conservation check requires a `PhysicalSystemBoundary`. Energy forms may include kinetic, gravitational potential, elastic, thermal, chemical, electrical, light and sound. The baseline circuit checks accounting identities and transfer descriptions; it does not claim exact conservation when the source omits relevant transfers or uses an open system.

### A.3 Thermal and matter

Implement temperature, thermal energy/heat transfer, heating, cooling, melting, freezing, boiling, condensing and ordinary conduction/convection/radiation categories. Distinguish temperature from heat. Phase-change checks require the material and conditions when the claim is quantitative.

### A.4 Waves, sound and light

Represent wave source, medium, propagation, frequency, period, wavelength, amplitude and speed. Implement the school relation `speed = frequency × wavelength`. Distinguish mechanical waves from electromagnetic light in vacuum. Reflection, refraction and absorption can be qualitative frames.

### A.5 Electricity

Represent source, conductor, load, switch, path, current, voltage and resistance. Implement graph-based closed-path checks and simple series/parallel topology. Ohm's law applies only to a declared simple resistive component/model. Do not infer household electrical safety.

### A.6 Experimental reasoning

Add frames for independent variable, dependent variable, controlled condition, measurement, uncertainty and repeated observation. Circuits check whether a claimed conclusion corresponds to the manipulated/measured quantities and whether a source confuses measurement with explanation.

