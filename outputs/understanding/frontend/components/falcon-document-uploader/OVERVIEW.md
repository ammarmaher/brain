# falcon-document-uploader — OVERVIEW

## Component purpose

Avatar-row **document uploader** for spreadsheet/document files (`xlsx,xls,csv,pdf,docx`, 10 MB default, rounded shape). Built on the **dual-render Stencil pattern** (Shadow `<falcon-document-uploader>` + Light `<falcon-document-uploader-tw>` + Angular CVA wrapper `<falcon-angular-document-uploader>`) and the shared **`file-uploader-shared`** engine. It renders a horizontal row: a left circle/tile glyph + a center label/progress + a right "drag a file here / Upload File" affordance, with an optional water/bar/laser progress layer, a success/error banner below, and (in `[multiple]` mode) a stack of overlapping circles + a count badge + an expandable per-file list with retry.

It is the **document twin of `<falcon-image-uploader>`** (B20) — `[CODE]` "Mirrors `<falcon-image-uploader>` 1:1 in behavior/DOM — only defaults differ (accept, maxSizeMB, shape, buttonText, variant='document')" (falcon-document-uploader.tsx:3-6). The document variant shows the spreadsheet glyph for xls/xlsx/csv and a generic document glyph otherwise; it does NOT render image previews. Validation is client-side **ext + size only**; everything else (status/progress/url) is consumer-driven via `setFiles()` / the bound value.

## Business / UI use case

- **Contact-groups CSV/Excel import** (management-console): the live flagship consumer — the raw `File` from `(fileAdd).nativeFile` feeds an S3 pre-signed-URL upload pipeline (see `INTEGRATION_VALIDATION.md`).
- **Template media attachment** (templates wizard, both consoles): the document/video branch (image → `<falcon-angular-image-uploader>`; video/document → this).
- Any "attach a spreadsheet/PDF/doc" step where the consumer drives the real upload + progress.

## When to use it / when NOT to use it

**Use it for:**
- Uploading documents/spreadsheets (xlsx/xls/csv/pdf/docx) with the Falcon avatar-row UX (drag-hint, progress, banner, retry).
- Single OR multi-file document uploads (toggle `[multiple]`).
- A flow where the consumer needs the **raw `File`** to drive a real (S3 / gateway) upload — exposed via `(fileAdd).nativeFile`.

**Do NOT use it for:**
- Image uploads with thumbnails → `<falcon-angular-image-uploader>` (its `variant='image'` twin renders image previews).
- A compact **square single-file preview tile** → `<falcon-angular-single-uploader>`.
- Circular avatar / profile photo → `<falcon-photo-uploader>` (legacy).

## Status

**ACTIVE / PREFERRED for document uploads, with REAL production consumers.** `[CODE]` Live in management-console contact-groups (CSV/Excel import) + the templates wizard media step in both consoles. App-wide defaults are DI-seeded from `FALCON_UPLOADER_DEFAULTS.document` (see Source paths + INTEGRATION_VALIDATION).

## Replaces

- A bespoke dashed dropzone + file chip in contact-groups (`[CODE]` upload-group-details-step.component.ts:6-8 — "the bespoke dashed dropzone + file chip are REPLACED by `<falcon-angular-document-uploader>`"; closes FLAG B-CG-2 by exposing the raw `File`).
- Legacy React uploader (`variant='document'`; `[CODE]` falcon-document-uploader.tsx:6 "[SOT] React uploader.jsx variant=document").

## Source file paths

| Layer | Path |
|---|---|
| Angular wrapper TS | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-document-uploader/falcon-document-uploader.component.ts` (216 ln; CVA; signal `input()/output()`; DI defaults) |
| Angular wrapper HTML | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-document-uploader/falcon-document-uploader.component.html` (137 ln; dual render; `-tw` gated by `definedTw()`) |
| Angular wrapper CSS | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-document-uploader/falcon-document-uploader.component.css` (`:host{display:block}` only) |
| Angular barrel | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-document-uploader/index.ts` (exports component only; types re-exported via the image-uploader barrel) |
| Angular-wrapper umbrella barrel | `libs/falcon-ui-core/src/angular-wrapper/index.ts:34` |
| Stencil Shadow source | `libs/falcon-ui-core/src/components/falcon-document-uploader/falcon-document-uploader.tsx` (383 ln, `shadow:true`) |
| Stencil Shadow readme | `libs/falcon-ui-core/src/components/falcon-document-uploader/readme.md` (Stencil auto-generated prop/event/method table) |
| Stencil Light source | `libs/falcon-ui-core/src/components/falcon-document-uploader-tw/falcon-document-uploader-tw.tsx` (371 ln, `shadow:false`) |
| Shared types | `libs/falcon-ui-core/src/components/file-uploader-shared/file-uploader.types.ts` (`FalconFileUploader*`) |
| Shared behavior | `libs/falcon-ui-core/src/components/file-uploader-shared/file-uploader.behavior.ts` (`ingestFiles`/`filterFiles`/`removeFile`/`retryFile`/`retryAllFiles` + `FileUploaderHost`) |
| Shared layout | `libs/falcon-ui-core/src/components/file-uploader-shared/file-uploader.layout.ts` (+ `file-uploader.tw-layout.ts`) |
| Shared render model | `libs/falcon-ui-core/src/components/file-uploader-shared/file-uploader.render.ts` |
| Shared utils / shadow-classes | `…/file-uploader-shared/file-uploader.utils.ts` (`parseExtList`) · `file-uploader.shadow-classes.ts` |
| Shadow CSS (shared) | `libs/falcon-ui-core/src/components/file-uploader-shared/file-uploader.shadow.css` |
| Tailwind helper (shared) | `libs/falcon-ui-core/src/tailwind/file-uploader-tailwind-classes.ts` |
| Component token file (shared) | `libs/falcon-ui-tokens/src/components/file-uploader.tokens.css` (shared with image-uploader; 13 categories; `:where()`-scoped, gate-12 compliant) |
| DI defaults token | `libs/falcon-studio-runtime/src/lib/services/uploader-defaults.token.ts` (`FALCON_UPLOADER_DEFAULTS.document`) + `provide-falcon-uploader.ts` |
| Spec | `apps/management-console/tests/contact-groups/upload-group-details-step.component.spec.ts` (consumer-level) |

> `[CODE]` There is **no `falcon-document-uploader.types.ts`** — types live in `file-uploader-shared/file-uploader.types.ts` and are shared with image-uploader (`[CODE]` document-uploader index.ts:2-4: "Shared FalconFileUploader* types are re-exported from the image-uploader barrel").

## Selectors / tags

| Layer | Tag / selector |
|---|---|
| Angular selector | `falcon-angular-document-uploader` |
| Stencil Shadow tag | `<falcon-document-uploader>` (when `useTailwind=false`) |
| Stencil Light tag | `<falcon-document-uploader-tw>` (default, `useTailwind=true`) |

## Known consumers (grep verified 2026-06-03)

`[CODE]` `<falcon-angular-document-uploader>` renders in production features:
- `apps/management-console/.../contact-groups/create-contact-group/steps/upload-group-details-step/upload-group-details-step.component.html:56` (+ its `.ts` + a `.spec.ts`) — **the flagship**: CSV/Excel import, `[useTailwind]="true"`, `(fileAdd)`→S3 pipeline, `(fileRemove)` clears.
- `apps/admin-console/.../templates-page/components/templates-wizard/steps/step2-message-structure.component.html:289` (+ `.ts`) — template media (video/document branch).
- `apps/management-console/.../templates-page/components/templates-wizard/steps/step2-message-structure.component.html:289` (+ `.ts`) — same, management side.
- `apps/host-shell/.../falcon-ui-showcase/library-section/uploader-section.component.ts:155` — showcase lab.

DI/config references: `apps/host-shell/src/app/app.config.ts:176-178` (seeds defaults), `libs/falcon-studio-runtime` (token + provider), `libs/falcon-studio/.../gallery-defaults.ts` + `demos/file-uploader-demo.component.ts` (Studio demo).

## Related components

- `<falcon-angular-image-uploader>` (B20) — the **1:1 image twin** in the same `file-uploader-shared` family (shared engine/types/tokens; differs only in defaults + variant).
- `<falcon-angular-single-uploader>` — square single-file preview tile (different family, different model/tokens).
- `<falcon-photo-uploader>` (legacy) — circular avatar.

## Ownership / responsibility

`libs/falcon-ui-core` (cross-framework Stencil pair + Angular CVA wrapper) over the `file-uploader-shared` engine. Token contract shared in `libs/falcon-ui-tokens/src/components/file-uploader.tokens.css`. DI defaults in `libs/falcon-studio-runtime`. Owned by the Falcon UI team / uploader squad. Validation = client-side ext+size only; upload driven by the consumer.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B19 sweep). Source set confirmed: wrapper 216 ln (signal-based, DI defaults), Shadow 383 ln, `-tw` 371 ln, shared `file-uploader-shared/*` engine + shared `file-uploader.tokens.css`, readme.md (Stencil-generated). NEW dossier. Production consumers (contact-groups + templates step2, both consoles) grep-confirmed. 1:1 image twin relationship per `[CODE]` tsx:3-6.
