---
type: reference
cluster: 100-Authority
title: Test Users — 6 pre-seeded users
projection-source: _mounts/brain-outputs/datasets/authority-dataset/07-cross-cutting/test-users.md
code-source: Falcon/falcon-essentials/zitadel/seed-test-users.sh
verified-at: 2026-05-16
purpose: "Answers 'which 6 pre-seeded test users exist (3 sys-* + 3 acc-*) + credentials + namespace + how to reseed'. Open before any manual role-gated testing."
---

> [!tldr]
> 6 pre-seeded test users on the local stack — 3 Falcon staff (System namespace) + 3 Client tenant (test-tenant-001 namespace). Password for all: `Admin@1234`. Reseed via `seed-test-users.sh`. Idempotent / re-runnable.

# Test Users

## The 6 users

### Falcon staff (System namespace, no tenant)

| Username | Role | Email | Phone |
|---|---|---|---|
| `sysadmin` | sys-admin | sysadmin@falcon.local | +962788090501 |
| `sysops` | sys-ops | sysops@falcon.local | +962788090502 |
| `sysprod` | sys-products | sysprod@falcon.local | +962788090503 |

### Client tenant (test-tenant-001)

| Username | Role | Email | Phone |
|---|---|---|---|
| `accowner` | acc-owner | accowner@falcon.local | +962788090504 |
| `accadmin` | acc-admin | accadmin@falcon.local | +962788090505 |
| `accuser` | acc-user | accuser@falcon.local | +962788090506 |

## Credentials

- Password (every user, every env): `Admin@1234`
- Tenant id: `test-tenant-001` (override via `FALCON_TEST_TENANT_ID`)
- Status: `Active` (2)
- Email + Phone: verified
- OTP-SMS factor: registered

## Login curl

```bash
# Path A — OTP off (dev mode returns devOtpCode inline)
curl -X POST http://localhost:7777/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"accowner","password":"Admin@1234"}'

# Path B — OTP on (2-step)
# Step 1: { "stage": "OtpPending", "sessionId": "...", "devOtpCode": "123456" }
# Step 2:
curl -X POST http://localhost:7777/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"sessionId":"...","otp":"123456"}'
```

## Verify PES decision

```bash
TOKEN="<JWT from login>"
curl http://localhost:5296/pes/authorize \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"sub":"u:<JWT.sub>@<tenant-id>","obj":"app.management-console","action":"view"}'
# expect: {"effect":"allow"} for acc-* users
```

## Reseed

```bash
cd Falcon/falcon-essentials/zitadel
./seed-test-users.sh
```

## See also

- [[Roles]] — what each test user can do
- [[Session-Shape]] — JWT decoding for these users
- [Brain Outputs / test-users.md](../_mounts/brain-outputs/datasets/authority-dataset/07-cross-cutting/test-users.md) — full operational detail
- [[Local-Test-Users]] — sister-cluster note
- [[Local-Auth-Recipe]] — sister-cluster note (full curl)
