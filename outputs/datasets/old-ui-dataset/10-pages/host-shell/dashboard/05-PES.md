# PES — dashboard

## Permission keys used
None.

## AccessControlFacade usage
None.

## Route guards
Inherits from `LayoutComponent` parent (see `_core/01-ROUTING.md`):
- `authGuard` — requires authenticated session.
- `shellPrimeAccessGuard` — requires `managementConsole.enter()` (clients) OR `adminConsole.enter()` (Falcon users).

## Eligibility / Subscription checks
None.

## Implicit gating
- Greets the user by their session name; if no session, falls back to `'User'`. No defensive PES check — protected by parent route guard.
- `[INFERRED]` Future-state: if dashboard tiles become role-aware (Falcon vs Client should see different KPIs), each tile would need its own access query.
