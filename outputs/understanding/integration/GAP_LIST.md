*** GAP_LIST — cross-cutting gaps from Phase 1 + Phase 2 (2026-05-13) ***

> Severity is HIGH for security risk / guaranteed runtime defect / cross-service architectural blocker;
> MED for meaningful drift that costs developer time; LOW for cosmetic or pure-doc drift.
> Every HIGH cites a file path verified during this pass.

## HIGH

### GAP-001 [HIGH] Hardcoded SQL `sa` credentials in PES `appsettings.qc.json`
- **Description:** committed config contains `Server=<public-IPv4>;Database=PES;User Id=sa;Password=P@ssw0rd;` against a publicly routable address.
- **Evidence:** `C:\Falcon\Falcon\falcon-core-access-svc\src\T2.PES.API\config\appsettings.qc.json:13` (verified — `Server=54.225.159.51;...`).
- **Owner candidate:** Identity / Access service owner.
- **Recommended action:** rotate the SQL `sa` password immediately; remove the line from working tree; purge from git history with BFG or `git filter-repo`; move the connection string to user-secrets / KeyVault / env var.

### GAP-002 [HIGH] Hardcoded SQL `sa` credentials in PES `appsettings.qcfromlocal.json`
- **Description:** same shape as GAP-001 but against `127.0.0.1, 2143`. Same `sa` cleartext password.
- **Evidence:** `C:\Falcon\Falcon\falcon-core-access-svc\src\T2.PES.API\config\appsettings.qcfromlocal.json:13` (verified).
- **Owner candidate:** Identity / Access service owner.
- **Recommended action:** same as GAP-001 (rotate the SAME `sa` password since the value is identical).

### GAP-003 [HIGH] Anthropic API key on local disk in Brain SK staging vault
- **Description:** GitHub push protection blocked the first bootstrap push because an Anthropic API key was committed locally at `Obsidian Vault/Brain SK/.obsidian/plugins/copilot/data.json:109`. Local HEAD was rewound; the file is **still on disk** at `C:\Falcon\Brain SK\Obsidian Vault\Brain SK\.obsidian\plugins\copilot\data.json`.
- **Evidence:** `C:\Falcon\Brain Outputs\reports\bootstrap-touchbase\2026-05-13-bootstrap-completion.md` §"Incident".
- **Owner candidate:** Ammar (user).
- **Recommended action:** rotate the Anthropic key in the Anthropic console; delete the local file or move it outside any folder Obsidian or Brain SK indexes; confirm `.gitignore` excludes the file (already added during bootstrap).

### GAP-004 [HIGH] `ServiceOperationResult<T>` has 5 distinct shapes — cross-service client already has a bridge
- **Description:** the "platform-wide" wrapper ships in 5 different shapes (`record` in Commerce/Identity/Templates/ContactGroup with field-count drift; `struct` in Charging/Provisioning). Commerce's `IdentityService` east-west HTTP client has a private `IdentityServiceResponse<T>` because Identity's wrapper does not match Commerce's. Any new east-west client must add the same bridge.
- **Evidence:** `wiki/ARCHITECTURE_CONFLICTS.md` §4.1; `C:\Falcon\Falcon\falcon-core-commerce-svc\src\Falcon.Commerce.Infrastructure\External\Services\IdentityService.cs:97-103`.
- **Owner candidate:** Architect (Adnan).
- **Recommended action:** extract a single `Falcon.Common.Contracts` package (or shared `Falcon.Shared` csproj) carrying the canonical wrapper + `FalconException` + `FalconError`. Have every service replace its private copy with a `using`. Estimated MED size: one shared csproj + 9 service edits, each a search-and-replace of the local type.

### GAP-005 [HIGH] `adminConsoleGuard` is commented out in the admin-console remote
- **Description:** `apps/admin-console/src/app/app.routes.ts:7` has `// canActivate: [adminConsoleGuard], // Protect all routes under admin-console`. The guard is imported on line 2 but not applied. The admin-console feature routes are reachable without role gating beyond what the host-shell guards enforce.
- **Evidence:** `C:\Falcon\Falcon\falcon-web-platform-ui\apps\admin-console\src\app\app.routes.ts:7` (verified).
- **Owner candidate:** Frontend (Web-Platform-UI).
- **Recommended action:** confirm whether intentional during `polishing-v0.4` work (very likely temporary). If unintentional, uncomment + run zoneless smoke-test. If intentional, add a `TODO(restore-by:<date>)` comment + a wiki note.

### GAP-006 [HIGH] PES uses GET-with-body (HTTP anti-pattern)
- **Description:** two PES endpoints (`policyrulesBySub`, `policyrulesByFilter`) declare `Microsoft.AspNetCore.Mvc.FromBody` attributes on `Get` actions. Many HTTP clients (browsers, proxies, CDNs) strip the body from GET requests — these endpoints may be silently broken in some deployment topologies.
- **Evidence:** `falcon-core-access-svc/src/T2.PES.API/Program.cs:175,179` (per `understanding/backend/BACKEND_SERVICE_MAP.md` line 87 deviation row).
- **Owner candidate:** Identity / Access service owner.
- **Recommended action:** convert to `POST` or move filter into query string; gate with `[ObsoleteEndpoint]` until clients migrate.

## MED

### GAP-007 [MED] Commerce `NodeController` has two method-overloaded `ChangeCommunicationChannelPriceType` methods
- **Description:** lines 194 and 212 of `NodeController.cs` declare two methods both named `ChangeCommunicationChannelPriceType`, mapped to different routes (`PUT /comm-channel/price-type` and `PUT /application/price-type`). Different request type per overload. Reflection-based OpenAPI may collapse them in Swagger UI, causing the wrong one to be tested.
- **Evidence:** `C:\Falcon\Falcon\falcon-core-commerce-svc\src\Falcon.Commerce.Api\Controllers\NodeController.cs:194,212` (verified — both methods named identically); `understanding/backend/BACKEND_SERVICE_MAP.md` line 86.
- **Owner candidate:** Backend (Commerce).
- **Recommended action:** rename the second one to `ChangeApplicationPriceType` (matches the route + request + response naming). Verify Swagger renders both.
- **Note:** the Phase-1 NodeController OVERVIEW.md claimed `_changeApplicationPriceTypeHandler` was never assigned in the constructor. **This is wrong** — verified at `NodeController.cs:87` (`_changeApplicationPriceTypeHandler = changeApplicationPriceTypeHandler;`). The real defect is the method-name collision above, not an NRE. Downgrading the HIGH-NRE finding to this MED method-overload finding.

### GAP-008 [MED] Templates service not exposed through either gateway
- **Description:** Templates (port 7264) is the only active service whose internal-path is **not** routed by Core Gateway or System Gateway. The frontend cannot reach Templates via the gateway. Either Templates is east-west-only by design (consumer of Kafka events for checker-assignment) or the gateway route maps are stale and need a `templates-cluster`.
- **Evidence:** `understanding/backend/GATEWAY_ROUTE_MAP.md` (no templates cluster row); `understanding/backend/templates/FRONTEND_CONTRACT.md` lines 6-9.
- **Owner candidate:** Architect (Adnan) + Backend (Templates).
- **Recommended action:** decide whether the frontend needs Templates. If yes, add a `templates-cluster` and route to both gateways. If no, document it explicitly as east-west-only in the wiki.

### GAP-009 [MED] `ValidateAudience` JWT setting drifts between services
- **Description:** Commerce `appsettings.json:27` = `false`; Charging `appsettings.json:27` = `true`; both gateways = `false`. A token issued for service A could be replayed against service B if B does not validate audience.
- **Evidence:** `wiki/ARCHITECTURE_CONFLICTS.md` §4.5; `wiki/ARCHITECTURE_RULES.md` §4.5.
- **Owner candidate:** Architect + Identity.
- **Recommended action:** decide on uniform value (recommend `true` everywhere with audience claim set per service). Single sweep across the 9 `appsettings.json` files + gateway pair.

### GAP-010 [MED] Mongo dev credentials in non-Development `appsettings.json` (Templates + Access)
- **Description:** `appsettings.json` (the canonical "non-dev" tier) contains `mongodb://root:example@localhost:27017` for two services. These are the docker-compose dev defaults but they live in the wrong config tier. Other services correctly keep this empty and populate via `appsettings.Development.json`.
- **Evidence:** `C:\Falcon\Falcon\falcon-core-templates-svc\src\Falcon.Templates.Api\appsettings.json:41` (verified); `C:\Falcon\Falcon\falcon-core-access-svc\src\T2.PES.API\config\appsettings.json:16` (verified).
- **Owner candidate:** Backend (Templates + Access).
- **Recommended action:** move the connection string to `appsettings.Development.json` only; set `appsettings.json` value to `""`.

### GAP-011 [MED] Two endpoint styles co-exist with no policy
- **Description:** Controllers (Commerce, Charging, Provisioning) vs FastEndpoints (Identity, Contact Group, Templates, both Gateways) — no documented "new services use X, old services use Y" rule. New developer joining the team must learn both patterns.
- **Evidence:** `wiki/ARCHITECTURE_CONFLICTS.md` §4.2; `wiki/ARCHITECTURE_RULES.md` §4.2.
- **Owner candidate:** Architect.
- **Recommended action:** pick one (recommended: FastEndpoints — already on every service that adopted source-gen mediator + mapper) and write a wiki rule with a retirement timeline for Controllers.

### GAP-012 [MED] Two mediator + two mapper libraries
- **Description:** `MediatR` + `AutoMapper` on Commerce/Charging vs `Mediator` (Martin Othamar) + `Mapperly` on Identity/Templates/ContactGroup. Reflection vs source-gen split. Same code shape lives in two places, gets analyzed by two analyzers, generates two binary outputs.
- **Evidence:** `wiki/ARCHITECTURE_CONFLICTS.md` §7.1; `wiki/ARCHITECTURE_RULES.md` §9.
- **Owner candidate:** Architect.
- **Recommended action:** pick one stack (recommended: `Mediator` + `Mapperly` for source-gen perf + AOT readiness). Migration is non-trivial — defer until after `ServiceOperationResult` consolidation (GAP-004).

### GAP-013 [MED] No service-to-service gRPC despite CLAUDE.md hint
- **Description:** Falcon CLAUDE.md says "internal services NEVER call each other through gateways — use gRPC/Kafka directly". Reality: zero `.proto` files; east-west sync calls are plain `HttpClientFactory` HTTP (`Commerce.Infrastructure.External.Services.IdentityService`).
- **Evidence:** `wiki/ARCHITECTURE_CONFLICTS.md` §2.1; `wiki/ARCHITECTURE_RULES.md` §2.3.
- **Owner candidate:** Architect.
- **Recommended action:** either drop the gRPC rule from CLAUDE.md (HTTP is current intent) or roadmap a gRPC migration starting with Commerce↔Identity (the highest-frequency east-west pair).

### GAP-014 [MED] Domain layer references `MongoDB.Bson` (Clean Architecture violation)
- **Description:** every layered service's Domain csproj references `MongoDB.Bson` for `[BsonElement]` decorations. Textbook Clean Architecture violation — Domain has no infrastructure dependencies.
- **Evidence:** `wiki/ARCHITECTURE_CONFLICTS.md` §3.1; `C:\Falcon\Falcon\falcon-core-commerce-svc\src\Falcon.Commerce.Domain\Falcon.Commerce.Domain.csproj:16` and equivalents.
- **Owner candidate:** Architect (rule decision) + Backend (each service).
- **Recommended action:** decide whether the rule is enforced. If yes, move Mongo bindings to Infrastructure via Mapperly mappers (already in 3 services). If no, document the deviation explicitly.

### GAP-015 [MED] `Commerce.Contracts` depends on `Commerce.Domain`
- **Description:** `Falcon.Commerce.Contracts.csproj:9` references `Falcon.Commerce.Domain`. Contracts is meant to be DTOs only — adding a Domain dependency pulls Mongo transitively into any consumer.
- **Evidence:** `wiki/ARCHITECTURE_CONFLICTS.md` §3.2; `wiki/ARCHITECTURE_RULES.md` §1.3.
- **Owner candidate:** Backend (Commerce).
- **Recommended action:** copy/relocate the few Domain types Contracts depends on; remove the project reference.

### GAP-016 [MED] System Gateway has no Kafka, no rate limiter, no IP allowlist
- **Description:** Core Gateway carries IP allowlist + per-tenant rate limiter + Kafka consumer. System Gateway carries none of those. The asymmetry is undocumented.
- **Evidence:** `understanding/backend/GATEWAY_ROUTE_MAP.md` (System Gateway section); `wiki/ARCHITECTURE_CONFLICTS.md` §2.2 + §3.4.
- **Owner candidate:** Architect.
- **Recommended action:** decide whether Falcon admins should also be rate-limited (yes — recommend a system-wide rate limit) and whether the System Gateway should reuse the IP allowlist (no — admins are platform-wide). Document the answer.

### GAP-017 [MED] `T2.PES.*` runs on .NET 6, all other services on .NET 10
- **Description:** four major versions behind. `T2.PES.API.csproj:3` targets `net6.0`.
- **Evidence:** `wiki/ARCHITECTURE_RULES.md` §1.5; `wiki/ARCHITECTURE_CONFLICTS.md` §1.5.
- **Owner candidate:** Identity / Access service owner.
- **Recommended action:** upgrade to `net10.0`; rename projects to `Falcon.Access.*` while at it (single PR if migration is clean).

### GAP-018 [MED] Three services have no root `Directory.Build.props`
- **Description:** Commerce, Charging, Provisioning lack the centralised `TreatWarningsAsErrors=true`, `Meziantou.Analyzer`, `SonarAnalyzer.CSharp` that Identity / ContactGroup / Templates / both Gateways carry. Same violation may fail one service's build and pass another's.
- **Evidence:** `wiki/ARCHITECTURE_RULES.md` §1.6; `wiki/ARCHITECTURE_CONFLICTS.md` §1.4.
- **Owner candidate:** Architect.
- **Recommended action:** add a root `Directory.Build.props` to the three laggards. Single commit per service.

### GAP-019 [MED] SCSS files still present despite "Tailwind utilities only" rule
- **Description:** 44 `*.scss` files remain in the active workspace (36 in `apps/`, 8 in `libs/`), concentrated in the `organization-hierarchy` subtree. `sass` is still in devDependencies. Memory project `project_org_hierarchy_html_conversion` is the migration in flight.
- **Evidence:** `wiki/ARCHITECTURE_CONFLICTS.md` §6.2; `frontend/ANGULAR_AND_TAILWIND_RULES.md` §1.
- **Owner candidate:** Frontend (Web-Platform-UI).
- **Recommended action:** finish the org-hierarchy SCSS-to-Tailwind migration; uninstall `sass` from devDependencies when zero `.scss` remain.

### GAP-020 [MED] Tenant ownership boundary is ambiguous
- **Description:** Commerce has `Tenant.cs` (entity with `[BsonElement]`); Identity has `TenantSettings.cs` (entity). CLAUDE.md says "Identity owns user lifecycle — NOT Commerce" but is silent on tenant lifecycle. Create-tenant-in-Commerce + settings-by-tenantId-in-Identity may cause consistency issues.
- **Evidence:** `wiki/ARCHITECTURE_CONFLICTS.md` §8.1; `wiki/ARCHITECTURE_RULES.md` §8.1.
- **Owner candidate:** Architect.
- **Recommended action:** wiki entry — decide whether Identity or Commerce owns the tenant aggregate, and which Kafka topic synchronises the other.

## LOW

### GAP-021 [LOW] Mixed `.sln` vs `.slnx` solution-file formats
- **Description:** `.sln` on Identity/ContactGroup/Access; `.slnx` on Charging/Commerce/Provisioning/Templates/both Gateways. Commerce also carries a legacy `src/src.sln` alongside its root `.slnx`.
- **Evidence:** `wiki/ARCHITECTURE_RULES.md` §1.1; `wiki/ARCHITECTURE_CONFLICTS.md` §1.1-1.2.
- **Owner candidate:** Architect.
- **Recommended action:** pick `.slnx` everywhere; delete `src/src.sln`.

### GAP-022 [LOW] `tailwindcss-primeui` still in devDependencies
- **Description:** PrimeNG fully uninstalled (Wave PR-8) but `package.json:113` still lists `tailwindcss-primeui`. Zero source imports — pure dead weight.
- **Evidence:** `wiki/ARCHITECTURE_CONFLICTS.md` §6.1.
- **Owner candidate:** Frontend.
- **Recommended action:** `npm uninstall tailwindcss-primeui`.

### GAP-023 [LOW] `falcon-portal` is a stub repo
- **Description:** `C:\Falcon\Falcon\falcon-portal\` contains only `README.md`.
- **Evidence:** `wiki/ARCHITECTURE_CONFLICTS.md` §9.1.
- **Owner candidate:** Architect.
- **Recommended action:** decide whether to seed it or drop it from the umbrella checkout list.

### GAP-024 [LOW] Deprecated repos still on disk
- **Description:** `deprecated-falcon-core-identity-svc/` and `deprecated-falcon-web-platform-ui/` still exist in the working tree and cause noise in cross-tree Grep (false-positive `ServiceOperationResult` hits, etc.).
- **Evidence:** `wiki/ARCHITECTURE_CONFLICTS.md` §9.2.
- **Owner candidate:** Architect.
- **Recommended action:** archive out of the working tree.

### GAP-025 [LOW] Database-name capitalisation drift
- **Description:** `FalconCommerceDB` / `FalconChargingDB` / `FalconTemplateDb` (note `Db` not `DB`) / `PES`. No naming standard.
- **Evidence:** `wiki/ARCHITECTURE_CONFLICTS.md` §5.4.
- **Owner candidate:** Architect.
- **Recommended action:** standardise on `Falcon<Service>Db` PascalCase + `Db` suffix.

### GAP-026 [LOW] Provisioning DTOs use typo `Respose` (missing 'n')
- **Description:** `GetAccountApplicationServiceRespose`, `GetAccountCommunicationChannelServiceRespose`. Public API surface name typo.
- **Evidence:** `understanding/backend/BACKEND_SERVICE_MAP.md` line 83.
- **Owner candidate:** Backend (Provisioning).
- **Recommended action:** rename with a transitional alias; deprecate `Respose` types in one minor version.

### GAP-027 [LOW] `falcon-web-platform-ui` on `polishing-v0.4`, not `main`
- **Description:** TouchBase WARN. Memory project notes that v3.1/v3.2 night-shift work landed on this branch; not yet merged to `main`.
- **Evidence:** `wiki/ARCHITECTURE_CONFLICTS.md` §6.4; `discovery/startup-readiness-report.md`.
- **Owner candidate:** Frontend lead + Ammar.
- **Recommended action:** confirm whether `polishing-v0.4` is long-lived or short-lived. If short-lived, merge to `main`. If long-lived, document the trunk-based-development exception in the wiki.

### GAP-028 [LOW] `PrimeNGThemeService` still named after PrimeNG even though PrimeNG is gone
- **Description:** The class lives at `apps/host-shell/src/app/app.config.ts:29,58`. Its current job is theme + RTL sync, not PrimeNG theme management.
- **Evidence:** `frontend/FRONTEND_STRUCTURE_REPORT.md` §"Deviations" item 5.
- **Owner candidate:** Frontend.
- **Recommended action:** rename to `FalconThemeService` (or similar). Drop-in rename across host-shell.

### GAP-029 [LOW] Per-feature folder pattern is partially adopted
- **Description:** `models/models.ts` + `services/services.ts` + `resolvers/resolvers.ts` is followed in `admin-console/.../organization-hierarchy` but not in `host-shell/.../auth/` or several other features.
- **Evidence:** `wiki/ARCHITECTURE_CONFLICTS.md` §6.3.
- **Owner candidate:** Frontend.
- **Recommended action:** codify as a lint rule or accept partial adoption as deliberate. Pick one.

### GAP-030 [LOW] `legacy-peer-deps` in `.npmrc`
- **Description:** Memory note flags this for review post-v3.1 night shift.
- **Evidence:** memory `project_falcon_revamp_next_steps_plan.md` Tier 1.
- **Owner candidate:** Frontend.
- **Recommended action:** remove the flag, run `npm install`, fix peer-dep errors as they surface.

### GAP-031 [LOW] PRD folder missing
- **Description:** `C:\Falcon\PRD` does not exist. No PRDs available for the Business pipeline.
- **Evidence:** `discovery/startup-readiness-report.md` row "PRD folder".
- **Owner candidate:** Ammar.
- **Recommended action:** ask Ammar for the canonical PRD folder path; or confirm PRDs are produced elsewhere (Google Drive per memory `project_brain_always_grow_pipeline.md`).

### GAP-032 [LOW] Architecture wiki missing
- **Description:** `C:\Falcon\falcon-wiki` does not exist. Auto-sync from Azure DevOps Wiki has not run this week. Without it, every architectural rule in Phase 1 is `UNVERIFIED — wiki needed`.
- **Evidence:** `wiki/WIKI_FALLBACK_NOTE.md`; `wiki/ARCHITECTURE_RULES.md` §10.
- **Owner candidate:** Ammar / Architect.
- **Recommended action:** restore the Obsidian vault (re-run Sunday sync); re-run the Architecture agent against the canonical docs; diff against the code-extracted fallback.
