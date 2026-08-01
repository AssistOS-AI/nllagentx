# Ontology Catalog

Resolved ontology modules: 15.

## core-language 1.0.0

Identity: `ontology:core-language@1.0.0`. Concepts: 12. Roles: 15.

| Concept | Sort | Parents | Capabilities |
| --- | --- | --- | --- |
| `core-language:SemanticEntity` | Entity | — | `SemanticEntity` |
| `core-language:Agent` | Entity | `core-language:SemanticEntity` | — |
| `core-language:PhysicalObject` | Entity | `core-language:SemanticEntity` | — |
| `core-language:Place` | Entity | `core-language:SemanticEntity` | — |
| `core-language:InformationArtifact` | Entity | `core-language:SemanticEntity` | — |
| `core-language:Proposition` | Proposition | — | `Proposition` |
| `core-language:Event` | Event | — | `Event` |
| `core-language:State` | State | — | `State` |
| `core-language:TimeValue` | Value | — | — |
| `core-language:QuantityValue` | Value | — | — |
| `core-language:Context` | Entity | — | — |
| `core-language:Evidence` | Entity | — | — |

## logic-basic.propositions 1.0.0

Identity: `ontology:logic-basic.propositions@1.0.0`. Concepts: 13. Roles: 0.

| Concept | Sort | Parents | Capabilities |
| --- | --- | --- | --- |
| `logic-basic.propositions:Proposition` | Entity | — | `Proposition` |
| `logic-basic.propositions:AtomicProposition` | Entity | — | `AtomicProposition` |
| `logic-basic.propositions:CompoundProposition` | Entity | — | `CompoundProposition` |
| `logic-basic.propositions:Implication` | Entity | — | `Implication` |
| `logic-basic.propositions:Equivalence` | Entity | — | `Equivalence` |
| `logic-basic.propositions:Conjunction` | Entity | — | `Conjunction` |
| `logic-basic.propositions:Disjunction` | Entity | — | `Disjunction` |
| `logic-basic.propositions:Negation` | Entity | — | `Negation` |
| `logic-basic.propositions:And` | Event | — | `And` |
| `logic-basic.propositions:Or` | Event | — | `Or` |
| `logic-basic.propositions:Not` | Event | — | `Not` |
| `logic-basic.propositions:Implies` | Event | — | `Implies` |
| `logic-basic.propositions:Equivalent` | Event | — | `Equivalent` |

## logic-basic.predicates-terms 1.0.0

Identity: `ontology:logic-basic.predicates-terms@1.0.0`. Concepts: 4. Roles: 0.

| Concept | Sort | Parents | Capabilities |
| --- | --- | --- | --- |
| `logic-basic.predicates-terms:Predicate` | Entity | — | `Predicate` |
| `logic-basic.predicates-terms:Term` | Entity | — | `Term` |
| `logic-basic.predicates-terms:Variable` | Entity | — | `Variable` |
| `logic-basic.predicates-terms:Constant` | Entity | — | `Constant` |

## logic-basic.quantifiers 1.0.0

Identity: `ontology:logic-basic.quantifiers@1.0.0`. Concepts: 8. Roles: 0.

| Concept | Sort | Parents | Capabilities |
| --- | --- | --- | --- |
| `logic-basic.quantifiers:Universal` | Entity | — | `Universal` |
| `logic-basic.quantifiers:Existential` | Entity | — | `Existential` |
| `logic-basic.quantifiers:CardinalityQuantifier` | Entity | — | `CardinalityQuantifier` |
| `logic-basic.quantifiers:ForAll` | Event | — | `ForAll` |
| `logic-basic.quantifiers:Exists` | Event | — | `Exists` |
| `logic-basic.quantifiers:Exactly` | Event | — | `Exactly` |
| `logic-basic.quantifiers:AtLeast` | Event | — | `AtLeast` |
| `logic-basic.quantifiers:AtMost` | Event | — | `AtMost` |

## logic-basic.modality 1.0.0

Identity: `ontology:logic-basic.modality@1.0.0`. Concepts: 7. Roles: 0.

| Concept | Sort | Parents | Capabilities |
| --- | --- | --- | --- |
| `logic-basic.modality:ModalProposition` | Entity | — | `ModalProposition` |
| `logic-basic.modality:ModalOperator` | Entity | — | `ModalOperator` |
| `logic-basic.modality:Necessary` | Event | — | `Necessary` |
| `logic-basic.modality:Possible` | Event | — | `Possible` |
| `logic-basic.modality:Obligatory` | Event | — | `Obligatory` |
| `logic-basic.modality:Permitted` | Event | — | `Permitted` |
| `logic-basic.modality:Believed` | Event | — | `Believed` |

## logic-basic.natural-logic 1.0.0

Identity: `ontology:logic-basic.natural-logic@1.0.0`. Concepts: 4. Roles: 0.

| Concept | Sort | Parents | Capabilities |
| --- | --- | --- | --- |
| `logic-basic.natural-logic:EntailmentRelation` | Entity | — | `EntailmentRelation` |
| `logic-basic.natural-logic:ContradictionRelation` | Entity | — | `ContradictionRelation` |
| `logic-basic.natural-logic:Entails` | Event | — | `Entails` |
| `logic-basic.natural-logic:Contradicts` | Event | — | `Contradicts` |

## logic-basic.proof-steps 1.0.0

Identity: `ontology:logic-basic.proof-steps@1.0.0`. Concepts: 5. Roles: 0.

| Concept | Sort | Parents | Capabilities |
| --- | --- | --- | --- |
| `logic-basic.proof-steps:Premise` | Entity | — | `Premise` |
| `logic-basic.proof-steps:Conclusion` | Entity | — | `Conclusion` |
| `logic-basic.proof-steps:ProofStep` | Entity | — | `ProofStep` |
| `logic-basic.proof-steps:Countermodel` | Entity | — | `Countermodel` |
| `logic-basic.proof-steps:UsesRule` | Event | — | `UsesRule` |

## logic-basic.four-valued 1.0.0

Identity: `ontology:logic-basic.four-valued@1.0.0`. Concepts: 1. Roles: 0.

| Concept | Sort | Parents | Capabilities |
| --- | --- | --- | --- |
| `logic-basic.four-valued:LogicValue` | Entity | — | `LogicValue` |

## reasoning-errors.argument-structure 1.0.0

Identity: `ontology:reasoning-errors.argument-structure@1.0.0`. Concepts: 7. Roles: 0.

| Concept | Sort | Parents | Capabilities |
| --- | --- | --- | --- |
| `reasoning-errors.argument-structure:Argument` | Entity | — | `Argument` |
| `reasoning-errors.argument-structure:Premise` | Entity | — | `Premise` |
| `reasoning-errors.argument-structure:Conclusion` | Entity | — | `Conclusion` |
| `reasoning-errors.argument-structure:Inference` | Entity | — | `Inference` |
| `reasoning-errors.argument-structure:MissingPremise` | Entity | — | `MissingPremise` |
| `reasoning-errors.argument-structure:Supports` | Event | — | `Supports` |
| `reasoning-errors.argument-structure:Attacks` | Event | — | `Attacks` |

## reasoning-errors.definition-use 1.0.0

Identity: `ontology:reasoning-errors.definition-use@1.0.0`. Concepts: 4. Roles: 0.

| Concept | Sort | Parents | Capabilities |
| --- | --- | --- | --- |
| `reasoning-errors.definition-use:DefinitionUse` | Entity | — | `DefinitionUse` |
| `reasoning-errors.definition-use:TermSense` | Entity | — | `TermSense` |
| `reasoning-errors.definition-use:Defines` | Event | — | `Defines` |
| `reasoning-errors.definition-use:UsesSense` | Event | — | `UsesSense` |

## reasoning-errors.evidence-authority 1.0.0

Identity: `ontology:reasoning-errors.evidence-authority@1.0.0`. Concepts: 4. Roles: 0.

| Concept | Sort | Parents | Capabilities |
| --- | --- | --- | --- |
| `reasoning-errors.evidence-authority:EvidenceRelation` | Entity | — | `EvidenceRelation` |
| `reasoning-errors.evidence-authority:SourceAuthority` | Entity | — | `SourceAuthority` |
| `reasoning-errors.evidence-authority:BurdenOfSupport` | Entity | — | `BurdenOfSupport` |
| `reasoning-errors.evidence-authority:Cites` | Event | — | `Cites` |

## reasoning-errors.causality 1.0.0

Identity: `ontology:reasoning-errors.causality@1.0.0`. Concepts: 4. Roles: 0.

| Concept | Sort | Parents | Capabilities |
| --- | --- | --- | --- |
| `reasoning-errors.causality:CausalClaim` | Entity | — | `CausalClaim` |
| `reasoning-errors.causality:CorrelationClaim` | Entity | — | `CorrelationClaim` |
| `reasoning-errors.causality:AlternativeExplanation` | Entity | — | `AlternativeExplanation` |
| `reasoning-errors.causality:AttributesCause` | Event | — | `AttributesCause` |

## reasoning-errors.generalization 1.0.0

Identity: `ontology:reasoning-errors.generalization@1.0.0`. Concepts: 5. Roles: 0.

| Concept | Sort | Parents | Capabilities |
| --- | --- | --- | --- |
| `reasoning-errors.generalization:GeneralizationClaim` | Entity | — | `GeneralizationClaim` |
| `reasoning-errors.generalization:Sample` | Entity | — | `Sample` |
| `reasoning-errors.generalization:Population` | Entity | — | `Population` |
| `reasoning-errors.generalization:Counterexample` | Entity | — | `Counterexample` |
| `reasoning-errors.generalization:GeneralizesFrom` | Event | — | `GeneralizesFrom` |

## reasoning-errors.dialogue 1.0.0

Identity: `ontology:reasoning-errors.dialogue@1.0.0`. Concepts: 3. Roles: 0.

| Concept | Sort | Parents | Capabilities |
| --- | --- | --- | --- |
| `reasoning-errors.dialogue:OpponentPosition` | Entity | — | `OpponentPosition` |
| `reasoning-errors.dialogue:ReconstructedClaim` | Entity | — | `ReconstructedClaim` |
| `reasoning-errors.dialogue:RepresentsOpponent` | Event | — | `RepresentsOpponent` |

## reasoning-errors.error-patterns 1.0.0

Identity: `ontology:reasoning-errors.error-patterns@1.0.0`. Concepts: 1. Roles: 0.

| Concept | Sort | Parents | Capabilities |
| --- | --- | --- | --- |
| `reasoning-errors.error-patterns:ReasoningErrorPattern` | Entity | — | `ReasoningErrorPattern` |

