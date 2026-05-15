*** Validation V-contact-group-file-size-cap — Upload file size must be ≤ MaxFileSizeMB ***
*** Origin: PRD-04 Contact Group Management · Backend: contact-group · 2026-05-15 ***

# V-contact-group-file-size-cap — Contact file must be ≤ server-configured `MaxFileSizeMB` (App Settings)

> Contact-group uploads are size-capped to a configurable App Settings value. The PRD locks the rule but not the number — the server is the single source of the cap, returned via `upload-config` and enforced at both `init` and `complete`.

## Origin (PRD)

- **PRD:** [[04 Contact Group Management]]
- **Source file:** [BUSINESS_RULES](../../../Brain%20Outputs/prd/modules/04-contact-group-management/BUSINESS_RULES.md)
- **Rule id:** `BR-CGM-04` (+ OPEN row `BR-CGM-30` — default value not documented)
- **PRD line reference:** "Contact file must be CSV / XLS / XLSX. Size capped by App Settings (configurable per system)." (`latest-prd.md:30, 55`)
- **Excel cell:** none (PRD prose only)
- **Workflow context:** Wizard Step 1 — Upload & Set Details ([WORKFLOWS](../../../Brain%20Outputs/prd/modules/04-contact-group-management/WORKFLOWS.md) §W1 pre-step). Frontend MUST learn `MaxFileSizeMB` from `GET /api/contact-groups/upload-config` before allowing upload.

## Backend enforcement

- **Service:** [[Contact Group Service]]
- **DTO:** `InitUploadRequest.FileSizeBytes: long` (declared up front); `UploadConfigResponse.MaxFileSizeMB: int` (server returns the cap)
- **Attribute:** `InitUploadRequestValidator` — `FileSizeBytes` rule `> 0` → `FalconKeys.Error.InvalidFileSize` (rejects zero/negative). Handler-level check then compares `FileSizeBytes` against `FileImport:MaxFileSizeMB` and throws `FileSizeExceeded` when over the cap.
- **Error code:** `FalconKeys.Error.FileSizeExceeded` (400) — over the cap
- **Related codes:** `InvalidFileSize` (400, ≤0); `FileEmpty` (400, 0-byte stream after upload); `ImportTooLarge` (400, rows > `FileImport:MaxRowsPerImport`)
- **Source file:** [VALIDATIONS](../../../Brain%20Outputs/understanding/backend/contact-group/VALIDATIONS.md) (`InitUploadRequestValidator` row + handler-level File-validation table)
- **Error catalog:** [ERRORS](../../../Brain%20Outputs/understanding/backend/contact-group/ERRORS.md) (Validation Errors table)
- **DTO dictionary:** [DTO_DICTIONARY](../../../Brain%20Outputs/understanding/backend/contact-group/DTO_DICTIONARY.md) (`InitUploadRequest` + `UploadConfigResponse`)
- **Endpoint:** `POST /api/contact-groups/uploads/init` (declared size) + `POST /api/contact-groups/uploads/{uploadId}/complete` (post-PUT real size) ([ENDPOINT_REGISTRY](../../../Brain%20Outputs/understanding/backend/contact-group/ENDPOINT_REGISTRY.md))

**Honest call:** the cap is configured server-side (`FileImport:MaxFileSizeMB`) and exposed to the frontend via `upload-config`. PRD-04 `BR-CGM-30` flags that no default value is documented — the runtime number is whatever the deployed `appsettings` carry. Treat the `MaxFileSizeMB` returned by `upload-config` as the only authoritative cap.

## Frontend implementation hint

- **Form / page section:** Create Contact Group wizard — Step 1 (Upload & Set Details) — file input + size hint. Page surface: Contact Groups list (frontend pending per GAP-CGM-34).
- **Suggested validator wiring:**
  - Call `GET /api/contact-groups/upload-config` once on wizard mount; cache `MaxFileSizeMB`.
  - Synchronous Angular validator `falconFileSizeValidator(maxMB: number)` rejecting `file.size > maxMB * 1024 * 1024` BEFORE `init` is called. Maps to error code `FileSizeExceeded` on server reject (defense in depth).
  - Display the cap in the field hint ("Up to {{ maxMB }} MB"). Pull from cache, not hardcoded.
  - **Inferred** path: `apps/admin-console/.../create-contact-group/validators/file-size.validator.ts`.
- **Page note:** [[Organization Hierarchy]] (Contact Groups page not yet seeded under `10-Pages/`)

## Cross-domain links

- **Permission gate:** [[Contact Group Permission Matrix]] — only Client AO / NA / NU can create
- **Business rule cluster:** [[04 Contact Group Management]] BR-CGM-04 (paired with BR-CGM-30 OPEN — default value unspecified)
- **Sister rule:** [[V-contact-group-file-type-allowlist]] — same upload, paired type allowlist
- **Related learning events:** none yet
- **Open gap:** `GAP-CGM-27` — default `MaxFileSizeMB` value not documented

## Hubs

- [[VALIDATION_INDEX]] · [[PRD_INDEX]] · [[BACKEND_INDEX]] · [[AMMAR_BRAIN_HOME]] · [[BUSINESS_INDEX]] · [[GAPS_INDEX]]
