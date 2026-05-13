*** Coverage Matrix Template ***
*** Copy when generating a new modules/<slug>/coverage-matrix.md ***

# Coverage Matrix: <Module name>

**PRD:** [latest-prd.md](../../../prd-knowledge/modules/<slug>/latest-prd.md)
**Generated:** YYYY-MM-DD HH:MM

## PRD requirement → Test ID mapping

| PRD Req | Description | Test IDs | Status |
|---|---|---|---|
| PRD-XX-1.1 | <requirement summary> | TC-XX-001, TC-XX-002 | ✅ Covered |
| PRD-XX-1.2 | <requirement summary> | TC-XX-003 | ✅ Covered |
| PRD-XX-2.1 | <requirement summary> | TC-XX-040, TC-XX-041 | ✅ Covered |
| PRD-XX-2.2 | <requirement summary> | — | ❌ Not covered |
| PRD-XX-3.1 | <requirement summary> | TC-XX-... | ⚠ Partial |

## Test ID → PRD reverse map

| Test ID | Tags | Covers | Notes |
|---|---|---|---|
| TC-XX-001 | @smoke | PRD-XX-1.1 | Golden path |
| TC-XX-002 | @edge | PRD-XX-1.1 | Empty input |
| TC-XX-003 | @i18n | PRD-XX-1.2 | RTL |
| ... | | | |

## Status legend

- `✅ Covered` — ≥1 passing test
- `⚠ Partial` — covered partially; gap noted
- `❌ Not covered` — no test exists yet
- `RETIRED` — test ID retired, requirement now covered by another ID

## Coverage stats

| Metric | Count |
|---|---|
| Requirements total | K |
| Covered | K |
| Partial | 0 |
| Not covered | 0 |
| Coverage % | 100% |

## Sync back

After this matrix is written, copy the stats summary into:
`module-catalog/modules/<slug>/coverage.md`
