---
type: reference
role: ops-runbook
audience: developers + ai-agents + qa
scope: local-dev only
updated: 2026-05-16
tags: [layer/infra, scope/auth, status/active]
---

> [!tldr]
> Single command `docker compose up -d` from `C:\Falcon\Falcon\Falcon\` brings up infra + all 5 .NET backends + 2 gateways (16 containers). Frontend is gated behind `--profile frontend` so plain `up` excludes the 3 Angular apps — serve UI locally via `nx serve` instead. This MOC documents the compose, every patch that landed during 2026-05-16, the gotchas, and the recovery procedure.

# Local Backend Bring-Up

## TL;DR commands

```powershell
# Start backend stack (16 containers, ~3-5 min cold)
docker compose -f "C:\Falcon\Falcon\Falcon\docker-compose.yml" up -d

# After down -v wipe — recreate the 6 test users + PES rules
sh "C:\Falcon\Falcon\Falcon\falcon-essentials\zitadel\seed-test-users.sh"

# Optionally add the UI containers (3 Angular apps on 4200/4204/4301)
docker compose -f "C:\Falcon\Falcon\Falcon\docker-compose.yml" --profile frontend up -d

# Tail any service
docker compose -f "C:\Falcon\Falcon\Falcon\docker-compose.yml" logs -f identity

# Full reset (wipes Mongo, Postgres, Zitadel, MinIO, Redis volumes)
docker compose -f "C:\Falcon\Falcon\Falcon\docker-compose.yml" down -v
```

## Container roll-call (default profile — backend only)

| Container | Port | Healthcheck | Purpose |
|---|---|---|---|
| `mongo` | 27017 | mongosh ping | Primary data store |
| `mongo-init` | — | one-shot | Initialize `rs0` replica set |
| `mongo-express` | 8081 | basic-auth | Mongo UI (`mongoexpressuser` / `mongoexpresspass`) |
| `postgres` | 5432 | pg_isready | Zitadel DB |
| `redis` | 6379 | redis-cli ping | Identity session cache |
| `minio` / `minio-init` | 9000/9001 | mc ready | Contact-group S3 |
| `zookeeper` | 2181 | — | Kafka coordination |
| `kafka` | 9092 | kafka-topics --list | Event bus |
| `schema-registry` | 8085 | /subjects | Avro schemas |
| `kafka-init` | — | one-shot | Create 14 Falcon topics |
| `zitadel` | 8080, 3000 | /app/zitadel ready | Identity provider (mgmt API + Login UI) |
| `zitadel-login` | — | — | Login UI (network: zitadel) |
| `zitadel-seed` | — | one-shot | Org + Project + host-app + system-user + webhook |
| `zitadel-config` | — | one-shot | Inject seed values into appsettings |
| `pes` | 5296 | /pes/health | PBAC engine ([[falcon-core-access-svc]]) |
| `pes-bootstrap` | — | one-shot | Wire sys-admin policy rule for system-user |
| `identity` | 7777 | — | Auth + user lifecycle ([[falcon-core-identity-svc]]) |
| `commerce` | 7045 | — | Accounts, orders, wallets |
| `charging` | 7224 | — | Wallet operations, billing |
| `provisioning` | 7163 | — | Service subscriptions |
| `contact-group` | 7300 | — | Contact lists |
| `core-gateway` | 7038 | — | YARP — client API surface |
| `system-gateway` | 7256 | — | YARP — Falcon admin API surface |

## Bring-up dependency graph

```
mongo + postgres + redis + zookeeper + minio    →  healthy
kafka                                            →  healthy
kafka-init                                       →  topics created
zitadel                                          →  healthy + writes PATs
zitadel-seed                                     →  creates org/project/host-app/system-user/webhook
zitadel-config                                   →  injects seed into Identity appsettings
pes                                              →  healthy
pes-bootstrap                                    →  links system-user to sys-admin
identity, commerce, charging, provisioning,
contact-group                                    →  start (no healthcheck — see "verify" below)
core-gateway, system-gateway                     →  start
```

## Patches applied 2026-05-16 (all baked into `docker-compose.yml` on disk)

### 1. Frontend profile gate

All 4 frontend services (`web-platform-deps`, `web-platform-ui`, `admin-console`, `management-console`) carry `profiles: ["frontend"]`. Default `up -d` skips them — UI runs locally via `nx serve`.

### 2. Identity — 4 env additions

| Env var | Source | Why |
|---|---|---|
| `Zitadel__Initialization__FalconProjectId` | exported from `seed-output.json` via `grep \| cut` in `command:` | OIDC token audience — empty → `CreateAuthRequestAsync` throws `UnknownError` |
| `Zitadel__Initialization__WebPlatformUiClientId` | same | Host-app client id — same effect |
| `Zitadel__Initialization__WebPlatformRedirectUris__0` | static `http://localhost:4200/auth/callback` | Must match `seed.sh` host-app `redirectUris[0]` — same effect |
| `Zitadel__Initialization__WebPlatformPostLogoutRedirectUris__0` | static `http://localhost:4200/signedout` | Logout endpoint |
| `Security__OtpRequiredOnLogin` | static `"false"` | Dev only — skip OTP step (see [[Local-Auth-Recipe]] Path A) |

### 3. Identity — Directory.Build.props NoWarn

`falcon-core-identity-svc/Directory.Build.props` line 14:
```diff
- <NoWarn>CA1873</NoWarn>
+ <NoWarn>CA1873;NU1902;NU1903</NoWarn>
```

Reason: transitive `SharpCompress 0.30.1` (moderate) + `Snappier 1.0.0` (high) tripped NuGet audit with `TreatWarningsAsErrors=true`. Quick unblock; proper fix is to override the vulnerable transitives in `Directory.Packages.props` ([[falcon-core-identity-svc]] open follow-up).

### 4. Windows hosts file — IPv4 pins for MCR + GHCR

`C:\Windows\System32\drivers\etc\hosts` has pins for:
- `mcr.microsoft.com` → 150.171.69.10
- 15 `*.data.mcr.microsoft.com` regional CDNs → 150.171.70.10
- `pkg-containers.githubusercontent.com` → 185.199.108.154
- `ghcr.io` → 140.82.121.34

Reason: this machine's IPv6 path to MCR + GHCR returns `wsarecv: forcibly closed by remote host`. Docker daemon was preferring AAAA records and all `dotnet/sdk:10.0` / `zitadel:v4.13.1` pulls EOFed. IPv4 pins unblock all image pulls.

### 5. Compose validation

```powershell
docker compose -f "C:\Falcon\Falcon\Falcon\docker-compose.yml" config --services
```
Expect: 24 backend services. NOT in list: `web-platform-deps`, `web-platform-ui`, `admin-console`, `management-console` (those need `--profile frontend`).

## Verify everything came up

```powershell
docker compose -f "C:\Falcon\Falcon\Falcon\docker-compose.yml" ps --format "table {{.Service}}`t{{.Status}}"
```

Expect 16 containers `Up` — infra ones say `(healthy)`, .NET ones just say `Up` (no healthcheck registered).

End-to-end smoke:
```bash
# PES alive
curl -sS http://localhost:5296/pes/health         # → 200 OK

# Zitadel ready
curl -sS http://localhost:8080/debug/healthz       # → 200 OK

# Login (1 step, OTP disabled)
curl -sS -X POST http://localhost:7777/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"userName":"sysadmin","password":"Admin@1234"}' \
  | jq '{ok: .isSuccessful, stage: .result.stage}'
# → {"ok": true, "stage": 4}
```

## Known gotchas

| Symptom | Cause | Fix |
|---|---|---|
| Image pulls EOF on first `up` | IPv6 path to MCR/GHCR broken | Verify hosts pins (above) survived |
| Identity OOMs during `dotnet run` build | Docker Desktop default 2 GB RAM | Settings → Resources → bump to 6-8 GB |
| `seed-output.json` missing / empty | `zitadel-seed` failed before completion | `down -v` (wipes PostgreSQL — regenerates PATs) then `up -d` |
| Login returns 400 "Unknown error" for every user | `WebPlatformUiClientId` or `WebPlatformRedirectUris[0]` empty | Compare your compose against patches §2 above |
| All PES checks return deny silently | `g`-rules keyed by Mongo `_id` not Zitadel id | See [[PES-Subject-Contract]] diagnostic |
| `dotnet run` in container errors `NU1902`/`NU1903` | Vulnerable transitives + TreatWarningsAsErrors | Confirm `NoWarn` patch in `Directory.Build.props` (patches §3) |

## Recovery — full reset to known-good state

```powershell
# 1. Stop + wipe all volumes
docker compose -f "C:\Falcon\Falcon\Falcon\docker-compose.yml" down -v

# 2. Optional: prune images if MCR pulls flaked (rare, only if hosts pins disappeared)
docker image prune -af

# 3. Bring everything back up (5-10 min cold)
docker compose -f "C:\Falcon\Falcon\Falcon\docker-compose.yml" up -d

# 4. Wait for identity to be ready (~60s after compose returns)
# 5. Re-seed the 6 test users
sh "C:\Falcon\Falcon\Falcon\falcon-essentials\zitadel\seed-test-users.sh"

# 6. Smoke
curl -sS -X POST http://localhost:7777/api/auth/login `
  -H "Content-Type: application/json" `
  -d '{"userName":"sysadmin","password":"Admin@1234"}' | jq .result.stage
# Expect: 4
```

## See also

- [[Authorization-Security-MOC]] — how all the moving parts connect
- [[Local-Test-Users]] — the 6 users `seed-test-users.sh` produces
- [[Local-Auth-Recipe]] — login + JWT curl
- [[PES-Subject-Contract]] — must-read for anyone editing seed scripts
- [[falcon-core-identity-svc]] / [[falcon-core-access-svc]] — service notes
- `_mounts/memory/project_local_backend_test_users_2026_05_16.md` — full session log of these patches
