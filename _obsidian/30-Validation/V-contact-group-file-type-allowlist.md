*** Validation V-contact-group-file-type-allowlist — Upload file type must be CSV / XLS / XLSX ***
*** Origin: PRD-04 Contact Group Management · Backend: contact-group · 2026-05-15 ***

# V-contact-group-file-type-allowlist — Contact file extension must be in the server-configured allowlist (CSV / XLS / XLSX)

> The contact file the user uploads to seed a Contact Group must be one of CSV / XLS / XLSX. The list is configurable per-system (App Settings) and the server is the source of truth — frontend reads it before showing the picker, server enforces it on `complete`.

## Origin (PRD)

- **PRD:** [[04 Contact Group Management]]
- **Source file:** [BUSINESS_RULES](../../../Brain%20Outputs/prd/modules/04-contact-group-management/BUSINESS_RULES.md)
- **Rule id:** `BR-CGM-04`
- **PRD line reference:** "Contact file must be CSV / XLS / XLSX. Size capped by App Settings (configurable per system)." (`latest-prd.md:30, 55`)
- **Excel cell:** none (PRD prose only)
- **Workflow context:** Wizard Step 1 — Upload & Set Details ([WORKFLOWS](../../../Brain%20Outputs/prd/modules/04-contact-group-management/WORKFLOWS.md) §W1 pre-step + step 1). PRD also explicitly says "file content is NOT validated beyond parsing" (BR-CGM-08) — only the *type* is gated.

## Backend enforcement

- **Service:** [[Contact Group Service]]
- **DTO:** `UploadConfigResponse.AllowedExtensions: List<string>` (server tells frontend what is allowed); `CompleteUploadRequest` / handler then enforces extension against `FileImport:AllowedExtensions` config
- **Attribute:** No DTO-level FluentValidation rule — extension allowlist is **handler-level**. Server-side check throws `FalconException(FalconKeys.Error.InvalidFileType)` when the uploaded blob's extension is not in `FileImport:AllowedExtensions`.
- **Error code:** `FalconKeys.Error.InvalidFileType` (400)
- **Related codes:** `FileEmpty` (0-byte file), `FileParseError` (CSV/XLSX parser failure), `NoDataRows` (header but zero data rows)
- **Source file:** [VALIDATIONS](../../../Brain%20Outputs/understanding/backend/contact-group/VALIDATIONS.md) (File validation row in the handler-level table)
- **Error catalog:** [ERRORS](../../../Brain%20Outputs/understanding/backend/contact-group/ERRORS.md) (Validation Errors table)
- **DTO dictionary:** [DTO_DICTIONARY](../../../Brain%20Outputs/understanding/backend/contact-group/DTO_DICTIONARY.md) (`UploadConfigResponse`)
- **Endpoint:** `GET /api/contact-groups/upload-config` returns the allowlist; `POST /api/contact-groups/uploads/{uploadId}/complete` enforces it ([ENDPOINT_REGISTRY](../../../Brain%20Outputs/understanding/backend/contact-group/ENDPOINT_REGISTRY.md))

**Honest call:** the allowlist itself is configured in `appsettings` (`FileImport:AllowedExtensions`) — the PRD pins CSV/XLS/XLSX but the server treats it as a tunable list. Default value of the config key is not documented in Brain Outputs (Q-CGM-01 / BR-CGM-30 OPEN).

## Frontend implementation hint

- **Form / page section:** Create Contact Group wizard — Step 1 (Upload & Set Details) — file input. The wizard surface lives under the (yet-to-be-built) Contact Groups list page — **frontend pending** (GAP-CGM-34, story 115329).
- **Suggested validator wiring:**
  - On wizard open, call `GET /api/contact-groups/upload-config` and cache `AllowedExtensions[]` + `MaxFileSizeMB` for the session.
  - Use the cached list to (a) restrict the native file picker via `<input type="file" [accept]="allowedExts">`, (b) drive a synchronous Angular validator that rejects files with disallowed extension before init-upload is called, (c) drive [[Falcon Uploader]] component's `acceptedTypes` input.
  - On server reject (`InvalidFileType`), surface the localized message from `ErrorMessages.{en,ar}.resx`.
  - Suggested validator name: `falconFileExtensionValidator(allowed: string[])` — **inferred** path `apps/admin-console/.../create-contact-group/validators/file-extension.validator.ts`.
- **Page note:** [[Organization Hierarchy]] (Contact Groups page not yet seeded under `10-Pages/`)

## Cross-domain links

- **Permission gate:** [[Contact Group Permission Matrix]] — only Client AO / NA / NU can create (BR-CGM-13..19). Falcon usertype is view-only.
- **Business rule cluster:** [[04 Contact Group Management]] BR-CGM-04 + BR-CGM-08 (file gated on TYPE only, not content)
- **Sister rule:** [[V-contact-group-file-size-cap]] — same upload, paired size cap
- **Related learning events:** none yet

## Hubs

- [[VALIDATION_INDEX]] · [[PRD_INDEX]] · [[BACKEND_INDEX]] · [[AMMAR_BRAIN_HOME]] · [[BUSINESS_INDEX]] · [[GAPS_INDEX]]
