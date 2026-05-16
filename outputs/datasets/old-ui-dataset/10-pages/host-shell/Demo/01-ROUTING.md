# Routing — Demo

## Routes
| Path | Component | Lazy? | Guards | Resolvers | Params | Data |
|---|---|---|---|---|---|---|
| `'shell'` (child of LayoutComponent) | `ShellComponent` | no | (inherits) | — | — | `breadcrumb: 'Shell '` |
| `'auth-view'` (child of LayoutComponent) | `AuthViewComponent` | no | `shellAccessGuard` | — | — | `breadcrumb: 'Auth View'`, `access: FalconAccess.authView.view()` |

Defined: `apps/host-shell/src/app/app.routes.ts:25-38`.

## Guard implementations
- `/shell` inherits the parent `LayoutComponent` guards (`authGuard`, `shellPrimeAccessGuard`).
- `/auth-view` adds `shellAccessGuard` which reads `route.data.access = FalconAccess.authView.view()` and runs `AccessControlFacade.can(query)`. Denial → `/401`.

## Resolver implementations
None.

## Why this exists
Developer tooling — to verify facade wiring during local development. Not exposed via the sidebar navigation. Reachable only via direct URL (`#/shell`) or via the legacy "Return to Home" links in the error/unauthorized/not-found pages (which redirect to `/shell`, NOT `/`).
