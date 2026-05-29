*** Templates List — Section: Filters ***
*** 2026-05-18 ***

# Templates List — Filters

## Filter dimensions

| Filter | Options |
|---|---|
| Status | Draft · PendingChecker · PendingMeta · Approved · Rejected · Paused · Disabled |
| CommChannel | WhatsApp · Voice · AI · SMS |
| Category | (changes per channel) |
| Language | en · ar |
| Created By | typeahead Maker selector |
| Date range | created between X and Y |

## Search

Text search across `name` + `referenceId`.

## Falcon components

- `<falcon-select>` per dimension
- `<falcon-input>` search box
- `<falcon-date-range-picker>` (if exists)

## Server-side filtering

[INFERRED] Filters should be query-params on `GET /api/templates`. Endpoint doesn't exist today (GAP-T-001).

## See also

- [02-SECTION_LIST_TABLE](02-SECTION_LIST_TABLE.md) · [13-GAPS_AND_DRIFTS](13-GAPS_AND_DRIFTS.md)
