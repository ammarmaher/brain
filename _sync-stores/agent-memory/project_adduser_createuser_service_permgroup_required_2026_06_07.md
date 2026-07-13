---
name: project_adduser_createuser_service_permgroup_required_2026_06_07
description: "Add User \"permGroup optional\" had a 4th hidden required-gate in user.service.ts createUser() that threw {code:required} before the API — removed in both consoles."
metadata: 
  node_type: memory
  type: project
  originSessionId: ea15bad5-bbf4-4fff-8f67-897e3f8f916a
---

**Add User wizard — "Permission Group optional" RUNTIME BUG fixed: a MISSED 4th validation layer** (2026-06-07, claude, FE-only, NO commits, branch polishing-v0.4). User: "I made Assigned Permission Group optional, but on create user → send credentials it errors `required` BEFORE calling the API."

**Symptom (console):** `[hierarchy] create user failed: [{code:"required", message:"hierarchy.validation.required"}]`.

**Root cause:** the 2026-06-06 3-layer optional fix ([[project_adduser_step3_permgroup_optional_2026_06_06]]) MISSED a **4th gate** — the service-level *defensive re-validation* inside `createUser()` of BOTH consoles' `…/add-user-wizard/services/user.service.ts` still ran `...validateValue(payload.permGroup, permissionGroupValidator)` (admin line 88 / mgmt line 92). `permissionGroupValidator = r.permissionGroup()` → `{required:true}` on empty → `validateValue`→`toServiceErrors`→`VALIDATOR_KEYS.required` (`KEY='hierarchy.validation'`) → `{code:'required', message:'hierarchy.validation.required'}`. `createUser` collects these and `if (errors.length) return of(failure(errors))` short-circuits **before** `http.post('identity/user')` (admin :102 / mgmt :106) — hence "before the API". `add-user-state.signals.ts` `createUserSubmit$` sees `!isSuccessful` → logs `[hierarchy] create user failed:` + rethrows → error toast. The "send credentials" popup = shared `<falcon-angular-wizard-finalization>`; its send → `wizardFinalizationSubmitFn` → `createUserSubmit$` → `api.createUser`.

The validator was **dead-weight anyway**: `buildCreateUserWireRequest` hardcodes `permissionGroupId:''` (mgmt models.ts:239 / admin :255) — permGroup is never sent to the backend.

**FIX:** removed the `...validateValue(payload.permGroup, permissionGroupValidator)` line + the now-unused `permissionGroupValidator` import from `createUser()` in BOTH `apps/{admin,management}-console/.../add-user-wizard/services/user.service.ts` (line replaced with a "restore to re-impose" comment). 4 edits / 2 files. Verified: `nx build` both consoles EXIT 0 (mgmt `a8d1aed0f5eb76e9`, admin `6946b3ed0b4bf39a`). No unit spec covers this path; live login verify gated by credential policy.

**Why:** the prior memory listed only 3 permGroup gates (the `USER_PERMISSIONS_VALIDATIONS` rule table, `isFormValid`, the `[required]` template flag) — there are actually **FOUR**; the 4th lives in the service `createUser()` pre-flight error block, which the prior fix never touched (different file set).

**How to apply:** any "make field X optional/required" change in the Add User wizard MUST also audit `user.service.ts` `createUser()`'s defensive `validateValue(...)` block — it re-validates firstName/lastName/username/email/phone/role/permGroup/nodeId/password independently of the per-step wizard validation and returns `failure()` before the POST. Same pattern likely exists for other wizards' service layers. Related [[project_adduser_step3_permgroup_optional_2026_06_06]] · [[reference_fe_structure_standard_angular21_2026_06_02]] · [[reference_static_remote_rebuild_after_app_edit_2026_06_04]].
