*** Architecture Rule Set — Workspace Topology ***
*** SoT: Brain Outputs/understanding/frontend/architecture/WORKSPACE_TOPOLOGY.md ***
*** Indexed 2026-05-15 by Brain SK Phase 3F ***

# Workspace Topology

> Nx 22.7.1 · Angular 21.2.9 zoneless · Tailwind v4 · Stencil. 3 apps (host-shell:4200, admin-console:4204, management-console:4301) + 9 libs (`falcon`, `falcon-ui-core`, `falcon-ui-tokens`, `falcon-theme`, `falcon-studio`, `falcon-ui-react`, `falcon-ui-vue`, `falcon-ui-showcase-data`, `sdk`). MF manifest declares 4 remotes (2 active). All 3 apps use `@nx/angular:webpack-browser` executor (not esbuild).

## Source-of-truth file
- [WORKSPACE_TOPOLOGY](../../outputs/understanding/frontend/architecture/WORKSPACE_TOPOLOGY.md)

## Key rules extracted

| Rule id | Rule (one-line) | Severity | Cited file/line |
|---|---|---|---|
| AR-topo-01 | All 3 apps MUST use Angular standalone-bootstrap + `provideZonelessChangeDetection()` + `@nx/angular:webpack-browser` executor with custom MF webpack. | high | per-app `app.config.ts` |
| AR-topo-02 | Default gateways MUST be set per app: admin-console = `Gateway.SystemGateway`; management-console = `Gateway.CoreGateway`; host-shell = NONE (per-route routing fallback). | high | `provideAppDefaultGateway()` |
| AR-topo-03 | management-console `app.config.ts` MISSES `provideAnimationsAsync()` — known divergence from host + admin-console. Should be added for consistency. | medium | grep |
| AR-topo-04 | Active MF manifest declares 4 remotes; only 2 are `active: true` (admin-console + management-console). 2 are dormant (`demo-app`, `user-app`). | medium | `module-federation.manifest.json` |
| AR-topo-05 | Prod variant `module-federation.manifest.prod.json` rewrites `remoteEntry` URLs to `https://falconhub.space/remotes/...` via `fileReplacements` in `apps/host-shell/project.json`. | medium | `project.json` |
| AR-topo-06 | All `@falcon/*` path aliases MUST be declared in `tsconfig.base.json:16-71` — Nx scope tags are mostly empty (only `falcon-ui-core` carries `scope:falcon-ui-core`). | high | `tsconfig.base.json` |
| AR-topo-07 | `demos/` lives at workspace root but is EXPLICITLY SKIPPED by Tailwind v4 `@source not` directives — demo apps are NOT factored into bundle calculations. | high | tailwind.css `@source not` |
| AR-topo-08 | Each app MUST have BOTH `tailwind.css` (Oxide-scanned utilities) AND `styles.scss` (legacy minimal carry-over) — registered in `project.json` styles plus `libs/falcon-theme/src/styles/falcon-icons.css`. | high | `project.json` |
| AR-topo-09 | Tailwind layer order MUST be `@layer theme, base, falcon-base, utilities;` and dark mode MUST be `@custom-variant dark (&:where(.app-dark, .app-dark *))`. | high | per-app `tailwind.css` |

## Apps (3 active)

| App | Port | Role | Default Gateway |
|---|---|---|---|
| `host-shell` | 4200 | MF host (HashLocationStrategy) — owns auth + interceptors + facades + manifest provider | none (factory-based) |
| `admin-console` | 4204 | MF remote (`name: admin-console`, exposes `./admin-console`) — Falcon-side | `Gateway.SystemGateway` |
| `management-console` | 4301 | MF remote (`name: management-console`, exposes `./management-console`) — Client-side | `Gateway.CoreGateway` |

## Libs (9 first-class)

| Lib | Alias(es) | Purpose |
|---|---|---|
| `falcon` | `@falcon` | Angular barrel (6 sub-folders × `export *`). Bridges Stencil wrappers + legacy bespoke + types + utils + i18n. |
| `falcon-ui-core` | `@falcon/ui-core{,/loader,/tailwind,/angular,/angular/*,/tailwind/*,/types}` | Cross-framework Stencil library. 94 component folders (47 Shadow + 47 Light + 1 Light-only). 49 Angular wrappers. |
| `falcon-ui-tokens` | `@falcon/ui-tokens/*` | Per-component CSS design tokens (46 files). Layered: primitives → semantic → themes → density → rtl → components. Pure CSS. |
| `falcon-theme` | `@falcon/theme{,/tokens,/*}` | Tailwind v4 `@theme` SSOT (~264 tokens). Icon font + `assets/fonts/`. |
| `falcon-studio` | `@falcon/studio` | Theme/component customisation studio. **Hidden-but-kept (Wave 2 v3.1)** — Tailwind doesn't scan it, host route removed. |
| `falcon-ui-react` | `@falcon/ui-react` | React wrappers via Stencil `reactOutputTarget`. |
| `falcon-ui-vue` | `@falcon/ui-vue` | Vue 3 wrappers via `generate-vue-proxies.cjs`. |
| `falcon-ui-showcase-data` | `@falcon/ui-showcase-data{,/docs/*}` | Registry of 28 components + 28 MD docs. |
| `sdk` | `@falcon/sdk` | Cross-shell facade tokens + `provideFalconFacades({...})`. |

## Manifest inventory

| key | name | exposedModule | active | exposeType | requiredAccess |
|---|---|---|---|---|---|
| `admin-console` | `admin_console` | `./admin-console` | ✓ | routes | `view app.admin-console` |
| `management-console` | `management_console` | `./management-console` | ✓ | routes | `view app.management-console` |
| `demo-app` | `External-app` | `./users` | ✗ | component | `view microapp.user-settings` |
| `user-app` | `mfe-app` | `./survey` | ✗ | module | `view microapp.survey-container` |

## App-internal structure
- `host-shell/`: `app.{ts,config.ts,routes.ts}`, `core/{auth,guards,interceptors,module-federation,services}/`, `features/{auth,dashboard,error,falcon-ui-showcase,not-found,unauthorized}/`, `layout/`, `playground/`, `falcon-facades/`, `falcon-sdk/`.
- Remotes: `app/`, `features/<feature>/{components,models,services,resolvers,guards}/`, `remote-entry/entry.routes.ts`, `mocks/falcon-fallback.providers.ts`.

## Tailwind entrypoint per app (host-shell example: 2399 lines)
1. `@import "../../../libs/falcon-theme/src/falcon-tailwind-tokens.css"` — `@theme` SSOT.
2. `@import "../../../libs/falcon-ui-tokens/src/index.css"` — 46 component-token files.
3. `@source` paths (./, `libs/falcon/src/shared-ui`, `libs/falcon-ui-core/src/{tailwind,angular-wrapper,components}`).
4. `@source not` exclusions (`node_modules`, `dist`, `.angular`, `.nx`, `demos`, `*.spec.ts`, `*.e2e.ts`, `*.md`).
5. `@source inline(...)` safelists for runtime class strings.
6. `@layer theme, base, falcon-base, utilities;`
7. `@custom-variant dark (&:where(.app-dark, .app-dark *))`.

## Karma / Vitest mix
- admin-console + management-console: Vitest (via `@nx/vitest:test` + `@analogjs/vitest-angular`).
- host-shell: legacy `karma.conf.js` — carryover from before Vitest migration. Should be migrated.

## Known divergences
- management-console missing `provideAnimationsAsync()`.
- host-shell still on Karma (others Vitest).
- host-shell has 2 sibling `remote-route.service.ts` (the one at app root is DEAD CODE — see [[Routes and Module Federation]]).

## Hubs
- [[FRONTEND_INDEX]] · [[COMPONENT_INDEX]] · [[BACKEND_INDEX]] · [[AMMAR_BRAIN_HOME]]
