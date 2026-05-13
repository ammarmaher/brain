# Workspace Topology — falcon-web-platform-ui

**Active source:** `C:\Falcon\Falcon\falcon-web-platform-ui`
**Nx:** 22.7.1 — **Angular:** 21.2.9 (zoneless) — **Tailwind:** v4 — **Stencil:** core (custom-elements + React/Vue wrappers)

---

## Apps (3 active)

All three are Angular standalone-bootstrap, `provideZonelessChangeDetection()`, webpack-browser executor with custom MF webpack.

| App | Path | Port | Role | Default Gateway |
|---|---|---|---|---|
| `host-shell` | `apps/host-shell/` | **4200** | MF host — loads admin + management remotes via runtime manifest. HashLocationStrategy. Owns auth + interceptors + facade composition root. | none (per-route routing fall-back) |
| `admin-console` | `apps/admin-console/` | **4204** | MF remote (`name: admin-console`, `exposes: ./admin-console → entry.routes.ts`). Standalone-dev uses `provideFalconFallbackFacades()`. | `Gateway.SystemGateway` |
| `management-console` | `apps/management-console/` | **4301** | MF remote (`name: management-console`, `exposes: ./management-console → entry.routes.ts`). Standalone-dev uses `provideFalconFallbackFacades()`. | `Gateway.CoreGateway` |

### Manifest declares 4 remotes (only 2 active)

`apps/host-shell/src/assets/module-federation.manifest.json`:

| key | name | remoteEntry | exposedModule | routePath | active | exposeType | requiredAccess |
|---|---|---|---|---|---|---|---|
| `admin-console` | `admin_console` | `http://localhost:4204/remoteEntry.mjs` | `./admin-console` | `admin-console` | ✓ | routes | `view app.admin-console` |
| `management-console` | `management_console` | `http://localhost:4301/remoteEntry.mjs` | `./management-console` | `management-console` | ✓ | routes | `view app.management-console` |
| `demo-app` | `External-app` | `https://falconhub.space/remotes/demo-app/remoteEntry.js` | `./users` | `user-settings` | ✗ | component | `view microapp.user-settings` |
| `user-app` | `mfe-app` | `https://falconhub.space/remotes/user-app/remoteEntry.js` | `./survey` | `survey-container` | ✗ | module | `view microapp.survey-container` |

Prod variant `module-federation.manifest.prod.json` rewrites the `remoteEntry` URLs to `https://falconhub.space/remotes/...` (replacement is wired via `fileReplacements` in `apps/host-shell/project.json`).

---

## Libs (9 first-class libraries)

`tsconfig.base.json:16-71` declares the path aliases. Nx scope tags are mostly empty (only `falcon-ui-core` carries `scope:falcon-ui-core`).

| Lib | Alias(es) | Path | Purpose |
|---|---|---|---|
| `falcon` | `@falcon` | `libs/falcon/src/index.ts` | The Angular barrel. 7 sub-folders × `export *`. Re-exports core (session/guards/access), language (translate service + pipe + initializer), shared-ui (49 Angular wrappers + 7 legacy bespoke), shared-data-access (HTTP), shared-types (enums + models + constants), shared-utils (validators + utils). Bridges Stencil wrappers from `@falcon/ui-core/angular` into the legacy `@falcon` import path. |
| `falcon-ui-core` | `@falcon/ui-core`, `@falcon/ui-core/loader`, `@falcon/ui-core/tailwind`, `@falcon/ui-core/angular`, `@falcon/ui-core/angular/*`, `@falcon/ui-core/tailwind/*`, `@falcon/ui-core/types` | `libs/falcon-ui-core/src/` | Cross-framework Stencil library. 94 Stencil component folders (47 Shadow `<falcon-X>` + 47 Light `<falcon-X-tw>` + 1 Light-only `falcon-organization-hierarchy-tree-tw`). Angular wrappers at `src/angular-wrapper/components/<name>/`. React wrappers via Stencil reactOutputTarget. Vue wrappers via `generate-vue-proxies.cjs`. |
| `falcon-ui-tokens` | `@falcon/ui-tokens/*` | `libs/falcon-ui-tokens/src/` | Per-component CSS design-token files. Layered: `primitives → semantic → themes → density → rtl → components`. `index.css` imports 46 component-scoped token files. Pure CSS — no TS exports. |
| `falcon-theme` | `@falcon/theme`, `@falcon/theme/tokens`, `@falcon/theme/*` | `libs/falcon-theme/src/` | Tailwind v4 `@theme` SSOT (`falcon-tailwind-tokens.css` = ~264 tokens). Falcon icon font + `assets/fonts/`. `tokens.ts` mirrors the CSS tokens for TS consumers (216 keys per generated header). |
| `falcon-studio` | `@falcon/studio` | `libs/falcon-studio/src/` | Theme/component customisation studio. **Hidden-but-kept (Wave 2 v3.1)** — Tailwind doesn't scan it, host-shell route is removed. Existence noted, not deeply audited. |
| `falcon-ui-react` | `@falcon/ui-react` | `libs/falcon-ui-react/src/` | React wrappers auto-emitted by `stencil.config.ts:44-47` (`reactOutputTarget`). |
| `falcon-ui-vue` | `@falcon/ui-vue` | `libs/falcon-ui-vue/src/` | Vue 3 wrappers via `libs/falcon-ui-core/generate-vue-proxies.cjs`. |
| `falcon-ui-showcase-data` | `@falcon/ui-showcase-data`, `@falcon/ui-showcase-data/docs/*` | `libs/falcon-ui-showcase-data/src/` | Registry of 28 components + 28 MD docs. Powers `/falcon-ui-showcase` in host-shell. |
| `sdk` | `@falcon/sdk` | `libs/sdk/src/` | Cross-shell facade tokens + `provideFalconFacades({ auth, theme, language, notifier, context })`. Apps register concrete impls (host) or mocks (remotes). |

### Library file conventions

- Every lib has `project.json` (Nx), `tsconfig.json`, `tsconfig.lib.json`, and optionally `package.json`.
- `falcon` is one Nx library with internal sub-folders that map to public surfaces. Each sub-folder has its own `index.ts` re-exported from the root `libs/falcon/src/index.ts`.
- `falcon-ui-core` is one Nx library with three sibling output surfaces:
  - `components/` — 94 Stencil tag folders (Shadow + Light pairs).
  - `angular-wrapper/components/` — 49 Angular CVA wrappers.
  - `tailwind/` — cross-framework Tailwind class helpers (`falconXClasses()` functions used by Light DOM tags + the `useTailwind=true` Angular path).
- `falcon-ui-tokens` has 6 layered folders: `primitives/`, `semantic/`, `themes/`, `density/`, `rtl/`, `components/`. The `components/` folder has 1 `.tokens.css` per Stencil component (~46 files).

---

## Demos folder (excluded from production)

`demos/` lives at workspace root but **explicitly skipped** by Tailwind v4 `@source not` directives and Nx tag conventions. Per the standing rule (`feedback_v02_theme_adopted.md` + `project_falcon_cross_framework_demos_inside_workspace.md`), demo apps are NOT factored into bundle calculations.

Active `polishing-v0.4` does NOT have `apps/demo/{angular,react,vue}` — these were planned but the demos surface verified is `demos/angular-playground/` + `demos/component-docs/` only.

---

## App-internal structure

### `apps/host-shell/src/`

```
host-shell/src/
├── app/
│   ├── app.ts                       Root component
│   ├── app.config.ts                ApplicationConfig — facades, interceptors, env config, MF manifest provider
│   ├── app.routes.ts                Top-level routes (LayoutComponent + auth + preview + showcase + playground)
│   ├── app.html / app.css           Root template (delegates to LayoutComponent)
│   ├── core/
│   │   ├── auth/                    auth.service.ts, auth-api.service.ts, token-storage.service.ts, auth.models.ts
│   │   ├── guards/                  auth.guard.ts (functional CanActivateFn)
│   │   ├── interceptors/            request-interceptor.ts + response-interceptor.ts (DI-based)
│   │   ├── module-federation/       remote-manifest.types.ts + json-file-remote-manifest.provider.ts + api-remote-manifest.provider.ts + mf-contract.ts + mf-diagnostic.service.ts + README.md
│   │   └── services/                prime-ng-theme.service.ts (legacy name; now theme + RTL sync), remote-route.service.ts (Wave-8 ACTIVE), remote-config.ts, translate.initializer.ts
│   ├── features/                    auth/, dashboard/, error/, falcon-ui-showcase/, not-found/, unauthorized/
│   ├── layout/                      LayoutComponent + chrome (sidebar/, topbar/, model/)
│   ├── playground/                  playground.page.* (auth-free Falcon UI lab)
│   ├── preview-page.component.ts    Visual-test preview
│   ├── preview-shell.component.ts   Visual-test preview shell
│   ├── remote-config.ts             (older sibling of core/services/remote-config.ts — note: 2 files)
│   └── remote-route.service.ts      (older sibling — DEAD CODE; bootstrap.ts uses core/services/remote-route.service.ts)
├── assets/
│   ├── module-federation.manifest.json + .prod.json
│   ├── component-docs/, falcon-icon/, font-awesome/, images/
├── bootstrap.ts                     Awaits remoteRouteService.reloadRemotes() BEFORE router.initialNavigation()
├── main.ts                          dynamic import('./bootstrap') for MF async boundary
├── falcon-facades/                  host-{auth,theme,language,notifier,context}.facade.ts
└── falcon-sdk/                      host-window-sdk.bridge.ts
```

### `apps/admin-console/src/`

```
admin-console/src/
├── app/
│   ├── app.config.ts                Zoneless + animationsAsync + provideFalconFallbackFacades + system-gateway default
│   ├── app.routes.ts                Empty root with redirect → organization-hierarchy + organization-hierarchy-page
│   ├── features/
│   │   ├── _research-port-plan.md   (planning doc)
│   │   ├── organization-hierarchy/  (uses the one-file-per-type-folder convention)
│   │   │   ├── organization-hierarchy.routes.ts
│   │   │   ├── components/          organization-hierarchy-menu.component.* + skeleton/ + tab-components/ + wizard-components/
│   │   │   ├── models/models.ts
│   │   │   ├── services/            services.ts (HTTP) + hierarchy-page-state.service.ts (signal state) + mock-applications.ts + mock-tree.ts + validation-messages.ts + validators.ts
│   │   │   ├── resolvers/resolvers.ts
│   │   │   └── guards/guards.ts
│   │   └── organization-hierarchy-page/
│   │       ├── organization-hierarchy-page.routes.ts
│   │       ├── components/
│   │       ├── models/models.ts
│   │       └── services/services.ts + hierarchy-page-state.service.ts
│   └── remote-entry/entry.routes.ts (`remoteRoutes = routes; export default routes;`)
├── mocks/falcon-fallback.providers.ts (MockAuth / MockTheme / MockLanguage / MockNotifier / MockContextFacade)
├── styles.scss
└── tailwind.css
```

### `apps/management-console/src/`

```
management-console/src/
├── app/
│   ├── app.config.ts                Zoneless (no animationsAsync — note divergence) + provideFalconFallbackFacades + core-gateway default
│   ├── app.routes.ts                Empty root protected by managementConsoleGuard, child for organization-hierarchy-page
│   ├── features/organization-hierarchy-page/
│   │   ├── organization-hierarchy-page.routes.ts
│   │   ├── components/, models/, services/, resolvers/, guards/
│   └── remote-entry/entry.routes.ts
├── mocks/falcon-fallback.providers.ts
├── styles.scss
└── tailwind.css
```

**Key divergence:** management-console's `app.config.ts` does NOT register `provideAnimationsAsync()` even though it sets up zoneless. Host-shell + admin-console both register it. This is either intentional (mgmt features don't currently use animations) or a missing entry — flag to verify.

---

## Tailwind entrypoint per app

Each app's `apps/<app>/src/tailwind.css` (host-shell example is 2399 lines) declares:

1. `@import "../../../libs/falcon-theme/src/falcon-tailwind-tokens.css"` — the `@theme` SSOT.
2. `@import "../../../libs/falcon-ui-tokens/src/index.css"` — 46 per-component token files.
3. `@source` paths the Oxide scanner crawls (`./`, `libs/falcon/src/shared-ui`, `libs/falcon-ui-core/src/{tailwind,angular-wrapper,components}`).
4. `@source not` exclusions (`node_modules`, `dist`, `.angular`, `.nx`, `demos`, `**/*.spec.ts`, `**/*.e2e.ts`, `**/*.md`).
5. `@source inline(...)` safelists for runtime-built class strings (~2000 lines in host-shell).
6. Layer order: `@layer theme, base, falcon-base, utilities;`
7. Dark mode: `@custom-variant dark (&:where(.app-dark, .app-dark *))`.

The `libs/falcon-studio/` `@source` directive is **commented out** in `apps/host-shell/src/tailwind.css:18-20` (Wave 2 v3.1 hide-but-keep policy).

---

## App-level styles

Each app has BOTH `tailwind.css` (utilities, Oxide-scanned) AND `styles.scss` (legacy minimal carry-over). `apps/<app>/project.json` registers both in the `styles` build option plus `libs/falcon-theme/src/styles/falcon-icons.css`.

**No component-level `*.scss` / `*.component.css` with declared rules** (verified — see `FORBIDDEN_PATTERNS_OBSERVED.md`). A few SCSS files exist as empty placeholders next to legacy bespoke components in `libs/falcon/src/shared-ui/lib/components/`.

---

## Karma / Vitest mix

- **admin-console + management-console** use Vitest (via `@nx/vitest:test` + `@analogjs/vitest-angular`).
- **host-shell** retains a legacy `karma.conf.js` referenced from `apps/host-shell/project.json` — carryover from before the Vitest migration. Should be migrated.
