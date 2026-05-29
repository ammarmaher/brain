*** Login — Backend API ***
*** 2026-05-18 ***

# Login — Backend API

## Endpoint summary

[BRAIN-OUT] `Brain Outputs/understanding/backend/identity/ENDPOINT_REGISTRY.md:7-20`:

| Method | Path | Request | Response | Throttle |
|---|---|---|---|---|
| POST | `/api/auth/login` | `LoginRequest { Username, Password }` | `LoginStepResponse` | 10/60s |
| POST | `/api/auth/verify-otp` | `VerifyOtpRequest { SessionId, Code }` | `LoginStepResponse` | 10/60s |
| POST | `/api/auth/resend-otp` | `ResendOtpRequest { SessionId }` | `LoginStepResponse` | 5/60s |
| POST | `/api/auth/first-login` | `FirstLoginSetupRequest { SessionId, NewPassword }` | `LoginStepResponse` | 5/60s |
| POST | `/api/auth/logout` | `LogoutRequest` | `null` | 10/60s |
| POST | `/api/auth/refresh-token` | `RefreshTokenRequest` | `AuthenticatedResult` | 20/60s |
| POST | `/api/auth/forgot-password` | (see forgot-password folder) | `LoginStepResponse` | 5/60s |
| POST | `/api/auth/forgot-password/set-password` | (see forgot-password folder) | `bool` | 5/60s |
| POST | `/api/auth/set-password` | `SetPasswordRequest` | `bool` | 5/60s |

All `AllowAnonymous` (pre-auth).

## LoginStepResponse shape

```jsonc
{
  "sessionId": "<uuid>",
  "nextStage": "EnterOtp" | "FirstLogin" | "Complete",
  "data": {
    "phoneNumberMasked": "+966 *** 1234",
    "emailMasked": "u***@example.com",
    "passwordSecurityLevel": "Normal" | "Advanced",
    /* stage-specific */
  }
}
```

For nextStage='Complete', `data` also includes:
- `accessToken`
- `refreshToken`
- `userInfo`

## Gateway routing

`auth/*` → Identity Gateway (or Core Gateway routing to Identity).

## Tenant resolution

Pre-processor resolves tenant from `Username` for `/login`, or from `SessionId` for OTP/firstlogin endpoints.

## See also

- [00-OVERVIEW](00-OVERVIEW.md) · [05-SECTION_IP_ALLOWLIST](05-SECTION_IP_ALLOWLIST.md) · [10-KAFKA_SIDE_EFFECTS](10-KAFKA_SIDE_EFFECTS.md)
