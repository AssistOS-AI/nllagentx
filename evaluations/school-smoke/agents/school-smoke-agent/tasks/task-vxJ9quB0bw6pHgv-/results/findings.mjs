import { findingResult, findingSet } from "../../../../../../../framework/sdk/circuit/results.mjs";

export default findingSet(
  findingResult("CoreGroundingFinding.not-applicable", "NOT_APPLICABLE", [], { "requiredConcepts": ["Proposition"] }, "", "circuit:core-language.CoreGroundingFinding@1.0.0"),
  findingResult("ConsistencySetCircuit.not-applicable", "NOT_APPLICABLE", [], { "requiredConcepts": ["logic-basic.propositions:Proposition"] }, "", "circuit:logic-basic.ConsistencySetCircuit@1.0.0"),
  findingResult("DirectContradictionFinding.not-applicable", "NOT_APPLICABLE", [], { "requiredConcepts": ["logic-basic.propositions:Proposition"] }, "", "circuit:logic-basic.DirectContradictionFinding@1.0.0"),
  findingResult("EqualitySubstitutionFinding.not-applicable", "NOT_APPLICABLE", [], { "requiredConcepts": ["logic-basic.natural-logic:Term"] }, "", "circuit:logic-basic.EqualitySubstitutionFinding@1.0.0"),
  findingResult("LocalEntailmentFinding.not-applicable", "NOT_APPLICABLE", [], { "requiredConcepts": ["logic-basic.propositions:Proposition"] }, "", "circuit:logic-basic.LocalEntailmentFinding@1.0.0"),
  findingResult("ModalConfusionFinding.not-applicable", "NOT_APPLICABLE", [], { "requiredConcepts": ["logic-basic.predicates-terms:ModalProposition"] }, "", "circuit:logic-basic.ModalConfusionFinding@1.0.0"),
  findingResult("ProofStepCircuit.not-applicable", "NOT_APPLICABLE", [], { "requiredConcepts": ["logic-basic.propositions:ProofStep"] }, "", "circuit:logic-basic.ProofStepCircuit@1.0.0"),
  findingResult("QuantifierScopeFinding.not-applicable", "NOT_APPLICABLE", [], { "requiredConcepts": ["logic-basic.propositions:Universal"] }, "", "circuit:logic-basic.QuantifierScopeFinding@1.0.0"),
  findingResult("AdHominemFinding.not-applicable", "NOT_APPLICABLE", [], { "requiredConcepts": ["reasoning-errors.argument-structure:OpponentPosition"] }, "", "circuit:reasoning-errors.AdHominemFinding@1.0.0"),
  findingResult("AffirmingConsequentFinding.not-applicable", "NOT_APPLICABLE", [], { "requiredConcepts": ["reasoning-errors.causality:Inference"] }, "", "circuit:reasoning-errors.AffirmingConsequentFinding@1.0.0"),
  findingResult("AppealToAuthorityFinding.not-applicable", "NOT_APPLICABLE", [], { "requiredConcepts": ["reasoning-errors.dialogue:SourceAuthority"] }, "", "circuit:reasoning-errors.AppealToAuthorityFinding@1.0.0"),
  findingResult("BaseRateAndSelectionWarning.not-applicable", "NOT_APPLICABLE", [], { "requiredConcepts": ["reasoning-errors.dialogue:Sample"] }, "", "circuit:reasoning-errors.BaseRateAndSelectionWarning@1.0.0"),
  findingResult("CircularReasoningFinding.not-applicable", "NOT_APPLICABLE", [], { "requiredConcepts": ["reasoning-errors.argument-structure:Argument"] }, "", "circuit:reasoning-errors.CircularReasoningFinding@1.0.0"),
  findingResult("CompositionDivisionFinding.not-applicable", "NOT_APPLICABLE", [], { "requiredConcepts": ["reasoning-errors.generalization:GeneralizationClaim"] }, "", "circuit:reasoning-errors.CompositionDivisionFinding@1.0.0"),
  findingResult("ContradictionClassifier.not-applicable", "NOT_APPLICABLE", [], { "requiredConcepts": ["reasoning-errors.argument-structure:Argument"] }, "", "circuit:reasoning-errors.ContradictionClassifier@1.0.0"),
  findingResult("CorrelationCausationFinding.not-applicable", "NOT_APPLICABLE", [], { "requiredConcepts": ["reasoning-errors.definition-use:CausalClaim"] }, "", "circuit:reasoning-errors.CorrelationCausationFinding@1.0.0"),
  findingResult("DenyingAntecedentFinding.not-applicable", "NOT_APPLICABLE", [], { "requiredConcepts": ["reasoning-errors.causality:Inference"] }, "", "circuit:reasoning-errors.DenyingAntecedentFinding@1.0.0"),
  findingResult("EquivocationFinding.not-applicable", "NOT_APPLICABLE", [], { "requiredConcepts": ["reasoning-errors.argument-structure:TermSense"] }, "", "circuit:reasoning-errors.EquivocationFinding@1.0.0"),
  findingResult("FalseDilemmaFinding.not-applicable", "NOT_APPLICABLE", [], { "requiredConcepts": ["reasoning-errors.argument-structure:Argument"] }, "", "circuit:reasoning-errors.FalseDilemmaFinding@1.0.0"),
  findingResult("HastyGeneralizationFinding.not-applicable", "NOT_APPLICABLE", [], { "requiredConcepts": ["reasoning-errors.generalization:GeneralizationClaim"] }, "", "circuit:reasoning-errors.HastyGeneralizationFinding@1.0.0"),
  findingResult("SlipperySlopeFinding.not-applicable", "NOT_APPLICABLE", [], { "requiredConcepts": ["reasoning-errors.definition-use:CausalClaim"] }, "", "circuit:reasoning-errors.SlipperySlopeFinding@1.0.0"),
  findingResult("StrawManFinding.not-applicable", "NOT_APPLICABLE", [], { "requiredConcepts": ["reasoning-errors.definition-use:ReconstructedClaim"] }, "", "circuit:reasoning-errors.StrawManFinding@1.0.0")
);
