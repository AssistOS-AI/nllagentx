# Ontology Catalog

Resolved ontology modules: 16.

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

Identity: `ontology:logic-basic.propositions@1.0.0`. Concepts: 7. Roles: 0.

| Concept | Sort | Parents | Capabilities |
| --- | --- | --- | --- |
| `logic-basic.propositions:Proposition` | Entity | — | `Proposition` |
| `logic-basic.propositions:Universal` | Entity | — | `Universal` |
| `logic-basic.propositions:Negation` | Entity | — | `Negation` |
| `logic-basic.propositions:ProofStep` | Entity | — | `ProofStep` |
| `logic-basic.propositions:And` | Event | — | `And` |
| `logic-basic.propositions:Exactly` | Event | — | `Exactly` |
| `logic-basic.propositions:Believed` | Event | — | `Believed` |

## logic-basic.predicates-terms 1.0.0

Identity: `ontology:logic-basic.predicates-terms@1.0.0`. Concepts: 7. Roles: 0.

| Concept | Sort | Parents | Capabilities |
| --- | --- | --- | --- |
| `logic-basic.predicates-terms:AtomicProposition` | Entity | — | `AtomicProposition` |
| `logic-basic.predicates-terms:Existential` | Entity | — | `Existential` |
| `logic-basic.predicates-terms:ModalProposition` | Entity | — | `ModalProposition` |
| `logic-basic.predicates-terms:Countermodel` | Entity | — | `Countermodel` |
| `logic-basic.predicates-terms:Or` | Event | — | `Or` |
| `logic-basic.predicates-terms:AtLeast` | Event | — | `AtLeast` |
| `logic-basic.predicates-terms:Entails` | Event | — | `Entails` |

## logic-basic.quantifiers 1.0.0

Identity: `ontology:logic-basic.quantifiers@1.0.0`. Concepts: 7. Roles: 0.

| Concept | Sort | Parents | Capabilities |
| --- | --- | --- | --- |
| `logic-basic.quantifiers:CompoundProposition` | Entity | — | `CompoundProposition` |
| `logic-basic.quantifiers:CardinalityQuantifier` | Entity | — | `CardinalityQuantifier` |
| `logic-basic.quantifiers:ModalOperator` | Entity | — | `ModalOperator` |
| `logic-basic.quantifiers:LogicValue` | Entity | — | `LogicValue` |
| `logic-basic.quantifiers:Not` | Event | — | `Not` |
| `logic-basic.quantifiers:AtMost` | Event | — | `AtMost` |
| `logic-basic.quantifiers:Contradicts` | Event | — | `Contradicts` |

## logic-basic.modality 1.0.0

Identity: `ontology:logic-basic.modality@1.0.0`. Concepts: 6. Roles: 0.

| Concept | Sort | Parents | Capabilities |
| --- | --- | --- | --- |
| `logic-basic.modality:Predicate` | Entity | — | `Predicate` |
| `logic-basic.modality:Implication` | Entity | — | `Implication` |
| `logic-basic.modality:EntailmentRelation` | Entity | — | `EntailmentRelation` |
| `logic-basic.modality:Implies` | Event | — | `Implies` |
| `logic-basic.modality:Necessary` | Event | — | `Necessary` |
| `logic-basic.modality:UsesRule` | Event | — | `UsesRule` |

## logic-basic.natural-logic 1.0.0

Identity: `ontology:logic-basic.natural-logic@1.0.0`. Concepts: 5. Roles: 0.

| Concept | Sort | Parents | Capabilities |
| --- | --- | --- | --- |
| `logic-basic.natural-logic:Term` | Entity | — | `Term` |
| `logic-basic.natural-logic:Equivalence` | Entity | — | `Equivalence` |
| `logic-basic.natural-logic:ContradictionRelation` | Entity | — | `ContradictionRelation` |
| `logic-basic.natural-logic:Equivalent` | Event | — | `Equivalent` |
| `logic-basic.natural-logic:Possible` | Event | — | `Possible` |

## logic-basic.proof-steps 1.0.0

Identity: `ontology:logic-basic.proof-steps@1.0.0`. Concepts: 5. Roles: 0.

| Concept | Sort | Parents | Capabilities |
| --- | --- | --- | --- |
| `logic-basic.proof-steps:Variable` | Entity | — | `Variable` |
| `logic-basic.proof-steps:Conjunction` | Entity | — | `Conjunction` |
| `logic-basic.proof-steps:Premise` | Entity | — | `Premise` |
| `logic-basic.proof-steps:ForAll` | Event | — | `ForAll` |
| `logic-basic.proof-steps:Obligatory` | Event | — | `Obligatory` |

## logic-basic.four-valued 1.0.0

Identity: `ontology:logic-basic.four-valued@1.0.0`. Concepts: 5. Roles: 0.

| Concept | Sort | Parents | Capabilities |
| --- | --- | --- | --- |
| `logic-basic.four-valued:Constant` | Entity | — | `Constant` |
| `logic-basic.four-valued:Disjunction` | Entity | — | `Disjunction` |
| `logic-basic.four-valued:Conclusion` | Entity | — | `Conclusion` |
| `logic-basic.four-valued:Exists` | Event | — | `Exists` |
| `logic-basic.four-valued:Permitted` | Event | — | `Permitted` |

## reasoning-errors.argument-structure 1.0.0

Identity: `ontology:reasoning-errors.argument-structure@1.0.0`. Concepts: 5. Roles: 0.

| Concept | Sort | Parents | Capabilities |
| --- | --- | --- | --- |
| `reasoning-errors.argument-structure:Argument` | Entity | — | `Argument` |
| `reasoning-errors.argument-structure:TermSense` | Entity | — | `TermSense` |
| `reasoning-errors.argument-structure:OpponentPosition` | Entity | — | `OpponentPosition` |
| `reasoning-errors.argument-structure:Supports` | Event | — | `Supports` |
| `reasoning-errors.argument-structure:RepresentsOpponent` | Event | — | `RepresentsOpponent` |

## reasoning-errors.definition-use 1.0.0

Identity: `ontology:reasoning-errors.definition-use@1.0.0`. Concepts: 4. Roles: 0.

| Concept | Sort | Parents | Capabilities |
| --- | --- | --- | --- |
| `reasoning-errors.definition-use:Premise` | Entity | — | `Premise` |
| `reasoning-errors.definition-use:CausalClaim` | Entity | — | `CausalClaim` |
| `reasoning-errors.definition-use:ReconstructedClaim` | Entity | — | `ReconstructedClaim` |
| `reasoning-errors.definition-use:Attacks` | Event | — | `Attacks` |

## reasoning-errors.evidence-authority 1.0.0

Identity: `ontology:reasoning-errors.evidence-authority@1.0.0`. Concepts: 4. Roles: 0.

| Concept | Sort | Parents | Capabilities |
| --- | --- | --- | --- |
| `reasoning-errors.evidence-authority:Conclusion` | Entity | — | `Conclusion` |
| `reasoning-errors.evidence-authority:CorrelationClaim` | Entity | — | `CorrelationClaim` |
| `reasoning-errors.evidence-authority:ReasoningErrorPattern` | Entity | — | `ReasoningErrorPattern` |
| `reasoning-errors.evidence-authority:Defines` | Event | — | `Defines` |

## reasoning-errors.causality 1.0.0

Identity: `ontology:reasoning-errors.causality@1.0.0`. Concepts: 4. Roles: 0.

| Concept | Sort | Parents | Capabilities |
| --- | --- | --- | --- |
| `reasoning-errors.causality:Inference` | Entity | — | `Inference` |
| `reasoning-errors.causality:AlternativeExplanation` | Entity | — | `AlternativeExplanation` |
| `reasoning-errors.causality:Counterexample` | Entity | — | `Counterexample` |
| `reasoning-errors.causality:UsesSense` | Event | — | `UsesSense` |

## reasoning-errors.generalization 1.0.0

Identity: `ontology:reasoning-errors.generalization@1.0.0`. Concepts: 4. Roles: 0.

| Concept | Sort | Parents | Capabilities |
| --- | --- | --- | --- |
| `reasoning-errors.generalization:EvidenceRelation` | Entity | — | `EvidenceRelation` |
| `reasoning-errors.generalization:GeneralizationClaim` | Entity | — | `GeneralizationClaim` |
| `reasoning-errors.generalization:BurdenOfSupport` | Entity | — | `BurdenOfSupport` |
| `reasoning-errors.generalization:Cites` | Event | — | `Cites` |

## reasoning-errors.dialogue 1.0.0

Identity: `ontology:reasoning-errors.dialogue@1.0.0`. Concepts: 4. Roles: 0.

| Concept | Sort | Parents | Capabilities |
| --- | --- | --- | --- |
| `reasoning-errors.dialogue:SourceAuthority` | Entity | — | `SourceAuthority` |
| `reasoning-errors.dialogue:Sample` | Entity | — | `Sample` |
| `reasoning-errors.dialogue:MissingPremise` | Entity | — | `MissingPremise` |
| `reasoning-errors.dialogue:GeneralizesFrom` | Event | — | `GeneralizesFrom` |

## reasoning-errors.error-patterns 1.0.0

Identity: `ontology:reasoning-errors.error-patterns@1.0.0`. Concepts: 3. Roles: 0.

| Concept | Sort | Parents | Capabilities |
| --- | --- | --- | --- |
| `reasoning-errors.error-patterns:DefinitionUse` | Entity | — | `DefinitionUse` |
| `reasoning-errors.error-patterns:Population` | Entity | — | `Population` |
| `reasoning-errors.error-patterns:AttributesCause` | Event | — | `AttributesCause` |

## example.facility 1.0.0

Identity: `ontology:example.facility@1.0.0`. Concepts: 6. Roles: 4.

| Concept | Sort | Parents | Capabilities |
| --- | --- | --- | --- |
| `example.facility:Person` | Entity | — | — |
| `example.facility:Gate` | Entity | — | — |
| `example.facility:Building` | Entity | — | — |
| `example.facility:TimeValue` | Value | — | — |
| `example.facility:Open` | Event | — | `OpeningEvent` |
| `example.facility:Alarm` | Event | — | `AlarmEvent` |

