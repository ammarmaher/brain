*** Error code — DuplicateUsername ***
*** Catalogued 2026-05-15 by Brain SK Phase 3D ***

# `FalconKeys.Error.DuplicateUsername`

## Throwing service(s)
- [[Identity Service]] — owns user lifecycle; throws on `/user/create`, `/user/exist`
- [[Commerce Service]] — throws during Step 5 (Account Owner User) of `CreateAccountRequest` wizard when Identity returns the conflict

## HTTP status
- **409** Conflict (Commerce explicit; Identity inferred but documented in its ERRORS catalog)

## Scenario
- Username must be unique across Falcon (case-insensitive). Identity is the canonical owner; Commerce throws the same code when its account-creation flow calls Identity and gets the conflict back. Username is immutable after creation per [[V-username-format-uniqueness-immutable]].

## UX handling
- **Inline at field** (Step 5 username field in Add Client; Add User username field).
- Live async existence check via `/user/exist` recommended before submit.

## Related V-rule
- [[V-username-format-uniqueness-immutable]]

## Related E-* entity
- `E-User` (Identity primary entity)

## Related flow playbook
- [[Add Client Flow]] — Step 5 · [[Add User Flow]]

## Hubs
- [[ERROR_INDEX]] · [[BACKEND_INDEX]] · [[VALIDATION_INDEX]]
