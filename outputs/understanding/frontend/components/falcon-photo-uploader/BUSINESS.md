# falcon-photo-uploader — Business Layer

> Layer 2 of 3. UI layer → `OVERVIEW.md` / `API.md` / `USAGE.md` / `TOKENS.md`. Integration layer → `INTEGRATION_VALIDATION.md`.
> Source-prefix every fact: `[CODE]` `[BRAIN-OUT]` `[VAULT]` `[BRAIN-SK]` `[PRD]` `[INFERRED]`.

## Business purpose
`[BRAIN-OUT]` It is how the operator gives an organization entity (a client account, an account owner, a user) a **visual identity**. In business terms the picture is the human-recognizable face of an account in the org tree, the topbar avatar, and every list row — it is not decorative, it is the at-a-glance identity cue that lets an operator tell one account from another. `[CODE]` `falcon-photo-uploader.component.ts:34-37` — the picture is captured as a `{extension, fileBase64String}` payload that maps one-for-one onto the Commerce wire field `profilePictureImageInfo`, so the upload IS the business act of stamping an identity onto the account record.

## PRD / business rules touched
| Rule | Source | How this component enforces / surfaces it |
|---|---|---|
| Client/owner picture is captured at creation | `[MEMORY]` `project_add_client_wizard_wave7_1_prd_defaults` | Add Client Step 1 (Information) + Step 5 (Account Owner) each ship a `<falcon-photo-uploader>` so the picture is collected as part of the create payload, not after the fact. |
| User profile photo captured on Add User Step 1 | `[CODE]` `OVERVIEW.md` Known consumers → `user-personal-step.component.html` | The user avatar is part of the Personal step of Add User. |
| Picture is optional, not required | `[CODE]` `falcon-photo-uploader.component.ts:79-80` — `photo` defaults to `''` (empty = no photo), no required-validator wired | An account can be created with no picture; the empty state renders a fallback icon, never blocks submit. |
| `[INFERRED]` Picture must round-trip Commerce as a base64 image | `[CODE]` `:34-51` `FalconUploadedPicture` + `MIME_EXT_MAP` mirror the Commerce `profilePictureImageInfo` shape | The component does the MIME→extension split itself so the wire builder needs no parse step. |

## Business constraints baked in
- `[CODE]` `:88` **2 MB hard cap** — `maxBytes` default `2 * 1024 * 1024`. Reason: image payloads are base64-inlined into the create request; a large picture bloats the Commerce write. A builder must NOT raise this casually — it is a payload-size guard, not arbitrary.
- `[CODE]` `:87` **PNG + JPEG only by default** — `accept` default `'image/png,image/jpeg'`. Reason: account avatars are raster identity images; the default deliberately excludes documents/PDFs. `MIME_EXT_MAP` (`:43-51`) also tolerates gif/webp/svg/bmp if a consumer opts in via `accept`.
- `[CODE]` `:106`,`:142-181` **`viewMode` is a business statement, not a styling toggle** — when an Information panel renders a saved account in read-only mode, `[viewMode]="true"` strips the upload button, drag hint, edit/delete overlays and makes every handler a no-op. The picture is shown at the SAME size — only the *authority to change it* is removed.
- `[CODE]` `:152-156` **Clearing the photo is a real mutation** — `onClearClicked()` emits `pictureChange.emit(null)` so the host's `photoData` field is nulled in lockstep. Removing a picture is committed, not just visually hidden.

## Business flows using this component
| Flow | Page | Role of the component in the flow |
|---|---|---|
| Add Client wizard — Step 1 Information | organization-hierarchy | Captures the client account logo → `profilePictureImageInfo`. |
| Add Client wizard — Step 5 Account Owner | organization-hierarchy | Captures the owner's photo → `accountOwnerProfilePictureImageInfo`. |
| Add User wizard — Step 1 Personal | organization-hierarchy | Captures the user avatar. |
| Information panel (view + edit) | organization-hierarchy hierarchy tab | `[MEMORY]` `project_info_panel_backend_integration_wave15` — view mode shows the saved account picture; edit mode lets a permitted operator replace it. |

## Business gotchas
- `[CODE]` `:190` **Oversized files are silently dropped** — `consume()` does `if (file.size > this.maxBytes()) return;` with no error surfaced. From the user's perspective the upload "did nothing". A builder must understand this is a known gap (`GAPS_AND_UPGRADES.md` item 3), not invisible success — the business expectation is a "too large" message.
- `[CODE]` `:79` **`[photo]` is a data URL, never an http URL** — for an *edit* flow that already has a stored avatar as a remote URL, the picture preview will not show unless the consumer base64-encodes it first. The component owns capture, not remote rendering.
- A disabled-looking uploader in an Information panel (`viewMode`) is the business rule "you may look, not change" — do not "fix" it by enabling.

## Verification
🟡 CODE-DERIVED from `falcon-photo-uploader.component.ts` (full source read) + the existing 6 dossier files + `[MEMORY]` org-hierarchy entries. Add Client / Add User / Information panel are confirmed-working features per `[MEMORY]` Wave 15 — ✅ for those flows.
