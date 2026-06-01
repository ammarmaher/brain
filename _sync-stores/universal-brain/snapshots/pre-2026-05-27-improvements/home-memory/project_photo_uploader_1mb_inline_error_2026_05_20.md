---
name: project_photo_uploader_1mb_inline_error_2026_05_20
description: Photo uploader cap dropped 2 MiB → 1 MiB; inline red-border error replaces silent reject; closes PRD Q-UM-05 / BR-UM-48.
metadata: 
  node_type: memory
  type: project
  originSessionId: 2b45e768-6cf3-4f12-bf85-427107609937
---

🟢 BUILD-GREEN 2026-05-20. `<falcon-photo-uploader>` (legacy shared-ui) now caps at **1 MiB (1,048,576 bytes)** by default and surfaces oversize rejection **inside the uploader card** (no toast).

**Why:** the previous behaviour silently dropped any file larger than 2 MiB — flagged P0 gap in [BRAIN-OUT] `Brain Outputs\understanding\frontend\components\falcon-photo-uploader\GAPS_AND_UPGRADES.md:13`. PRD was silent on the cap ([BRAIN-OUT] `prd\modules\02-user-management\QUESTIONS.md` Q-UM-05); we locked it at 1 MiB and closed Q-UM-05 / BR-UM-48 in the same task.

**How to apply (the "tricky" UX pattern):**
- Container chrome flips to red dashed border via a 4th branch in `containerClasses` computed: `viewMode → oversizeError → dragOver → idle`. New constant `CONTAINER_EDIT_ERROR = 'px-5 py-[18px] bg-falcon-red-50 border border-dashed border-falcon-red-500'` — declared at module scope so Tailwind's content scanner sees it (same idiom as `CONTAINER_EDIT_IDLE`).
- Right-side flex slot does `@if (oversizeError()) { red warning span } @else { drag hint }` — same row, no layout shift.
- Error span is `role="alert" aria-live="polite"` for AT users.
- `consume()` branches: oversize → `flagOversize()` (set signal + arm 6 s `setTimeout`) → `return;` (no `fileSelected` / `pictureChange` emitted → host form-state stays clean). Valid → `clearOversize()` first.
- Three explicit clear paths: valid pick, `onPickClicked()`, `onClearClicked()`. Plus the 6 s fallback timer.
- Re-flagging cancels in-flight timer so the second oversize file gets the full 6 s window.
- Translation uses `{maxMb}` placeholder: `{{ oversizeMessageKey() | translate: { maxMb: maxMb() } }}` where `maxMb` is `computed(() => Math.max(1, Math.round(maxBytes() / (1024 * 1024))))`. Lets the message stay synced if a consumer ever overrides `maxBytes` again.
- Consumer cleanup: dropped the two `[maxBytes]="2097152"` overrides from the Add-User wizards (admin-console + management-console) so the component default rules everywhere. The 3 other consumers (Add-Client owner step + 2 org-info-panels) already inherited the default.
- Both Add-User wizards add `oversizeMessageKey="hierarchy.addUser.photoTooLarge"` (its own namespace mirror).

**i18n changes ([CODE] both `libs/falcon/src/language/i18n/en.json` and `ar.json`):**
- `photoHint` "PNG, JPG up to 2MB" → "PNG, JPG up to 1MB" in both `hierarchy.addClient` and `hierarchy.addUser` (Arabic mirror).
- New key `photoTooLarge` "File too large. Maximum size is {maxMb} MB." in both namespaces + Arabic.

**Files touched (10):**
1. `Falcon\falcon-web-platform-ui\libs\falcon\src\shared-ui\lib\components\falcon-photo-uploader\falcon-photo-uploader.component.ts` (default + signal + computed + container branch + consume rewrite + 2 helpers).
2. `…\falcon-photo-uploader.component.html` (drag-hint slot wrapped in `@if/@else`).
3. `Falcon\falcon-web-platform-ui\libs\falcon\src\language\i18n\en.json` (4 edits across `addClient` + `addUser`).
4. `Falcon\falcon-web-platform-ui\libs\falcon\src\language\i18n\ar.json` (4 edits mirror).
5. `apps\admin-console\…\add-user-wizard\user-personal-step.component.html` (drop maxBytes override + add oversizeMessageKey).
6. `apps\management-console\…\add-user-wizard\user-personal-step.component.html` (same).
7. `Brain Outputs\understanding\frontend\components\falcon-photo-uploader\GAPS_AND_UPGRADES.md` (gap #3 closed).
8. `Brain Outputs\understanding\frontend\components\falcon-photo-uploader\API.md` (default + new input + internal state + constraints).
9. `Brain Outputs\prd\modules\02-user-management\QUESTIONS.md` (Q-UM-05 closed).
10. `Brain Outputs\prd\modules\02-user-management\BUSINESS_RULES.md` + `GAPS.md` (BR-UM-48 closed, GAP-UM-05 updated).

**Verification — both builds GREEN on `npx nx build --skip-nx-cache`:**
- admin-console: hash `73c9639f865a8651`, 21.7 s.
- management-console: hash `2729e4e70067362c`, 16.3 s.
- Runtime test pending (vitest runner broken per [[project_admin_console_vitest_runner_broken_2026_05_19]]; manual recipe: drop a 1.5 MB JPG into Add Client owner step → red border + inline message → drop a 200 KB JPG → error vanishes).

**Related:** [[project_falcon_photo_uploader_tailwind_2026_05_17]] · [[project_add_client_photo_wire_field_mismatch_2026_05_18]] · [[project_dropdown_search_uploader_cancel_fixes_2026_05_18]] · [[project_component_validation_convention_2026_05_16]].
