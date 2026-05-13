# Module Federation Patterns — Falcon Frontend

**Stack:** `@nx/module-federation` 22.7.1 + `@module-federation/enhanced` 2.1.0 + `@nx/angular` 22.7.1.

---

## 1. Host config — `apps/host-shell/module-federation.config.ts`

```ts
import { ModuleFederationConfig } from '@nx/module-federation';

const showConsoleLog = process.env.MF_SHOW_CONSOLE_LOG === 'true' || process.env.MF_SHOW_CONSOLE_LOG === '1';
const log = (...args: any[]) => { if (showConsoleLog) console.log(...args); };

const config: ModuleFederationConfig = {
  name: 'host-shell',
  remotes: [],                                  // EMPTY — populated at runtime from manifest
  disableNxRuntimeLibraryControlPlugin: true,

  shared: (libraryName: string, sharedConfig: any) => {
    // Animations stay local to avoid RUNTIME-006
    if (libraryName.startsWith('@angular/animations') ||
        libraryName.startsWith('@angular/platform-browser/animations')) {
      return false;
    }

    // Falcon unified libs — singleton eager
    if (libraryName === '@falcon' || libraryName.startsWith('@falcon/')) {
      return { ...sharedConfig, singleton: true, strictVersion: false, requiredVersion: 'auto', eager: true };
    }

    // EAGER — Angular runtime contract
    if (libraryName.startsWith('@angular/')) {
      return { ...sharedConfig, singleton: true, strictVersion: true, requiredVersion: 'auto', eager: true };
    }

    // rxjs/operators — eager singletons
    if (libraryName === 'rxjs' || libraryName === 'rxjs/operators') {
      return { ...sharedConfig, singleton: true, strictVersion: true, requiredVersion: 'auto', eager: true };
    }

    // Small util singletons (uuid / jwt-decode / tslib)
    if (libraryName === 'uuid' || libraryName === 'tslib' || libraryName.startsWith('jwt-decode')) {
      return { ...sharedConfig, singleton: true, strictVersion: false, requiredVersion: 'auto', eager: true };
    }

    // Default — singleton lazy
    return { ...sharedConfig, singleton: true, strictVersion: false, requiredVersion: 'auto', eager: false };
  },

  additionalShared: [
    ['@falcon',     { singleton: true, strictVersion: false, requiredVersion: 'auto', eager: true }],
    ['@falcon/sdk', { singleton: true, strictVersion: false, requiredVersion: 'auto', eager: true }],
  ],
};

export default config;
```

### Notable

- **`remotes: []`** — host does NOT bake in remote URLs at build time. They're injected at runtime by `RemoteRouteService.reloadRemotes()` reading the JSON manifest.
- **`disableNxRuntimeLibraryControlPlugin: true`** — opt-out of Nx's runtime lib control plugin; Falcon owns the share-map fully.
- **`additionalShared`** explicitly declares `@falcon` + `@falcon/sdk` as eager-shared even if no import statement triggers the share-map function. Ensures the host pre-loads these.

---

## 2. Remote configs — admin-console / management-console

Both follow the same share-map shape as the host, plus an `exposes` block:

```ts
const config: ModuleFederationConfig = {
  name: 'admin-console' /* or 'management-console' */,
  disableNxRuntimeLibraryControlPlugin: true,
  exposes: {
    './admin-console': join(__dirname, 'src/app/remote-entry/entry.routes.ts'),
    // OR './management-console': 'src/app/remote-entry/entry.routes.ts'
  },
  additionalShared: [
    ['@falcon',     { singleton: true, strictVersion: false, requiredVersion: 'auto', eager: true }],
    ['@falcon/sdk', { singleton: true, strictVersion: false, requiredVersion: 'auto', eager: true }],
  ],
  shared: (libraryName, sharedConfig) => { /* same share-map as host */ },
};
```

### Each remote exposes a Routes array via `entry.routes.ts`:

```ts
// apps/admin-console/src/app/remote-entry/entry.routes.ts
import { routes } from '../app.routes';
export const remoteRoutes = routes;
export default routes;
```

The triple-export pattern (`remoteRoutes`, default, plus the original `routes`/`appRoutes` from `app.routes.ts`) feeds `RemoteRouteService.findRoutes()`'s priority order: `m.remoteRoutes ?? m.default ?? m.appRoutes ?? m.routes`.

---

## 3. Share rules — verbatim summary

| Library | Singleton | StrictVersion | Eager | Notes |
|---|---|---|---|---|
| `@angular/animations` + `@angular/platform-browser/animations` | — | — | — | **NOT shared** — return `false`. Stays LOCAL per app. Avoids RUNTIME-006. |
| `@angular/*` (anything else) | ✓ | ✓ | ✓ | Angular runtime contract — must be one instance. |
| `@falcon` + `@falcon/*` | ✓ | ✗ | ✓ | Falcon libs share eagerly with loose version match (so the host build governs them). |
| `rxjs` + `rxjs/operators` | ✓ | ✓ | ✓ | One instance — keeps observables interoperable. |
| `uuid`, `tslib`, `jwt-decode` | ✓ | ✗ | ✓ | Small utility singletons. |
| `zone.js` | — | — | — | **NOT shared** — Wave Step 3 zoneless rollout removed from polyfills. |
| `primeng/*`, `primeicons` | — | — | — | **DELETED** in Wave PR-8. Share-map branches removed. ESLint flat block live-fires on disallowed imports. |
| All other libs | ✓ | ✗ | ✗ | Singleton lazy. |

---

## 4. Why animations stay local

`@angular/animations` + `@angular/platform-browser/animations` carry runtime initialisation state via `BrowserAnimationsModule` / `provideAnimationsAsync()`. Sharing them across MF boundaries triggers `RUNTIME-006` (animation engine initialised twice, conflicting registrations). Each app keeps its own animation engine instance — small bundle cost, no runtime conflict.

Memory `feedback_brain_skill` + `project_falcon_revamp_v3_1_night_shift_results.md` document this as a hard constraint.

---

## 5. Pluggable manifest provider (Wave 8)

The remote URL list is fetched at runtime, not baked in. The provider is pluggable.

### Token

```ts
// apps/host-shell/src/app/core/module-federation/remote-manifest.types.ts
export const REMOTE_MANIFEST_PROVIDER = new InjectionToken<RemoteManifestProvider>('REMOTE_MANIFEST_PROVIDER');

export const REMOTE_MANIFEST_URL = new InjectionToken<string>('REMOTE_MANIFEST_URL', {
  providedIn: 'root',
  factory: () => '/assets/module-federation.manifest.json',
});

export interface RemoteManifestProvider {
  load(): Promise<RemoteManifest>;
}

export type RemoteManifest = RemoteConfig;
```

### Default provider (JSON file)

```ts
// apps/host-shell/src/app/core/module-federation/json-file-remote-manifest.provider.ts
@Injectable({ providedIn: 'root' })
export class JsonFileRemoteManifestProvider implements RemoteManifestProvider {
  private readonly http = inject(HttpClient);
  private readonly url = inject(REMOTE_MANIFEST_URL);

  load(): Promise<RemoteManifest> {
    return firstValueFrom(this.http.get<RemoteManifest>(this.url));
  }
}
```

### Future provider (API) — STUB

```ts
// apps/host-shell/src/app/core/module-federation/api-remote-manifest.provider.ts
@Injectable({ providedIn: 'root' })
export class ApiRemoteManifestProvider implements RemoteManifestProvider {
  // private readonly http = inject(HttpClient);
  // private readonly endpoint = '/api/v1/platform/remotes';

  load(): Promise<RemoteManifest> {
    throw new Error('ApiRemoteManifestProvider is not yet implemented. See README.md.');
    // return firstValueFrom(this.http.get<RemoteManifest>(this.endpoint));
  }
}
```

### Binding swap (one-line change)

```ts
// apps/host-shell/src/app/app.config.ts:106
{ provide: REMOTE_MANIFEST_PROVIDER, useExisting: JsonFileRemoteManifestProvider }
// Swap to:
// { provide: REMOTE_MANIFEST_PROVIDER, useExisting: ApiRemoteManifestProvider }
```

Memory `project_falcon_revamp_v3_1_night_shift_results.md` confirms: "RemoteManifestProvider abstraction" landed in Wave 8.

---

## 6. Manifest schema (`RemoteDefinition`)

```ts
// apps/host-shell/src/app/core/services/remote-config.ts
export interface RemoteDefinition {
  name: string;              // MF webpack name (matches `name:` in the remote's MF config)
  remoteEntry: string;       // URL to remoteEntry.{js|mjs} or mf-manifest.json
  exposedModule: string;     // './admin-console', './management-console', etc.
  routePath: string;         // path segment in host router
  active: boolean;
  framework: string;         // 'angular-internal' / 'react' / ...
  displayName: string;
  exposeType: RemoteExposeType;     // 'component' | 'module' | 'routes' | 'routingModule'
  entryType: RemoteEntryType;       // 'manifest' | 'remoteEntry'
  requiredAccess?: AccessQuery[];
  styles?: string[];
}

export type RemoteConfig = Record<string, RemoteDefinition>;
```

---

## 7. Per-remote stylesheet hydration

`RemoteRouteService.ensureRemoteStyles()` injects each remote's `styles.css` `<link>` into the host's `<head>` BEFORE the remote's JS executes. Pattern:

1. Compute `styles` URL: explicit `def.styles[]` OR auto-derive `new URL('styles.css', def.remoteEntry).href`.
2. Apply dev cache buster (`?t=<bootTimestamp>`) for `localhost` / `127.0.0.1` URLs.
3. Skip if URL already loaded (idempotent set).
4. Remove stale `<link[data-remote-style=<remoteName>]>` if URL changed.
5. Append `<link rel="stylesheet" data-remote-style data-remote-style-href>` and `await` the `load` event.
6. Resolve on `error` too (don't block).

**Why** — remotes ship their own Tailwind output + per-app overrides; host needs them present before the remote DOM mounts to avoid FOUC.

---

## 8. Webpack custom configs

Each app has TWO webpack config files:

- `apps/<app>/webpack.config.ts` — dev mode (`@nx/module-federation/webpack` plugin wrapper).
- `apps/<app>/webpack.prod.config.ts` — prod mode.

`apps/<app>/project.json` references both via `customWebpackConfig.path`.

The build executor is **`@nx/angular:webpack-browser`** for all 3 apps (not the newer `@angular/build:application` esbuild executor). Memory `project_falcon_next_wave_brief_dispatched.md` notes esbuild migration was considered but hasn't landed.

### Serve executor

`@nx/angular:module-federation-dev-server` runs host-shell with `devRemotes: ["admin-console", "management-console"]` — same dev server spawns/wires both remotes.

---

## 9. Eager vs Lazy decision matrix

The current setup is **almost-fully eager** for Falcon + Angular + rxjs:

- **Eager (`eager: true`)** — Angular runtime, Falcon libs, rxjs, uuid/tslib/jwt-decode. **Pro:** zero late-binding errors, no async race conditions. **Con:** larger initial bundle.
- **Lazy default** — anything else. Loaded on first import within a remote. **Pro:** smaller initial bundle. **Con:** can cause stutter on first remote navigation.

The MF audit decided eager-everything-Angular + Falcon because:

1. Angular runtime must be one instance — `strictVersion: true` enforces this; eager guarantees it's loaded before any remote tries to register.
2. Falcon libs are pervasive — almost every Angular wrapper imports from `@falcon/ui-core/angular`. Lazy would cause repeated re-bundling per remote.
3. rxjs interop relies on one Observable instance.

---

## 10. Verification helpers

- `apps/host-shell/scripts/verify-mf.mjs` — npm script `verify:mf` — runs Nx-supplied verification on the host's MF graph.
- `apps/host-shell/src/app/core/module-federation/mf-diagnostic.service.ts` — runtime diagnostic helpers (not deeply audited; flagged for future exploration).
- `MF_SHOW_CONSOLE_LOG=true|1` env var enables per-package share-map logging at build time.

---

## 11. Wave PR-8 cleanup verified

Memory `project_falcon_primeng_total_removal_complete.md` claims:

- PrimeNG share-map branches deleted from all 3 MF configs. **VERIFIED.** No `primeng/*` / `primeicons` references in any active MF config.
- `additionalShared` entries for PrimeNG removed. **VERIFIED.**
- ESLint flat-block live-fires on disallowed PrimeNG imports. **VERIFIED in `eslint.config.mjs:26`** (declares `primeng` is forbidden).

The result: `remoteEntry.mjs` for each app NEVER carries PrimeNG bytes.

---

## 12. Manifest entries inventory

| Manifest key | Active | Used by Brain SK | Notes |
|---|---|---|---|
| `admin-console` | ✓ | Yes — main consumer of admin-side UI | Routes mode, expose `./admin-console`, requires `view app.admin-console`. |
| `management-console` | ✓ | Yes — client-facing consumer | Routes mode, expose `./management-console`, requires `view app.management-console`. |
| `demo-app` | ✗ | No | External `falconhub.space` URL, exposes `./users` component, deactivated. |
| `user-app` | ✗ | No | External `falconhub.space` URL, exposes `./survey` module, deactivated. |

---

## 13. The dead-code sibling — `apps/host-shell/src/app/remote-route.service.ts`

A SECOND `remote-route.service.ts` exists at the app root. **It is dead code.** `bootstrap.ts` imports from `./app/core/services/remote-route.service`, not `./app/remote-route.service`. The root-level file is an older version (subscribes inside `reloadRemotes()` returning void; lacks the Wave-8 `manifestProvider` abstraction; uses `firstValueFrom` indirectly through HttpClient subscribe pattern).

**Recommended cleanup:** delete `apps/host-shell/src/app/remote-route.service.ts` and `apps/host-shell/src/app/remote-config.ts` (the sibling at app root, NOT the active one at `core/services/remote-config.ts`).
