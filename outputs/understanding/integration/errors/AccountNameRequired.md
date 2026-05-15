*** Error code — AccountNameRequired ***
*** Catalogued 2026-05-15 by Brain SK Phase 3D ***

# `FalconKeys.Error.AccountNameRequired`

## Throwing service(s)
- [[Commerce Service]] — Step 1 of `CreateAccountRequest` when `Info.AccountName` is null/empty

## HTTP status
- **400** (Commerce uses explicit `[ErrorHttpStatus(400)]`)

## Scenario
- Wizard Step 1 — Account Information — `account-name` field submitted blank.
- Mirror of generic `RequiredFieldMissing` but with a dedicated code so the FE can inline the message at the correct field.

## UX handling
- **Inline at field** in the Add Client wizard Step 1.
- Falls back to a toast if the field can't be matched.

## Related V-rule
- [[V-account-name-format-uniqueness]]

## Related E-* entity
- `E-Account` (Commerce primary entity)

## Related flow playbook
- [[Add Client Flow]] — Step 1 Account Information

## Hubs
- [[ERROR_INDEX]] · [[BACKEND_INDEX]] · [[VALIDATION_INDEX]]
