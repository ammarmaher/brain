---
type: adr
adr-id: ADR-003
title: Module Federation across three Angular apps (one host + two remotes)
status: accepted
date: 2026-05-16
deciders: [Falcon Frontend Team]
supersedes: []
superseded-by: []
tier: 3
---

*** ADR-003 — Why Module Federation across 3 apps ***
*** The permanent record of why the Falcon frontend ships as a federated triad ***

# ADR-003 — Module Federation across three Angular apps

> **Decision in one line.** One Nx workspace, one host (`host-shell`), two runtime remotes (`admin-console`, `management-console`), wired by Webpack-flavoured Module Federation through a runtime-resolved JSON manifest — not by build-time imports, not by separate workspaces, and not by iframes.

---

## Context

Before the Q4 2025 rebuild, the falcon-web-platform-ui frontend was a **single monolithic Angular application**. Every feature surface — internal Falcon-admin tooling, client-facing management console, login chrome, layout, error pages, the Falcon UI showcase, and preview labs — was compiled into one bundle and shipped as one deployable artefact.

The pain that drove the federation decision:

1. **Bundle size.** A single `main.js` aggregated every feature surface. Even after the v3.1 night-shift wins, the **admin-console** surface alone ships at ~1.78 MB raw / ~335 KB gz for its `main.js` plus a separate ~3.9 MB `remoteEntry.mjs` — that mass cannot all live in one initial bundle without breaking interactive-load budgets. Source: [[MODULE_FEDERATION_TOPOLOGY#10. Performance budget]] §10.2; v3.1 deltas in `[MEMORY] project_falcon_revamp_v3_1_night_shift_results.md` (host-shell −55% raw / admin-console −33% / mgmt-console −33%).

2. **Deploy coupling.** Touching one feature surface — a bug fix on admin-console's organization-hierarchy page — required rebuilding and redeploying the entire frontend artefact. There was no path to ship internal-tooling changes without also re-shipping the client-facing surface.

3. **Team-boundary smudge.** With one bundle, two teams (Falcon internal tooling vs. Falcon-for-clients) shared one `app.module.ts`, one router config, one set of guards, one CI gate. Code review collisions and "did your refactor break my screen?" cycles were a constant cost.

4. **No independent scaling path for the admin surface.** Falcon-internal tooling has different cache headers, different auth roles (`view app.admin-console` vs `view app.management-console`), and different gateway routing (`Gateway.SystemGateway` vs `Gateway.CoreGateway` — `[CODE] apps/admin-console/src/app/app.config.ts:51` vs `apps/management-console/src/app/app.config.ts:49`). Bundling them together forces a single deployment pipeline regardless.

5. **External-MFE option closed.** With a monolith, there was no mechanism to bring in a non-Angular micro-frontend (e.g. a React-built survey tool) without rewriting it. The two inactive manifest slots today (`demo-app` exposing `./users` as a `component`, `user-app` exposing `./survey` as a `module` — `[CODE] apps/host-shell/src/assets/module-federation.manifest.json:16-41`) demonstrate this gap is now closed.

The Wiki guidance pushed in the federation direction as well: `[VAULT] Home/Software-Architecture-Design/Front-End-Architecture.md` §5 enumerates the host + remote topology, the `@falcon/*` lib scope, and the per-app kebab-case naming convention `host-shell` / `admin-console` / `management-console` — see `[MEMORY] feedback_wiki_naming_conventions.md`.

---

## Decision

**One Nx workspace at `falcon-web-platform-ui/` containing three federated Angular 21.2.9 standalone-bootstrap apps:**

| App | Port | Role | What it owns |
|---|---|---|---|
| `host-shell` | 4200 | Host | Login, layout chrome, guards, error pages, the cross-MFE bridge `window.FalconSDK`, the remote-manifest provider |
| `admin-console` | 4204 | Remote | Falcon-internal admin surface (today: organization-hierarchy) |
| `management-console` | 4301 | Remote | Client admin surface (today: dashboard placeholder) |

**Wiring mechanism:** Webpack-flavoured Module Federation via `@nx/module-federation@22.7.1` on top of `@module-federation/enhanced@^2.1.0`. **Remote URLs are NOT baked in at build time** — they are loaded at runtime from a pluggable JSON manifest:

```
/assets/module-federation.manifest.json   (dev — points at localhost:4204 / 4301)
/assets/module-federation.manifest.staging.json
/assets/module-federation.manifest.prod.json   (points at https://falconhub.space/remotes/<remote>/remoteEntry.mjs)
```

The manifest is loaded by `JsonFileRemoteManifestProvider` (bound to the `REMOTE_MANIFEST_PROVIDER` InjectionToken at `[CODE] apps/host-shell/src/app/app.config.ts:104`), parsed by `RemoteRouteService.reloadRemotes()`, fed into `setRemoteDefinitions()` from `@nx/angular/mf`, and **then** `router.initialNavigation()` is allowed to fire — see `[CODE] apps/host-shell/src/bootstrap.ts:48-52` and `[VAULT] MODULE_FEDERATION_TOPOLOGY.md` §5 sequence diagram.

The Angular router is created with `withDisabledInitialNavigation()` (`[CODE] apps/host-shell/src/app/app.config.ts:54`) so the wildcard `**` route cannot race the manifest load.

Shared singletons (`@angular/*`, `rxjs`, `@falcon/*`, `@falcon/sdk`, `uuid`, `tslib`, `jwt-decode`) live in **identical share-maps** across all three apps — verified by diffing `apps/host-shell/module-federation.config.ts`, `apps/admin-console/module-federation.config.ts`, `apps/management-console/module-federation.config.ts`. Strict-version + singleton + eager on the Angular runtime contract; singleton + loose on Falcon workspace libs. Animations stay LOCAL per app to avoid `RUNTIME-006` double-init. See `[VAULT] MODULE_FEDERATION_TOPOLOGY.md` §4.

---

## Alternatives considered

### 1. Keep the monolith (status quo)

**Rejected.** Doesn't address the pain points above. A monolith was the starting condition — every concern in the Context section above describes a cost the team was paying daily. The v3.1 night-shift bundle wins (`-55%` raw on host-shell — `[MEMORY] project_falcon_revamp_v3_1_night_shift_results.md`) would have been impossible without the federation cut, because much of that reduction came from moving feature surfaces out of the host's initial chunk into lazy-loaded remoteEntry boundaries.

### 2. Three separate Nx workspaces (one per app)

**Rejected.** Would require:
- Duplicating the Falcon component library (`libs/falcon-ui-core`, `libs/falcon-ui-tokens`, `libs/falcon`, `libs/sdk` — ~52 Stencil + Angular wrappers, ~3,000 design tokens — `[MEMORY] project_falcon_v3_2_session_handover.md`) across three repos, or publishing them as versioned packages and dealing with cross-repo version drift.
- Forking the share-map maintenance: a new shared lib would need to be added to three `module-federation.config.ts` files in three repos in lockstep — federation singletons require identical version pinning across host + remotes (`[VAULT] MODULE_FEDERATION_TOPOLOGY.md` §7.2 "Version mismatch on a strict-version singleton").
- Losing single-command dev: `npm start` today spawns host + both remotes in one process via `@nx/angular:module-federation-dev-server` with `devRemotes: ["admin-console", "management-console"]` (`[CODE] apps/host-shell/project.json:138`). Cross-workspace dev would mean three separate watchers, three webpack-dev-servers, three port reservations, three hot-reload boundaries.
- Three CI pipelines, three lint configs, three eslint-boundary-rule sets, three tsconfig hierarchies, three Tailwind configs.

The shared component library + shared design tokens + per-feature workspace cost-benefit comes out lopsided against the monorepo. Memory `[MEMORY] project_web_platform_v2_rebuild.md` confirms the intent to keep the monorepo shape ("apps/{shell, portal-admin, portal-client}, libs/{...}") even for the planned v2 rebuild.

### 3. iframes

**Rejected.** Specific objections:
- **Auth-crossing pain.** The Falcon platform uses a Zitadel-backed Identity Service with token-in-memory + sessionStorage for refresh. Iframes either re-do the OIDC dance per frame (visible login flashes, multiple refresh-token timers) or hand tokens via `postMessage` (still fragile under cross-origin restrictions). The DI-backed Falcon SDK + the `window.FalconSDK` bridge (`[CODE] apps/host-shell/falcon-sdk/host-window-sdk.bridge.ts:20-47`) only work because there is one window, one Angular DI graph, and one shared `@angular/core` singleton across remotes.
- **State-crossing pain.** Toasts, theme changes, language switches all flow through `Host*Facade` classes (`[CODE] apps/host-shell/falcon-facades/host-{auth,theme,language,context,notifier}.facade.ts`). With iframes each frame would need its own observable hub plus a postMessage protocol on top — three channels would become six.
- **SEO + accessibility cost.** Iframe scroll containment, focus traps, screen-reader landmark fragmentation, and back-button semantics are all hostile to a polished single-page admin tool.
- **Visual seams.** Toolbar + sidebar + content from different iframes will not paint together; theme tokens cannot cascade across the iframe boundary.

### 4. Native Federation (`@angular-architects/native-federation`)

**Considered seriously.** Native Federation uses ES-module imports + an import-map at runtime instead of Webpack's container runtime. It promises smaller runtime overhead and esbuild compatibility.

**Rejected for v3.1 / v3.2** because:
- `@nx/module-federation@22.7.1` (webpack-flavoured) is the path Nx 22 generators produce and tool out of the box (`[CODE] nx.json:42-44` declares `@nx/angular:module-federation-dev-server` as a `targetDefault`). Switching mid-stream during the v3.1 Angular 20 → 21 + zoneless rollout would have introduced an extra moving target.
- The federation surface is already large: identical share-maps across 3 configs, prod `shareStrategy: 'version-first'`, `disableNxRuntimeLibraryControlPlugin: true` opt-out, `additionalShared` belt-and-braces, four expose-types (`component | module | routes | routingModule`) — see `[VAULT] MODULE_FEDERATION_TOPOLOGY.md` §4. Rebuilding all of that against Native Federation's import-map runtime is multi-day work without a current concrete bundle-size or perf delta to justify it.
- Memory `[MEMORY] project_falcon_next_wave_brief_dispatched.md` notes esbuild migration was "considered but not landed" — same shape of caution applied to Native Federation.

**Revisit trigger:** if a future audit measures the webpack runtime overhead as material (currently `main.js` is 1.78 MB raw on admin-console and management-console — most of that is the Angular framework + Falcon libs, not the federation runtime) or if Angular 22+ deprecates the Webpack federation toolchain.

---

## Consequences

### Positive

- **Independent deploy of remotes.** Each remote's `dist/apps/<remote>/remoteEntry.mjs` ships to `https://falconhub.space/remotes/<remote>/` independently of the host. Verified on disk: `dist/apps/admin-console/remoteEntry.mjs` is 4,088,428 bytes; `dist/apps/management-console/remoteEntry.mjs` is 4,092,193 bytes; built 2026-05-16. Source: `[VAULT] MODULE_FEDERATION_TOPOLOGY.md` §6.
- **Lazy entry per remote.** A user that never visits `/management-console/*` never downloads its `remoteEntry.mjs`. The host renders login, layout, error pages, and preview labs with zero remote bytes. Source: `[CODE] apps/host-shell/src/app/app.routes.ts:14-117` shows the auth-free preview routes + login route + error routes all live on the host with no `loadRemoteModule` calls.
- **Shared singletons through DI + `@falcon/sdk` InjectionTokens.** `@falcon` and `@falcon/sdk` are singleton + loose + eager (`[CODE] apps/host-shell/module-federation.config.ts:34-43` + `additionalShared:101-120`, mirrored in both remotes). One Angular DI graph spans the host + active remotes. Remote-side fallback facades (`provideFalconFallbackFacades()` — `[CODE] apps/admin-console/src/app/app.config.ts:33`, `apps/management-console/src/app/app.config.ts:31`) let the same Falcon libraries resolve when a remote is served standalone for development.
- **Three runtime auth channels for cross-MFE consumers.** (1) Angular DI `FALCON_AUTH` token, (2) sessionStorage, (3) `window.FalconSDK` global — the bridge at `[CODE] apps/host-shell/falcon-sdk/host-window-sdk.bridge.ts:20-47` exposes `getToken / onTokenChange` so non-Angular MFEs (the framework-agnostic inactive slots) can read auth without binding to DI.
- **External-MFE option open.** Manifest schema supports `entryType: 'manifest' | 'remoteEntry'` and `exposeType: 'component' | 'module' | 'routes' | 'routingModule'` (`[CODE] apps/host-shell/src/app/core/services/remote-config.ts:3-16`). Two inactive slots prove the schema accepts non-Angular external remotes. Documented as a one-line flip-of-`active: true` in `[VAULT] MODULE_FEDERATION_TOPOLOGY.md` §13 Q8.
- **Manifest is pluggable.** `RemoteManifestProvider` interface + `REMOTE_MANIFEST_PROVIDER` InjectionToken means the default `JsonFileRemoteManifestProvider` can be swapped for `ApiRemoteManifestProvider` in one line — `[CODE] apps/host-shell/src/app/core/module-federation/README.md:9-25`. No changes to `RemoteRouteService`, `bootstrap.ts`, or the share-map.
- **Wave PR-8 (PrimeNG total purge) did not break federation.** Removing PrimeNG from the share-map across all 3 apps was a coordinated change but did not require reworking the federation contract — share-map branches simply disappeared. Source: `[MEMORY] project_falcon_primeng_total_removal_complete.md` + comments at `[CODE] apps/host-shell/module-federation.config.ts:12-14, 72` and `apps/admin-console/module-federation.config.ts:4-6, 79-80`.

### Negative

- **Refresh-token race across host + remotes.** (D-2026-05-16-14) The host owns the auth state, but remotes may issue parallel HTTP requests on first navigation that all hit `401` and all kick off a refresh-token flow simultaneously. The interceptor queue / single-flight refresh is host-side; remotes that bypass it (or run before the host's interceptor is wired) can produce duplicate refresh calls and racing token writes. Not yet fully mitigated.
- **Manifest naming inconsistency: kebab vs snake.** The webpack `name` field uses kebab-case (`admin-console`) but the manifest `name` field uses snake_case (`admin_console`) and `RemoteRouteService.loadRemote(...)` reads the snake_case form. Documented as anomaly #1 in `[VAULT] MODULE_FEDERATION_TOPOLOGY.md` §12. Future-remote authors will trip on this.
- **`zone.js` still in `package.json`.** All 3 apps are zoneless (`provideZonelessChangeDetection()` per `[CODE] apps/host-shell/src/app/app.config.ts`, `apps/admin-console/src/app/app.config.ts:28`, `apps/management-console/src/app/app.config.ts:27`) and the share-map already excludes zone.js. The package itself is still listed at `0.16.2` in `package.json:93` — cosmetic noise, no runtime impact. Tracked as anomaly #7.
- **MockAuth / fallback facades needed for standalone-remote dev.** When `admin-console` or `management-console` is served solo (without host-shell), it has no `Host*Facade` providers. The remotes call `provideFalconFallbackFacades()` so the `@falcon/sdk` contract resolves to no-ops. This is a maintenance tax: every facade contract needs a "host implementation + fallback implementation" pair.
- **(D-2026-05-16-17) Stale duplicate services in host-shell root.** Memory + peer audit `[VAULT] MODULE_FEDERATION_PATTERNS.md:291-295` flag a possible dead duplicate `remote-route.service.ts` at `apps/host-shell/src/app/remote-route.service.ts` (older version). Federation refactors leave this kind of debris easily — the canonical service is at `apps/host-shell/src/app/core/services/remote-route.service.ts`. Cleanup pass pending.
- **Cognitive overhead.** Anyone touching federation must understand: the share-map function, `additionalShared`, the manifest schema, `entryType` vs `exposeType`, `withDisabledInitialNavigation()` + `applyRemoteRoutes()`, the triple-export shim in `entry.routes.ts`, the `shellAccessMatchGuard` PBAC gate, and the `provideFalconFacades` vs `provideFalconFallbackFacades` DI fork. The 690-line topology doc exists because the surface area is large.
- **Three bundle budgets to police.** `host-shell` 5.5 / 6 MB, `admin-console` 8.5 / 9.5 MB, `management-console` 11 / 12 MB (warn / error — `[CODE] apps/*/project.json`). Each app needs its own perf gate.

### Trade-offs accepted

- Federation runtime overhead in `main.js` is accepted in exchange for independent-deploy + lazy-remote-load. Webpack federation's runtime is ~tens-of-KB — well under the bundle wins from cutting feature surfaces out of the host initial chunk.
- The "identical share-map across 3 configs" discipline is accepted as the cost of singleton safety. `apps/host-shell/scripts/verify-mf.mjs` (the `verify:mf` npm script) is the static gate that catches drift — exposed-module paths confirmed to exist on disk.
- HashLocationStrategy (`[CODE] apps/host-shell/src/app/app.config.ts:56`) was kept across the federation cut because the alternative — PathLocationStrategy — would require server-side rewrite rules at the `falconhub.space` reverse proxy across all remote paths.
- One inactive remote slot per "future framework slot" was preserved (`demo-app`, `user-app`) so adding an external React/Vue MFE is a manifest edit + a remote deployment, not a federation rearchitecture.

---

## Verification

How we know this is the right call, today, with citations:

### State of the federation

- **1 host + 2 active remotes + 2 dormant manifest slots.** Confirmed by `[CODE] apps/host-shell/src/assets/module-federation.manifest.json` (4 entries, `active: true` on admin-console + management-console; `active: false` on demo-app + user-app).
- **Federation topology is documented at 690 lines.** `[VAULT] MODULE_FEDERATION_TOPOLOGY.md` — full bootstrap sequence, per-app role table, exposed modules table, share-map table, dev-vs-prod table, failure modes, verification questions. Tier 2 of FRONTEND_KNOWLEDGE_PATH, generated 2026-05-16.
- **Identical share-map across all 3 apps.** Confirmed by diffing `apps/{host-shell,admin-console,management-console}/module-federation.config.ts`. Same animations-stay-local branch, same `@falcon` singleton-loose-eager branch, same `@angular/*` singleton-strict-eager branch, same `rxjs` branch, same utility branch, same default. See also `[VAULT] MODULE_FEDERATION_TOPOLOGY.md` §4.
- **Runtime auth bridge live across 3 channels.** (1) DI token `FALCON_AUTH` via `Host*Facade` providers (`[CODE] apps/host-shell/src/app/app.config.ts:57-63`), (2) sessionStorage (read by `HostAuthFacade` snapshot getter), (3) `window.FalconSDK` global installed at bootstrap (`[CODE] apps/host-shell/src/bootstrap.ts:42, 59`). Source: `[VAULT] MODULE_FEDERATION_TOPOLOGY.md` §8.2.
- **Wave PR-8 (PrimeNG purge) reduced shared-map without breaking federation.** Memory `[MEMORY] project_falcon_primeng_total_removal_complete.md` records "All 3 apps prod-build GREEN" post-purge. Share-map branches removed in all 3 MF configs (`[CODE] apps/host-shell/module-federation.config.ts:72`, `apps/admin-console/module-federation.config.ts:79-80`).
- **All 3 apps prod-build GREEN at v3.1 budgets.** `[MEMORY] project_falcon_revamp_v3_1_night_shift_results.md`: admin-console −33% raw / −42% gz; host-shell −55% / −56%; management-console −33% / −42%. Bundle sizes on disk 2026-05-16 confirm the wins held.

### Verification questions an agent must be able to answer

The 8 questions in `[VAULT] MODULE_FEDERATION_TOPOLOGY.md` §13 (which `remoteEntry.mjs` loads first, how the host knows about the remote, what fires before initial navigation, why no animation-engine clash, where to declare a new shared dep, how `window.FalconSDK` works, how remotes consume it, how to add a remote without touching `bootstrap.ts`) all have file-cited answers there. If a session cannot answer all 8, it has not loaded enough federation context.

---

## Related

- [[ADR-001]] — Why Falcon library instead of PrimeNG (federation share-map size shrunk after PR-8 PrimeNG purge — context for this ADR)
- [[ADR-006]] — Why Identity Service owns user lifecycle (the auth-token chain that the federation bridge transports across MFE boundaries)
- [[MODULE_FEDERATION_TOPOLOGY]] — Tier 2 deep-dive that this ADR explains the WHY of (Agent B, 2026-05-16)
- [[ROUTING_TOPOLOGY]] — Tier 2 deep-dive on per-app route tables + federation route handoffs (Agent F, 2026-05-16)
- [[MODULE_FEDERATION_PATTERNS]] — Earlier Tier 1 audit (superseded for topology questions by `MODULE_FEDERATION_TOPOLOGY`)
- [[ROUTES_AND_MF_AUDIT]] — Earlier host-route audit
- **Decision queue references:**
  - **D-2026-05-16-14** — refresh-token race across host + remotes (open; tracked as Negative consequence)
  - **D-2026-05-16-17** — stale duplicate `remote-route.service.ts` in host-shell root (open; tracked as Negative consequence)
- **Memory citations:**
  - `[MEMORY] project_falcon_revamp_v3_1_night_shift_results.md` — Wave 8 `RemoteManifestProvider` abstraction landed; bundle-delta evidence
  - `[MEMORY] project_falcon_v3_2_session_handover.md` — current state, library inventory, demo-folder exclusion rule
  - `[MEMORY] project_falcon_primeng_total_removal_complete.md` — Wave PR-8 share-map cleanup
  - `[MEMORY] project_web_platform_v2_rebuild.md` — confirms intent to keep host + remote shape in any future v2 rebuild
  - `[MEMORY] feedback_wiki_naming_conventions.md` — `host-shell` / `admin-console` / `management-console` kebab-case rule + `@falcon/*` import-alias contract
- **Code citations** (canonical SoT — verified 2026-05-16):
  - `apps/host-shell/module-federation.config.ts` — host share-map, no remotes, no exposes, `disableNxRuntimeLibraryControlPlugin: true`
  - `apps/admin-console/module-federation.config.ts` — admin remote share-map, exposes `./admin-console`
  - `apps/management-console/module-federation.config.ts` — mgmt remote share-map, exposes `./management-console`
  - `apps/host-shell/src/assets/module-federation.manifest.json` — the 4-entry manifest (2 active, 2 inactive)
  - `apps/host-shell/src/bootstrap.ts:30-61` — bootstrap → manifest load → applyRemoteRoutes → initialNavigation
  - `apps/host-shell/src/app/app.config.ts:54, 104` — `withDisabledInitialNavigation()` + `REMOTE_MANIFEST_PROVIDER` binding
  - `apps/host-shell/src/app/core/services/remote-route.service.ts` — runtime route assembly + per-expose-type branching
  - `apps/host-shell/falcon-sdk/host-window-sdk.bridge.ts:20-47` — `window.FalconSDK` install site
  - `nx.json:42-44` — `@nx/angular:module-federation-dev-server` declared as targetDefault

## Tags

#type/adr #frontend #architecture #module-federation #tier-3
