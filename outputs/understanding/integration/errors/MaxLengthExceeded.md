*** Error code — MaxLengthExceeded ***
*** Catalogued 2026-05-15 by Brain SK Phase 3D ***

# `FalconKeys.Error.MaxLengthExceeded`

## Throwing service(s)
- [[Commerce Service]] · [[Identity Service]] · [[Contact Group Service]] — generic platform code

## HTTP status
- **400** Bad Request (Commerce explicit; others inferred)

## Scenario
- Generic `[ThrowIfMaxLengthExceed]` / `MaximumLength` violation. Specialized codes (e.g. `AccountNameTooLong`) exist for high-traffic fields; lower-traffic fields fall back to this code.

## UX handling
- **Inline at field** with character-count counter.

## Related V-rule
- [[V-account-name-format-uniqueness]] (one consumer; rule is cross-cutting)

## Related E-* entity
- — (cross-cutting)

## Related flow playbook
- (every Create / Edit flow)

## Hubs
- [[ERROR_INDEX]] · [[BACKEND_INDEX]] · [[VALIDATION_INDEX]]
