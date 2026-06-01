*** Wallets — Section: Strategy editor ***
*** Currency · BalanceDistribution · WalletStructure · 2026-05-18 ***

# Wallets — Strategy Editor

> 3 dropdowns + Save button. Drives the wallet shape for the account.

## Fields

| Field | Enum | Options | Default | Editable when |
|---|---|---|---|---|
| `currency` | `Currency` | `SAR(1)` (active), `Points(2)` (active here, disabled in transfer drawer) | SAR | `walletStrategy.edit()` PES allowed |
| `balanceDistribution` | `BalanceDistribution` | `Aggregated(1)`, `Separate(2)` | TBD | Same |
| `walletStructure` | `WalletStructure` | `MasterOnly(1)`, `MasterPlusSub(2)` | TBD | Same |

## Backend mapping

`ISaveBalancesRequest`:

```jsonc
{
  "ownerId": "<account-id>",
  "currency": 1,                  // 1=SAR, 2=Points
  "walletBalanceType": 2,         // BalanceDistribution
  "walletType": 2                 // WalletStructure
}
```

[CODE] `wallet-balance.models.ts:200-220` (note: `changes: IBalanceChange[]` field commented OUT — dead code per GAP).

## Filter dropdown behavior

When user changes a dropdown:
- IF strategy not yet saved → just updates form state.
- IF strategy already saved → triggers re-fetch with new query params (`?currency=...&balanceDistribution=...&walletStructure=...`).
- Save button stays "dirty" until POST succeeds.

## Save button behavior

[CODE] container:

```typescript
onSave(): void {
  if (!this.canEditStrategy) return;
  this.walletBalanceService.saveChanges({
    ownerId: this.selectedNodeId,
    currency: this.selectedCurrency,
    walletBalanceType: this.selectedBalanceDistribution,
    walletType: this.selectedWalletStructure,
  }).subscribe({
    next: () => { /* toast success + re-fetch hierarchy */ },
    error: () => { /* toast error */ },
  });
}
```

## Save side effects (Kafka)

[See [10-KAFKA_SIDE_EFFECTS](10-KAFKA_SIDE_EFFECTS.md)]:

- `commerce.wallet-configured.v1` → Charging materializes wallets.
- `commerce.identity-settings-sync.v1` → Identity syncs.

## See also

- [00-OVERVIEW](00-OVERVIEW.md) · [08-BACKEND_API](08-BACKEND_API.md) · [10-KAFKA_SIDE_EFFECTS](10-KAFKA_SIDE_EFFECTS.md) · [11-STATE_TRANSITIONS](11-STATE_TRANSITIONS.md)
