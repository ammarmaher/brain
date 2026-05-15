*** Error code — PriceValueNotConfigured ***
*** Catalogued 2026-05-15 by Brain SK Phase 3D ***

# `FalconKeys.Error.PriceValueNotConfigured`

## Throwing service(s)
- [[Commerce Service]] — service-visibility / pricing handlers

## HTTP status
- **422** Unprocessable Entity (Commerce explicit)

## Scenario
- A visible product/service has no configured price value. PRD-01 BR-AM-14..17 require pricing for visible services.

## UX handling
- **Inline at pricing step** + **disable Save** until price is configured.

## Related V-rule
- [[V-service-visibility-pricing-required]]

## Related E-* entity
- `E-Product` · `E-Pricing`

## Related flow playbook
- [[Add Client Flow]] — pricing step

## Hubs
- [[ERROR_INDEX]] · [[BACKEND_INDEX]] · [[VALIDATION_INDEX]]
