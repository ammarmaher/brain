# Task — Settings edit error popup: real backend message + correct HTTP status

- **Date:** 2026-05-30
- **Status:** ✅ COMPLETED + build-green (NOT runtime-verified) · NO COMMITS
- **Repo / branch:** `C:/Falcon/Falcon/falcon-web-platform-ui` · `night-shift-audit/2026-05-30-0128`
- **Note:** Saved to task-history directly because the shared `current-task.json` is contended by ≥1 other live Claude session (it was reclaimed mid-task). This file is the durable record.

## User ask
"On making any edit inside the settings, it gives me this error [popup: *Validation error (HTTP 400) · 1 error*]. Make the error shown in a more readable way, and make sure it shows the message that comes from the backend. Use the brain skills."

DevTools evidence: `PUT http://localhost:7038/commerce/Setting` → **403 Forbidden**, body `{ isSuccessful:false, errorCodes:["UnauthorizedUserToPerformThisAction"], errorMessages:["User Unauthorized To Perform This Action"] }`.

## Brain skills used (FIRST, per protocol)
- [BRAIN-OUT] `0-MASTER-INDEX.md` routing → error questions own by `13-error-catalog`.
- [BRAIN-OUT] `13-error-catalog/FE-CONTRACT.md` — Rule 1 (HTTP status = primary routing signal), Rule 2 (display `errorMessages[0]` verbatim, already localized).
- [BRAIN-OUT] `13-error-catalog/CATALOG.md` §1.3 — `UnauthorizedUserToPerformThisAction` = 403.

## Root cause [CODE]
Settings PUT carries `notShowToaster:'true'` (the tab owns its error UX; global `ResponseInterceptor` stays silent). The 403 *throws* → `SettingsService.updateSettings` `catchError((err)=>of(httpFailure(err)))` → `settings-tab.signals.ts save()` `next` branch → `errorDialog.openError({ httpStatus: inferStatus(errs), errorMessages: collectErrorMessages(...) })`.

`httpFailure()` (`apps/<console>/src/app/features/org-hierarchy-page/models/models.ts`, duplicated admin+mgmt) **discarded `err.status`** and stamped `code:'network'`. `inferStatus()` found no `httpStatusCode`, `'network'` ∉ `CODE_TO_STATUS` → **defaulted to 400** → dialog title `hierarchy.error.title.400` = "Validation error (HTTP 400)". The backend `errorMessages[0]` was already correct (`extractServerError()` returns `body.errorMessages[0]`; Stencil `falcon-alert-dialog-tw` renders `<slot>` in the body). **Only status/title was wrong.**

## Fix (2 files)
`httpFailure()` now reads the real status off the thrown `HttpErrorResponse` and carries it as `envelope.httpStatusCode` — exactly the shape `inferStatus()` already reads. `status 0`/absent (true network failure) omitted → code-fallback unchanged. Identical edit in:
- `apps/management-console/src/app/features/org-hierarchy-page/models/models.ts`
- `apps/admin-console/src/app/features/org-hierarchy-page/models/models.ts`

Now: 403 → "Permission denied (HTTP 403)" + "User Unauthorized To Perform This Action"; 422 → "Business rule rejected (HTTP 422)"; 409 → "Conflict (HTTP 409)"; 500 → "Server error (HTTP 500)" — each with the verbatim backend message. Fixes all 4 `inferStatus()` call sites (settings-tab + falcon-org-info-panel save, both consoles).

## Verification
`nx run-many --target=build --projects=management-console,admin-console --configuration=development --skip-nx-cache` → **EXIT 0**, hash `26f697d6454bc3c9`. Only pre-existing unused-file TS warnings. **NOT runtime-verified** (live 403 needs Docker backend + acc-admin/acc-user login).

## Memory
`project_settings_edit_error_status_inference_fix_2026_05_30.md` + MEMORY.md index line.
