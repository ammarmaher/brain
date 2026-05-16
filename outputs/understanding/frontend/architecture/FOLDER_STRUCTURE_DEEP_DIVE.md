---
type: folder-structure
purpose: where-everything-lives-and-why
generatedAt: 2026-05-16
source: full walk of falcon-web-platform-ui
generator: Tier 2 of FRONTEND_KNOWLEDGE_PATH (Agent D)
---

# Folder Structure Deep-Dive — `falcon-web-platform-ui`

> The permanent answer to **"what lives where and why?"** for any newcomer touching the Falcon front-end.
> Canonical repo path (R-FE-014): **`C:\Falcon\Falcon\falcon-web-platform-ui\`**.

---

## 1 — TL;DR tree

```
falcon-web-platform-ui/
├── apps/                          # 3 Angular apps
│   ├── admin-console/             # MF remote (Falcon-admin)        :4204
│   ├── host-shell/                # MF host (shell + auth + chrome) :4200
│   └── management-console/        # MF remote (client-admin)        :4301
│
├── libs/                          # 9 Nx libraries
│   ├── falcon/                    # @falcon            — the Angular barrel
│   ├── falcon-ui-core/            # @falcon/ui-core    — Stencil + Angular wrappers (universal UI)
│   ├── falcon-ui-tokens/          # @falcon/ui-tokens/* — per-component design-token CSS
│   ├── falcon-theme/              # @falcon/theme      — Tailwind v4 @theme SSOT + icon font
│   ├── falcon-studio/             # @falcon/studio     — live theme editor (Hide-but-Keep)
│   ├── falcon-ui-react/           # @falcon/ui-react   — React wrappers (Stencil-generated)
│   ├── falcon-ui-vue/             # @falcon/ui-vue     — Vue 3 wrappers (Stencil-generated)
│   ├── falcon-ui-showcase-data/   # @falcon/ui-showcase-data — gallery registry + docs
│   └── sdk/                       # @falcon/sdk        — cross-shell facade tokens
│
├── tools/                         # workspace-level scripts
│   ├── gates/                     # 12 build-time quality gates
│   ├── visual-regression/         # Playwright pixel tests
│   ├── webpack/                   # cache + style policies
│   └── ai-migrations/             # AI-assisted migration recipes
│
├── scripts/                       # shell helpers (MF manifest swap)
├── demos/                         # in-workspace cross-framework demos (NOT bundled)
│   ├── angular-playground/        # Vite + Analog                   :5175
│   └── component-docs/            # 29 .md files mirrored to demos
│
├── docs/                          # VitePress public-facing docs site
├── Doc/                           # legacy single-file architecture doc
├── docker/                        # Dockerfile.frontend + nginx-spa.conf
├── tsconfig.base.json             # ★ Path-alias SSOT
├── nx.json                        # workspace config
├── package.json                   # one package.json for the entire monorepo
└── eslint.config.mjs              # flat-config root (PrimeNG forbid block lives here)
```

---

## 2 — Top-level layout

| Folder | Purpose | Tracked in git? | Build artifact? |
|---|---|---|---|
| `apps/` | The 3 Angular apps (host + 2 remotes) | ✅ | no |
| `libs/` | All 9 Nx libraries | ✅ | no |
| `tools/` | Quality gates, visual-regression, webpack helpers, AI migration prompts | ✅ | no |
| `scripts/` | `set-mf-manifest.sh` — swaps dev/prod MF manifest | ✅ | no |
| `demos/` | `angular-playground` (port 5175) + `component-docs/` MD library | ✅ | ❌ (excluded by Tailwind `@source not`) |
| `docs/` | VitePress public docs site (component reference + tokens) | ✅ | ✅ (separate Nx project) |
| `Doc/` | Legacy 54 KB `falcon_front_end_architecture_live_document_v2.md` | ✅ | no |
| `docker/` | `Dockerfile.frontend` + `nginx-spa.conf` for container builds | ✅ | no |
| `.azuredevops/` | Azure DevOps pipeline configs | ✅ | no |
| `.changeset/` | `@changesets/cli` proposal queue | ✅ | no |
| `.claude/` | Claude Code project-scope rules + commands | ✅ | no |
| `.scratch/` + `scratch/` | Ephemeral working notes (gitignored content varies) | partial | no |
| `.vitepress/` | VitePress runtime cache | ❌ | no |
| `.idea/`, `.angular/`, `.nx/` | IDE / Angular / Nx caches | ❌ | no |
| `dist/` | Build outputs (`dist/apps/<app>/`) | ❌ | ✅ |
| `node_modules/` | npm install tree | ❌ | no |

---

## 3 — `apps/` — the 3 Angular apps

All three apps share the same skeleton: standalone-bootstrap, `provideZonelessChangeDetection()`, Angular 21.2.9, webpack-browser executor with `@nx/module-federation` plug-in.

### 3.1 `apps/host-shell/` — the MF **host** (Falcon shell)

- **Port:** 4200
- **Role:** Module Federation host. Loads `admin-console` + `management-console` remotes via a runtime manifest. Owns auth flow, HTTP interceptors, layout chrome (sidebar/topbar), facade composition root.
- **Entry:** [`apps/host-shell/src/main.ts`](C:/Falcon/Falcon/falcon-web-platform-ui/apps/host-shell/src/main.ts) — dynamic `import('./bootstrap')` to create the MF async boundary (avoids RUNTIME-006).
- **Root component:** `App` from `apps/host-shell/src/app/app.ts`.
- **Bootstrap:** [`apps/host-shell/src/bootstrap.ts`](C:/Falcon/Falcon/falcon-web-platform-ui/apps/host-shell/src/bootstrap.ts) — `bootstrapApplication(App, appConfig)`, then awaits `RemoteRouteService.reloadRemotes()` BEFORE `router.initialNavigation()` (so refreshing a remote-app URL doesn't fall to dashboard).
- **MF config:** [`apps/host-shell/module-federation.config.ts`](C:/Falcon/Falcon/falcon-web-platform-ui/apps/host-shell/module-federation.config.ts) — `name: 'host-shell'`, `remotes: []` (resolved at runtime from manifest), eager-shares `@falcon` + `@falcon/sdk` + `@angular/*` + `rxjs` + `uuid/tslib/jwt-decode`.

```
apps/host-shell/
├── src/
│   ├── main.ts                       Dynamic import('./bootstrap')
│   ├── bootstrap.ts                  bootstrapApplication + remote-route reload + initialNavigation
│   ├── index.html
│   ├── styles.scss
│   ├── tailwind.css                  Tailwind v4 entry @import "@falcon/theme"
│   ├── test-setup.ts
│   ├── app/
│   │   ├── app.ts / app.html / app.css   Root component (delegates to <app-layout>)
│   │   ├── app.config.ts             ApplicationConfig — facades, interceptors, env config, MF manifest provider
│   │   ├── app.routes.ts             Top-level routes (LayoutComponent + auth + preview + showcase + playground)
│   │   ├── core/
│   │   │   ├── auth/                 auth.service, auth-api.service, token-storage, auth.models
│   │   │   ├── guards/               auth.guard.ts (functional CanActivateFn)
│   │   │   ├── interceptors/         request-interceptor + response-interceptor
│   │   │   ├── module-federation/    remote-manifest types + 2 providers (JSON-file + API) + mf-contract + mf-diagnostic
│   │   │   ├── services/             remote-route.service, remote-config, translate.initializer
│   │   │   └── user/                 user-api.service + user.models
│   │   ├── features/
│   │   │   ├── auth/                 login + OTP + forgot-password + change-password
│   │   │   ├── dashboard/
│   │   │   ├── error/                error.component.ts
│   │   │   ├── falcon-ui-showcase/   gallery + library-section + showcase-data
│   │   │   ├── not-found/
│   │   │   └── unauthorized/
│   │   ├── layout/                   LayoutComponent + sidebar/ + topbar/ + model/
│   │   ├── playground/               playground.page.* — auth-free Falcon UI lab
│   │   ├── preview-page.component.ts        Visual-test preview
│   │   ├── preview-shell.component.ts       Visual-test preview shell
│   │   └── shared-components/        Host-owned app-level WRAPPERS (library skeletons + service injection)
│   │       ├── do-payment-priority-popup/    wraps <falcon-angular-insufficient-balance-dialog>
│   │       └── organization-hierarchy-tree/  wraps <falcon-tree-panel>, owns PES gating
│   └── assets/
│       ├── module-federation.manifest.json + .prod.json
│       ├── component-docs/, falcon-icon/, font-awesome/, images/
│
├── falcon-facades/                   ★ Notable subfolder #1 — concrete impls registered via @falcon/sdk
│   ├── host-auth.facade.ts
│   ├── host-context.facade.ts
│   ├── host-language.facade.ts
│   ├── host-notifier.facade.ts
│   └── host-theme.facade.ts
│
├── falcon-sdk/                       ★ Notable subfolder #2
│   └── host-window-sdk.bridge.ts     Installs window.FalconSdk for embedded third-party MFEs
│
├── scripts/verify-mf.mjs             Runtime MF sanity check
├── module-federation.config.ts
├── webpack.config.ts                 Dev MF webpack
├── webpack.prod.config.ts            Prod MF webpack
├── vite.config.mts                   Vitest config
├── project.json                      Nx targets (serve/build/test/lint)
├── public/favicon.ico
└── eslint.config.mjs
```

### 3.2 `apps/admin-console/` — MF **remote** (Falcon-admin)

- **Port:** 4204
- **Role:** Module Federation remote. `name: 'admin-console'`, exposes `./admin-console → src/app/remote-entry/entry.routes.ts`. Default gateway: `Gateway.SystemGateway`. Standalone-dev uses `provideFalconFallbackFacades()` so the remote can run outside the shell.
- **Entry:** `src/main.ts` → `src/bootstrap.ts` → `bootstrapApplication(App, appConfig)`.
- **Top routes:** [`apps/admin-console/src/app/app.routes.ts`](C:/Falcon/Falcon/falcon-web-platform-ui/apps/admin-console/src/app/app.routes.ts) — single child: `org-hierarchy-page`, lazy-loaded; redirects empty to `organization-hierarchy`. Exports `routes` + `default` for MF.

```
apps/admin-console/
├── src/
│   ├── main.ts / bootstrap.ts
│   ├── index.html / styles.scss / tailwind.css (152 KB compiled token-aware sheet)
│   ├── environments/
│   └── app/
│       ├── app.config.ts             ApplicationConfig (+ falcon-fallback.providers from mocks/)
│       ├── app.routes.ts             Lazy children + remote-entry exports
│       ├── features/
│       │   └── org-hierarchy-page/   ★ The sole feature. Follows R-FE-009 pattern:
│       │       ├── org-hierarchy-page.routes.ts
│       │       ├── models/models.ts
│       │       ├── services/         services.ts + hierarchy-page-state.service.ts + validators.ts + 2 mock files
│       │       └── components/
│       │           ├── org-hierarchy-page-menu.component.{html,ts}
│       │           ├── skeleton/
│       │           ├── tab-components/   hierarchy-tab/ apps-services-tab/ comm-channels-tab/ settings-tab/ applications-table/ falcon-table-edit-row/
│       │           ├── wizard-components/ add-client-wizard/ add-user-wizard/
│       │           ├── user-details/
│       │           └── verify/
│       └── remote-entry/
│           └── entry.routes.ts       ★ MF expose target
│
├── mocks/falcon-fallback.providers.ts   For standalone-dev runs (no host)
├── public/                              favicon + falcon-icon.png
├── module-federation.config.ts          name: admin-console, exposes: { './admin-console': entry.routes.ts }
├── webpack.config.ts / webpack.prod.config.ts
├── project.json
└── .scratch/org-hierarchy-defects.md
```

### 3.3 `apps/management-console/` — MF **remote** (client-admin)

- **Port:** 4301
- **Role:** Module Federation remote. `name: 'management-console'`, exposes `./management-console → src/app/remote-entry/entry.routes.ts`. Default gateway: `Gateway.CoreGateway`. Same standalone-dev fallback pattern as admin.
- **Current state:** `src/app/features/` is **empty** — the app is scaffolded but features land here progressively. `app.routes.ts` is a thin shell.

```
apps/management-console/
├── src/
│   ├── main.ts / bootstrap.ts
│   ├── tailwind.css (~1.2 KB — minimal because no features yet)
│   ├── environments/
│   └── app/
│       ├── app.config.ts
│       ├── app.routes.ts             Currently a stub
│       ├── features/                 (empty)
│       └── remote-entry/entry.routes.ts
├── debug/                            Internal scratch
├── mocks/falcon-fallback.providers.ts
├── public/
├── module-federation.config.ts
└── webpack.config.ts / webpack.prod.config.ts
```

---

## 4 — `libs/` — the libraries

`tsconfig.base.json:18-75` is the **single source of truth** for which alias points where. Every lib has `project.json`, `tsconfig.json`, `tsconfig.lib.json`, and (most) `package.json`.

### 4.1 `libs/falcon/` — the Angular barrel `@falcon`

- **Alias:** `@falcon` → `libs/falcon/src/index.ts`
- **Purpose:** The historical "all of Falcon" Angular library. 6 sub-folders each with their own `index.ts`, re-exported from the root barrel via `export *`. This is what apps import for guards, session, translate, shared bespoke components, HTTP services, types, and validators.
- **Consumed by:** `host-shell`, `admin-console`, `management-console`.

```
libs/falcon/src/
├── index.ts                          ★ Public barrel — 6 export * lines
├── core/                             SESSION + ACCESS-CONTROL + GUARDS
│   ├── index.ts
│   └── lib/
│       ├── access-control/           AccessControlFacade + client + store + types + shellAccessGuard + current-subject builder
│       ├── guards/                   admin-console.guard + management-console.guard + admin-organization-hierarchy.guard
│       ├── services/                 node.service + route-access.service + session-provider.service
│       └── user-session.interface.ts
│
├── language/                         I18N
│   ├── index.ts
│   ├── i18n/en.json + ar.json
│   └── lib/
│       ├── services/                 TranslateService
│       ├── pipes/                    translate pipe
│       └── translate.initializer.ts
│
├── shared-ui/                        ★ App-shared bespoke components + directives + icon kit
│   ├── index.ts
│   └── lib/
│       ├── components/               11 bespoke (NOT in falcon-ui-core because they're app-tier orchestrators):
│       │                              falcon-calendar, falcon-form-field, falcon-mobile-number,
│       │                              falcon-multiselect, falcon-node-details-section,
│       │                              falcon-photo-uploader, falcon-saudi-riyal-icon, falcon-stepper,
│       │                              falcon-tree-panel, falcon-view-toggle, send-credentials-popup
│       ├── directives/               12 Falcon validation directives (phone, IP, username-format, …) + index.ts
│       └── ui/                       falcon-icon + icon + svg-icon (icon kit)
│
├── shared-data-access/               HTTP + RUNTIME-CONFIG
│   ├── index.ts
│   └── lib/
│       ├── services/                 typed HTTP wrappers
│       ├── interceptors/
│       ├── runtime-config/
│       └── validators/               server-side validators
│
├── shared-types/                     TYPES + ENUMS + CONSTANTS
│   ├── index.ts
│   └── lib/{constants, enums, models}
│
└── shared-utils/                     UTIL FUNCS + CLIENT VALIDATORS
    ├── index.ts
    └── lib/{utils, validators}
```

### 4.2 `libs/falcon-ui-core/` — universal UI library `@falcon/ui-core`

The **dual-render** Falcon component library. Stencil at its heart, Angular wrappers as a sibling output surface. See §5 for the full deep-dive.

### 4.3 `libs/falcon-ui-tokens/` — design-token CSS `@falcon/ui-tokens/*`

- **Alias:** `@falcon/ui-tokens/*` → `libs/falcon-ui-tokens/src/*`
- **Purpose:** Per-component CSS design-token files. Pure CSS — no TS exports.
- **Layered architecture:** `primitives → semantic → themes → density → rtl → components` (each is a folder).
- **`index.css`** imports 46 component-scoped `.tokens.css` files (accordion, avatar, badge, button, calendar, card, checkbox, …).
- **Consumed by:** the Stencil components in `falcon-ui-core` (each component's `.tokens.css` lives here, not next to the `.tsx`).

### 4.4 `libs/falcon-theme/` — Tailwind v4 theme SSOT `@falcon/theme`

- **Aliases:**
  - `@falcon/theme` → `libs/falcon-theme/src/index.css` (Tailwind entry)
  - `@falcon/theme/tokens` → `libs/falcon-theme/src/tokens.ts` (TS mirror, auto-generated, **218 tokens**)
  - `@falcon/theme/*` → `libs/falcon-theme/src/*`
- **Purpose:** The Tailwind v4 `@theme` SSOT. `falcon-tailwind-tokens.css` carries ~264 raw tokens — `falcon-blue-500`, `falcon-radius-md`, `falcon-shadow-card`, etc. The TS mirror (`tokens.ts`) exposes the same names to TS code.
- **Other contents:** `styles/falcon-icons.css` (Falcon icon font @font-face) + `assets/` (font files).
- **Consumed by:** every app's `tailwind.css` (`@import "@falcon/theme"`).

### 4.5 `libs/falcon-studio/` — live theme editor `@falcon/studio`

- **Alias:** `@falcon/studio` → `libs/falcon-studio/src/index.ts`
- **Purpose:** The Falcon theme + component customisation studio. Exports `FalconStudioComponent`, preview grid, token-editor panel, preset bar, export panel, scope chooser, animation panel, color panel, abstraction-map registry, etc.
- **Status:** **Hide-but-Keep (Wave 2 v3.1)**. Tailwind no longer scans it. The `host-shell` route `/studio` is removed. Library preserved on disk for future re-enable. See the WAVE-*-PLAN.md siblings in the lib root.
- **Consumed by:** nothing in active routing — but exports remain valid for development consumers.

### 4.6 `libs/falcon-ui-react/` — React wrappers `@falcon/ui-react`

- **Alias:** `@falcon/ui-react` → `libs/falcon-ui-react/src/index.ts`
- **Purpose:** React 19 wrappers around the Stencil components. Auto-emitted by `stencil.config.ts` via `reactOutputTarget` (in `falcon-ui-core`).
- **Consumed by:** `demos/angular-playground/` and external React consumers.

### 4.7 `libs/falcon-ui-vue/` — Vue 3 wrappers `@falcon/ui-vue`

- **Alias:** `@falcon/ui-vue` → `libs/falcon-ui-vue/src/index.ts`
- **Purpose:** Vue 3 wrappers, generated by `libs/falcon-ui-core/generate-vue-proxies.cjs` (Stencil's Vue output target).
- **Consumed by:** future Vue consumers — no in-workspace consumer today.

### 4.8 `libs/falcon-ui-showcase-data/` — gallery registry `@falcon/ui-showcase-data`

- **Aliases:**
  - `@falcon/ui-showcase-data` → `libs/falcon-ui-showcase-data/src/index.ts`
  - `@falcon/ui-showcase-data/docs/*` → `libs/falcon-ui-showcase-data/src/docs/*`
- **Purpose:** Registry of ~28 components + ~28 MD docs that power `/falcon-ui-showcase` in host-shell. The library is currently orphaned scaffolding per memory `project_falcon_cross_framework_demos_inside_workspace` — preserved but not actively consumed at runtime.

### 4.9 `libs/sdk/` — cross-shell facade tokens `@falcon/sdk`

- **Alias:** `@falcon/sdk` → `libs/sdk/src/index.ts`
- **Purpose:** Cross-shell facade contract. Defines DI tokens that remotes import (auth, theme, language, notifier, context, hierarchy) and that the host registers concrete impls for via `provideFalconFacades({ … })`. Remotes register `provideFalconFallbackFacades()` in standalone-dev.

```
libs/sdk/src/
├── index.ts
├── facades/
│   ├── HierarchyFacade.ts
│   └── provide-falcon-facades.ts
├── tokens/falcon-facades.tokens.ts
├── types/falcon-facades.interfaces.ts
└── window-sdk/falcon-window-sdk.types.ts
```

---

## 5 — `libs/falcon-ui-core/` deep-dive

The cross-framework Falcon UI library. Three sibling output surfaces:

```
libs/falcon-ui-core/src/
├── index.ts                          @falcon/ui-core barrel — components.ts re-export + type exports + tailwind helpers
├── components.ts                     ★ Stencil-generated barrel for ALL component types
├── define-custom-elements.ts         @falcon/ui-core/loader — eager defineCustomElements()
├── define-falcon-component.ts        Helper used by Light DOM tags
├── define-falcon-tw-component.ts     Helper used by *-tw Light DOM tags
│
├── components/                       ★ 94 Stencil component folders
│   ├── falcon-input/                 Shadow DOM variant
│   │   ├── falcon-input.tsx          Stencil component
│   │   ├── falcon-input.css          Shadow-scoped CSS
│   │   ├── falcon-input.types.ts     Public types
│   │   ├── falcon-input.utils.ts     Internal helpers
│   │   ├── falcon-input.spec.ts      Stencil unit spec
│   │   ├── falcon-input.e2e.ts       Stencil e2e
│   │   └── readme.md                 Stencil-generated tag reference
│   ├── falcon-input-tw/              Light DOM variant — Tailwind utilities, no Shadow boundary
│   │   ├── falcon-input-tw.tsx
│   │   └── readme.md
│   └── … (one Shadow + one *-tw pair per primitive; ~47 pairs)
│
├── angular-wrapper/                  ★ Angular CVA wrappers — @falcon/ui-core/angular
│   ├── index.ts                      Re-exports ~50 component sub-paths + utilities + configurations
│   ├── README.md / PATTERN.md
│   ├── components/                   One folder per Angular wrapper:
│   │   ├── falcon-input/             Tag <falcon-angular-input>
│   │   │   ├── falcon-input.component.ts
│   │   │   ├── falcon-input.component.html
│   │   │   ├── falcon-input.component.css
│   │   │   └── index.ts              ★ Sub-path entry (used by @falcon/ui-core/angular/falcon-input)
│   │   └── … (~50 wrappers — see angular-wrapper/index.ts for the full list)
│   └── utilities/
│       ├── falcon-overlay.service.ts
│       └── index.ts
│
├── tailwind/                         ★ Cross-framework Tailwind class helpers (Light DOM SoT)
│   ├── tailwind-classes.ts           Aggregate export
│   ├── accordion-tailwind-classes.ts
│   ├── avatar-tailwind-classes.ts
│   ├── badge-tailwind-classes.ts
│   ├── button-tailwind-classes.ts
│   └── … one *-tailwind-classes.ts per Light DOM component
│
├── configurations/                   FalconConfigurationService + types + defaults JSON
├── types/                            common.types + events.types + form.types + tree.types
├── utils/                            a11y, dom, events, id, popover-portal
└── styles/                           base.css + tailwind.css (lib-internal CSS plumbing)
```

### Public API sub-paths (from `tsconfig.base.json`)

| Alias | Path |
|---|---|
| `@falcon/ui-core` | `libs/falcon-ui-core/src/index.ts` |
| `@falcon/ui-core/loader` | `libs/falcon-ui-core/src/define-custom-elements.ts` |
| `@falcon/ui-core/tailwind` | `libs/falcon-ui-core/src/tailwind/tailwind-classes.ts` |
| `@falcon/ui-core/tailwind/*` | `libs/falcon-ui-core/src/tailwind/*-tailwind-classes.ts` |
| `@falcon/ui-core/angular` | `libs/falcon-ui-core/src/angular-wrapper/index.ts` |
| `@falcon/ui-core/angular/*` | `libs/falcon-ui-core/src/angular-wrapper/components/*/index.ts` |
| `@falcon/ui-core/types` | `libs/falcon-ui-core/src/components.ts` |

### Component naming pattern

- Stencil **Shadow** DOM tag → `<falcon-X>` (e.g. `<falcon-input>`) — folder `components/falcon-X/`.
- Stencil **Light** DOM tag → `<falcon-X-tw>` — folder `components/falcon-X-tw/`. Uses Tailwind utilities, no Shadow boundary.
- Angular wrapper tag → `<falcon-angular-X>` — folder `angular-wrapper/components/falcon-X/`. Component class lives at `falcon-X.component.ts`.

Both Shadow and Light variants read tokens from the same `<X>.tokens.css` in `libs/falcon-ui-tokens/src/components/` — Studio-ready.

---

## 6 — `libs/falcon/` deep-dive — the application-shared library

**Why is there both `falcon-ui-core` and `falcon`?**

- `falcon-ui-core` = **universal primitives** (Stencil + Angular wrappers). Framework-agnostic at the Shadow layer, publishable to npm, reused across Angular/React/Vue.
- `falcon` = **app-shared Angular code** that depends on Angular framework features and Falcon platform semantics (session, access control, translate, app-shaped composite components). Angular-only.

### `src/shared-ui/lib/components/` — the OTHER 11 components

These live in `libs/falcon/`, not `libs/falcon-ui-core/`, because they're application-shaped orchestrators (compose primitives, depend on Falcon services), not framework primitives:

1. `falcon-calendar/` (composite calendar wrapper)
2. `falcon-form-field/` (label + control + error orchestrator)
3. `falcon-mobile-number/` (country selector + phone validator)
4. `falcon-multiselect/`
5. `falcon-node-details-section/`
6. `falcon-photo-uploader/`
7. `falcon-saudi-riyal-icon/` (currency icon)
8. `falcon-stepper/` (multi-step orchestrator)
9. `falcon-tree-panel/` (THE org-hierarchy tree shell — wrapped by host-shell `<app-organization-hierarchy-tree>`)
10. `falcon-view-toggle/`
11. `send-credentials-popup/` (full popup with API call inside)

### `src/theme/` — V0.2 theme adoption

Per memory `feedback_v02_theme_adopted.md`, the V0.2 theme adoption files **were physically moved out** of `libs/falcon/src/theme/` into `libs/falcon-theme/` (its own dedicated lib). The barrel comment in `libs/falcon/src/index.ts` lines 30-35 documents this migration:

> *"THEME — Moved to its own dedicated lib at libs/falcon-theme/. Consumed as CSS via the `@falcon/theme` alias (or relative @import from each app's tailwind.css). No TS exports — tokens flow through CSS at build time."*

So `libs/falcon/src/theme/` no longer exists. Use `@falcon/theme` instead.

### Split rationale (one liner per library)

| Library | Layer | Framework | Lifecycle | Reuse |
|---|---|---|---|---|
| `falcon-ui-core` | Primitives (Stencil) | Cross-framework | Stable, semver-ed via changesets | Angular + React + Vue + future |
| `falcon` | App-shared (Angular) | Angular-only | Tracks Falcon platform | Falcon apps only |
| `falcon-theme` | Visual SSOT | Pure CSS / TS | Tokens evolve with brand | All consumers |
| `falcon-ui-tokens` | Per-component token CSS | Pure CSS | One file per component | Stencil components + Tailwind variant |

---

## 7 — TS path aliases (full table from `tsconfig.base.json`)

| Alias | Path | When to use |
|---|---|---|
| `@host-shell/shared/*` | `apps/host-shell/src/app/shared-components/*/index.ts` | App-level wrappers exposed to remotes (e.g. `<app-do-payment-priority-popup>`) |
| `@falcon` | `libs/falcon/src/index.ts` | Session, guards, translate, app-shared components, HTTP services, types, validators |
| `@falcon/sdk` | `libs/sdk/src/index.ts` | Facade tokens + `provideFalconFacades({…})` |
| `@falcon/studio` | `libs/falcon-studio/src/index.ts` | Theme studio (Hide-but-Keep) |
| `@falcon/theme` | `libs/falcon-theme/src/index.css` | Tailwind v4 theme entry (CSS import only) |
| `@falcon/theme/tokens` | `libs/falcon-theme/src/tokens.ts` | TS mirror of the 218 design tokens |
| `@falcon/theme/*` | `libs/falcon-theme/src/*` | Deep imports into the theme lib (assets, styles) |
| `@falcon/ui-core` | `libs/falcon-ui-core/src/index.ts` | Falcon component types (TS) — does **not** include Angular wrappers |
| `@falcon/ui-core/loader` | `libs/falcon-ui-core/src/define-custom-elements.ts` | Eager-register all Stencil custom elements (rarely used — Angular wrappers self-register on ngOnInit) |
| `@falcon/ui-core/tailwind` | `libs/falcon-ui-core/src/tailwind/tailwind-classes.ts` | Cross-framework Tailwind helper aggregate |
| `@falcon/ui-core/angular` | `libs/falcon-ui-core/src/angular-wrapper/index.ts` | The Angular wrapper barrel — `import { FalconInputComponent } from '@falcon/ui-core/angular'` |
| `@falcon/ui-core/angular/*` | `libs/falcon-ui-core/src/angular-wrapper/components/*/index.ts` | Sub-path for tree-shakable per-component import (`@falcon/ui-core/angular/falcon-input`) |
| `@falcon/ui-core/tailwind/*` | `libs/falcon-ui-core/src/tailwind/*-tailwind-classes.ts` | Per-component Tailwind helper |
| `@falcon/ui-core/types` | `libs/falcon-ui-core/src/components.ts` | Stencil-generated component types barrel |
| `@falcon/ui-tokens/*` | `libs/falcon-ui-tokens/src/*` | Per-component token CSS (`@import "@falcon/ui-tokens/components/button.tokens.css"`) |
| `@falcon/ui-react` | `libs/falcon-ui-react/src/index.ts` | React wrappers |
| `@falcon/ui-vue` | `libs/falcon-ui-vue/src/index.ts` | Vue wrappers |
| `@falcon/ui-showcase-data` | `libs/falcon-ui-showcase-data/src/index.ts` | Showcase registry (orphaned in practice) |
| `@falcon/ui-showcase-data/docs/*` | `libs/falcon-ui-showcase-data/src/docs/*` | Showcase MD docs |

Quoted verbatim from `C:/Falcon/Falcon/falcon-web-platform-ui/tsconfig.base.json:18-75`.

---

## 8 — Feature folder pattern (R-FE-009 — `feedback_folder_structure_pattern.md`)

**Rule:** every feature uses these type-folders, **one file per type**:

```
<feature>/
├── <feature>.routes.ts               Route definitions
├── models/
│   └── models.ts                     ONE file with all interfaces/types/enums
├── services/
│   └── services.ts                   ONE file with all stateless services
│   └── [<thing>-state.service.ts]    EXCEPTION — signal-state services may be their own file
├── resolvers/
│   └── resolvers.ts                  ONE file with all route resolvers (when present)
├── directives/
│   └── directives.ts                 ONE file with all feature-scoped directives (when present)
└── components/
    ├── <feature>-menu.component.{ts,html}
    ├── skeleton/
    ├── tab-components/<tab-name>/
    └── wizard-components/<wizard-name>/<step-name>/
```

### Live example — `apps/admin-console/src/app/features/org-hierarchy-page/`

```
org-hierarchy-page/
├── org-hierarchy-page.routes.ts
├── models/models.ts
├── services/
│   ├── services.ts
│   ├── hierarchy-page-state.service.ts        ← signal-state EXCEPTION
│   ├── validators.ts
│   ├── validation-messages.ts
│   ├── otp-mock.service.ts
│   ├── mock-applications.ts
│   └── mock-tree.ts
└── components/
    ├── org-hierarchy-page-menu.component.{html,ts}
    ├── skeleton/org-hierarchy-skeleton.component.ts
    ├── tab-components/
    │   ├── hierarchy-tab/{falcon-org-chart, falcon-org-info-panel, falcon-org-kanban,
    │   │                 falcon-org-node-drawer, falcon-org-node-header, falcon-org-view-toggle}/
    │   ├── apps-services-tab/
    │   ├── comm-channels-tab/
    │   ├── settings-tab/
    │   ├── applications-table/
    │   └── falcon-table-edit-row/
    ├── wizard-components/
    │   ├── add-client-wizard/{client-account-owner-step, client-information-step,
    │   │                       client-service-row-table, client-settings-step}/
    │   └── add-user-wizard/{user-permissions-step, user-personal-step, …}/
    ├── user-details/user-details-page.component.{html,ts} + index.ts
    └── verify/
```

`models/models.ts` and `services/services.ts` carry **all** of their respective types — no per-class files. Signal-state services (`hierarchy-page-state.service.ts`) are the documented exception.

---

## 9 — Forbidden / deprecated locations

| Location | Status | Rule |
|---|---|---|
| `C:\Falcon\deprecated-falcon-web-platform-ui\` | ❌ Deprecated mirror — do not touch | R-FE-013 / `feedback_discard_old_ui.md` |
| `C:\Users\…\WebstormProjects\falcon-web-platform-ui\` | ❌ Old IDE workspace copy | R-FE-014 / `feedback_webstorm_duplicate_workspace.md` — canonical is `C:\Falcon\Falcon\falcon-web-platform-ui` ONLY |
| `falcon-web-platform-ui-old/` | ❌ Pre-rewrite copy | R-FE-013 |
| `apps/admin-console/src/app/remote-config.ts` (sibling of `core/services/remote-config.ts`) | ⚠ Stale duplicate noted in `WORKSPACE_TOPOLOGY.md` | Use the one in `core/services/` |
| `apps/host-shell/src/app/remote-route.service.ts` (sibling) | ⚠ Dead code | Use `core/services/remote-route.service.ts` |
| `libs/falcon/src/theme/` | ❌ Removed | Use `@falcon/theme` (now `libs/falcon-theme/`) |
| Legacy `Brain Outputs/component-registry/` mirrors | ⚠ Read-only legacy | Source of truth is now the typed clusters in `falcon-wiki/` |
| `apps/demo/{angular,react,vue}/` | ❌ Never committed | The only real demo app is `demos/angular-playground/` per memory `project_falcon_cross_framework_demos_inside_workspace` |
| `libs/falcon-studio/` route in host-shell | ⚠ Hide-but-Keep | Library kept on disk, `/studio` route removed in v3.1 Wave 2 |

**Hard rule:** SCSS files in components, inline styles, hardcoded values, PrimeNG imports, `pi pi-*` icons — all blocked by quality gates in `tools/gates/`. See `feedback_no_inline_styles_tokens_only.md`, `feedback_brain_skills_primeng_purge`, and `project_falcon_primeng_total_removal_complete`.

---

## 10 — Where to put new code (decision tree)

```
Is it a universal UI primitive (button/input/dialog/etc.)?
├── YES → libs/falcon-ui-core/src/components/falcon-X/             (Stencil Shadow .tsx)
│         libs/falcon-ui-core/src/components/falcon-X-tw/          (Stencil Light .tsx)
│         libs/falcon-ui-core/src/angular-wrapper/components/falcon-X/  (Angular wrapper)
│         libs/falcon-ui-tokens/src/components/X.tokens.css        (per-component tokens)
│
└── NO. Is it a Falcon-app-shaped composite (depends on session/translate/etc.)?
    ├── YES → libs/falcon/src/shared-ui/lib/components/falcon-X/   (Angular bespoke component)
    │
    └── NO. Is it an APP-LEVEL WRAPPER around a Falcon library skeleton (injects services)?
        ├── YES → apps/<app>/src/app/shared-components/<name>/
        │         export via apps/<app>/src/app/shared-components/<name>/index.ts
        │         imported via @host-shell/shared/<name> alias
        │
        └── NO. Is it a feature page / route?
            └── apps/<app>/src/app/features/<feature>/
                  Follow R-FE-009: models/services/resolvers/directives one-file-per-type
                  Components in components/, deeper trees in components/tab-components/ etc.
```

### Other one-liners

- **New design token?** Add to `libs/falcon-theme/src/falcon-tailwind-tokens.css`, then run `nx run falcon-theme:generate-tokens-ts` to regenerate the TS mirror.
- **New per-component token?** Add to `libs/falcon-ui-tokens/src/components/<name>.tokens.css` and `@import` it from `index.css`.
- **New facade contract for the remotes?** Add the token + interface in `libs/sdk/src/`, register a host impl in `apps/host-shell/falcon-facades/`, register a fallback in `apps/<remote>/mocks/falcon-fallback.providers.ts`.
- **New translation key?** `libs/falcon/src/language/i18n/en.json` + `ar.json`.
- **New build gate?** `tools/gates/gate-NN-<name>.mjs` + entry in root `package.json` scripts (`gate:<name>` + add to `gate:all`).
- **New shared library?** Use Nx: `nx g @nx/angular:library` — then add an alias in `tsconfig.base.json` and an entry in the root `nx.json` if it needs custom inputs.

---

## 11 — Sources of truth

| Fact | Source |
|---|---|
| Path aliases | `C:/Falcon/Falcon/falcon-web-platform-ui/tsconfig.base.json:18-75` |
| Workspace conventions | `C:/Falcon/Falcon/falcon-web-platform-ui/nx.json` |
| App MF roles + ports | `apps/<app>/module-federation.config.ts` + `apps/<app>/project.json` |
| Host MF manifest | `apps/host-shell/src/assets/module-federation.manifest.json` + `.prod.json` |
| `@falcon` barrel | `libs/falcon/src/index.ts:21-59` |
| `@falcon/ui-core` barrel | `libs/falcon-ui-core/src/index.ts:1-113` |
| `@falcon/ui-core/angular` barrel | `libs/falcon-ui-core/src/angular-wrapper/index.ts:1-86` |
| `@falcon/sdk` barrel | `libs/sdk/src/index.ts:1-13` |
| `@falcon/theme` barrel | `libs/falcon-theme/src/index.css:1-8` |
| `@falcon/theme/tokens` | `libs/falcon-theme/src/tokens.ts:1-5` (218 tokens, auto-generated) |
| Feature folder rule (R-FE-009) | Memory `feedback_folder_structure_pattern.md` |
| Wiki kebab-case + `@falcon/*` rule (R-FE-006) | Memory `feedback_wiki_naming_conventions.md` |
| Deprecated mirrors rule (R-FE-013) | Memory `feedback_discard_old_ui.md` |
| Canonical path rule (R-FE-014) | Memory `feedback_webstorm_duplicate_workspace.md` |
| Sibling architecture docs | `C:/Falcon/Brain Outputs/understanding/frontend/architecture/WORKSPACE_TOPOLOGY.md` + `FEATURE_FOLDER_STRUCTURE.md` |
| Live full-text architecture | `C:/Falcon/Falcon/falcon-web-platform-ui/Doc/falcon_front_end_architecture_live_document_v2.md` (54 KB legacy) |
| Top-level orientation | `C:/Falcon/Falcon/falcon-web-platform-ui/front-end-arch.md` (47 KB) |
| Cross-framework demos reality | Memory `project_falcon_cross_framework_demos_inside_workspace` |
| Studio Hide-but-Keep | Memory `project_falcon_revamp_v3_1_night_shift_results` |
| PrimeNG eradication | Memory `project_falcon_primeng_total_removal_complete` |
