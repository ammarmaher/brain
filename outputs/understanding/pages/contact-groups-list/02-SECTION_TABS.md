*** Contact Groups List — Section: Tabs ***
*** Own + Shared tab routing · 2026-05-18 ***

# Contact Groups List — Tabs

## The two tabs

### Own tab
- Endpoint: `GET contactgroup/contact-groups?NodeId={id}&page=&pageSize=`
- Shows groups WHERE `createdBy.nodeId === selectedNodeId`.

### Shared tab
- Endpoint: `GET contactgroup/contact-groups/shared?NodeId={id}&Page=&PageSize=` (note: PascalCase `Page`/`PageSize` here — inconsistency with Own endpoint's camelCase)
- Shows groups where `sharedWith` includes selectedNodeId users.

## API casing inconsistency

[CODE] `contact-groups-api.service.ts:47-87`:
- `list()` uses `page` + `pageSize` (camelCase)
- `getSharedGroups()` uses `Page` + `PageSize` (PascalCase)

This is a backend inconsistency that must be preserved at FE call site, or fixed at backend. Flag in [13-GAPS_AND_DRIFTS](13-GAPS_AND_DRIFTS.md).

## Tab switch behavior

[CODE] On tab change:
1. Reset list state.
2. Call endpoint for new tab with current `selectedNodeId`.
3. Render rows.

## Falcon components

- `<falcon-tabs>` for the tab bar
- Tab content body = same `<falcon-angular-data-table>` for both tabs

## See also

- [03-SECTION_LIST_TABLE](03-SECTION_LIST_TABLE.md) · [08-BACKEND_API](08-BACKEND_API.md) · [13-GAPS_AND_DRIFTS](13-GAPS_AND_DRIFTS.md)
