# Contact Group Service — Frontend Contract

## Base URLs

| Environment | Direct | Via Core Gateway (Client) | Via System Gateway (Falcon admin) |
|---|---|---|---|
| Local dev | `http://localhost:7300/api` | `https://localhost:7038/contactgroup/*` | `https://localhost:7256/contactgroup/*` |
| Prod | n/a | `<core-gateway>/contactgroup/*` | `<system-gateway>/contactgroup/*` |

Path transform: gateway strips `/contactgroup` and prepends `/api/`. So `https://core-gateway/contactgroup/contact-groups` → Contact Group `/api/contact-groups`.

## Authentication

`Authorization: Bearer <zitadel-jwt>` required on all endpoints **except** `/api/_internal/*` and `/health` (anonymous, dev-only / probes).

## Response Wrapper

All endpoints return `ServiceOperationResult<T>`. CamelCase JSON serialization is explicitly configured (`JsonNamingPolicy.CamelCase`).

## Upload → Create Flow (Most Important)

Three-step flow + finalization:

```
1) GET /contactgroup/contact-groups/upload-config
   → { maxFileSizeMB: 2048, allowedExtensions: ["csv","xlsx","xls"], previewRowCount: 5 }

2) POST /contactgroup/contact-groups/uploads/init
   body: { fileName, contentType, fileSizeBytes }
   → 201 { uploadId, preSignedUrl, expiresInSeconds: 300, ... }

3) PUT <preSignedUrl> (directly to S3, NOT through gateway)
   body: <file binary>
   → 200 (S3 response — no Falcon involvement)

4) POST /contactgroup/contact-groups/uploads/{uploadId}/complete
   body: {} (uploadId is from route)
   → 200 { hasHeader, detectedColumns[], previewRows[][], ... }

5) (optionally — re-fetch preview)
   GET /contactgroup/contact-groups/uploads/{uploadId}/preview
   → 200 (same CompleteUploadResponse shape)

6) POST /contactgroup/contact-groups
   body: { uploadSessionId, name, referenceId, hasHeader, columnConfig, sharePolicy }
   → 201 { groupId, ... }
```

**Critical**: step 3 is a **direct browser → S3 PUT** (or `XHR` / `fetch`) using the pre-signed URL. The frontend must NOT proxy this through the Falcon gateway. The URL has a 5-minute validity window (`UploadUrlExpiryMinutes: 5`).

## List & Browse

```
GET /contactgroup/contact-groups?nodeId=...&page=1&pageSize=20
  → 200 PagedResult<ContactGroupListItemDto>

GET /contactgroup/contact-groups/shared?page=1&pageSize=20
  → 200 PagedResult<ContactGroupListItemDto>
  (Only callable by client Normal Users — role 6 — per the endpoint summary)

GET /contactgroup/contact-groups/{groupId}
  → 200 GetContactGroupDetailsResponse (full details + column schema)

GET /contactgroup/contact-groups/{groupId}/contacts?page=1&pageSize=10
  → 200 PagedResult<Dictionary<string, object>>  (dynamic alias-keyed rows)
```

**Dynamic-keyed contacts:** the `items[]` array contains dictionaries whose keys are determined by `columnConfig.aliases` at create time. Frontend must read the column schema from `GetContactGroupDetailsResponse` first.

## Edit / Share / Delete

```
PATCH /contactgroup/contact-groups/{groupId}
  body: { name?, referenceId?, sharePolicy? }
  → 200 GetContactGroupDetailsResponse (refreshed)

PATCH /contactgroup/contact-groups/{groupId}/share
  body: { sharedWithAllUsers: true|false, sharedUsers: [{ userId, ... }] }
  → 200 (null body)

DELETE /contactgroup/contact-groups/{groupId}
  → 200 (null body, soft delete; physical purge after Hangfire:SoftDeleteRetentionDays = 7 days)
```

Only the **creator** can edit/share/delete. Other shared-with users see read-only access — attempting edit returns 403 with `ForbiddenToEditContactGroup`.

## File Downloads

```
GET /contactgroup/contact-groups/{groupId}/files/original
  → 200 { downloadUrl, fileName, expiresInSeconds: 900 }

GET /contactgroup/contact-groups/{groupId}/files/validated
  → 200 { downloadUrl, fileName, expiresInSeconds: 900 }
```

Frontend gets a 15-min pre-signed S3 GET URL, then downloads directly from S3.

## Pagination

`PagedResult<T> = { items, totalCount, page, pageSize }` (inferred camelCase). Pages are 1-based.

## Status Codes

| Status | Cause |
|---|---|
| 201 | Resource created (`POST /contact-groups`, `POST /uploads/init`) |
| 200 | OK |
| 400 | Validation failed (file size, file type, name format, page bounds, …) |
| 401 | Missing/invalid JWT |
| 403 | Not creator, or not in node hierarchy, or shared-with permission missing |
| 404 | Group not found, upload session not found, file not found |
| 409 | Upload session already used/completed, duplicate entity |
| 410 | Upload session expired |
| 422 | Business rule violation (no changes to update, etc.) |
| 500 | S3 copy failed, internal error |
| 502/503/504 | Identity service call failed/unreachable/timed out |

## Sharing Frontend Logic

`SharePolicy.SharedWithAllUsers: true` → all tenant users see the group. Frontend should disable the user picker.

`SharePolicy.SharedWithAllUsers: false` + `SharedUsers: [...]` → only listed user ids see it. Frontend shows the picker. User ids are validated against Identity via east-west call — if Identity is down, the share request fails with `IdentityServiceError/Timeout/ConnectionError`.

## Multi-Language

No multi-language fields. Group names are user-entered single-language strings.

## CORS

`Cors:AllowedOrigins` per appsettings. Plus the **S3 bucket** must have CORS configured to allow PUT/GET from the frontend origin — separate from Falcon's CORS.

## OpenAPI / Swagger

In dev: `https://localhost:7300/openapi/v1.json` (no Swagger UI; FastEndpoints emits the OpenAPI document, render with an external viewer).

## Deviations

| Standard | Status |
|---|---|
| `ServiceOperationResult<T>` | Conformant |
| camelCase JSON | Conformant (explicit) |
| `MultiLanguage` | Not used (intentional — user-entered names) |
| Route prefix `/api/contact-groups` | Conformant (kebab-case) |
| Status code rigor | Strong — every endpoint declares `Produces<...>(NNN)` and `ProducesProblem(NNN)` in `Description(d => d.WithName(...).Produces<...>(...).ProducesProblem(...))` |
