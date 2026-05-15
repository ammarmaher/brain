---
type: validation-rule
id: V-login-lockout-3-wrong-attempts
prd: PRD-02
service: identity
severity: medium
status: triangulated
drift: false
created: 2026-05-15
---
*** Validation V-login-lockout-3-wrong-attempts — 3 wrong logins or 3 wrong OTPs → Locked ***
*** Origin: PRD-02 User Management · Backend: Identity (LoginEligibilityPolicy + Zitadel) · 2026-05-15 ***

# V-login-lockout-3-wrong-attempts — ≥ 3 wrong password attempts OR ≥ 3 wrong/resent OTPs flips status to Locked

> Brute-force protection at the login boundary. PRD specifies a hard threshold of 3 for both wrong-password and wrong-OTP / OTP-resend-exceeded paths. Forgot Password OTP path explicitly diverges (silent on wrong, no lockout — BR-UM-32). Lockout requires an admin to flip Locked → Pending (BR-UM-08) before the user can try again.

## Origin (PRD)

- **PRD:** [[02 User Management]]
- **Source file:** [BUSINESS_RULES](../../../Brain%20Outputs/prd/modules/02-user-management/BUSINESS_RULES.md)
- **Rule ids:** `BR-UM-25` (wrong password) + `BR-UM-26` (OTP validity 60s) + `BR-UM-27` (wrong / resent OTP) + `BR-UM-32` (Forgot Password OTP is silent — divergence flag)
- **PRD line reference:**
  - ">=3 wrong login attempts -> automatic Locked." (`latest-prd.md:72`)
  - "OTP validity is 60s; Resend appears on expiry." (`latest-prd.md:73, 116`)
  - ">=3 wrong OTP OR resend-counts -> automatic Locked." (`latest-prd.md:73, 116`)
  - "Incorrect Forgot-Password OTP is **silent** (status stays Active)." (`latest-prd.md:84`)
- **Excel cell:** none (PRD prose only)
- **Workflow context:** W2 First Login steps 3 + 5 · W3 Regular Login · W9 Lockout (automatic) · W4 Forgot Password step 4 (the divergence)

## Backend enforcement

- **Service:** [[Identity Service]] (with Zitadel as the actual session/lockout backing store)
- **Policy classes:**
  - `LoginEligibilityPolicy` (`Domain/Policies/LoginEligibilityPolicy.cs`) — denies login when status is `Locked`, `Suspended`, or `Pending` (post-lockout gate)
  - `VerificationRateLimitPolicy` (`Domain/Policies/VerificationRateLimitPolicy.cs`) — OTP cooldown + resend-limit (`OtpStillValid`, `OtpResendLimitExceeded`)
- **Entry points:**
  - `LoginRequest` handler / Zitadel webhook — increments wrong-password counter; threshold = 3 → Zitadel flips user to Locked → Zitadel webhook (`/api/webhook/zitadel`) updates local Mongo via `UserLocked` event (W9 step 3)
  - `VerifyOtpRequest` / `ResendOtpRequest` handlers — same threshold via `OtpChallenge` counter
- **Validators:** `LoginRequestValidator.cs`, `VerifyOtpRequestValidator.cs`, `ResendOtpRequestValidator.cs` (under `Endpoints/Auth/Validators/`)
- **Error codes:**
  - `FalconKeys.Error.InvalidCredentials` (401) — wrong password (returned BEFORE lockout)
  - `FalconKeys.Error.UserLocked` (423) — status hit after threshold
  - `FalconKeys.Error.OtpStillValid` (429) — resend attempted while existing OTP still valid (60s window)
  - `FalconKeys.Error.OtpResendLimitExceeded` (422) — resend hit > 3
  - `FalconKeys.Error.InvalidVerificationCode` (422) — wrong OTP submitted
  - `FalconKeys.Error.OtpNotReady` (422) — flow misorder
- **Source files:**
  - [VALIDATIONS (Identity)](../../../Brain%20Outputs/understanding/backend/identity/VALIDATIONS.md) — Auth Validators + Domain-Level Policies (`LoginEligibilityPolicy`, `VerificationRateLimitPolicy`)
  - [ERRORS (Identity)](../../../Brain%20Outputs/understanding/backend/identity/ERRORS.md) — Authentication Errors section
  - [WORKFLOWS](../../../Brain%20Outputs/prd/modules/02-user-management/WORKFLOWS.md) — W9 Lockout (automatic)

**Forgot-Password divergence (honest call):** BR-UM-32 explicitly says the Forgot Password OTP path stays silent — wrong OTP does NOT lock the account, which contradicts the BR-UM-27 OTP-locks-on-3 rule. PRD itself flags this as an inconsistency. The validator on `ForgotPasswordSetPasswordRequestValidator` does not run through `VerificationRateLimitPolicy` lockout. **Backend behavior matches PRD's divergence**, but this is fragile — flag in [[GAPS_INDEX]].

## Frontend implementation hint

- **Form / page section:**
  - Login page — password screen + OTP screen
  - First Login flow — same screens; OTP also gates the force-change-password screen
  - Forgot Password OTP screen — explicitly does NOT show "attempts remaining"
- **Suggested validator wiring:**
  - Client-side **does not enforce** the threshold (server state). It simply renders the localized error from the backend response.
  - **UX guidance (inferred):** show a counter `Attempt 1 of 3` or `2 remaining` after the first failed attempt only if the backend response carries it — DO NOT pre-empt by counting client-side (a determined attacker can refresh the page to reset the counter).
  - On 423 `UserLocked` response: navigate to a static "Account locked — contact your administrator" screen. DO NOT auto-redirect to retry; DO NOT show a "Try again" button.
  - On 429 `OtpStillValid`: disable Resend button and start a 60-second countdown timer (the existing OTP popup component supports this — see [[Falcon Dialog]] OTP popup pattern)
  - On 422 `OtpResendLimitExceeded`: same lockout UI as `UserLocked`
- **Page note:** Login flow pages not yet seeded under `10-Pages/`; OTP popup is already used in [[Organization Hierarchy]] (`otp-popup` section).

## Cross-domain links

- **Permission gate:** [[Falcon Roles Permission Matrix]] — only admins can flip `Locked → Pending` (per BR-UM-08); self-service unlock is not allowed
- **Business rule cluster:**
  - [[02 User Management]] BR-UM-22 (First Login flow) ↔ BR-UM-23 (Regular Login) ↔ BR-UM-25 (password lockout) ↔ BR-UM-27 (OTP lockout) ↔ BR-UM-32 (Forgot Password divergence) ↔ BR-UM-08 (status transition matrix)
  - Sister gate: IP allowlist (BR-AM-10 / BR-UM-24) runs BEFORE this lockout counter — see [[V-account-ip-allowlist-enforcement]]
- **Related learning events:** none yet
- **Open question:** PRD-02 BR-UM-45 — whether system notifies the user when status flips to Locked is silent

## Tags

#type/v-rule #status/triangulated #prd/02 #service/identity #severity/medium #security

## Hubs

- [[VALIDATION_INDEX]] · [[PRD_INDEX]] · [[BACKEND_INDEX]] · [[AMMAR_BRAIN_HOME]] · [[BUSINESS_INDEX]] · [[GAPS_INDEX]]
