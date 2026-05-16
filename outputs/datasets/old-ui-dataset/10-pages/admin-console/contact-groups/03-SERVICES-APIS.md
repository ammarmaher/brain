# Services & APIs — contact-groups (admin-console)

## Services
| Service | File | Singleton? | Purpose |
|---|---|---|---|
| `ContactGroupsApiService` | `apps/admin-console/src/app/features/contact-groups/services/contact-groups-api.service.ts` | `@Injectable({ providedIn: 'root' })` (line 34) | List + shared-list endpoints |
| `ContactGroupDetailsService` | `apps/admin-console/src/app/features/contact-groups/components/contact-group-details/services/contact-group-details.service.ts` | `@Injectable({ providedIn: 'root' })` (line 43) | Detail, contacts, file downloads, update, shareable-users picker |
| `OrgHierarchyApiService` (cross-feature) | `apps/admin-console/src/app/features/organization-hierarchy/services/org-hierarchy.api.service.ts` | root | Provides `getRootNodes()` + `getChildren(nodeId)` for the tree (used by both contact-group components) |

## HTTP endpoints called

### Via `ContactGroupsApiService`
| Method | URL pattern | Service.Method | Request DTO | Response DTO | Source file:line |
|---|---|---|---|---|---|
| GET | `contactgroup/contact-groups?NodeId={id}&page={n}&pageSize={n}` | `ContactGroupsApiService.list()` (alias: `getContactGroups()`) | `GetContactGroupsRequestParams` (params, no body) | `ServiceOperationResult<PagedResult<ContactGroupListItemDto>>` | `contact-groups-api.service.ts:47-56` (helper: `buildListParams` 91-104; `toListResult` 106-120) |
| GET | `contactgroup/contact-groups/shared?NodeId={id}&Page={n}&PageSize={n}` | `ContactGroupsApiService.getSharedGroups()` | `GetContactGroupsRequestParams` (params; note **PascalCase** `Page`/`PageSize` here vs camelCase for `list()`) | `ServiceOperationResult<PagedResult<ContactGroupListItemDto>>` | `contact-groups-api.service.ts:70-87` |

### Via `ContactGroupDetailsService`
| Method | URL pattern | Service.Method | Request DTO | Response DTO | Source file:line |
|---|---|---|---|---|---|
| GET | `contactgroup/contact-groups/{groupId}` | `ContactGroupDetailsService.getDetail()` | n/a (path only) | `ServiceOperationResult<ContactGroupDetailDto>` | `contact-group-details.service.ts:57-73` |
| GET | `contactgroup/contact-groups/{groupId}/files/{fileType}` where `fileType` ∈ `{1=Original, 2=Validated}` | `ContactGroupDetailsService.getFileDownloadUrl()` | n/a | `ServiceOperationResult<ContactGroupFileDownloadDto>` (returns `{ downloadUrl, fileName, expiresInSeconds }`) | `contact-group-details.service.ts:85-104` |
| GET | `contactgroup/contact-groups/{groupId}/contacts?page={n}&pageSize={n}` | `ContactGroupDetailsService.getContacts()` | n/a | `ServiceOperationResult<PagedResult<ContactGroupContactItem>>` mapped to `ContactGroupContactsResponseDto` | `contact-group-details.service.ts:107-135` |
| PATCH | `contactgroup/contact-groups/{groupId}` | `ContactGroupDetailsService.updateGroup()` | `UpdateContactGroupRequest` | `ServiceOperationResult<ContactGroupDetailDto>` | `contact-group-details.service.ts:145-165` |
| GET | `identity/user?Status=2&Status=3&Status=4&Role=6&PageNumber={n}&PageSize={n}&Search={term}` | `ContactGroupDetailsService.getShareableUsers()` | n/a (params only) | `ServiceOperationResult<{ items: IdentityUserInfoDto[]; totalCount: number }>` mapped to `{ users: SharedUserOption[]; totalCount }` | `contact-group-details.service.ts:177-215` |

**Status code values** in the users-picker call (line 178-181): `Active=2, Suspended=3, Locked=4` (from `UserStatus` enum). **Role**: `NormalUser=6` (from `UserRoles` enum). The call deliberately includes Suspended + Locked because already-shared users may be in those states. [CODE comments in service file confirm this is "same params as create-contact-group share step".]

### Cross-feature endpoints reused
| Method | URL | Caller | Purpose |
|---|---|---|---|
| GET | `(via OrgHierarchyApiService.getRootNodes())` | `ContactGroupsComponent.loadRoot()` + `ContactGroupDetailsComponent.loadRoot()` | Tree root data |
| GET | `(via OrgHierarchyApiService.getChildren(parentId))` | both components, `loadNodeChildren()` | Tree child nodes |

## Base URL resolution

All endpoints in this feature are called with the spread `{ ...useGateway() }` option:
```ts
this.http.get<ServiceOperationResult<...>>(this.apiEndpoint, { params, ...useGateway() })
```
`HttpService` + `useGateway()` are imported from `@falcon`. Per the service comments on `contact-groups-api.service.ts:30-32` [CODE]:

> The System Gateway strips `/contactgroup` and prepends `/api`, so the upstream hit is `GET /api/contact-groups`. Admin-console is wired to SystemGateway via `APP_DEFAULT_GATEWAY`, so calling `useGateway()` is sufficient.

So the effective call sequence is:
- Browser → `https://<host>/<gateway-prefix>/contactgroup/contact-groups/...`
- System Gateway (`falcon-int-system-gateway-svc`) rewrites `/contactgroup/*` → upstream `/api/*` and routes to **Falcon Core Contact Group Service** (`falcon-core-contact-group-svc`).
- For `identity/user`, the same gateway routes to **Falcon Core Identity Service**.

[INFERRED — derivation from `useGateway()` comment + standard System Gateway YARP pattern. Need a check against `falcon-int-system-gateway-svc/appsettings.json` cluster config to confirm the upstream paths.]

## Auth / interceptors

[INFERRED — not directly visible in these files; all admin-console calls go through `HttpService` which lives in `libs/falcon/src/core/lib/http/`. The standard pattern is Zitadel JWT injected as `Authorization: Bearer <token>` plus `Accept-Language` header for i18n. No tenant header is added explicitly in these endpoints — node scoping uses the `NodeId` query param.]

## Backend service mapping
- `contactgroup/contact-groups/*` → **Falcon Core Contact Group Service** (`falcon-core-contact-group-svc`) — name derivable from the URL prefix `contactgroup`. [CODE comment line 30-31 of contact-groups-api.service.ts confirms gateway rewrites to `/api/contact-groups`.]
- `identity/user` → **Falcon Identity Service** (`falcon-core-identity-svc`) — derivable from the URL prefix `identity`. [INFERRED — gateway convention.]

## Wrappers & helpers
- `ServiceOperationResult<T>` envelope (from `@falcon`): pattern is `{ isSuccessful: boolean, result: T, errors: string[] }`. Both services check `response.isSuccessful && response.result`, otherwise throw `new Error(response?.errors?.[0] ?? '<fallback>')`.
- `PagedResult<T>` envelope: `{ items: T[]; totalCount: number; pageNumber: number; pageSize: number }` — declared in `libs/falcon/src/shared-types/lib/models/contact-group.models.ts:54-59`.
- Pagination ceiling in list page: `LIST_PAGE_SIZE = 100` (line 339 of `contact-groups.component.ts`) — comment says **FalconTable paginates client-side** so the front-end requests a large ceiling. TODO comment at line 333-337 says: "switch to lazy (onLazyLoad) once FalconTable exposes a pageChange output".

## Special: file download UX
`triggerDownload()` (lines 414-424 of detail component) opens the pre-signed URL via a programmatically-created `<a download>` element:
```ts
const anchor = document.createElement('a');
anchor.href = url;
anchor.download = fileName;
anchor.target = '_blank';
anchor.rel = 'noopener noreferrer';
document.body.appendChild(anchor);
anchor.click();
document.body.removeChild(anchor);
```
The URL returned by `getFileDownloadUrl()` is described in `ContactGroupFileDownloadDto` as a **pre-signed URL with `expiresInSeconds`** — implies S3/blob storage with short-lived SAS or similar. [CODE — `ContactGroupFileDownloadDto` at models.ts:86-91.]
