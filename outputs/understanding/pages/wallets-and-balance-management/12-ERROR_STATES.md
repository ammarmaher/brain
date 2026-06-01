*** Wallets — Error states ***
*** Transfer + strategy error UX · 2026-05-18 ***

# Wallets — Error States

## Per-endpoint errors

### `GET hierarchy`

| HTTP | UX |
|---|---|
| 200 | Render |
| 404 | "Account not found" — close page |
| 403 | "You don't have permission" — toast |
| 5xx | Skeleton error state + Retry |

### `POST commerce/setting/wallets`

| FalconKey | UX |
|---|---|
| `Error.Wallet.StrategyInvalidCombo` | Toast: "Invalid strategy combination. Try a different choice." |
| `Error.Wallet.StrategyAlreadyConfigured` | Toast: "Strategy is already configured. Cannot change." (if restricted) |
| `Error.Wallet.ChangeBlockedByBalances` | Toast: "Cannot change strategy while balances exist." (Q-WBM-RECONFIG) |

### `POST charging/wallet/transfer`

| FalconKey | UX |
|---|---|
| `Error.Wallet.InsufficientBalance` | Inline error on amount: "Insufficient balance in source wallet." |
| `Error.Wallet.TransferPathNotAllowed` | Toast: "This transfer path is not allowed." |
| `Error.Wallet.CurrencyMismatch` | Toast: "Cannot transfer between different currencies." (F-014) |
| `Error.Wallet.AmountExceedsLimit` | Inline: "Amount exceeds transfer limit for this account." |
| `Error.Wallet.SameSourceDestination` | Inline: "Source and destination must differ." |
| `Error.Wallet.DescriptionRequired` | Inline: "Description is required." |
| `Error.Wallet.ConcurrentTransferConflict` | Toast: "Balance changed during your transfer. Refresh and try again." (when ledger optimistic-concurrency fires) |

## Toast service

NEW UI uses `FalconToastService` (NOT `MessageService` PrimeNG — old-UI uses PrimeNG one, deprecated).

## See also

- [05-SECTION_TRANSFER_DRAWER](05-SECTION_TRANSFER_DRAWER.md) · [07-VALIDATIONS](07-VALIDATIONS.md) · [13-GAPS_AND_DRIFTS](13-GAPS_AND_DRIFTS.md)
