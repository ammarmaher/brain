*** Edge Case Checklist — test-case-authoring ***
*** Universal 20-item list every module must address ***

# Universal Edge Case Checklist

Every module test plan must address all 20 cases. Mark any N/A with a reason.

| # | Case | What to test | Tag |
|---|---|---|---|
| 1 | Empty input | All required fields submitted blank | `@edge` |
| 2 | Max-length input | Field at and beyond character/byte limit | `@edge` |
| 3 | Special chars | Arabic, emoji, RTL marks, HTML/SQL meta | `@edge @i18n` |
| 4 | Permission denied | Each role attempting an unauthorized action | `@permission` |
| 5 | Token expired | Action attempted with stale JWT | `@edge` |
| 6 | Network failure mid-action | Drop connection during submit | `@edge` |
| 7 | Concurrent edit conflict | Two sessions updating the same record | `@edge` |
| 8 | RTL rendering | Layout flips in Arabic | `@i18n` |
| 9 | Long text truncation | Names/labels overflow containers | `@edge` |
| 10 | Pagination boundaries | First page, last page, single page, empty | `@edge` |
| 11 | Sort + filter combined | Multi-criteria query | `@edge` |
| 12 | Search no-results | Empty result set rendered correctly | `@edge` |
| 13 | Server 500 | Backend error surfaced to user | `@edge` |
| 14 | Validation error display | Inline + summary, En + Ar | `@edge @i18n` |
| 15 | Loading state | Skeleton / spinner during fetch | `@edge` |
| 16 | Empty state | First-use rendering with no data | `@edge` |
| 17 | Success toast | Notification appears, auto-dismiss | `@edge` |
| 18 | Error toast | Notification with retry where applicable | `@edge` |
| 19 | Browser back/forward | History navigation preserves state | `@edge` |
| 20 | Deep link entry | URL → page render without prior state | `@edge` |

## N/A reasons

If a case truly does not apply, document with one of:
- `N/A — read-only module` (no input cases)
- `N/A — not user-facing` (no UI states)
- `N/A — single-page` (no pagination)
- `N/A — explained in module-catalog/.../decisions.md#D-...`

Any other reason must be approved by team lead and noted in `decisions.md`.

## Mapping to test plan

`modules/<slug>/test-plan.md` includes a checklist section mirroring this list with status per item.
