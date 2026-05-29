*** Login — Overview ***
*** 2026-05-18 ***

# Login — Overview

> Multi-stage pre-auth flow: GetStarted (username+password) → EnterOtp (OTP verify) → optionally ChangePassword (forced for first-login). All hosted inside `LoginLayoutComponent` (branding chrome). State persisted cross-stage via `AuthFlowStateService` (sessionStorage). Backend on Identity Service `/api/auth/*`.

## Source-of-truth

- [PRD] PRD-02 BUSINESS_RULES (BR-UM-22..29) · `Brain Outputs/prd/modules/02-user-management/BUSINESS_RULES.md`
- [BRAIN-OUT] Identity ENDPOINT_REGISTRY · `Brain Outputs/understanding/backend/identity/ENDPOINT_REGISTRY.md:7-20` (Auth endpoints)
- [CODE] Old-UI · `apps/host-shell/src/app/features/auth/`
- [CODE] Old-UI dossier · `Brain Outputs/datasets/old-ui-dataset/10-pages/host-shell/auth/`

## Trigger / entry

- **Route:** `/login` (within host-shell)
- **Layout:** `LoginLayoutComponent` (5-col card with notch)
- **Pre-condition:** unauthenticated (auth interceptor would redirect logged-in users elsewhere)

## The stages

| Stage | Route | Component | Endpoint |
|---|---|---|---|
| 1 | `/login` | `GetStartedComponent` | `POST /api/auth/login` |
| 2 | `/login/verify-otp` (guarded by `otpGuard`) | `EnterOtpComponent` | `POST /api/auth/verify-otp` |
| 3 | `/login/change-password` (guarded by `changePasswordGuard`) | `ChangePasswordComponent` (first-login variant) | `POST /api/auth/first-login` |

## Sequence

```
[/login] GetStarted
   │ User enters username + password
   │
   ▼ POST /api/auth/login { Username, Password }
   │
   │ (BR-UM-24) BACKEND runs IpAllowlistPreProcessor FIRST
   │   - If IP not on tenant allowlist → reject (generic)
   │   - If credentials wrong → 3-strike lockout per BR-UM-25
   │
   ▼ Response: LoginStepResponse
   │   - SessionId
   │   - NextStage: 'EnterOtp' | 'FirstLogin' | 'Complete'
   │
   ▼ AuthFlowStateService.setSession(sessionId)
   │
   ├─ NextStage='EnterOtp' → navigate /login/verify-otp
   │     │
   │     ▼ User enters 6-digit code
   │     │
   │     ▼ POST /api/auth/verify-otp { SessionId, Code }
   │     │
   │     │ (BR-UM-27) 3-wrong OTP OR resend-counts → Locked
   │     │ (BR-UM-26) 60s OTP validity (code: 120s drift)
   │     │
   │     ▼ Response: LoginStepResponse
   │     │
   │     ├─ NextStage='Complete' → handleLoginSuccess
   │     │     │
   │     │     ▼ Store tokens · navigate to redirectUrl
   │     │
   │     └─ NextStage='FirstLogin' → navigate /login/change-password
   │           │
   │           ▼ User enters new password
   │           │
   │           ▼ POST /api/auth/first-login { SessionId, NewPassword }
   │           │
   │           ▼ Response: LoginStepResponse(Complete) → store tokens
   │
   └─ NextStage='FirstLogin' → navigate /login/change-password (skip OTP path? OPEN)
```

## Status-aware login (per BR-UM-23)

| User status | Login result |
|---|---|
| Pending | First-login path forced (change password before Active) |
| Active | Regular path → OTP → Complete |
| Suspended | Reject: "Your account is suspended; contact admin" |
| Locked | Reject: "Your account is locked; contact admin" |
| Deleted | Generic reject (no info leak) |

## See also

- [01-PERMISSIONS](01-PERMISSIONS.md) · [02-STAGE_1_GET_STARTED](02-STAGE_1_GET_STARTED.md) · [05-SECTION_IP_ALLOWLIST](05-SECTION_IP_ALLOWLIST.md) · [06-SECTION_FLOW_STATE](06-SECTION_FLOW_STATE.md) · [08-BACKEND_API](08-BACKEND_API.md) · [11-STATE_TRANSITIONS](11-STATE_TRANSITIONS.md)

## Hubs

[[02 User Management]] · [[Identity Service]] · [[Forgot Password Flow]] · [[Change Password Flow]]
