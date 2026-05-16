# Routing — dashboard

## Routes
| Path | Component | Lazy? | Guards | Resolvers | Params | Data |
|---|---|---|---|---|---|---|
| `''` (default child of LayoutComponent) | `DashboardComponent` | no | (inherits `authGuard`, `shellPrimeAccessGuard` from LayoutComponent parent) | — | — | `breadcrumb: 'Dashboard'` |

Defined: `apps/host-shell/src/app/app.routes.ts:19-24`.

## Route module
- Not lazy. Component is direct-imported into `app.routes.ts`.

## Guard implementations
- Inherits from LayoutComponent parent. See `_core/01-ROUTING.md`.

## Resolver implementations
None.
