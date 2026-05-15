*** Error code — HiddenProductMustNotHavePricing ***
*** Catalogued 2026-05-15 by Brain SK Phase 3D ***

# `FalconKeys.Error.HiddenProductMustNotHavePricing`

## Throwing service(s)
- [[Commerce Service]] — pricing handler

## HTTP status
- **422** Unprocessable Entity (Commerce explicit)

## Scenario
- A hidden product was given pricing — the rule (PRD-01 BR-AM-14..17) requires hidden products NOT to carry pricing fields.

## UX handling
- **Inline at pricing step**; clear pricing fields when product is toggled hidden.

## Related V-rule
- [[V-service-visibility-pricing-required]]

## Related E-* entity
- `E-Product` · `E-Pricing`

## Related flow playbook
- [[Add Client Flow]] — pricing step

## Hubs
- [[ERROR_INDEX]] · [[BACKEND_INDEX]] · [[VALIDATION_INDEX]]
