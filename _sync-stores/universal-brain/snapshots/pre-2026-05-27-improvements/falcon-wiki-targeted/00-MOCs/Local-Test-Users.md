---
type: reference
role: local-dev-credentials
audience: developers + ai-agents + qa
scope: docker-compose local stack
updated: 2026-05-16
password-policy: "All test users use Admin@1234 (standing rule — feedback_test_user_password_standard.md)"
tenant-id: test-tenant-001
tags: [layer/infra, scope/auth, status/active]
---

> [!tldr]
> Six pre-seeded test users covering the full Falcon role taxonomy (3 system + 3 account). Every user logs in with password **`Admin@1234`**. OTP is disabled in the dev compose so login is single-step. Use these for any local dev / QA flow that needs an authenticated session. Re-runnable from `seed-test-users.sh` after a `down -v`.

# Local Test Users

## Credentials

| Username | Type | Role | Email | Phone | Target App | Gateway |
|---|---|---|---|---|---|---|
| `sysadmin` | 🦅 Falcon | `sys-admin` — System Administrator | sysadmin@falcon.local | +962788090501 | admin-console (`:4204`) | System Gateway (`:7256`) |
| `sysops` | 🦅 Falcon | `sys-ops` — System Operation | sysops@falcon.local | +962788090502 | admin-console (`:4204`) | System Gateway (`:7256`) |
| `sysprod` | 🦅 Falcon | `sys-products` — Products | sysprod@falcon.local | +962788090503 | admin-console (`:4204`) | System Gateway (`:7256`) |
| `accowner` | 👤 Client | `acc-owner` — Account Owner | accowner@falcon.local | +962788090504 | management-console (`:4301`) | Core Gateway (`:7038`) |
| `accadmin` | 👤 Client | `acc-admin` — Node Admin | accadmin@falcon.local | +962788090505 | management-console (`:4301`) | Core Gateway (`:7038`) |
| `accuser` | 👤 Client | `acc-user` — Normal User | accuser@falcon.local | +962788090506 | management-console (`:4301`) | Core Gateway (`:7038`) |

**Password (all six):** `Admin@1234`

Account users belong to tenant `test-tenant-001` (fabricated for testing; no Commerce Account record — account-scoped Commerce APIs may 404).

## Permission summary (post-fix — see [[PES-Subject-Contract]])

| User | Allow count | Deny count | Most user-visible gate |
|---|---|---|---|
| `sysadmin` | 18 | 29 | `app.admin-console/view = allow` |
| `sysops` | 4 | 43 | `app.admin-console/view = allow` (limited inner permissions) |
| `sysprod` | 13 | 34 | `app.admin-console/view = allow` (commerce + wallet only) |
| `accowner` | 28 | 19 | `app.management-console/view = allow` |
| `accadmin` | 15 | 32 | `app.management-console/view = allow` (org + users) |
| `accuser` | 7 | 40 | `app.management-console/view = allow` (contact-group only) |

Full per-resource matrix: `Falcon/Falcon/falcon-essentials/zitadel/pes-verification-2026-05-16.csv` (282 rows).

## How they were created

1. Zitadel human user via `POST /management/v1/users/human/_import`
2. Zitadel metadata (`user-id` = base64(Mongo `_id`), `user-type` = base64("1" or "2"), `tenant-id` = base64(tenantId))
3. Zitadel OTP SMS factor registered (required because OTP can be re-enabled per-env)
4. Mongo document upserted into `FalconIdentityDb.Users` (with `identityUserId` = Zitadel id)
5. PES `g`-rule inserted: `{type:"g", sub:"r:<role>@<ns>", obj:"u:<ZITADEL_ID>@<ns>"}` — see [[PES-Subject-Contract]] for why this MUST be the Zitadel id

## Re-runnable script

```powershell
# After a `docker compose down -v && up -d`:
sh "C:\Falcon\Falcon\Falcon\falcon-essentials\zitadel\seed-test-users.sh"
```

Override the defaults with env vars before invoking:

| Env var | Default | Effect |
|---|---|---|
| `FALCON_TEST_PASSWORD` | `Admin@1234` | Password for all 6 users |
| `FALCON_TEST_TENANT_ID` | `test-tenant-001` | Namespace for the 3 acc-* users |

## Verifying a user logs in

See [[Local-Auth-Recipe]] for the curl-based recipe (login → JWT in one call when OTP is disabled).

Quick smoke:
```bash
curl -sS -X POST http://localhost:7777/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"userName":"sysadmin","password":"Admin@1234"}' \
  | jq '{stage: .result.stage, hasToken: (.result.tokens.accessToken != null)}'
```
Expect `{stage: 4, hasToken: true}`.

## See also

- [[Authorization-Security-MOC]] — how everything connects
- [[Local-Auth-Recipe]] — login curl + JWT decode
- [[Local-Backend-Bring-Up]] — start the stack these users need
- [[PES-Subject-Contract]] — **must-read** before extending the seed script
- [[falcon-core-identity-svc]] — login flow internals
- `_mounts/memory/feedback_test_user_password_standard.md` — standing rule on `Admin@1234`
- `_mounts/memory/project_local_backend_test_users_2026_05_16.md` — full session log

## Standing rule on test-user passwords

🔴 Every test/seed user in every Falcon env uses password **`Admin@1234`** — no exceptions. If a script defaults to something else, fix the script.

Source: `_mounts/memory/feedback_test_user_password_standard.md`.
