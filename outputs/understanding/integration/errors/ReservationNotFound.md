*** Error code — ReservationNotFound ***
*** Catalogued 2026-05-15 by Brain SK Phase 3D ***

# `FalconKeys.Error.ReservationNotFound`

## Throwing service(s)
- [[Charging Service]] — `/commit`, `/release` handlers

## HTTP status
- **404** Not Found (inferred)

## Scenario
- Three causes (all surface the same code):
  1. Reservation id doesn't exist.
  2. Reservation has expired (auto-released by the background sweeper).
  3. Reservation has already been committed/released.

## UX handling
- FE should **retry the full reserve-commit cycle** when this fires on a `Commit`, not just retry `Commit`.
- Toast with a clear message ("Please retry the operation.").

## Related V-rule
- — (lifecycle)

## Related E-* entity
- `E-Reservation`

## Related flow playbook
- (Reserve-Commit flow — playbook pending)

## Hubs
- [[ERROR_INDEX]] · [[BACKEND_INDEX]] · [[VALIDATION_INDEX]]
