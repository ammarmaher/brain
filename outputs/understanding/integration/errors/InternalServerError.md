*** Error code — InternalServerError ***
*** Catalogued 2026-05-15 by Brain SK Phase 3D ***

# `FalconKeys.Error.InternalServerError`

## Throwing service(s)
- **All 9 services** — universal catch-all for unhandled exceptions.

## HTTP status
- **500** Internal Server Error (Commerce explicit; others inferred)

## Scenario
- An unhandled exception bubbled to the middleware. The original cause is logged server-side; the FE only sees this generic code.
- Often paired with `UnknownError` (also 500) and `ExternalServiceError` (500) when the cause is a downstream service.

## UX handling
- **Toast** — "Something went wrong. Please try again. If the problem persists, contact your administrator."
- Include the correlation id (`X-Correlation-Id`) in the toast for ops triage.

## Related V-rule
- — (infrastructure)

## Related E-* entity
- — (cross-cutting)

## Related flow playbook
- (every flow)

## Hubs
- [[ERROR_INDEX]] · [[BACKEND_INDEX]] · [[VALIDATION_INDEX]]
