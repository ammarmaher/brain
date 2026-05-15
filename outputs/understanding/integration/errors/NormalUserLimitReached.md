*** Error code — NormalUserLimitReached ***
*** Catalogued 2026-05-15 by Brain SK Phase 3D ***

# `FalconKeys.Error.NormalUserLimitReached`

## Throwing service(s)
- [[Commerce Service]] — handler-side quota check (`UserQuotaPolicy`)
- [[Identity Service]] — same code surfaces when Identity is the entry point

## HTTP status
- **422** Unprocessable Entity (Commerce explicit; Identity inferred)

## Scenario
- Account reached `MaxNormalUserLimit` setting. PRD-02 BR-UM-07/09/17/38 and PRD-01 BR-AM-11/12. A setting value of `0` means **no limit** per [[V-account-limits-zero-means-no-limit]].

## UX handling
- **Banner** at the Add User entry + **disable Add User button**.

## Related V-rule
- [[V-normal-user-limit-enforcement]] · [[V-account-limits-zero-means-no-limit]]

## Related E-* entity
- `E-AccountLimits` · `E-User`

## Related flow playbook
- [[Add User Flow]]

## Hubs
- [[ERROR_INDEX]] · [[BACKEND_INDEX]] · [[VALIDATION_INDEX]]
