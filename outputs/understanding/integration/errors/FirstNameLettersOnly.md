*** Error code — FirstNameLettersOnly ***
*** Catalogued 2026-05-15 by Brain SK Phase 3D ***

# `FalconKeys.Error.FirstNameLettersOnly`

## Throwing service(s)
- [[Identity Service]] — FluentValidation on user create/update
- [[Commerce Service]] — same code thrown during Step 5 wizard

## HTTP status
- **400** (Commerce explicit; Identity inferred)

## Scenario
- First name contains non-letter characters. PRD-02 BR-UM-11.

## UX handling
- **Inline at field** with hint "Letters only".
- FE pattern: `Validators.pattern(/^[A-Za-z\s]+$/)`.

## Related V-rule
- [[V-user-first-last-name-letters-only]]

## Related E-* entity
- `E-User`

## Related flow playbook
- [[Add Client Flow]] — Step 5 · [[Add User Flow]]

## Hubs
- [[ERROR_INDEX]] · [[BACKEND_INDEX]] · [[VALIDATION_INDEX]]
