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

## task-cold-chain-transfer-core-only.cold-chain-transfer 1.0.0

Identity: `ontology:task-cold-chain-transfer-core-only.cold-chain-transfer@1.0.0`. Concepts: 17. Roles: 4.

| Concept | Sort | Parents | Capabilities |
| --- | --- | --- | --- |
| `task-cold-chain-transfer-core-only.cold-chain-transfer:ResearchSample` | Entity | `core-language:PhysicalObject`, `core-language:SemanticEntity` | `ResearchSample` |
| `task-cold-chain-transfer-core-only.cold-chain-transfer:CustodyParty` | Entity | `core-language:Agent` | `CustodyParty` |
| `task-cold-chain-transfer-core-only.cold-chain-transfer:ContainerSeal` | Entity | `core-language:PhysicalObject`, `core-language:SemanticEntity` | `ContainerSeal` |
| `task-cold-chain-transfer-core-only.cold-chain-transfer:Thermometer` | Entity | `core-language:PhysicalObject`, `core-language:SemanticEntity` | `Thermometer` |
| `task-cold-chain-transfer-core-only.cold-chain-transfer:TransferRecord` | Entity | `core-language:InformationArtifact`, `core-language:Evidence` | `TransferRecord` |
| `task-cold-chain-transfer-core-only.cold-chain-transfer:CalibrationCertificate` | Entity | `core-language:InformationArtifact`, `core-language:Evidence` | `CalibrationCertificate` |
| `task-cold-chain-transfer-core-only.cold-chain-transfer:StabilityStudy` | Entity | `core-language:InformationArtifact`, `core-language:Evidence` | `StabilityStudy` |
| `task-cold-chain-transfer-core-only.cold-chain-transfer:TransferPhase` | Value | `core-language:TimeValue` | `TransferPhase` |
| `task-cold-chain-transfer-core-only.cold-chain-transfer:CustodyTransfer` | Event | `core-language:Event` | `CustodyTransfer` |
| `task-cold-chain-transfer-core-only.cold-chain-transfer:IdentifierRecording` | Event | `core-language:Event` | `IdentifierRecording` |
| `task-cold-chain-transfer-core-only.cold-chain-transfer:TemperatureReading` | Event | `core-language:Event` | `TemperatureReading` |
| `task-cold-chain-transfer-core-only.cold-chain-transfer:CalibrationValidity` | State | `core-language:State` | `CalibrationValidity` |
| `task-cold-chain-transfer-core-only.cold-chain-transfer:TransferAcknowledgement` | Event | `core-language:Event` | `TransferAcknowledgement` |
| `task-cold-chain-transfer-core-only.cold-chain-transfer:TemperatureExcursion` | State | `core-language:State` | `TemperatureExcursion` |
| `task-cold-chain-transfer-core-only.cold-chain-transfer:StabilityStudySupport` | State | `core-language:State` | `StabilityStudySupport` |
| `task-cold-chain-transfer-core-only.cold-chain-transfer:QuarantineRequirement` | Proposition | `core-language:Proposition` | `QuarantineRequirement` |
| `task-cold-chain-transfer-core-only.cold-chain-transfer:ReleaseConclusion` | Proposition | `core-language:Proposition` | `ReleaseConclusion` |

