# Account-name trailing-space validation — task history

**Date:** 2026-06-07 · **Agent:** claude · **Branch:** polishing-v0.4 · **Repo:** C:/Falcon/Falcon/falcon-web-platform-ui · **Commits:** none

## Request
Org Hierarchy page → Info → edit account name: typing 1 char + a space made it "2 characters" (passed the field) but Save returned a validation error. Make a trailing space invalid; apply the same rule to every component that reuses the account-name validation; list those components.

## Root cause
[CODE] `libs/falcon/src/shared-utils/lib/validations/falcon-validations.ts`:
- `accountName()` (and `nodeName()`, kept 1:1 per BUG-08): `required` uses `.trim()`, `ACCOUNT_NAME_CHARSET` allows space, `min/maxLength` count RAW length (Wave E "space counts as a character"), and there was **no edge-whitespace check** — unlike `personName()` (`if (v !== v.trim()) return { whitespace: true }`).
- So `"a "` (len 2) passed min-2. The wire-builder trims (proven by `apps/admin-console/tests/wire-builders.spec.ts:134`), sending `"a"` → backend rejected `"a"` (< min-2) = the post-save error.

## Fix (centralized — 1 file, 2 validators)
Added `if (v !== v.trim()) return { whitespace: true };` after `required`, before charset, in `accountName()` and `nodeName()`. `whitespace` already maps to `hierarchy.validation.whitespace` (en+ar) and is in `LIVE_ERROR_KEYS`. Propagates to all 5 consumer bindings (account name: admin add-client Step 1 + admin/mgmt info-panel; node name: admin/mgmt node-drawer) plus direct `accountNameValidator(...)` Save-gate calls.

## Tests (1 file)
`tools/validation-tests/add-client-validations.test.ts` — added 4 edge cases to `accountNameCases` (`'a '`, `'Falcon '`, `' Falcon'`, `' Falcon Corp '` → `whitespace`).

## Verification (runtime)
- `npx vitest run --config tools/validation-tests/vitest.config.mts` → 18/18, **accountName 27/27**.
- `npx nx test admin-console` → **798/798** (42 files; wire-builder trim test intact).
- `npx nx test management-console` → **624/624** (29 files).
- Total 1440 green, zero regressions.

## Out of scope / flagged
- `anyString` free-text fields (financeId, entityName, district, street, buildingNumber, postalCode, additionalAddress, anotherId, vatRegistrationNumber, budgetNo) deliberately allow edge whitespace per xlsx Wave F — NOT changed.
- Baked in: rejects BOTH edges (mirrors personName), not trailing-only.
- ⚠️ SoT: recommend annotating the xlsx Account/Node-Name row "no leading/trailing spaces" (as personName's row was) so SoT matches code.
- Live FE click-through pending auth-gated login.

Memory: project_org_hierarchy_account_name_trailing_space_validation_2026_06_07.md
