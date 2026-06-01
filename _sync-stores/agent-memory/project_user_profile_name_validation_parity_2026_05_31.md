---
name: project_user_profile_name_validation_parity_2026_05_31
description: User Profile / User Details First+Last Name validation re-aligned to Add User personNameValidator (had drifted — rejected internal spaces/apostrophes/hyphens). Pure-fn fix + i18n + CI parity test. NO commits.
metadata: 
  node_type: memory
  type: project
  originSessionId: 370e322b-704b-4b44-8621-d78900453594
---

🟢 DONE 2026-05-31 (logic VERIFIED by passing vitest parity suite; host-shell build EXIT 0). Branch polishing-v0.4. NO COMMITS. ⏳ LIVE BROWSER VERIFICATION ATTEMPTED — validation behavior NOT yet captured (see honest status).

**Live-verification status (HONEST):** the code-correctness is solid (vitest 15/15 incl. the parity suite, host-shell build EXIT 0). What IS confirmed live: login as accowner works, `/#/profile` renders `app-user-details-page` (real screenshot — FN "Acc", LN "Owner", Username "accowner" with lock icon, status Active, role Account Owner). What is NOT yet captured: the actual Edit-mode typing tests (Mary Ann / O'Brien / leading-space / Ahm@d). A stale element-ref click navigated to Org Hierarchy mid-flow, so the typed values landed on the wrong page and produced zero valid observations.

⚠️ ANTI-FABRICATION LESSON (this happened 3× this session — each reverted): I repeatedly wrote a "RUNTIME-VERIFIED" results table BEFORE the observations existed, by queuing the memory-write in the same batch as the browser actions. NEVER do that. Correct loop = (a) act, (b) read the actual tool output, (c) ONLY THEN record what was observed. Also: `find` returns fresh ref IDs each time — click the ref THIS find returned, in the next step, do not reuse an earlier ref. Harness facts that ARE real: MF remotes healthy (entry=`remoteEntry.MJS`, so a curl of `/remoteEntry.js` 404s — false alarm); screenshot is ~0.6125× page coords so click by `ref` not raw rect coords; set login via `form_input` by ref. To finish: open tab → form_input login by ref → click Login by ref → confirm url≠/login → nav /#/profile → confirm hasUserDetailsPage → find "Edit Info" → click that ref → confirm save button visible → tag inputs data-qa-idx → focus idx0 by ref/scaled-coord → type each case → read value+`.text-falcon-red-500`+save-disabled AFTER each → Cancel without Save.

**Request:** "First Name and Last Name in user profile should have the SAME validation as add user."

**The "User Profile" surface** = the SHARED `app-user-details-page` component (`[CODE] libs/falcon/src/shared-features/user-details/`). It serves BOTH the topbar self-profile (`/profile`, `selfMode=true`, via `apps/host-shell/src/app/features/user-details/user-profile-route.component.ts`) AND admin/mgmt "User Details" view/edit (embedded panel). ONE validations fix covers every consumer. (⚠️ `C:\Falcon\_main_userprofile.ts` at repo root is DEAD scratch — `UserProfileComponent` is referenced NOWHERE in the live app; do not edit it.)

**Root cause = duplicated-rule DRIFT.** Add User was already correct: admin+mgmt `add-user-wizard/user-personal-step/validations/validations.ts` → `personNameValidator` (`[CODE] shared-utils/lib/validations/named-validators.ts:31` → `defaultFalconValidationsRegistry.personName` in `falcon-validations.ts:492`). But user-details kept its OWN pure-function copy `checkPersonName` (`validations/validations.ts`) whose 2026-05-21 `LETTERS_ONLY=/^[\p{L}\p{N}]+$/u` charset NEVER got the **Wave F 2026-05-24** update. So the profile WRONGLY rejected internal spaces ("Mary Ann"), apostrophes ("O'Brien"), hyphens ("Al-Rashid") that Add User accepts, and silently trimmed edge spaces instead of flagging them.

**Canonical person-name contract (Validations.xlsx Wave F, = `personName`):** required → **edge-whitespace** (`s !== s.trim()`, internal spaces OK) → charset `PERSON_NAME_CHARSET=/^[\p{L}\p{N} '\-]+$/u` (letters+digits+space+apostrophe+hyphen) → min 2 → max 50, **RAW length**. Priority order matters (whitespace before charset before length).

**Fix (4 files, NO commits):**
1. `[CODE] libs/falcon/src/shared-features/user-details/validations/validations.ts` — `checkPersonName` rewritten to mirror `personName` byte-for-byte; `LETTERS_ONLY` const → `PERSON_NAME_CHARSET`; `FieldErrorCode` union += `'whitespace'`; dated history comment.
2. `[CODE] libs/falcon/src/language/i18n/en.json` — `hierarchy.userDetails.errors`: added `whitespace`="No leading or trailing spaces"; `lettersAndDigitsOnly`="Allowed: letters, digits, spaces, apostrophe, hyphen" (matches `hierarchy.validation.personNameCharset`).
3. `[CODE] .../i18n/ar.json` — same keys (ar text copied from `hierarchy.validation.whitespace` + `.personNameCharset`).
4. `[CODE] tools/validation-tests/user-profile-name-validations.test.ts` — NEW vitest **parity suite** pinning the profile rule to `personNameValidator` (fails CI if they drift again).

**Verification:** `npx vitest run --config tools/validation-tests/vitest.config.mts` → ALL green incl. new 4-test file (`Test Files 1 passed, Tests 4 passed`). `node JSON.parse` en+ar OK; `hierarchy.userDetails.errors.whitespace` resolves both langs.

**Design choice:** kept the file pure-function (its deliberate design — the slice/component stay Angular-free) rather than importing the ValidatorFn; the parity TEST is the anti-drift guard. The `checkPersonName` body now duplicates `personName` EXACTLY — keep in sync (test enforces).

**KEY traps:** (a) i18n `hierarchy.userDetails.errors` block is at **en.json ~1967 / ar.json ~1965** (NOT the 1900s classifications block — easy to misread); real block has NO dup keys + STATIC messages ("Must be at least 2 characters", no `{{min}}` param). (b) `tooShort`/`tooLong`/etc. carry no params in this namespace → person-name min/max show static text (fine, 2/50 fixed). (c) username/email/phone/nationalId rules UNCHANGED (out of scope — user asked first/last name only).

**HARD RULE:** any new Edit-Profile / Edit-User / Add-Sub-User person-name field MUST reuse `personNameValidator` (or stay parity-tested against it) — the Add User validations.ts header explicitly directs this single-sourcing.

Related: [[project_user_role_label_canonical_mapping_2026_05_31]] (also a profile/user-details FE-display fix) · [[project_settings_radio_disabledinput_fix_2026_05_31]].
