*** Wallets — Section: Transfer drawer ***
*** Side-drawer for moving balance · 2026-05-18 ***

# Wallets — Transfer Drawer

> Modal drawer that slides in from the right. Executes a balance transfer between two wallets after validation.

## Component

[CODE] `apps/admin-console/.../balance-transfer/balance-transfer.component.ts:1-700`:

- Selector: `<app-balance-transfer>`
- Standalone, NOT OnPush (the SCSS file is 439 lines — heavy custom styling)
- Encapsulation: default ViewEncapsulation.Emulated

## Inputs

```typescript
@Input() visible: boolean = false;
@Input() walletData: IWalletDataResponse | null = null;
@Input() preselectedDestination: IChannelBalance | IBalanceNode | null = null;
```

## Outputs

```typescript
@Output() dismissed = new EventEmitter<void>();
@Output() transferred = new EventEmitter<ITransferResponse>();
```

## Form fields

| Field | Type | Required | Notes |
|---|---|---|---|
| `sourceWallet` | dropdown | YES | Filtered by transfer-path matrix |
| `destinationWallet` | dropdown | YES | Filtered by transfer-path matrix |
| `currency` | dropdown | YES | SAR (active), **Points hard-disabled in drawer** ([CODE] line 97) |
| `amount` | number | YES | `> 0` AND `<= source.balance` AND `<= source.balance * balanceTransferLimitPct/100` |
| `description` | text | YES | non-empty |

## Transfer path matrix (business rules)

[CODE] `transfer.models.ts:130-200`:

| Source type | Destination type | Allowed by role | Backend allows |
|---|---|---|---|
| Master | CommChannel | Falcon admin · AO | YES |
| CommChannel | Master | Falcon admin · AO | YES (refund) |
| Master | Node | Falcon admin · AO | YES |
| Node | Master | Falcon admin · AO | YES (refund) |
| Master | User | Falcon admin · AO | YES |
| User | Master | Self only (return excess) | YES |
| CommChannel | CommChannel | NO | NO (must go via Master) |
| Node | Node (sibling) | Falcon admin | YES |
| User | User | NO | NO |

The path validator function lives in `transfer.models.ts` and runs **on every form change** to filter the dropdowns.

## Same-source/destination guard

[CODE]:

```typescript
get isSameSourceAndDestination(): boolean {
  return this.form.sourceWallet?.id === this.form.destinationWallet?.id;
}
```

If true: disable Submit.

## Amount cap rule

[PRD] BR-AM-XX (TBD line): `balanceTransferLimitPct` — a per-account limit setting (set in Account Settings) caps the % of source balance that can be transferred in one operation.

[CODE]:

```typescript
get maxAllowedAmount(): number {
  return this.form.sourceWallet?.balance * (this.balanceTransferLimitPct / 100);
}

get isAmountExceeded(): boolean {
  return this.form.amount > this.maxAllowedAmount;
}
```

If exceeded: inline error: "Amount exceeds allowed transfer limit for this source."

## Currency mismatch guard

[PRD] F-014 (in DECISION-PROTOCOL.md): cross-currency transfers not allowed. FE filters dropdowns to same-currency destinations. BE enforces with `Error.Wallet.CurrencyMismatch`.

## Submit

```typescript
onSubmit(): void {
  if (!this.canSubmit) return;
  this.submitting = true;
  this.walletBalanceService.transfer({
    accountId: this.walletData.accountId,
    sourceWalletId: this.form.sourceWallet.id,
    sourceWalletType: this.form.sourceWallet.balanceType,
    destinationWalletId: this.form.destinationWallet.id,
    destinationWalletType: this.form.destinationWallet.balanceType,
    currency: this.form.currency,
    amount: this.form.amount,
    description: this.form.description,
  }).subscribe({
    next: response => {
      this.submitting = false;
      this.transferred.emit(response);
      this.close();
    },
    error: err => {
      this.submitting = false;
      this.errorMessage = err.message;
    },
  });
}
```

## See also

- [00-OVERVIEW](00-OVERVIEW.md) · [04-SECTION_BALANCE_TABLE](04-SECTION_BALANCE_TABLE.md) · [06-SECTION_WALLET_TOPOLOGY](06-SECTION_WALLET_TOPOLOGY.md) · [07-VALIDATIONS](07-VALIDATIONS.md) · [12-ERROR_STATES](12-ERROR_STATES.md)
