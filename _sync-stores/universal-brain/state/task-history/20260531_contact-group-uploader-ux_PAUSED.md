# PAUSED — contact-group uploader UX polish (2026-05-31)

**Status:** ✅ RESUMED + DONE 2026-05-31 (user confirmed the deletion session closed). All parts implemented + build-verified: (A)+(C) fill-on-select to 100% retained, (D) skeleton-on-Next, (B) wavy MOVING water (separate translateY surface-tracker for the wave crests + the comma-free `fuWave` flow animation; motion confirmed in compiled `dist/apps/management-console/styles.css`). Cleared the deletion session's stale `tailwind-classes.js`/`.d.ts` dead re-export to unblock vitest. falcon-ui-core + mgmt + admin + host-shell builds REAL exit 0; vitest 19/19. **NO commits.** Visual confirmation pending (user). Full detail → memory topic `project_contact_group_uploader_rewire_falcon_defaults_2026_05_30.md` UPDATE #5.

---
(Original paused state below, for history.)

**Repo/branch:** C:/Falcon/Falcon/falcon-web-platform-ui · polishing-v0.4

## Why paused (user directive 2026-05-31)
A parallel session (`delete-falcon-uploader-and-photo-uploader`) is actively editing `falcon-ui-core` and left it inconsistent — stale compiled `libs/falcon-ui-core/src/tailwind/tailwind-classes.js:33` still `export *`s the DELETED `./uploader-tailwind-classes` → vite resolve error breaks ALL mgmt builds/tests. User: do NOT unblock/rebuild falcon-ui-core from this session while the deletion session is active; no two sessions editing the same uploader/core files. **🔒 Migration final-state lock:** `C:\Falcon\plans\photo-uploader-migration\FINAL-STATE-LOCK.md`.

## DONE (management-console, on disk, unverified)
- (A)+(C) `upload-group-details-step.component.ts` — `uploaderDisplayFiles` idle/init (descriptor present) → `{status:'queued', progress:100}` = uploader water fills to 100% on file-SELECT + retained.
- (D) NEW `steps/upload-group-details-step/upload-step-skeleton.component.ts` (flat Tailwind + animate-pulse). Orchestrator `create-contact-group.component.ts`: `uploadingViaNext` signal + `nextStep('upload')` sets it true & runs PUT+complete; `completeUploadOnce`/`failUpload`/`resetUploadState` clear it. Template `@case('upload')` → `@if(uploadingViaNext()){<app-upload-step-skeleton [loading]="true">}@else{step}`.
- 3 specs updated (init/idle → progress 100; orchestrator stream test asserts `uploadingViaNext`).

## NOT started — (B) wavy water (Stencil, falcon-ui-core)
Designed fix in memory topic `project_contact_group_uploader_rewire_falcon_defaults_2026_05_30.md` UPDATE #4. Touch `file-uploader.tw-layout.tsx` (translateY water body so wave crests ride the surface + inline LONGHAND `fuWave` animation), `file-uploader-tailwind-classes.ts` (drop dropped `animate-[fuWave]`), `file-uploader.shadow.css` (parity). Blast radius: image + document uploaders (both default progressMode='water'). DO ONLY after the deletion session is done (no concurrent falcon-ui-core edits).

## RESUME (when user says lib is consistent + builds green)
1. `cd /c/Falcon/Falcon/falcon-web-platform-ui && npx nx build management-console --configuration=development --skip-nx-cache` → EXIT 0 (read real BUILD_EXIT_CODE, echo masks it).
2. `cd apps/management-console && npx vitest run tests/contact-groups` → A/C/D specs pass.
3. Implement (B); rebuild falcon-ui-core (Stencil) + admin + mgmt + host-shell; user visually verifies water wave + fill.
4. Full zero-ref grep for old uploader refs (per the lock). NO commit/push until user approves.

## Note
current-task.json is held by the parallel deletion session — NOT clobbered. This paused-task record + the memory topic UPDATE #4 + the FINAL-STATE-LOCK are the durable handoff.
