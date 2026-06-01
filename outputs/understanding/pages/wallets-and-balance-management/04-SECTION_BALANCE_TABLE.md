*** Wallets — Section: Balance table ***
*** Per-channel + per-node balance display · 2026-05-18 ***

# Wallets — Balance Table

> Read-only table showing current balance per wallet, with Transfer action per row. **Cell inputs are disabled today** (dead scaffolding for direct edits — flagged as gap).

## Master Wallet row (top)

Shows the aggregated balance:

```
Master Wallet Balance: 10,000.000 SAR
```

[CODE] `IWalletSummary.totalBalance: number` — computed server-side by aggregating children.

## Per-channel rows

| Channel | Balance | Transfer |
|---|---|---|
| WhatsApp | 5,000.000 SAR | [Transfer →] |
| Voice | 3,000.000 SAR | [Transfer →] |
| SMS | 500.000 SAR | [Transfer →] |

[CODE] `IChannelBalance { channelCode, channelName, balance: number, balanceType: 'CommChannel' }`.

## Per-node rows (when walletStructure=MasterPlusSub)

If sub-nodes have wallets, additional rows appear for each sub-node:

| Sub-node | Balance | Transfer |
|---|---|---|
| Subsidiary A | 2,000.000 SAR | [Transfer →] |

## Per-user rows (when balanceDistribution=Separate)

If users have own wallets, additional rows per user.

## Dead edit-cell scaffolding

[CODE] `wallet-balance-management.component.html:393, 411`:

```html
<input type="text" [disabled]="true" [value]="row.balance | number:'1.3-3':'en-US'" />
```

All inputs are `[disabled]="true"`. The commented `changes: IBalanceChange[]` field in `ISaveBalancesRequest` suggests there was a plan to support direct cell edits → never shipped. **Flag as GAP-WBM-DEAD-EDITS.**

## Number formatting

[CODE] `wallet-balance-management.component.ts:401-412` parser:

```typescript
const rawValue = input.value.replace(/,/g, '');
const parsedValue = rawValue ? parseFloat(rawValue) : null;
```

Display: `'1.3-3':'en-US'` (3 fractional digits).

> [INFERRED] Locale-sensitive bug: strip-comma works for en-US but `ar-SA` uses different grouping (`٬` or space). Flag GAP-WBM-LOCALE-PARSE.

## Number type concern

All balance fields are plain JS `number`s — no decimal.js, no string-encoded money. Risk: precision loss past 2^53. Currently SAR uses 3 fractional digits, fitting in `double`.

## Transfer button per row

Each non-Master row has a `[Transfer →]` button:
- Opens the side drawer (see [05-SECTION_TRANSFER_DRAWER](05-SECTION_TRANSFER_DRAWER.md)).
- Pre-fills the drawer with row as the destination (or source — depends on direction).

## See also

- [00-OVERVIEW](00-OVERVIEW.md) · [05-SECTION_TRANSFER_DRAWER](05-SECTION_TRANSFER_DRAWER.md) · [06-SECTION_WALLET_TOPOLOGY](06-SECTION_WALLET_TOPOLOGY.md) · [13-GAPS_AND_DRIFTS](13-GAPS_AND_DRIFTS.md)
