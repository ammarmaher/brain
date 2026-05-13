# Contact Group Service — Endpoint Registry

> Route prefix: `/api` (FastEndpoints). Two groups + standalone + internal.

## ContactGroupEndpointGroup — `/api/contact-groups/*` (8 endpoints, all `RequireAuthorization()`)

| Method | Route | Handler | Request | Response (T) | OpenAPI Status Codes |
|---|---|---|---|---|---|
| POST | `/api/contact-groups` | `CreateContactGroupEndpoint` | `CreateContactGroupRequest { UploadSessionId, Name, ReferenceId, HasHeader, ColumnConfig, SharePolicy }` | `CreateContactGroupResponse` | 201, 400, 401 |
| GET | `/api/contact-groups` | `ListContactGroupsEndpoint` | `ListContactGroupsRequest { NodeId, Page, PageSize }` | `PagedResult<ContactGroupListItemDto>` | 200, 401 |
| GET | `/api/contact-groups/shared` | `ListSharedContactGroupsEndpoint` | `ListSharedContactGroupsRequest { Page, PageSize }` | `PagedResult<ContactGroupListItemDto>` | 200, 401, 403 |
| GET | `/api/contact-groups/{groupId}` | `GetContactGroupDetailsEndpoint` | `GetContactGroupDetailsRequest { GroupId }` | `GetContactGroupDetailsResponse` | 200, 401, 403, 404 |
| PATCH | `/api/contact-groups/{groupId}` | `UpdateContactGroupEndpoint` | `UpdateContactGroupRequest { GroupId, Name?, ReferenceId?, SharePolicy? }` | `GetContactGroupDetailsResponse` (refreshed details) | 200, 400, 401, 403, 404 |
| PATCH | `/api/contact-groups/{groupId}/share` | `ShareContactGroupEndpoint` | `ShareContactGroupRequest { GroupId, SharedWithAllUsers, SharedUsers[] }` | `object?` (null body, just 200) | 200, 400, 401, 403, 404 |
| DELETE | `/api/contact-groups/{groupId}` | `DeleteContactGroupEndpoint` | `DeleteContactGroupRequest { GroupId }` | `object?` (null) | 200, 401, 403, 404 |
| GET | `/api/contact-groups/{groupId}/contacts?page=&pageSize=` | `BrowseContactGroupContactsEndpoint` | `BrowseContactGroupContactsRequest { GroupId, Page, PageSize }` | `PagedResult<Dictionary<string, object>>` (dynamic alias-keyed) | 200, 400, 401, 403, 404 |
| GET | `/api/contact-groups/{groupId}/files/{fileType}` | `GetFileDownloadUrlEndpoint` | `GetFileDownloadUrlRequest { GroupId, FileType }` (FileType ∈ `{original, validated}`) | `GetFileDownloadUrlResponse { DownloadUrl, FileName, ExpiresInSeconds }` | 200, 401, 403, 404 |

## Standalone — `/api/contact-groups/upload-config`

| Method | Route | Handler | Request | Response (T) | Auth |
|---|---|---|---|---|---|
| GET | `/api/contact-groups/upload-config` | `GetUploadConfigEndpoint` | (no body) | `UploadConfigResponse { MaxFileSizeMB, AllowedExtensions[], PreviewRowCount }` | `RequireAuthorization()` |

This is the **only** endpoint **outside** the `contact-groups` group — it deliberately doesn't sit under `/uploads/` because the frontend calls it before any upload session exists.

## UploadEndpointGroup — `/api/contact-groups/uploads/*` (3 endpoints, all `RequireAuthorization()`)

| Method | Route | Handler | Request | Response (T) | OpenAPI Status Codes |
|---|---|---|---|---|---|
| POST | `/api/contact-groups/uploads/init` | `InitUploadEndpoint` | `InitUploadRequest { FileName, ContentType, FileSizeBytes }` | `InitUploadResponse` (pre-signed PUT URL + uploadId) | 201, 400, 401 |
| POST | `/api/contact-groups/uploads/{uploadId}/complete` | `CompleteUploadEndpoint` | `CompleteUploadRequest { UploadId }` | `CompleteUploadResponse` (preview rows, detected columns, hasHeader) | 200, 400, 401, 404 |
| GET | `/api/contact-groups/uploads/{uploadId}/preview` | `GetUploadPreviewEndpoint` | `GetUploadPreviewRequest { UploadId }` | `CompleteUploadResponse` (same shape — preview can be re-fetched) | 200, 400, 401, 404 |

## Internal — `/api/_internal/*` (excluded from OpenAPI)

| Method | Route | Handler | Auth | Purpose |
|---|---|---|---|---|
| GET | `/api/_internal/info` | `ServiceInfoEndpoint` | `AllowAnonymous` | Returns `{ service: "contact-group", status: "running" }`. Lightweight liveness probe + guarantees FastEndpoints discovers at least one endpoint (preventing startup crash). |
| POST | `/api/_internal/cleanup/trigger` | `DebugTriggerCleanupEndpoint` | `AllowAnonymous` | **Dev-only** — runs the cleanup job inline (both passes). Returns 404 in non-Development environments. Used by e2e tests to deterministically exercise orphan-purge logic without waiting for the daily Hangfire cron. |

## Health Endpoints

| Method | Route |
|---|---|
| GET | `/health` (via `MapHealthEndpoints()`) — `AllowAnonymous` |

## Verb Count

- GET: 6
- POST: 4
- PATCH: 2
- DELETE: 1
- Total: **13** (plus 2 internal, 1 health = 16 endpoints)
