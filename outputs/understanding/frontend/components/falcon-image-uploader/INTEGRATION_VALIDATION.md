# falcon-image-uploader — Integration & Validation Layer

> Layer 3 of 3. UI layer → `OVERVIEW.md` etc. Business layer → `BUSINESS.md`.

## Owning backend module(s)
The component is **presentational + client-side ext/size validation only** — it owns no data and calls no endpoint. The picked image is persisted by whichever module owns the *flow*:
- **Commerce** — client picture / account-owner photo / node logo (`info.profilePictureInfo` on the client-create + Information-update payloads). `[CODE]` client-information-step.component.html:2-12 (comment).
- **Identity** — user avatar (Add User flow; Identity owns user lifecycle).
- **Templates module** — header media on a message template (Templates wizard Step 2). `[INFERRED]`.

## Backend wiring
| Endpoint | Method | Backend module | DTO (req) | Gateway | Notes |
|---|---|---|---|---|---|
| Add Client create | `POST` | Commerce | client-create payload, `info.profilePictureInfo = { extension, fileBase64String }` | System Gateway (admin) | `[CODE]` consumer builds `photoData` from `fileAdd.nativeFile`; rides verbatim into the wire builder. |
| `commerce/information` | `PUT` | Commerce | Information-update payload incl. `profilePictureInfo` | System Gateway (admin) / Core Gateway (mgmt) | Info-panel logo edit. `[INFERRED]` mgmt path uses Core Gateway per platform routing. |
| Add User create | `POST` | Identity | user-create payload (avatar base64) | System Gateway | `[INFERRED]` from the Add-User flow. |

> `[CODE]` The uploader element **never calls these endpoints itself** — it emits `fileAdd` (raw `File`) / `fileError` / `valueChange`; the parent step's state slice reads `nativeFile`, builds the base64 `photoData`, and the host's `submitFn` POSTs it. (Mirrors the platform "library skeleton never fetches data" rule — `[MEMORY]` feedback_library_skeleton_app_api.)

## Validation rules (V-*)
| V-rule | Field | Trigger | Error code / message |
|---|---|---|---|
| Allowed-extension | image file | pick / drop a non-`png,jpg,jpeg` file | `fileError(code:'wrong-type')`; descriptor painted RED; `extErrorTemplate` text |
| Max-size boundary | image file | pick / drop a file > `maxSizeMB` (1 MB on Add Client) | `fileError(code:'too-large')`; descriptor painted RED; `sizeErrorTemplate` text |
| Format / dimensions | image file | — | **none** — no dimension/aspect/server-scan validation at the component (GAP G-validate; richer rules stay in consumer/backend) |

> `[CODE]` falcon-image-uploader.tsx — the ONLY validation is `parseExtList(accept)` + `maxSizeMB` inside `ingestFiles` (file-uploader.behavior.ts). There is no Reactive-Forms validator baked in; `required` only sets the native `required` attr. Business "must have a picture" gating lives in the consumer's step validator.

## PES keys gating this component
| PES key | Action | Effect when denied |
|---|---|---|
| (inherits parent field's PES) | edit the image | the parent step/panel resolves PES and binds `[disabled]="true"` on the uploader |
| `[MEMORY]` `canEditFalconOnly` (Information panel) | edit a Falcon-only node logo | uploader rendered `[disabled]` for non-Falcon sessions, same gate as the Account Name input in the panel |

The uploader has no PES key of its own — it inherits the gate of the **field/panel** it renders. `effectiveDisabled` (`disabled` input OR CVA disabled-state) is the single chokepoint that blocks open/drag/keyboard.

## State / signal pattern
`[CODE]` falcon-image-uploader.component.ts:
- Internal `files = signal<ReadonlyArray<FalconFileUploaderFile>>([])`, `disabledSig = signal(false)`, `effectiveDisabled = computed(() => disabled() || disabledSig())` (ts:161-166).
- `writeValue(value)` → `files.set(value ?? [])`; the value is the **descriptor array**, re-seeded on wizard step-return.
- Five outputs (`valueChange`, `fileAdd`, `fileRemove`, `fileRetry`, `fileError`) are `output()`; the Stencil `falcon-blur` routes to CVA `onTouched()` only.
- **The `definedTw` upgrade gate** (ts:53-66): the `-tw` Light-DOM element renders only after `defineFalconTwComponent('falcon-image-uploader')` resolves — load-bearing to avoid Angular setting element properties before the custom element upgrades (which would shadow the Stencil prototype accessors and make every binding render its declared default). Do NOT remove this gate.
- The host's HTTP error pipeline (`[MEMORY]` 400 → top-right toast) is orthogonal — it does not touch the uploader.

## Skeleton ↔ app-wrapper layering
- **Stencil skeleton** — `<falcon-image-uploader>` (Shadow) / `<falcon-image-uploader-tw>` (Light DOM). Pure presentational + ext/size validation; emits the five `falcon-*` events; exposes `setFiles()` / `openFileDialog()` / `setFocus()` methods. Both share the `file-uploader-shared` render/behavior/layout/types/tokens with `<falcon-document-uploader>`.
- **Angular wrapper** — `<falcon-angular-image-uploader>`: implements `ControlValueAccessor`, registers the `-tw` tag in `ngOnInit`, toggles render path via `useTailwind`, OR-combines explicit + CVA disabled, and DI-seeds defaults from `FALCON_UPLOADER_DEFAULTS.image`.
- Per the registry rule the wrapper never fetches data — the parent state slice reads `nativeFile` and POSTs.

## Integration gotchas
- `[CODE]` **The CVA value is NOT the raw File** — it is `FalconFileUploaderFile[]` (id/name/size/type/status/…). The raw `File` for the upload pipeline is `fileAdd.nativeFile`. Build base64 from `nativeFile`, not from the value.
- `[CODE]` **No public `[files]` input** — drive the list via `[(ngModel)]`/`formControlName`; the consumer comment (html:9) calls this out explicitly.
- `[CODE]` **`accept` is bare extensions** (`png,jpg,jpeg`) — the native `accept` attr is rebuilt as `.png,.jpg,.jpeg` (tsx:339). Passing MIME types breaks the picker filter.
- `[CODE]` **Suppress-banner ⇒ supply-your-own-error** — with `showBanner=false`, the built-in size message is gone; the consumer must render its own error line (Add Client html:32-41).
- `[CODE]` **`disabled` must be a property binding** — `[disabled]="…"` (input) OR `setDisabledState` (CVA); both feed `effectiveDisabled`. `[attr.disabled]` would bypass it.
- `[INFERRED]` **base64 wire** — the profile-picture payload (`{extension, fileBase64String}`) rides camelCase JSON to Commerce per the platform-wide .NET default; the 1 MB cap is the request-size guardrail.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B20) — `effectiveDisabled` (ts:164), `writeValue(null)→[]` (ts:172), the five outputs (ts:154-158), the `definedTw` upgrade gate (ts:53-66), and ext+size as the only validation (behavior path) all re-confirmed in live source. Backend endpoint/DTO names are 🟡 CODE-DERIVED from the consumer inline comment (`info.profilePictureInfo` / `wire-builders.ts`) + `[INFERRED]` from platform routing — NOT re-read from backend source this pass. PES gate 🟡 cross-referenced from `[MEMORY]` Information-panel `canEditFalconOnly`.
