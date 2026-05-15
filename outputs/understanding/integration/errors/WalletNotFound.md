*** Error code — WalletNotFound ***
*** Catalogued 2026-05-15 by Brain SK Phase 3D ***

# `FalconKeys.Error.WalletNotFound`

## Throwing service(s)
- [[Charging Service]] — every wallet handler

## HTTP status
- **404** Not Found (inferred — Charging suffix mapping)

## Scenario
- Wallet entity missing in Charging. Often paired with `WalletSettingsNotFound` (404) indicating Commerce hasn't published config yet or Kafka sync failed.

## UX handling
- **Banner** at the Wallet view + **ops handoff** when the wallet should exist (e.g. the account is fully provisioned).

## Related V-rule
- — (cross-cutting)

## Related E-* entity
- `E-Wallet`

## Related flow playbook
- (Wallet view / charge / transfer flows — playbooks pending)

## Hubs
- [[ERROR_INDEX]] · [[BACKEND_INDEX]] · [[VALIDATION_INDEX]]
