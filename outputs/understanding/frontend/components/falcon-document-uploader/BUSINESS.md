# falcon-document-uploader — Business Layer

> Layer 2 of 3. UI layer → `OVERVIEW.md` / `API.md` / `USAGE.md` / `TOKENS.md`. Integration layer → `INTEGRATION_VALIDATION.md`.

## Business purpose

`[BRAIN-OUT]` The document-uploader is how an operator brings a **structured document — usually a spreadsheet of contacts, or a PDF/DOCX attachment — into Falcon**. In business terms it is the front door for **bulk data ingest** (the contact-groups CSV/Excel import) and **document attachment** (template media). Its differentiator vs the image-uploader twin is the file domain (xlsx/xls/csv/pdf/docx, 10 MB) and the doc/spreadsheet glyph (no image preview). It exposes the **raw `File`** so the consuming flow can run a real upload pipeline (S3 pre-signed URL), making it the component that actually moves business data off the operator's machine.

## PRD / business rules touched

| Rule | Source | How this component enforces / surfaces it |
|---|---|---|
| Contact uploads accept a constrained file set + size | `[CODE]` default `accept='xlsx,xls,csv,pdf,docx'`, `maxSizeMB=10` (tsx:70-73); contact-groups feeds the canonical `acceptAttr()`/`maxSizeMB()` from `FALCON_UPLOADER_DEFAULTS.document` (upload-group-details-step.ts:94-96) | Client-side ext+size gate rejects wrong-type/too-large before any upload (`falcon-error` codes `wrong-type`/`too-large`); the real authority is the backend `upload-config`. |
| The raw file must reach the upload pipeline | `[CODE]` `(fileAdd).nativeFile` (types.ts:53-59 "closes FLAG B-CG-2"); upload-group-details-step.ts:6-8 | The operator's actual `File` is handed to the consumer so the S3 handshake can stream the real bytes (not a re-encoded copy). |
| Upload progress must be visible to the operator | `[CODE]` `status==='uploading'` → water/bar progress + `multiUploadingTemplate` copy; contact-group-api.service.ts maps `ContactUploadPhase` → the uploader's file status (svc:104-106) | The progress bar reflects the REAL S3 byte-level upload (XHR `upload.onprogress`), not a fake timer. |
| Network failures are recoverable | `[CODE]` `errorCode='network'` + `networkErrorTemplate` + `(fileRetry)` / `retryAllText` | A failed upload shows a retry affordance + a localized network-error banner. |

## Business constraints baked in

- `[CODE]` **Validation is ext+size ONLY at the client; everything else is the consumer's** — `ingestFiles` (shared behavior) checks extension + size; status/progress/url/network-errors are driven by the consumer via `setFiles()` / the bound value. A builder must NOT treat "the component accepted the file" as "the upload succeeded."
- `[CODE]` **Canonical constraints come from DI, not literals** — contact-groups reads `accept`/`maxSizeMB` from `FALCON_UPLOADER_DEFAULTS.document` (the one source platform-wide), `[CODE]` "replacing the previously hardcoded 'xlsx,xls,csv,pdf,docx' / 10 magic values" (upload-group-details-step.ts:93-95). Business tuning of the allowed set happens in `falcon-component-defaults.json`, not per page.
- `[CODE]` **Single by default (`multiple=false`)** — the contact import is one file; multi is opt-in.
- `[CODE]` **No image preview** — the document variant shows a spreadsheet/doc glyph (tsx:4-6); a business artifact that needs a visual preview should use the image uploader.
- `[CODE]` **The `-tw` (Tailwind) render path is mandatory in apps** — the Shadow tag is unregistered and renders blank (a real operational constraint, not cosmetic; upload-group-details-step.html:50-52).

## Business flows using this component

| Flow | Page | Role of the component in the flow |
|---|---|---|
| Create Contact Group — upload step | management-console contact-groups wizard (Step 1) | Capture the CSV/Excel of contacts; hand the raw `File` to the S3 init→PUT→complete→preview pipeline. THE flagship business use. |
| Template media attachment | templates wizard Step 2 (admin + management) | Capture a document/video file for the template (image branch uses the image uploader). |
| (general) document attach | any "attach a spreadsheet/PDF/doc" step | Capture + validate ext/size; consumer uploads. |

`[CODE]` Contact-groups is the deepest integration — see `INTEGRATION_VALIDATION.md` for the S3 handshake (`upload-config` → `uploads/init` → external PUT → `uploads/{id}/complete` → `preview`).

## Business gotchas

- "File added" ≠ "data ingested." `(fileAdd)` fires on every pick/drop (pass OR fail validation); the business data lands only when the consumer's upload + the backend `complete` + `preview` resolve.
- The client ext/size gate is a UX courtesy mirroring the backend `upload-config`; the backend is authoritative (a CSV that passes the client may still be rejected on `complete`/validation).
- `(fileRemove)` clears the local file but does NOT delete an already-uploaded S3 object — the consumer/backend owns cleanup.
- Because the contact import streams the real `File` to a **pre-signed S3 URL bypassing the Falcon gateway** (XHR, not HttpClient), the upload is untouched by interceptors — a business-relevant security/observability note (the bytes never traverse the gateway; only the init/complete handshake does).
- The same component is the image twin's sibling — picking the wrong variant (`<falcon-angular-image-uploader>` for a CSV) would show an image-preview UX that misfits documents.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B19) — defaults (tsx:70-73), `(fileAdd).nativeFile` raw-File contract (types.ts:53-59), DI-sourced constraints (upload-group-details-step.ts:93-96), `-tw`-mandatory operational note (html:50-52), and the `ContactUploadPhase`→status mapping (contact-group-api.service.ts:104-106) all read from live source. ✅ Contact-groups import is a user-confirmed working feature (`[MEMORY]` mgmt-console-port). 🟡 PRD/V-rule IDs for the allowed file set are CODE-DERIVED from the backend `upload-config` reference (not read from PRD this pass) — `[INFERRED]`.
