*** Error code — InvalidCredentials ***
*** Catalogued 2026-05-15 by Brain SK Phase 3D ***

# `FalconKeys.Error.InvalidCredentials`

## Throwing service(s)
- [[Identity Service]] — login handler
- [[Commerce Service]] — also catalogued (rare)

## HTTP status
- **401** Unauthorized

## Scenario
- Wrong username/password. After 3 attempts the account flips to `UserLocked` (423).

## UX handling
- **Inline at password field** with attempts-remaining hint when known.

## Related V-rule
- [[V-login-lockout-3-wrong-attempts]]

## Related E-* entity
- `E-User`

## Related flow playbook
- (Login flow — playbook pending)

## Hubs
- [[ERROR_INDEX]] · [[BACKEND_INDEX]] · [[VALIDATION_INDEX]]
