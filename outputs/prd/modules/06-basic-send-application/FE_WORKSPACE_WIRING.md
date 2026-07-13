# FE Workspace Grounding — how `basic-send-app` would really be added

Repo: `C:\Falcon\Falcon\falcon-web-platform-ui` (read-only investigation, 2026-07-06)

> ## ⚠️ HEADLINE FINDING — the assumption "new feature = new Module-Federation remote" is WRONG for this PRD
>
> The workspace has exactly **3 apps** and the only MF remotes are the two **console-level** apps
> (`admin-console`, `management-console`) loaded dynamically by `host-shell` from a JSON manifest.
> **Features do NOT mount as remotes.** Every feature that "opens inside" a console — including the
> memory-noted CommChannels Meta/Voice/AI precedent — is a **lazy-loaded route folder INSIDE each
> console app**, plus a **hardcoded sidebar child item in host-shell's `layout.component.ts`**.
> Since the PRD says BSA opens inside admin-console AND management-console as a submenu under
> *Marketplace & Applications .Mng*, the repo-conformant architecture is **an in-console feature
> ("basic-send") duplicated per console (or shared-lib presentational + per-app API), NOT a new
> federated app**. A standalone remote is *possible* (the dynamic-remote machinery is genuinely
> registry-driven) but it would mount at a **top-level host route** (`/#/basic-send-app/...`),
> outside both consoles — contradicting the PRD's placement. Recipe A (in-console) is the
> recommended path; Recipe B (true remote) is documented for completeness.

Also corrected vs. standing assumptions:
- [CODE] `package.json:~dependencies` — Angular is **21.2.9**, Nx **22.7.1** (memory says "Angular 20"). PrimeNG is **fully removed** (Wave PR-8 comments in all three `module-federation.config.ts`; `tailwind.config.js:4-8`).
- There is **no per-app i18n** — one shared `en.json`/`ar.json` pair in `libs/falcon/src/language/i18n/` is copied into every app's `assets/i18n`.
- There is **no e2e setup** (no `apps/*-e2e`, no playwright/cypress config or dependency).

---

## 1. Workspace shape

- [CODE] `apps/` → `admin-console`, `host-shell`, `management-console` (3 apps, nothing else).
- [CODE] `libs/` → `falcon` (the big shared lib: core, shared-types, shared-ui, shared-features, language, shared-data-access), `sdk` (`@falcon/sdk` facade contracts), `falcon-theme` (Tailwind token SSOT), `falcon-ui-core` (Stencil web components + Angular wrappers), `falcon-ui-tokens`, `falcon-studio`, `falcon-studio-runtime`, `falcon-ui-react`, `falcon-ui-vue`, `falcon-ui-showcase-data`.
- Versions ([CODE] `package.json`): `@angular/core 21.2.9`, `@angular/cli 21.2.10`, `nx ^22.7.1`, `@nx/module-federation 22.7.1`, `@module-federation/enhanced ^2.1.0`, `@angular-architects/module-federation ^21.2.2` (legacy helper still installed), `tailwindcss ^4.2.2` (+ `@tailwindcss/postcss`), `vitest 3.2.4` + `@analogjs/vite-plugin-angular 2.5.1`, `@nx/vitest 22.7.1`.
- [CODE] `nx.json` — has `targetDefaults` for `@nx/angular:module-federation-dev-server` (line 42); no cloud.
- TS path aliases ([CODE] `tsconfig.base.json`): `@falcon` → `libs/falcon/src/index.ts`, `@falcon/sdk` → `libs/sdk/src/index.ts`, `@falcon/theme` → `libs/falcon-theme/src/index.css`, `@falcon/ui-core/angular` → `libs/falcon-ui-core/src/angular-wrapper/index.ts`, `@falcon/env` → `apps/host-shell/src/environments/environment.ts`.

## 2. Module-Federation wiring (dynamic manifest, NOT static remotes)

Per-app trio: `module-federation.config.ts` + `webpack.config.ts` + `webpack.prod.config.ts` at the app root.

- [CODE] `apps/host-shell/module-federation.config.ts:15-17` — `name: 'host-shell'`, **`remotes: []`** (empty; nothing static), `disableNxRuntimeLibraryControlPlugin: true`. Share function: `@falcon`/`@falcon/*` singleton+eager+`requiredVersion:false` (lines 41-50), `@angular/*` singleton eager strict (53-62), rxjs eager (66-77), default singleton lazy (97-105). `additionalShared` re-pins `@falcon` + `@falcon/sdk` (108-130).
- [CODE] `apps/admin-console/module-federation.config.ts:7-12` — `name: 'admin-console'`, `exposes: { './admin-console': join(__dirname, 'src/app/remote-entry/entry.routes.ts') }`. Same share policy (comments demand: "KEEP IN SYNC with host-shell + admin-console MF configs").
- [CODE] `apps/management-console/module-federation.config.ts:16-21` — `name: 'management-console'`, `exposes: { './management-console': .../remote-entry/entry.routes.ts }`.
- [CODE] `apps/admin-console/webpack.config.ts:13-17` — `withModuleFederation(config, { dts: false, shareStrategy: 'version-first' })` from `@nx/module-federation/angular`, plus cache-policy / warning / module-script-type plugins from `tools/webpack/*`. (management-console + host-shell webpack configs are the same pattern.)
- [CODE] `apps/admin-console/project.json:9-45` — build executor `@nx/angular:webpack-browser` with `customWebpackConfig.path = apps/admin-console/webpack.config.ts` (line 42-44; prod variant at 73-75); serve executor `@nx/angular:module-federation-dev-server`, `port 4204` (123-129). [CODE] `apps/management-console/project.json:127-128` — port **4301**. host-shell serves on 4200.

### How host-shell discovers remotes — JSON manifest, pluggable provider

- Manifest assets: [CODE] `apps/host-shell/src/assets/module-federation.manifest.{dev,staging,prod}.json` + the **active copy** `module-federation.manifest.json`. [CODE] `scripts/set-mf-manifest.mjs:12-26` copies `manifest.<env>.json` → `manifest.json` (run by every `prestart`/`prebuild` npm script — `package.json` "mf:manifest:dev|staging|prod").
- Registration of the two consoles (THE lines to mimic): [CODE] `apps/host-shell/src/assets/module-federation.manifest.dev.json:2-16` (`"management-console"`: remoteEntry `http://localhost:4301/remoteEntry.mjs`, exposedModule `./management-console`, routePath `management-console`, `entryType: "remoteEntry"`, `exposeType: "routes"`, `requiredAccess: [{action:"view", resource:"app.management-console"}]`, `localDev: {projectName, port, liveByDefault}`) and `:43-57` (`"admin-console"`, port 4204, `resource: "app.admin-console"`). Inactive third-party examples use `resource: "microapp.user-settings"` (lines 17-42).
- Entry-shape contract: [CODE] `apps/host-shell/src/app/core/services/remote-config.ts:3-28` (`RemoteDefinition`: name, remoteEntry, exposedModule, routePath, active, entryType, exposeType, requiredAccess?, styles?, localDev?, **menu?: RemoteMenuItem[]**) and `:31-45` (`RemoteMenuItem` — registry-driven sidebar entries: id, labelKey, icon, section, order, parentId, requiredAccess, route).
- Provider indirection: [CODE] `apps/host-shell/src/app/core/module-federation/remote-manifest.types.ts:17-25` (`REMOTE_MANIFEST_PROVIDER` token + `REMOTE_MANIFEST_URL` default `/assets/module-federation.manifest.json`); bound to the JSON file impl at [CODE] `apps/host-shell/src/app/app.config.ts:176` (`useExisting: JsonFileRemoteManifestProvider`; an `ApiRemoteManifestProvider` exists for a future backend source, same folder).
- Runtime loading: [CODE] `apps/host-shell/src/app/core/services/remote-route.service.ts:85-105` `reloadRemotes()` → filters `active`, then `:107-143` registers `entryType:"manifest"` remotes via `registerRemotes()` (`@module-federation/enhanced/runtime`) and `entryType:"remoteEntry"` remotes via `setRemoteDefinitions()` (`@nx/angular/mf`), and builds one host `Route` per remote: `path: def.routePath`, `canMatch: [shellAccessMatchGuard]`, `data: { access: def.requiredAccess, remoteName }`, `loadChildren/loadComponent` per `exposeType` (`createRoutesRoute` :322-357 is the console path — consoles expose a `Routes` array). Remote CSS is auto-attached from `styles.css` beside the remoteEntry (:542-565). 15s hung-origin timeout (:61-83).
- Mounting: [CODE] `apps/host-shell/src/bootstrap.ts:32-56` — `applyRemoteRoutes()` splices remote routes into `appRoutes[0].children`, then `router.resetConfig(...)` and `router.initialNavigation()` (initial navigation is disabled at [CODE] `apps/host-shell/src/app/app.config.ts:100` `withDisabledInitialNavigation()` so the `**` catch-all can't fire before remotes register).
- Remote-side export contract: [CODE] `apps/admin-console/src/app/remote-entry/entry.routes.ts:1-4` — re-exports the app's routes as `remoteRoutes` + default (`findRoutes` in remote-route.service accepts `routes`/`default`/`appRoutes` keys). [CODE] `apps/admin-console/src/app/app.routes.ts:143-145` exports `routes = appRoutes`.
- Local live-dev: [CODE] `scripts/start-dynamic-remotes.mjs:7-8,88,137-141` — derives Nx `--devRemotes` from manifest `localDev.projectName`; "add a new remote (with a `localDev` block) to the manifest and it becomes selectable automatically". No hardcoded remote names anywhere in tooling.

**What adding a remote named `basic-send-app` would require, file by file → see RECIPE B.** But read Section 3 first — that is not how in-console features are done.

## 3. In-console feature mounting — the ACTUAL pattern for BSA

Two-layer pattern: (a) lazy feature routes inside each console app; (b) sidebar item hardcoded in host-shell layout. Breadcrumbs come free from `data.breadcrumb`.

### 3a. Feature routes — the CommChannels Meta/Voice/AI precedent (2026-06-30 memory note, confirmed)

- admin-console mount: [CODE] `apps/admin-console/src/app/app.routes.ts:55-62` — `path: 'comm-channels'` → `loadChildren` `./features/comm-channels-services/comm-channels-services.routes`, `data: { breadcrumb: 'CommChannels & Services' }`. Marketplace mount at `:65-72` — `path: 'marketplace'` → `./features/marketplace-applications/marketplace-applications.routes`.
- Sub-page children: [CODE] `apps/admin-console/src/app/features/comm-channels-services/comm-channels-services.routes.ts:14-53` — componentless parent `path:''` with route-scoped `providers: [CommChannelsPageStateService]`, children: index catalog (`path:''`), then `meta-service` (:30-36), **`voice-service` (:38-44)**, `ai` (:46-50) — each `loadComponent` + `data.breadcrumb`. No extra guard (parent `adminConsoleGuard` at app.routes.ts:16 gates the whole remote).
- management-console mount: [CODE] `apps/management-console/src/app/app.routes.ts:36-38` — slug `comm-mgmt` → `./features/comms-hub/comms-hub.routes`. Marketplace at `:75-78`.
- mgmt sub-pages WITH PES gate: [CODE] `apps/management-console/src/app/features/comms-hub/comms-hub.routes.ts:24-63` — parent `path:''`, `canActivate: [shellAccessGuard]`, `data: { access: FalconAccess.managementConsole.services.view(), breadcrumb: ... }`; children `meta-service`/`voice-service`(:44-50)/`ai` inherit the parent gate.
- Marketplace today (BSA's future parent): admin [CODE] `apps/admin-console/src/app/features/marketplace-applications/marketplace-applications.routes.ts:12-25` — **single flat route** (`path:''`, `providers:[MarketplacePageStateService]`, `loadComponent`), no children yet. mgmt [CODE] `apps/management-console/src/app/features/marketplace-applications/marketplace-applications.routes.ts:19-29` — flat `component:` + `canActivate:[shellAccessGuard]` + `data.access = managementConsole.services.view()`. **Adding BSA = restructuring these exactly the way comm-channels-services.routes.ts is structured** (componentless parent + index child + `basic-send` child).
- Feature folder anatomy (the thing to clone): `apps/admin-console/src/app/features/comm-channels-services/pages/voice-service/` — `voice-service.component.ts|.html`, `voice-service.permissions.ts`, `models/`, `services/voice-records-api.service.ts`, `validations/`, `create-wizard/`, `__tests__/*.spec.ts`. Mirrored (duplicated, adapted) at `apps/management-console/src/app/features/comms-hub/pages/voice-service/`. NOTE: voice was **duplicated per console**; the alternative repo pattern is a shared presentational feature in `libs/falcon/src/shared-features/*` (e.g. `comm-mkt-view`, `service-pricing-table` — see tsconfig aliases) with API services staying per-app (standing rule).

### 3b. Sidebar (host-shell owns it — a console cannot add its own sidebar item)

- Path constants: [CODE] `apps/host-shell/src/app/layout/layout.component.ts:73-74` (`admin_console_PATH_COMM_MGMT` = `.../comm-channels`, `admin_console_PATH_MARKETPLACE_APPLICATIONS` = `.../marketplace`), `:89-90` (mgmt `comm-mgmt`, `marketplace`). Comment at :72: "Renamed to match remote app.routes.ts slugs (avoid 404→fallback redirect via remote wildcard)" — **slug parity host↔console is load-bearing**.
- Parent-with-children precedent (what Marketplace needs for BSA): [CODE] `layout.component.ts:328-360` — admin "CommChannels & Services .Mng" NavItem with `children: [...]` incl. **Voice Service child :344-350** (`path: ${PATH}/voice-service`, `scope: AppRouteScope.AdminConsole`, `requiredUserTypes: [FALCON_USER]`). Mgmt twin `:361-394` adds `access: FalconAccess.managementConsole.services.view()` (:368).
- Marketplace items today (childless): admin [CODE] `layout.component.ts:395-404`; mgmt `:405-415` (access `managementConsole.services.view()` :412).
- Visibility machinery: `buildNavItems()` :144-165 → `applyAccessToNavItems()` :477-497 (PES `ensure()` then `can()` per item) → `applyItemAccess()` :499-512 hides item / nulls safePath on deny; `requiredUserTypes` + `hidden: isClient/isFalcon` do the user-type split.
- Labels are **hardcoded English strings** rendered raw ([CODE] `apps/host-shell/src/app/layout/components/sidebar/sidebar.component.html:68` `{{ item.label }}`); only registry-driven manifest items go through `labelKey | translate` (:94-111). `sidebar.*` keys exist in en.json but the static nav doesn't use them today.
- Registry-driven alternative (exists, unused): manifest `menu[]` → [CODE] `apps/host-shell/src/app/core/module-federation/menu-builder.service.ts:20-40` (`MenuBuilderService.load()`), merged additively at `layout.component.ts:126-133,170-175`. Only relevant for Recipe B.

### 3c. Breadcrumb / title

- [CODE] `apps/host-shell/src/app/layout/components/topbar/topbar.component.ts:157-172` — `rebuildBreadcrumb()` walks the ActivatedRoute chain collecting `snapshot.data['breadcrumb']`; last label becomes the page title. No registry file — just set `data: { breadcrumb: '...' }` on every route level (see every route file above).

## 4. PES gating — keys, resolution, where BSA registers

- Registry (single file): [CODE] `libs/falcon/src/shared-types/lib/constants/falcon-access.registry.ts` (396 lines, `FalconAccess` const).
  - App-enter keys used by the remote manifest + shell guard: `:109-110` `managementConsole.enter()` → `{action:'view', resource:'app.management-console'}`; `:209-210` `adminConsole.enter()` → `app.admin-console`.
  - Micro-app style keys: `:266-271` `microApps.mount(name)` → `resource: 'microapp.<normalized-name>'` (normalizer :274-281). This is where a **standalone remote** `basic-send-app` would key (`microapp.basic-send-app`) — the pattern already used by the inactive demo remotes in the manifest.
  - Feature-block sample to mimic (voice): `:62-74` `voiceRecord: { view/create/preview/delete/share/viewShared: (scope) => voiceRecordQuery(action, scope) }` + factory `:367-376` — `resource: `${scope}.voice-record`` (`sys` admin / `acc` mgmt), `ignoreExpression: true` for role-level UX flags. **A BSA block would be a sibling: `basicSend: { view/send/... }` with `${scope}.basic-send`.**
- Flag resolution: [CODE] `libs/falcon/src/core/lib/access-control/access-control.facade.ts:68-84` `resolveFlags(queries)` → `ensure()` (dedupe + POST pes/authorize/resources, in-flight collapse, session-fingerprint cache reset :42-53) → named boolean map; **fail-closed** (all-false on error).
- Per-feature permissions module precedent: [CODE] `apps/admin-console/src/app/features/comm-channels-services/pages/voice-service/voice-service.permissions.ts:27-55` — `deniedVoiceRecordFlags()` all-false baseline + `resolveVoiceRecordPermissions(access, scope)` calling `access.resolveFlags({ canView: FalconAccess.voiceRecord.view(scope), ... })`, spread over the denied baseline. Admin resolves `'sys'`, mgmt `'acc'` (mirror file under comms-hub). Tests: `__tests__/pes-gating.spec.ts` both consoles.
- Route/menu gates: [CODE] `libs/falcon/src/core/lib/access-control/shell-access.guard.ts:52` `shellAccessGuard` (CanActivate) + `:58` `shellAccessMatchGuard` (CanMatch, used on the host's dynamic remote routes) — both read `route.data['access']` (:80,:90). Sidebar item gating via `access:` key on NavItem (layout.component.ts §3b).

## 5. i18n

- ONE shared pair for the whole platform: [CODE] `libs/falcon/src/language/i18n/en.json` + `ar.json` — copied into **every** app bundle as `assets/i18n` via project.json assets globs ([CODE] `apps/admin-console/project.json:25-29`, `apps/management-console/project.json:27`, `apps/host-shell/project.json:29`).
- Key convention: top-level **camelCase feature namespaces** (45 today: `voiceRecords`, `voiceAccount`, `commsHubMgmt`, `marketplaceApps`, `commChannelsPages`, `contractsCostManagement`, `sidebar`, `common`, `validation`, ...), nested camelCase leaves (e.g. `voiceRecords.tabs.records`, `sidebar.commChannels`). BSA adds a `basicSend` top-level namespace in BOTH files.
- Loading: [CODE] `libs/falcon/src/language/lib/services/translate.service.ts:59-60` fetches from runtime path `/assets/i18n`; current language from `FalconLanguageFacade` — host impl [CODE] `apps/host-shell/falcon-facades/host-language.facade.ts:10-22` (localStorage key `lang`, default `en`). Bootstrap blocks on translations via [CODE] `libs/falcon/src/language/lib/translate.initializer.ts:11-16` `translateInitializerProvider` (wired in host `app.config.ts:136` and each console, e.g. admin `app.config.ts:56`).
- RTL: [CODE] `apps/host-shell/src/app/features/auth/login-layout/login-layout.component.ts:107` — `htmlEl.setAttribute('dir', code === 'ar' ? 'rtl' : 'ltr')` (the only `dir` writer found; direction is set at the document level when language switches on the login layout).

## 6. API service pattern (standing rule CONFIRMED: API services live in the console apps, not libs)

Two concrete precedents:
1. [CODE] `apps/admin-console/src/app/features/comm-channels-services/pages/voice-service/services/voice-records-api.service.ts` — `@Injectable({providedIn:'root'})`, injects `HttpService` from `@falcon` (:66), **relative base** `private readonly base = 'templates/voice-records'` (:67), every call passes `...useGateway()` (:83-87) so the interceptor prefixes the right gateway. Wire-DTO→UI mapping in `models/`, `catchError` fallbacks, `shareReplay` config cache.
2. Mirror: [CODE] `apps/management-console/src/app/features/comms-hub/pages/voice-service/services/voice-records-api.service.ts` (same service, Core-gateway side). (Contact-groups follows the same split: `apps/admin-console/src/app/features/contact-groups/` read-only SystemGateway vs mgmt full CRUD.)

Base-URL machinery:
- [CODE] `libs/falcon/src/shared-data-access/lib/runtime-config/runtime-api-config.ts:37` `APP_DEFAULT_GATEWAY` token; `:65-67` `provideAppDefaultGateway()`; `:130-139` `useGateway(gateway?)` sets `HttpContext` flags; `:118-123` `GATEWAY_PATH_MAP` → env keys.
- Per-app default: admin-console [CODE] `apps/admin-console/src/app/app.config.ts:76` `provideAppDefaultGateway(Gateway.SystemGateway)`; management-console [CODE] `apps/management-console/src/app/app.config.ts:71` `provideAppDefaultGateway(Gateway.CoreGateway)`.
- URL source: host-shell publishes `window.FalconRuntimeConfig` ([CODE] `apps/host-shell/src/app/app.config.ts:138` `exposeRuntimeConfigOnWindow`, values from [CODE] `apps/host-shell/src/environments/environment.ts:19-36` — baseURL, baseURLPes, baseURLCoreGateway :7038, baseURLSystemGateway :7256, baseURLChargingGateway, baseURLIdentityGateway); consoles read it back with build-time fallback ([CODE] `apps/admin-console/src/app/app.config.ts:68-75` `provideShellEnvFromWindow`).
- Interceptors: [CODE] `libs/falcon/src/shared-data-access/lib/interceptors/runtime-base-url.interceptor.ts:19,35,81` resolves specific-gateway → APP_DEFAULT_GATEWAY → session-user-type fallback (host-shell registers it WITHOUT a default gateway, `apps/host-shell/src/app/app.config.ts:139,160-164`). Auth Bearer attach + proactive-refresh: [CODE] `apps/host-shell/src/app/core/interceptors/request-interceptor.ts:34-75` (registered host `app.config.ts:151-155`). Under federation the host's root injector supplies the HTTP stack; the consoles' own app.config wiring exists for standalone `nx serve` ([CODE] admin `app.config.ts:34-36` comment).

## 7. Styling / tokens / dark mode

- Tailwind **v4**, PostCSS plugin: [CODE] `postcss.config.js:1-5` (`@tailwindcss/postcss`); root [CODE] `tailwind.config.js:9` is an intentionally EMPTY bridge (`module.exports = {}`) — all tokens live in CSS.
- Token SSOT: [CODE] `libs/falcon-theme/src/falcon-tailwind-tokens.css` — `@layer theme, base, falcon-base, falcon-overlay, utilities` (:19), `@import "tailwindcss"` (:21), `@custom-variant dark (&:where(.app-dark, .app-dark *))` (:25), then the `@theme` token block. Second token layer for the Stencil components: [CODE] `libs/falcon-ui-tokens/src/index.css` (+ dark overrides `libs/falcon-ui-tokens/src/themes/dark.css:11-15`).
- Per-app entry a new app must replicate: [CODE] `apps/admin-console/src/tailwind.css:1-27` — imports the two token files then declares `@source` scan paths (own app + `libs/falcon/src/shared-ui` + `libs/falcon-ui-core/src/{tailwind,angular-wrapper,components}`) and `@source not` excludes. Registered with `falcon-icons.css` + `styles.scss` in [CODE] `apps/admin-console/project.json:36-41`; fonts asset glob `:30-34`.
- Dark mode: **SHIPPED** (Phase B). `ThemeService` facade owns `<html class="app-dark">` + `data-theme` — [CODE] `apps/host-shell/src/app/app.config.ts:42-48,102-106` (`provideAppInitializer(() => ngInject(ThemeService))`, FOUC guard in `index.html`).
- Component mandate (memory rules confirmed in repo): UI must use `@falcon/ui-core/angular` wrappers around Stencil `falcon-*-tw` components; PrimeNG uninstalled; gate scripts `gate:token-naming-lint`, `gate:hardcoded-value-lint`, `gate:template-color-lint` etc. in `package.json` enforce token usage.

## 8. Testing

- Unit runner: **Vitest via `@nx/vitest:test`** per app ([CODE] `apps/admin-console/project.json:153-159`), config [CODE] `apps/admin-console/vite.config.mts` — `@analogjs/vite-plugin-angular` (with the `analogjs-router-optimization` plugin stripped, :22-26), `environment: 'jsdom'`, `setupFiles: ['src/test-setup.ts']`, include `{src,tests}/**/*.{test,spec}.*`, Stencil dist externalized (:49-56), worker `memoryLimit: '700MB'`. Workspace globbing: [CODE] `vitest.workspace.ts:1-4`.
- Memory note "admin-console vitest runner broken (2026-05-19)" is **STALE** — the 2026-05-29 Wave-8 fixes recorded in `vite.config.mts` repaired it, and voice-service specs exist and are referenced as green in later memory (2026-06-30/07-06).
- Spec organization: colocated `__tests__/` folders inside features — precedent [CODE] `apps/admin-console/src/app/features/comm-channels-services/pages/voice-service/__tests__/{voice-record-models.spec.ts,pes-gating.spec.ts}` (+ mgmt mirrors).
- E2E: **none** (no e2e project, no cypress/playwright deps). Runtime verification is done via the QA-web browser agent per memory.

---

# RECIPE — adding Basic Send

## RECIPE A (RECOMMENDED — matches PRD "submenu under Marketplace & Applications .Mng" and repo reality): in-console feature `basic-send`, no new app

Ordered checklist; every step cites the precedent it mimics.

1. **PES keys** — edit [CODE] `libs/falcon/src/shared-types/lib/constants/falcon-access.registry.ts`: add a `basicSend:` block beside `voiceRecord:` (mimic lines 62-74) + a `basicSendQuery(action, scope)` factory beside `voiceRecordQuery` (mimic lines 367-376) → resources `sys.basic-send` / `acc.basic-send`, `ignoreExpression: true`. (Backend PES must provision these rules — flag to backend, do not author.)
2. **Admin feature folder** — create `apps/admin-console/src/app/features/marketplace-applications/pages/basic-send/` with `basic-send.component.ts|.html`, `basic-send.permissions.ts` (mimic [CODE] `.../voice-service/voice-service.permissions.ts:27-55` — denied-baseline + `resolveFlags`, scope `'sys'`), `models/`, `services/`, `validations/`, `__tests__/`. Mimic the voice-service folder anatomy 1:1.
3. **Admin routes** — edit [CODE] `apps/admin-console/src/app/features/marketplace-applications/marketplace-applications.routes.ts` (currently flat, lines 12-25): restructure to componentless parent + children exactly like [CODE] `comm-channels-services.routes.ts:14-53` — index child `path:''` = existing `MarketplaceApplicationsMngComponent`, new child `{ path: 'basic-send', loadComponent: () => import('./pages/basic-send/basic-send.component').then(m => m.MarketplaceBasicSendComponent), data: { breadcrumb: 'Basic Send' } }`. Keep `providers: [MarketplacePageStateService]` on the parent.
4. **Mgmt feature folder** — create `apps/management-console/src/app/features/marketplace-applications/pages/basic-send/` (permissions scope `'acc'`), mimicking the mgmt voice mirror `apps/management-console/src/app/features/comms-hub/pages/voice-service/`.
5. **Mgmt routes** — edit [CODE] `apps/management-console/src/app/features/marketplace-applications/marketplace-applications.routes.ts:19-29`: same parent+children restructure, but keep the PES gate on the parent exactly like [CODE] `comms-hub.routes.ts:24-33` (`canActivate: [shellAccessGuard]`, `data.access = FalconAccess.managementConsole.services.view()` — or a dedicated `basicSend.view('acc')` on the child if product wants finer gating).
6. **Sidebar** — edit [CODE] `apps/host-shell/src/app/layout/layout.component.ts`: give the two Marketplace NavItems (admin :395-404, mgmt :405-415) a `children: [...]` array with a `Basic Send` item at `path: ${PATH_MARKETPLACE_APPLICATIONS}/basic-send`, copying the CommChannels children shape verbatim (admin child precedent :344-350 "Voice Service"; mgmt child precedent :377-383, plus `access:` on the mgmt entry like :368/:412). Slug MUST equal the route slug (comment at :72 — wrong slug = dead click into the remote `**` redirect).
7. **i18n** — edit [CODE] `libs/falcon/src/language/i18n/en.json` + `ar.json`: add top-level `basicSend` namespace (mimic `voiceRecords`). Sidebar label itself is a literal string in layout.component.ts (repo convention today); page copy uses `basicSend.*` keys via `| translate`.
8. **API service** — `apps/admin-console/.../pages/basic-send/services/basic-send-api.service.ts` (and mgmt mirror): `HttpService` + relative base + `...useGateway()` per call, mimicking [CODE] `voice-records-api.service.ts:64-87`. Gateways resolve automatically (admin→SystemGateway `app.config.ts:76`, mgmt→CoreGateway `app.config.ts:71`). NO service in `libs/` (standing rule; if UI is shared, put the presentational component in `libs/falcon/src/shared-features/basic-send/` with an injected gateway token, like `comm-mkt-view` / the `USER_DETAILS_GATEWAY` port pattern in host `app.config.ts:115-120`).
9. **Tests** — `__tests__/basic-send-models.spec.ts` + `__tests__/pes-gating.spec.ts` per console (mimic voice `__tests__`); run `nx test admin-console` / `nx test management-console` (vitest), build gates `npm run build:admin-console:dev` etc.
10. **Falcon components + tokens** — build the page from `@falcon/ui-core/angular` wrappers only; Tailwind utilities come from the existing per-app `tailwind.css` scan (no config change needed since the feature lives under `src/`, already `@source "./"`).

## RECIPE B (only if BSA must be an independently deployable remote — mounts at top-level `/#/basic-send-app`, NOT inside the consoles)

1. **Scaffold** `apps/basic-send-app/` cloning `apps/management-console/` skeleton: `src/main.ts` (dynamic `import('./bootstrap')` — [CODE] `apps/admin-console/src/main.ts`), `src/bootstrap.ts`, `src/app/app.config.ts` (mimic [CODE] `apps/admin-console/src/app/app.config.ts`: zoneless, `provideFalconFallbackFacades()` from `mocks/falcon-fallback.providers.ts`, `translateInitializerProvider`, `provideShellEnvFromWindow`, `provideAppDefaultGateway(...)`, `RuntimeBaseUrlInterceptor`), `src/app/app.routes.ts` ending with `export const routes = appRoutes; export default appRoutes;` ([CODE] admin `app.routes.ts:143-145`), `src/app/remote-entry/entry.routes.ts` ([CODE] admin remote-entry, 4 lines), `src/tailwind.css` + `src/styles.scss` + `src/test-setup.ts` + `vite.config.mts` (mimic admin).
2. **Federation config** — `apps/basic-send-app/module-federation.config.ts`: `name: 'basic-send-app'`, `exposes: { './basic-send-app': join(__dirname, 'src/app/remote-entry/entry.routes.ts') }`, copy the share function + `additionalShared` VERBATIM from [CODE] `apps/management-console/module-federation.config.ts:16-130` ("KEEP IN SYNC" comment is binding).
3. **Webpack configs** — copy [CODE] `apps/admin-console/webpack.config.ts` + `webpack.prod.config.ts` unchanged (they are generic wrappers).
4. **project.json** — mimic [CODE] `apps/admin-console/project.json`: `@nx/angular:webpack-browser` build with `customWebpackConfig` + the i18n/fonts asset globs (:20-35) + styles (:36-41); `@nx/angular:module-federation-dev-server` serve on a FREE port (4302; 4200/4204/4301 taken), `test` via `@nx/vitest:test`.
5. **Manifest entries** — add a `"basic-send-app"` object to ALL FOUR manifests [CODE] `apps/host-shell/src/assets/module-federation.manifest.{dev,staging,prod,}.json`, mimicking the management-console entry (dev json :2-16): `remoteEntry: "http://localhost:4302/remoteEntry.mjs"`, `exposedModule: "./basic-send-app"`, `routePath: "basic-send-app"`, `entryType: "remoteEntry"`, `exposeType: "routes"`, `active: true`, `requiredAccess: [{ action: "view", resource: "microapp.basic-send-app" }]` (microapp key per [CODE] `falcon-access.registry.ts:266-271`; or an `app.basic-send-app` resource if PES provisions it like the consoles), `localDev: { projectName: "basic-send-app", port: 4302 }`. **No host-shell code change is needed for routing** — `RemoteRouteService` + `start-dynamic-remotes.mjs` pick it up from the manifest.
6. **Sidebar** — either (a) add a hardcoded NavItem in [CODE] `layout.component.ts` like every existing entry, or (b) FIRST USE of the registry path: add `menu: [{ id, labelKey: 'basicSend.nav', section, route }]` to the manifest entry — consumed by [CODE] `menu-builder.service.ts:20-40` + `layout.component.ts:126-133` with `labelKey | translate` rendering.
7. **PES** — provision `microapp.basic-send-app` view rule in PES (backend task); the host route is auto-guarded by `shellAccessMatchGuard` from `requiredAccess` ([CODE] `remote-route.service.ts:197-201`).
8. **i18n / tokens / tests** — same shared en/ar.json namespace, same tailwind.css pattern, same vitest wiring as Recipe A steps 7/9/10.

## Sanity notes for the PRD architecture
- Console remotes expose **routes**, never components, and consoles re-export `app.routes` — BSA screens inside a console are plain Angular lazy routes; no federation API is involved at feature level.
- `data.breadcrumb` is the only title/breadcrumb registry; there is no separate registry file.
- Everything user-visible must come from the Falcon UI library (`@falcon/ui-core/angular`), data tables default page size 10, dd-MMM-yyyy dates (standing rules, all confirmed live in this codebase).
- Backend endpoints for BSA are consumed through the gateways (`useGateway()`); FE never talks to a micro-service directly and never hardcodes hosts (env → `window.FalconRuntimeConfig`).
