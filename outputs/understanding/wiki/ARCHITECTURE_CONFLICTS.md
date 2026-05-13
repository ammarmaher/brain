*** ARCHITECTURE_CONFLICTS — drift between standard and reality ***

> Each entry cites the source file(s) supporting the conflict. Conflicts are
> grouped by section to match `ARCHITECTURE_RULES.md`. **Secrets are listed
> with file path + `<REDACTED>` only — values are never copied.**

## Severity legend

- **HIGH** — security risk, breaks deploy, or causes drift that compounds.
- **MED** — meaningful inconsistency that costs developer time but isn't urgent.
- **LOW** — cosmetic, naming, or pure-doc drift.

---

## §1 Solution / project structure

### 1.1 [LOW] Mixed `.sln` vs `.slnx` across services

- `.sln`: Identity, Contact Group, Access (PES) — earlier-generation.
- `.slnx`: Charging, Commerce, Provisioning, Templates, Core Gateway, System
  Gateway — newer XML format.

There is no enforced platform standard. Recommended action: pick one
(`.slnx` is preferred per dotnet 10 tooling), migrate the laggards in one
sweep, and add an enforcement rule to the Wiki + a repo template.

Evidence: `Get-ChildItem -Recurse "*.sln*"` (see Rules §1.1 for full list).

### 1.2 [MED] Commerce has BOTH a root `.slnx` AND a nested `src/src.sln`

- `C:\Falcon\Falcon\falcon-core-commerce-svc\Falcon.Commerce.slnx`
- `C:\Falcon\Falcon\falcon-core-commerce-svc\src\src.sln`

Two solution files = two source-of-truth candidates. They will drift
silently as projects are added. Recommended action: delete `src/src.sln`.

### 1.3 [MED] Identity / Contact Group flatten the entire service into one `.Api` csproj

CLAUDE.md states: "Clean Architecture — Domain → Application → Infrastructure
→ Api (dependencies inward)". Commerce / Charging / Provisioning / Templates
implement this as **5 separate csproj** with `<ProjectReference>` edges
enforcing the direction. Identity and Contact Group use **folder-per-layer
inside `*.Api.csproj`** — the compiler cannot reject a reverse dependency.

- `C:\Falcon\Falcon\falcon-core-identity-svc\src\Falcon.Identity.Api\` contains
  `Application/`, `Domain/`, `Infrastructure/`, `Endpoints/`, `Startup/` folders.
- `C:\Falcon\Falcon\falcon-core-contact-group-svc\src\Falcon.ContactGroup.Api\`
  identical shape.

This is either:
- (a) a deliberate "small-service exception" not documented; or
- (b) drift that should be corrected by splitting into the canonical 5-project
  shape.

`UNVERIFIED — wiki needed.`

### 1.4 [MED] Three services have no root `Directory.Build.props`

Commerce, Charging, Provisioning do not centralise common props. The
analyzers (`Meziantou.Analyzer`, `SonarAnalyzer.CSharp`),
`TreatWarningsAsErrors=true`, and `NuGetAudit=true` are missing for those
three services.

Evidence: `Directory.Build.props` exists only at the root of Identity,
Contact Group, Templates, Core Gateway, System Gateway. The other three
services have no equivalent.

### 1.5 [MED] Access (PES) uses pre-rename naming `T2.PES.*`

`C:\Falcon\Falcon\falcon-core-access-svc\src\T2.PES\T2.PES.csproj`
`C:\Falcon\Falcon\falcon-core-access-svc\src\T2.PES.API\T2.PES.API.csproj`
`C:\Falcon\Falcon\falcon-core-access-svc\src\T2.PES.Test\T2.PES.Test.csproj`

All other services use the `Falcon.<Service>.*` convention. Recommended
action: rename to `Falcon.Access.*` (or whatever the canonical product name
is) once stability allows.

---

## §2 Cross-service communication

### 2.1 [MED] CLAUDE.md says "gRPC/Kafka directly" — gRPC is unused

CLAUDE.md: *"Internal services NEVER call each other through gateways —
use gRPC/Kafka directly"*.

Reality:
- No `.proto` files in the entire `C:\Falcon\Falcon` tree.
- No `Grpc.AspNetCore` or `Grpc.Tools` package references.
- Synchronous east-west calls go over **HTTP** via
  `HttpClientFactory` (e.g.
  `C:\Falcon\Falcon\falcon-core-commerce-svc\src\Falcon.Commerce.Infrastructure\External\Services\IdentityService.cs`).

Either the doc is stale (current intent is "HTTP for sync, Kafka for async")
or every east-west HTTP client is a latent violation. `UNVERIFIED — wiki
needed.`

### 2.2 [LOW] System Gateway carries no Kafka

Core Gateway consumes `commerce.tenant-ip-allowlist-changed.v1` to feed
its IP allowlist middleware. System Gateway does neither. They are both
"gateways" yet have very different responsibilities. Worth documenting
the asymmetry explicitly.

Evidence:
- `…\falcon-int-core-gateway-svc\src\Falcon.Core.Gateway\Messaging\Consumers\TenantIpAllowlistChangedConsumer.cs`
- No equivalent under `…\falcon-int-system-gateway-svc\src\`.

---

## §3 Clean Architecture violations

### 3.1 [MED] Domain entities are decorated with MongoDB attributes

Domain layer in every layered service references `MongoDB.Bson` (for
`[BsonElement]`, `[BsonIgnoreExtraElements]`, `[BsonRepresentation]`, etc.).
This couples Domain to a specific persistence technology — a textbook
Clean Architecture violation.

Evidence:
- `C:\Falcon\Falcon\falcon-core-commerce-svc\src\Falcon.Commerce.Domain\Falcon.Commerce.Domain.csproj:16` — `<PackageReference Include="MongoDB.Bson" Version="3.6.0" />`
- `C:\Falcon\Falcon\falcon-core-commerce-svc\src\Falcon.Commerce.Domain\ValueObjects\Node\MultiLanguageName.cs:2` (uses `[BsonElement]`).
- Similar pattern in Charging, Provisioning, Identity (Domain folder), Contact Group.

If the Wiki rule is "Domain has no infrastructure dependencies", every layered
service violates it. Recommended action: move Mongo bindings to Infrastructure
via a mapper (Mapperly already used in Identity makes this cheap).

### 3.2 [LOW] Commerce.Contracts depends on Commerce.Domain

`Falcon.Commerce.Contracts.csproj:9` has `<ProjectReference Include="..\Falcon.Commerce.Domain\Falcon.Commerce.Domain.csproj" />`.

Contracts is meant to be DTOs only and consumed by external clients/SDKs;
adding a Domain dependency pulls Mongo (transitively) into anything that
references Contracts. Charging/Provisioning/Templates/Contracts have no
Domain reference — Commerce is the outlier here.

### 3.3 [MED] Application/Service-layer rule unverified at static level

CLAUDE.md: *"Application Service CANNOT call another Application Service —
use Domain Services, events, or coordinators."*

There is no static analyzer (e.g. ArchUnitNET, NetArchTest) configured to
enforce this. Manual code search did not exhaustively confirm or deny it.
`UNVERIFIED — wiki needed:` add an architecture test.

---

## §4 API surface conventions

### 4.1 [HIGH] `ServiceOperationResult<T>` has five distinct shapes

The "platform-wide wrapper" is not platform-wide. Each service ships its own
copy and they diverge:

| Service | Type | Fields | Notes |
|---|---|---|---|
| Commerce | `record` | `IsSuccessful, Result, ErrorCodes, ErrorMessages` | Has `ErrorCodes` no other service has |
| Identity | `record` | `IsSuccessful, Result, ErrorMessages` | |
| Templates | `record` | `IsSuccessful, Result, ErrorMessages` | |
| Contact Group | `record` | `IsSuccessful, Result, ErrorMessages` | |
| Charging | `struct` | `IsSuccessful, ErrorMessages, Result` | `struct` not `record` |
| Provisioning | `struct` | `IsSuccessful, ErrorMessages, Result` | `struct` not `record` |

Evidence: see Rules §4.1 for full file paths and the inline definitions
quoted above.

This is a real consumer problem. Commerce's `IdentityService` client has to
declare a private `IdentityServiceResponse<T>` because Identity's wrapper
doesn't match Commerce's:
`C:\Falcon\Falcon\falcon-core-commerce-svc\src\Falcon.Commerce.Infrastructure\External\Services\IdentityService.cs:97-103`.

Recommended action: extract a single `Falcon.Common.Contracts` NuGet package
(or shared csproj) with the canonical shape; have every service replace its
copy with a `using`.

### 4.2 [MED] Endpoint style split: Controllers vs FastEndpoints

- Controllers: Commerce (9 controllers), Charging (4), Provisioning (2).
- FastEndpoints: Identity, Contact Group, Templates, plus Core/System gateways.

Both styles co-exist in production. There is no documented "FastEndpoints
for new services, Controllers for old" rule — it appears to track the
age/team that built the service. Reading and authoring patterns differ
between the two. Recommended action: pick one and migrate the other (or
explicitly document the dual-pattern policy).

Evidence: `Grep "Controller|MapGroup|FastEndpoints" --files-with-matches`
across each `*.Api` folder (see Rules §4.2).

### 4.3 [LOW] `MultiLanguageName` missing from three services

Per CLAUDE.md: "Multi-language: `MultiLanguageName(En, Ar)` for all
user-facing text".

Reality:
- Present in Commerce, Charging, Provisioning Domain.
- Missing entirely from Identity, Templates, Contact Group.

The missing services may genuinely have no user-facing bilingual fields
(Identity exposes username/email which are single-language by nature). If
*any* user-facing field in those services is single-language, that's a
rule violation. `UNVERIFIED — wiki needed.`

### 4.4 [LOW] `FalconException` / `FalconError` are copy-pasted per service

Each service has its own `FalconException` and `FalconError` class with
slight shape variation. Example:
- Identity's `FalconError` is a primary-constructor record-style
  `public sealed class FalconError(string code, string? description = null)`.
- Commerce's `FalconError` is a plain class with traditional fields.

Recommended action: same as §4.1 — extract a common contracts package.

### 4.5 [MED] `ValidateAudience` inconsistent across services

- Commerce `appsettings.json:27`: `"ValidateAudience": false`.
- Charging `appsettings.json:27`: `"ValidateAudience": true`.
- Both gateways: `false`.

For a defense-in-depth JWT model, `ValidateAudience=true` should be
uniform. Risk: an audience-scoped token issued for service A could be
replayed against service B if B doesn't validate audience. **Worth a
security review.**

---

## §5 Persistence

### 5.1 [HIGH] Hardcoded SQL Server credentials in committed config files

The Access (PES) service has connection strings with real-looking
credentials in committed config files:

- `C:\Falcon\Falcon\falcon-core-access-svc\src\T2.PES.API\config\appsettings.qc.json:13`
  → `Server=<public-IP>;Database=PES;User Id=sa;Password=<REDACTED>;`
- `C:\Falcon\Falcon\falcon-core-access-svc\src\T2.PES.API\config\appsettings.qcfromlocal.json:13`
  → `Server=127.0.0.1, 2143;Database=PES;User Id=sa;Password=<REDACTED>;`

The presence of a hardcoded `sa` password against a server at a fixed
public IPv4 address is a **HIGH-severity** issue. Recommended action:
- Immediately remove the credential from git history (use BFG or
  git-filter-repo) and rotate the SQL `sa` password.
- Move the connection string to user-secrets / environment variables /
  Azure KeyVault.

### 5.2 [HIGH] Dev MongoDB credentials in non-Development appsettings

The repo's local-dev docker-compose seeds Mongo with
`MONGO_INITDB_ROOT_USERNAME=root` / `MONGO_INITDB_ROOT_PASSWORD=example`.
That credential pair appears in **`appsettings.json`** (not
`appsettings.Development.json`) for at least two services, meaning the
"production" config tier carries dev creds:

- `C:\Falcon\Falcon\falcon-core-access-svc\src\T2.PES.API\config\appsettings.json:16`
  → `mongodb://root:<REDACTED>@localhost:27017`
- `C:\Falcon\Falcon\falcon-core-templates-svc\src\Falcon.Templates.Api\appsettings.json:41`
  → `mongodb://root:<REDACTED>@localhost:27017/admin?authSource=admin&directConnection=true`

If these files are loaded in any non-dev environment they will fail to
connect (good), but they are noise in the canonical config tier and
indicate the configuration-hygiene rule is not being followed
consistently. Other services correctly keep production `appsettings.json`
empty (`""`) and populate via env vars or `appsettings.Development.json`.

### 5.3 [LOW] Hardcoded localhost creds in `appsettings.Development.json` (informational, not a leak)

Across the active services, every `appsettings.Development.json` contains
`mongodb://root:example@localhost:27017` (or a variant). This is the
docker-compose default credential, intended for local dev only. It is
not strictly a leak (it's a documented well-known dev credential), but
because it is committed, any developer cloning the repo onto a host that
has Mongo on `:27017` will silently connect. Worth standardising on
**`appsettings.Local.json` (gitignored) + a `appsettings.Development.example.json`** pattern.

Evidence files (informational): `falcon-core-commerce-svc`,
`falcon-core-provisioning-svc`, `falcon-core-contact-group-svc`,
`falcon-core-access-svc` — all `.Development.json` variants.

### 5.4 [LOW] Database-name capitalisation drift

- `FalconCommerceDB` (Commerce)
- `FalconChargingDB` (Charging)
- `FalconTemplateDb` (Templates — note `Db` not `DB`, singular not plural)
- `PES` (Access)

Names should follow a single convention. Doesn't break anything, but
catches the eye on dashboards.

---

## §6 Frontend

### 6.1 [LOW] `tailwindcss-primeui` still in devDependencies

Per memory note "ZERO PrimeNG. ZERO PrimeIcons" — but
`falcon-web-platform-ui/package.json:113` still has
`"tailwindcss-primeui": "^0.6.1"` in devDependencies. No source files
import it (Grep confirmed), so the dependency is dead weight. Recommended
action: `npm uninstall tailwindcss-primeui`.

### 6.2 [MED] SCSS still present despite "Tailwind utilities only — no SCSS" rule

`brain-skills/Front-End-skills/angular-tailwind-skill` and Noor Instructions:
*"Tailwind utilities only — no SCSS, no component CSS, no PrimeNG."*

Reality: 44 `*.scss` files still in the active workspace.

- 36 under `apps/` — heavily concentrated in
  `apps\admin-console\src\app\features\organization-hierarchy\` subtree.
- 8 under `libs/` (e.g.
  `libs\falcon\src\shared-ui\lib\components\send-credentials-popup\send-credentials-popup.component.scss`,
  `libs\falcon-ui-tokens\src\components\data-table.tokens.css` — that one is
  not scss but lives in same neighbourhood,
  `libs\falcon-ui-core\src\components\falcon-uploader\falcon-uploader.tsx` —
  Stencil component, may legitimately need scoped CSS).

The `sass` devDependency is also still in `package.json:111`. Recommended
action: migrate the org-hierarchy SCSS files to Tailwind utilities
(matches the memory note "🟠 ACTIVE project_org_hierarchy_html_conversion"
which is exactly that migration in flight).

### 6.3 [LOW] Per-feature folder pattern is partial

The CLAUDE.md feedback note `feedback_folder_structure_pattern` requires:
`models/models.ts`, `services/services.ts`, `resolvers/resolvers.ts`,
`directives/directives.ts` per feature.

Reality:
- `admin-console/.../organization-hierarchy/` does follow the pattern.
- `host-shell/.../auth/` does not.
- Several other features mix styles.

Recommended action: codify a frontend lint rule, or accept partial-adoption
as deliberate.

### 6.4 [LOW] `falcon-web-platform-ui` is on `polishing-v0.4` not `main`

Trunk-based-development rule from CLAUDE.md: "short-lived branches". The
checkout shows `polishing-v0.4`. No recorded reason in this fallback. This
is also flagged by TouchBase. `UNVERIFIED — wiki needed.`

---

## §7 Tooling consistency

### 7.1 [LOW] Two mediator libraries, two mapper libraries

| Library | Used by |
|---|---|
| `MediatR` (Jimmy Bogard reflection-based) | Commerce, Charging |
| `Mediator` (Martin Othamar source-gen) | Identity, Templates, Contact Group |
| `AutoMapper` (reflection) | Commerce, Charging |
| `Riok.Mapperly` (source-gen) | Identity, Templates, Contact Group |

Newer services chose the source-generated alternatives for perf and AOT
readiness. There is no platform-wide standard.

Recommended action: pick one and migrate (or document the dual-track policy
with a "new code uses Mediator + Mapperly" rule and a retirement plan for
the reflection-based variants).

### 7.2 [LOW] Inconsistent code-style and analyzer enforcement

`TreatWarningsAsErrors=true` + Sonar + Meziantou analyzers are enforced
only on services that have a root `Directory.Build.props` (Identity,
ContactGroup, Templates, Core Gateway, System Gateway). Commerce, Charging,
Provisioning lack this, so the same coding violation in two different
services may fail one build and pass the other.

Cross-ref: §1.4.

---

## §8 Ownership boundaries

### 8.1 [MED] Tenant ownership ambiguous

- Commerce has `…\Falcon.Commerce.Domain\Entities\Tenant.cs` (a `Tenant`
  entity with `[BsonElement]` decorations).
- Identity has `…\Falcon.Identity.Api\Domain\Entities\TenantSettings.cs`
  (`TenantSettings` entity).

CLAUDE.md says "Identity service owns user lifecycle — NOT Commerce, NOT
Zitadel directly", but it is silent on **tenant lifecycle**. If Commerce
owns the tenant entity and Identity owns tenant-scoped settings, the
boundary is unclear and may cause data-consistency issues
(create-tenant-in-Commerce, then settings-by-tenantId-in-Identity, with
an async Kafka sync in between?). `UNVERIFIED — wiki needed.`

---

## §9 Repo hygiene

### 9.1 [LOW] `falcon-portal` is a stub

`C:\Falcon\Falcon\falcon-portal\` contains only `README.md`. Either delete
the repo from the umbrella checkout list, mark it explicitly as placeholder,
or seed it with the planned structure.

### 9.2 [LOW] Deprecated repos visible in source tree

`C:\Falcon\Falcon\deprecated-falcon-core-identity-svc\` and
`C:\Falcon\Falcon\deprecated-falcon-web-platform-ui\` still exist. They
caused noise in our Grep results (e.g. `ServiceOperationResult` matched in
deprecated Identity copies). Recommended action: archive these out of the
working tree once their replacement is feature-complete (memory note
`feedback_discard_old_ui` already calls for excluding them — could be made
absolute by removing from disk).

---

## Summary of HIGH-severity items

1. **§5.1 SQL credentials hardcoded** in
   `falcon-core-access-svc\src\T2.PES.API\config\appsettings.qc.json:13`
   and `appsettings.qcfromlocal.json:13`. Public IP + `sa` + cleartext password.
   **Rotate the credential and purge from git history.**
2. **§5.2 Mongo default creds** in two non-Development `appsettings.json`
   (`falcon-core-templates-svc`, `falcon-core-access-svc`). Same well-known
   `root:example` pair as docker-compose, but in the wrong config tier.
3. **§4.1 `ServiceOperationResult<T>` is fractured into five shapes**.
   Cross-service client code already has a private wrapper class to absorb
   the diff (`IdentityService.cs:97-103`). Consolidate into a shared
   contracts package.
