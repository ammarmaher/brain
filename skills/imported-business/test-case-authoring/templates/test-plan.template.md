*** Test Plan Template ***
*** Copy when generating a new modules/<slug>/test-plan.md ***

# Test Plan: <Module name>

**PRD:** [latest-prd.md](../../../prd-knowledge/modules/<slug>/latest-prd.md)
**Feature file:** [<module>.feature](./<module>.feature)
**Last generated:** YYYY-MM-DD HH:MM
**Total scenarios:** N

## Coverage summary

| Metric | Value |
|---|---|
| Scenarios total | N |
| Smoke | N |
| Regression | N |
| Permission matrix cells | R × A = N |
| Edge cases addressed | M / 20 |
| PRD requirements covered | K / K (100%) |

## Universal edge-case checklist

| # | Case | TC ID | Status |
|---|---|---|---|
| 1 | Empty input | TC-XX-002 | ✅ Covered |
| 2 | Max-length input | TC-XX-... | ✅ Covered |
| 3 | Special chars (Arabic, emoji) | TC-XX-... | ✅ Covered |
| 4 | Permission denied (each role) | matrix below | ✅ Covered |
| 5 | Token expired | TC-XX-... | ✅ Covered |
| 6 | Network failure mid-action | TC-XX-... | ✅ Covered |
| 7 | Concurrent edit conflict | TC-XX-... | ⚠ N/A — read-only module |
| 8 | RTL rendering | TC-XX-003 | ✅ Covered |
| 9 | Long text truncation | TC-XX-... | ✅ Covered |
| 10 | Pagination boundaries | TC-XX-... | ✅ Covered |
| 11 | Sort + filter combined | TC-XX-... | ✅ Covered |
| 12 | Search no-results | TC-XX-... | ✅ Covered |
| 13 | Server 500 | TC-XX-... | ✅ Covered |
| 14 | Validation error display | TC-XX-... | ✅ Covered |
| 15 | Loading state | TC-XX-... | ✅ Covered |
| 16 | Empty state | TC-XX-... | ✅ Covered |
| 17 | Success toast | TC-XX-... | ✅ Covered |
| 18 | Error toast | TC-XX-... | ✅ Covered |
| 19 | Browser back/forward | TC-XX-... | ✅ Covered |
| 20 | Deep link entry | TC-XX-... | ✅ Covered |

## Permission matrix

| Role \ Action | Create | Read | Update | Delete |
|---|---|---|---|---|
| Tenant Admin | ✅ TC-XX-010 | ✅ TC-XX-011 | ✅ TC-XX-012 | ✅ TC-XX-013 |
| Tenant User | ❌ TC-XX-020 | ✅ TC-XX-021 | ❌ TC-XX-022 | ❌ TC-XX-023 |
| Falcon Admin | ✅ TC-XX-030 | ✅ TC-XX-031 | ✅ TC-XX-032 | ✅ TC-XX-033 |
| Anonymous | ❌ TC-XX-040 | ❌ TC-XX-041 | ❌ TC-XX-042 | ❌ TC-XX-043 |

## PRD coverage

See [coverage-matrix.md](./coverage-matrix.md) for the full PRD-requirement → test-ID mapping.

## Notes

- Glossary validated against `domain-glossary` on YYYY-MM-DD
- Banned terms: 0
- Unknown terms: 0
