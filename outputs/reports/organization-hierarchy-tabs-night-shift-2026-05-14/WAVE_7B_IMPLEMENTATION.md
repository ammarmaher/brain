# Wave 7b Implementation — user-details-page polish

**Date:** 2026-05-14
**Wave:** 7b — user-details-page (Audit/RuleStatus/Permission patterns)
**Build hash:** `084858c9a6ccb344` (admin-console prod, `--skip-nx-cache`)
**Status:** COMPLETE — build GREEN

---

## Files touched (5)

1. `apps/admin-console/src/app/features/org-hierarchy-page/models/models.ts`
   - Added `CheckerLevel` union (`'none' | 'level1' | 'level2'`)
   - Extended `User` interface with 5 optional fields: `nationalId`, `phoneVerified`, `emailVerified`, `checkerWhatsapp`, `checkerVoice`
   - Strictly additive — zero impact on existing `User` consumers (wizards, mappers, table)

2. `apps/admin-console/src/app/features/org-hierarchy-page/components/user-details/user-details-page.component.ts`
   - Imports: `FalconAngularDropdownComponent`, `FalconAngularRadioComponent`, `OtpDialogComponent`, type `FalconDropdownOption`, type `CheckerLevel`, type `UserStatus`
   - 6 new signals: `otpOpen`, `otpChannel`, `phoneVerifiedLocal`, `emailVerifiedLocal`, `showErrors` + computed `isPhoneVerified`/`isEmailVerified`/`fieldErrors`/`formInvalid`/`saveDisabled`/`otpRecipient`
   - 3 dropdown option arrays seeded from `STATUS_OPTIONS` / `ROLE_OPTION_KEYS` / `PERM_GROUP_OPTIONS` (local consts, React-parity labels)
   - 3 new handlers: `openOtp(channel)`, `onOtpVerified()`, `onCheckerChange(channel, level)`
   - 3 new label helpers: `statusLabel`, `permGroupLabel`, `checkerLabel`
   - `onSave()` now guards `formInvalid()` + `saveDisabled()` (sets `showErrors` instead of saving)
   - `onFieldChange()` invalidates local verification flag when phone/email mutate
   - `cancelEdit()` clears `showErrors` + both local verification flags

3. `apps/admin-console/src/app/features/org-hierarchy-page/components/user-details/user-details-page.component.html`
   - Personal tab: 6 fields (FirstName / LastName / UserName [read-only] / NationalId / Phone / Email) with `* ` red asterisk, inline `errorRequired` messages, OTP-Verify chip + Verified-success chip on phone+email
   - Role tab: status dropdown (`readonly=true` per source `.au-select-disabled`) + role dropdown (enabled)
   - Permissions tab: permission group dropdown + 2-row checker matrix (WhatsApp/Voice) using 3× `<falcon-angular-radio>` per row with `name="checker-whatsapp"` / `name="checker-voice"` for native radio exclusivity
   - Footer: Save button now disabled when `saveDisabled()` true; "verify before save" helper text shows when OTP is the blocker
   - `<app-otp-dialog>` mounted at component bottom, `[(open)]="otpOpen"` two-way, `[channel]` + `[recipient]` from signals

4. `libs/falcon/src/language/i18n/en.json`
   - Added `hierarchy.userDetails` namespace (40+ keys) — all required by template: tabs, statuses, roles, permGroups, checker (whatsapp/voice/none/level1/level2), verify, verified, verifyBeforeSave, errorRequired

5. `libs/falcon/src/language/i18n/ar.json`
   - Same `hierarchy.userDetails` namespace with full Arabic translations (RTL-ready)

---

## Falcon components reused (5)

- `<falcon-angular-tabs>` — existing (3-tab strip)
- `<falcon-angular-input>` — existing (5 editable Personal fields)
- `<falcon-angular-dropdown>` — NEW for this component (status / role / permGroup) — pulls `FalconDropdownOption[]`
- `<falcon-angular-radio>` — NEW for this component (6× instances across WhatsApp + Voice checker rows). Used the fallback pattern (3 separate radios per row sharing `name`) because `<falcon-angular-radio-group>` API is geared toward a single `selectedValue` and works well only when each row is its own group — separate-radio pattern keeps the 2-row matrix layout cleanest.
- `<app-otp-dialog>` — REUSED (existing Wave 13 component, untouched) — `<falcon-angular-otp>` + `<falcon-angular-popup>` wrapped, validates against `OtpMockService` (all-zeros pass)

---

## Build verification

- `nx build admin-console --skip-nx-cache` — **0 errors**
- Build hash: `084858c9a6ccb344`
- 2 lint warnings remain in user-details-page.html — both unrelated `NG8107` warnings on the avatar initials (`firstName?.[0]`); these don't block build. Fixed in same pass (replaced `?.[0]` with `[0]`).
- 2 pre-existing lint warnings unchanged (`add-client-wizard.component.ts` unused import; `user-role-status-step.component.ts` unused TranslatePipe — outside Wave 7b scope).
- No SCSS / `.css` files created. Tailwind tokens only (`bg-falcon-warning-100`, `text-falcon-success-700`, `bg-falcon-teal-700`, `text-falcon-red-500`, etc.). Zero PrimeNG / PrimeIcons imports.

---

## Acceptance criteria check

- [x] Personal tab shows 6 fields (FirstName / LastName / UserName / NationalId / Phone / Email)
- [x] All 6 fields have `* ` red asterisk indicator in label
- [x] Empty required fields show inline `errorRequired` message (after Save click — `showErrors` signal gating)
- [x] Phone field has Verify chip → opens `<app-otp-dialog>` channel=phone → `000000` passes (via existing OtpMockService)
- [x] Email field has Verify chip → opens dialog channel=email → `000000` passes
- [x] Successful OTP sets `phoneVerifiedLocal`/`emailVerifiedLocal` signal → chip morphs into green Verified badge
- [x] Save button disabled when `status==='pending' && (!phoneVerified || !emailVerified)`
- [x] Save button disabled when any required field is empty
- [x] Role tab: status dropdown `[readonly]=true` (matches React `.au-select-disabled`)
- [x] Role tab: role dropdown enabled
- [x] Permissions tab: permGroup dropdown (4 options) + 2-row checker matrix (WhatsApp + Voice, 3 options each)
- [x] `nx build admin-console --skip-nx-cache` returns 0 errors
- [x] No PrimeNG, no SCSS/CSS, Tailwind tokens only
- [x] i18n parity — EN + AR both updated under `hierarchy.userDetails.*`

---

## Parity estimate vs React userdetails.jsx

| Section | React reference | Angular Wave 7b | Parity |
|---|---|---|---|
| Header strip (avatar + back + edit toggle) | `userdetails.jsx:67-82` | existing | 85% |
| Personal Info — 6 fields + required indicators | `userdetails.jsx:90-122, 177-299` | NEW | 75% (no separate `au-avatar-row` photo uploader — deferred) |
| Phone/Email verify + OTP modal | `userdetails.jsx:269-296` + `otp-verify.jsx:399-584` | NEW (via `<app-otp-dialog>` reuse) | 85% |
| Role & Status — disabled status + role select | `userdetails.jsx:142-149, 301-332` | NEW dropdowns | 90% |
| Permissions — group + 2-row checker matrix | `userdetails.jsx:151-174, 340-383` | NEW dropdown + 6 radios | 80% |
| Cancel/Save footer + disabled state | `userdetails.jsx:65-66, 392-400` | existing + new `saveDisabled` guard | 90% |

**Overall parity estimate:** ~80% (up from ~65% pre-Wave). Tier raised one full bucket.

---

## Notes / deferred items (out of strict scope)

- Photo uploader in Personal Info edit mode — React shows `.au-avatar-row` with `<falcon-angular-single-uploader>`. Brain SK brief lists it under Wave 7b's *conditional* component list but no acceptance criterion. Deferred for follow-up.
- `<falcon-angular-phone-field>` with built-in `verifyButton` prop — chose hand-composed `<falcon-angular-input>` + Verify chip for layout parity with React (the chip aligns to the right of the input, not inside it). The phone-field component locks the chip inside, which clashes with the brief's "Verify button to the right of the input" requirement.
- `hierarchy.otp.*` keys (titlePhone/titleEmail/intro/confirm/invalid) — referenced by `otp-dialog.component.*` but missing from JSON; out of strict Wave 7b scope (brief says ONLY edit `hierarchy.userDetails.*`).

---

## Blockers

None.
