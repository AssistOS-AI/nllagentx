# nllAgent response

[CNL:DOCUMENT] [STYLE:evidence-led] [GROUPING:status-family] [RESULTS:1]

Task: `task-tUmtraHGU2CZ1cFt`  
Intent: `task-tUmtraHGU2CZ1cFt`

## Answer

[CNL:GROUP] [KEY:violations] [COUNT:1]

## Violations (1)

[CNL:FINDING] [CODE:MISSING_EXCEPTION_JUSTIFICATION] [STATUS:VIOLATED] [GROUP:violations] [MATERIAL]
### Missing exception justification
**Status:** VIOLATED
A recorded emergency exception invocation lacks the justification record required by the applicable policy.

**Rule evaluated:** Emergency exception justification  
**Circuit:** `nl-rule-review.ExceptionJustificationReview`  
**Decision:** The circuit emitted this result because Emergency exception justification evaluated as not supported.

Observed facts:

- Checked invocations: 1
- Failed requirements: A source-grounded justification record must link to the invocation.
- Satisfied requirements: An emergency exception invocation must be source-grounded., An applicable policy requires a justification record for the invocation., Justification-record coverage must be closed before absence is treated as a violation.

**Evidence from the input**

> Every use of the emergency-access exception must have a recorded reason linked to that invocation.
>
> — [source-001](../source/source-001.txt), characters 46–144

> At 09:02, operator Ana invoked the emergency-access exception and opened the north gate.
>
> — [source-001](../source/source-001.txt), characters 157–245

**Next action:** Correct the violation and add explicit source support that addresses “emergency exception justification”.

## Input basis

- [source-001](../source/source-001.txt): 350 decoded characters.

## Limits and uncertainty

No blocking diagnostic was emitted. This statement concerns execution completeness, not the truth of every possible claim outside the selected intent.

## Artifacts

This tagged Markdown response is the primary human-facing CNL result. Executable semantic programs and technical evidence are indexed separately in [`artifacts.md`](artifacts.md); raw assurance objects and traces are not part of the answer above.
