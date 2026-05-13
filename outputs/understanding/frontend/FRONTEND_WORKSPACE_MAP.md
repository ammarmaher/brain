# Frontend Workspace Map — Falcon Angular Monorepo

**Source root:** `C:\Falcon\Falcon\falcon-web-platform-ui`
**Branch:** `polishing-v0.4` (clean)
**Nx version:** 22.7.1
**Angular version:** 21.2.9 (zoneless)
**Tailwind:** v4 (`@tailwindcss/postcss` + `@tailwindcss/vite`)
**Module Federation:** `@nx/module-federation` 22.7.1 + `@module-federation/enhanced` 2.1.0
**Stencil:** Web Components — `@stencil/core` powers the dual-render `<falcon-*>` library
**Generated date:** 2026-05-13

---

## Apps

All three apps are Angular 21.2.9 standalone-bootstrap, zoneless change detection, Tailwind v4 utilities (no SCSS component styles, no PrimeNG), webpack-browser executor with Module Federation custom-webpack configs.

| NAME | PATH | TYPE | PORT | MAIN ROUTES | MF ROLE |
|------|------|------|------|-------------|---------|
| `host-shell` | `apps/host-shell/` | host (shell) | **4200** | `/` (LayoutComponent under `authGuard + shellPrimeAccessGuard`), `/preview`, `/playground` (auth-free Falcon UI lab), `/falcon-ui-showcase`, `/preview-shell/org-hierarchy[-prime]`, `/preview-hierarchy[-prime]`, `/401`, `/not-found`, `/error`, `/login`, `**` → `/`. Dynamically appends remote routes via `RemoteRouteService.reloadRemotes()` before `router.initialNavigation()`. | **Host** — loads `admin_console` + `management_console` via `loadRemoteModule()` reading `apps/host-shell/src/assets/module-federation.manifest.json`. Falcon UI Stencil components register on-demand inside `bootstrap.ts` (post-async-boundary). |
| `admin-console` | `apps/admin-console/` | remote (Falcon admin) | **4204** | Children: `organization-hierarchy/**` (loadChildren), `organization-hierarchy-page/**` (loadChildren). Empty path redirects to `organization-hierarchy`. `**` → `''`. Exposes `routes`, `default`, `appRoutes`. *Note: `adminConsoleGuard` is currently commented out in `app.routes.ts:6`.* | **Remote** — exposes `./admin-console` → `src/app/remote-entry/entry.routes.ts`. |
| `management-console` | `apps/management-console/` | remote (Client mgmt) | **4301** | Children (protected by `managementConsoleGuard`): empty → `dashboard`, `organization-hierarchy-page/**` (loadChildren). `**` → `''`. | **Remote** — exposes `./management-console` → `src/app/remote-entry/entry.routes.ts`. |

### Demos (excluded from production bundle budgets)

| NAME | PATH | NOTES |
|------|------|-------|
| `angular-playground` | `demos/angular-playground/` | Standalone Angular sandbox under `demos/`. |
| `component-docs` | `demos/component-docs/` | ~28 Markdown component dossiers consumed by the cross-framework demo apps. |

Memory says the in-workspace Nx demos (`apps/demo/{angular,react,vue}` on ports 4500/4501/4502) were planned, but the active checked-out tree does NOT contain `apps/demo/` — the demo apps now live only at `demos/` (legacy out-of-workspace location preserved). The Vite cross-framework playgrounds noted in memory are absent from this branch. **Treat the demos folder as the only verified demo surface in `polishing-v0.4`.**

### Module Federation share rules (verbatim from each config)

- `@angular/animations` + `@angular/platform-browser/animations` → **kept local** (avoids RUNTIME-006).
- `@angular/*` → `singleton: true, strictVersion: true, eager: true`.
- `@falcon` + `@falcon/*` → `singleton: true, strictVersion: false, eager: true` (also listed in `additionalShared`).
- `rxjs`, `rxjs/operators` → `singleton: true, strictVersion: true, eager: true`.
- `uuid`, `tslib`, `jwt-decode` → eager singletons.
- `zone.js` is **NOT shared** — removed from polyfills (zoneless rollout from Step 3 admin-console pilot, now applied to all three apps).
- PrimeNG branches were physically deleted in Wave PR-8 — no `primeng/*` / `primeicons` share-map entries remain.

---

## Libs

Workspace lib aliases live in `tsconfig.base.json:16-71`. Library Nx tags are largely empty (only the `falcon-ui-core` project carries `scope:falcon-ui-core` per `libs/falcon-ui-core/project.json`; the rest run with `tags: []`).

| NAME | PATH | SCOPE-TAG | PURPOSE (one line) | KEY EXPORTS |
|------|------|-----------|--------------------|-------------|
| `falcon` (alias `@falcon`) | `libs/falcon/src/index.ts` | — | The Angular barrel. Re-exports core (session, guards, route-access), language (translate service + pipe), shared-data-access (HTTP), shared-types, shared-ui (Angular wrappers + legacy components), shared-utils. Bridges the Stencil components into Angular via `@falcon/ui-core/angular`. | 7 sections × `export *` from sub-folders; ~150+ symbols total. `shared-ui/index.ts` alone re-exports ~36 Angular wrapper components + types. |
| `falcon-ui-core` (alias `@falcon/ui-core`, `/loader`, `/tailwind`, `/angular`, `/types`) | `libs/falcon-ui-core/src/` | `scope:falcon-ui-core` | The cross-framework Stencil web component library. 47 Stencil components with dual-render path (Shadow DOM `<falcon-X>` + Light DOM `<falcon-X-tw>`). Houses the Angular wrapper layer at `src/angular-wrapper/`. Also emits React + Vue wrappers. | 94 component folders (47 Shadow + 47 `-tw` Light DOM). Index re-exports all components + types. Angular wrapper barrel exports 49 `FalconAngular*` components. |
| `falcon-ui-tokens` (alias `@falcon/ui-tokens/*`) | `libs/falcon-ui-tokens/src/` | — | Per-component CSS design-token files. Layered: `primitives → semantic → themes → density → rtl → components`. Single `index.css` imports ~46 component-scoped token files (`<component>.tokens.css`). | 0 TS exports — pure CSS custom-properties. Used by Stencil components and Tailwind v4 utilities. |
| `falcon-theme` (alias `@falcon/theme`, `/tokens`, `/*`) | `libs/falcon-theme/src/` | — | Tailwind v4 `@theme` SSOT (`falcon-tailwind-tokens.css`, 486 lines, ~264 tokens). Houses `styles/falcon-icons.css` font + `assets/fonts/`. Index re-exports the SSOT + icon font. | `index.css` (barrel), `falcon-tailwind-tokens.css` (canonical), `tokens.ts` (TS symbol mirror). |
| `falcon-studio` (alias `@falcon/studio`) | `libs/falcon-studio/src/` | — | Theme/component customisation studio app. **Hidden-but-kept** (Wave 2 v3.1) — preserved on disk, route removed from host-shell, NOT scanned by Tailwind. Includes Waves 6A-14 planning docs. | Studio app entry + customisation panels — currently dormant in `polishing-v0.4`. |
| `falcon-ui-react` (alias `@falcon/ui-react`) | `libs/falcon-ui-react/src/` | — | React wrappers auto-emitted by Stencil's `reactOutputTarget` (`stencil.config.ts:44-47`). | Auto-generated React component bindings for every `<falcon-*>` Stencil tag. |
| `falcon-ui-vue` (alias `@falcon/ui-vue`) | `libs/falcon-ui-vue/src/` | — | Vue 3 wrappers. Generated via `generate-vue-proxies.cjs` script in `libs/falcon-ui-core/`. | Auto-generated Vue component proxies. |
| `falcon-ui-showcase-data` (alias `@falcon/ui-showcase-data`, `/docs/*`) | `libs/falcon-ui-showcase-data/src/` | — | Registry of component metadata + ~28 markdown docs. Powers the `/falcon-ui-showcase` route in host-shell. | Registry JSON + MD docs. |
| `sdk` (alias `@falcon/sdk`) | `libs/sdk/src/` | — | Cross-shell facades — auth / theme / language / notifier / context provider tokens. Apps register concrete implementations via `provideFalconFacades({ auth, theme, language, notifier, context })`. | `provideFalconFacades()`, `FALCON_AUTH`, facade tokens. |

### Library structure conventions

- Every lib has `project.json` (Nx), `tsconfig.json` + `tsconfig.lib.json`.
- `falcon` (the Angular barrel) splits into sub-folders that map to public surfaces: `core/`, `language/`, `shared-data-access/`, `shared-types/`, `shared-ui/`, `shared-utils/` — each with its own `index.ts`.
- `falcon/src/shared-ui` carries the legacy bespoke Angular components (`falcon-calendar`, `falcon-mobile-number`, `falcon-form-field`, `falcon-photo-uploader`, `falcon-stepper`, `falcon-multiselect`, `falcon-tree-panel`, `send-credentials-popup`, plus `directives/` and `ui/` icon helpers). The bulk of new components live in `falcon-ui-core/src/angular-wrapper/components/` and are re-exported from here.
- `falcon-ui-core/src/components/` holds **94** Stencil component folders — 47 pairs of Shadow-DOM (`falcon-X`) and Light-DOM (`falcon-X-tw`) tags. Each tag has its own `.tsx` + `.css` + `.types.ts` + `.utils.ts` + `readme.md` + spec / e2e where present.
- `falcon-ui-core/src/angular-wrapper/components/` holds the Angular CVA wrappers (`falcon-angular-*` selectors). Each component folder has `.component.ts` + `.component.html` + `.component.css` (sometimes empty) + `index.ts`.

### Workspace plumbing

- `tsconfig.base.json` declares the `@falcon`, `@falcon/sdk`, `@falcon/studio`, `@falcon/theme`, `@falcon/theme/tokens`, `@falcon/theme/*`, `@falcon/ui-core`, `@falcon/ui-core/loader`, `@falcon/ui-core/tailwind`, `@falcon/ui-core/angular`, `@falcon/ui-core/angular/*`, `@falcon/ui-core/tailwind/*`, `@falcon/ui-core/types`, `@falcon/ui-tokens/*`, `@falcon/ui-react`, `@falcon/ui-vue`, `@falcon/ui-showcase-data`, `@falcon/ui-showcase-data/docs/*` path aliases.
- `nx.json` declares Angular-only generators (`@nx/angular:application/library/component/directive/service`), `style: "css"`, `unitTestRunner: "vitest-analog"`, no Nx Cloud (`neverConnectToCloud: true`).
- App `project.json` files lock production budgets: admin-console 9.5 MB initial / 20 KB per-component-style; host-shell 6 MB / 20 KB; management-console 12 MB / 20 KB.
- Stencil emits a `dist-custom-elements` output target + a React wrapper output target. Vue wrappers come from a separate `generate-vue-proxies.cjs` script.

### Quality gates (npm scripts)

`package.json` lists **12 gate scripts** (lint, typecheck, build per cross-framework lib, token-naming, hardcoded-value, a11y baseline, Noor naming, bundle-size budget, component-token-scope). `gate:all` chains 7 of them. These run via plain `node` against `tools/gates/gate-NN-*.mjs`.
