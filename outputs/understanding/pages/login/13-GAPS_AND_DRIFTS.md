*** Login — Gaps & drifts ***
*** 2026-05-18 ***

# Login — Gaps & Drifts

## High-severity

### GAP-LOGIN-PRIMENG-INPUTOTP — PrimeNG `<p-inputOtp>` usage

[F-016] Replace with `<falcon-otp>`. Migration is straightforward — Falcon component should support same API.

### GAP-LOGIN-OTP-EXPIRY-DRIFT — 60s PRD vs 120s code

[PRD] BR-UM-26: 60s. [CODE] `OTP_DEFAULTS.EXPIRY_SECONDS = 120`.

Same drift as edit-user GAP-UM-25. Likely code is newer truth.

### GAP-LOGIN-SCSS-HEAVY — SCSS files for layout

Migrate to Tailwind.

### Q-LOGIN-FIRSTLOGIN-SKIP-OTP — Does FirstLogin skip OTP?

[PRD] BR-UM-22: "Username + Password → IP check → credentials check → OTP → force-change-password → Active."

Does this mean OTP THEN change-password? Or change-password without OTP?

[CODE] LoginStepResponse can return `nextStage='FirstLogin'` directly from `/login` (skipping OTP) OR after `/verify-otp`.

Clarify with product.

## Medium

### GAP-LOGIN-AUTO-LOGOUT-CLIENT-SIDE — Idle 30-min logout

[PRD] BR-UM-29 + BR-UM-47 (OPEN): client-side vs server-side enforcement.

NEW UI: implement client-side idle detection via mouse/keyboard activity. On idle, call `/logout` + navigate to login.

### GAP-LOGIN-FORGOT-PASS-LINK-PLACEMENT — UX

[CODE] "Forgot password?" link is in GetStarted screen. UX may need it visible during password entry too.

### GAP-LOGIN-LANGUAGE-PERSISTENCE — Language selector

Login layout has language selector. Need to verify selection persists post-login.

## Low

### GAP-LOGIN-USERNAME-LOWERCASE — Username pre-lowercased

[CODE] `LoginService.login` lowercases username before send. If usernames are case-sensitive at DB, this would fail. [PRD] BR-UM-12 doesn't specify case-sensitivity.

## See also

- [00-OVERVIEW](00-OVERVIEW.md) · [02-STAGE_1_GET_STARTED](02-STAGE_1_GET_STARTED.md) · [14-IMPLEMENTATION_CHECKLIST](14-IMPLEMENTATION_CHECKLIST.md)
