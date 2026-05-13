*** ARCHITECTURE_RULES — code-extracted (Wiki missing) ***

> Fallback rule book. See `WIKI_FALLBACK_NOTE.md` for status and override
> rules. Every rule cites concrete source evidence so it can be audited.

---

## 1. Solution / project structure

### 1.1 Mixed solution-format usage (`.sln` vs `.slnx`)

| Service | Solution file | Format |
|---|---|---|
| Charging | `falcon-core-charging-svc/Falcon.Charging.slnx` | `.slnx` |
| Commerce | `falcon-core-commerce-svc/Falcon.Commerce.slnx` | `.slnx` |
| Provisioning | `falcon-core-provisioning-svc/Falcon.Provisioning.slnx` | `.slnx` |
| Templates | `falcon-core-templates-svc/Falcon.Templates.slnx` | `.slnx` |
| Core Gateway | `falcon-int-core-gateway-svc/Falcon.Core.Gateway.slnx` | `.slnx` |
| System Gateway | `falcon-int-system-gateway-svc/Falcon.System.Gateway.slnx` | `.slnx` |
| Identity | `falcon-core-identity-svc/Falcon.Identity.sln` | `.sln` |
| Contact Group | `falcon-core-contact-group-svc/Falcon.ContactGroup.sln` | `.sln` |
| Access (PES) | `falcon-core-access-svc/t2.PES.sln` | `.sln` |

Commerce additionally carries a legacy `src/src.sln` alongside its root `.slnx`
(`C:\Falcon\Falcon\falcon-core-commerce-svc\src\src.sln`). Both formats are
parseable by `dotnet build`, but the duplication invites drift. Recorded as
conflict (see `ARCHITECTURE_CONFLICTS.md` §1).

**Rule (de-facto):** newer services adopt `.slnx` (XML). Identity / Contact
Group / Access were initialized earlier and keep `.sln`. There is no enforced
project-wide standard.

### 1.2 Clean Architecture layering — partially enforced

**Layered services** (5 csproj each: `*.Api`, `*.Application`, `*.Contracts`,
`*.Domain`, `*.Infrastructure`):

- Charging — `C:\Falcon\Falcon\falcon-core-charging-svc\src\Falcon.Charging.*`
- Commerce — `C:\Falcon\Falcon\falcon-core-commerce-svc\src\Falcon.Commerce.*`
- Provisioning — `C:\Falcon\Falcon\falcon-core-provisioning-svc\src\Falcon.Provisioning.*`
- Templates — `C:\Falcon\Falcon\falcon-core-templates-svc\src\Falcon.Templates.*`

**Single-project services** (one `.Api` csproj with `Application/`,
`Domain/`, `Infrastructure/`, `Endpoints/`, `Startup/` as folders inside it):

- Identity — `C:\Falcon\Falcon\falcon-core-identity-svc\src\Falcon.Identity.Api\`
  (folders: `Application/`, `Domain/`, `Infrastructure/`, `Endpoints/`, `Startup/`)
- Contact Group — `C:\Falcon\Falcon\falcon-core-contact-group-svc\src\Falcon.ContactGroup.Api\`
  (folders: `Application/`, `Domain/`, `Infrastructure/`, `Endpoints/`, `Startup/`)

Both shapes preserve the *logical* Clean Architecture boundary; only the
*project boundary* differs. The single-project services rely on namespace
discipline rather than the C# compiler to enforce direction.

### 1.3 Dependency direction (Commerce sample)

Verified in csproj `<ProjectReference>` entries:

- `Falcon.Commerce.Domain.csproj` — no project references (only `MongoDB.Bson`
  package; **flagged as Clean-Architecture violation**, see Conflicts §3.1).
  `C:\Falcon\Falcon\falcon-core-commerce-svc\src\Falcon.Commerce.Domain\Falcon.Commerce.Domain.csproj:14-17`
- `Falcon.Commerce.Application.csproj` → references `Domain` only.
  `…\Falcon.Commerce.Application\Falcon.Commerce.Application.csproj:29`
- `Falcon.Commerce.Infrastructure.csproj` → references `Application` + `Domain`.
  `…\Falcon.Commerce.Infrastructure\Falcon.Commerce.Infrastructure.csproj:38-39`
- `Falcon.Commerce.Api.csproj` → references `Contracts` + `Infrastructure`.
  `…\Falcon.Commerce.Api\Falcon.Commerce.Api.csproj:22-23`
- `Falcon.Commerce.Contracts.csproj` → references `Domain` (unusual — Contracts
  is typically pure DTOs).
  `…\Falcon.Commerce.Contracts\Falcon.Commerce.Contracts.csproj:9`

Dependency direction `Domain ← Application ← Infrastructure ← Api` is upheld
*structurally*, but Domain leaks Mongo (Conflicts §3.1) and Contracts depends
on Domain (Conflicts §3.2).

### 1.4 Project naming pattern

Canonical: `Falcon.<Service>.<Layer>` with `<Service>` PascalCase.

Confirmed: `Falcon.Commerce.*`, `Falcon.Charging.*`, `Falcon.Provisioning.*`,
`Falcon.Templates.*`, `Falcon.Identity.Api`, `Falcon.ContactGroup.Api`,
`Falcon.Core.Gateway`, `Falcon.System.Gateway`.

**Exception:** Access service uses `T2.PES.*` — pre-rename naming retained.
`C:\Falcon\Falcon\falcon-core-access-svc\src\T2.PES.API\T2.PES.API.csproj:1`

### 1.5 Target framework

Standard: **`net10.0`** across all `Falcon.*` projects (33 csproj checked).

**Exception:** `T2.PES.*` (Access service) targets **`net6.0`** — four major
versions behind. `…\T2.PES.API\T2.PES.API.csproj:3`,
`…\T2.PES\T2.PES.csproj`, `…\T2.PES.Test\T2.PES.Test.csproj`.

### 1.6 Shared build properties

`Directory.Build.props` exists at the root of Identity, Contact Group,
Templates, Core Gateway, System Gateway. It centralises:

- `TargetFramework=net10.0`
- `LangVersion=14`
- `Nullable=enable`
- `ImplicitUsings=enable`
- `TreatWarningsAsErrors=true`
- `NuGetAudit=true`, `NuGetAuditLevel=low`
- `EnforceCodeStyleInBuild=true`
- `AnalysisLevel=latest-recommended`
- Analyzers: `Meziantou.Analyzer`, `SonarAnalyzer.CSharp`

`…\falcon-core-identity-svc\Directory.Build.props:1-20`
`…\falcon-core-contact-group-svc\Directory.Build.props:1-20`

Commerce / Charging / Provisioning have **no root `Directory.Build.props`** —
each csproj sets `<TargetFramework>` and `<ImplicitUsings>` inline. They lack
`TreatWarningsAsErrors`, `NuGetAudit`, `Meziantou/Sonar` analyzers. Recorded
as conflict (§3.3).

---

## 2. Cross-service communication

### 2.1 East-West (service-to-service) is HTTP, never via gateway

Confirmed in Commerce. `IdentityService` is described in its own header as an
"East-West HTTP client for the Identity service":
`C:\Falcon\Falcon\falcon-core-commerce-svc\src\Falcon.Commerce.Infrastructure\External\Services\IdentityService.cs:10-15`

It calls Identity at the configured `ServicesClients:Identity:BaseUrl` —
**not** through Core/System Gateway. Same pattern in
`…\External\Services\ProvisioningService.cs`,
`…\External\Services\AccessRoleBootstrapClient.cs`.

`ServicesClientsOptions` configuration:
`…\Falcon.Commerce.Infrastructure\Configurations\Clients\ServicesClientsOptions.cs`

Charging / Identity / Provisioning have no `gateway` references in their
service code (Grep confirmed empty result).

### 2.2 Kafka usage — universal asynchronous bus

| Service | Producer | Consumer |
|---|---|---|
| Commerce | yes (`KafkaAvroProducer`, `KafkaJsonProducer`) | yes (`FalconServiceOrderPaymentProcessedEventConsumer`) |
| Charging | yes | yes (UserCreated / WalletConfigured / CommChannelShown / SubNodeCreated / FalconServiceOrderCreated / ContractLifecycle / TestKafka) |
| Identity | yes (`UserRoleLinkSyncRequestedEventPublisher`) | no |
| Templates | no (configures + reads) | yes (CommChannelInit / CommChannelVisibilityChanged / UserCheckerAssigned / UserCheckerAssignmentsUpdated) |
| Contact Group | yes | no |
| Core Gateway | no | yes (`TenantIpAllowlistChangedConsumer`) |
| System Gateway | no | no |
| Provisioning | no | no |
| Access (PES) | no | no |

Evidence root paths:
- `C:\Falcon\Falcon\falcon-core-commerce-svc\src\Falcon.Commerce.Infrastructure\Messaging\Kafka\`
- `C:\Falcon\Falcon\falcon-core-charging-svc\src\Falcon.Charging.Infrastructure\**\Messaging\Kafka\Consumers\`
- `C:\Falcon\Falcon\falcon-core-identity-svc\src\Falcon.Identity.Api\Infrastructure\Messaging\Kafka\`
- `C:\Falcon\Falcon\falcon-int-core-gateway-svc\src\Falcon.Core.Gateway\Messaging\Consumers\TenantIpAllowlistChangedConsumer.cs`

Common base classes: `KafkaAvroProducer`, `KafkaAvroConsumerBase`,
`KafkaJsonProducer`. Avro is the dominant serialization (via
`Confluent.SchemaRegistry.Serdes.Avro`).

### 2.3 gRPC — **NOT USED**

Glob `**/*.proto` returns zero matches across the entire `C:\Falcon\Falcon`
tree. No `Grpc.AspNetCore`, no `Grpc.Tools`, no protobuf-generated stubs.

CLAUDE.md mentions "use gRPC/Kafka directly" for internal calls — in actual
code, gRPC is **NOT** used. Inter-service sync calls are plain HTTP via
`HttpClientFactory` (see §2.1).

`UNVERIFIED — wiki needed:` decide whether gRPC is a planned future direction
or stale doc. If it is canonical, every East-West HTTP client violates the
rule.

---

## 3. Gateways

### 3.1 Both gateways use YARP

`Yarp.ReverseProxy` is a direct `PackageReference` in both gateway csproj:
- `…\falcon-int-core-gateway-svc\src\Falcon.Core.Gateway\Falcon.Core.Gateway.csproj:16`
- `…\falcon-int-system-gateway-svc\src\Falcon.System.Gateway\Falcon.System.Gateway.csproj:17`

### 3.2 Core Gateway (`/api/*` for **Client** users, port 7038)

YARP route table at `…\falcon-int-core-gateway-svc\src\Falcon.Core.Gateway\appsettings.json:66-194`:

| Route | Path prefix | Cluster | AuthorizationPolicy |
|---|---|---|---|
| `commerce-proxy` | `/commerce/**` | `commerce-cluster` | `ClientOnly` |
| `provisioning-proxy` | `/provisioning/**` | `provisioning-cluster` | `ClientOnly` |
| `charging-proxy` | `/charging/**` | `charging-cluster` | `ClientOnly` |
| `identity-auth-proxy` | `/identity/auth/**` | `identity-cluster` | `Anonymous` |
| `identity-proxy` | `/identity/**` | `identity-cluster` | `ClientOnly` |
| `contactgroup-proxy` | `/contactgroup/**` | `contactgroup-cluster` | `ClientOnly` |

All routes have a `PathRemovePrefix` + `PathPrefix=/api` transform —
gateway strips the path segment and forwards to `/api/...` on the upstream.

**Custom behaviour beyond pass-through:**
- Rate limiting `PerTenant` (configured `PermitLimit=100, WindowInSeconds=60`)
- IP allowlist middleware (`TenantIpAllowlistMiddleware`)
- Kafka consumer (`TenantIpAllowlistChangedConsumer`) — updates a Redis cache
  to feed the IP-allowlist middleware
- Correlation ID middleware
- Identity has TWO routes — `/identity/auth/*` is `Anonymous` (login flows),
  `/identity/*` is `ClientOnly` (post-auth)

`…\falcon-int-core-gateway-svc\src\Falcon.Core.Gateway\Startup\Extensions\WebApplicationExtensions.cs:17-38`

### 3.3 System Gateway (`/api/*` for **Falcon** admin users)

YARP route table at `…\falcon-int-system-gateway-svc\src\Falcon.System.Gateway\appsettings.json:41-151`:

| Route | Path prefix | Cluster | AuthorizationPolicy |
|---|---|---|---|
| `commerce-proxy` | `/commerce/**` | `commerce-cluster` | `FalconOnly` |
| `provisioning-proxy` | `/provisioning/**` | `provisioning-cluster` | `FalconOnly` |
| `charging-proxy` | `/charging/**` | `charging-cluster` | `FalconOnly` |
| `identity-proxy` | `/identity/**` | `identity-cluster` | `FalconOnly` |
| `contactgroup-proxy` | `/contactgroup/**` | `contactgroup-cluster` | `FalconOnly` |

Same path-transform pattern as Core Gateway. **System Gateway carries no
Kafka, no rate-limiter, no IP allowlist** — it's a thinner pass-through.
That asymmetry is recorded as a conflict (§3.4).

### 3.4 JWT validation — defense-in-depth at both gateway and service

Gateways validate JWT via `Microsoft.AspNetCore.Authentication.JwtBearer`
(in both csproj). Downstream services **also** validate JWT independently
(self-described in Commerce as "Defense-in-depth: Commerce validates JWTs
independently of the API Gateway"):
`…\falcon-core-commerce-svc\src\Falcon.Commerce.Infrastructure\Auth\ZitadelExtensions.cs:11-13`

This means a misconfigured downstream that drops auth-middleware would still
be vulnerable directly, but in normal operation the gateway is **not** the
sole auth checkpoint.

---

## 4. API surface conventions

### 4.1 `ServiceOperationResult<T>` is the wrapper — but it has five shapes

The shape is **not unified**. Each service has its own copy with subtle
differences. Documented in detail in `ARCHITECTURE_CONFLICTS.md` §4.

| Service | Type | Fields | Path |
|---|---|---|---|
| Commerce | `record` | `IsSuccessful, Result, ErrorCodes, ErrorMessages` (4) | `…\Falcon.Commerce.Api\Common\ServiceOperationResult.cs` |
| Identity | `record` | `IsSuccessful, Result, ErrorMessages` (3) | `…\Falcon.Identity.Api\Application\Models\ServiceOperationResult.cs` |
| Charging | `struct` | `IsSuccessful, ErrorMessages, Result` | `…\Falcon.Charging.Contracts\ServiceOperationResult.cs` |
| Provisioning | `struct` | `IsSuccessful, ErrorMessages, Result` | `…\Falcon.Provisioning.Contracts\ServiceOperationResult.cs` |
| Templates | `record` | `IsSuccessful, Result, ErrorMessages` (3) | `…\Falcon.Templates.Contracts\Common\ServiceOperationResult.cs` |
| Contact Group | `record` | `IsSuccessful, Result, ErrorMessages` (3) | `…\Falcon.ContactGroup.Api\Application\Models\ServiceOperationResult.cs` |
| Access (PES) | not found | — | — |

Sample endpoints returning `ServiceOperationResult<T>`:
- `…\Falcon.Commerce.Api\Controllers\NodeController.cs` (49 occurrences)
- `…\Falcon.Charging.Api\Controllers\WalletController.cs` (16 occurrences)
- `…\Falcon.ContactGroup.Api\Endpoints\ContactGroups\CreateContactGroupEndpoint.cs`

### 4.2 Endpoint style splits — Controllers vs FastEndpoints

**Controller-based** (MVC `[ApiController]` + `: ControllerBase`):
- Commerce — 9 controllers under `…\Falcon.Commerce.Api\Controllers\`
  (LookupController, NodeController, SecurityController, SettingController,
  CommunicationChannelController, ContractsController, InformationController,
  AccountHierarchyController, ApplicationController, +Testing)
- Charging — 4 controllers
  (WalletController, LookupController, TestingChargingController, TestKafkaController)
- Provisioning — 2 controllers
  (LookupController, ServicesController)

**FastEndpoints (REPR pattern, one class per endpoint):**
- Identity — `…\Falcon.Identity.Api\Endpoints\{Auth,Users,Webhooks,...}\*Endpoint.cs`
- Contact Group — `…\Falcon.ContactGroup.Api\Endpoints\{ContactGroups,Uploads}\*Endpoint.cs`
- Templates — `…\Falcon.Templates.Api\Endpoints\CommunicationChannelConfigs\*Endpoint.cs`
- Core Gateway — uses FastEndpoints for its own (non-proxied) endpoints
  (`FastEndpoints` PackageReference in csproj)
- System Gateway — same

Both styles are present in production. Recorded as conflict (§4.2).

### 4.3 `MultiLanguageName(En, Ar)` — only in the commerce/charging/provisioning trio

Present:
- `…\Falcon.Commerce.Domain\ValueObjects\Node\MultiLanguageName.cs`
- `…\Falcon.Charging.Domain\ValueObjects\MultiLanguageName.cs`
- `…\Falcon.Provisioning.Domain\ValueObjects\MultiLanguageName.cs`

Absent (Grep returned zero matches):
- Identity service
- Templates service
- Contact Group service

In services that have it, the class is **identical**: 2 string properties
`En`, `Ar` with `[BsonElement("en")]` / `[BsonElement("ar")]` decorations
and `: ITranslate` marker.

`UNVERIFIED — wiki needed:` whether Identity/Templates/ContactGroup are
*supposed* to use MultiLanguageName for user-facing names (and currently
violate), or whether they have no user-facing multilingual fields. Sample
identity DTOs like `TenantUserDto` have a single `Name`/`Email`, which
suggests no Ar/En split is needed.

### 4.4 `FalconException` + `FalconError` — every service has its own copy

Per-service `FalconException` and `FalconError` classes:
- `…\Falcon.Commerce.Domain\Exceptions\FalconException.cs` (+ `FalconError.cs`)
- `…\Falcon.Charging.Domain\Exceptions\FalconException.cs` (+ `FalconError.cs`)
- `…\Falcon.Provisioning.Domain\Exceptions\FalconException.cs` (+ `FalconError.cs`)
- `…\Falcon.Templates.Domain\Exceptions\FalconException.cs`
- `…\Falcon.Identity.Api\Domain\Exceptions\FalconException.cs` (+ `FalconError.cs`)
- `…\Falcon.ContactGroup.Api\Domain\Exceptions\FalconException.cs`

Each service additionally has a `FalconExceptionHandler` (`IExceptionHandler`
implementation in `…\Startup\ExceptionHandlers\` or `…\Api\ExceptionHandlers\`)
that converts the exception to a `ServiceOperationResult`-shaped response.

There is **no shared NuGet library** — the contracts are copy-pasted and
their shapes drift (e.g. `FalconError` is a `record`-style PrimaryConstructor
in Identity but a plain class in Commerce/Charging/Provisioning).

### 4.5 Authentication: Zitadel JWT Bearer

Every service (and both gateways) registers:
- `Microsoft.AspNetCore.Authentication.JwtBearer` PackageReference
- A `Zitadel` configuration section in `appsettings.json`:
  `Authority` / `Domain` / `ValidateIssuer` / `ValidateAudience` /
  `ValidateLifetime` / `ValidateIssuerSigningKey` / `ClockSkew=300` /
  `RoleClaimType="urn:zitadel:iam:org:project:roles"`.

Reference auth wiring:
- Commerce: `…\Falcon.Commerce.Infrastructure\Auth\ZitadelExtensions.cs`
  (includes `AddFalconAuthentication`, `ZitadelClaimsTransformation`,
  `ZitadelBackchannelHandler`, `ZitadelClaimTypes`).
- Core Gateway: `…\Falcon.Core.Gateway\Infrastructure\Auth\` (folder exists,
  referenced from `Startup\Extensions\ServiceCollectionExtensions.cs:11`).

`ValidateAudience` defaults differ:
- Commerce `appsettings.json:27`: `false`
- Charging `appsettings.json:27`: `true`
- Core Gateway `appsettings.json:27`: `false`
- System Gateway `appsettings.json:27`: `false`

(Worth flagging — see Conflicts §4.5.)

---

## 5. Data persistence

### 5.1 MongoDB is the dominant store

`MongoDB.Driver` PackageReference present in every layered service's
Infrastructure project AND in single-project services' Api csproj:
- Commerce: `…\Falcon.Commerce.Infrastructure\Falcon.Commerce.Infrastructure.csproj:26`
- Identity: `…\Falcon.Identity.Api\Falcon.Identity.Api.csproj:16`
- ContactGroup: `…\Falcon.ContactGroup.Api\Falcon.ContactGroup.Api.csproj:33`
- (similar in Charging, Provisioning, Templates)

Default databases (per `appsettings.json`):
- Commerce → `FalconCommerceDB`
- Charging → `FalconChargingDB`
- Templates → `FalconTemplateDb` (note: capitalisation drift — `Db` not `DB`)
- Access/PES → `PES`

Connection-string placeholders are blank in production `appsettings.json` and
filled per environment. Default dev creds are docker-compose-managed:
`MONGO_INITDB_ROOT_USERNAME=root`, `MONGO_INITDB_ROOT_PASSWORD=example`.
`C:\Falcon\Falcon\Falcon\docker-compose.yml:20-22`

### 5.2 Redis used for caching

`Microsoft.Extensions.Caching.Hybrid` +
`Microsoft.Extensions.Caching.StackExchangeRedis` present in Commerce,
Identity, ContactGroup, Templates, and Core Gateway. System Gateway omits it.

Per `appsettings.json` `Redis.InstanceName` keys:
- Commerce: `FalconCommerce_`
- Core Gateway: `FalconCoreGateway_`

### 5.3 Access (PES) is a polyglot outlier

`appsettings.json:9-21` of `T2.PES.API` declares:
- `DataStore.Provider = "SqlServer"`
- `ConnectionStrings.Default = "Server=...;Database=PES;..."`
- AND `MongoDb.ConnectionString = ""` for separate Mongo data

So PES talks **both** SQL Server and MongoDB. None of the other services do.

### 5.4 Hangfire on Mongo

Background-job tier in Commerce + ContactGroup uses
`Hangfire` + `Hangfire.Mongo` (not `Hangfire.SqlServer`). The same Mongo
instance backs Hangfire job storage.
- `…\Falcon.Commerce.Infrastructure\Falcon.Commerce.Infrastructure.csproj:16-17`
- `…\Falcon.ContactGroup.Api\Falcon.ContactGroup.Api.csproj:57-59`

### 5.5 Object storage

ContactGroup is the only service with `AWSSDK.S3` —
`…\Falcon.ContactGroup.Api\Falcon.ContactGroup.Api.csproj:50`. Used for
contact-list upload artifacts.

---

## 6. Frontend architecture

### 6.1 Nx monorepo

`falcon-web-platform-ui` is an Nx 22.7.1 workspace.
`…\falcon-web-platform-ui\nx.json:1`,
`…\package.json:107` (`"nx": "^22.7.1"`).

Tagged scopes: `apps/` and `libs/` plus `demos/` (excluded from bundle
calc by `scope:demo` tag per project memory).

**Apps** (`…\falcon-web-platform-ui\apps\`):
- `host-shell` — module-federation host (port 4200 per platform doc)
- `admin-console` — falcon-admin remote (port 4204)
- `management-console` — client mgmt remote (port 4301)

**Libs** (`…\falcon-web-platform-ui\libs\`):
- `falcon` — shared Angular UI/feature kit (legacy umbrella)
- `falcon-theme` — Tailwind theme/tokens
- `falcon-ui-core` — Stencil web-components (cross-framework)
- `falcon-ui-tokens` — design tokens CSS
- `falcon-ui-react` — React wrappers
- `falcon-ui-vue` — Vue wrappers
- `falcon-ui-showcase-data` — demo registry/MD
- `falcon-studio` — Theme Studio app
- `sdk` — TypeScript SDK to backend

### 6.2 Module Federation

`host-shell` consumes admin-console / management-console at runtime.
- `…\apps\host-shell\webpack.config.ts` and `webpack.prod.config.ts`
- `…\apps\host-shell\src\app\core\module-federation\` —
  `api-remote-manifest.provider.ts`, `mf-diagnostic.service.ts`,
  `remote-manifest.types.ts`
- Per package.json memory note `RemoteManifestProvider` abstraction landed in v3.1.

### 6.3 Angular 21 + zoneless

Angular all on **21.2.9** (`package.json:43-51`). Zoneless config
appears in all three apps' `app.config.ts`:
- `…\apps\host-shell\src\app\app.config.ts`
- `…\apps\admin-console\src\app\app.config.ts`
- `…\apps\management-console\src\app\app.config.ts`

(Memory note from project log: "Pending: zoneless smoke-test on every flow.")

### 6.4 Tailwind v4 only, no SCSS / no PrimeNG — partially enforced

- Tailwind v4 in `…\package.json:112` (`"tailwindcss": "^4.2.2"`).
- `from "primeng"` imports return **zero matches** across apps and libs —
  PrimeNG genuinely uninstalled.
- `pi pi-*` PrimeIcons return **zero matches** in active source.
- **`tailwindcss-primeui` still listed in devDependencies** (`package.json:113`)
  — flagged in Conflicts §6.1.
- **`sass` still listed in devDependencies** (`package.json:111`).
- **SCSS files still exist:** 36 files under `apps/` (mostly
  `apps\admin-console\src\app\features\organization-hierarchy\` subtree)
  and 8 files under `libs/`. Flagged in Conflicts §6.2.

### 6.5 Frontend never calls Zitadel directly

Grep across `apps/` and `libs/` for `zitadel|oauth2|oidc` returned 2 files:
- `libs\falcon\src\core\lib\user-session.interface.ts` (TypeScript types)
- `libs\falcon\src\core\lib\services\session-provider.service.ts` (decodes
  JWT for tenant/user metadata; no outbound Zitadel calls)

No `http.get/post` to a Zitadel host appears in any frontend file. The
frontend always goes through Identity (`/api/auth/...`) at the gateway. Rule
upheld.

### 6.6 Folder pattern per feature

`models/models.ts`, `services/services.ts`, `resolvers/resolvers.ts`,
`directives/directives.ts` — used **partially**:

- Present in `apps/admin-console/src/app/features/organization-hierarchy/`
  and its sub-features.
- Other features (e.g. `apps/host-shell/src/app/features/auth/`) do not
  use this pattern.

Recorded as partial-adoption note in Conflicts §6.3.

### 6.7 Build gates

`package.json:23-35` defines 12 governance gates (`gate-01-lint` …
`gate-12-component-token-scope`). `gate:all` chains 7 mandatory gates.
This is an enforcement mechanism specific to the frontend and unique to
this workspace.

---

## 7. Branching / release

### 7.1 Branches in this checkout

| Repo | Branch |
|---|---|
| Falcon (umbrella) | `main` |
| falcon-core-identity-svc | `main` |
| falcon-core-commerce-svc | `main` |
| falcon-core-charging-svc | `main` |
| falcon-core-provisioning-svc | `main` |
| falcon-core-access-svc | `main` |
| falcon-core-contact-group-svc | `main` |
| falcon-core-templates-svc | `main` |
| falcon-int-core-gateway-svc | `main` |
| falcon-int-system-gateway-svc | `main` |
| falcon-portal | `main` |
| **falcon-web-platform-ui** | **`polishing-v0.4`** |

Only `falcon-web-platform-ui` deviates from `main`. This matches the
TouchBase WARN. The branch name `polishing-v0.4` aligns with project memory
notes about Falcon UI polishing waves (Wave 7+, Studio Waves 3-5).

`UNVERIFIED — wiki needed:` whether `polishing-v0.4` is a long-lived
release branch (in which case trunk-based development is being relaxed) or a
short-lived feature branch that has outlived its expected scope.

### 7.2 CI hints

- Umbrella repo carries `Falcon\azure-pipelines-frontend.yml` and
  `Falcon\azure-pipelines-zitadel-stage.yml`. The frontend pipeline is the
  only multi-service pipeline at this level.

---

## 8. Identity / ownership boundaries

### 8.1 Identity service owns user lifecycle

Identity exposes:
- `…\Falcon.Identity.Api\Endpoints\Users\CreateUserEndpoint.cs`
- `…\Falcon.Identity.Api\Endpoints\Users\GetUserByIdEndpoint.cs`
- `…\Falcon.Identity.Api\Endpoints\Users\ListNodeUsersEndpoint.cs`
- `…\Falcon.Identity.Api\Endpoints\Users\ListTenantUsersEndpoint.cs`
- `…\Falcon.Identity.Api\Endpoints\Users\UpdateMyProfileEndpoint.cs`
- `…\Falcon.Identity.Api\Endpoints\Users\UpdateUserProfileByIdEndpoint.cs`
- `…\Falcon.Identity.Api\Endpoints\Users\UpdateUserRoleByIdEndpoint.cs`
- `…\Falcon.Identity.Api\Endpoints\Users\ChangeUserStatusEndpoint.cs`
- `…\Falcon.Identity.Api\Endpoints\Users\ChangePasswordEndpoint.cs`
- `…\Falcon.Identity.Api\Endpoints\Users\ResendEmailVerificationEndpoint.cs`
- `…\Falcon.Identity.Api\Endpoints\Users\ResendPhoneVerificationEndpoint.cs`
- `…\Falcon.Identity.Api\Endpoints\Users\RequestEmailVerificationEndpoint.cs`
- `…\Falcon.Identity.Api\Endpoints\Users\RequestPhoneVerificationEndpoint.cs`
- `…\Falcon.Identity.Api\Endpoints\Users\ConfirmEmailVerificationEndpoint.cs`
- `…\Falcon.Identity.Api\Endpoints\Users\ConfirmPhoneVerificationEndpoint.cs`
- `…\Falcon.Identity.Api\Endpoints\Users\VerifyPasswordEndpoint.cs`
- `…\Falcon.Identity.Api\Endpoints\Users\UserExistEndpoint.cs`
- `…\Falcon.Identity.Api\Endpoints\Users\GetUserCountEndpoint.cs`
- `…\Falcon.Identity.Api\Endpoints\Auth\Login/Logout/RefreshToken/Set/Reset Password/Otp` endpoints
- Webhook receiver from Zitadel: `…\Falcon.Identity.Api\Endpoints\Webhooks\ZitadelWebhookEndpoint.cs`
- Internal Zitadel services in `…\Falcon.Identity.Api\Infrastructure\Identity\Services\`
  (`ZitadelUserService`, `ZitadelAuthService`, `ZitadelSessionService`,
  `ZitadelVerificationService`).

Commerce **consumes** users from Identity via HTTP East-West client
(`…\Falcon.Commerce.Infrastructure\External\Services\IdentityService.cs`).
Commerce does not create or own users — rule upheld.

`UNVERIFIED — wiki needed:` confirm whether tenant lifecycle is owned by
Identity (it has `TenantSettings` entity) or by Commerce (it has `Tenant`
entity). There appears to be overlap. See Conflicts §8.

---

## 9. Tooling / mediator / mapper inconsistencies (non-blocking but notable)

| Concern | Commerce | Charging | Identity | Templates | Contact Group |
|---|---|---|---|---|---|
| Mediator | `MediatR` 14 | `MediatR` (inferred) | `Mediator` (Martin Othamar source-gen) | `Mediator` | `Mediator` |
| Mapper | `AutoMapper` 16 | `AutoMapper` (inferred) | `Riok.Mapperly` source-gen | `Riok.Mapperly` | `Riok.Mapperly` |
| Validation | `FluentValidation` 11 | `FluentValidation` | `FluentValidation` | `FluentValidation` | `FluentValidation` |
| Endpoint style | Controllers | Controllers | FastEndpoints | FastEndpoints | FastEndpoints |

Evidence: cross-checked csproj contents. There is **no platform-wide
mediator or mapper choice** — newer services adopt source-generation
alternatives (Mediator + Mapperly) while older ones stay on reflection-based
MediatR + AutoMapper. Worth recording as conflict §9.

---

## 10. Items marked UNVERIFIED — wiki needed

1. Canonical solution-file format (`.sln` vs `.slnx`).
2. Whether Clean Architecture must be enforced as **separate csproj per
   layer** or whether **folder-per-layer in one csproj** is acceptable.
3. Whether `MongoDB.Driver` is allowed in `Domain` (current pattern) or
   forbidden by the Clean Architecture canon.
4. Whether `gRPC` is required for service-to-service sync (CLAUDE.md hints
   yes; code uses HTTP exclusively).
5. Whether `ValidateAudience=true` should be uniform across services.
6. Whether Identity, Templates, and ContactGroup are expected to use
   `MultiLanguageName` (currently they don't).
7. Whether `MediatR + AutoMapper` are deprecated in favour of
   `Mediator + Mapperly` for new services.
8. Whether `polishing-v0.4` is an exception to trunk-based development.
9. Whether `Tenant` ownership lives in Commerce or Identity.
10. Whether `ServiceOperationResult<T>` should be a shared package (it isn't).
11. Whether `T2.PES.*` rename to `Falcon.Access.*` is planned, and whether
    `net6.0 → net10.0` upgrade for that service is on roadmap.
12. Whether System Gateway is meant to also carry Kafka / rate-limiter / IP
    allowlist (Core does; System does not).
