# Circuit Catalog

Resolved circuits: 25.

| Circuit | Requires | Provides | Stages | Assurance |
| --- | --- | --- | ---: | --- |
| `circuit:core-language.CoreGroundingFinding@1.0.0` | — | `CoreGroundingFinding`, `evidence-bearing`, `interpretation-aware` | 1 | concrete |
| `circuit:logic-basic.DirectContradictionFinding@1.0.0` | `logic-basic.propositions:Proposition` | `DirectContradictionFinding`, `evidence-bearing`, `interpretation-aware` | 1 | concrete |
| `circuit:logic-basic.LocalEntailmentFinding@1.0.0` | `logic-basic.propositions:Proposition` | `LocalEntailmentFinding`, `evidence-bearing`, `interpretation-aware` | 1 | concrete |
| `circuit:logic-basic.QuantifierScopeFinding@1.0.0` | `logic-basic.quantifiers:Universal` | `QuantifierScopeFinding`, `evidence-bearing`, `interpretation-aware` | 1 | concrete |
| `circuit:logic-basic.ModalConfusionFinding@1.0.0` | `logic-basic.modality:ModalProposition` | `ModalConfusionFinding`, `evidence-bearing`, `interpretation-aware` | 1 | concrete |
| `circuit:logic-basic.EqualitySubstitutionFinding@1.0.0` | `logic-basic.predicates-terms:Term` | `EqualitySubstitutionFinding`, `evidence-bearing`, `interpretation-aware` | 1 | concrete |
| `circuit:logic-basic.ConsistencySetCircuit@1.0.0` | `logic-basic.propositions:Proposition` | `ConsistencySetCircuit`, `evidence-bearing`, `interpretation-aware` | 1 | concrete |
| `circuit:logic-basic.ProofStepCircuit@1.0.0` | `logic-basic.proof-steps:ProofStep` | `ProofStepCircuit`, `evidence-bearing`, `interpretation-aware` | 1 | concrete |
| `circuit:logic-basic.LogicExplanationPlan@1.0.0` | — | `LogicExplanationPlan`, `plan-explainable` | 1 | concrete |
| `circuit:reasoning-errors.ContradictionClassifier@1.0.0` | `reasoning-errors.argument-structure:Argument` | `ContradictionClassifier`, `evidence-bearing`, `interpretation-aware` | 1 | concrete |
| `circuit:reasoning-errors.AffirmingConsequentFinding@1.0.0` | `reasoning-errors.argument-structure:Inference` | `AffirmingConsequentFinding`, `evidence-bearing`, `interpretation-aware` | 1 | concrete |
| `circuit:reasoning-errors.DenyingAntecedentFinding@1.0.0` | `reasoning-errors.argument-structure:Inference` | `DenyingAntecedentFinding`, `evidence-bearing`, `interpretation-aware` | 1 | concrete |
| `circuit:reasoning-errors.CircularReasoningFinding@1.0.0` | `reasoning-errors.argument-structure:Argument` | `CircularReasoningFinding`, `evidence-bearing`, `interpretation-aware` | 1 | concrete |
| `circuit:reasoning-errors.EquivocationFinding@1.0.0` | `reasoning-errors.definition-use:TermSense` | `EquivocationFinding`, `evidence-bearing`, `interpretation-aware` | 1 | concrete |
| `circuit:reasoning-errors.FalseDilemmaFinding@1.0.0` | `reasoning-errors.argument-structure:Argument` | `FalseDilemmaFinding`, `evidence-bearing`, `interpretation-aware` | 1 | concrete |
| `circuit:reasoning-errors.HastyGeneralizationFinding@1.0.0` | `reasoning-errors.generalization:GeneralizationClaim` | `HastyGeneralizationFinding`, `evidence-bearing`, `interpretation-aware` | 1 | concrete |
| `circuit:reasoning-errors.CorrelationCausationFinding@1.0.0` | `reasoning-errors.causality:CausalClaim` | `CorrelationCausationFinding`, `evidence-bearing`, `interpretation-aware` | 1 | concrete |
| `circuit:reasoning-errors.AdHominemFinding@1.0.0` | `reasoning-errors.dialogue:OpponentPosition` | `AdHominemFinding`, `evidence-bearing`, `interpretation-aware` | 1 | concrete |
| `circuit:reasoning-errors.AppealToAuthorityFinding@1.0.0` | `reasoning-errors.evidence-authority:SourceAuthority` | `AppealToAuthorityFinding`, `evidence-bearing`, `interpretation-aware` | 1 | concrete |
| `circuit:reasoning-errors.StrawManFinding@1.0.0` | `reasoning-errors.dialogue:ReconstructedClaim` | `StrawManFinding`, `evidence-bearing`, `interpretation-aware` | 1 | concrete |
| `circuit:reasoning-errors.SlipperySlopeFinding@1.0.0` | `reasoning-errors.causality:CausalClaim` | `SlipperySlopeFinding`, `evidence-bearing`, `interpretation-aware` | 1 | concrete |
| `circuit:reasoning-errors.CompositionDivisionFinding@1.0.0` | `reasoning-errors.generalization:GeneralizationClaim` | `CompositionDivisionFinding`, `evidence-bearing`, `interpretation-aware` | 1 | concrete |
| `circuit:reasoning-errors.BaseRateAndSelectionWarning@1.0.0` | `reasoning-errors.generalization:Sample` | `BaseRateAndSelectionWarning`, `evidence-bearing`, `interpretation-aware` | 1 | concrete |
| `circuit:reasoning-errors.ArgumentRepairPlan@1.0.0` | — | `ArgumentRepairPlan`, `plan-explainable` | 1 | concrete |
| `circuit:example.facility-order@1.0.0` | `AlarmEvent`, `OpeningEvent` | `FacilityOrderFinding`, `evidence-bearing` | 3 | abstract-preflight, symbolic-decision-coverage |
