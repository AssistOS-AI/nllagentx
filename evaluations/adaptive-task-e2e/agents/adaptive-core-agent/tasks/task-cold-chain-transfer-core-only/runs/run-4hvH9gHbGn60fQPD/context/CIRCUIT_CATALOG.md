# Circuit Catalog

Resolved circuits: 2.

| Circuit | Requires | Provides | Stages | Assurance |
| --- | --- | --- | ---: | --- |
| `circuit:core-language.CoreGroundingFinding@1.0.0` | — | `CoreGroundingFinding`, `evidence-bearing`, `interpretation-aware` | 1 | concrete |
| `circuit:task-cold-chain-transfer.ColdChainTransferReleaseSupport@1.0.0` | `task-cold-chain-transfer-core-only.cold-chain-transfer:ReleaseConclusion`, `task-cold-chain-transfer-core-only.cold-chain-transfer:CustodyTransfer`, `task-cold-chain-transfer-core-only.cold-chain-transfer:IdentifierRecording`, `task-cold-chain-transfer-core-only.cold-chain-transfer:TemperatureReading`, `task-cold-chain-transfer-core-only.cold-chain-transfer:CalibrationValidity`, `task-cold-chain-transfer-core-only.cold-chain-transfer:TransferAcknowledgement`, `task-cold-chain-transfer-core-only.cold-chain-transfer:TemperatureExcursion`, `task-cold-chain-transfer-core-only.cold-chain-transfer:StabilityStudySupport` | `ColdChainTransferReleaseSupport`, `evidence-bearing`, `coverage-aware`, `interpretation-aware`, `typed-cnl-observation` | 11 | abstract-preflight, symbolic-decision-coverage, cnl-roundtrip |
