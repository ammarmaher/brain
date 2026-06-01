# Contact Group Step-1 — water-fill upload indicator now shows (2026-05-31) ✅ COMPLETE

**Repo/branch:** C:/Falcon/Falcon/falcon-web-platform-ui · polishing-v0.4 · **NO COMMITS**
**Verify:** `nx build management-console --configuration=development --skip-nx-cache` REAL `BUILD_EXIT_CODE=0`; `npx vitest run tests/contact-groups` **19/19**. Visual = user confirm (Chrome ext not connected).

## Symptom (user)
Uploading a document showed no "water" upload progress indicator.

## Root cause [CODE]
The earlier main-timing change (UPDATE #1) made `nextStep('upload')` advance to the Preview step FIRST, then run the S3 PUT + complete there. The upload therefore ran while the Step-1 `<falcon-angular-document-uploader>` was OFF-SCREEN. The water-fill (`progressMode='water'`) renders ON the uploader chip — never got a chance to animate. The Preview step shows a separate plain teal bar (not water). Config was already correct: `FALCON_UPLOADER_DEFAULTS.document` has `progressMode:'water'` + `showWaves:true` (uploader-defaults.token.ts:157/171).

## Fix (1 file: create-contact-group.component.ts)
- `nextStep('upload')`: run `runUploadAndComplete()` WHILE STAYING on the 'upload' step (uploader visible → water-fill animates with real % via `uploadPhase`/`uploadProgress` → Step-1 `uploaderDisplayFiles` → wrapper CVA `writeValue`). If `preview()` already exists (navigated back), just advance.
- `completeUploadOnce()`: on 'done', `markCompleted('upload')` + advance to 'configure' (guarded `if currentStep()==='upload'`).
- `runUploadAndComplete` comment updated.
- **API timing UNCHANGED**: init on file-select, PUT + complete on the Next click (origin/main-aligned). Only the visual location of progress moved onto the uploader.

## Test
`tests/contact-groups/create-contact-group.component.spec.ts` — added a `Subject`-driven test: after Next, `currentStep` stays 'upload' + phase 'uploading' (water visible); mid-stream still 'upload'; on percent 100 → complete (sync) → phase 'done' → advance to 'configure'. 19/19 pass.

## Bonus
PUT failure now lands on Step 1 (uploader error + retry); Next re-runs the upload (session still valid).

## Notes
- current-task.json was held by a parallel session (org-hierarchy task) — NOT clobbered. Record kept here + in memory topic `project_contact_group_uploader_rewire_falcon_defaults_2026_05_30.md` (UPDATE #3).
- Follows the same-day uploader-render fix (`[useTailwind]` false→true) + the upload main-parity task.
