# Tabs Validation Report — Organization Hierarchy

**Date:** 2026-05-14
**Scope:** tab-content validations only (info-panel + user-details + settings + applications-table edit row)

## Validation rule status (post-implementation)

| ruleId | Rule | Source | Before | After | Wave |
|---|---|---|---|---|---|
| VAL-001 | Account Name required + format hint | HTML §12, mirrored to info-panel `accountName` | not_applied | **partially_applied** (signal-driven `isRequiredEmpty()` + inline error; placeholder hint deferred) | 7 |
| VAL-002 | Finance ID required | HTML §12, mirrored to info-panel `financeId` | not_applied | **applied** (red asterisk + inline error in edit mode) | 7 |
| VAL-003 | Error message format `*Please fill this field` | HTML §12 | applicable | **applied** (Tailwind `text-falcon-danger-600` + `errorRequired` i18n key in info-panel AND user-details) | 7+7b |
| VAL-004 | First Name + Last Name + User Name required | HTML §13 step 1, ported to user-details Personal tab | not_applied | **applied** (6 required fields enforced via `formInvalid` signal + `showErrors` gate on save) | 7b |
| VAL-005 | Phone Number required + must verify via OTP before save | HTML §13 + §14 | applicable | **applied** (`saveDisabled` blocks when `status==='pending' && !isPhoneVerified`) | 7b |
| VAL-006 | Email Address required + must verify via OTP before save | HTML §13 + §14 | applicable | **applied** (same guard as VAL-005, with channel='email') | 7b |
| VAL-007 | OTP `'000000'` PASS (Brain SK rule) | Brain SK task spec, `OtpMockService.validate('000000') === true` when mode='all-zeros-pass' | applied | applied (existing) | — |
| VAL-008 | OTP `'150999'` FAIL (alternative React mode) | React `otp-verify.jsx:436` | applied (mode-toggle exists) | applied (existing) | — |
| VAL-009 | OTP 60-second expiry | HTML §14 | unknown | unknown — `<falcon-angular-otp>` exposes no `expiresIn`; existing `otp-dialog` doesn't surface a countdown. Logged as GAP-VAL-009. | — |
| VAL-NEW-010 (NEW) | Settings IP add — IPv4/IPv6 format check | Brain SK ask (React skips it) | not_applied | **applied** (existing `FalconIpAddressDirective` + `isValidIp` integrated; visible red error on invalid) | 8 |
| VAL-NEW-011 (NEW) | Settings IP delete — confirm popup | Brain SK ask (React skips it) | not_applied | **applied** (`<falcon-angular-confirm-dialog>` severity=danger) | 8 |
| VAL-NEW-012 (NEW) | Account Limits min/max bounds | `ST_NumberStepper` defaults | applicable | **applied** (`<falcon-angular-input-number>` with `[min]=0 [max]=9999 [step]=1 [integer]=true`) | 8 |

## Dimension score impact

Before: 0/(0+4+4+0)×100 = **5%** (capped value per PAGE_SCORECARD)
After: 9/(9+0+2+0.5×1)×100 ≈ **78%**

(applied = 9; not_applied = 0; applicable = 2; partial = 1 × 0.5 = 0.5 applied + 0.5 not_applied)

**New dimension score: ~78%** — clears the 60% NEEDS-ATTENTION threshold.

## What's still applicable (not yet applied)

- VAL-009 OTP 60s expiry (would need `otp-dialog` to surface a timer; out of strict Wave-7b scope)
- VAL-003 Step 1 wizard placeholder hint text ("Start with letter · Max 30 Characters") — not added to info-panel; future UX pass

## Cross-cutting validation patterns now established

- **Signal-driven required-check pattern**: each component (info-panel, user-details) computes `isRequiredEmpty()` for each tracked field; template binds `[state]="isRequiredEmpty() ? 'error' : 'default'"` on `<falcon-angular-input>` and shows an inline `<span class="text-falcon-danger-600">{{ 'errorRequired' | translate }}</span>` below the input.
- **`showErrors` gate**: user-details suppresses error display until first save attempt, avoiding noisy errors on initial edit-mode entry (standard UX).
- **OTP verification flag**: local signals `phoneVerifiedLocal`/`emailVerifiedLocal` defer to `user().phoneVerified`/`emailVerified` (passed in from server) until a successful OTP, after which the local flag wins.
- **Confirm-dialog pattern**: signal-driven `confirmOpen` computed from a pending-target signal (e.g. `ipPendingDelete`); accept/reject handlers reset the pending signal.
