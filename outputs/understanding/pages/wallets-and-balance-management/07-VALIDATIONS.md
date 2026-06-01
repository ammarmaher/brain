*** Wallets — Validations ***
*** 4 business rules in transfer drawer · 2026-05-18 ***

# Wallets — Validations

> Old-UI uses NO Reactive Forms — `[(ngModel)]` only. The 4 business rules are coded as getters.

## V-rules

| V-rule | Where enforced | Effect | Source |
|---|---|---|---|
| `V-transfer-path-allowed` | FE: `transfer.models.ts` matrix function · BE | Filters dropdowns + BE rejects invalid path | [CODE] `transfer.models.ts:130-200` |
| `V-transfer-amount-positive` | FE: `amount > 0` getter | Disable Submit | [CODE] drawer component |
| `V-transfer-amount-le-source` | FE: `amount <= source.balance` | Disable Submit | Same |
| `V-transfer-amount-cap-pct` | FE: `amount <= source.balance * limitPct/100` | Disable Submit | Same |
| `V-transfer-same-source-dest` | FE: `source.id !== dest.id` | Disable Submit | Same |
| `V-transfer-description-required` | FE: non-empty | Disable Submit | Same |
| `V-transfer-currency-match` | FE: dropdown filter · BE | Reject cross-currency | F-014 |

## Strategy editor V-rules

| V-rule | Where enforced | Effect |
|---|---|---|
| `V-strategy-fields-required` | FE: all 3 dropdowns must be selected | Disable Save |
| `V-strategy-combo-valid` | BE: rejects invalid `MasterOnly + Separate` combo | Toast |

## Async validators

**None.** All validations are sync against in-memory state. BE handles edge cases.

## Form structure (anti-pattern)

[CODE] uses `[(ngModel)]` template-driven NgForm. NEW UI MUST migrate to Reactive Forms [F-022].

## See also

- [03-SECTION_STRATEGY_EDITOR](03-SECTION_STRATEGY_EDITOR.md) · [05-SECTION_TRANSFER_DRAWER](05-SECTION_TRANSFER_DRAWER.md) · [13-GAPS_AND_DRIFTS](13-GAPS_AND_DRIFTS.md)
