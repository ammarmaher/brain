*** Login — Playbook ***
*** 2026-05-18 ***

# Login — Playbook

## TL;DR

3-stage pre-auth flow (GetStarted → EnterOtp → optional ChangePassword for first-login). Hosted in `LoginLayoutComponent`. State persisted via `AuthFlowStateService` (sessionStorage). 9 Identity Service auth endpoints, all throttled. IP allowlist runs BEFORE credentials check per BR-UM-24 (info-leak prevention). 3-strike lockout for both wrong passwords + wrong OTPs per BR-UM-25/27. 30-min idle logout per BR-UM-29. Reactive Forms (a positive in old-UI).

Critical drift: OTP expiry — PRD says 60s (BR-UM-26), code says 120s.

## Sections

1. Permissions — pre-auth · no PES · 2 route guards (otpGuard, changePasswordGuard) · BE throttle per endpoint.
2. Stage 1 GetStarted — Username (lowercased) + Password · `POST /api/auth/login`.
3. Stage 2 EnterOtp — 6-digit · auto-submit · 60/120s timer · resend.
4. Stage 3 FirstLogin password — new password + confirm · BR-UM-15 complexity.
5. IP allowlist — runs BEFORE credentials · generic error.
6. AuthFlowStateService — sessionStorage cross-stage state · guards consume.
7. Validations — Reactive Forms with required + length + passwordMatchValidator.
8. Backend API — 9 endpoints · LoginStepResponse FSM.
9. Components — LoginLayout + 4 stage components.
10. Kafka — login-attempted · otp-requested · user-status-changed (lockout/firstlogin).
11. State — Pending→Active (firstlogin) · Active→Locked (3-strike).
12. Errors — generic for credentials/IP · specific for OTP/lockout.
13. Gaps — PrimeNG InputOtp · 60s vs 120s · SCSS heavy · Q-LOGIN-FIRSTLOGIN-SKIP-OTP.

## Hubs

[[Login Flow]] · [[Forgot Password Flow]] · [[Change Password Flow]] · [[My Profile Flow]] · [[02 User Management]] · [[Identity Service]]
