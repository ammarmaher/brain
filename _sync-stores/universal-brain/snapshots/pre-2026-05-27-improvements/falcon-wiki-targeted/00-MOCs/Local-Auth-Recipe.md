---
type: reference
role: developer-recipe
audience: developers + qa + ai-agents
scope: local-dev only
updated: 2026-05-16
tags: [layer/backend, scope/auth, status/active]
---

> [!tldr]
> Copy-pasteable curl recipe for obtaining a Falcon JWT in local dev. Two paths: **OTP-disabled** (single step, returns tokens immediately — what the dev compose ships with) and **OTP-enabled** (two steps with `devOtpCode`). Use the JWT against any backend `Authorization: Bearer ...` endpoint.

# Local Auth Recipe

## Prerequisites

1. Backend running: see [[Local-Backend-Bring-Up]]
2. Test user exists with known password: see [[Local-Test-Users]]
3. Identity Service reachable at `http://localhost:7777`

## Path A — OTP-disabled (default in dev compose)

Single POST returns the JWT directly. This is the default — `Security__OtpRequiredOnLogin: "false"` is set in `docker-compose.yml`.

```bash
# Get a JWT for sysadmin
curl -sS -X POST http://localhost:7777/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"userName":"sysadmin","password":"Admin@1234"}' \
  | jq '.result.tokens.accessToken' -r
```

Response shape:
```json
{
  "isSuccessful": true,
  "result": {
    "sessionId": null,
    "stage": 4,                              // Authenticated
    "requiresOtp": false,
    "requiresPasswordChange": false,
    "tokens": {
      "accessToken": "eyJhbGc…",             // ← the JWT you want
      "refreshToken": "PxJxA…",
      "idToken": "eyJ…",
      "expiresIn": 1800
    }
  },
  "errorMessages": []
}
```

## Path B — OTP-enabled (when `Security__OtpRequiredOnLogin` is `true` or user is Pending)

Two POSTs: step 1 returns `sessionId` + `devOtpCode`, step 2 finalizes.

```bash
# Step 1 — password
R=$(curl -sS -X POST http://localhost:7777/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"userName":"sysadmin","password":"Admin@1234"}')

SID=$(echo "$R" | jq -r .result.sessionId)
OTP=$(echo "$R" | jq -r .result.devOtpCode)   # exposed in dev only

# Step 2 — OTP
curl -sS -X POST http://localhost:7777/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d "{\"sessionId\":\"$SID\",\"code\":\"$OTP\"}" \
  | jq '.result.tokens.accessToken' -r
```

## Using the JWT

```bash
TOKEN=$(curl -sS -X POST http://localhost:7777/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"userName":"sysadmin","password":"Admin@1234"}' \
  | jq -r .result.tokens.accessToken)

# Call any gateway / backend
curl -sS http://localhost:7256/api/whatever \
  -H "Authorization: Bearer $TOKEN"
```

## Decoding the JWT (what the claims tell you)

```bash
echo "$TOKEN" | cut -d. -f2 | base64 -d 2>/dev/null | jq
```

Key claims:
| Claim | Meaning | Used by |
|---|---|---|
| `sub` | Zitadel user-id | **FE builds PES subject from this** — see [[PES-Subject-Contract]] |
| `client_id` | OIDC client (host-app) | Token audience validation |
| `aud[]` | Project + service ids | Backend audience validation |
| `iss` | `http://localhost:8080` | Token issuer = Zitadel |
| `exp` / `iat` / `nbf` | Lifetimes | 30 min access, 14 day refresh |
| `urn:zitadel:iam:user:metadata.user-id` | base64(Mongo `_id`) | Identity-side lookups (NOT for PES) |
| `urn:zitadel:iam:user:metadata.user-type` | base64("1" = Falcon, "2" = Client) | FE routing to admin vs management console |
| `urn:zitadel:iam:user:metadata.tenant-id` | base64(tenantId) | FE namespace for `acc.*` PES queries |

## Refreshing a token

```bash
curl -sS -X POST http://localhost:7777/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d "{\"refreshToken\":\"$REFRESH\"}" \
  | jq .result.tokens
```

## Logging out (revoke)

```bash
curl -sS -X POST http://localhost:7777/api/auth/logout \
  -H "Authorization: Bearer $TOKEN"
```

## Common errors and their meanings

| HTTP | Body | Likely cause | Fix |
|---|---|---|---|
| 400 | `"An unknown error occurred."` | Identity missing `WebPlatformUiClientId` / `WebPlatformRedirectUris` env | See [[Local-Backend-Bring-Up]] compose patches |
| 401 | `"Invalid username or password."` | Wrong creds | Use `Admin@1234` (see [[Local-Test-Users]]) |
| 423 | `"User is locked."` | Too many failed attempts | Wait, or reset in Zitadel mgmt |
| 200 + `stage: 3` | needs password change | First-login users | call `/api/auth/set-password` |
| 200 + `stage: 2` | OTP required | `Security__OtpRequiredOnLogin: "true"` | use `devOtpCode` from response (Path B) |

## See also

- [[Authorization-Security-MOC]] — the full picture
- [[Local-Test-Users]] — all 6 users + roles
- [[PES-Subject-Contract]] — what `JWT.sub` means downstream
- [[falcon-core-identity-svc]] — login flow internals + endpoint catalog
- [[Local-Backend-Bring-Up]] — start the stack first
