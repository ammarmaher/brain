*** Entity Reconciliation E-otp-challenge — OtpChallenge ***
*** PRD: PRD-02 User Management · Backend service: Identity · 2026-05-15 ***

# E-otp-challenge — OtpChallenge

> Per-purpose OTP session. Drives 5 distinct flows: `login`, `first-login`, `edit-email`, `edit-phone`, `forgot-password`. Owned by [[Identity Service]]. 60-second validity window, attempt + resend counters, channel-specific delivery (Email/Sms). Backend models this as **two record types** — `AuthenticationSession` (for login/OTP/first-login) and `VerificationSession` (for email/phone change + forgot-password). The PRD treats them as a single conceptual `OtpChallenge` entity.

## PRD definition (business-conceptual)

- **PRD module:** [[02 User Management]]
- **Source:** [ENTITIES.md](../../../Brain%20Outputs/prd/modules/02-user-management/ENTITIES.md)
- **PRD fields:**
  - `id`: identifier
  - `userId`: identifier
  - `channel`: enum `Email | Sms` (`eDeliveryMethod`)
  - `destination`: string — email address or phone number
  - `code`: string — the OTP code itself (4 or 6 digits per `OtpAppSetting.otpLength`)
  - `expiresAt`: DateTime — 60s after issue
  - `attempts`: integer — verification attempts counter
  - `resendCount`: integer — number of resends
  - `purpose`: enum `login | edit-email | edit-phone | forgot-password | first-login`
- **Lifecycle:** `Active` → `Verified | Expired | Failed`

## Backend DTO mapping (concrete request/response shapes)

- **Service:** [[Identity Service]]
- **DTO source:** [DTO_DICTIONARY.md](../../../Brain%20Outputs/understanding/backend/identity/DTO_DICTIONARY.md)
- **Validations source:** [VALIDATIONS.md](../../../Brain%20Outputs/understanding/backend/identity/VALIDATIONS.md)
- **Relevant DTOs (split across two flows):**

**Login/Auth OTP path:**
  - `VerifyOtpRequest` — `POST /auth/verify-otp`: `string SessionId, string Code`
  - `ResendOtpRequest` — `POST /auth/resend-otp`: `string SessionId`
  - `LoginStepResponse` — login flow output — `string? SessionId, eAuthenticationStage Stage, bool RequiresOtp, bool RequiresPasswordChange, int? OtpCodeLength, int? OtpExpiresInSeconds, AuthenticatedResult? Tokens, string? DevOtpCode`
  - `AuthenticationSession` (internal) — persisted session record (login flow state machine)
  - `OtpVerificationResult` (internal) — infrastructure result
  - `ResendOtpResult` (internal) — infrastructure result

**Email/Phone verify path (used in edit-email / edit-phone):**
  - `VerifyEmailRequest` — `POST /user/me/verify-email`: optional `string? Email`
  - `VerifyPhoneRequest` — `POST /user/me/verify-phone`: optional `string? PhoneNumber`
  - `ConfirmEmailRequest` — `POST /user/me/verify-email/confirm`
  - `ConfirmPhoneRequest` — `POST /user/me/verify-phone/confirm`
  - `VerificationCodeResponse` — session/code metadata
  - `VerificationSession` (internal) — persisted verification session

**Forgot password OTP path:**
  - `ForgotPasswordRequest` — `POST /auth/forgot-password`: `string Username, string PhoneNumber, eDeliveryMethod DeliveryMethod`
  - `ForgotPasswordSetPasswordRequest` — `POST /auth/forgot-password/set-password`: `string SessionId, string NewPassword`

**Domain policy enforcing OTP rate limits:**
  - `VerificationRateLimitPolicy` (`Domain/Policies/VerificationRateLimitPolicy.cs`) — throws `OtpStillValid`, `OtpResendLimitExceeded`

## Field reconciliation

| PRD field | Backend DTO field | Type (PRD → Backend) | Drift / status |
|---|---|---|---|
| `id` | `LoginStepResponse.SessionId` (login path) · `VerificationCodeResponse.<sessionId>` (verify path) | identifier → `string SessionId` | ⚠ DRIFT — backend names it `SessionId` (not `id` or `challengeId`). The session id IS the OTP challenge handle. |
| `userId` | _not on public DTOs_ — internal to `AuthenticationSession` / `VerificationSession`; resolved server-side via SessionId | identifier → server-only | ⚠ DRIFT — backend does not surface `userId` on the OTP DTOs (correct from a security standpoint: client only needs the session handle). The PRD models it because conceptually each challenge belongs to a user. |
| `channel` (Email/Sms) | `ForgotPasswordRequest.DeliveryMethod` (`eDeliveryMethod`) · `LoginRequest` flow infers channel from user profile · `VerifyEmail/Phone` is channel-implicit (endpoint name carries it) | enum 2-value → `eDeliveryMethod` enum | ⚠ DRIFT — backend doesn't carry an explicit `channel` field on OTP DTOs in all flows; it's either passed via `DeliveryMethod` (forgot-password) or implied by endpoint name (`verify-email` vs `verify-phone`). Login-path OTP channel decided server-side from user profile (BR-UM cluster). |
| `destination` (email or phone) | `VerifyEmailRequest.Email?` · `VerifyPhoneRequest.PhoneNumber?` · `ForgotPasswordRequest.PhoneNumber` | string → string | ✅ match per flow (separate fields per channel) |
| `code` (4 or 6 digits) | `VerifyOtpRequest.Code` (login path) · `ConfirmEmail/PhoneRequest.<code>` (verify path) · `DevOtpCode?` on `LoginStepResponse` (development mode only) | string → string | ✅ match. `OtpCodeLength` exposed on `LoginStepResponse` so FE knows whether to render 4 or 6 boxes. |
| `expiresAt` | `LoginStepResponse.OtpExpiresInSeconds` (int? — relative) · _absolute timestamp not exposed_ | DateTime → int? (seconds remaining) | ⚠ DRIFT — PRD models absolute timestamp; backend exposes relative seconds remaining. FE must compute `now() + OtpExpiresInSeconds`. |
| `attempts` | _not exposed on public DTOs_ — internal to `AuthenticationSession`/`VerificationSession`; counter enforced by `VerificationRateLimitPolicy` (throws on overrun) | integer → server-only | ⚠ DRIFT — backend hides the counter; client only sees the boolean error (`OtpResendLimitExceeded`). |
| `resendCount` | _not exposed_ — same as `attempts` (internal counter) | integer → server-only | ⚠ DRIFT — same |
| `purpose` (5-value enum) | _no explicit field_ — purpose is implied by the endpoint called: `verify-otp` (login) · `first-login` · `verify-email` · `verify-phone` · `forgot-password` | enum 5-value → endpoint-implicit | ⚠ DRIFT — backend models 2 distinct session records (`AuthenticationSession` for login/first-login, `VerificationSession` for email/phone/forgot-password). PRD's 5-purpose enum maps to (a) which session record + (b) which endpoint. No single `purpose` field on the wire. |
| _(none)_ | `LoginStepResponse.Stage` (`eAuthenticationStage`: InProgress/OtpRequired/PasswordChangeRequired/Authenticated) | n/a → enum 4-value | ➕ Backend carries an explicit stage machine on the response — drives FE UI routing (which screen to show next). |
| _(none)_ | `LoginStepResponse.RequiresOtp`, `RequiresPasswordChange` (bools) | n/a → bool | ➕ Convenience booleans derived from `Stage`. |
| _(none)_ | `LoginStepResponse.Tokens?` (`AuthenticatedResult`) | n/a → record | ➕ Populated only when `Stage == Authenticated` — token bundle (access + id + refresh). Touches [[E-session]]. |
| _(none)_ | `LoginStepResponse.DevOtpCode?` | n/a → string? | ➕ Development-mode-only field — leaks the OTP back to the FE for testing. Must be disabled in production. |
| **PRD entity `OtpAppSetting.otpLength`** | `LoginStepResponse.OtpCodeLength` (int?) | int (4 or 6) → int? | ✅ match — backend surfaces the configured length per challenge so FE can render the right number of boxes. PRD models this as a separate entity (`OtpAppSetting`) editable by Operation. |

## Drift / gaps summary

- **Drift items:**
  - `id` → `SessionId` rename
  - `userId` not exposed on public DTOs (correct security; PRD models it conceptually)
  - `channel` not carried explicitly — split across `DeliveryMethod` field, endpoint name, and server-side profile lookup
  - `expiresAt` modeled as relative seconds (`OtpExpiresInSeconds`), not absolute timestamp
  - `attempts` and `resendCount` not exposed — server-side counters enforced via policy throws
  - `purpose` not a field — split across two session record types + endpoint name
- **Missing on backend (public surface):**
  - `userId`, `attempts`, `resendCount` — internal-only by design (correct)
  - Absolute `expiresAt` timestamp — only relative seconds exposed (minor)
- **Extra on backend:**
  - `Stage` (4-value auth state machine) + `RequiresOtp` / `RequiresPasswordChange` convenience bools
  - `Tokens?` bundle on success (touches [[E-session]])
  - `DevOtpCode?` — dev-only OTP leak (security flag)
- **Structural surprise:**
  - PRD has **one** `OtpChallenge` entity; backend has **two** persisted records (`AuthenticationSession` + `VerificationSession`). The PRD's 5-purpose enum is split across them.

## Related validation rules (V-rule notes)

- [[V-login-lockout-3-wrong-attempts]] — `LoginEligibilityPolicy` + `VerificationRateLimitPolicy` + Zitadel · `UserLocked` (423) / `OtpResendLimitExceeded` / `OtpStillValid` (429)
- _no V-rule yet for the 60-second OTP validity window — candidate for future Phase 2C extension_
- _no V-rule yet for the 4-vs-6-digit OTP length (per `OtpAppSetting`) — candidate for future Phase 2C extension_
- _no V-rule yet for the 5-purpose channel routing — candidate for future Phase 2C extension_
- Q-UM-13 (admin-driven email/phone OTP path unclear) is the open question tied here

## Pages using this entity

- Login flow (first-time + regular) — page not yet seeded under `10-Pages/`
- Forgot Password flow — page not yet seeded
- Edit Profile (email/phone change with OTP confirm) — page not yet seeded
- [[Organization Hierarchy]] `otp-popup` section — shared OTP dialog component used across all flows

## Cross-service touches

- [[Core Gateway Service]] — `IpAllowlistPreProcessor` runs **before** OTP endpoints (rejects on `IpNotAllowed` before any OTP work happens)
- [[Access PES Service]] — not directly involved at OTP layer; engages once `Stage == Authenticated` and `Tokens` issued
- [[E-session]] — created on successful OTP verification + password check
- Zitadel — Identity Service's adapter delegates OTP send to Zitadel infrastructure

## Hubs

- [[API_INDEX]] · [[BACKEND_INDEX]] · [[PRD_INDEX]] · [[VALIDATION_INDEX]] · [[AMMAR_BRAIN_HOME]] · [[BUSINESS_INDEX]] · [[GAPS_INDEX]]
