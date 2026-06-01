*** Templates List — Section: List table ***
*** 2026-05-18 ***

# Templates List — List Table

## Columns (per PRD)

| # | Column | Source field | Format |
|---|---|---|---|
| 1 | Reference ID | `referenceId` | string |
| 2 | Name | `name` | a-z, 0-9, _ only |
| 3 | CommChannel | `channelCode` | enum label |
| 4 | Category | `category` | channel-specific enum |
| 5 | Language | `language` | `en` / `ar` |
| 6 | Status | `status` | pill (see below) |
| 7 | Meta state (WhatsApp only) | `metaState` | secondary pill |
| 8 | Created By | `createdBy.username` | string |
| 9 | Created At | `createdAt` | date `dd-MMM-yyyy` |
| 10 | Actions | kebab | View · Edit · Submit · Approve · Reject · Delete |

## Status pill

[PRD] understanding.md:

| Status | Color | When |
|---|---|---|
| Draft | gray | Initial; Maker editing |
| PendingChecker | yellow | Maker submitted; awaiting Checker |
| Rejected (internal) | red | Checker rejected |
| PendingMeta | orange | Approved internally; awaiting Meta (WhatsApp only) |
| Approved | green | Final approval (incl. Meta if applicable) |
| Paused | gray-dark | Externally paused (Meta) |
| Disabled | red-dark | Externally disabled (Meta) |

## Meta state mapping (WhatsApp only)

| Falcon status | Meta state | Notes |
|---|---|---|
| PendingMeta | `PENDING` | Submitted to Meta |
| Approved | `APPROVED` | Meta approved |
| Rejected | `REJECTED` | Meta rejected |
| Paused | `PAUSED` | Meta paused due to quality |
| Disabled | `DISABLED` | Meta disabled |

## Falcon components

- `<falcon-angular-data-table>` for the list (with sort + filter)
- `<falcon-tag>` for status pill
- `<falcon-menu>` for kebab
- `<falcon-button>` for "+ Create Template" entry

## See also

- [00-OVERVIEW](00-OVERVIEW.md) · [03-SECTION_FILTERS](03-SECTION_FILTERS.md) · [11-STATE_TRANSITIONS](11-STATE_TRANSITIONS.md)
