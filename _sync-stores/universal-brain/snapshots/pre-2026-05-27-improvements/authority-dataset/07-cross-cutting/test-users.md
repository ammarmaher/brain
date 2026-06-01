---
type: cross-cutting
topic: test-users
purpose: "Answers 'which 6 pre-seeded users exist on local dev + their credentials, roles, namespaces, tenant ids'. Open when manually testing any role-gated feature or reseeding Zitadel."
source: Falcon/falcon-essentials/zitadel/seed-test-users.sh
---

# Test Users — local dev / verification

> [!tldr]
> 6 pre-seeded users on the local stack — 3 Falcon staff (sys-*) and 3 Client tenant users (acc-* on `test-tenant-001`). All use password `Admin@1234`. Reseed via `seed-test-users.sh`. Re-runnable / idempotent.

## The 6 users

### System (Falcon) — namespace `system`, `tenantId: ""`, `userType: 1`

| Username | First | Last | Email | Phone | Role | Role int |
|---|---|---|---|---|---|---|
| `sysadmin` | Sys | Admin | sysadmin@falcon.local | +962788090501 | `sys-admin` | 1 |
| `sysops` | Sys | Ops | sysops@falcon.local | +962788090502 | `sys-ops` | 3 |
| `sysprod` | Sys | Product | sysprod@falcon.local | +962788090503 | `sys-products` | 2 |

### Account (Client) — namespace = tenant id `test-tenant-001`, `userType: 2`

| Username | First | Last | Email | Phone | Role | Role int |
|---|---|---|---|---|---|---|
| `accowner` | Acc | Owner | accowner@falcon.local | +962788090504 | `acc-owner` | 4 |
| `accadmin` | Acc | Admin | accadmin@falcon.local | +962788090505 | `acc-admin` | 5 |
| `accuser` | Acc | User | accuser@falcon.local | +962788090506 | `acc-user` | 6 |

## Standing facts

- **Password (every user, every env)**: `Admin@1234`. See `seed-test-users.sh:28` default.
- **Tenant ID (env override)**: `FALCON_TEST_TENANT_ID`, defaults to `test-tenant-001`.
- **All users seeded with**: `eUserStatus.Active = 2`, `isEmailVerified: true`, `isPhoneVerified: true`, OTP-SMS factor registered.
- **PES `g`-rule subject**: `u:<ZitadelUserId>@<ns>` — NOT Mongo `_id`. See [[../00-INDEX]] standing rules.

## Login curl (Path A — OTP off, dev mode)

```bash
curl -X POST http://localhost:7777/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"accowner","password":"Admin@1234"}'

# Response includes:
# { "stage": "Authenticated", "token": "<JWT>", "devOtpCode": "..." }
```

## Login curl (Path B — OTP on)

```bash
# Step 1: password
curl -X POST http://localhost:7777/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"accowner","password":"Admin@1234"}'

# Response: { "stage": "OtpPending", "sessionId": "...", "devOtpCode": "123456" }

# Step 2: OTP
curl -X POST http://localhost:7777/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"sessionId":"...","otp":"123456"}'

# Response: { "stage": "Authenticated", "token": "<JWT>" }
```

## What the JWT carries

Decoded JWT claims for `accowner`:
- `sub` = Zitadel user id (e.g. `342167530844749827`)
- `urn:zitadel:iam:user:metadata:user-id` = Mongo `_id` of Identity Users doc
- `urn:zitadel:iam:user:metadata:user-type` = `2` (Client)
- `urn:zitadel:iam:user:metadata:tenant-id` = `test-tenant-001`
- `iss` = Zitadel issuer
- `exp`, `iat`, etc.

## Verification ping (sys-admin can hit admin-console)

```bash
TOKEN="<JWT from sysadmin>"
curl http://localhost:5296/pes/authorize \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"sub":"u:<JWT.sub>@system","obj":"app.admin-console","action":"view"}'

# Expect: {"effect":"allow"}
```

For `accowner` the same call returns `{"effect":"deny"}` — see [[../01-roles/acc-owner]].

## Reseed protocol

```bash
cd Falcon/falcon-essentials/zitadel
./seed-test-users.sh
```

The script is idempotent — every step checks for existence first and skips if present. Safe to re-run on a dirty stack.

## See also

- [[../01-roles/sys-admin]] · [[../01-roles/sys-ops]] · [[../01-roles/sys-products]]
- [[../01-roles/acc-owner]] · [[../01-roles/acc-admin]] · [[../01-roles/acc-user]]
- [[session-shape]] — JWT structure detail
