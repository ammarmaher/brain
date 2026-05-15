*** Error code — AccountNameTooLong ***
*** Catalogued 2026-05-15 by Brain SK Phase 3D ***

# `FalconKeys.Error.AccountNameTooLong`

## Throwing service(s)
- [[Commerce Service]] — `CreateAccountRequest.Info.AccountName` > 30 chars

## HTTP status
- **400** (Commerce explicit `[ErrorHttpStatus(400)]`)

## Scenario
- PRD-01 caps Account Name at **≤ 30 characters**. Backend uses `[ThrowIfMaxLengthExceed(30)]` on the DTO field. Generic `MaxLengthExceeded` is the platform-level companion code.

## UX handling
- **Inline at field** with character-count counter.

## Related V-rule
- [[V-account-name-format-uniqueness]]

## Related E-* entity
- `E-Account`

## Related flow playbook
- [[Add Client Flow]] — Step 1

## Hubs
- [[ERROR_INDEX]] · [[BACKEND_INDEX]] · [[VALIDATION_INDEX]]
