# falcon-angular-single-uploader — Business Layer

> Layer 2 of 3. UI layer → `OVERVIEW.md` / `API.md` / `USAGE.md` / `TOKENS.md`. Integration layer → `INTEGRATION_VALIDATION.md`.

## Business purpose
`[BRAIN-OUT]` The single-uploader is how an operator attaches **exactly one file** to a business entity, with the explicit expectation that they may want to **replace** it later — a single signed PDF, one ID copy, a logo image. In business terms it is the *single-slot, swappable attachment* surface: pick one file, preview it, and have a clear affordance to delete or edit (replace) it.

`[CODE]` `OVERVIEW.md` + `falcon-single-uploader.component.ts` — like its multi-file sibling, **it runs no upload and does no validation.** It paints the state the consumer drives via `file.status` / `progress` / `errorMessage`.

## The uploader family — single-uploader vs uploader vs photo-uploader
`[BRAIN-OUT]` + `[CODE]` Three sibling upload surfaces (full table in `falcon-uploader/BUSINESS.md`):

| Component | Business shape | Use when |
|---|---|---|
| **`<falcon-angular-single-uploader>`** (this) | **Single file, replaceable, square preview tile.** Empty dropzone → filled square tile with **delete** (top-right danger) + **edit/replace** (bottom-right secondary) overlays. | Exactly one file the user may want to swap, where a *square* preview is acceptable. |
| `<falcon-angular-uploader>` | **Multi-file.** Dropzone/button + a per-row file list. | A business object needs *several* attachments. |
| `<falcon-photo-uploader>` (legacy) | **Single circular avatar.** Bespoke Angular, circular preview. | A profile/entity avatar — `[BRAIN-OUT]` the ONLY circular option; used by the verified Add Client / Add User wizards Step 1. |

`[INFERRED]` Resolution: the single-uploader and photo-uploader both handle *one file* — the **shape of the preview** decides between them. Square tile → single-uploader. Circular avatar → photo-uploader. The single-uploader is the modern Falcon-UI-core path; photo-uploader is legacy-in-use. `[BRAIN-OUT]` `OVERVIEW.md` is explicit: do NOT use single-uploader for avatar/profile-photo — its preview is square, not circular.

## PRD / business rules touched
| Rule | Source | How this component enforces / surfaces it |
|---|---|---|
| File validation is the consumer's responsibility | `[CODE]` `OVERVIEW.md` "Validation deferred" | The component enforces nothing beyond the native `accept`; business rejection runs in app code which sets `file.status='error'` + `errorMessage`. |
| A single attachment should be replaceable in place | `[CODE]` `falcon-single-uploader.component.ts:73-74` `fileEdit` output | The filled-state **edit** overlay lets the user swap the file without first deleting it — encodes "replace, don't re-do." |
| Upload progress must be visible | `[CODE]` `falcon-single-uploader.types.ts:18` `progress` | The filled tile shows progress for the in-flight upload of its one file. |

## Business constraints baked in
- `[CODE]` `falcon-single-uploader.component.ts:62` **Default `size='md'`**, `[CODE]` `:63` **default `previewMode='thumbnail'`** — the business-default is a medium square tile showing an image thumbnail (or a generic doc icon for non-images).
- `[CODE]` `falcon-single-uploader.types.ts:14-22` **The value is ONE `FalconSingleUploaderFile` or `null`** — singular by type. There is no array; the component structurally cannot hold a second file.
- `[CODE]` `falcon-single-uploader.types.ts:3-7` **Four file statuses** — `queued | uploading | success | error` — the business lifecycle the consumer drives.
- `[CODE]` Two action overlays in filled state — **delete** (danger) and **edit/replace** (secondary). The two-affordance design is the business statement: a single attachment is always removable *and* swappable.
- `[CODE]` `OVERVIEW.md` **Drag/drop in filled state replaces the current file** — dropping a new file over a filled tile swaps it; the business intent is friction-free replacement.

## Business flows using this component
| Flow | Page | Role of the component in the flow |
|---|---|---|
| Playground showcase | host-shell `playground.page.html` | `[CODE]` `OVERVIEW.md` — demonstration only. |
| (intended) single-document slot | forms with one logo / ID copy / signed PDF | `[BRAIN-OUT]` the intended surface for single-file slots. `[INFERRED]` no production wizard consumer observed — the verified wizards use the legacy circular photo-uploader for their avatar slot. |

## Business gotchas
- `[CODE]` The single-uploader **never uploads** — feeding it a file does not start an HTTP request. The app runs the upload and feeds status back.
- `[BRAIN-OUT]` `OVERVIEW.md` Do NOT use it for an avatar — the preview is a **square** tile. The circular-avatar business need is photo-uploader's (legacy) job.
- `[INFERRED]` The **edit** overlay does not itself replace the file — it emits `fileEdit`; the consumer must open a picker / handle the swap. The overlay is an affordance, not an action.
- "Success" on the tile means *the consumer set `status='success'`* — not that a server confirmed. Business truth is whatever the app sets.

## Verification
🟡 CODE-DERIVED from `falcon-single-uploader.component.ts` + `falcon-single-uploader.types.ts` + the 6 UI dossier files. The three-sibling split is `[BRAIN-OUT]` + `[CODE]`-anchored. No production-flow consumer is `[INFERRED]` from `OVERVIEW.md` "_No production consumer_".
