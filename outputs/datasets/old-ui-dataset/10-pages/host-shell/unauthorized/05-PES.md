# PES — unauthorized

## Permission keys used
None on the unauthorized page itself.

## AccessControlFacade usage
None.

## Route guards
None — by design (this is the PES denial destination).

## Eligibility / Subscription checks
None.

## Why this page exists
`shellPrimeAccessGuard`, `shellAccessGuard`, and component-level access checks redirect to `/401` when a query returns `false`. So this page IS the visible side of every PES denial flow.
