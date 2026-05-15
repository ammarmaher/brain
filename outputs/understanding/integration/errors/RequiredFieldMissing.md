*** Error code — RequiredFieldMissing ***
*** Catalogued 2026-05-15 by Brain SK Phase 3D ***

# `FalconKeys.Error.RequiredFieldMissing`

## Throwing service(s)
- [[Commerce Service]] · [[Identity Service]] · [[Templates Service]] · [[Contact Group Service]] — generic across all DTOs

## HTTP status
- **400** Bad Request (Commerce explicit; others inferred)

## Scenario
- Generic `[ThrowIfNotPassed]` / `NotEmpty` violation. Used wherever the DTO has no dedicated code for a specific field (e.g. `AccountNameRequired` for `AccountName` exists, but a less-common field falls back to `RequiredFieldMissing`).

## UX handling
- **Inline at field** when the error carries field-context, **toast fallback** otherwise.

## Related V-rule
- [[V-account-name-format-uniqueness]] (one of many — `RequiredFieldMissing` is cross-cutting)

## Related E-* entity
- — (cross-cutting)

## Related flow playbook
- (every Create / Edit flow)

## Hubs
- [[ERROR_INDEX]] · [[BACKEND_INDEX]] · [[VALIDATION_INDEX]]
