*** Error code — WalletVersionConflict ***
*** Catalogued 2026-05-15 by Brain SK Phase 3D ***

# `FalconKeys.Error.WalletVersionConflict`

## Throwing service(s)
- [[Charging Service]] — every wallet mutator after retry exhaustion

## HTTP status
- **409** Conflict (inferred — could also be 503 with `Retry-After` per Charging ERRORS.md note)

## Scenario
- Optimistic concurrency check on the wallet record failed. The handler retries internally **3 times** with exponential backoff + jitter before surfacing this code. The FE should treat it as transient.

## UX handling
- **Toast** — "Please retry. Another change was applied at the same time."
- Auto-retry from FE is acceptable only with clear user feedback.

## Related V-rule
- — (concurrency, not a domain rule)

## Related E-* entity
- `E-Wallet`

## Related flow playbook
- (Wallet charge / transfer flows — playbooks pending)

## Hubs
- [[ERROR_INDEX]] · [[BACKEND_INDEX]] · [[VALIDATION_INDEX]]
