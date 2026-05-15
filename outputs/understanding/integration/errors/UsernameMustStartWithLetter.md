*** Error code — UsernameMustStartWithLetter ***
*** Catalogued 2026-05-15 by Brain SK Phase 3D ***

# `FalconKeys.Error.UsernameMustStartWithLetter`

## Throwing service(s)
- [[Identity Service]] — FluentValidation on `CreateUserRequest.Username`
- [[Commerce Service]] — same code thrown during Step 5 wizard

## HTTP status
- **400** (Commerce explicit; Identity inferred)

## Scenario
- PRD-02 BR-UM-12: username must start with a letter. Identity FluentValidation also enforces the **drift**: PRD says `MaxLength=30`, backend says `MaximumLength=100`. Surface as gap.

## UX handling
- **Inline at field** with pattern hint shown live.
- FE pattern: `Validators.pattern(/^[A-Za-z]/)`.

## Related V-rule
- [[V-username-format-uniqueness-immutable]] — note the ≤30 vs ≤100 drift

## Related E-* entity
- `E-User`

## Related flow playbook
- [[Add Client Flow]] — Step 5 · [[Add User Flow]]

## Hubs
- [[ERROR_INDEX]] · [[BACKEND_INDEX]] · [[VALIDATION_INDEX]]
