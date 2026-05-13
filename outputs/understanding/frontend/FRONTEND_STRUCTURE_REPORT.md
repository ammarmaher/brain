# Frontend Structure Report — Conventions Observed in `falcon-web-platform-ui`

## Folder structure conventions

### Per-feature pattern (matches memory `feedback_folder_structure_pattern.md`)

Verified inside `apps/admin-console/src/app/features/organization-hierarchy/`:

- `services/services.ts` — one file per type-folder collecting all classes
- `services/hierarchy-page-state.service.ts` — also coexists alongside `services.ts` (signal-based state services kept as standalone files when large)
- `resolvers/resolvers.ts` — single file with all resolvers
- `guards/guards.ts` — single file with all guards
- `components/` — sub-feature components nested deeper (e.g. `components/wizard-components/add-client-wizard/`)
- `directives/` (used in `libs/falcon/src/shared-ui/lib/directives/`)
- `models/models.ts` is the conventional companion (memory rule confirms this)

The one-file-per-type-folder rule is followed where possible; large signal-state services may live as their own files to keep file size manageable.

### App structure (top-level `apps/<app>/src/app/`)

| File / folder | Purpose |
|---|---|
| `app.ts` (host-shell) | Root Angular component |
| `app.html`, `app.css` | Root template + styles (host-shell only) |
| `app.config.ts` | `ApplicationConfig` — declares providers (`provideZonelessChangeDetection()`, `provideRouter()`, `provideHttpClient(withFetch(), withInterceptorsFromDi())`, `provideAnimationsAsync()`, facade provider, env config, interceptors) |
| `app.routes.ts` | Top-level route table — exports `appRoutes`, `routes`, `default` (the dual export is required by MF: remote-route.service.ts looks for any of them) |
| `core/` | App-level cross-cutting concerns: guards, interceptors, services, module-federation (host-shell), prime-ng-theme.service.ts (legacy) |
| `features/` | Domain features as folders, each with its own `<feature>.routes.ts` |
| `layout/` (host-shell) | The shared chrome `LayoutComponent` |
| `playground/` (host-shell) | Auth-free Falcon UI lab page |
| `preview-page.component.ts`, `preview-shell.component.ts` | Visual-verification preview routes |
| `remote-entry/` (admin-console, management-console) | MF expose entry — `entry.routes.ts` |

### Lib structure (`libs/falcon/src/`)

`libs/falcon` is one Nx library subdivided into 7 functional folders:

- `core/` — session, user-type strings, guards, route-access tokens, runtime config, HTTP base URL, `provideShellEnvConfig`, `RuntimeBaseUrlInterceptor`, `translateInitializerProvider`
- `language/` — `TranslateService`, `TranslatePipe`, i18n JSON assets at `language/i18n/`
- `shared-ui/` — legacy bespoke Angular components + Angular wrapper re-exports from `@falcon/ui-core/angular`
- `shared-data-access/` — HTTP services
- `shared-types/` — common interfaces / enums (`UserType`, `Gateway`, `PricingType`, etc.)
- `shared-utils/` — validators + utility functions

A separate `libs/sdk` provides facade tokens (`FALCON_AUTH`, `provideFalconFacades`).

---

## Standalone components

- The Nx generator config locks `style: "css"` and `unitTestRunner: "vitest-analog"`, no module generation by default (`@nx/angular:library` has `unitTestRunner: "none"`).
- Every Angular component sampled (Falcon wrappers, feature components, login-layout, hierarchy components) is **standalone** with `standalone: true` and explicit `imports: []`. No NgModules are used for new components.
- `CUSTOM_ELEMENTS_SCHEMA` is added on Angular wrappers that render Stencil custom elements (e.g. `FalconAngularInputComponent`).

---

## Signals usage

Confirmed across the codebase:

- `signal()` — used in `FalconAngularInputComponent` for internal `value` and `disabled` state.
- Signal-based services exist (e.g. `hierarchy-page-state.service.ts`) — memory confirms a signal-state pattern for feature state.
- `inject()` — used widely in DI (40+ occurrences in `apps/admin-console/src` alone for signal + inject patterns).
- `ChangeDetectionStrategy.OnPush` — applied on every component sampled. The author's comment in `falcon-input.component.ts:106-108` explicitly explains why methods (not `computed()`) are used: methods re-run on every CD cycle (which OnPush triggers when `@Input` ref changes), while `computed()` would only track signal deps, not `@Input` props.
- `linkedSignal()` and `resource()` — not observed in the sampled files, but the codebase is large; some signal services may use them.

---

## Routing patterns

- **All feature modules use `loadChildren: () => import('./...feature.routes')`** — verified in `apps/admin-console/src/app/app.routes.ts:9-10`, `apps/management-console/src/app/app.routes.ts:11-15`, host-shell auth route, host-shell falcon-ui-showcase route.
- **Standalone `loadComponent`** — used for single-component routes (preview pages, playground page).
- **Module Federation route lazy-loading** — `loadRemoteModule('admin_console', './admin-console')` re-imports the remote routes; host-shell's `RemoteRouteService.reloadRemotes()` runs BEFORE `router.initialNavigation()` via `withDisabledInitialNavigation()` — this prevents the catch-all `**` route from firing before remote routes register, fixing the refresh-on-remote-route redirect bug.
- **Guards** — `authGuard` (host-shell own), `shellPrimeAccessGuard` from `@falcon`, `managementConsoleGuard` from `@falcon`. `adminConsoleGuard` is commented out (`apps/admin-console/src/app/app.routes.ts:7`).
- **HashLocationStrategy** — host-shell uses hash routing (`provideRouter(appRoutes, withDisabledInitialNavigation())` + `{provide: LocationStrategy, useClass: HashLocationStrategy}`).
- **Breadcrumb data** — `data: { breadcrumb: 'Unauthorized' }` style metadata attached to routes.

---

## Control-flow / template patterns

- **New control flow** — `@if`, `@for`, `@switch` are used everywhere. **Zero `*ngIf` or `*ngFor` matches across `apps/`.** (Grepped: 52 `@if/@for/@switch` matches across the 10 most-recent HTML files; 0 legacy `*ngIf/*ngFor`.)
- Templates rely on Tailwind v4 utility classes — no SCSS component styles, no PrimeNG widgets.

---

## OAuth2 / OIDC integration

Memory note `feedback_frontend_auth_identity_service.md` is the standing rule: **the frontend never calls Zitadel directly**. All auth flows go through the Falcon Identity service at `auth.falconhub.space/api/`.

Verified in `apps/host-shell/src/app/app.config.ts`:

- `HostAuthFacade` injected through `provideFalconFacades({ auth: HostAuthFacade, ... })`.
- `SessionProvider` (from `@falcon`) is the cross-app session source.
- `RequestInterceptor`, `RuntimeBaseUrlInterceptor`, `ResponseInterceptor` are registered as `HTTP_INTERCEPTORS` — they handle token attachment, base-URL rewriting per gateway, and centralised error response handling.
- `translateInitializerProvider` from `@falcon/language` runs as an `APP_INITIALIZER` so translations load before the app renders.

`HostAuthFacade`, `HostThemeFacade`, `HostLanguageFacade`, `HostNotifierFacade`, `HostContextFacade` are concrete implementations injected at host-shell composition root — admin-console and management-console use `provideFalconFallbackFacades()` (from `apps/admin-console/mocks/`) for standalone-dev mode.

---

## Module Federation wiring

| File | Role |
|---|---|
| `apps/host-shell/module-federation.config.ts` | Host config — declares `remotes: []` (empty: filled dynamically via manifest) + the shared-deps function + `additionalShared` for `@falcon` and `@falcon/sdk`. |
| `apps/admin-console/module-federation.config.ts` | Remote config — `exposes: { './admin-console': 'src/app/remote-entry/entry.routes.ts' }`. |
| `apps/management-console/module-federation.config.ts` | Remote config — `exposes: { './management-console': 'src/app/remote-entry/entry.routes.ts' }`. |
| `apps/host-shell/src/assets/module-federation.manifest.json` | Dev-mode remote URL list. |
| `apps/host-shell/src/assets/module-federation.manifest.prod.json` | Prod-mode replacement (via `fileReplacements` in `project.json`). |
| `apps/host-shell/src/app/core/module-federation/remote-manifest.types.ts` | `REMOTE_MANIFEST_PROVIDER` injection token. Wave 8 abstraction lets the host swap between `JsonFileRemoteManifestProvider` and a future `ApiRemoteManifestProvider`. |
| `apps/host-shell/src/app/core/module-federation/json-file-remote-manifest.provider.ts` | Default provider — reads the JSON manifest asset. |
| `apps/host-shell/src/app/remote-route.service.ts` | Dynamically loads remote routes via `loadRemoteModule()` and feeds them to the router. |
| `apps/host-shell/src/bootstrap.ts:46-50` | `await remoteRouteService.reloadRemotes()` BEFORE `router.initialNavigation()`. |

Webpack custom config files (`apps/<app>/webpack.config.ts` + `webpack.prod.config.ts`) wrap each Angular build with the MF plugin.

The host webpack chooses `executor: "@nx/angular:module-federation-dev-server"` for `serve`, with `devRemotes: ["admin-console", "management-console"]`.

---

## Stencil + dual-render pipeline

`libs/falcon-ui-core/stencil.config.ts`:

- `taskQueue: 'immediate'` — runs `writeTask` synchronously so `@State` changes trigger re-renders even when `document.visibilityState === 'hidden'` (preview / test rigs).
- `maxConcurrentWorkers: 1` — serialises PostCSS workers as a Windows EMFILE workaround.
- Output targets: `dist` (legacy ESM loader), `dist-custom-elements` (the eager-tree-shakeable target), `docs-readme` (auto-generated per-component `readme.md`), `reactOutputTarget` (emits React wrappers into `libs/falcon-ui-react/src/`).
- PostCSS chain: `postcss-import` (skip `tailwindcss/*` urls — let `@tailwindcss/postcss` handle Tailwind v4 layer imports), `@tailwindcss/postcss` (v4 Oxide native scanner), `autoprefixer`.
- Vue wrappers come from a separate `libs/falcon-ui-core/generate-vue-proxies.cjs` script (not from Stencil's output target).

**Dual-render pattern:**

- Shadow DOM tag: `<falcon-X>` with `shadow: true` — every visual value reads from `--falcon-X-*` CSS variables, allowing the Studio to mutate tokens at runtime and update Shadow + Light renders identically.
- Light DOM tag: `<falcon-X-tw>` with `shadow: false` — renders into the consumer's Light DOM so the consumer's Tailwind v4 utilities cascade in. Internally calls the same `falconXClasses()` helpers from `libs/falcon-ui-core/src/tailwind/` that the Angular / React / Vue wrappers also call — keeps the Tailwind output identical across frameworks.

Each Angular wrapper at `libs/falcon-ui-core/src/angular-wrapper/components/<name>/` has a `useTailwind` `@Input` (default `true`) that toggles which tag the template renders (Stencil `<falcon-X>` or `<falcon-X-tw>` with cross-framework Tailwind helpers). Two render paths, one prop surface.

---

## Tailwind v4 entrypoint per app

`apps/<app>/src/tailwind.css` (host-shell example, 2399 lines) declares:

1. `@import "../../../libs/falcon-theme/src/falcon-tailwind-tokens.css"` — the SSOT `@theme` block.
2. `@import "../../../libs/falcon-ui-tokens/src/index.css"` — per-component token files.
3. `@source` paths that Tailwind v4's Oxide scanner crawls for utility class names (`./`, `libs/falcon/src/shared-ui`, `libs/falcon-ui-core/src/tailwind`, `libs/falcon-ui-core/src/angular-wrapper`, `libs/falcon-ui-core/src/components`).
4. `@source not` exclusions (`node_modules`, `dist`, `.angular`, `.nx`, `demos`, `**/*.spec.ts`, `**/*.e2e.ts`, `**/*.md`) — prevents the scanner seeding orphan classes from build outputs and markdown audits.
5. ~2000 lines of `@source inline(...)` safelists — Angular `[class.X]` bindings, dynamic class concatenations in `tailwind-classes.ts` helpers, error-state colour utilities, hover-state utilities, etc. Tailwind v4's Oxide scanner can miss any class string built at runtime, hence the explicit list.

---

## App-level styles

Each app has both `tailwind.css` (utilities, scanned) and `styles.scss` (legacy app-level CSS — kept minimal). `apps/<app>/project.json` registers both in `styles` plus `libs/falcon-theme/src/styles/falcon-icons.css`.

**No PrimeNG bundled.** Wave PR-8 uninstalled all PrimeNG packages physically; the MF share-map branches for `primeng/*` / `primeicons` were deleted. The 122 `pi pi-*` icons were replaced via a vendored Falcon icon font (`libs/falcon-theme/src/styles/falcon-icons.css` + `assets/fonts/`).

**No component `*.scss` / `*.component.css`.** Tailwind utilities in templates only, per memory rules (`feedback_no_inline_styles_tokens_only.md`, `feedback_tailwind_grid_first.md`, `feedback_shadow_is_token_ssot.md`).

---

## Deviations + observations

1. **`falcon-input.component.css` exists** on a few Angular wrappers (e.g. `libs/falcon-ui-core/src/angular-wrapper/components/falcon-input/falcon-input.component.css`). These files are usually empty placeholders — Angular needs a `styleUrl` reference even if the file is blank — but a closer audit could confirm zero rules across all wrappers.
2. **`styles.scss` per app** — still kept but minimal. Memory rule says Tailwind utilities only; the SCSS files appear to be near-empty legacy carry-overs.
3. **`adminConsoleGuard` is commented out** in `apps/admin-console/src/app/app.routes.ts:7`. This is a known deviation — explicit code comment says "Protect all routes under admin-console" but the call is disabled. Likely intentional during the polishing-v0.4 work, but should be flagged for re-enabling before prod.
4. **`falcon-studio` lib is hidden-but-kept** — Tailwind `@source` directive for it is commented out in `apps/host-shell/src/tailwind.css:18-20`. The Studio route is removed from `apps/host-shell/src/app/app.routes.ts:38-42`. Memory traces this back to Wave 2 v3.1.
5. **`PrimeNGThemeService`** still appears in `apps/host-shell/src/app/app.config.ts:29,58`. The class name is legacy — its current job is theme + RTL sync after the PrimeNG removal. Worth a rename pass.
6. **`HashLocationStrategy` on host-shell** — slightly unusual choice. Likely chosen to keep deep links stable across MF route swaps; worth verifying with the team.
7. **`legacy-peer-deps` flag** — memory notes `.npmrc legacy-peer-deps` should be reviewed in Tier 1 follow-ups after the v3.1 night shift.
8. **No PWA / SSR / Universal observed** — apps run as a plain Angular client-side bundle inside webpack MF.
9. **Linter** — `eslint.config.mjs` per app (flat config), with `angular-eslint` 21.2.0 and `@typescript-eslint/utils` for custom rules. Wave PR-8 added a live-fire flat block that errors on any `primeng/*` / `primeicons` import (memory confirms 3/3 disallowed imports error).
10. **Testing** — Vitest via `@nx/vitest` (executor `@nx/vitest:test`) + `@analogjs/vitest-angular`. Host-shell still has a Karma config (`apps/host-shell/karma.conf.js` referenced in `project.json:117-118`) — legacy carryover from before the Vitest migration; admin-console + management-console use Vitest only.
