# falcon-angular-uploader — OVERVIEW

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
- **ACTIVE / PREFERRED** for multi-file flows.
- Validation is DEFERRED — the consumer drives `file.status` and `file.errorMessage`. The component only paints the visual state.

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
