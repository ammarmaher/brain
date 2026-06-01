---
name: project_settings_edit_error_status_inference_fix_2026_05_30
description: "Settings-tab edit error popup showed \"Validation error (HTTP 400)\" for a real 403 — fixed httpFailure() to preserve the real HTTP status so the dialog title + backend message are correct."
metadata: 
  node_type: memory
  type: project
  originSessionId: ba2d9553-28f9-4a09-975f-fdb01137906b
---

🟢 FIXED + BUILD-GREEN (mgmt+admin `nx ...--configuration=development --skip-nx-cache` EXIT 0, hash `26f697d6454bc3c9`), NOT runtime/browser-verified, NO COMMITS. Branch `night-shift-audit/2026-05-30-0128`.

**Symptom:** Saving any edit in the Org-Hierarchy **Settings** tab popped a dialog titled **"Validation error (HTTP 400) · 1 error"**, while DevTools showed `PUT /commerce/Setting` → **403** `{errorCodes:["UnauthorizedUserToPerformThisAction"], errorMessages:["User Unauthorized To Perform This Action"]}`. User: make it readable + show the backend message.

**Root cause [CODE]:** Settings PUT sets header `notShowToaster:'true'` so the global ResponseInterceptor stays silent and the tab owns its error UX. A 403 *throws* → `SettingsService.updateSettings` `catchError((err)=>of(httpFailure(err)))` → `settings-tab.signals.ts save()` `next` branch (`!res.isSuccessful`) → `errorDialog.openError({ httpStatus: inferStatus(errs), errorMessages: collectErrorMessages(...) })`. `httpFailure()` (in `apps/<console>/src/app/features/org-hierarchy-page/models/models.ts`, **duplicated admin+mgmt**) **discarded `err.status`** and stamped the envelope `code:'network'`. `inferStatus()` (`org-hierarchy-page/services/shared/http-status-inference.ts`) found no `httpStatusCode`, `'network'` isn't in its `CODE_TO_STATUS`, so it **defaulted to 400** → `FalconAngularErrorDialogHostComponent` resolved title key `hierarchy.error.title.400` = "Validation error (HTTP 400)". The backend `errorMessages[0]` was ALREADY surfaced — `extractServerError()` returns `body.errorMessages[0]`, and the Stencil `falcon-alert-dialog-tw` renders `<slot>` in a body `<div class="py-2">`, so the message bullet renders. **Only the status/title was wrong.**

**Fix:** `httpFailure()` now reads the real status off the thrown `HttpErrorResponse` and carries it as `envelope.httpStatusCode` — the EXACT shape `inferStatus()` already reads (`first.httpStatusCode`/`HttpStatusCode`). `status 0`/absent (true network failure) is omitted so `inferStatus`'s code-fallback is unchanged. Applied byte-identically to both consoles. Now: 403→"Permission denied (HTTP 403)", 422→"Business rule rejected (HTTP 422)", 409→"Conflict (HTTP 409)", 500→"Server error (HTTP 500)", each with the verbatim backend message. Fixes ALL 4 `inferStatus()` call sites (settings-tab + falcon-org-info-panel save paths, both consoles) — previously every thrown 4xx/5xx mislabelled as "(HTTP 400)".

**Brain grounding (used FIRST, per protocol):** [BRAIN-OUT] `13-error-catalog/FE-CONTRACT.md` Rule 1 (HTTP status = primary routing signal) + Rule 2 (display `errorMessages[0]` verbatim — already localized); [BRAIN-OUT] `13-error-catalog/CATALOG.md` §1.3 (`UnauthorizedUserToPerformThisAction`=403); [CODE] `libs/falcon/src/language/i18n/en.json:1492-1503` (`hierarchy.error.title.*` map + `network`/`unknown` keys).

**Key architecture facts (for future error-UX work):**
- TWO error surfaces coexist: (1) global `ResponseInterceptor` → `FalconHttpUiDispatcherService` → orchestrator toast/popup via `FALCON_HTTP_UI_CONFIG` `errorRules` (`apps/host-shell/.../http-ui/falcon-http-ui.config.ts`; `applicationError.title:'Validation error'` with NO "(HTTP n)" suffix). (2) feature-owned `ErrorDialogService.openError({httpStatus, errorMessages})` → `FalconAngularErrorDialogHostComponent` (title = `hierarchy.error.title.<status>` → adds "(HTTP n)"; subtitle = count "1 error"; body `<ul>` = the messages). The "(HTTP n)" suffix in a title ⇒ it's surface #2, not the orchestrator.
- `notShowToaster:'true'` header = legacy escape hatch: interceptor stays silent so the feature handles the error itself.
- `TranslateService.translate(key)` returns the **key unchanged** when not found (translate.service.ts:220), so a raw English backend message passes through verbatim (no dots → treated as one missing key).

Related: [[project_account_mgmt_bug_fixes_2026_05_29]] · [[reference_local_mongo_access_and_listnodeusers_2026_05_30]].
