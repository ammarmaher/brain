# falcon-document-uploader — Integration & Validation Layer

> Layer 3 of 3. UI layer → `OVERVIEW.md` etc. Business layer → `BUSINESS.md`.

## Owning backend module(s)

The component is **presentational** — it runs no upload and owns no data; it validates ext+size client-side and emits the raw `File`. The flow's owning module performs the upload:
- **Contact-groups service (mgmt, Core Gateway)** — the flagship: `ContactGroupApiService` runs an S3 pre-signed-URL handshake (`contactgroup/contact-groups/uploads/*`).
- **Templates media (admin + management)** — the templates wizard uploads the document to the media backend.

## Backend wiring — contact-groups CSV/Excel import (the live integration)

`[CODE]` `apps/management-console/.../contact-groups/services/contact-group-api.service.ts` (Gateway = **Core** via `useGateway()`):

| Step | Endpoint | Method | Notes |
|---|---|---|---|
| 1. File constraints | `contactgroup/contact-groups/upload-config` | GET | `[CODE]` svc:122-139 — server's allowed exts + max size (the authority behind the uploader's client-side `accept`/`maxSizeMB`). Always maps defaults so the wizard proceeds even on failure. |
| 2. Pre-signed URL | `contactgroup/contact-groups/uploads/init` | POST | `[CODE]` svc:145-165 — `InitUploadRequest` → `InitUploadResponse` (pre-signed S3 `uploadUrl` + `uploadId`). Content-Type sent at init must match the PUT. |
| 3. **Upload bytes** | the pre-signed S3 `uploadUrl` | PUT (raw `XMLHttpRequest`) | `[CODE]` svc:178-211 `putToPresignedUrl` — **bypasses the Falcon gateway AND Angular's HttpClient**. WHY XHR: (a) the app uses `withFetch()` whose backend can't report UPLOAD progress, so XHR's `upload.onprogress` gives true byte-level progress (capped at 99 until the 2xx); (b) XHR is untouched by interceptors so the AWS query-string signature reaches S3 verbatim. Emits `S3UploadProgress {loadedBytes,totalBytes,percent}`. Teardown aborts the PUT on unsubscribe. |
| 4. Finalize + preview | `contactgroup/contact-groups/uploads/{uploadId}/complete` | POST (empty body) | `[CODE]` svc:213-236 — `uploadId` in the URL path; returns `CompleteUploadResponse` (preview rows / detected columns). |
| 5. Re-fetch preview | `contactgroup/contact-groups/uploads/{uploadId}/preview` | GET | `[CODE]` svc:240-259 — on back-navigation (Wave 15 flipped POST→GET). |
| 6. Commit group | `contactgroup/contact-groups` | POST | `[CODE]` svc:306-326 — after upload + column config + share, create the group. |

`[CODE]` The component → `(fileAdd).nativeFile` (the raw `File`) → `onFileAdd($event)` (upload-group-details-step.ts) → this handshake. The uploader's file `status`/`progress` is driven by mapping `ContactUploadPhase` (`'idle'|'init'|'uploading'|'completing'|'done'|'error'`, svc:104-106) onto a `FalconFileUploaderFile` so the water bar reflects the REAL S3 progress.

> `[CODE]` **Security/observability note:** only the init/complete/preview handshake traverses the Core Gateway (JWT, interceptors). The actual bytes go directly to S3 via the pre-signed URL (no gateway, no interceptor) — by design (svc:167-177).

## Backend wiring — templates media

`[INFERRED]` The templates wizard Step 2 uploads the document/video via the templates/media backend (not read in depth this pass). The component's role is identical: validate ext+size, emit the raw `File` via `(fileAdd)`, the wizard uploads.

## Validation rules (V-*)

| V-rule | Field | Trigger | Effect |
|---|---|---|---|
| Extension allow-list | the file | pick/drop | `[CODE]` `ingestFiles` (shared behavior) rejects non-allowed exts → `falcon-error` code `wrong-type`; `extErrorTemplate` ("Pick one of: {exts}") surfaces it. Client-side; backend `upload-config` is authoritative. |
| Max size | the file | pick/drop | `[CODE]` rejects > `maxSizeMB` → `falcon-error` code `too-large`; `sizeErrorTemplate` ("exceeds the {max} MB limit"). |
| Network failure | the upload | consumer-driven | `[CODE]` consumer sets `errorCode='network'` + uses `networkErrorTemplate`; `(fileRetry)` / `retryAllText` recover. Surfaced as a banner / per-file chip (T2-NET). |
| `required` form gate | the file slot | empty submit | `[CODE]` `required` input — CVA participates in form validity. |

`[CODE]` Only ext + size are validated client-side (file-uploader.types.ts:34 `FalconFileUploaderErrorCode = 'wrong-type' | 'too-large'`). Content/schema validation is the backend's (`complete`/`preview`).

## PES keys gating this component

| PES key | Action | Effect when denied |
|---|---|---|
| (inherits the flow's PES) | reach the upload step | `[INFERRED]` the create-contact-group / template-create flow is PES-gated upstream; a user who cannot create never sees the uploader. |
| (none on the component) | pick/drop/upload | `[CODE]` the component has no PES key — it inherits the gate of the step it sits in (`[disabled]` is driven by the consumer via `effectiveDisabled`). |

## State / signal pattern

`[CODE]` falcon-document-uploader.component.ts:
- Signal `input()` for every prop; signal `output()` for the 5 outputs; `signal()` for `files` + `disabledSig` + `definedTw`; `computed()` `effectiveDisabled = disabled() || disabledSig()` (ts:159-161) so template `[disabled]` and CVA `setDisabledState` never un-disable each other.
- `ngOnInit` (ts:62-66): `defineFalconTwComponent('falcon-document-uploader').then(() => definedTw.set(true))` — **load-bearing upgrade gate** (ts:53-58): the `-tw` element renders ONLY after `customElements.define` resolves, else Angular would set element PROPERTIES before upgrade, shadowing Stencil's prototype accessors so the component renders with DEFAULTS and ignores every binding.
- `_defaults = inject(FALCON_UPLOADER_DEFAULTS).document` (ts:73) seeds input defaults; per-instance bindings win.
- CVA: `writeValue` → `files.set(...)` (ts:167-169); `handleChange` (`falcon-change`) → `files.set` + `onChange` + `(valueChange)` (ts:180-186); `handleBlur` (`falcon-blur`) → `onTouched` (ts:212-214).

## Skeleton ↔ app-wrapper layering

- **Stencil skeleton** — `<falcon-document-uploader>` (Shadow) / `<falcon-document-uploader-tw>` (Light), both `implements FileUploaderHost` and delegate ALL behavior to the shared `file-uploader-shared` engine (`ingestFiles`/`filterFiles`/`removeFile`/`retryFile`/`retryAllFiles` + `buildRowInner`/`buildTwRowInner`/`renderBanner`/`renderFileList`). `variant='document'` fixed. No service, no upload — ext+size validation + drag/drop + render only.
- **Angular wrapper** — `<falcon-angular-document-uploader>`: CVA + signal state + DI defaults + the `definedTw` upgrade gate. `useTailwind=true` (default) → `-tw`.
- Per the library/skeleton API convention, the wrapper never fetches — the consumer's state slice + API service run the upload.

## Integration gotchas

- `[CODE]` **`useTailwind=true` is effectively mandatory in apps** — the Shadow `<falcon-document-uploader>` is NOT registered (only the `-tw` self-registers via `defineFalconTwComponent`); using `useTailwind=false` without registering it renders BLANK (upload-group-details-step.html:50-52).
- `[CODE]` **`(fileAdd).nativeFile` is the upload hook** — use the RAW `File`; do not reconstruct it. The S3 PUT signs against the Content-Type sent at init, so preserve `file.type` (svc:183-185).
- `[CODE]` **Push progress/status back** via `setFiles()` (Stencil method, reach via ref) or the bound value — the component shows whatever you set.
- `[CODE]` **Bytes bypass the gateway** — the pre-signed PUT is gateway/interceptor-free (svc:167-177); only init/complete/preview carry JWT.
- `[CODE]` **`effectiveDisabled` OR-combines** the explicit `[disabled]` and CVA disabled — a reactive-forms `setDisabledState(false)` will NOT re-enable an instance that also has `[disabled]="true"`.
- `[CODE]` **Shared types** — the value is `FalconFileUploaderFile[]` (has `id`); do NOT confuse with `<falcon-single-uploader>`'s `FalconSingleUploaderFile` (no `id`).

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B19) — the full S3 handshake (`upload-config`/`uploads/init`/`putToPresignedUrl` XHR/`complete`/`preview`/create) read from contact-group-api.service.ts (svc:122-326); the `(fileAdd).nativeFile`→pipeline contract, the `definedTw` upgrade gate (ts:53-66), `effectiveDisabled` (ts:159-161), DI defaults (ts:73), and the `-tw`-mandatory note (html:50-52) all confirmed. ✅ Contact-groups import is user-confirmed working (`[MEMORY]`). 🟡 Templates-media backend wiring is `[INFERRED]` (not read this pass).
