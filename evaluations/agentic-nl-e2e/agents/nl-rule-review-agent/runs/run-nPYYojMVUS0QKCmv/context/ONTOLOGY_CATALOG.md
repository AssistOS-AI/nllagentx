# Ontology Catalog

Resolved ontology modules: 2.

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

## nl-rule-review.operational-policy 1.0.0

Identity: `ontology:nl-rule-review.operational-policy@1.0.0`. Concepts: 9. Roles: 5.

| Concept | Sort | Parents | Capabilities |
| --- | --- | --- | --- |
| `nl-rule-review.operational-policy:RuleEffect` | Value | — | — |
| `nl-rule-review.operational-policy:OperationalRule` | Entity | `core-language:SemanticEntity` | `RuleContradictionReview` |
| `nl-rule-review.operational-policy:EmergencyExceptionInvocation` | Event | `core-language:Event` | — |
| `nl-rule-review.operational-policy:JustificationRecord` | DocumentArtifact | `core-language:InformationArtifact` | — |
| `nl-rule-review.operational-policy:ExceptionJustificationRequirement` | Entity | `core-language:SemanticEntity` | `ExceptionJustificationReview` |
| `nl-rule-review.operational-policy:SafetyConclusion` | Proposition | `core-language:Proposition` | `SafetyConclusionEvidenceReview` |
| `nl-rule-review.operational-policy:SupportsSafetyConclusion` | Event | `core-language:Event` | — |
| `nl-rule-review.operational-policy:ProcedureRequest` | Entity | `core-language:SemanticEntity` | `OperationalProcedureGeneration` |
| `nl-rule-review.operational-policy:ProcedureStep` | Entity | `core-language:SemanticEntity` | — |

