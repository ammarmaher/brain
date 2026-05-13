*** WIKI_TO_CODE_TRACE — wiki rule → code location bridge ***

> Two-column map. Left: a citeable wiki rule (file + heading). Right: where in code that rule materializes (or where it should).
> Wiki HEAD: `0d0cb311b56a991b94b6a0af03a26a12014b2926`.
> Codebase root: `C:\Falcon\Falcon\`.

Statuses:
- ✓ = code matches wiki rule
- ✗ = code violates / does not implement wiki rule
- ◐ = partial implementation
- — = wiki rule is future-state; code is correctly empty for now

---

## 1. Solution / project structure

| WIKI rule | CODE location | Status |
|---|---|---|
| `Design-Patterns-&-Guidelines.md` §".NET Solution & Project Naming" line 122 — solution file is `<ServiceName>.sln` | `falcon-core-identity-svc\Falcon.Identity.sln`, `falcon-core-contact-group-svc\Falcon.ContactGroup.sln`, `falcon-core-access-svc\t2.PES.sln` | ✓ (3 services) |
| Same | `falcon-core-charging-svc\Falcon.Charging.slnx`, `falcon-core-commerce-svc\Falcon.Commerce.slnx`, `falcon-core-provisioning-svc\Falcon.Provisioning.slnx`, `falcon-core-templates-svc\Falcon.Templates.slnx`, `falcon-int-core-gateway-svc\Falcon.Core.Gateway.slnx`, `falcon-int-system-gateway-svc\Falcon.System.Gateway.slnx` | ✗ (`.slnx` not `.sln`) |
| `Clean-Architecture-…md` §"Clean Architecture projects" + `Design-Patterns-…` §".NET Solution" — 5 csproj per service (`Api`, `Application`, `Domain`, `Infrastructure`, `Contracts`) | `falcon-core-commerce-svc\src\Falcon.Commerce.{Api,Application,Domain,Infrastructure,Contracts}\` | ✓ (Commerce) |
| Same | `falcon-core-charging-svc\src\Falcon.Charging.{Api,Application,Domain,Infrastructure,Contracts}\` | ✓ (Charging) |
| Same | `falcon-core-provisioning-svc\src\Falcon.Provisioning.{Api,Application,Domain,Infrastructure,Contracts}\` | ✓ (Provisioning) |
| Same | `falcon-core-templates-svc\src\Falcon.Templates.{Api,Application,Domain,Infrastructure,Contracts}\` | ✓ (Templates) |
| Same | `falcon-core-identity-svc\src\Falcon.Identity.Api\` (folders only — no separate csproj for Application/Domain/Infrastructure) | ✗ (single-csproj) |
| Same | `falcon-core-contact-group-svc\src\Falcon.ContactGroup.Api\` (folders only) | ✗ (single-csproj) |
| `Clean-Architecture-…md` §"Project dependencies" line 568 — `Domain → references nothing` | `falcon-core-commerce-svc\src\Falcon.Commerce.Domain\Falcon.Commerce.Domain.csproj:14-17` has `MongoDB.Bson` | ✗ (Domain leaks Mongo) |
| Same | `falcon-core-commerce-svc\src\Falcon.Commerce.Contracts\Falcon.Commerce.Contracts.csproj:9` references Domain | ✗ (Contracts depends on Domain) |
| `Design-Patterns-…md` §".NET Solution" line 119 — namespace `Falcon.<Service>.<Layer>` | All `Falcon.*` projects | ✓ |
| Same | `falcon-core-access-svc\src\T2.PES.{API,Test,}\` | ✗ (`T2.PES.*` not `Falcon.Access.*`) |
| `Deployment-Document-…md` §"Project Overview" line 32 — `.net Core 10` | All `Falcon.*.csproj` `<TargetFramework>net10.0</TargetFramework>` | ✓ |
| Same | `T2.PES.API.csproj:3` — `<TargetFramework>net6.0</TargetFramework>` | ✗ |

---

## 2. Cross-service communication

| WIKI rule | CODE location | Status |
|---|---|---|
| `High-Level-Architecture.md` §"Internal Service Communication Rule" line 192 — Kafka + Avro for async events | `falcon-core-commerce-svc\src\Falcon.Commerce.Infrastructure\Messaging\Kafka\KafkaAvroProducer.cs`, `…\KafkaJsonProducer.cs`, `…\FalconServiceOrderPaymentProcessedEventConsumer.cs` | ✓ |
| Same | `falcon-core-charging-svc\src\Falcon.Charging.Infrastructure\**\Messaging\Kafka\Consumers\{UserCreatedConsumer, WalletConfiguredConsumer, CommChannelShownConsumer, SubNodeCreatedConsumer, FalconServiceOrderCreatedConsumer, ContractLifecycleConsumer, TestKafkaConsumer}.cs` | ✓ |
| Same | `falcon-core-identity-svc\src\Falcon.Identity.Api\Infrastructure\Messaging\Kafka\UserRoleLinkSyncRequestedEventPublisher.cs` | ✓ |
| Same | `falcon-core-templates-svc\src\Falcon.Templates.Infrastructure\...\Consumers\{CommChannelInit, CommChannelVisibilityChanged, UserCheckerAssigned, UserCheckerAssignmentsUpdated}` | ✓ |
| Same | `falcon-core-contact-group-svc\src\Falcon.ContactGroup.Api\Infrastructure\Messaging\Kafka\` | ✓ |
| `High-Level-Architecture.md` §3.6 line 558 — sync calls via gRPC | (zero `*.proto` files; no `Grpc.AspNetCore`) | ✗ |
| Same | `falcon-core-commerce-svc\src\Falcon.Commerce.Infrastructure\External\Services\{IdentityService, ProvisioningService, AccessRoleBootstrapClient}.cs` (HTTP clients) | ◐ (HTTP — wiki accepts as fallback) |
| `Security-Architecture.md` §4.2.8 line 366 — topic `commerce.identity-settings-sync.v1` | `falcon-core-commerce-svc\src\Falcon.Commerce.Infrastructure\Messaging\Kafka\` (verify publisher; expected) | ◐ (unverified) |
| `Security-Architecture.md` §4.2.9 line 421 — `TenantIpAllowlistUpdated` event consumer | `falcon-int-core-gateway-svc\src\Falcon.Core.Gateway\Messaging\Consumers\TenantIpAllowlistChangedConsumer.cs` | ✓ (consumer) |
| Same — but **producer should be Identity**, not Commerce | Currently produced by Commerce per fallback §3.2 | ✗ (wrong producer service) |
| `Clean-Architecture-…md` §"Publishing events/commands" line 641 — outbox pattern recommended | No outbox dispatcher observed in any service | ✗ |

---

## 3. Gateways

| WIKI rule | CODE location | Status |
|---|---|---|
| `High-Level-Architecture.md` §2.2 — three gateways exist | `falcon-int-core-gateway-svc\` (Core), `falcon-int-system-gateway-svc\` (System) | ◐ (2 of 3) |
| Same — Platform Services Gateway | (no repo) | ✗ |
| §2.2.1 — YARP-based pass-through | `falcon-int-core-gateway-svc\src\Falcon.Core.Gateway\Falcon.Core.Gateway.csproj:16` — `Yarp.ReverseProxy` PackageReference | ✓ |
| Same | `falcon-int-system-gateway-svc\src\Falcon.System.Gateway\Falcon.System.Gateway.csproj:17` | ✓ |
| §2.2.2 — internal route segmentation `/{service-name}/{**catch-all}` | `falcon-int-core-gateway-svc\src\Falcon.Core.Gateway\appsettings.json:66-194` — routes `/commerce/**`, `/provisioning/**`, `/charging/**`, `/identity/**`, `/contactgroup/**` | ✓ (Core) |
| Same | `falcon-int-system-gateway-svc\src\Falcon.System.Gateway\appsettings.json:41-151` — same prefixes | ✓ (System) |
| §2.2.3 — IP allowlist only in Core Gateway | `falcon-int-core-gateway-svc\src\Falcon.Core.Gateway\Middleware\TenantIpAllowlistMiddleware.cs` (or similar) | ✓ |
| Same — System Gateway has no IP allowlist | (none in system gateway) | ✓ (correctly absent) |
| §"YARP Policy & Multi-Tenancy" line 209 — inject `X-Tenant-Id` header | Verify YARP transform config | ◐ (unverified) |
| §"YARP Policy" line 211 — forward `X-Correlation-Id` | `falcon-int-core-gateway-svc\src\Falcon.Core.Gateway\Middleware\CorrelationIdMiddleware.cs` (per fallback §3.2) | ✓ |
| §2.2.2 — DNS host `system-api.falconhub.space`, `core-api.falconhub.space`, `platform-api.falconhub.space` | Verify Ingress configuration (likely in `falcon-essentials` or k8s manifests) | ◐ (unverified) |

---

## 4. API surface

| WIKI rule | CODE location | Status |
|---|---|---|
| `Security-Architecture.md` §4.2.6 — JWT signature/issuer/**audience**/expiration validation | `Falcon.Commerce.Infrastructure\Auth\ZitadelExtensions.cs` (`ValidateAudience: false` in appsettings.json:27) | ✗ |
| Same | `Falcon.Charging.Api` appsettings.json:27 `ValidateAudience: true` | ✓ |
| Same | `Falcon.Core.Gateway` appsettings.json:27 `ValidateAudience: false` | ✗ |
| Same | `Falcon.System.Gateway` appsettings.json:27 `ValidateAudience: false` | ✗ |
| §4.6.6 — `AdminOnly` + `ManagementAccess` policies | Verify in each service's `Startup\ServiceCollectionExtensions.cs` or `Program.cs` (claims-based `RequireClaim("user_type", "system"/"account")`) | ◐ (unverified) |
| §4.1.1 line 75 — `X-MicroApp-Key` header | (no middleware found in any service) | ✗ |
| §4.2.1 — Identity Service has `/api/auth/login`, `/api/auth/verify-otp`, `/api/auth/first-login`, `/api/auth/forgot-password`, `/api/user/change-password` | `falcon-core-identity-svc\src\Falcon.Identity.Api\Endpoints\Auth\` and `…\Endpoints\Users\` | ✓ |
| §4.1.1 — `/api/webhook/zitadel` | `falcon-core-identity-svc\src\Falcon.Identity.Api\Endpoints\Webhooks\ZitadelWebhookEndpoint.cs` | ✓ |
| §4.2.6 #4 — backend defense-in-depth lifecycle check | Verify lifecycle-aware authorization filter in each service | ◐ (unverified) |
| `Account-Management-Module.md` §endpoints — `/api/node/create-account`, `/api/node/create-SubNode`, `/api/node/ChangeNodeName`, `/api/information`, `/api/setting`, `/api/AccountHierarchy` | `falcon-core-commerce-svc\src\Falcon.Commerce.Api\Controllers\{NodeController, AccountHierarchyController, InformationController, SettingController}.cs` | ✓ |
| `Permissions-&-Authorization-Module-…md` §4.14 — `POST /pes/policyrule`, `POST /pes/authorize`, `POST /pes/authorize/resources` | `falcon-core-access-svc\src\T2.PES.API\Controllers\` (verify endpoints) | ◐ (unverified) |
| `Falcon-Pricing,…OCS-…md` §10.1 — `WalletsController`, `ReservationsController`, `DebitsController`, `CreditsController`, `TransfersController`, `BalancesController` | `falcon-core-charging-svc\src\Falcon.Charging.Api\Controllers\WalletController.cs` (only Wallet — singular) | ◐ (1 of 6) |
| `Falcon-Template-Management-…md` §21.3.5 line 2740 — `GET /api/templates/whatsapp/validation-metadata` | `falcon-core-templates-svc\src\Falcon.Templates.Api\Endpoints\` (verify) | ◐ (unverified) |

---

## 5. Data persistence

| WIKI rule | CODE location | Status |
|---|---|---|
| `High-Level-Architecture.md` §2.7 — MongoDB OLTP | `Falcon.Commerce.Infrastructure.csproj:26` — `MongoDB.Driver` | ✓ |
| Same | `Falcon.Charging.Infrastructure.csproj` — `MongoDB.Driver` | ✓ |
| Same | `Falcon.Identity.Api.csproj:16` — `MongoDB.Driver` | ✓ |
| Same | `Falcon.ContactGroup.Api.csproj:33` — `MongoDB.Driver` | ✓ |
| Same | `Falcon.Templates.Infrastructure.csproj` — `MongoDB.Driver` | ✓ |
| Same | `Falcon.Provisioning.Infrastructure.csproj` — `MongoDB.Driver` | ✓ |
| `Design-Patterns-…md` line 192 — DB name pattern `falcon_<layer>_<service>_db` | Code uses `FalconCommerceDB`, `FalconChargingDB`, `FalconTemplateDb`, `PES` | ✗ |
| §2.7 — Redis for caching | `Falcon.Commerce.Infrastructure`, `Falcon.Identity.Api`, `Falcon.ContactGroup.Api`, `Falcon.Templates.Infrastructure`, `Falcon.Core.Gateway` have `Microsoft.Extensions.Caching.StackExchangeRedis` | ✓ |
| §2.7 line 432 — ClickHouse for OLAP | (no ClickHouse references in any csproj) | ✗ |
| `Contact-Group-Module.md` §3.2 — direct upload via pre-signed URLs (no backend file transfer) | `Falcon.ContactGroup.Api.csproj:50` — `AWSSDK.S3`; verify pre-signed URL generator in `…\Application\` | ◐ (S3 present; URL logic unverified) |
| `Contact-Group-Module.md` §9 — collections `contact_group_upload_sessions`, `contact_groups`, `contact_group_contacts`, `contact_group_import_jobs` | Verify in `Falcon.ContactGroup.Api\Infrastructure\Persistence\` | ◐ (unverified) |
| `Contact-Group-Module.md` §9.6 — TTL index on `(expiresAt)` for upload sessions | Verify index definitions | ◐ (unverified) |

---

## 6. Frontend architecture

| WIKI rule | CODE location | Status |
|---|---|---|
| `Front%2DEnd-Architecture.md` §5.4 + §5.14 — Nx workspace | `falcon-web-platform-ui\nx.json` | ◐ (name drift: workspace called `falcon-web-platform-ui`, wiki says `falcon-console-ui` / `falcon-frontend`) |
| §5.4.1 — Host Shell + §5.4.2 Management Console + §5.4.3 Admin Console | `falcon-web-platform-ui\apps\{host-shell, management-console, admin-console}\` | ◐ (`host-shell` not `shell`) |
| §5.5 — internal libs `@falcon/core`, `@falcon/theme`, `@falcon/i18n`, `@falcon/ui`, `@falcon/layout`, `@falcon/shared`, `@falcon/host-bridge`, `@falcon/federation`, `@falcon/sdk` | Code has `libs/{falcon, falcon-theme, falcon-ui-core, falcon-ui-tokens, falcon-ui-react, falcon-ui-vue, falcon-studio, sdk}` | ✗ (name drift across the board) |
| §5.6 — Falcon SDK published to private npm feed | `libs/sdk/` source exists | ◐ (source yes; publishing pipeline no) |
| §5.8 — Dynamic ES module loader + `<falcon-microapp-outlet>` + `window.FalconMicroApps` registration | (no `MicroappOutletComponent`, no `loadAndInitMicroAppScript` found in code) | ✗ |
| §5.14 #5 — Tailwind config: `corePlugins: { preflight: false }` for micro-apps | Verify in micro-app tailwind configs (when external micro-apps exist) | — (no external micro-apps yet) |
| §5.10 — Local mock shell for micro-app dev | (no mock-shell tooling in repos) | — |
| `Security-Architecture.md` §4.6.5 + §4.1.1 — Frontend calls Identity, never Zitadel directly | `apps\host-shell\src\app\features\auth\` — verify HTTP base URLs target Identity Service `/api/auth/*` | ✓ (per fallback §6.5) |
| `Permissions-…md` §4.13 — `AuthService`, `SubBuilderFromLoggedUser`, `DefaultAuthRequestBuilder`, `DefaultAuthorizationsRequestBuilder`, `PESService`, `PermissionManagerService` | (verify in `libs/falcon/src/core/lib/services/`) | ◐ (unverified) |

---

## 7. Branching / release

| WIKI rule | CODE location | Status |
|---|---|---|
| `Development-&-Deployment-Strategy.md` §3 — only `main` long-lived | `falcon-core-{identity,commerce,charging,provisioning,access,contact-group,templates}-svc`, `falcon-int-{core,system}-gateway-svc`, `falcon-portal`, `Falcon` umbrella — all on `main` | ✓ (11 repos) |
| Same | `falcon-web-platform-ui` on `polishing-v0.4` | ✗ |
| §6 — release via `vX.Y.Z` tags on `main` | (verify `git tag` per service) | ◐ (unverified) |
| §4 — PR rules: build + tests + lint + 1 approval | (Azure DevOps branch protection — verify per repo) | ◐ (unverified) |
| §8 — feature flags via `_featureManager.IsEnabled(...)` (Microsoft.FeatureManagement) | (no `Microsoft.FeatureManagement` package in any csproj) | ✗ |

---

## 8. Identity / ownership boundaries

| WIKI rule | CODE location | Status |
|---|---|---|
| `Security-Architecture.md` §4.1.1 — Identity owns user lifecycle | `falcon-core-identity-svc\src\Falcon.Identity.Api\Endpoints\Users\{CreateUserEndpoint, GetUserByIdEndpoint, ListNodeUsersEndpoint, ListTenantUsersEndpoint, UpdateMyProfileEndpoint, UpdateUserProfileByIdEndpoint, UpdateUserRoleByIdEndpoint, ChangeUserStatusEndpoint, ChangePasswordEndpoint, ResendEmail/PhoneVerificationEndpoint, …}.cs` | ✓ |
| `Account-Management-Module.md` §"Users" — Commerce delegates user creation to Identity | `falcon-core-commerce-svc\src\Falcon.Commerce.Infrastructure\External\Services\IdentityService.cs` (HTTP client to Identity) | ✓ |
| `Security-Architecture.md` §4.2.1 — Identity owns `Settings` store; security settings synced from Commerce via Kafka `commerce.identity-settings-sync.v1` | (verify producer in Commerce + consumer in Identity) | ◐ (unverified) |
| §4.3 — 5 lifecycle states `Pending|Active|Suspended|Locked|Deleted` | Verify in `falcon-core-identity-svc\src\Falcon.Identity.Api\Domain\` enum | ◐ (unverified) |
| §4.3.2 — allowed transitions | Verify state machine in Identity | ◐ (unverified) |
| §4.3.4 — Deleted: `Status = Deleted` AND `IsDeleted = true`; excluded from quota | Verify in Identity domain | ◐ (unverified) |

---

## 9. Permissions & Access (PBAC)

| WIKI rule | CODE location | Status |
|---|---|---|
| `Permissions-…md` §4.2 — six-element model `(subject, object, action, effect, type, expression)` | `falcon-core-access-svc\src\T2.PES.API\` (verify policy schema) | ◐ (unverified) |
| §4.12 — single `policies` table SoT | (verify Mongo collection / SQL table) | ◐ (unverified) |
| §4.12.6 — 4 mandatory indexes: `(tenant, subject)`, `(tenant, object, action)`, `(tenant, type)`, `(tenant, effect)` | (verify in repo) | ◐ (unverified) |
| §4.6.1 — PEP at API Gateway | (gateways do not call PES per request — verify) | ◐ (likely missing) |
| §4.14 — `/pes/policyrule`, `/pes/authorize`, `/pes/authorize/resources` endpoints | `T2.PES.API\Controllers\` (verify) | ◐ (unverified) |

---

## 10. Pricing / Tariff / OCS / Charging

| WIKI rule | CODE location | Status |
|---|---|---|
| `Falcon-Pricing,…OCS-…md` §6 — Commerce owns contracts + tariff snapshot | `falcon-core-commerce-svc\src\Falcon.Commerce.Domain\Entities\Contract\` (verify) | ◐ (unverified) |
| §8 — OCS bounded context owns wallet, balance, charging, rating, ledger | `falcon-core-charging-svc\src\Falcon.Charging.Domain\` | ◐ |
| §10.3 — Wallet aggregate root with methods `ReserveUsage`, `CommitReservation`, `ReleaseReservation`, `Debit`, `Credit`, `TransferOut`, `TransferIn`, `CreateBucket` | `falcon-core-charging-svc\src\Falcon.Charging.Domain\Aggregates\Wallet\Wallet.cs` (verify) | ◐ (unverified) |
| §10.3 — Bucket entity with `bucketId, walletId, contractId, tariffSnapshotRef, bucketType, totalAmount, availableAmount, reservedAmount, consumedAmount, …` | `falcon-core-charging-svc\src\Falcon.Charging.Domain\` (verify) | ◐ (unverified) |
| §10.3 — Reservation entity with `reservationId, walletId, policyCode, refType, refId, status, allocations[]` | `falcon-core-charging-svc\src\Falcon.Charging.Domain\` (verify) | ◐ (unverified) |
| §10.3 — LedgerEntry entity | `falcon-core-charging-svc\src\Falcon.Charging.Domain\` (verify) | ◐ (unverified) |
| §10.2 — `ChargeAuthorizationService` shared service | `falcon-core-charging-svc\src\Falcon.Charging.Application\Services\` (verify) | ◐ (unverified) |
| §10.2 — channel-specific thin handlers (`AuthorizeWhatsappChargeHandler`, etc.) | `falcon-core-charging-svc\src\Falcon.Charging.Application\Handlers\` (verify) | ◐ (unverified) |
| §10.1 — 6 controllers (Wallets, Reservations, Debits, Credits, Transfers, Balances) | Only `WalletController.cs` exists | ✗ (5 missing) |
| §5.6 — multi-wallet transfer rule (must flow through account channel wallet) | `falcon-core-charging-svc\src\Falcon.Charging.Domain\Policies\TransferPolicy.cs` (verify) | ◐ (unverified) |
| §5.7 — every money change creates a ledger entry | (verify across all wallet mutations) | ◐ (unverified) |

---

## 11. Template Management (WhatsApp / Meta)

| WIKI rule | CODE location | Status |
|---|---|---|
| `Falcon-Template-Management-…md` §21.3.1 — Template Management Service | `falcon-core-templates-svc\src\Falcon.Templates.*` | ✓ (service exists) |
| §21.3.2 — Internal Approval Workflow Engine (two-tier sequential, any-to-approve) | `Falcon.Templates.Application\` (verify) | ◐ (unverified) |
| §21.3.3 — Meta Template Adapter | `Falcon.Templates.Infrastructure\External\Meta\` (verify) | ◐ (unverified) |
| §21.3.4 — Meta Webhook Handler with signature validation | `Falcon.Templates.Api\Endpoints\Webhooks\` (verify) | ◐ (unverified) |
| §21.3.5 — Template Validation Engine + `ITemplateValidationEngine` + rule registry + 25+ rules + `WhatsAppTemplateRuleSnapshot` versioned + `FeatureFlags` | `Falcon.Templates.Application\Validation\` (verify) | ◐ (unverified) |
| §21.3.5 line 2740 — `GET /api/templates/whatsapp/validation-metadata` | `Falcon.Templates.Api\Endpoints\` (verify) | ◐ (unverified) |
| §21.3.6 — Template Preview Engine | `Falcon.Templates.Api\Preview\` (verify) | ◐ (unverified) |
| §10 — Falcon normalized status set | `Falcon.Templates.Domain\Enums\` (verify) | ◐ (unverified) |

---

## 12. AI Conversational Orchestration

| WIKI rule | CODE location | Status |
|---|---|---|
| `Falcon-AI-Conversational-Orchestration.md` §3 — Agent A (Designer) + Agent B (Execution) | (no `falcon-ai-*-svc` repo) | — (future state) |
| §5 — Conversation Blueprint JSON schema | — | — |
| §7 — three branching modes (Numeric, Text Match, Semantic LLM) | — | — |
| §8 — Server-side execution engine | — | — |
| §11 — Semantic Evaluation Engine | — | — |
| §14 — Redis state storage | — | — |

---

## 13. Contact Group module

| WIKI rule | CODE location | Status |
|---|---|---|
| `Contact-Group-Module.md` §1 — dedicated microservice with API/Application/Domain/Infrastructure/Worker layers | `falcon-core-contact-group-svc\src\Falcon.ContactGroup.Api\` (single-csproj with folder layers) | ◐ (folders not separate csproj — see M5) |
| §3.2 — Direct upload pattern (backend never receives file bytes) | Verify pre-signed-URL endpoint | ◐ (unverified) |
| §5 — Pre-signed URL via storage SDK (5-minute TTL `expiresInSeconds: 300`) | `Falcon.ContactGroup.Api\Infrastructure\Storage\` (verify) | ◐ (unverified) |
| §7.2.1 — temp object path `tenants/{tenantId}/contact-groups/temp/{uploadId}/original/{fileName}` | Verify in code | ◐ |
| §7.4.1 — final path `tenants/{tenantId}/contact-groups/{groupId}/original/{fileName}` | Verify in code | ◐ |
| §8 — batched MongoDB writes (500-2000 rows) | Verify worker batch size | ◐ |
| §9.6 — index `(expiresAt)` TTL on upload sessions | Verify index | ◐ |
| §9.8 — cleanup worker for expired sessions | `Falcon.ContactGroup.Api.csproj:57-59` Hangfire references; verify the job | ◐ |

---

## 14. Deployment

| WIKI rule | CODE location | Status |
|---|---|---|
| `Deployment-Document-…md` §"Project Overview" line 32-41 — stack: .NET 10, Angular 20, Kafka, MongoDB 8.2, Redis 8.4 | `Falcon.*.csproj` `<TargetFramework>net10.0</TargetFramework>` | ✓ (.NET 10) |
| Same — Angular 20 | `package.json:43-51` Angular 21.2.9 | ◐ (ahead of wiki) |
| Same — MongoDB 8.2 | `Falcon\docker-compose.yml` mongo image version | ◐ (verify) |
| §"Server Communication" — Worker→DB: 27017; Worker→Kafka/Redis: 9092, 9094, 6379 | k8s service definitions / docker-compose | ◐ (verify) |
| §"Publishing" — DNS `*.falconhub.sa` (canonical may be `*.falconhub.space` per High-Level §2.2.2) | Frontend env config | ◐ (drift) |
| §"VM Configuration" — Worker Node 4 vCore / 32 GB / 50 GB SSD | k8s node pools | — (ops concern) |

---

## How to extend this table

When code is added that implements a wiki rule, replace the matching ◐ with ✓ and add the concrete file path.
When code is added that violates a wiki rule, add a new row with ✗ + concrete file path + line range.
When a wiki rule is removed/updated, sync this table.

This file is the **bridge** the next agent needs most — keep it dense and concrete.
