*** Login — Implementation checklist ***
*** 2026-05-18 ***

# Login — Implementation Checklist

## Verification gate

- [ ] 1. PRD anchor? → BR-UM-22..29
- [ ] 2. Endpoints? → 9 Identity auth endpoints
- [ ] 3. Pre-auth state? → AuthFlowStateService sessionStorage
- [ ] 4. IP allowlist BEFORE creds? → BE handles, FE generic error
- [ ] 5. 3-strike lockout? → BR-UM-25/27
- [ ] 6. OTP validity? → 60s PRD vs 120s code (decide)
- [ ] 7. Generic info-leak protection? → all errors same message
- [ ] 8. handleLoginSuccess steps? → store tokens · fetch user · schedule logout · navigate

## Pre-flight

- [ ] Q-LOGIN-FIRSTLOGIN-SKIP-OTP: confirm with product whether first-login can skip OTP.
- [ ] GAP-LOGIN-OTP-EXPIRY-DRIFT: confirm 60s vs 120s.

## Frontend tasks

- [ ] `LoginLayoutComponent` shell with branding.
- [ ] `GetStartedComponent` with Reactive Form.
- [ ] `EnterOtpComponent` with `<falcon-otp>` + timer + resend.
- [ ] `ChangePasswordComponent` (first-login mode) with `passwordMatchValidator`.
- [ ] `AuthFlowStateService` sessionStorage-backed.
- [ ] `otpGuard` + `changePasswordGuard`.
- [ ] Generic error message strategy (info-leak prevention).
- [ ] Idle 30-min logout client-side handler.
- [ ] Language selector with persistence.
- [ ] No PrimeNG; no SCSS.

## Backend tasks

- [ ] Verify 9 endpoints function correctly.
- [ ] Verify IpAllowlistPreProcessor runs first.
- [ ] Verify 3-strike lockout fires Kafka events.
- [ ] Confirm OTP expiry value (60s vs 120s) — align with PRD.

## E2E tests

- [ ] Happy path: Active user logs in → OTP → Complete.
- [ ] First login: Pending user logs in → OTP → Change Password → Active.
- [ ] Wrong password → generic error.
- [ ] 3 wrong passwords → user Locked.
- [ ] IP not on allowlist → generic error (same as wrong password).
- [ ] OTP expired → Resend works.
- [ ] 3 wrong OTPs → user Locked.
- [ ] 30-min idle → auto logout.

## See also

- [README](README.md) · [13-GAPS_AND_DRIFTS](13-GAPS_AND_DRIFTS.md)
