# Contact Group upload — origin/main backend-parity (2026-05-31) ✅ COMPLETE

**Repo/branch:** C:/Falcon/Falcon/falcon-web-platform-ui · polishing-v0.4 · **NO COMMITS**
**Verification:** `nx build management-console --configuration=development --skip-nx-cache` EXIT 0 (no new warnings) · `npx vitest run tests/contact-groups` **18/18 PASS**. NOT browser-verified (local login env-blocked — known, not a defect).

## Ask
Deep-dive origin/main's create-contact (group) + make mgmt console drive the SAME backend via the `falcon-document-uploader` component — "same backend, different UI/UX."

## Key finding (reframe)
- origin/main mgmt Create Contact Group uses the **OLD** `FalconFileUploaderComponent` (@falcon) + PrimeNG (`DynamicStepperComponent`/Toast/InputText).
- OURS (polishing-v0.4) **already** uses the **NEW** `FalconAngularDocumentUploaderComponent` (@falcon/ui-core/angular) + Falcon stepper/card/button, no PrimeNG, AND was already wire-contract-aligned to main (models.ts "Wave 15" realign: uploadUrl, {sourceIndex,originalName} columns, flat columnConfig, {id,status} create resp, full-user share policy).
- ⇒ "use the component + same backend" was largely DONE. Real work = reconcile 3 backend-BEHAVIOR deltas + revert upload timing to main.

## User decisions (AskUserQuestion)
1. **Targeted parity fixes** — keep our falcon-document-uploader UI + our bug-fixes; align only genuine call-level deltas.
2. **Match main's upload TIMING** — init on file-select; S3 PUT + complete on the Next click.

## Changes (6 files, management-console ONLY)
1. `services/contact-group-api.service.ts` — `putToPresignedUrl`: Angular HttpClient → **XMLHttpRequest** (mirrors main `uploadFileToStorage`); explicit `Content-Type = file.type||'application/octet-stream'` (= init contentType); progress capped at 99 until 2xx; kept `S3UploadProgress` shape; removed unused HttpClient/HttpRequest/HttpEvent/HttpEventType/defer + `this.raw`. `completeUpload` body `{uploadId}` → `{}`.
2. `create-contact-group.component.ts` — split `runUploadPipeline` → `initUploadOnly()` (select) + `runUploadAndComplete()` (Next); `nextStep('upload')` advances to 'configure' then PUT+complete; `canAdvanceUpload` gates on init-session-ready (not phase-done); removed unused of/switchMap.
3. `upload-group-details-step.component.ts` — `uploaderDisplayFiles` phase 'init' → queued.
4-5. 2 specs rewritten/updated for main timing.

## WHY XHR mattered
`provideHttpClient(withFetch())` — the Fetch backend cannot report UPLOAD progress, so our HttpClient PUT never streamed real progress (water bar silently dead). XHR `upload.onprogress` restores it; XHR also bypasses interceptors entirely.

## Kept (NOT regressed)
non-empty `columnConfig.alias` fallback (fixes main's blank-alias-collapse bug), `ServiceOperationResult`+`catchError` envelope, `description`/`hasHeader` create extras. Shared i18n untouched.

## Memory
Updated topic file `project_contact_group_uploader_rewire_falcon_defaults_2026_05_30.md` (2026-05-31 SUPERSEDED section) + its MEMORY.md index line.

## Parked
`photo-uploader-to-falcon-uploader-migration-2026-05-31` → `20260531_photo-uploader-migration_PARKED.md` (awaiting 2 user decisions).
