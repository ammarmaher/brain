*** Error code — ContractEditOnlyAllowedWhenPending ***
*** Catalogued 2026-05-15 by Brain SK Phase 3D ***

# `FalconKeys.Error.ContractEditOnlyAllowedWhenPending`

## Throwing service(s)
- [[Commerce Service]] — contract edit handler-time gate

## HTTP status
- **422** Unprocessable Entity (Commerce explicit)

## Scenario
- The contract is not in `Pending` status; edits are blocked. PRD-03 BR-CC-15/16. `ContractResponse.CanEdit` boolean is exposed to the FE so the form can be disabled pre-emptively.

## UX handling
- **Banner** at top of the contract form + **disable form** when `CanEdit=false`. If the gate fires server-side anyway (race), show the banner with explanation.

## Related V-rule
- [[V-contract-edit-status-aware-fields]]

## Related E-* entity
- `E-Contract`

## Related flow playbook
- (Edit Contract flow — playbook pending)

## Hubs
- [[ERROR_INDEX]] · [[BACKEND_INDEX]] · [[VALIDATION_INDEX]]
