---
name: session-backup-contact-group-401-investigation-no-repro
description: "Investigated reported \"401 to ALL authenticated requests\" on falcon-contact-group-1; root cause = anonymous requests, NOT JWT misconfig. Live container accepts valid Zitadel JWTs (HTTP 200 verified)."
metadata: 
  node_type: memory
  type: project
  agent: ammar-essentials
  date: 2026-05-28
  status: completed
  originSessionId: 7731a13e-fd64-49e8-921d-4c86928584f1
---

## What Was Done
- Diagnosed `falcon-contact-group-1` reported 401-to-all-authenticated.
- Confirmed it is NOT a build failure: container is Up, Hangfire heartbeating, serving requests. `Directory.Build.props:14` already has `<NoWarn>CA1873;NU1902;NU1903</NoWarn>` (2026-05-21 patch did NOT regress). NU1902/NU1903 are emitted as warnings only (NoWarn'd) — build succeeds.
- Confirmed it is NOT a JWT-validation config problem. Live container env (verified via `docker exec printenv`): `Zitadel__Domain=http://zitadel:8080`, `Zitadel__AuthorityDomain=http://localhost:8080`, `Zitadel__BackchannelDomain=http://zitadel:8080` — IDENTICAL to working commerce service (compose lines 614-616 vs 498-500).
- VERIFIED with a real accowner JWT (login `:7777`, stage 4, iss=`http://localhost:8080` matches AuthorityDomain): both target endpoints return **HTTP 200**, stable across 3 repeats.

## Root Cause
Every 401 in the ENTIRE container log history is an ANONYMOUS request — the request line is `GET ... - null null` and finishes `- 401 0 null`. No request carrying a bearer token was ever rejected. The "401 to all authenticated requests" symptom was a measurement artifact: the failing requests were missing the `Authorization` header (stale browser tab / health pinger / token lost before reaching the service). The `localhost:8080/.well-known/openid-configuration 404` line in the log is an INBOUND probe hitting the service's own port, not the service's outbound JWKS fetch (which goes to zitadel:8080 and succeeds).

## Before/After (verify curl)
- DIRECT `:7300/api/contact-groups?page=1&pageSize=20` — reported 401 → measured **HTTP 200** (3/3).
- GATEWAY `:7038/contactgroup/contact-groups/upload-config` — reported 401 → measured **HTTP 200**.
- own-list `:7038/contactgroup/contact-groups?NodeId=test-tenant-001&Page=1&PageSize=20` → **HTTP 403** (PES cross-node DENY — correct; 403 not 401 proves auth succeeded).

## Files Changed
NONE. No rebuild performed (none needed). No git commits.

## Key Decisions
- Did not rebuild — running container already correct; rebuild would only churn.
- 403 on own-list is correct PES behavior (accowner nodeId is null, tenantId=test-tenant-001 fabricated test tenant per Local-Test-Users), not an auth defect.

## Context for Next Agent
- Contact Groups auth is HEALTHY on the live stack. If FE still sees 401, inspect the FE/gateway request: the token is being dropped before it reaches `:7300`, OR the FE is calling unauthenticated. Capture the actual outbound request headers from the browser/network tab.
- Compose: `C:\Falcon\Falcon\Falcon\docker-compose.yml` (THREE Falcons). Source on disk: `C:\Falcon\Falcon\falcon-core-contact-group-svc` (TWO Falcons). Bind mount `C:\Falcon\Falcon => /workspace`; container runs `dotnet run` against `/workspace/falcon-core-contact-group-svc`.
- Auth wiring: `src/Falcon.ContactGroup.Api/Startup/Extensions/ServiceCollectionExtensions.cs` `AddJwtAuthentication` (lines 297-346) + `Infrastructure/Auth/ZitadelBackchannelHandler.cs` — standard Falcon pattern, correct.
- No jq/python on this host; use `node` or PowerShell `ConvertFrom-Json` for JWT decode.
