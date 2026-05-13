*** DISCOVERY_REPORT — Phase 1 + Phase 2 rollup (2026-05-13) ***

# Falcon platform discovery — overall readiness: **68% (AMBER)**

**Decision:** `READY_WITH_WARNINGS`.

The Brain SK v0.1 discovery pipeline ran two phases against the Falcon platform on 2026-05-13. Phase 1 produced 74 backend dossiers, 17 frontend dossiers, and a 4-file code-extracted wiki fallback. Phase 2 (this pass) cross-referenced the three streams and produced the integration view at `understanding/integration/` (6 files) and this rollup. Net result: the platform is well-inventoried and reasonably consistent for a microservices monorepo of this size, but two sources of truth are missing (PRD folder + Architecture Wiki) and several drift issues span multiple services.

## Top HIGH gaps remaining (3 after acknowledgments)

> GAP-001, GAP-002, and GAP-003 were `ACKNOWLEDGED — not pursuing (2026-05-13)` and remain in `GAP_LIST.md` for audit. They are excluded from this surfaced list.

| ID | Title | Evidence |
|---|---|---|
| **GAP-004** | `ServiceOperationResult<T>` ships in 5 distinct shapes across the 6 services that define it; Commerce's east-west `IdentityService` already needs a private bridge wrapper. | `wiki/ARCHITECTURE_CONFLICTS.md` §4.1; `falcon-core-commerce-svc/src/Falcon.Commerce.Infrastructure/External/Services/IdentityService.cs:97-103` |
| **GAP-005** | `adminConsoleGuard` is commented out in `apps/admin-console/src/app/app.routes.ts:7` — admin routes are reachable without role gating beyond the host-shell guards. | `C:\Falcon\Falcon\falcon-web-platform-ui\apps\admin-console\src\app\app.routes.ts:7` (verified) |
| **GAP-006** | PES uses GET-with-body (HTTP anti-pattern) on `policyrulesBySub` and `policyrulesByFilter` — may be silently broken in some deployment topologies. | `falcon-core-access-svc/src/T2.PES.API/Program.cs:175,179` (per `BACKEND_SERVICE_MAP.md` deviations) |

## Top 5 next actions

> ACT-001 and ACT-002 were `ACKNOWLEDGED — not pursuing (2026-05-13)` and remain in `NEXT_ACTIONS.md` for audit. They are excluded from this surfaced list.

1. **ACT-003 (S, today):** move dev Mongo connection strings out of non-Development `appsettings.json` for Templates + Access.
2. **ACT-004 (S, today):** restore the architecture Wiki vault at `C:\Falcon\falcon-wiki`. This single action unblocks 7 downstream actions (ACT-008…ACT-013 + ACT-015) and lifts the wiki row from 15% → ≥ 80%.
3. **ACT-006 (S, parallel):** file the Commerce NodeController method-overload bug — note that the Phase-1 NRE claim does **not** reproduce against the actual file (constructor assignment present at `NodeController.cs:87`). The real defect is the method-name collision at lines 194/212.
4. **ACT-007 (S, parallel):** confirm intent of commented-out `adminConsoleGuard` — restore it or document the exception with a `TODO(restore-by:<date>)`.
5. **ACT-009 (M, after wiki is back):** extract a shared `Falcon.Common.Contracts` package carrying canonical `ServiceOperationResult<T>` + `FalconException` + `FalconError`. Replace each service's local copy in subsequent PRs.

## Phase 1 surface (what already exists)

- **9 backend services** all on .NET 10 except `T2.PES.API` on .NET 6. `~125 endpoints` catalogued.
- **Two YARP gateways**: Core (7038, ClientOnly + IP allowlist + per-tenant rate limit + Kafka) and System (7256, FalconOnly, thinner — no Kafka, no rate limiter).
- **Kafka**: Confluent + Avro + Schema Registry. 7 producer/consumer wirings across the platform.
- **MongoDB**: every service uses it; Access also uses SQL Server (polyglot outlier).
- **Frontend**: Nx 22.7.1 / Angular 21.2.9 / zoneless / Tailwind v4 utilities only. 3 apps via Module Federation. **47 Stencil component pairs + 49 Angular wrappers** in `libs/falcon-ui-core`. PrimeNG physically uninstalled (Wave PR-8). Token SSOT at `libs/falcon-theme/src/falcon-tailwind-tokens.css`.

## Phase 2 cross-cutting findings (this pass)

- The "platform-wide" conventions are intent-uniform but implementation-divergent: `ServiceOperationResult<T>` (5 shapes), `FalconException` (per-service copies), `MultiLanguageName` (3 of 6 services), `ValidateAudience` JWT flag drift, two endpoint styles (Controllers + FastEndpoints), two mediator + two mapper libraries.
- 41 frontend call sites map to ~22 distinct backend endpoints — concentrated on **Commerce/Node** (hierarchy + sub-node + name change + account create) and **Identity/user + auth** (full user lifecycle + login flows). PES is hit via `pes/authorize/resources`. The Charging service, Provisioning service, Templates service, and Contact Group service have **zero frontend consumers** in `polishing-v0.4`.
- The Core Gateway's 3 custom aggregation endpoints (accounts hierarchy, contracts, contract by id) have **no frontend consumer** — the frontend reads the underlying Commerce endpoints directly. The aggregation layer is wired but not exercised.

## Two specific evidence corrections worth flagging

1. **`_changeApplicationPriceTypeHandler` NRE claim (Phase 1 NodeController OVERVIEW.md:77) does not reproduce.** Actual file `NodeController.cs:87` has the assignment. The real issue is a method-name overload (two methods both called `ChangeCommunicationChannelPriceType` at lines 194 and 212).
2. **Identity does not use `MultiLanguageName`** — Phase 1 lists it under "all 6 services have it"; verified absent in Identity Domain. This is a documented gap (GAP-007 + GAP-006 in `GAP_LIST.md`), but the underlying claim was correct (`MultiLanguageName` is present only in Commerce/Charging/Provisioning).

## Limitations recorded for the next pass

- PRD folder absent — first Business / Full-Stack task triggers a Q1 ask.
- Architecture Wiki absent — first Architecture / governance task triggers a Q2 ask; or restore early to unblock 7 downstream actions.
- `polishing-v0.4` is the active working branch on `falcon-web-platform-ui`; all other repos are on `main`.
- Templates is not exposed through either gateway — frontend cannot reach it currently.

## What lives where after Phase 2

- **Phase 1 inputs (read-only):** `C:\Falcon\Brain Outputs\understanding\{backend,frontend,wiki}\` (74 + 17 + 4 = 95 files).
- **Phase 2 outputs:** `C:\Falcon\Brain Outputs\understanding\integration\` (6 files: `INTEGRATION_OVERVIEW.md`, `READINESS_MATRIX.md`, `GAP_LIST.md`, `NEXT_ACTIONS.md`, `API_TO_COMPONENT_TRACE.md`, `BLOCKERS_AND_QUESTIONS.md`).
- **Rollup:** `C:\Falcon\Brain Outputs\reports\discovery-2026-05-13\DISCOVERY_REPORT.md` + `DISCOVERY_SUMMARY.json` (this folder).
