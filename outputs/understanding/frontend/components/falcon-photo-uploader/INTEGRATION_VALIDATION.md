# falcon-photo-uploader — Integration & Validation Layer

> Layer 3 of 3. UI layer → `OVERVIEW.md` etc. Business layer → `BUSINESS.md`.
> Source-prefix every fact: `[CODE]` `[BRAIN-OUT]` `[VAULT]` `[BRAIN-SK]` `[INFERRED]`.

## Owning backend module(s)
The component is **presentational + file-decoding** — it owns no endpoint. The picture it produces is persisted by:
- **Commerce** — the picture payload travels inside the account/owner create + update requests. `[CODE]` `falcon-photo-uploader.component.ts:6-9` doc-comment — the parsed object is propagated into the Commerce wire fields `profilePictureImageInfo` (account) and `accountOwnerProfilePictureImageInfo` (owner). `[MEMORY]` `project_info_panel_backend_integration_wave15` — `PUT commerce/information` carries `ProfilePicture` on the Information panel edit.
- `[INFERRED]` **Identity** — the Add User avatar is part of the user create payload; the Add User wizard's wire builder owns whether that lands in Commerce or Identity. The component does not call either — it only emits.

## Backend wiring
| Endpoint | Method | Backend module | DTO (req / resp) | Gateway | Notes |
|---|---|---|---|---|---|
| `commerce/information` | `PUT` | Commerce | `UpdateMainNodeInfoRequest` (carries `ProfilePicture`) | System Gateway (`useGateway()`) | `[MEMORY]` Wave 15 — Information panel edit persists the picture |
| Add Client create | `POST` | Commerce | create request w/ `profilePictureImageInfo` + `accountOwnerProfilePictureImageInfo` | System Gateway | `[CODE]` `:6-9` doc-comment — wire builder reads `photoData` / `ownerPhotoData` |
| Add User create | `POST` | Commerce / Identity | user create request w/ avatar payload | System Gateway | `[INFERRED]` — owning module decided by the Add User wizard |

The component never issues an HTTP call. It produces `FalconUploadedPicture` (`{extension, fileBase64String}`); the **wizard / panel state slice** owns the request.

## Validation rules (V-*)
| V-rule | Field | Trigger | Error code / message |
|---|---|---|---|
| File-size cap | picked file | `file.size > maxBytes()` (default 2 MB) | `[CODE]` `:190` — **no error surfaced**, file is silently dropped. Known gap. |
| MIME accept | picked file | native `<input accept>` filters the OS picker only | `[CODE]` `:87` — `accept` is a hint, not enforced on drag-drop. `parseDataUrl` (`:210-220`) returns `null` for an unparseable MIME → no `pictureChange` emit. |
| Picture optional | `photo` | submit with empty photo | none — `[CODE]` `:79-80` empty is valid; no required-validator. |

The component carries **no `validations/validations.ts`** — it pre-dates the canonical component-folder doctrine. Cross-field rules (e.g. picture required for a brand-managed client) would live in the consuming wizard step's `validations/`.

## PES keys gating this component
The uploader has no PES key of its own. It inherits the gate of the **panel/step that hosts it**:
- `[MEMORY]` `project_info_panel_backend_integration_wave15` — Information panel resolves `FalconAccess.adminConsole.accountProfile.edit()`. When the operator may not edit the profile, the panel renders `<falcon-photo-uploader [viewMode]="true">` — the uploader's interactive UI is stripped by the parent's PES resolution, not by the uploader itself.

## State / signal pattern
`[CODE]` Internal state is signal-based: `photo` is a `model<string>` (two-way data URL), `dragOver` a `signal<boolean>`, `hasPhoto` + `containerClasses` are `computed`. The host wizard/panel owns the real state slice:
- `[MEMORY]` Wave 15 — the Information panel `info-panel-state.signals.ts` slice holds the picture in its `formValue` snapshot and dirty-tracks it.
- `[CODE]` `:111-117` — `(pictureChange)` emits the parsed object on every pick/drop AND `null` on Clear; the host binds it to `photoData` / `ownerPhotoData`.
- `[CODE]` `:108-109` — `(fileSelected)` emits the raw `File` (backward-compat path).
- Error pipeline: none — the component does not toast. Oversized files vanish silently (see V-rules).

## Skeleton ↔ app-wrapper layering
- **No Stencil skeleton.** `[CODE]` `OVERVIEW.md` — this is a bespoke pure-Angular `libs/falcon/src/shared-ui/` component with no `<falcon-photo-uploader-tw>` / Shadow twin.
- **No Angular wrapper layer either** — it IS the leaf component. The consuming wizard step is the app layer; it owns the lookup-free file capture and forwards the payload to its own state slice + wire builder (per `feedback_library_skeleton_app_api`, the HTTP call lives in the app/state layer, never in the component).
- Migration target `<falcon-angular-single-uploader>` DOES have the Stencil-skeleton + Angular-wrapper split — see `GAPS_AND_UPGRADES.md`.

## Integration gotchas
- `[CODE]` `:194-198` **Decode is async** — `FileReader.onload` fires after the pick; `photo`, `fileSelected`, and `pictureChange` all emit inside the callback. A host reading `photoData` synchronously right after the user picks will see stale state.
- `[CODE]` `:160-164` `onFileChange` resets `input.value = ''` after consume — so picking the **same file twice in a row** still fires `change`. Without this the second pick would be a no-op.
- `[CODE]` `:210-220` `parseDataUrl` falls back to `File.type` when the data-URL header is malformed; if neither yields a usable MIME it returns `null` and **no `pictureChange` fires** — the host's `photoData` keeps its previous value silently.
- `[CODE]` `:6-9` `(pictureChange)` is the camelCase-friendly path: it emits `fileBase64String` already stripped of the `data:image/...;base64,` prefix — do NOT re-strip it in the wire builder.
- `[MEMORY]` Org-hierarchy payloads must route through the **System Gateway** (`useGateway()`); the picture rides inside that same request — never POST it to a direct host.

## Verification
🟡 CODE-DERIVED from `falcon-photo-uploader.component.ts` (full source) + the 6 existing dossier files + `[MEMORY]` Wave 15 Information-panel entry. Commerce wire field names `profilePictureImageInfo` / `ProfilePicture` ✅ VERIFIED in `[CODE]` doc-comment + `[MEMORY]`. The Add User owning module is `[INFERRED]`.
