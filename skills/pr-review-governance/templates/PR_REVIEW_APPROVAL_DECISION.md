# PR Review — Approval Decision

> Template — copy into the dated review folder.

## Decision

| Field | Value |
|---|---|
| Branch / PR | `<source-branch or PR#>` |
| Target branch | `<target-branch>` |
| Decision | `<APPROVE / APPROVE_WITH_MINOR_NOTES / REQUEST_CHANGES / BLOCK_MERGE / NEEDS_MORE_CONTEXT>` |
| Decided by | Brain SK (pr-review-governance) |
| Date/time | `<YYYY-MM-DDTHH:mm+03:00>` |

## Decision rationale

Applied decision rules:

- Any P0 → `BLOCK_MERGE`
- Any unresolved P1 → `REQUEST_CHANGES`
- Only P2/P3 → `APPROVE_WITH_MINOR_NOTES` or `REQUEST_CHANGES` (by count/risk)
- No material issues → `APPROVE`
- Insufficient truth sources → `NEEDS_MORE_CONTEXT`

| Severity | Count | Effect on decision |
|---|---|---|
| P0 BLOCKER | 0 | |
| P1 MAJOR | 0 | |
| P2 MEDIUM | 0 | |
| P3 MINOR | 0 | |

**Rationale:** `<one-paragraph explanation of why this decision was reached>`

## Conditions for approval

`<If REQUEST_CHANGES / BLOCK_MERGE: list exactly what must change to flip to APPROVE>`

## Next action

`<what the author / Ammar should do next>`
