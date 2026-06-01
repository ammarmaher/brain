---
name: validation-whitespace-wave-d-2026-05-24
description: Wave D xlsx-locked whitespace validator (no-edges + none) wired into 7 Add Client Step 1 fields + addressExtra max 50→250 bump + new V-rule
metadata: 
  node_type: memory
  type: project
  originSessionId: 469a24eb-c3e5-4ebf-baa6-0a8b28d2117b
---

# Wave D + Wave E — Validation.xlsx 2026-05-24 "Allow Spaces?" + raw-length

🟢 **BROWSER-VERIFIED 2026-05-24** host-shell hash `f73fefc604762d28` (HMR). Validation suite 517/517 (135 Add User + 382 Add Client). User flows confirmed live:

| Scenario | Input | Result |
|---|---|---|
| Login userName (scope-back) | `a` + blur | NO structural errors — login is required-only |
| Login empty submit | "" | "This field is required" only |
| Finance ID (xlsx "No start or end spaces") | ` ab` | "No leading or trailing spaces" |
| Building Number (xlsx "No") | `7 B` | "Spaces are not allowed" |
| Street (xlsx "Yes") | `Saudi Arabia` | (no error — internal space passes) |
| Street raw-length proof | 49 A's + 2 spaces (51 raw) | "Maximum 50 characters allowed" — Wave E counted the trailing spaces toward max |

## Original Wave D summary (xlsx-locked whitespace validator)

## Why

User dropped fresh `C:\Users\User\Downloads\Validation.xlsx` (55,699 B, 11 sheets) and said "I have the old validation for start-with-character, and I don't think that implemented a space between" + "make sure validations applied in code are the same as in the sheet". Diff matrix vs the prior xlsx-locked rule-map rollout (`1812cbb6`) found 8 gaps — all in Add Client Step 1:

| Field | xlsx "Allow Spaces?" | Prior code | Wave D fix |
|---|---|---|---|
| financeId | No start or end spaces | `lengthValidator(2,50,true)` only — trim silent | Prepend `whitespaceValidator('no-edges')` |
| entityName | No start or end spaces | same | same |
| district | No start or end spaces | same | same |
| budgetNo | No start or end spaces | same | same |
| anotherId | No start or end spaces | same | same |
| bldg | No (anywhere) | length-only — allowed spaces | Prepend `whitespaceValidator('none')` |
| vat | No (anywhere) | length-only — allowed spaces | same |
| addressExtra | max 250 | max 50 (DRIFT noted in tests) | Bump to `lengthValidator(2, 250, false)` |

All 70+ other field/validator pairs already aligned vs xlsx (verified row-by-row).

## What

**New primitive** `whitespace(mode: 'no-edges' | 'none')` on `defaultFalconValidationsRegistry` at [CODE] `libs/falcon/src/shared-utils/lib/validations/falcon-validations.ts:600-614`. Empty/whitespace-only values delegate to `required` so blank fields don't get two competing messages.
- `mode='no-edges'` → `{ whitespace: true }` (raw value !== trimmed).
- `mode='none'` → `{ noSpacesAllowed: true }` (any `/\s/` in raw value).

**Named export** `whitespaceValidator(mode)` at [CODE] `libs/falcon/src/shared-utils/lib/validations/named-validators.ts:93`.

**i18n keys** at [CODE] `libs/falcon/src/language/i18n/{en,ar}.json:1218,1216`:
- `whitespace` already existed (en: "No leading or trailing spaces" · ar: "لا يُسمح بمسافات في البداية أو النهاية") — Wave D **wired the missing emitter**.
- `noSpacesAllowed` NEW (en: "Spaces are not allowed" · ar: "المسافات غير مسموح بها").
- Both registered in `VALIDATOR_KEYS` + `LIVE_ERROR_KEYS` at [CODE] `messages.ts:17,62`.

**Rule chain order**: whitespace BEFORE length. `lengthValidator` trims silently, which would mask the cause from the user — putting whitespace first means `messageFor()` picks the whitespace error key from the merged errors object.

**Wired site** [CODE] `apps/admin-console/.../client-information-step/validations/validations.ts:80-92` — 7 fields. Step 5 / Step 2 / Step 3+4 / Add User / Add Node / Edit Node already had per-validator charset rules that exclude whitespace naturally — no Wave D changes.

**NOT touched** (intentional scope discipline):
- Info Panel (admin + mgmt) — sheet has no Information Page row in 2026-05-24 xlsx; revisit when business widens scope. Info Panel already uses `optionalLongString = anyStringValidator(2, 250, false)` for `additionalAddress` (correctly at 250 unlike the wizard's prior 50).
- Management-console Add Client wizard mirror — Add Client is Falcon-admin-only feature; no mgmt-console mirror exists.

## Tests (509/509)

- Added `composeFn(...vs)` helper to mirror the per-field rule-array shape from `CLIENT_INFO_VALIDATIONS` at [CODE] `tools/validation-tests/add-client-validations.test.ts`.
- 5 new case lists: `financeIdCases` (16) · `optionalNoEdgeWsCases` (13) · `optionalNoSpacesCases` (14) · `optionalText2to50Cases` (11, street unchanged) · `optionalLongTextCases` (7, addressExtra 250-cap proof).
- Run: `npx vitest run --config tools/validation-tests/vitest.config.mts`.

## Obsidian

- **NEW V-rule** at [VAULT] `Brain SK/_obsidian/30-Validation/V-text-field-no-edge-or-internal-whitespace.md` — single-source xlsx ↔ validator ↔ i18n ↔ test mapping. Brings vault V-rule count 25→26 (matches original brief).
- **Matrix update** at [BRAIN-OUT] `datasets/authority-dataset/06-validation-by-feature/MATRIX.md` — new row 26 + ✅ in OH column + updated discrepancy note.
- **Add Client validations** at [BRAIN-OUT] `understanding/pages/organization-hierarchy/Add Client/07-VALIDATIONS.md` — added per-field validator wiring table for Step 1 + Hubs link.

## Brain sync state

- Canonical → `C:\falcon-brain-sync\` push DONE via `sync-from-canonical.ps1 -Push` (robocopy mirror). MATRIX.md change visible at `C:\falcon-brain-sync\Brain-Outputs\datasets\authority-dataset\06-validation-by-feature\MATRIX.md`.
- `git add/commit/push` on `falcon-brain-sync` NOT executed — project CLAUDE.md rule: "Never commit/push without explicit user instruction". Many pre-existing modifications coexist there from prior sessions; user must triage before push.
- Brain SK has its own git (`https://github.com/ammarmaher/brain`) with the new V-rule untracked + 30+ pre-existing modifications. Same no-auto-commit rule applies.
- FE branch `polishing-v0.4` working tree has 7 modified + 1 new test file. Not committed.

## Wave E — raw length counts spaces (2026-05-24, after Wave D)

User directive: *"space should be counted as a character"*. Fix:

**[CODE] `libs/falcon/src/shared-utils/lib/validations/falcon-validations.ts` — `anyString` + `digitsOnly`:**
- Required check still uses `v.trim()` — whitespace-only = effectively empty (otherwise " " counts as filled for required=true, which is wrong UX).
- Min/Max length now use raw `v.length` (not `v.trim().length`).
- `digitsOnly` also reads raw value for the charset check — `DIGITS_ONLY.test(" 12345")` correctly fails because spaces aren't digits.

Impact:
- "Saudi Arabia" street field → length 12 (counts internal space). Passes min 2, max 50.
- "A"*49 + "  " street field → length 51. Fails max 50 (browser-verified above).
- "A"*248 + "  " addressExtra → length 250. Passes max 250 (boundary).
- " 12345 " postal → digitsOnly fires (was silently trimmed before).

**NOT changed (deliberate scope discipline):**
- `accountName`, `nodeName`, `personName`, `userName`, `email`, `nationalId`, `saudiPhone` — these have charset rules that already exclude spaces; trim is a paste-from-clipboard UX convenience that produces consistent user messages. Changing them would surface "Letters and digits only" errors for edge whitespace, which is technically correct but a worse user message than the implicit trim.
- `phone` — keeps `replace(/\s+/g, '')` (intentional E.164 normalization for "+966 50 1234 567" → "+96650 1234 567").

## Login + forgot-password scope-back (2026-05-24)

User caught a leak: login was using `userNameValidator` (with startsWithLetter + lettersDigitsOrEmail + 2-30 length) — showed "Min 2 characters / Max 30" errors when typing a single char on login. xlsx validations belong to Add Client + Add User only.

**Reverted to `requiredValidator` ONLY:**
- [CODE] `apps/host-shell/.../get-started/get-started.component.ts:76` — login `userName` was `userNameValidator`, now `requiredValidator`.
- [CODE] `apps/host-shell/.../forgot-password-flow/forgot-password-flow.component.ts:108-109` — forgot-password `userName` + `phoneNumber` reverted to required-only.
- [CODE] same file line 444 — reset-password `newPassword` reverted to required-only (backend `auth/set-password` still enforces complexity and surfaces via `extractAuthError()`).

`change-password.component.ts` was already required-only via `Validators.required` from Angular forms — not touched.

## Rules emitted (reusable)

- **xlsx "Allow Spaces?" column has 3 enumerated values** — `No` → `whitespaceValidator('none')` · `No start or end spaces` → `whitespaceValidator('no-edges')` · `Yes` → no whitespace validator. NEVER use silent `.trim()` alone when the sheet expects user feedback.
- **Whitespace validator order matters** — MUST come before `lengthValidator` in the rule chain. With raw-length `lengthValidator` would NOT trim either, but the merged error key order depends on insertion order; whitespace first means the user sees the whitespace message first.
- **`whitespace` validator delegates to `required`** on empty/whitespace-only values. Prevents two competing messages for the same blank field.
- **Length validator counts RAW chars (Wave E)** — `anyString` + `digitsOnly` no longer trim before length/charset. Required check still uses trim (so whitespace-only field is considered empty for required gating).
- **Adding a new error key requires 4 sites** — registry impl + named export + `VALIDATOR_KEYS` map + `LIVE_ERROR_KEYS` set + en/ar i18n + at least one wired site + test coverage. Easy to miss one; the test suite catches gaps.
- **`addressExtra` max is 250 not 50** — wizard had pre-existing drift; Wave D resolved it. Info Panel already at 250.
- **xlsx-locked structural validators are scoped to Add Client + Add User wizards** — login / forgot-password / change-password use `requiredValidator` only. Backend rejects invalid credentials with its own message. Re-adding `userNameValidator` to login would re-leak min/max errors that confuse legit users whose admin-assigned username may not pass the strict wizard chain.

## Related

- Sister rules: [[validation-account-name-format-uniqueness]] · [[validation-user-first-last-name-letters-only]] (both exclude spaces via charset, not the dedicated whitespace validator)
- Sister project memory: [[project_info_panel_validation_parity_2026_05_21]] — earlier Info Panel mirror precedent (same 11 fields, same canonical pattern)
- Sister project memory: [[project_validation_xlsx_pre_filled_2026_05_21]] — original xlsx delivery context
- Commit predecessor: `1812cbb6 feat(@falcon): xlsx-locked validation rule-map rollout for Add Client + Add User wizards` (Wave A-C, 2026-05-24 13:49) — introduced the test harness + generic primitives that Wave D built on.
