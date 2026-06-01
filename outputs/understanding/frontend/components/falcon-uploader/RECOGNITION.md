# falcon-angular-uploader — Recognition Layer

> Given an external design / screenshot / React or Angular snippet, identify `<falcon-angular-uploader>` as the component to use, and how to compose it to parity.

## Visual fingerprint
`[CODE]` `falcon-uploader.tsx` — a file-capture surface with three distinct shapes selected by `mode`:
- **`dropzone`** (default) — a large bordered (usually dashed) drop area with a centered icon + placeholder text ("Drop files here or click to browse") + optional hint line. Clicking it opens the OS picker; dragging a file over it highlights the zone.
- **`button`** — a compact "Upload" trigger button, no large drop area.
- **`inline-list`** — list only, no drop target — for showing pre-populated rows.
- **The file list** (all modes) — one row per file: a file-type icon or **thumbnail preview**, the file name + formatted size, a **status badge** (queued / uploading / success / error), a **progress bar** for in-flight uploads, an inline **error message**, and a **remove (×)** button.

Distinguishing signature: *a drop area OR upload button, paired with a stacked multi-row file list where each row shows its own progress + status badge.*

## Cross-library equivalents
| Library | Their component | Parity notes |
|---|---|---|
| MUI | no first-party uploader — community `MuiFileInput` / `<Button component="label">` + a custom list | MUI has no native multi-file dropzone; the uploader is richer. |
| PrimeNG | `<p-fileUpload>` (advanced mode) | direct functional twin — multi-file, drag-drop, per-row progress. The Falcon uploader is the replacement. |
| Ant Design | `<Upload>` / `<Upload.Dragger>` | `Upload.Dragger` ≈ `mode="dropzone"`; `<Upload>` button ≈ `mode="button"`. Ant's `fileList` ≈ `FalconUploaderFile[]`. |
| Bootstrap | native `<input type="file" multiple>` + custom list | Bootstrap has no dropzone — upgrade target. |
| shadcn / Radix | no primitive — community `react-dropzone` + a custom list | `react-dropzone`'s `getRootProps()` dropzone ≈ `mode="dropzone"`. |
| plain HTML | `<input type="file" multiple>` | always replace with this. |

## Use THIS vs siblings
| If the design shows… | Use | Not |
|---|---|---|
| **multiple** files, a drop area + a multi-row list with per-row progress | `<falcon-angular-uploader>` | single-uploader |
| exactly **one** file, a square preview tile with delete + edit (replace) overlays | `<falcon-angular-single-uploader>` | uploader |
| exactly one **circular avatar** / profile photo with replace UX | `<falcon-photo-uploader>` (legacy) | uploader |
| a bulk CSV / Excel import (one file, no preview) | a simple file picker / `mode="button"` uploader | dropzone with thumbnails |
| an empty "no files yet" placeholder inside the list | `<falcon-angular-empty-state>` | uploader |

## Composition recipe to reach parity
Customization order (per `feedback_falcon_custom_library_mandatory`):
1. **Inputs (behavior)** — `[mode]` (`dropzone`/`button`/`inline-list`), `[(ngModel)]`/`formControlName` (CVA binds the `FalconUploaderFile[]`), `[multiple]`, `[accept]`, `[maxSize]`, `[maxFiles]`, `[required]`, `[disabled]`, `[readonly]`, `[showProgress]`, `[showPreview]`, `[label]`, `[placeholder]`, `[placeholderHint]`, `[helperText]`, `[errorMessage]`, `[buttonLabel]`, `[ariaLabel]`.
2. **Wire the upload** — the component does NOT upload. Handle `(fileAdd)`, run the actual `POST`, and feed `file.status`/`progress`/`url`/`errorMessage` back through the bound value. This is mandatory composition, not optional.
3. **Outputs** — `(valueChange)`, `(fileAdd)`, `(fileRemove)`, `(fileError)`.
4. **No slots / no ng-template** — rows render from the `FalconUploaderFile[]` shape; there is no custom-row template. A bespoke row layout is a GAP — raise, do not hand-roll.
5. **Tokens** — restyle via `uploader.tokens.css` (14 categories). The progress-bar width is the one inline style (data-driven escape hatch) — do not token it.
6. **Render path** — `useTailwind=true` (default, Light DOM) vs `false` (Shadow). Keep the default.
7. **Upgrade** — if the design needs a custom row template or built-in validation, those are GAPs; raise them rather than wrapping a one-off.

## Anti-patterns
- Expecting the component to upload files — it only paints state; the consumer runs the HTTP.
- Using it for a single file — wrong component; use single-uploader (square) or photo-uploader (circle).
- Relying on `accept`/`maxSize`/`maxFiles` as security — they are advisory; re-validate in app code.
- Mutating a `FalconUploaderFile` row in place — `value` is `ReadonlyArray`; rebuild the array (OnPush + signal equality).
- Reusing `FalconUploaderFile.id` across files — breaks row-identity tracking.
- Native `<input type="file">` or PrimeNG `<p-fileUpload>` in app code — banned (`feedback_falcon_ui_library_only_no_native`).

## Verification
🟡 CODE-DERIVED from `falcon-uploader.tsx` (header) + `falcon-uploader.component.ts` + `falcon-uploader.types.ts` + the 6 UI dossier files. Cross-library map is `[INFERRED]` mapping. PrimeNG `<p-fileUpload>` lineage is `[INFERRED]` from functional parity.
