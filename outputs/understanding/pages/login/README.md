*** Login — folder index ***
*** 2026-05-18 ***

# Login — implementation knowledge folder

> SoT for the Login flow (`/login`). 3-stage screen (Username+Password → OTP → if first-login, force-Change-Password). Backed by Identity Service AuthEndpoints. Pre-auth flow — no PES checks.

## Files

| File | Read when... |
|---|---|
| [00-OVERVIEW](00-OVERVIEW.md) | E2E picture · 3-stage shell · LoginLayoutComponent |
| [01-PERMISSIONS](01-PERMISSIONS.md) | Pre-auth — no PES. Route guards `otpGuard` + `changePasswordGuard` |
| [02-STAGE_1_GET_STARTED](02-STAGE_1_GET_STARTED.md) | Username + Password form |
| [03-STAGE_2_ENTER_OTP](03-STAGE_2_ENTER_OTP.md) | 6-digit OTP entry · 60s timer · resend |
| [04-STAGE_3_FIRST_LOGIN_PASSWORD](04-STAGE_3_FIRST_LOGIN_PASSWORD.md) | Force-change-password on first login |
| [05-SECTION_IP_ALLOWLIST](05-SECTION_IP_ALLOWLIST.md) | IpAllowlistPreProcessor runs BEFORE credentials |
| [06-SECTION_FLOW_STATE](06-SECTION_FLOW_STATE.md) | AuthFlowStateService (sessionStorage) cross-screen state |
| [07-VALIDATIONS](07-VALIDATIONS.md) | Required fields · OTP completeness · password complexity |
| [08-BACKEND_API](08-BACKEND_API.md) | 9 Identity auth endpoints |
| [09-COMPONENTS](09-COMPONENTS.md) | LoginLayoutComponent + 4 stage components |
| [10-KAFKA_SIDE_EFFECTS](10-KAFKA_SIDE_EFFECTS.md) | OTP send · login attempts · status changes |
| [11-STATE_TRANSITIONS](11-STATE_TRANSITIONS.md) | LoginStepResponse stages · Active vs Pending vs Locked |
| [12-ERROR_STATES](12-ERROR_STATES.md) | Wrong password · 3-strikes lockout · IP block · OTP expired |
| [13-GAPS_AND_DRIFTS](13-GAPS_AND_DRIFTS.md) | PrimeNG InputOtp · SCSS · Q-UM-* opens |
| [14-IMPLEMENTATION_CHECKLIST](14-IMPLEMENTATION_CHECKLIST.md) | Pre-code gate + tasks |
| [PLAYBOOK](PLAYBOOK.md) | Single-doc synthesis |

## Verification gate

1. PRD anchor? → BR-UM-22..29 (Login + OTP + lockout + idle logout)
2. IP allowlist runs BEFORE credentials? → BR-UM-24 (YES)
3. 3-wrong attempts → Locked? → BR-UM-25 (YES, auto)
4. 3-wrong OTP → Locked? → BR-UM-27 (YES, auto)
5. OTP validity? → 60s per BR-UM-26 (code says 120s — drift)
6. 30-min idle logout? → BR-UM-29 (YES)
7. First-login flow? → forces change-password before Active
8. AuthFlowStateService persisted? → sessionStorage

## Hubs

[[Login Flow]] · [[Forgot Password Flow]] · [[Change Password Flow]] · [[02 User Management]] · [[Identity Service]] · [[IMPLEMENTATION_KNOWLEDGE_MAP]]
