# SecurityController — Errors

> One endpoint, one error. Simplest of the four controllers.

## Per-endpoint error catalog

### 1. GET /api/security/user-status/{IdentityUserId}

| Code           | HTTP | Source                                  | Notes |
|---|---|---|---|
| `UserNotFound` | 404  | `CheckUserStatusEndpoint.cs:32`         | User not found, OR found but `IsDeleted=true`. Indistinguishable to caller. |

No other error paths exist:
- Validation: none — no validator.
- Domain policies: none.
- External services: none (read-only cache + Mongo).
- HybridCache failures: bubble up as 500 generic.

## Cache-staleness considerations (not errors, but caller-visible)

The cached response may be **up to TTL stale** if any of these paths failed to invalidate:

| Mutation path                  | Invalidates? | File:line |
|---|---|---|
| Admin `PUT /user/status`       | ✓            | `ChangeUserStatusProcess.cs:72` |
| Login lockout (BR-UM-25)       | ✓            | `LoginProcess.cs:54` |
| OTP lockout                    | ✓            | `VerifyOtpProcess.cs:118` |
| OTP resend limit lockout       | (via webhook) | `ResendOtpProcess` locks Zitadel → webhook fires |
| Zitadel webhook event          | ✓            | `ZitadelWebhookEndpoint.cs:78` |
| Direct Mongo update (not via handlers) | ✗     | — danger if anyone bypasses the handlers |

A reactive caller (gateway short-circuit) that trusts a stale `Active` response could grant access
to a just-locked user for up to one TTL window. Recommend gateway to also verify status on
authentication-critical operations, not just on JWT issuance.

## HTTP status mapping

| Status | Codes                  |
|---|---|
| 200    | success                |
| 404    | `UserNotFound`         |
| 500    | unhandled exceptions   |
