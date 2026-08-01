# Package Map and Skill-to-DS Routing

## Skill routing

| Skill | Primary DS | Frequent secondary DS |
|---|---|---|
| nll-architect | DS-000 | DS-004 and relevant domain DS |
| nll-orchestrator | DS-001 | DS-005, DS-006 |
| nll-sdk | DS-002 | DS-003 |
| nll-runtime | DS-003 | DS-004, DS-005 |
| nll-intent | DS-004 | DS-000 and pack descriptors |
| nll-ontology | relevant DS-007–DS-019 | DS-002 |
| nll-longtext | DS-002 | DS-004 and relevant domain DS |
| nll-circuit | DS-003 | DS-000 and relevant domain DS |
| nll-test | DS-005 | the DS governing code under test |
| nll-evaluate | DS-006 | DS-001, DS-004, DS-005 |

## Runtime ownership

| Concern | Canonical module family |
|---|---|
| semantic handles and values | framework/sdk/core |
| ontology builders and constructor generation | framework/sdk/ontology |
| source anchoring and LongText transactions | framework/sdk/longtext + framework/runtime/store |
| circuit authoring | framework/sdk/circuit |
| task intent and profiles | framework/sdk/intent |
| query and indexes | framework/runtime/query + store |
| capability planning | framework/runtime/planner |
| dataflow and epochs | framework/runtime/scheduler |
| abstract/symbolic/constraint engines | framework/runtime/methods |
| CNL frames and renderers | framework/sdk/cnl + framework/cnl |
| coding-agent orchestration | framework/cli + framework/tools |
| predefined knowledge | framework/packs |

## Task artifact ownership

| Artifact | Authored by | Location |
|---|---|---|
| task.mjs | coding agent or CLI skeleton + coding-agent refinement | tasks/<id>/task.mjs |
| intent.mjs | nll-intent coding run | tasks/<id>/intent |
| LongText unit modules | nll-longtext coding run | tasks/<id>/longtext/units |
| task-local ontology | nll-ontology coding run | tasks/<id>/ontologies |
| task-local circuit | nll-circuit coding run | tasks/<id>/circuits |
| deterministic tests | relevant coding run, guided by nll-test | tasks/<id>/tests |
| execution outputs | nllAgent runtime | tasks/<id>/results |

## Result authority

- Source files are authoritative for original text.
- Ontology/LongText/Circuit/Intent `.mjs` files are authoritative semantic programs.
- SemanticStore, indexes and caches are derived runtime structures.
- CNL and Markdown reports are human-facing projections.
- A model's chat response is never the canonical semantic result.
