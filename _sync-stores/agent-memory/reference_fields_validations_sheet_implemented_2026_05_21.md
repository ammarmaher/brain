---
name: reference_fields_validations_sheet_implemented_2026_05_21
description: Fields Validations.xlsx applied across registry + Edit User + Add Client Step 1; async account-name touched-gate removed; email/phone exclusive-edit guard wired into Save
metadata: 
  node_type: memory
  type: reference
  originSessionId: d7033986-fff9-429d-bd16-127d2827b3de
---

🟢 BUILD-GREEN 2026-05-21. `nx build admin-console` ✅ + `nx build management-console` ✅ (hash `79d33fc3af6ef3b1` mgmt 24.5s, admin green). Authoritative spec `C:\Users\User\Downloads\Fields Validations.xlsx` (Ammar) applied to FE in two passes — pass 1 (org-hierarchy forms) + pass 2 (Contact Group + remaining sheet modules):

**Registry** [CODE] `libs/falcon/src/shared-utils/lib/validations/falcon-validations.ts`:
- `LETTERS_ONLY` regex: `/^[\p{L}\s'-]+$/u` → `/^[\p{L}\p{N}]+$/u` (letters + digits, NO spaces, NO apostrophes, NO hyphens)
- Constants added: `ACCOUNT_NAME_MIN=2`, `PERSON_NAME_MIN=2`, `USERNAME_MIN=2`, `EMAIL_MAX=50`, `USER_LIMIT_MAX=999`, `NATIONAL_ID_DIGITS=/^\d{10}$/`
- `accountName()`: + min 2 + LETTERS_ONLY charset check
- `personName()`: + min 2; error key renamed `lettersOnly` → `lettersAndDigitsOnly`
- `userName()`: + min 2 + LETTERS_DIGITS_OR_EMAIL charset check
- `email()`: + max 50
- `nationalId()`: was no-op, now optional + exact 10 digits when filled
- `maxNodeLevels()` + `userLimit()`: + max 999 ceiling

**Edit User / Personal Info** [CODE] `libs/falcon/src/shared-features/user-details/validations/validations.ts`:
- Constants aligned to registry (PERSON_NAME_MIN=2, USERNAME_MIN=2, EMAIL_MAX=50, LETTERS_ONLY no-space, NATIONAL_ID_DIGITS)
- `isValidPersonName` + `isValidUsername` enforce min 2
- `isValidEmail` enforces max 50
- New `isValidNationalId`: optional, exact 10 digits when filled
- `buildFieldErrors.nationalId`: was `isBlank()`, now `!isValidNationalId()` (optional, but format-checked)
- `isEmailPhoneExclusiveViolation` helper unchanged

**Edit User Save handler** [CODE] `libs/falcon/src/shared-features/user-details/signals/signals.ts`:
- `save()` now calls `isEmailPhoneExclusiveViolation` BEFORE the existing form-invalid / save-disabled checks
- On violation: `showErrors.set(true)` + `onError('hierarchy.userDetails.emailPhoneExclusive')` (i18n key — needs translation entry)

**Add Client Step 1** [CODE] `apps/admin-console/.../add-client-wizard/client-information-step/validations/validations.ts`:
- `optionalString`/`requiredString`: `anyStringValidator(undefined, undefined, …)` → `anyStringValidator(2, 50, …)` (matches Edit Info Panel)

**Add Client Step 1 component** [CODE] `client-information-step.component.ts`:
- `accountNameError` computed: removed touched-gate on the async-duplicate branch. Async verdict now surfaces as soon as HTTP returns (mirrors Step 5 ownerUser pattern). Fixes Ammar's rapid-edit complaint where "if I click faster and remove and click and remove, the asynchronous does not work" — the HTTP was firing but the verdict was hidden behind touched-gate.

**Pass 2 — Contact Group + remaining sheet modules** (2026-05-21 follow-up):

**Contact Group** [CODE] `apps/management-console/.../contact-groups/validations/validations.ts` — 6 drifts vs sheet fixed:
- `NAME_PATTERN`: `/^[\p{L}\p{N} _-]+$/u` → `/^[\p{L}\p{N}_]+$/u` (drop space + hyphen per "Letters and digits, accept underscores '_'")
- Added `NAME_MIN = 2` check on validateContactGroupName
- NEW `validateReferenceId()` function: optional, 2-50, alphanumeric OR GUID format (8-4-4-4-12 hex). Sheet row 42.
- `COLUMN_NAME_MAX`: 20 → **32** (sheet row 45: "between (2-32) Char")
- Added `COLUMN_NAME_MIN = 2` check
- `COLUMN_NAME_PATTERN`: `/^[A-Za-z0-9_]+$/` → `/^[A-Za-z][A-Za-z0-9_]*$/` (enforces "Must start with a letter")
- Header comment updated to list all 6 validators

**Node drawer comment cleanup** [CODE] both `falcon-org-node-drawer/validations/validations.ts` files:
- Comments previously claimed `nodeNameValidator` enforces "required + maxLength(30)" — corrected to "required only, PRD silent on length"

**Sheet modules WITHOUT FE files (no work possible):**
- Add Contract wizard — not built in admin-console; mgmt-console is VIEW-ONLY (`CONTRACTS_NO_VALIDATIONS = true`)
- Templates wizard — no FE files in workspace
- Template Management (Checker levels) — no FE files in workspace

**Sheet module already aligned (no change needed):**
- Wallet & Balance Mng — `validateAmountFinite` already enforces "Any Number > 0, accept float"

**NOT touched (per "just the needed"):**
- Account ID / Balance Transfer Limit % (sheet says "Remove it" but they're already gone from current UI — old-design artefacts)
- Permission Group required-ness (sheet says Optional; user didn't confirm relax — kept required)

**Build status:** 🟢 BUILD-GREEN. `nx build management-console` ✅ (hash `79d33fc3af6ef3b1`, 24.5s). `nx build admin-console` ✅.

**Related memory:**
- [[reference_add_client_user_validations_2026_05_20]] — full pre-Fields-Validations.xlsx baseline
- [[project_wizard_async_validation_indicator_2026_05_19]] — the Step 5 ownerUser pattern this fix mirrors
- [[project_wizard_validations_prd_clean_2026_05_19]] — earlier PRD-clean pass
