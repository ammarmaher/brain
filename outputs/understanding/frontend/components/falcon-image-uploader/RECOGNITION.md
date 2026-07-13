# falcon-image-uploader — Recognition Layer

> Given an external design / screenshot / React or Angular snippet, identify `<falcon-angular-image-uploader>` as the component to use, and how to compose it to parity.

## Visual fingerprint
A **horizontal card-row**: on the left a circular (or square/rounded/pill) image well (~56px) showing the picked image or a placeholder icon, optionally with tiny edit/delete corner **pins**; on the right a bold **label** + grey **sub-label** + a **"Drag a file here or"** hint + an **"Upload Photo"** button. While uploading, a **water fill** (or bottom **bar** / glowing **laser** edge) animates over the well and a status **banner** appears below; on success a green ring/✓ badge, on error a red fill + a T2-EXT/SIZE/NET chip. In multi-file mode the wells overlap into a small **stack** with a count badge. Dashed border by default that turns brand-teal on hover/drag. This is the avatar-row look from the React SoT uploader (`variant=image`).

## Cross-library equivalents
| Library | Their component | Parity notes |
|---|---|---|
| MUI | `<Avatar>` + a hidden `<input type="file">` + custom edit overlay | MUI has no batteries-included avatar uploader; Falcon bakes pins + progress + validation in |
| PrimeNG | `<p-fileUpload mode="basic">` / `<p-image>` combo | PrimeNG's FileUpload is generic; Falcon's image variant is avatar-shaped with the water progress |
| Ant Design | `<Upload listType="picture-circle">` | closest analog — circular picture upload with preview; Falcon adds the row label/hint layout + token theming |
| Bootstrap | `<input type="file" class="form-control">` + `.rounded-circle` `<img>` | upgrade target — replace wholesale |
| shadcn / Radix | custom dropzone + `<Avatar>` | shadcn composes primitives; Falcon is one component |
| plain HTML | `<input type="file" accept="image/*">` + an `<img>` preview | always replace with this |

## Use THIS vs siblings
| If the design shows… | Use | Not |
|---|---|---|
| a circular/shaped avatar well with an Upload-Photo button + progress | `<falcon-angular-image-uploader>` | — |
| a generic file row that accepts PDFs / docs / multi-format | `<falcon-angular-document-uploader>` | image-uploader |
| a square single-file tile with edit/replace/delete overlays | `<falcon-angular-single-uploader>` | image-uploader |
| a circular avatar that only DISPLAYS (no upload) | `<falcon-angular-avatar>` | image-uploader |
| a multi-image gallery grid | _no Falcon component yet — compose multiple image-uploaders or raise a GAP_ | — |

## Composition recipe to reach parity
Customization order (`[MEMORY]` feedback_falcon_custom_library_mandatory): inputs → templates → slots → variants → token override → upgrade → wrapper.
1. **Inputs** — `[label]`, `[helperText]`, `accept`, `[maxSizeMB]`, `[multiple]`, `shape`, `[progressMode]`, the decoration flags (`showBanner`/`showStatusBadge`/`showSuccessRing`/`showWaves`/`showPins`/`showDragHint`), the i18n template strings, `[(ngModel)]`/`formControlName`, `(fileAdd)`/`(fileRemove)`/`(fileError)`.
2. **Templates** — none (no `ng-template` inputs). All copy is prop-driven.
3. **Slots** — none. (If a design needs custom content inside the row, that is a GAP — do not hand-roll.)
4. **Variants** — `shape` (`circle`/`rounded`/`square`/`pill`) + `progressMode` (`water`/`bar`/`laser`) + `size` (`sm`/`md`/`lg`). Pick these before reaching for tokens.
5. **Token override** — per-instance host class + `rootClass` mutating `--falcon-file-uploader-*` (row radius, active border, circle size). Never hardcode hex/px.
6. **Upgrade** — need dimension/aspect validation or a `maxFiles` cap? That is GAP G4 — raise it, validate in `(fileAdd)` meanwhile.
7. **Wrapper** — only build a thin local wrapper if many pages repeat the SAME read-File-to-base64 handler; otherwise reuse directly.

## Anti-patterns
- Reading the raw File from the CVA value — the value is the descriptor array; the File is `fileAdd.nativeFile`.
- Binding a `[files]` input on the wrapper — it does not exist; use `[(ngModel)]`/`formControlName`.
- Passing MIME types to `accept` — it expects bare extensions (`png,jpg,jpeg`).
- Turning `showBanner` off without supplying your own error line — RED row with no message.
- Assuming the file is uploaded once it appears — status is consumer-driven (no mock upload).
- Using it for PDFs/documents — wrong component (use `<falcon-angular-document-uploader>`).
- Native `<input type="file">` + a hand-rolled avatar preview in app code — banned (`[MEMORY]` feedback_falcon_ui_library_only_no_native).
- Writing SCSS in the consumer to restyle the row — use the token-override host-class pattern.

## Verification
🟡 CODE-DERIVED from `falcon-image-uploader.tsx` + `falcon-image-uploader-tw.tsx` + the Add Client consumer. Sibling routing table cross-checked against `OVERVIEW.md` "When NOT to use it" + the shared `file-uploader.types.ts` variant union. Cross-library mapping 🟡 CODE-DERIVED + `[INFERRED]` standard-library knowledge.
