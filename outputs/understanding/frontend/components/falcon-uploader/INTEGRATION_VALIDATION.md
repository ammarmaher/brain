# falcon-angular-uploader — Integration & Validation Layer

> Layer 3 of 3. UI layer → `OVERVIEW.md` etc. Business layer → `BUSINESS.md`.

## Owning backend module(s)
**None — at the component level.** `[CODE]` `falcon-uploader.tsx:9-11` the uploader runs no HTTP and owns no data; it is a presentational state-painter.
`[INFERRED]` The *files* it represents are uploaded by the consuming app to whichever backend module owns that document — typically **Commerce** (account documents, logos) for org-hierarchy attachments, or **Identity** (user profile assets). The owning module is determined by the firing flow, not by the component.

## Backend wiring
| Endpoint | Method | Backend module | DTO (req / resp) | Gateway | Notes |
|---|---|---|---|---|---|
| — | — | — | — | — | The component binds to **no endpoint**. The consumer performs the upload (e.g. `POST` multipart to a document endpoint) and feeds results back via the `value` / `FalconUploaderFile[]` contract. |

`[INFERRED]` Typical integration: the consumer's `fileAdd` handler kicks off an upload, sets `file.status='uploading'` + `progress`, then on completion sets `'success'` + `url`, or `'error'` + `errorMessage`. The `FalconUploaderFile.url` field is where the consumer parks the uploaded asset's server URL.

## Validation rules (V-*)
| V-rule | Field | Trigger | Error code / message |
|---|---|---|---|
| Native `accept` filter | file type | OS file picker | advisory only — `accept` attribute on the inner `<input type="file">`. |
| Consumer-driven rejection | any file | app logic decides | `fileError` output carries `FalconUploaderErrorDetail { code: 'too-large' \| 'wrong-type' \| 'too-many' \| 'custom', message }`. |
| `required` form gate | the file list | empty submit | `[CODE]` `falcon-uploader.component.ts:57` `required` input — CVA participates in form validity; an empty required uploader is invalid. |

`[CODE]` `OVERVIEW.md` — **validation is explicitly DEFERRED.** The component enforces nothing beyond the native `accept`; mime/size/count rules must run in app code, which then sets `file.status` / `errorMessage` and (optionally) emits via `fileError`.

## PES keys gating this component
**None of its own.** `[INFERRED]` The uploader inherits the gate of the *field/section* it sits in — where the host form section is PES-gated (e.g. a Falcon-only document slot), the parent step renders the uploader `[disabled]` or `[readonly]` (`disabledSig` / `readonlySig` signals exist for exactly this).

## State / signal pattern
`[CODE]` `falcon-uploader.component.ts:81-83` — internal state is three signals: `files` (`ReadonlyArray<FalconUploaderFile>`), `disabledSig`, `readonlySig`.
`[CODE]` `falcon-uploader.component.ts:45` — the wrapper is a **`ControlValueAccessor`** (`NG_VALUE_ACCESSOR` via `forwardRef`). `writeValue` / `registerOnChange` / `registerOnTouched` / `setDisabledState` are all implemented — it binds with `[(ngModel)]` / reactive `formControlName`.
`[CODE]` `falcon-uploader.component.ts:127-133` — `handleChange` reads the Stencil `falcon-change` `CustomEvent`, `.set()`s the `files` signal, calls `onChange(detail.files)`, and emits `valueChange`. The consumer's form control receives the file array.
`[CODE]` `falcon-uploader.component.ts:153-157` — `handleBlur` calls `onTouched()` so the form control's `touched` state tracks the native input blur.
`[CODE]` `falcon-uploader.component.ts:47-49` — `ngOnInit` calls `defineFalconTwComponent('falcon-uploader')` to lazily register the Stencil custom element (Wave 5).

## Skeleton ↔ app-wrapper layering
- **Stencil skeleton** — `<falcon-uploader>` (Shadow, `shadow:true` `[CODE]` `falcon-uploader.tsx:47`) / `<falcon-uploader-tw>` (Light DOM). Pure presentational; owns drag/drop event handling, renders rows, no service, no validation.
- **Stencil utils** — `falcon-uploader.utils.ts` provides `clampProgress`, `fileTypeIconClass`, `formatFileSize`, `shouldShowPreview`, `statusLabel` — pure helpers.
- **Angular wrapper** — `<falcon-angular-uploader>`: the CVA layer, signal state, event re-emission. `useTailwind=true` (default) switches to the Light-DOM render path.
- Per `feedback_library_skeleton_app_api` — the skeleton is service-free; the *app* performs the upload. The wrapper does not inject any service either; it is a pure CVA bridge.

## Error-pipeline behavior
`[INFERRED]` The uploader is not wired into the host-shell HTTP error pipeline. If the consumer's upload `POST` fails, the *consumer* catches it (its own subscription / the global `falcon-http-ui.config.ts` interceptor may fire a toast) and then sets `file.status='error'` + `errorMessage` so the uploader row reflects it. The component does not auto-react to HTTP failures.

## Integration gotchas
- `[CODE]` **The component never uploads** — feeding it files does not trigger an HTTP request. Forgetting to wire the actual upload is the #1 integration mistake.
- `[CODE]` `falcon-uploader.types.ts:18` **`FalconUploaderFile.id` is required and consumer-assigned** — the component does not generate it. A stable id is needed for the row `track` key; reusing ids causes row-identity bugs.
- `[INFERRED]` **`accept`/`maxSize`/`maxFiles` are advisory** — re-validate in app code; the OS picker can be bypassed by drag-drop.
- `[CODE]` `falcon-uploader.component.ts:90-95` `value` is `ReadonlyArray` — treat the file list as immutable; rebuild a new array to update a row's status, never mutate in place (OnPush + signal equality).
- `[CODE]` progress-bar width is the **only inline style** (the documented "escape hatch") — geometry comes from `file.progress` data, not a CSS var; do not try to token-override the progress width.

## Verification
🟡 CODE-DERIVED from `falcon-uploader.tsx`, `falcon-uploader.component.ts`, `falcon-uploader.types.ts` + the 6 UI dossier files. "Validation deferred" ✅ VERIFIED in the Stencil source header comment. Backend-module attribution + error-pipeline non-wiring are `[INFERRED]`.
