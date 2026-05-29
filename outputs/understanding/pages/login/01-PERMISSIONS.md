*** Login — Permissions ***
*** Pre-auth · 2026-05-18 ***

# Login — Permissions

## No PES checks

[CODE] `Brain Outputs/datasets/old-ui-dataset/10-pages/host-shell/auth/05-PES.md`: "0 permission checks (all screens are pre-auth)".

## Route guards

| Route | Guard | Effect |
|---|---|---|
| `/login` | (none) | Anyone can access |
| `/login/verify-otp` | `otpGuard` | Redirect to `/login` if no active SessionId in AuthFlowStateService |
| `/login/change-password` | `changePasswordGuard` | Redirect to `/login` if no active SessionId with FirstLogin stage |

[CODE] `apps/host-shell/src/app/features/auth/guards/`.

## Throttling (backend)

[BRAIN-OUT] Identity Auth endpoints throttled:

| Endpoint | Rate |
|---|---|
| `/login` | 10 per 60s |
| `/verify-otp` | 10 per 60s |
| `/resend-otp` | 5 per 60s |
| `/forgot-password` | 5 per 60s |
| `/first-login` | 5 per 60s |
| `/set-password` | 5 per 60s |
| `/logout` | 10 per 60s |
| `/refresh-token` | 20 per 60s |

Throttle key = username (for login) OR sessionId (for OTP-based steps).

## IP allowlist check

[PRD] BR-UM-24: IP check runs BEFORE credentials. Backend `IpAllowlistPreProcessor` returns generic error (no info leak) on IP block.

## See also

- [00-OVERVIEW](00-OVERVIEW.md) · [05-SECTION_IP_ALLOWLIST](05-SECTION_IP_ALLOWLIST.md)
