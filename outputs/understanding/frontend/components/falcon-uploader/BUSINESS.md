# falcon-angular-uploader — Business Layer

> Layer 2 of 3. UI layer → `OVERVIEW.md` / `API.md` / `USAGE.md` / `TOKENS.md`. Integration layer → `INTEGRATION_VALIDATION.md`.

## Business purpose
`[BRAIN-OUT]` The uploader is how an operator attaches **multiple files** to a business entity — contracts, ID copies, supporting documents, logos. In business terms it is the *multi-attachment capture surface*: the user selects/drops one or many files, the app uploads them, and each file's lifecycle (queued → uploading → success/error) is shown back per row.

`[CODE]` `falcon-uploader.tsx:9-11` — a deliberate design statement: **the component does NO validation and runs NO upload.** It only *paints* the visual state the consumer drives via `file.status` / `file.progress` / `file.errorMessage`. The business logic — what is allowed, when to retry, what counts as "too large" — lives entirely in the app.

## The uploader family — uploader vs single-uploader vs photo-uploader
`[BRAIN-OUT]` + `[CODE]` Three sibling upload surfaces, each with a distinct business shape:

| Component | Business shape | Use when |
|---|---|---|
| **`<falcon-angular-uploader>`** (this) | **Multi-file.** Dropzone / button / inline-list mode + a per-row file list with status badges, progress, thumbnails. | A business object needs *several* attachments (a document set, a multi-file composer). |
| **`<falcon-angular-single-uploader>`** | **Single-file, replaceable.** Empty dropzone → filled square preview tile with delete + **edit (replace)** overlays. | Exactly one file that the user may want to *swap* (a single signed PDF, one ID image). |
| **`<falcon-photo-uploader>`** (legacy) | **Single circular avatar.** Bespoke Angular component, circular preview, drag-hint + upload button. | A profile / entity *avatar* — `[BRAIN-OUT]` currently the ONLY circular option; used by the verified Add Client / Add User wizards on Step 1. |

`[INFERRED]` Resolution for a builder: count + shape decide the component. *Many files* → uploader. *One swappable file, square preview* → single-uploader. *One circular avatar* → photo-uploader (legacy, until a Falcon-UI-core avatar variant lands). The uploader and single-uploader are the modern Falcon-UI-core path; photo-uploader is legacy-in-use.

## PRD / business rules touched
| Rule | Source | How this component enforces / surfaces it |
|---|---|---|
| File validation is the consumer's responsibility | `[CODE]` `falcon-uploader.tsx:9-11` + `OVERVIEW.md` | The component does not enforce mime/size/count beyond the native `<input>` `accept`/`maxFiles`. Business rejection rules must run in app code and set `file.status='error'` + `errorMessage`. |
| Upload progress must be visible per file | `[CODE]` `falcon-uploader.tsx` progress-width escape hatch | Each row shows a progress bar whose width is driven by `file.progress` — the business state of each upload is individually legible. |
| Document attachment on org-hierarchy flows | `[BRAIN-OUT]` `OVERVIEW.md` use cases | Logos / contracts / ID copies on Add Client / Add User wizards (though those flows currently use the legacy photo-uploader for the avatar slot). |

## Business constraints baked in
- `[CODE]` `falcon-uploader.component.ts:52` **Default `mode='dropzone'`** — the business-default capture affordance is the large drop area.
- `[CODE]` `falcon-uploader.component.ts:58` **`multiple=true` by default** — this component is *multi-file by intent*; a single-file need is the single-uploader's job.
- `[CODE]` `falcon-uploader.tsx:9-11` **No built-in validation** — a deliberate business constraint: the component never silently rejects a file; it shows whatever the consumer's `FalconUploaderFile[]` says.
- `[CODE]` `falcon-uploader.types.ts:5-9` **Four file statuses** — `queued | uploading | success | error`. These are the business lifecycle states the consumer must drive.
- `[CODE]` `falcon-uploader.types.ts:11-16` **Four error codes** — `too-large | wrong-type | too-many | custom` — the vocabulary for rejection reasons surfaced via the `fileError` output.

## Business flows using this component
| Flow | Page | Role of the component in the flow |
|---|---|---|
| Playground showcase | host-shell `playground.page.html` | `[CODE]` `OVERVIEW.md` — demonstration only. |
| (intended) multi-document attachment | Add Client / Add User wizards, Settings panels | `[BRAIN-OUT]` the intended surface for multi-file document capture. `[INFERRED]` no production wizard consumer observed yet — wizards use the legacy photo-uploader for their (single, circular) avatar slot. |

## Business gotchas
- `[CODE]` The uploader **never uploads anything itself** — passing files to it does not start an HTTP upload. The app must run the upload and feed status back. A "files not uploading" expectation is a misread of the contract.
- `[CODE]` `accept` / `maxSize` / `maxFiles` on the native input are *advisory* — the OS file picker honors `accept`, but a determined user can still drop a disallowed file. Business rejection must be re-checked in app code.
- `[INFERRED]` `inline-list` mode shows the file list with **no dropzone** — for displaying pre-existing attachments read-only-ish; do not expect a drop target in that mode.
- The component paints `success`/`error` per row — but "success" means *the consumer said so*, not that a server confirmed. The business truth is whatever the app sets.

## Verification
🟡 CODE-DERIVED from `falcon-uploader.tsx` (header + types) + `falcon-uploader.component.ts` + `falcon-uploader.types.ts` + the 6 UI dossier files. The three-sibling split is `[BRAIN-OUT]` + `[CODE]`-anchored. No production-flow consumer is `[INFERRED]` from `OVERVIEW.md` "_None observed_".
