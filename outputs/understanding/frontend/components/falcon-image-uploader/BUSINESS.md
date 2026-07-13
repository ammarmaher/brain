# falcon-image-uploader — Business Layer

> Layer 2 of 3. UI layer → `OVERVIEW.md` / `API.md` / `USAGE.md` / `TOKENS.md`. Integration layer → `INTEGRATION_VALIDATION.md`.

## Business purpose
`[CODE]` The control by which the operator **attaches a face to a record**: the client's logo / picture when a client is created, the account owner's photo, the avatar of a user being added, or the header media on a message template. In business terms it is the optional-but-prominent identity image captured at the top of a "create" or "edit" flow. The picked file is read once and handed to the host as raw bytes (`fileAdd.nativeFile`) so the app can persist a base64 profile-picture payload.

## PRD / business rules touched
| Rule | Source | How this component enforces / surfaces it |
|---|---|---|
| Client picture is optional but capped at 1 MB | `[CODE]` client-information-step.component.html:8 (`[maxSizeMB]="1"`) + inline comment "maxSizeMB=1 preserves BR-UM-48" | Add Client Step "Client Information" renders the uploader with `maxSizeMB=1`; a larger file is rejected client-side and painted RED. |
| Allowed image types = png / jpg / jpeg | `[CODE]` client-information-step.component.html:6 (`accept="png,jpg,jpeg"`) | The native picker + drag-drop only accept those extensions; a wrong type emits `fileError(code:'wrong-type')`. |
| User avatar capture on Add User | `[CODE]` user-personal-step.component.html | Add User Step "Personal" renders the uploader for the user's photo. |
| Profile picture flows to the Commerce record verbatim | `[CODE]` client-information-step.component.html:2-12 (comment: `photoData → wire-builders.ts → info.profilePictureInfo`) | The `{extension, fileBase64String}` object the consumer builds from `fileAdd.nativeFile` rides into the Commerce client-create / Information-update payload unchanged. |

## Business constraints baked in
- `[CODE]` **Client-side validation is ext + size ONLY** — `accept` + `maxSizeMB`. Anything richer (dimensions, aspect ratio, server-side scan) is the consumer's / backend's job. The component emits `fileError` and renders the rejected descriptor RED, but it never blocks the wizard by itself.
- `[CODE]` **No mock upload / no auto-upload** — the component does not POST anything; it surfaces the raw `File` and waits for the consumer to drive `status`/`progress`/`url`. A builder must NOT assume "the file is uploaded" once it appears in the row (`[CODE]` file-uploader.types.ts:6).
- `[CODE]` **Suppressed decoration must be replaced** — Add Client turns `showBanner`/`showStatusBadge`/`showSuccessRing` OFF to match the legacy card; consequently the built-in size message never shows and the consumer supplies its own `role="alert"` "too large" line (html:32-41). Removing that companion line would silently lose the business error copy.
- `[INFERRED]` **Empty value normalises to `[]`, never `null`** — CVA `writeValue(null)` → `this.files.set([])` (ts:172). Payload builders that distinguish "no picture chosen" from "picture cleared" must rely on the `fileRemove` event, not a `null` value.

## Business flows using this component
| Flow | Page | Role of the component in the flow |
|---|---|---|
| Add Client wizard | org-hierarchy (Client Information step) | Client picture / logo capture (1 MB cap). |
| Add Client wizard | org-hierarchy (Account Owner step) | Account-owner photo capture. |
| Add User wizard | org-hierarchy (Personal step) | User avatar capture. |
| Information panel edit | org-hierarchy (hierarchy tab → info panel) | Node/account logo edit, both consoles. |
| Templates wizard | templates-page (Step 2 Message Structure) | Header/media image for a message template, both consoles. |

## Business gotchas
- The picked image becomes a **base64 string** in the wire payload (`info.profilePictureInfo`) — a large file inflates the request; the 1 MB cap (BR-UM-48 per consumer comment) is a real billing/perf guardrail, not just UX.
- A row that shows an image is NOT proof of a successful upload — status is consumer-driven; treat `status==='success'` (set by the host after its POST resolves) as the truth, not the mere presence of a preview.
- This component **replaced the legacy `<falcon-photo-uploader>` in Wave 2 (2026-05-31)**; any business doc / screenshot still referencing the old circular-only avatar is stale (`[MEMORY]` the legacy component is deleted from disk).
- The image uploader and the **document** uploader share one render/token contract — a business request to "also accept PDFs here" is the wrong component; route documents to `<falcon-angular-document-uploader>`.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B20) — `maxSizeMB=1`/`accept`/decoration-off + the `photoData → info.profilePictureInfo` comment re-read from client-information-step.component.html; `writeValue(null)→[]` (ts:172) and "no mock upload" (types.ts:6) confirmed in source. BR-UM-48 label + `wire-builders.ts` path are 🟡 CODE-DERIVED from the consumer's inline comment, not re-read from a PRD/backend source this pass.
