# nllAgent response

[CNL:DOCUMENT] [STYLE:evidence-led] [GROUPING:status-family] [RESULTS:1]

## Answer

[CNL:GROUP] [KEY:violations] [COUNT:1]

## Violations (1)

[CNL:FINDING] [CODE:MISSING_EXCEPTION_JUSTIFICATION] [STATUS:VIOLATED] [GROUP:violations] [MATERIAL]
### Missing exception justification
**Status:** VIOLATED
A recorded emergency exception invocation lacks the justification record required by the applicable policy.

- **Rule evaluated:** Emergency exception justification
- **Circuit:** `nl-rule-review.ExceptionJustificationReview`
- **Decision:** The circuit emitted this result because Emergency exception justification evaluated as not supported.

**Why this result**

- **Failed requirement:**
  - A source-grounded justification record must link to the invocation.
- **Confirmed requirements:**
  - An emergency exception invocation must be source-grounded.
  - An applicable policy requires a justification record for the invocation.
  - Justification-record coverage must be closed before absence is treated as a violation.

**Assessment details**

- Checked invocations: 1

**Evidence from the input**

> Every use of the emergency-access exception must have a recorded reason linked to that invocation.
>
> — [source-001](../source/source-001.txt), characters 46–144

> At 09:02, operator Ana invoked the emergency-access exception and opened the north gate.
>
> — [source-001](../source/source-001.txt), characters 157–245

> It contains no reason or justification record for the invocation.
>
> — [source-001](../source/source-001.txt), characters 284–349

**Next action:** Address the failed requirement: A source-grounded justification record must link to the invocation.
