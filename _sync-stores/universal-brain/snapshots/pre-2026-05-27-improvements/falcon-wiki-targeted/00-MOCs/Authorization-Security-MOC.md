---
type: moc
role: authorization-and-security-index
audience: developers + ai-agents + qa + ops
scope: identity + pes + zitadel + jwt + frontend gating
updated: 2026-05-16
brain-linked: true
tags: [layer/backend, scope/auth, status/active]
---

> [!tldr]
> Single entry point for **everything** about Falcon authorization + security: who, with what role, talking to what service, validated against what policy. Read this MOC first; follow the links into the atomic notes for operational depth. Standing rules at the bottom — those are non-negotiable.

# Authorization & Security MOC

## The model in one paragraph

Falcon's auth is **OIDC (Zitadel) + PBAC (PES)**. The frontend never talks to Zitadel directly — it goes through **Falcon Identity Service** (port `7777`) which orchestrates the multi-step login flow (password → optional OTP → token exchange) and returns a JWT issued by Zitadel. The JWT's `sub` claim is the **Zitadel user-id** — the frontend uses that as the policy-subject when querying **PES** (`falcon-core-access-svc`, port `5296`) for per-page permissions. PES stores two rule kinds: `p` rules (role → resource/action) seeded from `BuiltInRoleCatalog.cs`, and `g` rules (user → role) written by Identity at user creation. **Gateways forward JWTs but do not call PES.** Authentication = Zitadel issues the JWT. Authorization = the FE queries PES with the JWT's `sub` to decide what to render.

## The picture

```
                         ┌─────────────────────────────────────┐
                         │           Angular Web Platform       │
                         │  (admin-console / management-console │
                         │       / host-shell — all FE)         │
                         └────────────────┬─────────────────────┘
                                          │
              ┌───────── 1. POST /api/auth/login ──────────┐
              │                                            ▼
   ┌──────────────────┐                          ┌────────────────────┐
   │  Falcon Identity │ ── 2. OIDC dance ───────▶│      Zitadel       │
   │  Service (7777)  │                          │  (port 8080 mgmt / │
   │ [[falcon-core-   │ ◀── 3. session +  ───────│   3000 login UI)   │
   │ identity-svc]]   │       JWT issuance        └────────────────────┘
   └────────┬─────────┘
            │ 4. POST sync primary role link (Kafka)
            ▼
   ┌──────────────────────┐                ┌────────────────────────┐
   │  PES (port 5296)     │ ◀────── 5. ────│  Angular Web Platform  │
   │ [[falcon-core-       │   pes/authorize │   (with JWT)           │
   │ access-svc]]         │   (subject =    │  CurrentSubjectBuilder │
   │                      │    JWT.sub)     │  → u:<JWT.sub>@<ns>    │
   └──────────────────────┘                └────────────────────────┘
            ▲
            │ p rules from BuiltInRoleCatalog.cs
            │ g rules from Identity.AccessRoleLinkClient
            │ (both stored in Mongo)
            └────
```

Numbers:
1. FE submits username + password.
2. Identity calls Zitadel `oauth/v2/authorize` then `v2/sessions/{id}/password` then `oauth/v2/token`.
3. Zitadel returns JWT — Identity wraps it in `LoginStepResponse`.
4. When users are created or have role changes, Identity emits a Kafka event → PES upserts the `g`-rule with `u:<ZitadelUserId>@<ns>`. **This is the contract — see [[PES-Subject-Contract]].**
5. FE calls PES `pes/authorize` for every gated page/action, passing the policy-subject built from `JWT.sub`.

## Read the atoms in this order

| If you are… | Read… |
|---|---|
| Bringing up the stack for the first time | [[Local-Backend-Bring-Up]] → [[Local-Test-Users]] → [[Local-Auth-Recipe]] |
| Writing a curl test that needs a JWT | [[Local-Auth-Recipe]] |
| Writing or reviewing a seed script that touches PES | **[[PES-Subject-Contract]]** (mandatory) |
| Debugging a "logged in but no pages render" report | [[PES-Subject-Contract]] diagnostic section |
| Wiring a new service that validates JWTs | [[falcon-core-identity-svc]] config + JWT claim table in [[Local-Auth-Recipe]] |
| Adding a new built-in role | `BuiltInRoleCatalog.cs` → reseed → [[falcon-core-access-svc]] |
| Mapping a frontend page to PES keys | `_mounts/services/falcon-web-platform-ui/libs/falcon/src/shared-types/lib/constants/falcon-access.registry.ts` + [[66-PES-Rules/_INDEX|66-PES-Rules]] |

## Standing rules (non-negotiable)

### 🔴 Password
Every test/seed user in every Falcon env uses password **`Admin@1234`** — no exceptions. Source: `_mounts/memory/feedback_test_user_password_standard.md`.

### 🔴 PES `g`-rule subject
For `type: g` rules, `obj` MUST be `u:<ZitadelUserId>@<ns>`, **never** `u:<MongoObjectId>@<ns>` or `u:<username>@<ns>`. Symptom of getting this wrong: silent deny on every page check. Source: [[PES-Subject-Contract]] + `_mounts/memory/feedback_pes_g_link_uses_zitadel_id.md`.

### 🔴 Frontend never calls Zitadel directly
Auth calls always flow `FE → Identity (7777) → Zitadel`. The Angular code that bypasses Identity is a bug; flag it. Source: `_mounts/memory/feedback_frontend_auth_identity_service.md`.

### 🔴 Gateways do not call PES
`falcon-int-core-gateway-svc` + `falcon-int-system-gateway-svc` are YARP-only. Gating is a **frontend** concern. If you find yourself wanting to call PES from a gateway, you're solving the wrong problem — push the check into the downstream service or the frontend.

## Key files (absolute paths)

### Code
- `Falcon/falcon-core-identity-svc/src/Falcon.Identity.Api/Application/Auth/UseCases/LoginProcess.cs` — login flow brain
- `Falcon/falcon-core-identity-svc/src/Falcon.Identity.Api/Infrastructure/Identity/Services/ZitadelAuthService.cs` — OIDC adapter
- `Falcon/falcon-core-identity-svc/src/Falcon.Identity.Api/Application/Users/UseCases/CreateUserProcess.cs:104` — calls `AccessRoleLinkClient.SyncPrimaryRoleAsync(user.IdentityUserId, ...)` (the contract holder)
- `Falcon/falcon-core-access-svc/src/T2.PES/Authorization/BuiltInRoleCatalog.cs` — the 6 canonical roles
- `Falcon/falcon-core-access-svc/src/T2.PES/Authorization/PolicySubjectContract.cs` — the subject format (`u:<name>@<ns>`, `r:<roleKey>@<ns>`)
- `Falcon/falcon-core-access-svc/src/T2.PES/PDP/DecisionPoint.cs` — resolves p + g into allow/deny
- `falcon-web-platform-ui/libs/falcon/src/core/lib/access-control/current-subject.builder.ts:27` — builds `u:<JWT.sub>@<ns>` on the FE
- `falcon-web-platform-ui/libs/falcon/src/shared-types/lib/constants/falcon-access.registry.ts` — every PES key the FE checks (47 unique resource/action pairs)

### Infra
- `Falcon/Falcon/docker-compose.yml` — orchestration (frontend behind `--profile frontend`)
- `Falcon/Falcon/falcon-essentials/zitadel/seed.sh` — Zitadel org + Falcon project + host-app + system-user
- `Falcon/Falcon/falcon-essentials/zitadel/seed-test-users.sh` — the 6 test users + PES `g`-rules
- `Falcon/Falcon/falcon-essentials/zitadel/pes-account-role-rules.json` — `acc-*` `p`-rule template (per-tenant)
- `Falcon/Falcon/falcon-essentials/zitadel/pes-verification-2026-05-16.csv` — 282-row decision matrix proving the fix

## Cross-references to other vault clusters

- [[falcon-core-identity-svc]] / [[falcon-core-access-svc]] — service-level reference
- [[50-Services/_INDEX|50-Services index]] — all backend services
- [[66-PES-Rules/_INDEX|66-PES-Rules cluster]] — per-page/per-action rule index
- `Home/Software-Architecture-Design/Security-Architecture` — Wiki source of truth (architecture vision)
- `Home/Software-Architecture-Design/Permissions-&-Authorization-Module-(Policy-Based-Access-Control)` — Wiki source of truth (PBAC design)
- `_mounts/brain-outputs/component-registry/parallel-agents/agent-06-frontend-architecture-usage/AUTH_AND_FACADE_PATTERNS` — frontend consumer patterns
- `_mounts/brain-sk/registries/PES_PERMISSION_MATRIX` — Brain SK canonical matrix

## Cross-references to memory (standing rules + session logs)

- `_mounts/memory/feedback_pes_g_link_uses_zitadel_id.md` — the standing rule
- `_mounts/memory/feedback_test_user_password_standard.md` — the password rule
- `_mounts/memory/feedback_frontend_auth_identity_service.md` — FE-only-via-Identity rule
- `_mounts/memory/project_local_backend_test_users_2026_05_16.md` — the session that produced this MOC

## See also (operational atoms)

- [[Local-Backend-Bring-Up]] — how to start the backend stack (with all 2026-05-16 patches documented)
- [[Local-Test-Users]] — the 6 pre-seeded users + credentials matrix
- [[Local-Auth-Recipe]] — copy-pasteable login curl
- [[PES-Subject-Contract]] — the standing rule + diagnostic + fix
