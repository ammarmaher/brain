*** Error code — InvalidAccountLimits ***
*** Catalogued 2026-05-15 by Brain SK Phase 3D ***

# `FalconKeys.Error.InvalidAccountLimits`

## Throwing service(s)
- [[Commerce Service]] — handler-side check on Account Limits update

## HTTP status
- **422** Unprocessable Entity (Commerce explicit)

## Scenario
- A combination of account-limit fields (e.g. `MaxNormalUserLimit`, `MaxAdminUserLimit`, `MaxNodeLevel`) is invalid as a set. Per-field validators are not present on the DTO — the validation is handler-level. **Drift**: per-field `[ThrowIf*]` would give more granular FE feedback (surfaced in [[V-account-limits-zero-means-no-limit]]).

## UX handling
- **Inline** at field with a generic message; the FE may not be able to point to a specific field because the backend ships a single combined error.

## Related V-rule
- [[V-account-limits-zero-means-no-limit]]

## Related E-* entity
- `E-AccountLimits`

## Related flow playbook
- (Account Limits settings flow — playbook pending)

## Hubs
- [[ERROR_INDEX]] · [[BACKEND_INDEX]] · [[VALIDATION_INDEX]]
