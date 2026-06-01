# Contact-Group Step-1 Uploader — Best-Practice Re-wire to FALCON_UPLOADER_DEFAULTS

**Date:** 2026-05-30 · **Branch:** polishing-v0.4 · **Status:** ✅ DONE + BUILD-GREEN (mgmt dev, hash `abb4f841bc86be7f`, 0 errors/warnings) · **NO COMMITS** · NOT browser-verified (value-identical by construction).

## User ask (clarified)
"On create **contact** [group], replace what we implemented with the document uploader we have, link it best-practice, keep the expected call working, don't break business rules." Original said "contract" → user corrected to **contact**. Via AskUserQuestion the user chose **"Best-practice re-wire"** (not a behavior change, not a different surface, not a runtime-defect hunt).

## Key finding before coding
The mgmt `create-contact-group` Step 1 ALREADY used `<falcon-angular-document-uploader>` (bespoke dropzone swapped out 2026-05-29) and ALREADY fired the expected calls — `POST contactgroup/contact-groups/uploads/init` → presigned `PUT` to S3 → `POST .../{id}/complete` (on "Next") + `POST contact-groups` (on Review). So the request was NOT "add an uploader/call" — it was a config-hygiene re-wire. (Ruled out: contracts-cost-management create [no doc concept anywhere — SoT/PRD/backend all confirm], admin contact-groups [no create flow], detail-page import [none].)

## Change (2 files, mgmt only — `apps/management-console/.../create-contact-group/steps/upload-group-details-step/`)
- `.ts`: injected `FALCON_UPLOADER_DEFAULTS.document` (from `@falcon/studio/runtime`). `acceptAttr` / `maxSizeMB` / `typesHint` fallbacks now read that single source instead of duplicated magic values (`'xlsx,xls,csv,pdf,docx'`, `10`, `['.csv','.xlsx','.xls']`). Fixed a latent inconsistency: accept fallback was 5 types but helper-text was 3 — now both derive from the same canonical accept list.
- `.html`: dropped redundant `progressMode="water"` (shared `document` default is identically `water`). Updated the wiring comment.

## Deliberately preserved (business rules + behavior intact)
- Upload pipeline + `CreateContactGroupRequest` payload: UNCHANGED.
- `[multiple]="false"`: KEPT as explicit single-file INVARIANT (S3 pipeline is one-file; must not inherit a mutable app-wide default).
- `[useTailwind]="false"` (shadow-DOM render path): KEPT (flipping = visual risk).
- All i18n copy + error templates (en+ar) + backend-driven `accept`/`maxSize` + `(fileAdd)`/`(fileRemove)`: KEPT.
- Normal (config-loaded) path resolves byte-identical values; only delta is the pre-config-load transient helper-text (now 5 types matching accept = strictly more correct).

## Why this is "best practice"
mgmt registers `...provideFalconUploader()` (app.config.ts:78) → wrapper DI-seeds `document` defaults. Component now reads ONE canonical source for structural/cosmetic config + fallbacks; binds only instance-specific (i18n / backend-dynamic / hard-invariant / render-path). i18n + backend accept/maxSize CANNOT move to static defaults — that's why those bindings legitimately remain.

## Verification
- `npx nx build management-console --configuration=development --skip-nx-cache` → exit 0, clean.
- No spec asserts the removed/changed bindings (grep clean).
- Concurrency: `current-task.json` was held by a sibling session (wallet-button-polish) — NOT clobbered; this record is the durable trail.

## Next (optional)
Browser-verify on the live mgmt MF stack (host-shell + mgmt remote, acc-owner) the create-contact-group upload step renders + upload fires. Standalone mgmt serve blocked by pre-existing NG0201 — use full stack or QA-web.
