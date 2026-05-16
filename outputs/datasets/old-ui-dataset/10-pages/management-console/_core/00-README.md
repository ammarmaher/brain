---
type: app-core
app: management-console
source: origin/main @ 803ac1d1
extracted: 2026-05-16
extracted-by: deep-dive-agent-p8
---

# Management Console — App-level core

## TL;DR
Management-console is an Nx Module-Federation remote (`name: management-console`) exposing `./management-console` → `entry.routes.ts → app.routes.ts`. It is consumed by the host-shell and serves **Client users** (account admins, sub-account admins, normal users) — paths mount under `/management-console/*` on the host.

The root route applies `managementConsoleGuard`. The app default gateway is `Gateway.CoreGateway` (Client-facing gateway). All six feature routes register here:

```
account-administration → /organization-hierarchy            (NEW — UNIQUE to mgmt)
comms-hub              → /comm-mgmt                         (mirrors admin)
contact-groups         → /contact-groups                    (mirrors admin)
contracts-cost-mgmt    → /contracts-cost-management         (mirrors admin)
marketplace-apps       → /marketplace-applications          (mirrors admin)
wallet-balance-mgmt    → /wallet-balance-management         (mirrors admin)
```

## App-level routing
| File | Role |
|---|---|
| `apps/management-console/src/app/app.routes.ts:1-29` | Top-level routes — single `managementConsoleGuard`, six child route-arrays |
| `apps/management-console/src/app/app.config.ts:26-59` | ApplicationConfig — `Gateway.CoreGateway` default, Zitadel-aware HTTP interceptor |
| `apps/management-console/src/app/remote-entry/entry.routes.ts:1-4` | Federation entry — re-exports `routes` from `app.routes` |
| `apps/management-console/module-federation.config.ts:16-189` | MF config — `name: 'management-console'`, exposes `./management-console`, `@falcon` eager singleton |

### Root route structure (`app.routes.ts`)
```typescript
export const appRoutes: Routes = [
  {
    path: '',
    canActivate: [managementConsoleGuard],   // single guard for whole app
    children: [
      ...accountAdministrationRoutes,   // /organization-hierarchy
      ...commsHubRoutes,                // /comm-mgmt
      ...marketplaceApplicationsRoutes, // /marketplace-applications
      ...contractsCostManagementRoutes, // /contracts-cost-management
      ...walletBalanceManagementRoutes, // /wallet-balance-management
      ...contactGroupsRoutes,           // /contact-groups
    ],
  },
  { path: '**', redirectTo: '' },
];
```

### App-level guard
- `managementConsoleGuard` (from `@falcon`) — applied to every route. Per-route `shellAccessGuard` is then applied with `data.access = FalconAccess.managementConsole.*` to enforce PBAC.

## ApplicationConfig
```typescript
provideAppDefaultGateway(Gateway.CoreGateway)  // management-console → Client-facing Core Gateway
```

- HTTP interceptors: `RuntimeBaseUrlInterceptor` (resolves env per request)
- Shell env: `baseURL`, `baseURLPes`, `baseURLCoreGateway`, `baseURLSystemGateway`, `baseURLChargingGateway`, `baseURLIdentityGateway` — all empty defaults, populated at runtime by host
- PrimeNG configured via `createFalconPrimeNGConfig()`
- Falcon fallback facades injected via `provideFalconFallbackFacades()` (debug/standalone)
- Zone change detection enabled (NOT zoneless)

## Module Federation
| Setting | Value |
|---|---|
| `name` | `management-console` |
| `exposes` | `./management-console` → `src/app/remote-entry/entry.routes.ts` |
| Disabled NxRuntime plugin | `true` |
| `@falcon` lib | eager singleton (`strictVersion: false`, `eager: true`) |
| Angular packages | eager singleton (`strictVersion: true`) |
| PrimeNG / PrimeIcons | eager singleton |
| Animations | kept local (skipped from share) |

## Shared app-level resources
| Path | Role |
|---|---|
| `apps/management-console/src/app/shared/services/communication-channels-api.service.ts:1-39` | Fetches visible comm channels (`GET commerce/Node/{id}/comm-channels/visible`) — used by insufficient-balance-priority dialog |
| `apps/management-console/src/app/shared/components/insufficient-balance-priority-dialog/insufficient-balance-priority-dialog.component.ts:1-122` | Channel priority drag-drop dialog used by comm-channels-services-tab, apps-services-tab, comms-hub, marketplace-applications |
| `apps/management-console/src/app/shared/components/insufficient-balance-warning-dialog/insufficient-balance-warning-dialog.component.ts` | Warning dialog when wallet not configured / insufficient funds |
| `apps/management-console/debug/facade-smoke.initializer.ts` | Debug initialiser (smoke test) |
| `apps/management-console/mocks/falcon-fallback.providers.ts` | Falcon facade fallbacks when running standalone |

## No app-level `core/` folder
- Unlike admin-console which is similarly structured, management-console has **no `src/app/core/` folder** in this repo snapshot. Guards (`managementConsoleGuard`, `shellAccessGuard`) live in `@falcon` (libs/falcon/...) and are imported by the route files directly.

## Federation entry
```typescript
// remote-entry/entry.routes.ts
import { routes } from '../app.routes';
export const remoteRoutes = routes;
export default routes;
```

The host (host-shell or similar) loads the remote via `import('management-console/management-console')` and mounts the returned routes.
