*** Error code — InvalidTransferWallets ***
*** Catalogued 2026-05-15 by Brain SK Phase 3D ***

# `FalconKeys.Error.InvalidTransferWallets`

## Throwing service(s)
- [[Charging Service]] — `/transfer` handler

## HTTP status
- **422** Unprocessable Entity (inferred)

## Scenario
- Source/destination wallet combination is invalid: same id, currency mismatch, or scope mismatch. PRD-03 BR-CC-35.

## UX handling
- **Toast** with explanation.
- FE should prevent illegal combos client-side before submit where it has both wallet records.

## Related V-rule
- [[V-charging-transfer-source-destination]]

## Related E-* entity
- `E-Wallet`

## Related flow playbook
- (Wallet Transfer flow — playbook pending)

## Hubs
- [[ERROR_INDEX]] · [[BACKEND_INDEX]] · [[VALIDATION_INDEX]]
