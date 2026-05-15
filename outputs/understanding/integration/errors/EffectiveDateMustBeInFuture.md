*** Error code — EffectiveDateMustBeInFuture ***
*** Catalogued 2026-05-15 by Brain SK Phase 3D ***

# `FalconKeys.Error.EffectiveDateMustBeInFuture`

## Throwing service(s)
- [[Commerce Service]] — contract / pricing-change handler

## HTTP status
- **422** Unprocessable Entity (Commerce explicit)

## Scenario
- The scheduled effective date is in the past or today. PRD-03 BR-CC-07.

## UX handling
- **Inline at date field** + DatePicker min-date set to tomorrow.

## Related V-rule
- [[V-contract-expiration-after-start]]

## Related E-* entity
- `E-Contract`

## Related flow playbook
- (Edit Contract / Schedule Pricing Change — playbooks pending)

## Hubs
- [[ERROR_INDEX]] · [[BACKEND_INDEX]] · [[VALIDATION_INDEX]]
