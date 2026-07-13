# falcon-photo-uploader (LEGACY) — OVERVIEW

> [!warning] REMOVED / Superseded by [[falcon-image-uploader]] (`<falcon-angular-image-uploader>`)
> **This component no longer exists on disk.** `FalconPhotoUploaderComponent` / `<falcon-photo-uploader>` was **DELETED 2026-05-31** as part of the React-SoT image-uploader migration (Wave 0/1/2). Source of truth: [CODE] `libs/falcon/src/shared-ui/index.ts:7-9` — *"Legacy falcon-photo-uploader DELETED 2026-05-31 — superseded by the React-SoT `<falcon-angular-image-uploader>` migration (Wave 0/1/2). All wizards + Org Info Panel now consume the image/document uploaders; the avatar parser lives in ./lib/utils."* Every former consumer (Add Client information step, Add Client account-owner step, Add User personal step — in BOTH admin-console and management-console — plus the Org Info Panel) now uses `<falcon-angular-image-uploader>`. The File→data-URL/base64 avatar helpers moved to [CODE] `libs/falcon/src/shared-ui/lib/utils/picture-file.util.ts`. This dossier is a historical reconciliation stub only.
>
> _Reconciled 2026-06-03 (B23 reconcile cluster) — dossier was a 4-file orphan (no live 1:1 component). Status flipped LEGACY-IN-USE→REMOVED._

## Purpose
Bespoke Angular standalone component for circular avatar / profile photo upload. Renders an avatar circle (image when present, fallback icon when empty) + drag-hint banner + upload button. Used by Add Client / Add User wizards on the FIRST step to capture the entity / user picture.

## Business / UI use case
- "Client Picture" on Add Client → Step 1 (Information).
- User profile photo on Add User → Step 1 (Personal).
- Anywhere a circular avatar with replace UX is needed.

## When to use it / when NOT to use it
- Currently the ONLY Falcon option for circular avatar upload — `<falcon-angular-single-uploader>` provides a square tile, not a circle.
- DO use this for the legacy wizard avatar slots until a Falcon UI core "avatar uploader" lands.
- DO NOT use this for new pages where a square preview is acceptable — use `<falcon-angular-single-uploader>` with `previewMode="thumbnail"` instead.

## Status
- **REMOVED (deleted 2026-05-31).** [CODE] `libs/falcon/src/shared-ui/index.ts:7-9`. Verified by Glob 2026-06-03: the folder `libs/falcon/src/shared-ui/lib/components/falcon-photo-uploader/` no longer exists (the live `shared-ui/lib/components/` set has no photo-uploader folder), and `<falcon-photo-uploader>` is not referenced by any live template — the wizard step that formerly used it now reads `<falcon-angular-image-uploader>` ([CODE] `apps/admin-console/.../add-client-wizard/client-information-step/client-information-step.component.html:2-13` migration comment + tag).
- **Successor:** `<falcon-angular-image-uploader>` ([[falcon-image-uploader]]). The migration preserved the Commerce backend contract — `photoData` ({extension, fileBase64String}) flows verbatim into `wire-builders.ts → info.profilePictureInfo` ([CODE] same HTML comment).

## Selectors / Tags
- **Selector:** `falcon-photo-uploader` (ESLint disabled due to selector violating `@angular-eslint/component-selector` — kept for the legacy public API).
- **No Stencil tag.**

## Source paths
| Layer | Path |
|---|---|
| Component class | `libs/falcon/src/shared-ui/lib/components/falcon-photo-uploader/falcon-photo-uploader.component.ts` |
| Template | `libs/falcon/src/shared-ui/lib/components/falcon-photo-uploader/falcon-photo-uploader.component.html` |
| SCSS (legacy carry-over) | `libs/falcon/src/shared-ui/lib/components/falcon-photo-uploader/falcon-photo-uploader.component.scss` |
| Barrel | `libs/falcon/src/shared-ui/lib/components/falcon-photo-uploader/index.ts` |

## Known consumers
**LIVE consumer count of `<falcon-photo-uploader>` = 0** (verified by Grep 2026-06-03; only docs/plans mention the legacy tag). The former consumers below were **all migrated to `<falcon-angular-image-uploader>`** during the Wave 0/1/2 image-uploader migration — they are listed here as migration history, not as live references:
- ~~`add-client-wizard/client-information-step/client-information-step.component.html`~~ → now `<falcon-angular-image-uploader>` ([CODE] verified, lines 2-13).
- ~~`add-client-wizard/client-account-owner-step/client-account-owner-step.component.html`~~ → now `<falcon-angular-image-uploader>`.
- ~~`add-user-wizard/user-personal-step/user-personal-step.component.html`~~ → now `<falcon-angular-image-uploader>`.
- ~~Mirror folders in `apps/management-console/.../org-hierarchy-page/components/wizard-components/`~~ → all migrated.
- The Org Info Panel (`falcon-org-info-panel.component.html`, both apps) also consumes `<falcon-angular-image-uploader>` now.
- _Path note: the live feature folder is `features/org-hierarchy-page/` (the old `organization-hierarchy/` path in the original list is itself stale)._

## Related components
- **`<falcon-angular-image-uploader>` ([[falcon-image-uploader]]) — the actual replacement that shipped** (React-SoT card-row image uploader, `fileAdd.nativeFile` → base64).
- `<falcon-angular-single-uploader>` ([[falcon-single-uploader]]) — sibling square-tile single-file uploader (the dossier's old "credible migration target" guess; the migration actually went to image-uploader instead).
- `<falcon-angular-document-uploader>` ([[falcon-document-uploader]]) — sibling for multi-document rows.

## Ownership / Responsibility
- Was owned by `libs/falcon/src/shared-ui/` legacy (now deleted).
- It owned a bespoke `*.component.scss` (violated the "no SCSS" rule) — one motivation for the migration to the token-driven `<falcon-angular-image-uploader>`.
- Historical contract: consumer drove the `photo` model (data URL); the component generated a data URL via `FileReader.readAsDataURL` and emitted the raw `File` via `fileSelected`. The image-uploader successor exposes this via `fileAdd.nativeFile` + CVA `[ngModel]` instead.

## Verification
🟢 code-verified (B23 reconcile 2026-06-03) — deletion confirmed via [CODE] `libs/falcon/src/shared-ui/index.ts:7-9`; live-consumer-count = 0 confirmed via Grep of `<falcon-photo-uploader`; successor `<falcon-angular-image-uploader>` confirmed live in the migrated wizard template [CODE] `client-information-step.component.html:2-13`. Historical API/UI prose below the banner is unverified against live code (component no longer exists).
