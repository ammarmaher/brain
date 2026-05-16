# PES — Demo

## Permission keys used
| Key path | Where checked | File:line |
|---|---|---|
| `FalconAccess.authView.view()` | route data on `/auth-view` | `app.routes.ts:36` |

## AccessControlFacade usage
- `shellAccessGuard` reads `route.data.access` (`AccessQuery`) and runs `accessControlFacade.can(query)` to gate the `/auth-view` route.

## Route guards
- `/shell` — no extra guard beyond LayoutComponent inheritance.
- `/auth-view` — `shellAccessGuard`.

## Eligibility / Subscription checks
None.

## Implicit gating
- The Demo feature is intentionally hidden from the sidebar (`navItems` in `layout.component.ts` does not include `'/shell'` or `'/auth-view'`). Users would reach them only via direct URL or via the legacy "Return to Home" links in error pages.
