# nllAgent response

[CNL:DOCUMENT] [STYLE:evidence-led] [GROUPING:status-family] [RESULTS:1]

## Answer

[CNL:GROUP] [KEY:violations] [COUNT:1]

## Violations (1)

[CNL:FINDING] [CODE:MISSING_EXCEPTION_JUSTIFICATION] [STATUS:VIOLATED] [GROUP:violations] [MATERIAL]
### Missing exception justification
**Status:** Not satisfied
A recorded emergency exception invocation lacks the justification record required by the applicable policy.

- **Rule evaluated:** Emergency exception justification
- **Circuit:** `nl-rule-review.ExceptionJustificationReview`
- **Decision:** The circuit emitted this result because Emergency exception justification evaluated as not supported.

**Assessment of required conditions**

[CNL:REQUIREMENT-GROUP] [STATUS:VIOLATED] [COUNT:1]

**Required conditions not satisfied**

The analysis found that the following required condition is not satisfied:

- A source-grounded justification record must link to the invocation.

[CNL:REQUIREMENT-GROUP] [STATUS:SATISFIED] [COUNT:3]

**Required conditions supported**

The available input supports the following required conditions:

- An emergency exception invocation must be source-grounded.
- An applicable policy requires a justification record for the invocation.
- Justification-record coverage must be closed before absence is treated as a violation.

**Assessment details**

- Checked invocations: 1

[CNL:EVIDENCE] [COUNT:3]

**Exact evidence copied from the input**

The passages below are copied exactly from the input. They are evidence for the generated conclusion above.

[CNL:SOURCE-QUOTE] [SOURCE:source-001]

> Every use of the emergency-access exception must have a recorded reason linked to that invocation.
>
> — Exact source text copied from [source-001](../source/source-001.txt)

[CNL:SOURCE-QUOTE] [SOURCE:source-001]

> At 09:02, operator Ana invoked the emergency-access exception and opened the north gate.
>
> — Exact source text copied from [source-001](../source/source-001.txt)

[CNL:SOURCE-QUOTE] [SOURCE:source-001]

> It contains no reason or justification record for the invocation.
>
> — Exact source text copied from [source-001](../source/source-001.txt)

[CNL:NEXT-ACTION] [COUNT:1]

**Next action:** Resolve this failed condition and provide source evidence for the corrected state: “A source-grounded justification record must link to the invocation.”
