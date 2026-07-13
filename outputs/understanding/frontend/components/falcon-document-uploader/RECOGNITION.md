# falcon-document-uploader — Recognition Layer

> Given an external design / screenshot / React or Angular snippet, identify `<falcon-angular-document-uploader>` as the component to use, and how to compose it to parity.

## Visual fingerprint

A **horizontal avatar-row** uploader (NOT a square tile, NOT a circle alone): a left rounded circle/tile showing a **spreadsheet/document glyph**, a center label + progress text, and a right "**Drag a file here or** [Upload File]" affordance. While uploading, a **water/bar/laser progress layer** fills (water = bottom-up fill with waves). A **banner** appears below the row on success/error ("Uploaded · {name}" / a network-error message). In `[multiple]` mode, a **stack of overlapping circles** + a **count badge** + an expandable **per-file list** (each row: doc glyph + name/size + progress + remove/retry). If you see a contacts-CSV / document upload row with a doc icon, drag hint, progress, and a banner — this is it. (Its image twin shows photo thumbnails instead of a doc glyph.)

## Cross-library equivalents

| Library | Their component | Parity notes |
|---|---|---|
| MUI | `<Button component="label">` + `<LinearProgress>` + a file `<Chip>`/`<List>` | MUI has no avatar-row uploader; hand-composed. |
| PrimeNG | `<p-fileUpload>` (advanced, with progress + list) | closest — but PrimeNG's layout differs (panel + table). Falcon's is the avatar-row design. |
| Ant Design | `<Upload>` (default list) / `<Upload.Dragger>` | Dragger ≈ the drag-hint; Ant's list is below; Falcon bakes a richer row + banner + stack. |
| Bootstrap | `<input type="file">` + a custom progress + list | no primitive — upgrade target. |
| shadcn / Radix | `react-dropzone` + custom row/list | hand-composed. |
| plain HTML | `<input type="file" accept=".csv,.xlsx">` | always replace with this. |
| React (Falcon SoT) | `Uploader` with `variant='document'` (uploader.jsx) | THIS is the verbatim port target (tsx:6). |

## Use THIS vs siblings

| If the design shows… | Use | Not |
|---|---|---|
| an avatar-row uploader for **documents/spreadsheets** (doc glyph, drag hint, progress, banner) | `<falcon-angular-document-uploader>` | image-uploader |
| the same avatar-row for **images** (photo thumbnail previews) | `<falcon-angular-image-uploader>` | document-uploader |
| a compact **square single-file** preview tile (delete + edit overlays) | `<falcon-angular-single-uploader>` | document-uploader |
| a **circular avatar** / profile photo | `<falcon-photo-uploader>` (legacy) | document-uploader |
| an empty-data placeholder | `<falcon-angular-empty-state>` | document-uploader |

## Composition recipe to reach parity

Customization order (`feedback_falcon_custom_library_mandatory`):

1. **Inputs (behavior)** — `[(ngModel)]`/`formControlName` (a `FalconFileUploaderFile[]`), `[accept]` (bare-ext list), `[maxSizeMB]`, `[multiple]`, `[dragDrop]`/`[clickToBrowse]`, `[required]`, `[disabled]`, `[useTailwind]="true"`.
2. **Inputs (visual)** — `[shape]` (`rounded` default), `[size]`, `[borderStyle]`, `[progressMode]` (`water`/`bar`/`laser`), `[showWaves]`/`[showPins]`/`[showBanner]`/`[showDragHint]`; multi controls (`[maxStackVisible]`, `[filterMode]`, badges, `[autoCycle]`).
3. **Inputs (copy)** — `[label]`, `[helperText]`, `[buttonText]`, `[dragHintText]`, and the i18n `*Template`/`*Text` strings (keep `{exts}`/`{max}`/`{n}` placeholders). Prefer the DI defaults for the visual/behavior set.
4. **Wire the upload** — the component does NOT upload. Handle `(fileAdd)`, use `$event.nativeFile` (raw `File`) to run the real upload (e.g. the contact-groups S3 handshake), then push `{status, progress, errorCode}` back via the bound value or `setFiles()`. Mandatory composition.
5. **Outputs** — `(valueChange)`, `(fileAdd)`, `(fileRemove)`, `(fileRetry)`, `(fileError)`.
6. **No slots / no ng-template** — copy is prop-driven; there is no custom-content slot. A bespoke row is a GAP — raise, don't hand-roll.
7. **Tokens** — restyle via the shared `file-uploader.tokens.css` (scope overrides to the document tags to avoid retinting image-uploader).
8. **Render path** — `useTailwind=true` (default). **Do NOT** use `false` (Shadow tag unregistered → blank, G1).
9. **App-wide defaults** — `provideFalconUploader({ defaults: { document: {...} } })` to retune platform-wide.

## Anti-patterns

- Using it for images expecting thumbnails — wrong variant; use `<falcon-angular-image-uploader>`.
- Using it for a square single-file tile — use `<falcon-angular-single-uploader>`.
- Setting `useTailwind=false` — the Shadow tag is unregistered → blank (G1).
- Expecting the component to upload — it only validates ext+size + emits the raw `File`.
- Reconstructing the `File` instead of forwarding `(fileAdd).nativeFile` — the S3 PUT signs against the original Content-Type.
- Overriding `--falcon-file-uploader-*` on a broad class — retints the image-uploader too (scope it).
- Looking for `FalconSingleUploaderFile` — this family uses `FalconFileUploaderFile` (with `id`).
- Native `<input type="file">` / PrimeNG `<p-fileUpload>` in app code — banned.
- `*ngIf`/`*ngFor` — use `@if`/`@for`.

## Verification
🟡 CODE-DERIVED from falcon-document-uploader.tsx + -tw.tsx + the wrapper + the contact-groups consumer + file-uploader-shared. Sibling routing cross-checked against `OVERVIEW.md`. Cross-library map is `[INFERRED]`; the PrimeNG `<p-fileUpload>` advanced is the closest `[INFERRED]` analogue. React SoT mapping per `[CODE]` tsx:6.
