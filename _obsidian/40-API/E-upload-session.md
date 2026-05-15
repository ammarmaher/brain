*** Entity Reconciliation E-upload-session — UploadSession ***
*** PRD: PRD-04 Contact Group Management · Backend service: contact-group · 2026-05-15 ***

# E-upload-session — UploadSession

> Pre-create scratch space for the uploaded file before commit. The client uploads the file to a pre-signed S3 URL during a session, the backend validates it + extracts preview rows, and the session is later consumed by `CreateContactGroupRequest.UploadSessionId`. PRD models a 4-state lifecycle (`Init → Complete → Used | Abandoned`); backend exposes 3 endpoints + 1 config endpoint. Sessions expire and are background-cleaned via Hangfire.

## PRD definition (business-conceptual)

- **PRD module:** [[04 Contact Group Management]]
- **Source:** [ENTITIES.md](../../../Brain%20Outputs/prd/modules/04-contact-group-management/ENTITIES.md)
- **PRD fields:**
  - `uploadId`: opaque id
  - `fileName`: string
  - `contentType`: string (`csv`, `xls`, `xlsx` allowed per `AppSetting.allowedExtensions`)
  - `fileSizeBytes`: long
  - `expiresAt`: datetime — session lifetime
  - `hasHeader`: bool — derived from file structure
  - `detectedColumns[]`: array of column names auto-detected from the file
  - `previewRows[][]`: 2-D array of preview rows
- **Lifecycle states (PRD):** `Init → Complete → Used | Abandoned`
- **Inferred backend states:** `Initialized | Completed | Abandoned | Expired`
- **Relationship:** `N:0..1 ContactGroup` (when committed)

## Backend DTO mapping

- **Service:** [[Contact Group Service]]
- **DTO source:** [DTO_DICTIONARY.md](../../../Brain%20Outputs/understanding/backend/contact-group/DTO_DICTIONARY.md)
- **Validation source:** [VALIDATIONS.md](../../../Brain%20Outputs/understanding/backend/contact-group/VALIDATIONS.md)
- **Endpoint group:** `/api/contact-groups/uploads/*` (3 endpoints) + `/api/contact-groups/upload-config` (1 standalone — needed before any session exists)
- **Relevant DTOs (request):**
  - `InitUploadRequest` — `POST /uploads/init` — `{ FileName, ContentType, FileSizeBytes }`
  - `CompleteUploadRequest` — `POST /uploads/{uploadId}/complete` — `{ UploadId }`
  - `GetUploadPreviewRequest` — `GET /uploads/{uploadId}/preview` — `{ UploadId }`
- **Relevant DTOs (response):**
  - `InitUploadResponse` — `{ UploadId, PreSignedUrl, ExpiresInSeconds, MaxFileSizeMB, … }`
  - `CompleteUploadResponse` — `{ HasHeader, DetectedColumns[], PreviewRows[][], … }` (also returned by preview)
  - `UploadConfigResponse` — `{ MaxFileSizeMB, AllowedExtensions[], PreviewRowCount }`

## Field reconciliation

| PRD field | Backend DTO field | Type (PRD → Backend) | Drift / status |
|---|---|---|---|
| `uploadId` | `UploadId` (InitUploadResponse) / route param on Complete + Preview / `CreateContactGroupRequest.UploadSessionId` | opaque → `string` | ⚠ naming drift — PRD `uploadId` ↔ backend `UploadId` on the upload DTOs but `UploadSessionId` on `CreateContactGroupRequest`. Same value, two field names |
| `fileName` | `FileName` (InitUploadRequest) | string → `string` `NotEmpty + MaximumLength(255)` | ✅ match. ⚠ Backend cap is **255**; PRD silent on a cap |
| `contentType` | `ContentType` (InitUploadRequest) | string → `string` `NotEmpty` | ✅ match. Allowed values constrained by [[V-contact-group-file-type-allowlist]] (handler-time check, not DTO-time) |
| `fileSizeBytes` | `FileSizeBytes` (InitUploadRequest) | long → `long` `> 0` (`InvalidFileSize`) | ✅ lower-bound match. Upper bound enforced at handler-time against `UploadConfigResponse.MaxFileSizeMB`. See [[V-contact-group-file-size-cap]] |
| `expiresAt` (datetime) | `ExpiresInSeconds` (InitUploadResponse) | datetime → **`int` (seconds-from-now)** | ⚠ shape drift — PRD models an absolute datetime; backend returns a relative TTL. FE must compute `expiresAt = now + ExpiresInSeconds` |
| `hasHeader` (derived) | `HasHeader` (CompleteUploadResponse) | bool → `bool` | ✅ match — backend computes during complete/preview |
| `detectedColumns[]` | `DetectedColumns[]` (CompleteUploadResponse) | string[] → `string[]` (inferred) | ✅ match |
| `previewRows[][]` | `PreviewRows[][]` (CompleteUploadResponse) | string[][] → 2-D array | ✅ match — row count capped by `UploadConfigResponse.PreviewRowCount` |
| `state` (PRD: `Init`/`Complete`/`Used`/`Abandoned`) | _no explicit state field on response DTOs_ | enum → _absent_ | ❌ missing on response shape — state is encoded via error codes: `UploadSessionNotFound` / `UploadSessionExpired` / `UploadSessionAlreadyCompleted` / `UploadSessionNotReady` / `UploadSessionAlreadyUsed`. FE cannot poll the session's current state; must react to errors |
| _PRD silent_ | `PreSignedUrl` (InitUploadResponse) | _PRD models upload abstractly_ | ➕ extra — actual S3 PUT URL the client uploads to |
| _PRD silent_ | `MaxFileSizeMB` (InitUploadResponse) | _PRD has cap on AppSetting_ | ➕ extra — echoed on init response (also available standalone via `UploadConfigResponse`) |

### `UploadConfigResponse` (standalone — read before any session) ↔ PRD `AppSetting`

| PRD field | Backend DTO field | Type (PRD → Backend) | Drift / status |
|---|---|---|---|
| `AppSetting.maxFileSizeMB` | `MaxFileSizeMB` (UploadConfigResponse) | int → `int` | ✅ match |
| `AppSetting.allowedExtensions[]` (`csv`, `xls`, `xlsx`) | `AllowedExtensions[]` (UploadConfigResponse) | string[] → `List<string>` | ✅ match — list is server-driven; FE must use it for file-picker filter |
| `AppSetting.previewRowCount` | `PreviewRowCount` (UploadConfigResponse) | int → `int` | ✅ match |

Legend: ✅ match · ⚠ drift · ❌ missing · ➕ extra-on-backend

## Drift / gaps summary

- ⚠ Naming drift — `UploadId` on upload DTOs vs `UploadSessionId` on the consuming `CreateContactGroupRequest`. Same value
- ⚠ Shape drift — PRD `expiresAt` (datetime) vs backend `ExpiresInSeconds` (relative TTL). FE must compute the absolute deadline
- ⚠ FileName cap drift — backend `MaximumLength(255)`; PRD silent
- ❌ **Session state not on response shape** — PRD enumerates `Init/Complete/Used/Abandoned` but backend reveals state only through error codes (5 codes covering each transition gate). FE cannot inspect a session's state without attempting a state-transition call
- ➕ `PreSignedUrl` on InitUploadResponse is the actual S3 PUT URL the client uses — PRD models the upload abstractly
- ➕ `UploadConfigResponse` is a separate endpoint (`/upload-config`) that the FE must hit before init to know caps. PRD bundles config into `AppSetting` entity
- ✅ Lifecycle gates are well-defined via error codes (`UploadSessionNotFound`, `UploadSessionExpired`, `UploadSessionAlreadyCompleted`, `UploadSessionNotReady`, `UploadSessionAlreadyUsed`)
- ✅ Background cleanup via Hangfire covers `Abandoned` state (PRD-aligned, even though the state isn't field-surfaced)

## Related validation rules (V-rule notes)

- [[V-contact-group-file-type-allowlist]] — `ContentType` / extension check against `AllowedExtensions[]` (handler-time)
- [[V-contact-group-file-size-cap]] — `FileSizeBytes` cap against `MaxFileSizeMB` (validator + handler)
- `InitUploadRequestValidator` — DTO-time rules on `FileName / ContentType / FileSizeBytes`

## Pages using this entity

_frontend pending Story 115329_ — UploadSession is consumed during the Create Contact Group wizard's upload pre-flow (Step 1 — file picker + `POST /uploads/init` → PUT to pre-signed URL → `POST /uploads/{uploadId}/complete` → preview render). No `10-Pages/` seed yet.

## Cross-service touches

- **S3** — backend issues a pre-signed PUT URL; client uploads file directly to S3. `S3CopyFailed` error indicates the post-upload validation copy step failed.
- **Hangfire** — backend background job cleans orphaned upload sessions and soft-deleted groups.
- **Contact Group create** — `CreateContactGroupRequest.UploadSessionId` joins to the completed upload session. Session transitions to `Used` after a successful join.

## Hubs

- [[API_INDEX]] · [[BACKEND_INDEX]] · [[PRD_INDEX]] · [[VALIDATION_INDEX]] · [[AMMAR_BRAIN_HOME]] · [[BUSINESS_INDEX]] · [[GAPS_INDEX]]
