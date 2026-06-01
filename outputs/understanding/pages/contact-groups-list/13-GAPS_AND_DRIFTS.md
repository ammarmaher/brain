*** Contact Groups List — Gaps & drifts ***
*** 2026-05-18 ***

# Contact Groups List — Gaps & Drifts

## High-severity

### GAP-CGL-CASING — page vs Page inconsistency

[CODE] `list()` uses `page`+`pageSize` (camelCase). `getSharedGroups()` uses `Page`+`PageSize` (PascalCase). Decision needed at backend.

### GAP-CGL-CLIENT-PAGINATION — client-side only with 100-row ceiling

[CODE] `LIST_PAGE_SIZE = 100` + comment "TODO: switch to lazy". For accounts with >100 contact groups, list is incomplete.

### GAP-CGL-MISSING-FILTERS — No filter UI

Old-UI lacks filter/search. NEW UI should add: search by name, filter by status, date range, created-by.

### GAP-CGL-OWNER-VS-PES — Editor enabled by row-owner overlay BUT PES not always consulted

[CODE] `RowActionFlags` derived from creator equality. PRD intent may be PES-controlled. NEW UI: always consult PES first, then row-owner overlay as secondary.

## Medium

### Q-CGL-PURGE — Is there hard delete?

PRD doesn't mention hard purge. SoftDeleted is terminal state. Verify if compliance/GDPR requires hard delete after N days.

### GAP-CGL-DOWNLOAD-EXPIRY — Pre-signed URL UX

If user clicks Download with `expiresInSeconds`-stale link, error. NEW UI: re-fetch URL on each click.

### GAP-CGL-SHARED-WITH-COUNT — Sharedwith column shows count or list?

[CODE] both observed; consistency needed.

## Low

(Standard list of anti-patterns: SCSS heavy, NgForm, *ngIf, PrimeNG.)

## See also

- [00-OVERVIEW](00-OVERVIEW.md) · [08-BACKEND_API](08-BACKEND_API.md) · [14-IMPLEMENTATION_CHECKLIST](14-IMPLEMENTATION_CHECKLIST.md)
