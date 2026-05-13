*** CONSOLIDATED_ARCHITECTURE_RULES — wiki-grounded ***

> Authoritative rule book. Every rule cites a wiki source (file + heading / line range).
> Supersedes `Brain Outputs/understanding/wiki/ARCHITECTURE_RULES.md` (code-extracted fallback).
> Wiki HEAD: `0d0cb311b56a991b94b6a0af03a26a12014b2926` (branch `wikiMaster`, 2026-05-13).

The fallback was structured in 10 sections; this file mirrors those 10 sections so cross-comparison is direct.

---

## 1. Solution / project structure

### 1.1 Canonical solution-file format

**Rule:** `.sln` (NOT `.slnx`).

**Source:** `Design-Patterns-&-Guidelines.md` §".NET Solution & Project Naming" line 122 — "**Solution file:** `<ServiceName>.sln`".

**Code-extracted fallback verdict:** **wrong**. Fallback §1.1 catalogued mixed `.sln` / `.slnx` and observed "no enforced project-wide standard". Wiki now resolves: **the standard is `.sln`**. All `.slnx` services (Charging, Commerce, Provisioning, Templates, both Gateways) deviate from canonical. Migration required.

### 1.2 Clean Architecture layering

**Rule:** Each service has **five separate csproj** — `Falcon.<Service>.Api`, `.Application`, `.Domain`, `.Infrastructure`, `.Contracts`. Dependency direction `Domain ← Application ← Infrastructure ← Api` with **compiler-enforced** boundaries via `<ProjectReference>` walls.

**Source:**
- `Clean-Architecture-project-structure-&-business-concepts.md` §"Clean Architecture projects" lines 407-562 (per-project responsibilities).
- §"Project dependencies (who can reference whom)" lines 564-578 — "**dependencies point inward**", with explicit "Important: Domain should not reference Application or Infrastructure. Application should not reference Infrastructure."
- `Design-Patterns-&-Guidelines.md` §".NET Solution & Project Naming" lines 102-130 (project list).

**Fallback verdict:** **partially right.** Fallback §1.2 noted single-csproj services (Identity, Contact Group) "preserve the *logical* boundary but the *project boundary* differs." Wiki strict reading: the **5-csproj shape is canonical**. Single-csproj should be migrated. The Contact-Group module doc §1 uses "internal layers" not "internal projects" — leaves some ambiguity, but the broader Clean Architecture doc is the authority.

### 1.3 Domain has no IO dependencies

**Rule:** Domain project references **nothing** (or only small primitives libs). No `MongoDB.Bson`, no `MongoDB.Driver`, no HTTP clients, no Kafka clients.

**Source:** `Clean-Architecture-…md` §"1) Domain project" lines 421-444 — "No dependencies on frameworks or IO." §"Project dependencies" lines 568-575 — "Commerce.Domain → references nothing (or only small 'primitives' libs)."

**Fallback verdict:** **wrong (in code).** Fallback §1.3 noted `Falcon.Commerce.Domain.csproj` has `MongoDB.Bson` PackageReference. Wiki resolves: this is a **VIOLATION**. (Resolves fallback UNVERIFIED §3.)

### 1.4 Contracts project keeps DTOs stable; does NOT depend on Domain

**Rule:** Contracts holds integration event schemas, public API DTOs, shared gRPC stubs. "Keep contracts stable and versioned; do not leak internal domain types."

**Source:** `Clean-Architecture-…md` §"5) Contracts project" lines 544-562 + §"Contracts DTOs vs Application DTOs" lines 724-838.

**Fallback verdict:** **wrong (in code).** Fallback §1.3 noted `Falcon.Commerce.Contracts.csproj` references `Domain` — wiki says Contracts must NOT leak Domain types. **VIOLATION**.

### 1.5 Project naming pattern

**Rule:** `Falcon.<Service>.<Layer>` with `<Service>` PascalCase.

**Source:** `Design-Patterns-&-Guidelines.md` §".NET Solution & Project Naming" lines 105-120.

**Fallback verdict:** **right (in code) EXCEPT for Access service.** Fallback §1.4 catalogued Access service as `T2.PES.*` (pre-rename baggage). Wiki resolves: **`Falcon.Access.*` is canonical** since the repo is `falcon-core-access-svc`. **VIOLATION** for Access service.

### 1.6 Target framework

**Rule:** **`net10.0`** across all `Falcon.*` projects.

**Source:** `Deployment-Document-(Dev-Servers-specs-&-Env-setup).md` §"Project Overview" line 32 — ".net Core 10".

**Fallback verdict:** **right (in code) EXCEPT for Access service.** `T2.PES.*` targets `net6.0` — fallback §1.5 flagged this. Wiki implicitly confirms.

### 1.7 Shared build properties

**Rule:** Wiki is **silent** on `Directory.Build.props` standardization. The `Design-Patterns-&-Guidelines.md` repo layout (lines 132-182) shows `Directory.Build.props` at the root of each microservice repo but does not enforce contents.

**Fallback verdict:** **WIKI-SILENT — code-pattern only.** Fallback §1.6 catalogued the divergence (Identity / Contact Group / Templates / both Gateways have `Directory.Build.props` with `TreatWarningsAsErrors`, NuGet Audit, analyzers; Commerce / Charging / Provisioning don't). Wiki neither blesses nor forbids — keep as a recommended standardization for code hygiene, NOT as a wiki rule.

---

## 2. Cross-service communication

### 2.1 East-West (service-to-service) sync calls use gRPC

**Rule:** Internal services use **gRPC** for synchronous calls (or HTTP as a fallback per the Clean Architecture port-and-adapter pattern).

**Source:**
- `High-Level-Architecture.md` §"Architecture Style" line 11 — "independently deployable gRPC/Kafka-enabled service".
- §"Internal Service Communication Rule" lines 185-194 — "**gRPC/HTTP** for synchronous calls".
- §3.6 Internal Service Communication lines 555-564 — "For synchronous calls: **gRPC**".
- `Clean-Architecture-…md` §"A) Calling other microservices (HTTP/gRPC)" lines 582-614 — "Infrastructure implements it via **HTTP/gRPC**".

**Fallback verdict:** **wrong (in code).** Fallback §2.3 — "Glob `**/*.proto` returns zero matches", no `Grpc.AspNetCore`, no `Grpc.Tools`. All inter-service sync calls are HTTP. **Resolves fallback UNVERIFIED §4: gRPC IS canonical for sync; current HTTP usage is a relaxation.** It's not a clean violation because the wiki also accepts HTTP (`§"Internal Service Communication Rule"` lists both, joined by `/`), but adopting gRPC is the platform direction.

### 2.2 East-West service-to-service traffic never goes via gateway

**Rule:** Internal services **must not** call each other through gateways.

**Source:** `High-Level-Architecture.md` §"Internal Service Communication Rule" line 194 — "Internal services must not call each other through gateways to avoid coupling, latency overhead, and gateway bottlenecks."

**Fallback verdict:** **right (in code).** Fallback §2.1 — Commerce calls Identity at `ServicesClients:Identity:BaseUrl` directly, not through gateway. Rule upheld.

### 2.3 Kafka + Avro is the async event bus

**Rule:** Async workflows/events use **Kafka + Avro schemas**.

**Source:** `High-Level-Architecture.md` §"Architecture Style" — "publish/subscribe to Kafka topics using **Avro schemas**" (line 20); §"Internal Service Communication Rule" — "**Kafka + Avro** for asynchronous workflows/events" (line 192); §3.6 — "For asynchronous events: **Kafka + Avro**" (line 559).

**Fallback verdict:** **right (in code).** Fallback §2.2 catalogued Kafka producers/consumers across services and confirmed Avro dominance.

### 2.4 Named topics (specific event names called out by wiki)

**Rule:** Specific topics named:
- **`commerce.identity-settings-sync.v1`** — Commerce publishes identity settings; Identity consumes (`Security-Architecture.md` §4.2.1 line 159; §4.2.8 line 366).
- **`TenantIpAllowlistUpdated`** — Commerce publishes; Core Gateway consumes (`High-Level-Architecture.md` §2.2.3 line 352; `Security-Architecture.md` §4.2.9 line 421).
- **Contract activation/expiration events** — Commerce publishes; OCS consumes (implicit in `Falcon-Pricing,…OCS-…md` §6-§7).

**Fallback verdict:** **partially right.** Fallback §2.2 enumerated topics by service but didn't name `commerce.identity-settings-sync.v1` or `TenantIpAllowlistUpdated` as the canonical wiki contract. Now they are.

### 2.5 Outbox pattern recommended for publishing

**Rule:** Use **outbox pattern** for event publication.

**Source:** `Clean-Architecture-…md` §"Publishing events/commands" lines 634-646 — "Infrastructure implements publishing, including: **outbox pattern (recommended)**".

**Fallback verdict:** **WIKI-SILENT IN FALLBACK; new finding.** Fallback did not call out the outbox requirement. Code-side audit: no obvious outbox dispatcher in any service. **Implementation gap.**

---

## 3. Gateways

### 3.1 Three gateways exist (not two)

**Rule:** Three gateways: **System Gateway** (admin), **Core Services Gateway** (account/tenant), **Platform Services Gateway** (external micro-apps + integrations).

**Source:** `High-Level-Architecture.md` §2.2 lines 106-133.

**Fallback verdict:** **partially right.** Fallback §3.2/§3.3 documented only Core + System Gateway (the existing 2). Wiki resolves: **Platform Services Gateway is canonical**. Code is **behind** the wiki by one gateway.

### 3.2 Gateways use YARP

**Rule:** Each gateway uses **YARP (Yet Another Reverse Proxy)** as a pass-through proxy.

**Source:** `High-Level-Architecture.md` §2.2.1 lines 136-156 — "Pass-through behavior is implemented using **YARP**".

**Fallback verdict:** **right (in code).** Fallback §3.1 confirms `Yarp.ReverseProxy` in both gateway csproj.

### 3.3 BFF + Proxy Hybrid (≈90/10 split)

**Rule:** ~90% pass-through (YARP), ~10% custom aggregation/orchestration.

**Source:** `High-Level-Architecture.md` §2.2.1 lines 136-156.

**Fallback verdict:** **right (in code).** Both gateways have appsettings.json YARP route tables (90%) + custom features (rate limiter, IP allowlist middleware, correlation ID — the 10%).

### 3.4 Internal route segmentation `/{service-name}/{**catch-all}`

**Rule:** Inside each gateway, use service-namespace segmentation via YARP.

**Source:** `High-Level-Architecture.md` §2.2.2 lines 283-308.

**Fallback verdict:** **right (in code).** Fallback §3.2/§3.3 confirms `/commerce/**`, `/provisioning/**`, etc.

### 3.5 Host-based DNS routing (Ingress Controller in K8s)

**Rule:** Each gateway exposed via its own hostname. `system-api.falconhub.space` / `core-api.falconhub.space` / `platform-api.falconhub.space`.

**Source:** `High-Level-Architecture.md` §2.2.2 lines 246-258.

**Fallback verdict:** **WIKI-NEW.** Fallback didn't catalogue DNS hosts. The newer doc resolves: `falconhub.space` is canonical (NOT `falconhub.sa` as in `Deployment-Document-…md`).

### 3.6 Standard YARP transforms

**Rule:** All gateway routes inject `X-Tenant-Id` + `X-Correlation-Id` headers.

**Source:** `High-Level-Architecture.md` §2.2.1 line 209-213.

**Fallback verdict:** **partially right (in code).** Fallback §3.2 noted correlation-id middleware. Tenant header injection unverified.

### 3.7 Tenant IP allowlist only on Core Gateway

**Rule:** Tenant IP allowlist enforced **only** in Core Services Gateway (Management Console traffic). NOT in System Gateway or Platform Services Gateway.

**Source:** `High-Level-Architecture.md` §2.2.3 lines 310-363; `Security-Architecture.md` §4.2.9 lines 371-461.

**Fallback verdict:** **partially wrong.** Fallback §3.4 listed System Gateway's missing IP allowlist as a conflict. Wiki resolves: **System Gateway is correctly without IP allowlist by design.** Downgrade conflict.

### 3.8 IP allowlist source = Identity Service; runtime cache = Redis in Core Gateway

**Rule:** Identity Service is the authoritative source for IP allowlist configuration (synced from Commerce settings). Core Gateway maintains a Redis cache projection updated via `TenantIpAllowlistUpdated` Kafka event.

**Source:** `Security-Architecture.md` §4.2.9 lines 371-417.

**Fallback verdict:** **partially wrong (in code).** Fallback §3.2 said Commerce publishes the Kafka event. Wiki resolves: **policy source is Identity** (which receives settings from Commerce). The publisher should be Identity, not Commerce. **Migration item.**

### 3.9 Defense-in-depth JWT validation

**Rule:** Downstream services must **independently validate JWTs**, not rely on gateway alone.

**Source:** `Security-Architecture.md` §4.2.6 lines 282-302 (4 backend middleware checks).

**Fallback verdict:** **right (in code).** Fallback §3.4 documented: Commerce explicitly states "Defense-in-depth: Commerce validates JWTs independently of the API Gateway".

---

## 4. API surface conventions

### 4.1 `ServiceOperationResult<T>` wrapper

**Rule:** **WIKI-SILENT.** The wiki does not prescribe a `ServiceOperationResult<T>` wrapper shape or location. Wiki §"Contracts project" only says public DTOs live in Contracts.

**Fallback verdict:** **WIKI-SILENT — code-pattern only.** Fallback §4.1 catalogued 5 different shapes across 6 services. Wiki gives no contract; the per-service drift is a **convention violation but not a wiki rule violation**. Recommend: **create wiki rule** prescribing a shared shape.

### 4.2 Endpoint style — Controllers vs FastEndpoints

**Rule:** **WIKI-SILENT** on the choice. `Clean-Architecture-…md` §"4) API" line 528 says "Controllers/Minimal API endpoints" without prescribing. `Falcon-Pricing,…OCS-…md` §10.1 lists "Controllers / Endpoints" interchangeably.

**Fallback verdict:** **WIKI-SILENT — code-pattern only.** Fallback §4.2 catalogued the split (Commerce/Charging/Provisioning use Controllers; Identity/Contact Group/Templates use FastEndpoints). Wiki neither blesses nor forbids. **Both styles are wiki-legal.**

### 4.3 Multi-language fields

**Rule:** **WIKI-SILENT** on `MultiLanguageName(En, Ar)`. The frontend `Front%2DEnd-Architecture.md` §5.6 describes a `LanguageFacade(ar/en/RTL/LTR)` and `Falcon-Template-Management-…md` §9.1 lists supported languages including `ar`/`en`. But there's no platform-wide rule that every domain entity must use a bilingual value object.

**Fallback verdict:** **WIKI-SILENT — code-pattern only.** Fallback §4.3 catalogued the partial adoption (Commerce/Charging/Provisioning have it; Identity/Templates/Contact Group don't). Wiki does not require it. **Resolves fallback UNVERIFIED §6: there is no wiki rule mandating MultiLanguageName.** Treat as a per-domain decision.

### 4.4 Exception & error model

**Rule:** **WIKI-SILENT.** The `Design-Patterns-&-Guidelines.md` §"Error Handling" heading is empty.

**Fallback verdict:** **WIKI-SILENT — code-pattern only.** Fallback §4.4 catalogued per-service `FalconException` + `FalconError`. Wiki does not require a shared shape. **Recommend: create wiki rule.**

### 4.5 Authentication — Zitadel JWT Bearer with custom claims

**Rule:** Every service + every gateway validates Zitadel-issued JWTs. JWT claims include `sub`, `tenant_id`, `user_type`, roles/scopes.

**Source:** `Security-Architecture.md` §4.2.6 lines 282-302; §4.6.3 lines 634-655.

**Fallback verdict:** **right (in code) — but with audience-validation drift.** Fallback §4.5 noted `ValidateAudience` differs (Commerce/Core Gateway/System Gateway: `false`; Charging: `true`). Wiki §4.2.6 #1 mandates "Validate issuer and audience". **Resolves fallback UNVERIFIED §5: `ValidateAudience=true` is canonical.** Three services are non-compliant.

### 4.6 Dual-credential auth for micro-app traffic

**Rule:** Micro-app API requests carry **two credentials**:
- `Authorization: Bearer <user-access-token>` (JWT).
- `X-MicroApp-Key: <micro-app-key>` (static, server-injected from Vault).

**Source:** `Security-Architecture.md` §4.1.1 lines 60-77, §4.2.6 #2 lines 304-307.

**Fallback verdict:** **WIKI-NEW.** Fallback did not call out dual credential. Code does not implement `X-MicroApp-Key` middleware in any service. **Major implementation gap.**

### 4.7 Multi-portal auth via single OIDC client + `user_type` claim

**Rule:** **One** OIDC client in Zitadel (`host-app`). All portal differentiation via `user_type` claim (`system` for Admin Console; `system, account` for Management Console).

**Source:** `Security-Architecture.md` §4.6.1-§4.6.4 lines 586-672.

**Fallback verdict:** **WIKI-NEW.** Fallback didn't catalogue this. Code-side verification: confirm Zitadel has only one OIDC client; confirm `AddPolicy("AdminOnly", policy.RequireClaim("user_type", "system"))` + `AddPolicy("ManagementAccess", policy.RequireClaim("user_type", "system", "account"))` exist in each service's Startup.

---

## 5. Data persistence

### 5.1 MongoDB OLTP

**Rule:** MongoDB is the platform OLTP store. Specific version: **MongoDB 8.2** (`Deployment-Document-…md` line 38).

**Source:** `High-Level-Architecture.md` §2.7 — "MongoDB (OLTP) – Accounts, tenants, channels, configs, pricing, CDRs, UDRs".

**Fallback verdict:** **right (in code).** Fallback §5.1.

### 5.2 MongoDB database naming `falcon_<layer>_<service>_db`

**Rule:** Pattern `falcon_<layer>_<service>_db` (snake_case, underscored).

**Source:** `Design-Patterns-&-Guidelines.md` §"Database Naming (MongoDB)" line 189-198. Examples: `falcon_core_provisioning_db`, `falcon_comm_whatsapp_db`.

**Fallback verdict:** **wrong (in code).** Code uses `FalconCommerceDB`, `FalconChargingDB`, `FalconTemplateDb` (PascalCase, no `core_` prefix). **VIOLATION across the board.**

### 5.3 Redis for caching

**Rule:** Redis 8.4 (`Deployment-Document-…md` line 40) — used for live balances, statuses, templates, rates, throttling, plus tenant IP allowlist projection in Core Gateway.

**Source:** `High-Level-Architecture.md` §2.7 line 432; `Security-Architecture.md` §4.2.9 lines 400-407.

**Fallback verdict:** **right (in code).** Fallback §5.2.

### 5.4 ClickHouse for OLAP

**Rule:** **ClickHouse** is the platform OLAP / analytics store.

**Source:** `High-Level-Architecture.md` §"Architecture Style" line 31 + §2.7 line 433.

**Fallback verdict:** **wrong (in code).** No ClickHouse references in any csproj. **OLAP tier missing.**

### 5.5 Hangfire on Mongo for background jobs

**Rule:** **WIKI-SILENT** explicitly, but compatible with the architecture (Commerce + Contact Group use Hangfire + Hangfire.Mongo per fallback §5.4).

**Fallback verdict:** **WIKI-SILENT — code-pattern only.** Acceptable as-is.

### 5.6 Object storage (S3-style)

**Rule:** Object storage used for file ingestion (Contact Group preview/import) and AI artifacts.

**Source:** `Contact-Group-Module.md` §3.2, §4-§7, §10 — direct upload via **pre-signed URLs** (no backend file transfer). `High-Level-Architecture.md` §2.4 names "File Storage & CDN" as a Utility Layer service. `Falcon-AI-Conversational-Orchestration.md` references object storage for audio/file artifacts.

**Fallback verdict:** **partially right (in code).** Fallback §5.5 noted only Contact Group has `AWSSDK.S3`. Wiki implies more services should use object storage (e.g. Template Management for media headers, AI service for audio).

### 5.7 SQL Server polyglot for Access Service

**Rule:** **WIKI-SILENT.** Wiki does not call out a SQL Server dependency for any service.

**Fallback verdict:** **WIKI-SILENT — code-pattern only.** Fallback §5.3 catalogued PES on SQL Server + Mongo. Wiki neither approves nor forbids. Likely a pre-rename artifact; should migrate Access service to Mongo per platform standard.

---

## 6. Frontend architecture

### 6.1 Nx monorepo

**Rule:** Single Nx workspace `falcon-console-ui` (per `Design-Patterns-&-Guidelines.md` §"Repository Naming" / §"Nx Workspace") or `falcon-frontend` (per `Front%2DEnd-Architecture.md` §5.14).

**Source:** `Design-Patterns-&-Guidelines.md` lines 74-100; `Front%2DEnd-Architecture.md` §5.14 lines 384-466.

**Fallback verdict:** **partially right (in code).** Workspace exists; named `falcon-web-platform-ui` (drift). Fallback §6.1.

### 6.2 Module Federation

**Rule:** Host shell consumes admin-console + management-console as **MF remotes**.

**Source:** `Front%2DEnd-Architecture.md` §5.8 lines 231-249 + §5.14 / `libs/federation/`.

**Fallback verdict:** **right (in code).** Fallback §6.2.

### 6.3 Angular version

**Rule:** **Angular 19** per `Front%2DEnd-Architecture.md` §5.1; **Angular 20** per `Deployment-Document-…md` line 34.

**Fallback verdict:** **partially conflicting in wiki.** Code is on **Angular 21.2.9** — ahead of both. Frontend is permitted to advance (no platform standard violated); wiki should catch up.

### 6.4 Tailwind for styling

**Rule:** **WIKI-SILENT** on Tailwind version. Wiki §5.6 + §5.9 + §5.14 require Tailwind + CSS-variable-based theming. Theme variables consumed via `var(--primary-color)` etc. Micro-apps **MUST NOT** define their own Tailwind colors/layouts — must extend from host CSS vars + `corePlugins: { preflight: false }`.

**Source:** `Front%2DEnd-Architecture.md` §5.14 #5 lines 1537-1554.

**Fallback verdict:** **right (in code) for tokens-only theming; wiki-silent on "no SCSS".** Fallback §6.4 noted 44 SCSS files still in code. Wiki doesn't explicitly forbid SCSS — user memory `feedback_no_inline_styles_tokens_only` enforces tokens-only but that's a project convention, not a wiki rule.

### 6.5 PrimeNG removal

**Rule:** **WIKI-SILENT.** Wiki §5.5 / §5.14 mention "Tailwind + Angular Material" but not PrimeNG either way.

**Fallback verdict:** **WIKI-SILENT — project decision.** User memory `project_falcon_primeng_total_removal_complete` shows PrimeNG was removed by project decision, not by wiki rule.

### 6.6 Falcon SDK as published private npm package

**Rule:** `@falcon/sdk` is published to a **private npm feed** (Azure Artifacts / GitHub Packages). External micro-apps install via `npm i @falcon/sdk`.

**Source:** `Front%2DEnd-Architecture.md` §5.6 lines 172-196 + §5.14 lines 1407-1462.

**Fallback verdict:** **WIKI-NEW.** Fallback didn't catalogue SDK publishing. Code has `libs/sdk` source but no Azure Artifacts publishing pipeline. **Implementation gap.**

### 6.7 Frontend never calls Zitadel directly

**Rule:** UI sends login/recovery requests to **Identity Service**, not Zitadel.

**Source:** `Security-Architecture.md` §4.1.1 lines 31-50.

**Fallback verdict:** **right (in code).** Fallback §6.5. Matches user memory `feedback_frontend_auth_identity_service`.

### 6.8 Per-feature folder pattern

**Rule:** **WIKI-SILENT** on the exact `models/models.ts`, `services/services.ts`, `resolvers/resolvers.ts`, `directives/directives.ts` pattern.

**Fallback verdict:** **WIKI-SILENT — project decision.** User memory `feedback_folder_structure_pattern` is project policy, not wiki rule.

### 6.9 Frontend build gates

**Rule:** **WIKI-SILENT.** The 12 `gate-NN-*` scripts in `package.json` are project-internal.

**Fallback verdict:** **WIKI-SILENT — project decision.**

---

## 7. Branching / release

### 7.1 Trunk-Based Development (TBD), `main` is only long-lived branch

**Rule:** `main` is the sole long-lived branch. Short-lived branches: `feat/<name>`, `fix/<name>`, `chore/<name>`. Lifespan target: hours to 1-2 days. Long-lived feature branches, `develop`, permanent release branches all **forbidden**.

**Source:** `Development-&-Deployment-Strategy.md` §2-§3 lines 23-66, §13 lines 453-461.

**Fallback verdict:** **partially right (in code).** Fallback §7.1: 10/11 repos on `main` ✓; `falcon-web-platform-ui` on `polishing-v0.4` ✗ — **VIOLATION**. **Resolves fallback UNVERIFIED §8: `polishing-v0.4` is a violation, not an exception.**

### 7.2 Releases via tags on `main`

**Rule:** Production releases from **`vX.Y.Z` tags on `main`**, not from separate branches.

**Source:** `Development-&-Deployment-Strategy.md` §6 lines 105-115.

**Fallback verdict:** **unverified (in code).** No obvious `vX.Y.Z` tags observed. Verify per-service.

### 7.3 Feature flags for incomplete work

**Rule:** Use feature flags (global / tenant-based / user-based / env-based). Backend reference uses `_featureManager.IsEnabled(...)` (implies Microsoft.FeatureManagement).

**Source:** `Development-&-Deployment-Strategy.md` §8 lines 133-235.

**Fallback verdict:** **WIKI-NEW.** Fallback didn't catalogue feature flags. Code has no `Microsoft.FeatureManagement` package references. **Major implementation gap.**

### 7.4 Branch protection + 1 PR approval

**Rule:** `main` is protected. PRs require build pass + tests pass + lint pass + **at least 1 approval**. No direct commits to `main`.

**Source:** `Development-&-Deployment-Strategy.md` §4 lines 70-88.

**Fallback verdict:** **unverified (in code).** Verify Azure DevOps branch policies per repo.

---

## 8. Identity / ownership boundaries

### 8.1 Identity Service owns user lifecycle (NOT Commerce, NOT Zitadel)

**Rule:** **`falcon-core-identity-svc`** is the system of record for users, lifecycle state, login eligibility, security-policy enforcement, contact verification.

**Source:** `Security-Architecture.md` §4.1.1 lines 36-50 + §4.8 #1 line 786.

**Fallback verdict:** **right (in code).** Fallback §8.1 catalogued all the user-lifecycle endpoints in Identity. Commerce no longer owns users (per `Account-Management-Module.md` §"Data and Invariants").

### 8.2 Lifecycle states

**Rule:** Five Falcon user states: `Pending | Active | Suspended | Locked | Deleted`.

**Source:** `Security-Architecture.md` §4.1.2 lines 88-107 + §4.3 lines 464-510.

**Fallback verdict:** **unverified (in code).** Verify Identity service has these as a single enum.

### 8.3 Allowed transitions

**Rule:**
```
Pending → Active
Active → Suspended | Deleted | Locked
Suspended → Active
Locked → Pending (recovery reset) | Active (direct unlock)
Deleted → Active (Falcon user only)
```

**Source:** `Security-Architecture.md` §4.3.2 lines 472-495.

### 8.4 Deleted semantics

**Rule:** `Status = Deleted` AND `IsDeleted = true`. Excluded from quota counts. Excluded from client lists by default. Falcon admin lists may include with explicit flag.

**Source:** `Security-Architecture.md` §4.3.4 lines 505-510.

### 8.5 Commerce owns business tenant/account; Identity owns users

**Rule:** Tenant ownership split: Commerce owns the **business tenant/account** entity (node hierarchy, account settings); Identity owns **users** (TenantUser, login state).

**Source:** `Account-Management-Module.md` §"Data and Invariants" lines 51-76 + `Security-Architecture.md` §4.8.

**Fallback verdict:** **resolves UNVERIFIED §9 from fallback.** Both services have a "tenant" concept legitimately — Commerce's is business-level, Identity's is identity-level.

### 8.6 Settings sync Commerce → Identity via Kafka

**Rule:** Topic **`commerce.identity-settings-sync.v1`**.

**Source:** `Security-Architecture.md` §4.2.8 line 366.

---

## 9. Tooling / patterns

### 9.1 Mediator + Mapper choice

**Rule:** **WIKI-SILENT.** The wiki references CQRS patterns abstractly without prescribing MediatR vs Mediator vs Riok.Mapperly vs AutoMapper.

**Fallback verdict:** **WIKI-SILENT — code-pattern only.** Fallback §9 catalogued split (older services on MediatR + AutoMapper; newer on Mediator + Mapperly). Wiki allows both. **Resolves fallback UNVERIFIED §7: not deprecated, choice is per-service.**

### 9.2 Validation library

**Rule:** **WIKI-SILENT.** Fluentvalidation is used across the platform but not mandated by wiki.

**Fallback verdict:** **WIKI-SILENT — code-pattern only.**

### 9.3 Source generators

**Rule:** **WIKI-SILENT.** Mediator + Mapperly source generators are acceptable.

**Fallback verdict:** **WIKI-SILENT — code-pattern only.**

### 9.4 Outbox pattern

**Rule:** **Recommended** in `Clean-Architecture-…md` §"Publishing events/commands". See §2.5 above.

### 9.5 Coding standards / design patterns / error handling / logging

**Rule:** **WIKI-SILENT.** `Design-Patterns-&-Guidelines.md` has these as empty headings (lines 209-218).

**Fallback verdict:** **WIKI-SILENT — none of the per-service patterns can be ratified or denied here.**

---

## 10. Open questions (now reduced)

The 12 UNVERIFIED items in the fallback are resolved as follows:

| # | Question | Resolution |
|---|---|---|
| 1 | `.sln` vs `.slnx` | `.sln` is canonical (`Design-Patterns-&-Guidelines.md`) — code must migrate. |
| 2 | Separate csproj per layer vs folder-only | **Separate csproj is canonical** (`Clean-Architecture-…md`) — Identity / Contact Group should migrate. |
| 3 | `MongoDB.Driver` allowed in Domain? | **No** — Domain must have zero IO/framework deps. Code violation. |
| 4 | gRPC required for sync inter-service? | **gRPC OR HTTP** is acceptable per wiki, but **gRPC is the canonical preferred path** (multiple wiki mentions). Code uses HTTP exclusively — acceptable but suboptimal. |
| 5 | `ValidateAudience=true` uniform? | **Yes.** Code has 3 services with `false` — violation. |
| 6 | `MultiLanguageName` required everywhere? | **No — wiki-silent.** Use where domain demands; not a global rule. |
| 7 | `MediatR + AutoMapper` deprecated? | **No — wiki-silent.** Per-service choice. |
| 8 | `polishing-v0.4` branch valid? | **No — violation.** TBD only allows `main` + short-lived branches. |
| 9 | Tenant ownership Commerce or Identity? | **Both.** Commerce owns business tenant; Identity owns users. Settings synced via Kafka. |
| 10 | `ServiceOperationResult<T>` shared NuGet? | **Wiki-silent.** Should be created but no current wiki rule. |
| 11 | T2.PES rename + net6→net10? | **Yes** — implied by `Design-Patterns-&-Guidelines.md` naming + `Deployment-Document-…md` stack. |
| 12 | System Gateway should also have Kafka/rate/IP? | **No.** Wiki §2.2.3 says IP allowlist is Core-only; asymmetry is by design. Rate limiting unclear. |

**New open questions surfaced from the wiki pass:**
- Wiki silent on `ServiceOperationResult<T>` shape — recommend a wiki ADR.
- Wiki silent on shared `FalconException`/`FalconError` — recommend a wiki ADR.
- Wiki names a **Platform Services Gateway** that does not exist in code — when will it be built?
- ClickHouse OLAP tier prescribed by wiki, missing from code.
- AI Conversational Orchestration entirely forward-looking — no service repo yet.
- `Microsoft.FeatureManagement` not present in any service — feature flags not implemented.
- `X-MicroApp-Key` Vault integration not present — dual credential not enforced.
- gRPC adoption not started — wiki accepts HTTP, but gRPC is the preferred direction.

---

**See also:**
- `CONSOLIDATED_ARCHITECTURE_CONFLICTS.md` — drift log between wiki and code.
- `WIKI_TO_CODE_TRACE.md` — bridge between wiki rules and code locations.
- `Home/Software-Architecture-Design/<DOC>.md` — per-doc deep-dives.
