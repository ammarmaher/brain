# falcon-angular-single-uploader — Integration & Validation Layer

> Layer 3 of 3. UI layer → `OVERVIEW.md` etc. Business layer → `BUSINESS.md`.

## Owning backend module(s)
**None — at the component level.** `[CODE]` `falcon-single-uploader.component.ts` runs no HTTP and owns no data; it is a presentational state-painter.
`[INFERRED]` The one file it represents is uploaded by the consuming app to whichever backend module owns that asset — typically **Commerce** (account logo/document) or **Identity** (a user asset). The owning module is decided by the firing flow, not the component.

## Backend wiring
| Endpoint | Method | Backend module | DTO (req / resp) | Gateway | Notes |
|---|---|---|---|---|---|
| — | — | — | — | — | The component binds to **no endpoint**. The consumer performs the upload and feeds the result back via the `value` / `FalconSingleUploaderFile` contract. |

`[INFERRED]` Typical integration: on `(fileUpload)` the consumer kicks off a `POST`, sets `file.status='uploading'` + `progress`, then on completion sets `'success'` + `url` or `'error'` + `errorMessage`. `FalconSingleUploaderFile.url` parks the uploaded asset's server URL.

## Validation rules (V-*)
| V-rule | Field | Trigger | Error code / message |
|---|---|---|---|
| Native `accept` filter | file type | OS file picker | advisory only — `accept` on the inner `<input type="file">`. |
| Consumer-driven rejection | the file | app logic decides | `fileError` output carries `FalconSingleUploaderErrorDetail { code: 'too-large' \| 'wrong-type' \| 'custom', message }`. Note: **no `'too-many'`** code — single-file, so it cannot occur. |
| `required` form gate | the file slot | empty submit | `[CODE]` `falcon-single-uploader.component.ts:59` `required` input — CVA participates in form validity; an empty required slot is invalid. |

`[CODE]` `OVERVIEW.md` — **validation is explicitly DEFERRED.** Mime/size rules run in app code, which sets `file.status` / `errorMessage`.

## PES keys gating this component
**None of its own.** `[INFERRED]` Inherits the gate of the field/section it sits in — a PES-gated document slot renders the single-uploader `[disabled]` via `disabledSig`.

## State / signal pattern
`[CODE]` `falcon-single-uploader.component.ts:80-81` — internal state is two signals: `file` (`FalconSingleUploaderFile | null`) and `disabledSig`. (No `readonlySig` — unlike the multi-file uploader.)
`[CODE]` `falcon-single-uploader.component.ts:47` — the wrapper is a **`ControlValueAccessor`** (`NG_VALUE_ACCESSOR` via `forwardRef`). `writeValue` / `registerOnChange` / `registerOnTouched` / `setDisabledState` implemented — binds with `[(ngModel)]` / `formControlName`.
`[CODE]` `falcon-single-uploader.component.ts:117-123` — `handleChange` reads the Stencil `falcon-change` event, `.set()`s the `file` signal, calls `onChange(detail.file)`, emits `valueChange`.
`[CODE]` `falcon-single-uploader.component.ts:149-153` — `handleBlur` calls `onTouched()` so the control's `touched` state tracks the native input blur.
`[CODE]` `falcon-single-uploader.component.ts:49-51` — `ngOnInit` calls `defineFalconTwComponent('falcon-single-uploader')` (Wave 5 lazy registration).

## Skeleton ↔ app-wrapper layering
- **Stencil skeleton** — `<falcon-single-uploader>` (Shadow) / `<falcon-single-uploader-tw>` (Light DOM). Pure presentational; owns drag/drop, renders empty vs filled tile, no service, no validation.
- **Stencil utils** — `falcon-single-uploader.utils.ts` — pure helpers (file-type icon, size formatting, preview decision).
- **Angular wrapper** — `<falcon-angular-single-uploader>`: the CVA layer, signal state, event re-emission. `useTailwind=true` (default) → Light-DOM path.
- Per `feedback_library_skeleton_app_api` — skeleton service-free; the app performs the upload; the wrapper is a pure CVA bridge with no service injection.

## Error-pipeline behavior
`[INFERRED]` Not wired into the host-shell HTTP error pipeline. If the consumer's upload `POST` fails, the consumer catches it (its own subscription / the global interceptor may toast) and sets `file.status='error'` + `errorMessage` so the tile reflects it.

## Integration gotchas
- `[CODE]` **The component never uploads** — the consumer runs the HTTP. The `(fileUpload)` output is the *hook to start* an upload, not evidence one happened.
- `[CODE]` `falcon-single-uploader.component.ts:137-141` **`(fileEdit)` does not replace the file** — it only emits `FalconSingleUploaderEditDetail`. The consumer must open a picker / drive the swap. Drag-drop over a filled tile *does* replace (handled in the skeleton).
- `[CODE]` `falcon-single-uploader.types.ts:14` **`FalconSingleUploaderFile` has NO `id`** — unlike the multi-file `FalconUploaderFile` (which requires `id`). The single-file value is identified by being the one-and-only file; do not look for an id field.
- `[CODE]` `falcon-single-uploader.types.ts:40-44` **No `'too-many'` error code** — the single-uploader's `FalconSingleUploaderErrorDetail` only has `'too-large' | 'wrong-type' | 'custom'`.
- `[INFERRED]` `accept`/`maxSize` are advisory — re-validate in app code; drag-drop can bypass the OS picker filter.

## Verification
🟡 CODE-DERIVED from `falcon-single-uploader.component.ts` + `falcon-single-uploader.types.ts` + the 6 UI dossier files. "Validation deferred" ✅ VERIFIED in `OVERVIEW.md`. Backend-module attribution + error-pipeline non-wiring are `[INFERRED]`. The "no id" / "no too-many" deltas vs the multi-file uploader ✅ VERIFIED in the two `.types.ts` files.
