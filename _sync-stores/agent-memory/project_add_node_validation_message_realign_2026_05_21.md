---
name: add-node-validation-message-realign-2026-05-21
description: "Add Node drawer — fix raw \"minLength\" leak by realigning to Add Client's ValidationMessage + translate-pipe pattern. admin-console build fc02932d1f5f2e36 / management-console build 9614b342daee48fc both green 2026-05-21."
metadata: 
  node_type: memory
  type: project
  originSessionId: dce13ff6-365c-469e-a3cd-7c4ece956432
---

# Add Node drawer — validation message realign vs Add Client

🟢 BUILD-GREEN 2026-05-21 — admin-console `fc02932d1f5f2e36` (28.6s) · management-console `9614b342daee48fc` (22.1s).

## The bug (user-reported via screenshot)

Typing 1 char in the "Node Name" field of the Add Node drawer rendered the literal string `"minLength"` under the input — not a human-readable message. User asked for parity with Add Client which shows "Minimum 2 characters required".

## Root cause

[CODE] `apps\admin-console\src\app\features\org-hierarchy-page\components\tab-components\hierarchy-tab\falcon-org-node-drawer\falcon-org-node-drawer.component.ts:191` returned the raw error KEY string `"minLength"` and then looked it up in a parent-supplied lookup map (`nameErrorMessages: Record<string, string>`). The map at [CODE] `services\state\node-drawer-state.signals.ts:79-94` only contained `required / maxLength / pattern / nodeName / duplicateNodeName / whitespace` and was MISSING `minLength` / `startsWithLetter` / `lettersAndDigitsOnly`. The fallback `nameErrorMessages()[key] ?? key` then leaked the raw validator key into the UI.

The validator at [CODE] `libs\falcon\src\shared-utils\lib\validations\falcon-validations.ts:284-297` was upgraded 2026-05-21 from "required only" to mirror Account Name (required + starts-with-letter + letters+digits-only + min 2 + max 30), but the drawer's lookup map was never widened, so the 3 new error keys leaked literally.

## Fix — admin-console (primary)

Realigned to the Add Client wizard's pattern at [CODE] `client-information-step.component.ts:145-148`:
- Validator → `ValidationMessage { key, params }` (not raw KEY string) via `fieldErrorMessage()` helper at [CODE] `libs\falcon\src\shared-utils\lib\validations\falcon-validations.ts:584-603`.
- Template binds `[errorMessage]="nameError()!.key | translate: nameError()!.params"` so i18n `hierarchy.validation.minLength` (= `"Minimum {{min}} characters required"` per `libs\falcon\src\language\i18n\en.json:1219`) interpolates `{{min}}` from the validator's `{ min: 2, actual: 1 }` payload.
- `LIVE_ERROR_KEYS` gate in [CODE] `messages.ts:49-65` (already includes `minLength`) means error surfaces IMMEDIATELY at first char without waiting for blur — matches Add Client UX.

Files touched (admin-console):
1. [CODE] `apps\admin-console\src\app\features\org-hierarchy-page\components\tab-components\hierarchy-tab\falcon-org-node-drawer\falcon-org-node-drawer.component.ts` — dropped `nameErrorMessages` input + `nameErrorMessage` computed + raw-string `syncNameError` + raw `siblingConflictError` + raw `nameError`. Replaced with `ValidationMessage` flavors using `fieldErrorMessage()` for sync + `{ key: 'hierarchy.drawer.errors.duplicateNodeName' }` literal for sibling-conflict (mirrors Add Client's inline `{ key: 'hierarchy.validation.duplicateAccountName' }` at line 148). Removed imports for `FormControl` / `ValidationErrors` / `ValidatorFn`. Added `fieldErrorMessage` + `ValidationMessage` from `@falcon`. Added `OrgNodeDrawerFormValue` to type imports.
2. [CODE] `falcon-org-node-drawer.component.html:65` — `[errorMessage]="showNameError() ? (nameErrorMessage() ?? '') : ''"` → `[errorMessage]="showNameError() && nameError() ? (nameError()!.key | translate: nameError()!.params) : ''"`.
3. [CODE] `apps\admin-console\src\app\features\org-hierarchy-page\components\org-hierarchy-page-menu.component.html:12` — removed orphaned `[nameErrorMessages]="state.nodeDrawerNameErrorMessages()"` binding.
4. [CODE] `apps\admin-console\src\app\features\org-hierarchy-page\services\state\node-drawer-state.signals.ts:79-94` — deleted `nodeDrawerNameErrorMessages` computed (no longer consumed).
5. [CODE] `apps\admin-console\src\app\features\org-hierarchy-page\services\hierarchy-page-state.service.ts:393` — deleted facade re-export.

## Fix — management-console (parallel)

Mgmt-console keeps the donor's "TranslatePipe-free / parent owns translation" architecture (drawer takes pre-translated strings via plain `input<string>` slots). Minimum-blast-radius fix: widened the parent lookup map at [CODE] `apps\management-console\src\app\features\org-hierarchy-page\services\state\node-drawer-state.signals.ts:83-93` to include the 4 missing keys: `minLength` ("At least 2 characters required."), `startsWithLetter` ("Must start with a letter."), `lettersAndDigitsOnly` ("Letters and digits only — no spaces or special characters."), `whitespace` ("No leading or trailing spaces."). Values mirror EN strings at `hierarchy.drawer.errors.*` so future i18n hookup is 1:1. Did NOT refactor the mgmt-console drawer to ValidationMessage — would have required adding TranslatePipe + i18n bundle dependency the architecture explicitly avoids.

## Rules emitted

1. **Validator error rendering MUST be `ValidationMessage { key, params }`** when the i18n string carries placeholders (`{{min}}`, `{{max}}`, `{{value}}`, `{{cap}}`). String-keyed lookup maps cannot inject the param value and any KEY-not-in-map leaks the raw validator name into the UI.
2. **Use the Add Client pattern as canonical for sync-errors-with-params**: `fieldErrorMessage(value, field, rules, touchedSet)` from `@falcon` + template `[errorMessage]="err()!.key | translate: err()!.params"`. Async/business-layer single-message errors (duplicate, network) can use inline literals `{ key: '…' }` next to it.
3. **Any new error key on a validator (e.g., adding `minLength` to a validator that previously returned only `required`) requires sweeping ALL consumers** — string-map-based drawers will silently break and leak the raw key.
4. **`LIVE_ERROR_KEYS` gate at `messages.ts:49-65`** controls which errors surface without waiting for `touched`. `minLength` is already in the set (added 2026-05-21 per the file comment) so the user sees the error at first char — `required` stays touched-gated. Future validator additions that should surface live MUST be added to this set.
5. **When a component is intentionally TranslatePipe-free** (parent owns translation), the parent's lookup map is the contract — adding a validator error key REQUIRES updating the map in the same commit.

## NOT verified

🔴 Not browser-runtime-verified. Per [VAULT] `Brain Outputs\datasets\authority-dataset\VERIFICATION-STATUS.md` FE-level rendering is blocked on 40+ pre-existing Stencil/Angular compile errors that prevent `nx serve` from coming up cleanly; verification was build-only via `nx build admin-console` + `nx build management-console`. Both compiled with zero TS errors / template errors (only pre-existing signalr `__non_webpack_require__` + tsconfig "is part of compilation but unused" + bundle-size warnings, none from this changeset).

## Repro path once dev server is unblocked

Sign in `sysadmin / Admin@1234` → Organization Hierarchy → expand a Client (e.g. Mitsubishi) → kebab on a sub-node → "Add Node" → type `s` (1 char) → should see "Minimum 2 characters required" in EN, "الحد الأدنى 2 أحرف" in AR. Type `1abc` → "Must start with a letter". Type `s@` → "Letters and digits only — no spaces or special characters". Type 31+ chars → "Maximum 30 characters allowed". Type duplicate sibling name → "A node with this name already exists at the same level". Type valid name → error clears + Save enables.

## Source-prefix references

- [CODE] `falcon-org-node-drawer.component.ts:139-147` — new `syncNameError` using `fieldErrorMessage()`
- [CODE] `falcon-org-node-drawer.component.ts:165-180` — new `siblingConflictError` returning `ValidationMessage`
- [CODE] `falcon-org-node-drawer.component.html:65` — `[errorMessage]` translate-pipe binding
- [CODE] `client-information-step.component.ts:145-149` — reference Add Client pattern
- [CODE] `client-information-step.component.html:26` — reference translate-pipe template
- [CODE] `falcon-validations.ts:284-297` — `nodeName` validator returning `{minLength:{min,actual}}`
- [CODE] `falcon-validations.ts:584-603` — `fieldErrorMessage()` helper
- [CODE] `messages.ts:14-47` — `VALIDATOR_KEYS` registry (validator key → i18n key + params)
- [CODE] `messages.ts:49-65` — `LIVE_ERROR_KEYS` gate (minLength surfaces live, required waits for touched)
- [CODE] `en.json:1219` + `ar.json:1217` — `hierarchy.validation.minLength` with `{{min}}` placeholder

Related: [[login-auth-revamp]] (same SAME-DAY use of Falcon UI Core wrapper inputs), [[org-hierarchy-fe-be-integration-realign]] (parallel work on the same org-hierarchy page).
