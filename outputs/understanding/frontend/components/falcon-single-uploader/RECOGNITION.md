# falcon-angular-single-uploader — Recognition Layer

> Given an external design / screenshot / React or Angular snippet, identify `<falcon-angular-single-uploader>` as the component to use, and how to compose it to parity.

## Visual fingerprint
`[CODE]` `falcon-single-uploader.component.ts` + `OVERVIEW.md` — a **single square slot** with two display states:
- **Empty** — a square dropzone tile with a centered placeholder ("Click to browse or drop here") + optional hint. Clicking opens the OS picker; dragging a file over it highlights the tile.
- **Filled** — a square **preview tile**: an image thumbnail for image files, or a generic document icon for non-images. Two action overlays float over the tile:
  - **top-right delete** — danger-styled × / trash.
  - **bottom-right edit** — secondary-styled pencil / replace.
- **Size** — `sm` / `md` (default) / `lg` — the tile scales.

Distinguishing signature: *one square tile (not a wide dropzone, not a circle), with delete top-right + edit bottom-right overlays once filled.*

## Cross-library equivalents
| Library | Their component | Parity notes |
|---|---|---|
| MUI | `<Avatar>` + a hidden `<input>` + custom overlay buttons, or community `MuiFileInput` (single) | MUI has no single-tile uploader primitive — the closest is a hand-composed avatar+input. |
| PrimeNG | `<p-fileUpload mode="basic">` (single, no list) | `mode="basic"` ≈ the empty state; PrimeNG has no built-in square preview tile with overlays. |
| Ant Design | `<Upload listType="picture-card" maxCount={1}>` | **closest twin** — `picture-card` + `maxCount:1` renders exactly a square tile with hover delete/preview overlays. |
| Bootstrap | native `<input type="file">` + a custom preview div | no primitive — upgrade target. |
| shadcn / Radix | `react-dropzone` single-file + a custom preview card | hand-composed; no primitive. |
| plain HTML | `<input type="file" accept="image/*">` + an `<img>` preview | always replace with this. |

## Use THIS vs siblings
| If the design shows… | Use | Not |
|---|---|---|
| exactly **one** file, a **square** preview tile with delete + edit (replace) overlays | `<falcon-angular-single-uploader>` | uploader |
| **multiple** files, a drop area + a multi-row list with per-row progress | `<falcon-angular-uploader>` | single-uploader |
| exactly one **circular** avatar / profile photo | `<falcon-photo-uploader>` (legacy) | single-uploader (its preview is square) |
| a bulk CSV / Excel import | a simple file picker / `mode="button"` `<falcon-angular-uploader>` | single-uploader |
| an empty-data placeholder | `<falcon-angular-empty-state>` | single-uploader |

## Composition recipe to reach parity
Customization order (per `feedback_falcon_custom_library_mandatory`):
1. **Inputs (behavior)** — `[(ngModel)]`/`formControlName` (CVA binds the single `FalconSingleUploaderFile | null`), `[size]` (`sm`/`md`/`lg`), `[previewMode]` (`thumbnail`/`icon-only`/`compact`), `[accept]`, `[maxSize]`, `[required]`, `[disabled]`, `[label]`, `[placeholder]`, `[placeholderHint]`, `[helperText]`, `[errorMessage]`, `[ariaLabel]`.
2. **Wire the upload** — the component does NOT upload. Handle `(fileUpload)`, run the actual `POST`, feed `file.status`/`progress`/`url`/`errorMessage` back through the bound value. Mandatory composition.
3. **Handle the edit overlay** — `(fileEdit)` only emits; the consumer opens a picker / drives the swap. (Drag-drop over a filled tile replaces automatically.)
4. **Outputs** — `(valueChange)`, `(fileUpload)`, `(fileDelete)`, `(fileEdit)`, `(fileError)`.
5. **No slots / no ng-template** — the tile renders from the `FalconSingleUploaderFile` shape; no custom-content template. A bespoke tile is a GAP — raise, do not hand-roll.
6. **Tokens** — restyle via `single-uploader.tokens.css`.
7. **Render path** — `useTailwind=true` (default, Light DOM) vs `false` (Shadow). Keep the default.
8. **Upgrade** — for a circular preview, that is a *different component* (photo-uploader) / a GAP (a Falcon-UI-core avatar variant) — switch components rather than restyle the square tile into a circle.

## Anti-patterns
- Using it for an avatar/profile photo — its preview is square; the circular need is photo-uploader's job.
- Using it for multiple files — wrong component; use `<falcon-angular-uploader>`.
- Expecting `(fileEdit)` to swap the file by itself — it only emits; the consumer drives the replace.
- Expecting the component to upload — it only paints state.
- Looking for an `id` on `FalconSingleUploaderFile` — there is none (unlike the multi-file `FalconUploaderFile`).
- Relying on `accept`/`maxSize` as enforcement — advisory; re-validate in app code.
- Native `<input type="file">` or PrimeNG `<p-fileUpload>` in app code — banned (`feedback_falcon_ui_library_only_no_native`).

## Verification
🟡 CODE-DERIVED from `falcon-single-uploader.component.ts` + `falcon-single-uploader.types.ts` + the 6 UI dossier files. Cross-library map is `[INFERRED]` mapping. The Ant `picture-card` parity is the closest `[INFERRED]` analogue.
