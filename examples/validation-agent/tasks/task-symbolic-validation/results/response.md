# nllAgent response

[CNL:DOCUMENT] [STYLE:evidence-led] [GROUPING:status-family] [RESULTS:1]

Task: `task-symbolic-validation`  
Intent: `facility-order-validation`

## Answer

[CNL:GROUP] [KEY:confirmations] [COUNT:1]

## Confirmations (1)

[CNL:FINDING] [CODE:ORDER_OK] [STATUS:SATISFIED] [GROUP:confirmations] [SUPPORTING]
### Order ok
**Status:** SATISFIED
The input supports the conclusion “facility order”.

**Rule evaluated:** Facility order  
**Circuit:** `example.facility-order`  
**Decision:** The circuit emitted this result because Facility order evaluated as supported.

**Evidence from the input**

> The alarm sounded in Building A at 08:57.
>
> — [source-001](../source/incident.txt), characters 0–41

> Ana opened the north gate at 09:00.
>
> — [source-001](../source/incident.txt), characters 42–77

## Input basis

- [source-001](../source/incident.txt): 78 decoded characters.

## Limits and uncertainty

No blocking diagnostic was emitted. This statement concerns execution completeness, not the truth of every possible claim outside the selected intent.

## Artifacts

This tagged Markdown response is the primary human-facing CNL result. Executable semantic programs and technical evidence are indexed separately in [`artifacts.md`](artifacts.md); raw assurance objects and traces are not part of the answer above.
