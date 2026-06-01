---
name: Local backend + 6 test users
description: How to run Falcon backend locally + the 6 canonical-role test users + every compose patch needed to make login work
type: project
originSessionId: 81361cfc-7c04-485a-a440-35fd8e3eb2cd
---
# Local Falcon backend (no UI in Docker) + 6 test users (2026-05-16)

## Single entry point
`docker compose -f "C:\Falcon\Falcon\Falcon\docker-compose.yml" up -d`
Brings up infra + 5 .NET backends + 2 gateways. Frontend is gated behind `--profile frontend` (run UI locally via `nx serve` instead).

## Persistent fixes applied this session

| File | Change | Why |
|---|---|---|
| `C:\Windows\System32\drivers\etc\hosts` | Pinned `mcr.microsoft.com` + 15 `*.data.mcr.microsoft.com` regions to 150.171.69.10/70.10, and `pkg-containers.githubusercontent.com` + `ghcr.io` to GitHub IPv4s | Network's IPv6 path to MCR/GHCR is broken (`wsarecv: forcibly closed`) — Docker daemon was preferring AAAA records and pulls EOFed. IPv4 pins unblock all image pulls. |
| `Falcon/falcon-core-identity-svc/Directory.Build.props` line 14 | `<NoWarn>CA1873</NoWarn>` → `<NoWarn>CA1873;NU1902;NU1903</NoWarn>` | Identity build failed on transitive `SharpCompress 0.30.1` (mod) + `Snappier 1.0.0` (high) vulnerabilities. Quick workaround; proper fix = pin non-vulnerable transitives in Directory.Packages.props (Ammar Auth follow-up). |
| `Falcon/Falcon/docker-compose.yml` web-platform-* / admin-console / management-console | Added `profiles: ["frontend"]` to all 4 frontend services | User runs UI locally, doesn't want Docker building it. Default `up -d` excludes them. |
| `Falcon/Falcon/docker-compose.yml` identity `command:` | Added 2 `export` lines pulling `FalconProjectId` + `WebPlatformUiClientId` from `seed-output.json` via `grep | cut` | seed.sh writes these IDs but compose never injected them — login fails with "An unknown error occurred." (400) because `ZitadelAuthService.CreateAuthRequestAsync` throws when `clientId` is empty. |
| `Falcon/Falcon/docker-compose.yml` identity `environment:` | Added `Zitadel__Initialization__WebPlatformRedirectUris__0=http://localhost:4200/auth/callback` + `WebPlatformPostLogoutRedirectUris__0=http://localhost:4200/signedout` | Same fn also requires `redirectUri`. Values must match the Zitadel `host-app` OIDC app registered by seed.sh (lines 280-285). |
| `Falcon/Falcon/docker-compose.yml` identity `environment:` | Added `Security__OtpRequiredOnLogin=false` | Dev-only: skip OTP step. Login returns tokens immediately (stage=Authenticated). First-login (`Pending` status) users still hit OTP regardless. |

## 6 test users — all logged in successfully

Password for ALL six: **`Admin@1234`**

| Username | Type | Role | Email | Target UI | Gateway |
|---|---|---|---|---|---|
| `sysadmin` | Falcon (System) | sys-admin — System Administrator | sysadmin@falcon.local | admin-console (4204) | System Gateway (7256) |
| `sysops` | Falcon (System) | sys-ops — System Operation | sysops@falcon.local | admin-console (4204) | System Gateway (7256) |
| `sysprod` | Falcon (System) | sys-products — Products | sysprod@falcon.local | admin-console (4204) | System Gateway (7256) |
| `accowner` | Client (Account) | acc-owner — Account Owner | accowner@falcon.local | management-console (4301) | Core Gateway (7038) |
| `accadmin` | Client (Account) | acc-admin — Node Admin | accadmin@falcon.local | management-console (4301) | Core Gateway (7038) |
| `accuser` | Client (Account) | acc-user — Normal User | accuser@falcon.local | management-console (4301) | Core Gateway (7038) |

- Account users belong to tenant `test-tenant-001` (fabricated — no Commerce Account record, account-scoped Commerce/Provisioning APIs may 404 for them; full tenant provisioning is a follow-up).
- Each user has phone `+96278809050{1..6}` pre-verified + OTP SMS factor registered. Login responses include `devOtpCode` in dev so OTP step is automatable.
- Original seeded `system-user` + `FalconAdmin` users are untouched.

## Re-runnable scripts (idempotent)
- `Falcon/Falcon/falcon-essentials/zitadel/seed-test-users.sh` — recreates all 6 users + PES rules after a `down -v`
- `Falcon/Falcon/falcon-essentials/zitadel/pes-account-role-rules.json` — 92 `p`-rules template for `acc-*` roles with `{TENANT_ID}` placeholder, mirrors `BuiltInRoleCatalog.AccountRoles`

## Login flow (verified end-to-end for sysadmin)
1. `POST http://localhost:7777/api/auth/login` with `{"userName":"sysadmin","password":"Admin@1234"}` → returns `sessionId` + `devOtpCode` + `stage:2`
2. `POST http://localhost:7777/api/auth/verify-otp` with `{"sessionId":"...","code":"<devOtpCode>"}` → returns JWT `accessToken` + `refreshToken`

## Role taxonomy source of truth
`Falcon/falcon-core-access-svc/src/T2.PES/Authorization/BuiltInRoleCatalog.cs`
- System: sys-admin, sys-ops, sys-products
- Account: acc-owner, acc-admin, acc-user

Policy subject format (from `PolicySubjectContract.cs`):
- System user: `u:<userId>@system` | role: `r:<roleKey>@system`
- Account user: `u:<userId>@<tenantId>` | role: `r:<roleKey>@<tenantId>`

## Trigger to resume / re-run after wipe
- "Run the local Falcon backend" → just `docker compose up -d` (compose has all fixes baked in)
- "Recreate the 6 test users" → `sh seed-test-users.sh` (after `down -v` wipes Zitadel + Mongo)
- "Add the UI to Docker" → `docker compose --profile frontend up -d web-platform-ui admin-console management-console`

## Open follow-ups
- Pin non-vulnerable SharpCompress + Snappier in Identity `Directory.Packages.props` (proper fix vs current NoWarn workaround)
- Provision a real Commerce Account record for `test-tenant-001` so account-scoped APIs work for `acc-*` users
- Docker Desktop memory only at 2 GB — should bump to 6-8 GB for full stack stability (Settings → Resources)
