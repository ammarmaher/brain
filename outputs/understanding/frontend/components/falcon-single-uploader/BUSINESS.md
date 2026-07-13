# falcon-single-uploader — Business Layer

> Layer 2 of 3. UI layer → `OVERVIEW.md` / `API.md` / `USAGE.md` / `TOKENS.md`. Integration layer → `INTEGRATION_VALIDATION.md`.

## Business purpose
`[BRAIN-OUT]` The single-uploader is how an operator attaches **exactly one file** to a business entity, with the explicit expectation that they may want to **replace** it later — a single signed PDF, one ID copy, a logo image. In business terms it is the *single-slot, swappable attachment* surface: pick one file, preview it, and have a clear affordance to delete or edit (replace) it.

`[CODE]` `falcon-single-uploader.component.ts` — like the rest of the family, **it runs no upload and does no validation.** It paints the state the consumer drives via `file.status` / `progress` / `errorMessage` / `url`.

> `[CODE]` **Status caveat (B19):** this component has **no production consumer** (grep 2026-06-03). The live single/multi-file business flows use the `file-uploader-shared` family (`<falcon-angular-document-uploader>` / `image-uploader`) or `<falcon-photo-uploader>`. The flows below are the *intended* domain.

## The uploader family — single-uploader vs the file-uploader-shared family vs photo-uploader
`[CODE]` Upload surfaces in the library (B19 correction — the live multi-file pair is the `file-uploader-shared` family, NOT a single `<falcon-angular-uploader>`):

| Component | Business shape | Use when |
|---|---|---|
| **`<falcon-angular-single-uploader>`** (this) | **Single file, replaceable, square preview tile.** Empty dropzone → filled square tile with **delete** (top-end danger) + **edit/replace** (bottom-end secondary) overlays. | Exactly one file the user may want to swap, where a *square* preview is acceptable. |
| `<falcon-angular-document-uploader>` / `<falcon-angular-image-uploader>` | **Avatar-row uploader** (single OR multi via `[multiple]`). Horizontal row: circle/tile + waves + stack + banner + per-file list + retry. Shares `file-uploader-shared` behavior/tokens. | The live production upload UX (e.g. contact-groups CSV/Excel, template media). |
| `<falcon-photo-uploader>` (legacy) | **Single circular avatar.** Bespoke Angular, circular preview. | A profile/entity avatar — `[BRAIN-OUT]` used by the Add Client / Add User wizards' Step-1 avatar slot. |

`[INFERRED]` Resolution: single-uploader and photo-uploader both handle *one file* — the **shape of the preview** decides (square tile → single-uploader; circular avatar → photo-uploader). For the avatar-row look + multi-file + retry/banner, use the `file-uploader-shared` family.

## PRD / business rules touched
| Rule | Source | How this component enforces / surfaces it |
|---|---|---|
| File validation is the consumer's responsibility | `[CODE]` `OVERVIEW.md` "Validation deferred" + .tsx:113-134 (`acceptIncoming` does no size check) | The component enforces nothing beyond native `accept`; business rejection runs in app code, which sets `file.status='error'` + `errorMessage`. |
| A single attachment should be replaceable in place | `[CODE]` falcon-single-uploader.component.ts:74 `(fileEdit)` + .tsx:198-203 | The filled-state **edit** overlay swaps the file without first deleting it — encodes "replace, don't re-do." |
| One artifact per slot | `[CODE]` `acceptIncoming` overwrites `file` (.tsx:131) | Picking/dropping a new file REPLACES the current one — the slot structurally holds at most one. |
| Upload progress must be visible | `[CODE]` `status==='uploading'` → progress bar (.tsx:248,284-290) | The filled tile shows progress for the in-flight upload of its one file. |

## Business constraints baked in
- `[CODE]` **Default `size='md'`** (ts:62), **`previewMode='thumbnail'`** (ts:63) — a medium square tile showing an image thumbnail (or a generic doc icon for non-images).
- `[CODE]` **The value is ONE `FalconSingleUploaderFile` or `null`** (types.ts:14-22) — singular by type; no array. The component cannot hold a second file.
- `[CODE]` **Four file statuses** — `queued | uploading | success | error` (types.ts:3-7) — the lifecycle the consumer drives.
- `[CODE]` **Two action overlays** in filled state — delete (danger) + edit/replace (secondary). The two-affordance design encodes "a single attachment is always removable AND swappable."
- `[CODE]` **Drag/drop in filled state replaces the current file** — friction-free replacement.
- `[CODE]` **Empty value normalises to `null`** (writeValue, ts:103-105) — payload builders distinguish "no artifact" via `null`.

## Business flows using this component
| Flow | Page | Role of the component in the flow |
|---|---|---|
| Falcon UI showcase | host-shell `features/falcon-ui-showcase/` | `[CODE]` demonstration only (the live render path). |
| (intended) single-document slot | a form with one logo / ID copy / signed PDF | `[BRAIN-OUT]` the intended surface for single-file slots. `[INFERRED]` no production consumer observed — live avatar slots use the legacy circular photo-uploader; live doc uploads use the avatar-row family. |

> `[CODE]` **Correction vs prior dossier:** the old "Playground showcase → `playground.page.html`" flow is stale (playground route removed). The live demo is `features/falcon-ui-showcase/`.

## Business gotchas
- `[CODE]` The single-uploader **never uploads** — feeding it a file does not start an HTTP request. The app runs the upload and feeds status back. "Success" on the tile means the consumer set `status='success'`, not that a server confirmed.
- `[BRAIN-OUT]` Do NOT use it for an avatar — the preview is a **square** tile (circular need = photo-uploader).
- `[INFERRED]` The **edit** overlay does not itself replace the file — it emits `(fileEdit)` and reopens the picker; the consumer handles the swap.
- The delete button permanently clears the slot + revokes the blob preview — no undo; the consumer must re-fetch the prior artifact for "cancel" semantics.

## Verification
🟡 CODE-DERIVED 2026-06-03 (B19) from falcon-single-uploader.component.ts + .types.ts + the live `.tsx`. The family split corrected to name the `file-uploader-shared` pair as the live multi-file path. No production consumer is `[INFERRED]` from the grep (showcase-only). The playground-flow reference corrected to the live showcase.
