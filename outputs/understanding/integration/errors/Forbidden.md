*** Error code — Forbidden ***
*** Catalogued 2026-05-15 by Brain SK Phase 3D ***

# `FalconKeys.Error.Forbidden`

## Throwing service(s)
- [[Commerce Service]] · [[Identity Service]] — generic policy rejection

## HTTP status
- **403** Forbidden (Commerce explicit)

## Scenario
- JWT valid, but the caller does not have the required policy / permission. More specific variants: `UnauthorizedAction`, `UnauthorizedUserToPerformThisAction`, `UnauthorizedProfileEdit`, `ForbiddenTo*`.

## UX handling
- **Toast** + **disable action** (`AccessControlFacade` should hide the action client-side via PES gating where possible).

## Related V-rule
- — (cross-cutting)

## Related E-* entity
- `E-User` · `E-Role`

## Related flow playbook
- (every permission-gated flow)

## Hubs
- [[ERROR_INDEX]] · [[BACKEND_INDEX]] · [[VALIDATION_INDEX]]
