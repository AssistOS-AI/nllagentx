# Circuit Catalog

Resolved circuits: 5.

| Circuit | Requires | Provides | Stages | Assurance |
| --- | --- | --- | ---: | --- |
| `circuit:core-language.CoreGroundingFinding@1.0.0` | — | `CoreGroundingFinding`, `evidence-bearing`, `interpretation-aware` | 1 | concrete |
| `circuit:nl-rule-review.ExceptionJustificationReview@1.0.0` | `nl-rule-review.operational-policy:EmergencyExceptionInvocation`, `nl-rule-review.operational-policy:ExceptionJustificationRequirement`, `nl-rule-review.operational-policy:JustificationRecord` | `ExceptionJustificationReview`, `evidence-bearing`, `coverage-aware`, `interpretation-aware` | 2 | abstract-preflight, symbolic-decision-coverage |
| `circuit:nl-rule-review.OperationalProcedureGeneration@1.0.0` | `nl-rule-review.operational-policy:ProcedureRequest`, `nl-rule-review.operational-policy:OperationalRule` | `OperationalProcedureGeneration`, `evidence-bearing`, `interpretation-aware`, `plan-explainable`, `cnl-round-trip` | 3 | abstract-preflight, symbolic-decision-coverage, cnl-roundtrip |
| `circuit:nl-rule-review.RuleContradictionReview@1.0.0` | `nl-rule-review.operational-policy:OperationalRule` | `RuleContradictionReview`, `evidence-bearing`, `interpretation-aware` | 2 | abstract-preflight, symbolic-decision-coverage |
| `circuit:nl-rule-review.SafetyConclusionEvidenceReview@1.0.0` | `nl-rule-review.operational-policy:SafetyConclusion`, `nl-rule-review.operational-policy:SupportsSafetyConclusion` | `SafetyConclusionEvidenceReview`, `evidence-bearing`, `coverage-aware`, `interpretation-aware` | 2 | abstract-preflight, symbolic-decision-coverage |
