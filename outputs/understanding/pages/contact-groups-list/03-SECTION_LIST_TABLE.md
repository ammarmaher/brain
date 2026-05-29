*** Contact Groups List — Section: List table ***
*** 2026-05-18 ***

# Contact Groups List — List Table

## Columns

| # | Column | Field | Format | Sort |
|---|---|---|---|---|
| 1 | Name | `name` | string | TBD |
| 2 | Reference ID | `referenceId` | string | TBD |
| 3 | Shared With | `sharedWith` | "N users" or list | NO |
| 4 | Created By | `createdBy.username` | string | TBD |
| 5 | Created At | `createdAt` | date `dd-MMM-yyyy` | YES (default desc) |
| 6 | Status | `status` | pill | NO |
| 7 | softDelete badge | (if applicable, Falcon only) | red badge | — |
| 8 | Actions | kebab | View · Edit · Download · Delete · Share | — |

## Status pill

[CODE] models.ts (ContactGroupStatus enum):

| Status | Color | Notes |
|---|---|---|
| Active | green | Normal |
| Inactive | gray | Disabled by creator |
| SoftDeleted | red (badge) | Hidden from clients |

## Cell templates

[CODE] 02-COMPONENTS.md notes 4 column templates: sharedWith / createdBy / creationDate / status.

## Pagination

- Old-UI: **client-side** with `LIST_PAGE_SIZE = 100` ceiling ([CODE] line 339).
- TODO comment: "switch to lazy (onLazyLoad) once FalconTable exposes a pageChange output".

NEW UI should implement server-side pagination from the start.

## Falcon components

- `<falcon-angular-data-table>` with sort + filter + lazy load
- `<falcon-tag>` for status
- `<falcon-menu>` for kebab

## See also

- [00-OVERVIEW](00-OVERVIEW.md) · [11-STATE_TRANSITIONS](11-STATE_TRANSITIONS.md) · [13-GAPS_AND_DRIFTS](13-GAPS_AND_DRIFTS.md)
