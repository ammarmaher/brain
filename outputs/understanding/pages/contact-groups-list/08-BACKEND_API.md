*** Contact Groups List — Backend API ***
*** 2026-05-18 ***

# Contact Groups List — Backend API

## Endpoints (all exist today)

| Method | Path | Service | Purpose |
|---|---|---|---|
| GET | `contactgroup/contact-groups?NodeId=&page=&pageSize=` | Contact Group | Own tab |
| GET | `contactgroup/contact-groups/shared?NodeId=&Page=&PageSize=` | Contact Group | Shared tab (PascalCase!) |
| GET | `contactgroup/contact-groups/{groupId}` | Contact Group | Detail |
| GET | `contactgroup/contact-groups/{groupId}/contacts?page=&pageSize=` | Contact Group | Contacts pagination |
| GET | `contactgroup/contact-groups/{groupId}/files/{fileType}` | Contact Group | Pre-signed download URL |
| PATCH | `contactgroup/contact-groups/{groupId}` | Contact Group | Update name/refId |
| PATCH | `contactgroup/contact-groups/{groupId}/share` | Contact Group | Update share-policy |
| DELETE | `contactgroup/contact-groups/{groupId}` | Contact Group | Delete (soft) |
| GET | `identity/user?Status=2,3,4&Role=6&Search=&PageNumber=&PageSize=` | Identity | User picker (for share-policy) |
| GET | `commerce/Node` + `?NodeId=` | Commerce | Tree |

## Gateway routing

- `contactgroup/*` → System Gateway → Falcon Core Contact Group Service (`falcon-core-contact-group-svc`)
- `identity/*` → System Gateway → Falcon Core Identity Service
- `commerce/Node` → System Gateway → Commerce

## Casing inconsistency (GAP-CGL-CASING)

`list()` query: lowercase `page`, `pageSize`.
`getSharedGroups()` query: PascalCase `Page`, `PageSize`.

**Decision needed:** harmonize. Suggest backend route both, deprecate one. Verify in backend dossier.

## Response wrappers

`ServiceOperationResult<T>` standard. `PagedResult<T> = { items, totalCount, pageNumber, pageSize }`.

## File download

`GetFileDownloadUrlResponse { DownloadUrl, FileName, ExpiresInSeconds }` — pre-signed S3 SAS. FE creates `<a download>` and clicks it programmatically.

## See also

- [00-OVERVIEW](00-OVERVIEW.md) · [12-ERROR_STATES](12-ERROR_STATES.md) · [13-GAPS_AND_DRIFTS](13-GAPS_AND_DRIFTS.md)
