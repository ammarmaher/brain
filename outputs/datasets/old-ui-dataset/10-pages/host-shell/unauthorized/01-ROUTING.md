# Routing — unauthorized

## Routes
| Path | Component | Lazy? | Guards | Resolvers | Params | Data |
|---|---|---|---|---|---|---|
| `'401'` | `UnauthorizedComponent` | no | — | — | — | `breadcrumb: 'Unauthorized'` |

Defined: `apps/host-shell/src/app/app.routes.ts:57-61`. Top-level route, outside `LayoutComponent` parent.

## Guard implementations
None on this route. The whole point is to be reachable when other PES guards deny.

## Resolver implementations
None.

## Navigation entry points
- `router.navigate(['/401'])` — invoked by `@falcon/shellPrimeAccessGuard` when `SHELL_CORE_ACCESS` is denied.
- `router.navigate(['/401'])` — invoked by `@falcon/shellAccessGuard` when a route's `data.access` query is denied.
- `LayoutComponent.navigateToAdminConsole` → fallback redirect when `routeAccessService.canAccessPath()` returns false (`layout.component.ts:521-525`).
- Constant `APP_ROUTES.UNAUTHORIZED` (in `@falcon`) is the canonical reference.
