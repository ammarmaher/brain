# falcon-single-uploader — OVERVIEW

## Component purpose

Single-file uploader with two visible states, built on the **dual-render Stencil pattern** (Shadow `<falcon-single-uploader>` + Light `<falcon-single-uploader-tw>` + Angular CVA wrapper `<falcon-angular-single-uploader>`):
- **Empty:** a dashed dropzone with a cloud-upload glyph + placeholder ("Click to browse or drop here") + optional hint; click or drop to add.
- **Filled:** a **square preview tile** (image thumbnail OR a generic file-type icon) with two floating action buttons — top-end **delete** (red) + bottom-end **edit** (teal, re-opens the picker to replace) — plus an optional bottom progress bar while `status==='uploading'`.

A visually-hidden native `<input type="file">` sits behind the UI and is focusable. Drag-and-drop in the filled state REPLACES the current file. Validation is explicitly DEFERRED — the consumer drives `file.status` / `progress` / `errorMessage` / `url`.

## Business / UI use case

- Single-image / single-document slots: logo upload, signature, ID copy, one signed PDF.
- Compact "browse + preview one file" experiences (square tile, 3 sizes).
- A `compact` preview mode renders a row (small thumb/icon + name + size) for narrow form columns.

## When to use it / when NOT to use it

**Use it for:**
- Single-file flows where the user might want to **replace** the file (the edit button is the differentiator).
- A compact **square preview tile** of exactly one file.

**Do NOT use it for:**
- Multi-file flows / the avatar-row "upload + stack + retry + banner" UX → `<falcon-angular-document-uploader>` / `<falcon-angular-image-uploader>` (the `file-uploader-shared` family).
- Circular avatar / profile photo → `<falcon-photo-uploader>` (legacy bespoke).
- Bulk CSV/Excel import with an S3 handshake → `<falcon-angular-document-uploader>` (see contact-groups).

> `[CODE]` **Correction vs prior dossier:** the old "DO NOT use for multi-file → `<falcon-angular-uploader>`" pointer is **stale**. The live multi-file uploaders are `<falcon-angular-document-uploader>` / `<falcon-angular-image-uploader>` (the `file-uploader-shared` family). A `<falcon-angular-uploader>` dossier exists but is a separate (older) lineage — see RECOGNITION.

## Status

**ACTIVE / PREFERRED for single-file replace-tile flows — but currently has NO production consumer** in admin-console or management-console. `[CODE]` Live render sites are showcase/registry only (see Consumer Sweep). It is a ready, complete component awaiting a feature that needs the square-tile single-file UX.

## Replaces

- A bespoke single-file dropzone + preview tile. Pixel-parity intent with the Falcon uploader family.

## Source file paths

| Layer | Path |
|---|---|
| Angular wrapper TS | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-single-uploader/falcon-single-uploader.component.ts` (154 ln; CVA) |
| Angular wrapper HTML | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-single-uploader/falcon-single-uploader.component.html` (54 ln; dual render + `<ng-content>`) |
| Angular wrapper CSS | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-single-uploader/falcon-single-uploader.component.css` (`:host{display:block}` only) |
| Angular barrel | _none in folder_ — exported via `libs/falcon-ui-core/src/angular-wrapper/index.ts:32` (`export * from './components/falcon-single-uploader'`) |
| Stencil Shadow source | `libs/falcon-ui-core/src/components/falcon-single-uploader/falcon-single-uploader.tsx` (363 ln, `shadow:true`) |
| Stencil Shadow CSS | `libs/falcon-ui-core/src/components/falcon-single-uploader/falcon-single-uploader.css` (token-only) |
| Stencil Light source | `libs/falcon-ui-core/src/components/falcon-single-uploader-tw/falcon-single-uploader-tw.tsx` (371 ln, `shadow:false`) |
| Types | `libs/falcon-ui-core/src/components/falcon-single-uploader/falcon-single-uploader.types.ts` (48 ln) |
| Utils | `libs/falcon-ui-core/src/components/falcon-single-uploader/falcon-single-uploader.utils.ts` (44 ln) |
| Tailwind helper | `libs/falcon-ui-core/src/tailwind/single-uploader-tailwind-classes.ts` (369 ln; SSOT class strings) |
| Component token file | `libs/falcon-ui-tokens/src/components/single-uploader.tokens.css` (199 ln; 14 categories; `:where()`-scoped, gate-12 compliant) |
| Spec / e2e | `[CODE]` _none in the component folders_ (no `.spec.ts`/`.e2e.ts` found 2026-06-03) — GAP. |

## Selectors / tags

| Layer | Tag / selector |
|---|---|
| Angular selector | `falcon-angular-single-uploader` |
| Stencil Shadow tag | `<falcon-single-uploader>` (when `useTailwind=false`) |
| Stencil Light tag | `<falcon-single-uploader-tw>` (default, `useTailwind=true`) |

## Known consumers (grep verified 2026-06-03)

`[CODE]` `<falcon-angular-single-uploader>` / `falcon-single-uploader` across `apps/` = **showcase + registry + safelist only, NO production feature consumer**:
- `apps/host-shell/src/app/features/falcon-ui-showcase/gallery/showcase-variant-tile.component.ts` (showcase tile).
- `apps/host-shell/src/app/features/falcon-ui-showcase/showcase-data/registry.ts` (showcase registry entry).
- `apps/admin-console/src/tailwind.css` + `apps/host-shell/src/tailwind.css` (`@source` safelist so the `-tw` arbitrary-value utilities survive purge).
- `apps/host-shell/src/assets/component-docs/single-uploader.md` (showcase doc).

No match under `libs/falcon/` features. This confirms the prior dossier's "no production consumer" note — the multi-file uploads in production use the `file-uploader-shared` family instead.

## Related components

- `<falcon-angular-document-uploader>` / `<falcon-angular-image-uploader>` — the live multi-file (and single-file avatar-row) uploaders (`file-uploader-shared` family). Different DOM/UX (horizontal avatar-row + stack + banner + retry), different token file (`file-uploader.tokens.css`).
- `<falcon-photo-uploader>` (legacy) — circular avatar uploader.
- Conceptually composes the same a11y/id utilities (`generateId`, `ariaBool`) as the rest of the library.

## Ownership / responsibility

`libs/falcon-ui-core` (cross-framework Stencil pair + Angular CVA wrapper). Owned by the Falcon UI team. Token contract in `libs/falcon-ui-tokens/src/components/single-uploader.tokens.css`. Validation deferred to consumer.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B19 sweep). All source-file paths re-confirmed on disk (wrapper 154 ln, Shadow 363 ln, `-tw` 371 ln, types 48, utils 44, tailwind 369, tokens 199). Consumer Sweep re-run → showcase/registry/safelist only (no production consumer). Drift corrected: multi-file sibling is the `file-uploader-shared` family, not `<falcon-angular-uploader>`; no spec exists.
