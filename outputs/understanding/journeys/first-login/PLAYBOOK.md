*** Journey Playbook — First Login ***
*** Multi-page user flow · 2026-05-15 ***
*** Crosses: [[Login]] · [[Force Change Password]] · [[OTP Challenge]] · default home ***

# First Login

> A user in `Pending` status (created by [[Add Client Flow]] Step 5 for an AO, or by [[Add User Flow]] for any other role) receives credentials and attempts to sign in for the first time. The Core Gateway runs the IP allowlist check first — off-net users see a generic deny. Identity validates the temporary password. Because user is `Pending`, the response forces a password change with complexity per the tenant's `PasswordSecurityLevel`. After password change, Identity issues an OTP challenge (60-sec validity, length per tenant `OtpAppSetting`). Correct OTP → session created → user status `Pending → Active` → home page loads. Wrong passwords / OTPs accumulate; 3 of either type → user `Locked` (admin unlock required).

## Actors involved

| Actor | Role |
|---|---|
| Newly-created user (any role) | Subject of the journey |
| Identity Service | Owns credentials, password change, OTP, session |
| Core Gateway | Enforces IP allowlist on every request; gates pre-auth |
| Commerce Service | Read source for tenant settings (`PasswordSecurityLevel` + `AllowedIPs` + `OtpAppSetting`) |
| Access (PES) Service | Resolves user's effective permissions for the new session |
| Zitadel (via Identity) | Underlying identity store (never called from frontend) |

## Pages traversed (in order)

1. [[Login]] — Username + password entry. `forward-ref (page not yet seeded)`
2. [[Force Change Password]] — Pre-empts normal flow; required because user is `Pending`. `forward-ref (page not yet seeded)`
3. [[OTP Challenge]] — 4-digit or 6-digit code with 60-sec timer. `forward-ref (page not yet seeded)`
4. Default home page — role-dependent landing.

## Flow playbooks used

- [[Add User Flow]] — built (single-file SoT). Created the user; this journey is the activation gate.
- [[Add Client Flow]] — built (folder SoT). Step 5 creates the AO; this journey is what they do next.
- [[First Login Flow]] — `forward-ref (flow not yet seeded)`. Should be a standalone playbook covering Login + Force-Change-Password + OTP as one user-visible chain.
- [[Login Flow]] — `forward-ref`. Regular re-login (Active user) is a degenerate version of this journey without the force-change step.

## Backend services exercised (in order)

- [[Core Gateway Service]] — receives the login POST first; runs IP allowlist check; forwards to Identity.
- [[Identity Service]] — validates credentials; detects `Pending` status; returns force-change-password step; persists new password; emits OTP challenge; validates OTP; creates session; transitions user status.
- [[Commerce Service]] — read by Identity to get `PasswordSecurityLevel` + `OtpAppSetting` + `AllowedIPs` for the tenant.
- [[Access PES Service]] — called by Identity (or by the new session) to resolve the user's effective permission set.

## Kafka events fired

| Event | Producer → Consumer | Fires between... |
|---|---|---|
| `identity.user-status-changed.v1` | Identity → Access PES + audit | `forward-ref (event name TBC)`. Fires when user transitions Pending → Active or → Locked. |
| `identity.session-created.v1` | Identity → audit consumers | `forward-ref (event name TBC)`. Fires on successful OTP + session issue. |
| `identity.password-changed.v1` | Identity → audit + Zitadel webhook ingestion | `forward-ref (event name TBC)`. Fires when force-change-password completes. |
| `identity.user-locked.v1` | Identity → admin + audit | `forward-ref (event name TBC)`. Fires when 3-wrong threshold crossed. |

## V-rules touched

| V-rule | Where it fires |
|---|---|
| [[V-account-ip-allowlist-enforcement]] | Step 1 — gateway enforces; off-net → 403 generic |
| [[V-password-security-level-enum]] | Step 2 — frontend pulls level to wire complexity rules |
| [[V-password-complexity-per-security-level]] | Step 2 — frontend validators per tier; backend re-enforces |
| [[V-login-lockout-3-wrong-attempts]] | Steps 1 + 3 — wrong-attempts counters; 3 → Locked |
| [[V-user-first-last-name-letters-only]] | Not directly — PII set at create time |
| [[V-username-format-uniqueness-immutable]] | Not directly — username unchangeable; this just authenticates |

## End-to-end happy-path narrative

**Step 0 (gateway pre-flight).** User opens the Login page on the Client portal (or Admin Console for Falcon users). Every request to the gateway carries the source IP. Core Gateway looks up tenant `AllowedIPs[]` from its Redis cache (refreshed by `commerce.tenant-ip-allowlist-changed.v1`). If the user's IP is not allowed AND IP allowlist is enabled, gateway returns 403 with generic "Request not permitted from your network" per BR-UM-24 — no username leakage.

**Step 1.** User enters username + temporary password. Frontend POSTs to Identity via gateway: `POST /api/auth/login` (`forward-ref endpoint`). Identity:
1. Resolves the user by username.
2. Verifies the temporary password against Zitadel.
3. Detects user.status == `Pending` (per BR-UM-10).
4. Returns `LoginStepResponse` with step = `force-change-password`. Includes the tenant's `PasswordSecurityLevel` so the FE can wire complexity rules.

**Step 2.** Frontend renders [[Force Change Password]] (`forward-ref`). User enters new password + confirmation. Complexity validators map to `PasswordSecurityLevel` per [[V-password-complexity-per-security-level]]:
- `Normal / Low` — basic rules
- `Advanced / Medium / High / Strict` — stronger rules

> Note Q-UM-12 vocabulary drift — PRD says Normal/Advanced; backend may say Low/Medium/High/Strict.

Frontend POSTs the new password to Identity: `POST /api/auth/change-password` (`forward-ref endpoint`). Identity persists to Zitadel; emits `identity.password-changed.v1`. Returns `LoginStepResponse` with step = `otp-challenge`.

**Step 3.** Identity creates an `AuthenticationSession` ([[E-otp-challenge]]) with a 60-sec OTP (BR-UM-26). OTP length 4 or 6 per tenant `OtpAppSetting`. OTP delivered via the tenant's preferred channel (typically the same channel that delivered credentials at Add User / Add Client time).

**Step 4.** Frontend renders [[OTP Challenge]] (`forward-ref`) with countdown timer. User enters the OTP. Frontend POSTs: `POST /api/auth/verify-otp` (`forward-ref endpoint`). Identity:
1. Validates the OTP against the AuthenticationSession (must be unexpired + match).
2. Resets wrong-OTP counter on success.
3. Transitions user.status: `Pending → Active`. Emits `identity.user-status-changed.v1` (Access PES consumes; updates effective permission cache).
4. Creates [[E-session]] (JWT + refresh token). Emits `identity.session-created.v1`.
5. Returns the session tokens.

**Step 5.** Frontend stores tokens, navigates to default home for the user's role:
- Account Owner → tenant dashboard
- Falcon System Administrator / Product → Admin Console home
- Normal User → role-defined home page

**Journey ends.** Final state:
- **User:** `Active`
- **Session:** valid (JWT + refresh)
- **Wrong-password / Wrong-OTP counters:** reset
- **Effective permissions:** resolved per PES

## Failure modes + recovery paths

- **Step 0 fails (IP not on allowlist):** 403 generic. User must access from an allowed network or AO must add their IP to the allowlist via Settings tab (see [[V-account-ip-allowlist-enforcement]]).
- **Step 1 wrong password:** Wrong-password counter increments. If < 3, user retries. If == 3, [[V-login-lockout-3-wrong-attempts]] fires → user `Locked` per BR-UM-25. Identity emits `identity.user-locked.v1`. User sees "Account locked — contact your administrator". Recovery: admin unlock via Edit User flow.
- **Step 2 password complexity rejected:** 400 with localized error message. Frontend re-renders complexity hints. User retries.
- **Step 2 backend persist fails (Zitadel down):** 500. User sees "Password change failed — try again". Session not advanced. Retry safe.
- **Step 3 OTP not delivered:** User has no code. Timer runs out. UX gap: a "Resend OTP" button is needed (`forward-ref (resend OTP behavior not yet documented)`).
- **Step 4 wrong OTP:** Wrong-OTP counter increments. If < 3, user retries (within the 60-sec window — typically a new OTP is issued each attempt). If == 3 → user `Locked` per BR-UM-27. Recovery: admin unlock.
- **Step 4 OTP expired:** Session reset; user starts over from Step 1 (or a "Request new OTP" path triggers re-emission). Behavior depends on Identity policy.
- **DevOtpCode leakage:** In dev, the OTP is returned in `LoginStepResponse.DevOtpCode` for testing. **Must be off in production** — verify env flag at integration time.

## Cross-journey dependencies

- **Depends on:** User exists in `Pending` (created via [[Add Client Flow]] Step 5 OR [[Add User Flow]]). Credentials delivered. Tenant `AllowedIPs[]` and `PasswordSecurityLevel` and `OtpAppSetting` configured (set in [[Add Client Flow]] Step 2).
- **Triggers downstream:** Every other authenticated user action (the session is the gate). Specifically: AO can now run [[Renew Contract]], [[Send Campaign]], etc.
- **Sibling lockout journey:** 3-wrong-counter exhausted → user `Locked`. Recovery is admin Unlock — `forward-ref (Unlock User Flow not yet seeded)`.

## Implementation checklist

- [ ] All page playbooks in the journey are loaded — Login + Force Change Password + OTP Challenge
- [ ] Kafka subscriptions are wired — Access PES consumes `identity.user-status-changed.v1`; audit consumes `identity.session-created.v1`
- [ ] Error states from each step propagate correctly — IP deny generic 403; wrong-password counter; complexity rejection; OTP expiry; lockout
- [ ] State transitions per actor are tested end-to-end — User: Pending → Active or Pending → Locked
- [ ] Password complexity rules match `PasswordSecurityLevel` mapping (verify Q-UM-12 vocabulary)
- [ ] OTP length adapts to tenant `OtpAppSetting` (4 vs 6)
- [ ] DevOtpCode field is OFF in production
- [ ] Resend-OTP / Resend-Credentials UX gap is acknowledged

## Hubs

- [[Organization Hierarchy]] · [[PRD_INDEX]] · [[BACKEND_INDEX]] · [[VALIDATION_INDEX]] · [[AMMAR_BRAIN_HOME]] · [[IMPLEMENTATION_KNOWLEDGE_MAP]]
