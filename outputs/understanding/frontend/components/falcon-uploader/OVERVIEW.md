# falcon-angular-uploader — OVERVIEW

> [!warning] REMOVED / Superseded by the [[falcon-single-uploader]] · [[falcon-image-uploader]] · [[falcon-document-uploader]] family
> **This component no longer exists on disk.** The legacy multi-file `<falcon-angular-uploader>` / `FalconAngularUploaderComponent` was **DELETED 2026-05-31** with **0 app/feature consumers**. Source of truth: [CODE] `libs/falcon/src/shared-ui/index.ts:114-115` — *"Legacy multi-file `<falcon-uploader>` / FalconAngularUploaderComponent DELETED 2026-05-31 (0 app/feature consumers — superseded by the single/image/document uploader family)."* For any new uploader work, use one of the three live successors: `<falcon-angular-single-uploader>` (single-file replace UX), `<falcon-angular-image-uploader>` (avatar / image preview, the photo-uploader replacement), or `<falcon-angular-document-uploader>` (multi-document rows). The shared Stencil core for all three lives at [CODE] `libs/falcon-ui-core/src/components/file-uploader-shared/`. This dossier is retained as a historical reconciliation stub only — the API/USAGE/TOKENS sections below describe the now-deleted component and are NOT a guide for current code.
>
> _Reconciled 2026-06-03 (B23 reconcile cluster) — dossier was a 4-file orphan (no live 1:1 component). Status flipped ACTIVE→REMOVED; not rebuilt to a full 9-file dossier because the unit is dead._

## Purpose
Multi-file uploader with three operating modes: `dropzone` (large drop area with browse-on-click), `button` (compact trigger), `inline-list` (list-only view for pre-populated rows). Renders a native `<input type="file">` behind the visible UI plus an optional file-list with per-row status badges, progress bars, error messages, thumbnail previews, and a remove button.

## Business / UI use case
- Document uploads on Add Client / Add User wizards (logos, contracts, ID copies).
- Multi-attachment composers (e.g., a comment thread that allows multiple files).
- File picker on Settings panels.

## When to use it / when NOT to use it
- USE for multi-file uploads where the consumer drives upload state (queued / uploading / success / error) and progress externally.
- USE when the consumer wants Drag/Drop + file picker + per-row status feedback.
- DO NOT use for single-file uploads with edit/replace UX — use `<falcon-angular-single-uploader>` instead.
- DO NOT use for avatar / profile photo uploads — use `falcon-photo-uploader` (legacy) until a Falcon-UI-core "avatar uploader" lands.

## Status
- **REMOVED (deleted 2026-05-31).** [CODE] `libs/falcon/src/shared-ui/index.ts:114-115`. The folder `libs/falcon-ui-core/src/angular-wrapper/components/falcon-uploader/` no longer exists; a `falcon-uploader-tw` Stencil twin no longer exists. Verified by Glob 2026-06-03: the live `angular-wrapper/components/` set (62 components) contains `falcon-single-uploader`, `falcon-image-uploader`, `falcon-document-uploader` but NO `falcon-uploader`.
- Historical note (when it lived): validation was DEFERRED — the consumer drove `file.status` and `file.errorMessage`; the component only painted the visual state.
- **Successors:** `<falcon-angular-single-uploader>` ([[falcon-single-uploader]]), `<falcon-angular-image-uploader>` ([[falcon-image-uploader]]), `<falcon-angular-document-uploader>` ([[falcon-document-uploader]]). Shared Stencil core: [CODE] `libs/falcon-ui-core/src/components/file-uploader-shared/`.

## Selectors / Tags
- **Angular selector:** `falcon-angular-uploader`
- **Stencil Shadow tag:** `<falcon-uploader>` (default when `useTailwind=false`)
- **Stencil Light tag:** `<falcon-uploader-tw>` (default when `useTailwind=true`)

## Source paths
| Layer | Path |
|---|---|
| Angular wrapper | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-uploader/falcon-uploader.component.ts` |
| Angular template | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-uploader/falcon-uploader.component.html` |
| Stencil Shadow source | `libs/falcon-ui-core/src/components/falcon-uploader/falcon-uploader.tsx` |
| Stencil Shadow CSS | `libs/falcon-ui-core/src/components/falcon-uploader/falcon-uploader.css` |
| Stencil Light source | `libs/falcon-ui-core/src/components/falcon-uploader-tw/falcon-uploader-tw.tsx` |
| Types | `libs/falcon-ui-core/src/components/falcon-uploader/falcon-uploader.types.ts` |
| Utils | `libs/falcon-ui-core/src/components/falcon-uploader/falcon-uploader.utils.ts` |
| Tokens | `libs/falcon-ui-tokens/src/components/uploader.tokens.css` |

## Known consumers
- `apps/host-shell/src/app/playground/playground.page.html` — playground showcase.
- _None observed in active production app source._ Wizard consumers use the legacy `<falcon-photo-uploader>` for avatar fields (see `falcon-photo-uploader/`).

## Related components
- `<falcon-angular-single-uploader>` — single-file with replace/edit/delete overlays.
- `<falcon-photo-uploader>` (legacy) — bespoke avatar circle.
- `<falcon-angular-empty-state>` — sibling for "no files yet" rendering.

## Ownership / Responsibility
- Owned by Falcon UI core (Stencil + Angular wrapper).
- File validation (mime/size/count) is the CONSUMER's responsibility — pass `accept`, `maxSize`, `maxFiles` for the native input's enforcement, but app logic must verify and set `file.status === 'error'` + `file.errorMessage` if rejection rules need to be richer.
- Token contract: `uploader.tokens.css` (14 categories).

## Verification
🟢 code-verified (B23 reconcile 2026-06-03) — deletion confirmed via [CODE] `libs/falcon/src/shared-ui/index.ts:114-115` + Glob of `libs/falcon-ui-core/src/angular-wrapper/components/` (no `falcon-uploader` folder; successors `falcon-single-uploader` / `falcon-image-uploader` / `falcon-document-uploader` present). Historical API/UI prose below the banner is unverified against live code (component no longer exists).
