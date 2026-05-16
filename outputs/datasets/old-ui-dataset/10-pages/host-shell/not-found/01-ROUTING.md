# Routing — not-found

## Routes
| Path | Component | Lazy? | Guards | Resolvers | Params | Data |
|---|---|---|---|---|---|---|
| `'not-found'` | `NotFoundComponent` | no | — | — | — | `breadcrumb: 'Not Found'` |

Defined: `apps/host-shell/src/app/app.routes.ts:62-66`. Top-level route, outside `LayoutComponent` parent.

## Catch-all
The host's catch-all is `{ path: '**', redirectTo: '' }` (`app.routes.ts:77`), so unmatched URLs go to the dashboard, NOT `/not-found`. The `/not-found` route is reached only explicitly (e.g. `router.navigate(['/not-found'])` from inside a remote micro-frontend that wants to indicate "this sub-feature is under construction").

## Guard implementations
None.

## Resolver implementations
None.
