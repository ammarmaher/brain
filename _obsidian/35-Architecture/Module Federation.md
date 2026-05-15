*** Architecture Rule Set — Module Federation ***
*** SoT: Brain Outputs/understanding/frontend/architecture/MODULE_FEDERATION_PATTERNS.md ***
*** Indexed 2026-05-15 by Brain SK Phase 3F ***

# Module Federation

> `@nx/module-federation` 22.7.1 + `@module-federation/enhanced` 2.1.0. Host has empty `remotes: []` — populated at runtime from JSON manifest via `RemoteRouteService.reloadRemotes()` (Wave 8 abstraction). Share-map is almost-fully eager for Angular + Falcon + rxjs; animations stay LOCAL (RUNTIME-006 avoidance); PrimeNG share-map branches deleted Wave PR-8.

## Source-of-truth file
- [MODULE_FEDERATION_PATTERNS](../../outputs/understanding/frontend/architecture/MODULE_FEDERATION_PATTERNS.md)

## Key rules extracted

| Rule id | Rule (one-line) | Severity | Cited file/line |
|---|---|---|---|
| AR-mf-01 | Host MF config MUST declare `remotes: []` empty — remotes are injected at runtime by `RemoteRouteService.reloadRemotes()` from JSON manifest. NOT baked in at build time. | high | `host-shell/module-federation.config.ts` |
| AR-mf-02 | `@angular/animations` + `@angular/platform-browser/animations` MUST NOT be shared (`return false` in share-map) — they stay LOCAL per app to avoid RUNTIME-006 (animation engine initialised twice). | high | share-map function |
| AR-mf-03 | `@angular/*` libraries MUST be shared with `singleton: true, strictVersion: true, eager: true` — Angular runtime contract requires one instance. | high | share-map function |
| AR-mf-04 | `@falcon` + `@falcon/*` MUST be shared with `singleton: true, strictVersion: false, eager: true` — host build governs version. | high | share-map function |
| AR-mf-05 | `rxjs` + `rxjs/operators` MUST be shared as eager singletons with `strictVersion: true` — one Observable instance for interop. | high | share-map function |
| AR-mf-06 | `zone.js` MUST NOT be shared — Wave Step 3 zoneless rollout removed it from polyfills. | high | absent from share-map |
| AR-mf-07 | `primeng/*` + `primeicons` MUST NOT be shared — DELETED Wave PR-8. ESLint flat-block live-fires on disallowed imports (`eslint.config.mjs:26`). | high | share-map branches removed |
| AR-mf-08 | `disableNxRuntimeLibraryControlPlugin: true` MUST be set — Falcon owns the share-map fully (opt-out of Nx's runtime lib control plugin). | medium | MF config |
| AR-mf-09 | Each remote MUST expose its `Routes` array via `entry.routes.ts` using triple-export (`remoteRoutes`, default, `routes`) — feeds `RemoteRouteService.findRoutes()` priority order. | high | `entry.routes.ts` |
| AR-mf-10 | Remote stylesheet hydration: `ensureRemoteStyles()` MUST inject `<link rel=stylesheet>` BEFORE remote's JS executes (FOUC prevention). Dev mode applies cache buster (`?t=<bootTimestamp>`) for localhost URLs. | high | `RemoteRouteService.ensureRemoteStyles()` |

## Share-map verbatim

| Library | Singleton | StrictVersion | Eager | Notes |
|---|---|---|---|---|
| `@angular/animations` + `…/animations` | — | — | — | NOT shared — LOCAL per app |
| `@angular/*` (other) | ✓ | ✓ | ✓ | Angular runtime contract |
| `@falcon` + `@falcon/*` | ✓ | ✗ | ✓ | Falcon libs |
| `rxjs` + `rxjs/operators` | ✓ | ✓ | ✓ | Observable interop |
| `uuid`, `tslib`, `jwt-decode` | ✓ | ✗ | ✓ | Small util singletons |
| `zone.js` | — | — | — | NOT shared — zoneless |
| `primeng/*`, `primeicons` | — | — | — | DELETED Wave PR-8 |
| Other libs | ✓ | ✗ | ✗ | Singleton lazy |

## Manifest schema

```ts
interface RemoteDefinition {
  name: string;
  remoteEntry: string;
  exposedModule: string;
  routePath: string;
  active: boolean;
  framework: string;
  displayName: string;
  exposeType: 'component' | 'module' | 'routes' | 'routingModule';
  entryType: 'manifest' | 'remoteEntry';
  requiredAccess?: AccessQuery[];
  styles?: string[];
}
```

## Wave 8 pluggable manifest provider
- `REMOTE_MANIFEST_PROVIDER` injection token.
- Default: `JsonFileRemoteManifestProvider` (fetches `/assets/module-federation.manifest.json`).
- Future: `ApiRemoteManifestProvider` (STUB — throws Error, awaiting `/api/v1/platform/remotes`).
- Binding swap is ONE LINE in `app.config.ts:106`.

## Forbidden patterns
- Adding `primeng/*` or `primeicons` back to the share-map.
- Sharing `@angular/animations` (causes RUNTIME-006).
- Sharing `zone.js` (zoneless rollout removed it).
- Baking remote URLs into build-time `remotes:` array — must stay runtime-driven.

## Webpack executor (not esbuild)
- All 3 apps use `@nx/angular:webpack-browser` (not `@angular/build:application`).
- esbuild migration considered but hasn't landed.
- Serve executor: `@nx/angular:module-federation-dev-server` with `devRemotes: ["admin-console", "management-console"]`.

## Verification helpers
- `npm run verify:mf` — `scripts/verify-mf.mjs`.
- `MF_SHOW_CONSOLE_LOG=true` env var enables per-package share-map logging.

## Related
- See [[Routes and Module Federation]] for the runtime route-injection flow.
- See [[Workspace Topology]] for the 4-remote manifest inventory (2 active, 2 inactive).

## Hubs
- [[FRONTEND_INDEX]] · [[COMPONENT_INDEX]] · [[BACKEND_INDEX]] · [[AMMAR_BRAIN_HOME]]
