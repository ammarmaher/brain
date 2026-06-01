*** Wallets — Gaps & drifts ***
*** 9 anti-patterns + open questions · 2026-05-18 ***

# Wallets — Gaps & Drifts

## High-severity

### GAP-WBM-GUARD — `shellAccessGuard` is a no-op

[CODE] `routes.ts:52-61` — `shellAccessGuard` declared but `access:` value omitted, so it does nothing. Relies on parent `adminConsoleGuard`. NEW UI: provide an explicit access key per BR-AM-XX role matrix.

### GAP-WBM-DEAD-EDITS — Dead cell-edit scaffolding

[CODE] `wallet-balance-management.component.html:393, 411` — all balance inputs are `[disabled]="true"`. The commented `changes: IBalanceChange[]` field in `ISaveBalancesRequest` reveals a planned-but-never-shipped feature.

**Fix:** either remove dead code (clean up) OR ship the cell-edit flow (and remove `[disabled]`).

### GAP-WBM-API-PREFIX — Inconsistent URL casing/prefix

[CODE] `wallet-balance.service.ts`:
- `api/commerce/accounts/{id}/hierarchy` — has `api/` prefix
- `commerce/setting/wallets` — no `api/`
- `charging/wallet/transfer` — no `api/`
- `commerce/Node` — no `api/`, capital N

The `api/` segment is significant — it hits a System-Gateway aggregator. Document clearly so NEW UI preserves the prefix.

### GAP-WBM-LOCALE-PARSE — `parseFloat` after `replace(',','')` is locale-fragile

[CODE] `wallet-balance-management.component.ts:401-412`:

```typescript
const rawValue = input.value.replace(/,/g, '');
const parsedValue = rawValue ? parseFloat(rawValue) : null;
```

Works for en-US but breaks under ar-SA (grouping char is `٬` or space). NEW UI: use `Intl.NumberFormat.formatToParts()` for locale-aware parsing.

### GAP-WBM-MONEY-PRECISION — JS Number for money

[CODE] all balance fields are plain `number`. Risk past 2^53. Currently fine for SAR with 3 fractional digits (max ~$9 trillion before issue), but NOT future-proof.

**Recommendation:** consider `Decimal` or string-encoded money for high-value contracts.

## Medium-severity

### Q-WBM-RECONFIG — Can you change strategy after balances exist?

PRD silent. Strategy change with non-zero balances would need data migration. Backend likely blocks with `Error.Wallet.ChangeBlockedByBalances`. Verify.

### GAP-WBM-INVALID-COMBO — MasterOnly + Separate is logically invalid

If only a single Master wallet, "Separate" distribution makes no sense. Backend should reject. Verify.

### GAP-WBM-NGMODEL — Template-driven NgForm

[CODE] uses `[(ngModel)]` everywhere. NEW UI: Reactive Forms.

### GAP-WBM-SCSS — Huge SCSS files

1177+439 LOC SCSS. Tailwind migration is non-trivial. Phase incremental rewrite.

### GAP-WBM-POINTS-INCONSISTENCY — Points currency available on main page but disabled in drawer

[CODE] drawer line 97 hard-disables Points. Container `disabled: false` allows it. Confusing UX. Decide: enable Points in transfer too OR hide from main page.

## Low-severity

### GAP-WBM-CURRENCY-ENUM — No clear enum source

`Currency = 1 (SAR) | 2 (Points)` — magic numbers throughout. NEW UI: declare typed enum.

### GAP-WBM-WALLET-ID-OPACITY — Wallet IDs not user-facing

`IChannelBalance.id` is a backend ID. Not visible in UI. For debugging, add a tooltip or expandable detail.

## See also

- [00-OVERVIEW](00-OVERVIEW.md) · [04-SECTION_BALANCE_TABLE](04-SECTION_BALANCE_TABLE.md) · [14-IMPLEMENTATION_CHECKLIST](14-IMPLEMENTATION_CHECKLIST.md)
