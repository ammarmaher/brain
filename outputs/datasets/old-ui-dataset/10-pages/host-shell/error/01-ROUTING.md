# Routing — error

## Routes
| Path | Component | Lazy? | Guards | Resolvers | Params | Data |
|---|---|---|---|---|---|---|
| `'error'` | `ErrorComponent` | no | — | — | — | `breadcrumb: 'Error'` |

Defined: `apps/host-shell/src/app/app.routes.ts:67-71`. Top-level route, outside `LayoutComponent` parent.

## Guard implementations
None.

## Resolver implementations
None.

## Navigation entry points
`[INFERRED]` — `router.navigate(['/error'])` from inside auth-check flow / interceptor when fundamental authorization plumbing fails. No callers in the code I have read explicitly call this route — likely set by a `@falcon`-level recovery handler.
