---
type: reference
cluster: 40-Authority
title: Test Users — 6 pre-seeded users
projection-source: C:\Falcon\Brain Outputs\datasets\authority-dataset\07-cross-cutting\test-users.md
code-source: Falcon/falcon-essentials/zitadel/seed-test-users.sh
verified-at: 2026-05-16
purpose: "Answers 'which 6 pre-seeded test users exist (3 sys-* + 3 acc-*) + credentials + namespace + how to reseed'. Open before any manual role-gated testing."
---

> [!tldr]
> 6 pre-seeded test users on the local stack — 3 Falcon staff + 3 Client tenant on `test-tenant-001`. Password for all: `Admin@1234`. Reseed via `seed-test-users.sh`.

# Test Users

## The 6 users

| Username | Role | Namespace | Email | Phone |
|---|---|---|---|---|
| `sysadmin` | sys-admin | system | sysadmin@falcon.local | +962788090501 |
| `sysops` | sys-ops | system | sysops@falcon.local | +962788090502 |
| `sysprod` | sys-products | system | sysprod@falcon.local | +962788090503 |
| `accowner` | acc-owner | test-tenant-001 | accowner@falcon.local | +962788090504 |
| `accadmin` | acc-admin | test-tenant-001 | accadmin@falcon.local | +962788090505 |
| `accuser` | acc-user | test-tenant-001 | accuser@falcon.local | +962788090506 |

## Login curl

```bash
curl -X POST http://localhost:7777/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"accowner","password":"Admin@1234"}'
```

## Verify PES decision

```bash
curl http://localhost:5296/pes/authorize \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"sub":"u:<JWT.sub>@<tenant-id>","obj":"app.management-console","action":"view"}'
```

## Reseed

```bash
cd Falcon/falcon-essentials/zitadel
./seed-test-users.sh
```

## See also

- [[Roles]] — what each test user can do
- [[Session-Shape]] — JWT decoding for these users
- Brain Outputs: `C:\Falcon\Brain Outputs\datasets\authority-dataset\07-cross-cutting\test-users.md`
