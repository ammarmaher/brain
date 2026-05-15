*** Error code — InsufficientBalance ***
*** Catalogued 2026-05-15 by Brain SK Phase 3D ***

# `FalconKeys.Error.InsufficientBalance`

## Throwing service(s)
- [[Charging Service]] — wallet handlers (`/debit`, `/authorize`, `/reserve`, `/transfer`)

## HTTP status
- **422** Unprocessable Entity (inferred — Charging has no `[ErrorHttpStatus]` decorations)

## Scenario
- Requested amount exceeds the available wallet balance. Handler-level check; no DTO attribute. Per PRD-03 BR-CC-32.

## UX handling
- **Modal** — the dedicated `<falcon-angular-insufficient-balance-dialog>` skeleton + `<app-do-payment-priority-popup>` wrapper pair surfaces this with funding suggestions.
- Where modal is not appropriate (background charge): toast.

## Related V-rule
- [[V-charging-insufficient-balance]]

## Related E-* entity
- `E-Wallet` · `E-Transaction`

## Related flow playbook
- (Pay Service flow + Reserve-Commit flow — playbooks pending)

## Hubs
- [[ERROR_INDEX]] · [[BACKEND_INDEX]] · [[VALIDATION_INDEX]]
