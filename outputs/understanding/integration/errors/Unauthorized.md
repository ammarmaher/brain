*** Error code — Unauthorized ***
*** Catalogued 2026-05-15 by Brain SK Phase 3D ***

# `FalconKeys.Error.Unauthorized`

## Throwing service(s)
- [[Commerce Service]] · [[Identity Service]] — platform code (framework also emits raw 401 for missing JWT)

## HTTP status
- **401** Unauthorized (Commerce explicit)

## Scenario
- Missing or invalid JWT. Differs from `Forbidden` (403) which means JWT is valid but the caller lacks the required permission.

## UX handling
- **Force re-login**. Clear local session, redirect to login.

## Related V-rule
- — (cross-cutting)

## Related E-* entity
- `E-User`

## Related flow playbook
- (every authenticated flow)

## Hubs
- [[ERROR_INDEX]] · [[BACKEND_INDEX]] · [[VALIDATION_INDEX]]
