# falcon-image-uploader — OVERVIEW

## Component purpose

Avatar / profile-picture uploader. A horizontal **card-row** control: a circular (or shaped) image well on the left + label / sub-label + drag-hint + "Upload Photo" button on the right, with a water/bar/laser progress overlay, status banner, status badge, and an optional multi-file stack. It is the **dual-render Stencil** member of the shared file-uploader family (Shadow DOM `<falcon-image-uploader>` + Light DOM `<falcon-image-uploader-tw>` + Angular CVA wrapper `<falcon-angular-image-uploader>`). `[CODE]` falcon-image-uploader.tsx:1-7 — port of the React `Source_of_truth_theme/React/Uploader` avatar-row pattern, `variant=image`.

## Business / UI use case

- **Client picture** capture on Add Client → Step "Client Information" (`[CODE]` client-information-step.component.html:13-26).
- **User avatar** capture on Add User → Step "Personal" (`[CODE]` user-personal-step.component.html).
- **Account / node logo** edit in the org-hierarchy **Information panel** of both consoles (`[CODE]` falcon-org-info-panel.component.html).
- **Template media** picker on the Templates wizard Step 2 (Message Structure) of both consoles (`[CODE]` step2-message-structure.component.html:3).
- Avatar-row capture anywhere a single circular image with replace UX is needed.

## When to use it / when NOT to use it

**Use it for:**
- Single circular avatar / profile-photo / logo capture (`multiple=false`, `shape='circle'`).
- A consumer-driven upload where the app reads the raw `File` from `fileAdd.nativeFile` and drives the real upload pipeline + per-file `status`/`progress` via the CVA value (or the Stencil `setFiles()` method).
- Image-only validation (extension + size) at the boundary; the component validates `accept` (default `png,jpg,jpeg`) + `maxSizeMB` (default `2`) client-side and emits `fileError` on rejection.

**Do NOT use it for:**
- Document attachments (PDF / docx / multi-format files) → use `<falcon-angular-document-uploader>` (the twin concrete component sharing the same `file-uploader-shared` contract; only DEFAULTS differ).
- A square single-file tile with edit/replace/delete overlays → use `<falcon-angular-single-uploader>`.
- Any field that needs server-driven validation messages baked in — this component only does ext+size; richer rules stay in the consumer (`errorMessage` input).

## Status

**ACTIVE / PREFERRED** for avatar / profile-photo capture in admin-console / management-console. `[CODE]` client-information-step.component.html:2-12 — **migrated in Wave 2 (2026-05-31)** from the legacy bespoke `<falcon-photo-uploader>` to this React-SoT card-row component. Token-driven, gate-12 compliant. Mandatory for new image-capture fields.

## Replaces

- **Legacy `<falcon-photo-uploader>`** — the bespoke circular-avatar Angular component formerly at `libs/falcon/src/shared-ui/lib/components/falcon-photo-uploader/` (`[CODE]` confirmed **deleted from disk** 2026-06-03 — `Test-Path` false). This dossier **SUPERSEDES** `understanding/frontend/components/falcon-photo-uploader/` (now describing a removed component → flagged for B23 cleanup).
- **Legacy `<falcon-uploader>` / `<falcon-uploader-tw>`** — the old Stencil multi-file uploader, also **deleted from disk** 2026-06-03 (`falcon-ui-core/src/components/falcon-uploader` + `-tw` `Test-Path` false). The `understanding/frontend/components/falcon-uploader/` dossier is now stale → flagged for B23. The modern file-uploader family is `falcon-image-uploader` + `falcon-document-uploader`.

## Source file paths

| Layer | Path |
|---|---|
| Angular wrapper TS | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-image-uploader/falcon-image-uploader.component.ts` (220 ln) |
| Angular wrapper HTML | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-image-uploader/falcon-image-uploader.component.html` (136 ln; both render paths fully bound) |
| Angular wrapper CSS | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-image-uploader/falcon-image-uploader.component.css` (`:host { display: block; }` only — pass-through) |
| Angular barrel | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-image-uploader/index.ts` (re-exports component + 16 shared types) |
| Stencil Shadow source | `libs/falcon-ui-core/src/components/falcon-image-uploader/falcon-image-uploader.tsx` (385 ln) |
| Stencil Light source | `libs/falcon-ui-core/src/components/falcon-image-uploader-tw/falcon-image-uploader-tw.tsx` (372 ln) |
| Stencil Shadow CSS | `libs/falcon-ui-core/src/components/file-uploader-shared/file-uploader.shadow.css` (**SHARED** with document-uploader; ~28 KB) |
| Shared types | `libs/falcon-ui-core/src/components/file-uploader-shared/file-uploader.types.ts` (84 ln — `FalconFileUploader*`) |
| Shared behavior | `libs/falcon-ui-core/src/components/file-uploader-shared/file-uploader.behavior.ts` (ingest / filter / remove / retry) |
| Shared render module | `libs/falcon-ui-core/src/components/file-uploader-shared/file-uploader.render.tsx` (~18 KB — `FileUploaderRenderModel`, hyperscript-injected) |
| Shared layout (shadow) | `libs/falcon-ui-core/src/components/file-uploader-shared/file-uploader.layout.tsx` |
| Shared layout (tw) | `libs/falcon-ui-core/src/components/file-uploader-shared/file-uploader.tw-layout.tsx` |
| Shared icons | `libs/falcon-ui-core/src/components/file-uploader-shared/file-uploader.icons.tsx` |
| Shared utils | `libs/falcon-ui-core/src/components/file-uploader-shared/file-uploader.utils.ts` (`parseExtList`) |
| Shadow class helper | `libs/falcon-ui-core/src/components/file-uploader-shared/file-uploader.shadow-classes.ts` |
| Tailwind helper | `libs/falcon-ui-core/src/tailwind/file-uploader-tailwind-classes.ts` (~31 KB — `fuTw*` + `makeTwClassOf`) |
| Component token file | `libs/falcon-ui-tokens/src/components/file-uploader.tokens.css` (~22 KB; **SHARED** image + document; `:where()` scoped — gate-12 OK) |
| React wrapper (generated) | `libs/falcon-ui-react/src/components.ts` (`FalconImageUploader` + `FalconImageUploaderTw`, Stencil React Output Target) `[CODE]` lines 56-57 / 872+ |
| Stencil unit/e2e spec | _None found for image-uploader_ — see GAPS G-test. |

## Selectors / tags

| Layer | Tag / selector |
|---|---|
| Angular selector | `falcon-angular-image-uploader` `[CODE]` falcon-image-uploader.component.ts:38 |
| Stencil Shadow tag | `<falcon-image-uploader>` (`shadow: true`) `[CODE]` falcon-image-uploader.tsx:56-58 |
| Stencil Light tag | `<falcon-image-uploader-tw>` (`shadow: false`) `[CODE]` falcon-image-uploader-tw.tsx:56-57 |

## Known consumers (grep verified 2026-06-03)

`[CODE]` `<falcon-angular-image-uploader>` across `apps/` = **18 occurrences across 8 HTML files** (and 6 TS feature-component co-files importing the wrapper). No usages under `libs/falcon/`. Enumerated:

- `apps/admin-console/.../org-hierarchy-page/components/wizard-components/add-client-wizard/client-information-step/client-information-step.component.html` (2 — client picture).
- `apps/admin-console/.../org-hierarchy-page/components/wizard-components/add-client-wizard/client-account-owner-step/client-account-owner-step.component.html` (2 — owner photo).
- `apps/{admin,management}-console/.../org-hierarchy-page/components/wizard-components/add-user-wizard/user-personal-step/user-personal-step.component.html` (2 each — user avatar).
- `apps/{admin,management}-console/.../org-hierarchy-page/components/tab-components/hierarchy-tab/falcon-org-info-panel/falcon-org-info-panel.component.html` (2 each — Information-panel logo).
- `apps/{admin,management}-console/.../templates-page/components/templates-wizard/steps/step2-message-structure.component.html` (3 each — template media).
- `apps/host-shell/.../falcon-ui-showcase/library-section/uploader-section.component.ts` (6 — showcase demo) + registered in `falcon-ui-showcase.component.ts` + `app.config.ts` + `tailwind.css` `@source`.

See `USAGE.md` Consumer Sweep for the full enumerated list.

## Related components

- **Twin concrete component:** `<falcon-angular-document-uploader>` — same `file-uploader-shared` render/behavior/types/tokens; only DEFAULTS differ (`accept`, `maxSizeMB`, `shape`, icon, labels). `[CODE]` file-uploader.types.ts:1-7.
- **Siblings (file family):** `<falcon-angular-single-uploader>` (square single-file tile, separate token file).
- **Composed with (in consumers):** `<falcon-angular-input>` (the name fields next to the avatar in wizard steps).

## Ownership / responsibility

`libs/falcon-ui-core` (cross-framework). Owned by Falcon UI team. The component is **presentational + client-side ext/size validation only** — the consumer drives `status`/`progress`/`url` and the real upload (NO mock upload; `[CODE]` file-uploader.types.ts:6). Token contract lives in `libs/falcon-ui-tokens/src/components/file-uploader.tokens.css` (shared with document-uploader).

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B20 sweep, NEW dossier). Source-file table read on disk across all layers; consumer list grep-verified (18 occ / 8 HTML files + 6 TS co-files). Supersession of legacy `falcon-photo-uploader` + `falcon-uploader` confirmed by `Test-Path` (both deleted from disk) — old dossiers flagged for B23. READ-ONLY pass: no source touched.
