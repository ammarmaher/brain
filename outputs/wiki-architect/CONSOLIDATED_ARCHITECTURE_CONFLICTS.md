*** CONSOLIDATED_ARCHITECTURE_CONFLICTS — wiki vs code drift log ***

> Each conflict cites the **wiki rule** it violates (file + heading + line range) and the **code evidence**.
> Wiki HEAD: `0d0cb311b56a991b94b6a0af03a26a12014b2926` (2026-05-13).
> Supersedes the conflicts catalogued in `Brain Outputs/understanding/wiki/ARCHITECTURE_CONFLICTS.md`.

Severity scale:
- **HIGH** — security, data integrity, or platform-rule violation; must fix.
- **MEDIUM** — architectural drift; should fix; not blocking.
- **LOW** — convention / naming / style; nice to fix.

---

## HIGH-severity conflicts (5 carried from fallback + re-cited; new ones flagged)

### H1 — `ValidateAudience=true` not uniform across services

**Wiki rule:** `Security-Architecture.md` §4.2.6 #1 (lines 282-302) — "Validate signature, **Validate issuer and audience**, Validate expiration".

**Code evidence:**
- Commerce `appsettings.json:27` — `ValidateAudience: false`.
- Charging `appsettings.json:27` — `ValidateAudience: true`.
- Core Gateway `appsettings.json:27` — `ValidateAudience: false`.
- System Gateway `appsettings.json:27` — `ValidateAudience: false`.

**Severity:** **HIGH** — security drift. Three services accept JWTs without audience validation.

**Fallback note:** Was fallback Conflicts §4.5 ("worth flagging") and UNVERIFIED §5. **Resolves UNVERIFIED — confirmed HIGH violation.**

**Fix:** Set `ValidateAudience=true` in all four `appsettings.json` files; verify each has a non-empty `Audience` configured.

---

### H2 — Domain leaks MongoDB

**Wiki rule:** `Clean-Architecture-project-structure-&-business-concepts.md` §"1) Domain project" (lines 421-444) — "**No dependencies on frameworks or IO**". §"Project dependencies" (line 568) — "Commerce.Domain → references nothing (or only small 'primitives' libs)".

**Code evidence:**
- `Falcon.Commerce.Domain.csproj:14-17` — `MongoDB.Bson` PackageReference.
- Per fallback §3.1, this leak exists.

**Severity:** **HIGH** — clean-architecture violation. Domain becomes coupled to MongoDB.

**Fallback note:** Was fallback Conflicts §3.1. Wiki resolves UNVERIFIED §3 (whether MongoDB.Driver allowed in Domain) — **no, it is not allowed**.

**Fix:** Remove `MongoDB.Bson` reference. Use `Guid` and plain types in Domain; map to BsonId in Infrastructure repositories.

---

### H3 — Contracts depends on Domain

**Wiki rule:** `Clean-Architecture-…md` §"5) Contracts project" (lines 544-562) — "Keep contracts stable and versioned; do not leak internal domain types". §"Contracts DTOs vs Application DTOs" (lines 724-838) confirms Contracts holds pure DTOs separate from Domain types.

**Code evidence:**
- `Falcon.Commerce.Contracts.csproj:9` — references `Domain`.

**Severity:** **HIGH** — every Domain change can ripple into public Contracts, breaking versioning guarantees.

**Fallback note:** Was fallback Conflicts §3.2.

**Fix:** Strip Domain reference from Contracts. Copy any needed value-object shapes as plain `record` types in Contracts.

---

### H4 — Default MongoDB / SQL Server credentials in docker-compose

**Wiki rule:** `Security-Architecture.md` §4.7 (lines 766-779) — security principles emphasizing token-based auth, defense-in-depth, no embedded credentials. Implicit: no default/weak credentials should ship in compose files.

**Code evidence:**
- `Falcon\docker-compose.yml:20-22` — `MONGO_INITDB_ROOT_USERNAME=root`, `MONGO_INITDB_ROOT_PASSWORD=example`.
- `T2.PES.API/appsettings.json:9-21` — SQL Server `sa` user pattern (per fallback §5.3).

**Severity:** **HIGH for production parity** — these are dev defaults but should never appear in any deployed environment. If `appsettings.json` is the file deployed (rather than env vars), this leaks.

**Fallback note:** Was fallback HIGH §SQL `sa` creds + §Mongo creds.

**Fix:** Use environment variables / secrets / Vault; ensure `appsettings.json` ships with placeholders only. Document the dev-stack provisioning in `falcon-essentials`.

---

### H5 — `ServiceOperationResult<T>` has five different shapes

**Wiki rule:** **WIKI-SILENT** on the wrapper shape — but the per-service drift breaks any "shared NuGet contract" promise.

**Code evidence (per fallback §4.1):**

| Service | Type | Fields | Path |
|---|---|---|---|
| Commerce | `record` | 4 (`IsSuccessful, Result, ErrorCodes, ErrorMessages`) | `…\Falcon.Commerce.Api\Common\` |
| Identity | `record` | 3 (`IsSuccessful, Result, ErrorMessages`) | `…\Falcon.Identity.Api\Application\Models\` |
| Charging | `struct` | 3 | `…\Falcon.Charging.Contracts\` |
| Provisioning | `struct` | 3 | `…\Falcon.Provisioning.Contracts\` |
| Templates | `record` | 3 | `…\Falcon.Templates.Contracts\Common\` |
| Contact Group | `record` | 3 | `…\Falcon.ContactGroup.Api\Application\Models\` |
| Access (PES) | not found | — | — |

**Severity:** **HIGH** in practice because client SDKs and gateways must paper over the differences. Even though wiki is silent, this is a major drift surface.

**Fallback note:** Was fallback Conflicts §4.

**Resolution:** Downgrade if wiki updates — but for now, **HIGH** because cross-service contracts are unreliable. **Recommend a wiki ADR** to lock the shape.

**Fix:** Create a `Falcon.Shared.Contracts` NuGet package with the canonical `ServiceOperationResult<T>` shape (recommend: `record` with `IsSuccessful, Result, ErrorCodes, ErrorMessages`). Migrate all services to consume it.

---

## NEW HIGH conflicts surfaced by the wiki pass (not visible to code-only fallback)

### H6 — Dual-credential micro-app auth (`X-MicroApp-Key`) not implemented

**Wiki rule:** `Security-Architecture.md` §4.1.1 (lines 60-77) — "Every micro-app API request carries two credentials: `Authorization: Bearer <user-access-token>` + `X-MicroApp-Key: <micro-app-key>`. Both credentials must be valid for the API to accept the request." §4.2.6 #2 (lines 304-307) — backend middleware must validate `X-MicroApp-Key`.

**Code evidence:** No reference to `X-MicroApp-Key` in any service. No Vault integration. No host-backend API-key injection flow.

**Severity:** **HIGH** — the entire micro-app authn model is missing. External micro-apps (when they exist) would authenticate only by user JWT, exposing them to impersonation.

**Fix:** Implement `X-MicroApp-Key` validation middleware in **all** backend services AND in the **Platform Services Gateway** when built. Add Vault integration in host shell backend for runtime key injection.

---

### H7 — Identity Service should publish IP allowlist policy, NOT Commerce

**Wiki rule:** `Security-Architecture.md` §4.2.9 lines 371-380 — "The **Identity Service** is the authoritative system for tenant security configuration. The policy source is Identity Service's own `Settings` store, populated by synchronization events from Commerce."

**Code evidence (per fallback §3.2):** `TenantIpAllowlistChangedConsumer` in Core Gateway consumes a topic produced by Commerce (settings change → Kafka).

**Severity:** **HIGH** — wrong service is the source of truth for security policy. Tenant IP allowlist changes flow Commerce → Core Gateway directly, bypassing Identity (which is supposed to authorise login by validating source IP **before** Zitadel).

**Fix:** Migrate the topic publisher to Identity. Commerce sends settings to Identity (`commerce.identity-settings-sync.v1`); Identity republishes the IP allowlist topic for Core Gateway. Pre-auth IP validation in Identity for `/api/auth/login` and `/api/auth/forgot-password` must already exist (verify).

---

## MEDIUM-severity conflicts

### M1 — Solution file format `.slnx` everywhere except Identity/ContactGroup/Access

**Wiki rule:** `Design-Patterns-&-Guidelines.md` §".NET Solution & Project Naming" line 122 — `<ServiceName>.sln`.

**Code evidence (per fallback §1.1):**

| Service | Solution file | Format |
|---|---|---|
| Charging | `Falcon.Charging.slnx` | `.slnx` |
| Commerce | `Falcon.Commerce.slnx` | `.slnx` |
| Provisioning | `Falcon.Provisioning.slnx` | `.slnx` |
| Templates | `Falcon.Templates.slnx` | `.slnx` |
| Core Gateway | `Falcon.Core.Gateway.slnx` | `.slnx` |
| System Gateway | `Falcon.System.Gateway.slnx` | `.slnx` |
| Identity | `Falcon.Identity.sln` | `.sln` ✓ |
| Contact Group | `Falcon.ContactGroup.sln` | `.sln` ✓ |
| Access (PES) | `t2.PES.sln` | `.sln` ✓ |

**Severity:** **MEDIUM** — both formats parse but the wiki names `.sln`.

**Fix:** Convert all `.slnx` to `.sln` (or vice versa, if updating the wiki rule).

---

### M2 — Falcon Domain has `MongoDB.Driver` in single-project services

**Wiki rule:** Same as H2 — Domain has no IO deps.

**Code evidence:** Single-project services (`Falcon.Identity.Api`, `Falcon.ContactGroup.Api`) house Domain folders inside an Api csproj that has `MongoDB.Driver`. **Inevitable** because of the single-project shape.

**Severity:** **MEDIUM** — the single-project shape itself is a deeper violation (see M5).

**Fix:** Tied to M5.

---

### M3 — Frontend libs / apps named differently from wiki

**Wiki rule:** `Front%2DEnd-Architecture.md` §5.5 lines 152-167 + §5.14 lines 600-619 — internal libs `@falcon/core`, `@falcon/theme`, `@falcon/i18n`, `@falcon/ui`, `@falcon/layout`, `@falcon/shared`, `@falcon/host-bridge`, `@falcon/federation`, `@falcon/sdk`. Apps: `@falcon/shell`, `@falcon/management-console`, `@falcon/admin-console`.

**Code evidence (per fallback §6.1):** Libs: `falcon`, `falcon-theme`, `falcon-ui-core`, `falcon-ui-tokens`, `falcon-ui-react`, `falcon-ui-vue`, `falcon-studio`, `sdk`. Apps: `host-shell` (not `shell`), `management-console`, `admin-console`.

**Severity:** **MEDIUM** — naming drift causes ongoing confusion + new contributors look in wrong places.

**Fix:** Either (a) rename libs/apps to match wiki, or (b) update wiki to reflect actual structure. User memory `feedback_wiki_naming_conventions` already targets rename.

---

### M4 — MongoDB DB names violate `falcon_<layer>_<service>_db` pattern

**Wiki rule:** `Design-Patterns-&-Guidelines.md` §"Database Naming (MongoDB)" lines 187-198. Examples: `falcon_core_provisioning_db`, `falcon_comm_whatsapp_db`.

**Code evidence:** `FalconCommerceDB`, `FalconChargingDB`, `FalconTemplateDb`, `PES` (Access).

**Severity:** **MEDIUM** — naming convention drift. No functional break but breaks ops tooling that assumes pattern.

**Fix:** Rename DBs in `appsettings.json` per environment. Migrate data once per env.

---

### M5 — Single-project services collapse Clean Architecture into one csproj

**Wiki rule:** `Clean-Architecture-…md` §"Project dependencies" (lines 564-578) implies 5 separate projects with compiler-enforced walls.

**Code evidence:** `Falcon.Identity.Api` and `Falcon.ContactGroup.Api` are single-csproj with `Application/`, `Domain/`, `Infrastructure/`, `Endpoints/`, `Startup/` as folders.

**Severity:** **MEDIUM** — wiki implies the 5-csproj shape is canonical, but doesn't explicitly forbid folder-only. Single-csproj relies on namespace discipline (humans) instead of csproj reference walls (compiler).

**Fallback note:** Was fallback §1.2 + §3 from Conflicts. Wiki gives soft confirmation: the canonical shape is 5 csproj.

**Fix:** Migrate Identity and Contact Group to 5-csproj shape. Each Endpoints/ class moves to `Falcon.X.Api`, Application/ to `Falcon.X.Application`, etc.

---

### M6 — `polishing-v0.4` long-lived branch violates TBD

**Wiki rule:** `Development-&-Deployment-Strategy.md` §3 lines 23-66 — "Long-lived feature branches" are explicitly forbidden.

**Code evidence:** `falcon-web-platform-ui` is on `polishing-v0.4` (per fallback §7.1).

**Severity:** **MEDIUM** — process drift; impedes continuous integration and tag-based releases.

**Fallback note:** Was fallback UNVERIFIED §8. **Wiki resolves: violation.**

**Fix:** Squash polishing waves into tagged releases on `main`, or break into short-lived feature branches.

---

### M7 — gRPC for sync inter-service not adopted

**Wiki rule:** `High-Level-Architecture.md` §3.6 line 558 — "For synchronous calls: **gRPC**". §"Internal Service Communication Rule" line 191 accepts gRPC/HTTP.

**Code evidence:** Zero `*.proto` files; no `Grpc.AspNetCore` references (per fallback §2.3).

**Severity:** **MEDIUM** — wiki accepts HTTP, but gRPC is the **preferred** path. All inter-service sync goes via HTTP.

**Fallback note:** UNVERIFIED §4 in fallback. **Wiki resolves: gRPC preferred; HTTP acceptable but suboptimal.**

**Fix:** Migrate hot east-west paths (Commerce → Identity, Channel Services → OCS) to gRPC. Define `Falcon.Shared.Contracts` `.proto` files; generate clients in Infrastructure adapters.

---

### M8 — Outbox pattern not implemented

**Wiki rule:** `Clean-Architecture-…md` §"Publishing events/commands" lines 634-646 — "Infrastructure implements publishing, including: **outbox pattern (recommended)**".

**Code evidence:** Direct Kafka publish via `KafkaAvroProducer` / `KafkaJsonProducer` without an outbox dispatcher.

**Severity:** **MEDIUM** — risk of inconsistency between domain state and emitted events. Especially relevant for Charging (Ledger entries must match published events) and Commerce (contract activation triggers OCS funding).

**Fix:** Add outbox table per service + dispatcher. Wolverine / MassTransit / Hangfire-based outbox are options.

---

### M9 — Microsoft.FeatureManagement not present (feature flags spec exists)

**Wiki rule:** `Development-&-Deployment-Strategy.md` §8 lines 133-235 — feature flags mandatory for incomplete-feature merges into `main`.

**Code evidence:** No `Microsoft.FeatureManagement` package references in any csproj.

**Severity:** **MEDIUM** — without flags, every feature must be 100% complete before merging — defeats TBD.

**Fix:** Add `Microsoft.FeatureManagement.AspNetCore` to every service. Define `IFeatureManager` interface use pattern in Application layer.

---

### M10 — Platform Services Gateway repository does not exist

**Wiki rule:** `High-Level-Architecture.md` §2.2 lines 121-125 — third gateway "Platform Services Gateway" surfaces messaging/AI/utility APIs to external micro-apps + partners.

**Code evidence:** Only `falcon-int-core-gateway-svc` and `falcon-int-system-gateway-svc` exist. No `falcon-int-platform-gateway-svc`.

**Severity:** **MEDIUM** — the third gateway is part of the architecture; its absence means external micro-apps + partner integrations have no canonical entry point.

**Fix:** Create the repo; copy YARP setup from Core/System; configure messaging/ocs/ai/utility routes.

---

### M11 — `T2.PES.*` project naming + `net6.0` target

**Wiki rule:** `Design-Patterns-&-Guidelines.md` line 105 — `Falcon.<Service>.<Layer>` pattern. `Deployment-Document-…md` line 32 — `.net Core 10`.

**Code evidence:** `T2.PES.API`, `T2.PES`, `T2.PES.Test` projects targeting `net6.0` (per fallback §1.4 + §1.5).

**Severity:** **MEDIUM** — pre-rename + outdated framework. Repo already named `falcon-core-access-svc`; projects inside lag behind.

**Fix:** Rename `T2.PES.*` → `Falcon.Access.*`. Upgrade to `net10.0`. Migrate from SQL Server to MongoDB (or document the polyglot exception via a wiki ADR).

---

## LOW-severity conflicts

### L1 — Frontend on Angular 21 while wiki says 19/20

**Wiki rule:** `Front%2DEnd-Architecture.md` §5.1 (Angular 19); `Deployment-Document-…md` line 34 (Angular 20).

**Code evidence:** Angular 21.2.9 (per project memory `project_falcon_revamp_v3_1_night_shift_results`).

**Severity:** **LOW** — frontend is ahead of wiki; not a violation per se.

**Fix:** Update wiki when comfortable to claim Angular 21.

---

### L2 — DNS host inconsistency

**Wiki rule:** `High-Level-Architecture.md` §2.2.2 uses `*.falconhub.space`. `Deployment-Document-…md` line 95 uses `*.falconhub.sa`.

**Code evidence:** Frontend deploys use `*.falconhub.space` (per existing config).

**Severity:** **LOW** — internal wiki inconsistency. `falconhub.space` is the newer, canonical form.

**Fix:** Update `Deployment-Document-…md` to use `falconhub.space`.

---

### L3 — Workspace name `falcon-web-platform-ui` vs wiki `falcon-console-ui` / `falcon-frontend`

**Wiki rule:** Wiki itself is inconsistent — `Design-Patterns-&-Guidelines.md` line 22 says `falcon-console-ui`; `Front%2DEnd-Architecture.md` §5.14 line 386 says `falcon-frontend/`.

**Code evidence:** `falcon-web-platform-ui`.

**Severity:** **LOW** — naming drift, no functional impact.

**Fix:** Pick one name in wiki and align workspace.

---

### L4 — `falcon-comm-*` services / Communication Layer not yet created

**Wiki rule:** `Design-Patterns-&-Guidelines.md` lines 36-44 — `falcon-comm-voip-svc`, `falcon-comm-whatsapp-svc`, `falcon-comm-push-svc`, `falcon-comm-rcs-svc`.

**Code evidence:** None of these repos exist.

**Severity:** **LOW (today)** — Communication Layer is future state. Becomes HIGH when messaging features ship.

**Fix:** Create the repos at the appropriate milestone.

---

### L5 — `falcon-util-*` services not yet created

**Wiki rule:** `Design-Patterns-&-Guidelines.md` lines 46-52 — `falcon-util-logging-svc`, `falcon-util-storage-svc`.

**Code evidence:** None exist.

**Severity:** **LOW** — utility services are extracted later; logging/monitoring is likely centralized via app-platform infra today.

**Fix:** Document as roadmap.

---

### L6 — Identity webhook signature validation unverified

**Wiki rule:** `Security-Architecture.md` §4.2.7 + §4.2.1 — Identity consumes Zitadel webhooks via `/api/webhook/zitadel`. Signature validation implied.

**Code evidence:** `ZitadelWebhookEndpoint.cs` exists; signature-validation logic unverified.

**Severity:** **LOW** — needs audit but no clear evidence of failure.

---

### L7 — SCSS files still present in frontend libs/apps

**Wiki rule:** Wiki §5.9 + §5.14 mandate CSS-variable-based theming. SCSS is **not** explicitly forbidden.

**Code evidence:** 36 SCSS files in `apps/admin-console/.../organization-hierarchy/`, 8 SCSS files in `libs/` (per fallback §6.4).

**Severity:** **LOW per wiki** — wiki-silent. User memory `feedback_no_inline_styles_tokens_only` enforces tokens-only, but that's project policy.

---

### L8 — `tailwindcss-primeui` still in devDependencies

**Wiki rule:** Wiki-silent on PrimeNG.

**Code evidence:** `tailwindcss-primeui` in devDependencies (per fallback §6.1).

**Severity:** **LOW** — leftover after PrimeNG removal per project memory `project_falcon_primeng_total_removal_complete`.

**Fix:** Uninstall `tailwindcss-primeui`.

---

### L9 — `Application Service → Application Service` call check not audited

**Wiki rule:** `Clean-Architecture-…md` §"Restrictions" lines 984-1063 — Application Services cannot call each other.

**Code evidence:** **Unverified.** Audit needed across each `*.Application/` project.

**Severity:** **LOW** until audited.

**Fix:** Grep each Application project for `: I*Service` chains; refactor to Domain Services, Application Components, events, or Coordinator/Facade per wiki §"4 legal alternatives".

---

## Conflicts in the fallback that are NOT real wiki violations

These were flagged in the fallback but the wiki resolves them as **acceptable**:

| Fallback Conflict | Wiki resolution | New severity |
|---|---|---|
| §3.4 System Gateway lacks IP allowlist | Wiki §2.2.3 says IP allowlist is **Core Gateway only by design** | NONE (correct) |
| §4.2 Controllers vs FastEndpoints split | Wiki §"4) API" allows both | NONE (wiki-silent on choice) |
| §6.3 Folder pattern partial adoption | Wiki §"5.14" doesn't mandate the `models/services/resolvers/directives` pattern | NONE (project convention) |
| §9 Mediator/Mapper inconsistency | Wiki silent | NONE (per-service choice) |
| §5.3 PES on SQL Server | Wiki silent on PES storage | NONE (wiki-silent; project decision) |

---

**See also:**
- `CONSOLIDATED_ARCHITECTURE_RULES.md` — the rule book conflicts cite.
- `WIKI_TO_CODE_TRACE.md` — wiki rule → code location bridge.
