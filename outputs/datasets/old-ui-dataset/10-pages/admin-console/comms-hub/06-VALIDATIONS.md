# Validations — comms-hub

This is a **read-mostly list page** — there are no Reactive Forms, no `FormBuilder`, no async validators. All editing happens inline through two PrimeNG-based mini-templates and the validation surface is small.

## Form validators (sync)

| Form / template | Field | Validator | Source / message key |
|---|---|---|---|
| Inline edit — price type (`editPriceTypeTpl`, HTML 10-69) | `editingEffectiveDate` (bound via `<falcon-calendar>`) | `useEffectiveDateValidation` directive — emits 3 distinct errors (see below) | `errors.effectiveDateRequired`, `errors.effectiveDateMustBeInFuture`, `errors.invalidEffectiveDateForPeriodicPricingChange` |
| Inline edit — price type | `editingPriceType` | required (manually checked in `onSaveEdit`) | toast key `commChannelsServices.messages.requiredFields` |
| Inline edit — price value (`editPriceValueTpl`, HTML 72-107) | `editingPriceValue` | `[min]="0"` / `[max]="9999999"` on PrimeNG `<p-inputNumber>` | n/a (no message key; UI clamps) |
| Inline edit — price value | `editingPriceValue` | required (manually checked in `onSaveEdit`) | toast key `commChannelsServices.messages.requiredFields` |

### `<falcon-calendar>` validation surface

The calendar component is wired in `editPriceTypeTpl` (HTML 30-39) with:

```html
<falcon-calendar
  #effectiveDateCtrl="ngModel"
  [(ngModel)]="editingEffectiveDate"
  [ngModelOptions]="{ standalone: true }"
  [useEffectiveDateValidation]="true"
  [visibility]="row.visibility"
  [status]="row.status"
  [pricingType]="editingPriceType"
  [renewDate]="row.renewDateDate">
</falcon-calendar>
```

Three error keys are surfaced (HTML 40-47):

| Error | Message key |
|---|---|
| `effectiveDateRequired` | `errors.effectiveDateRequired` |
| `effectiveDateMustBeInFuture` | `errors.effectiveDateMustBeInFuture` |
| `invalidEffectiveDateForPeriodicPricingChange` | `errors.invalidEffectiveDateForPeriodicPricingChange` |

[INFERRED] The validation rule for "valid effective date for periodic pricing change" is computed inside the `useEffectiveDateValidation` directive against `(row.visibility, row.status, editingPriceType, row.renewDateDate)`. Source not read; lives in `libs/falcon/src/shared-ui/lib/components/falcon-calendar/...`.

## Async validators

**None.** No HTTP-backed validation in this feature.

## Business rules captured in code

### Required-fields gate before save (priceType)

```typescript
// comms-hub.component.ts:758-769
if (this.editingPriceType === null || !this.editingEffectiveDate) {
  this.messageService.add({
    severity: 'warn',
    summary: 'Warning',
    detail: this.translateService.translate('commChannelsServices.messages.requiredFields')
      || 'Please fill all required fields',
  });
  this.isSaving = false;
  return;
}
```

### Required-fields gate before save (priceValue)

```typescript
// comms-hub.component.ts:811-822
if (
  this.editingPriceValue === null ||
  this.editingPriceValue === undefined
) {
  this.messageService.add({ severity: 'warn', ... });
  this.isSaving = false;
  return;
}
```

### Visibility toggle revert on error

If `changeCommChannelVisibility` fails, the component **reverts the optimistic visibility flag**:

```typescript
// comms-hub.component.ts:644-654
error: () => {
  row.visibility = !nextVisibility;
  this.messageService.add({ severity: 'error', summary: 'Error', ... });
}
```

### Do-payment branch logic on order failure

```typescript
// comms-hub.component.ts:503-543
if (status.status === ProcessState.Failed) {
  this.isProcessing = false;
  this.removeLoadingRowId();

  if (status.failureReason === OrderFailureReason.WalletNotConfigForTheNode) {
    // → show warning dialog with `warning.walletNotConfigured`
  }
  if (status.failureReason === OrderFailureReason.CommChannelPriorityOrderRequired) {
    // → show priority dialog (drag-drop reorder, then re-call onDoPayment with priorities)
  }
  if (status.failureReason === OrderFailureReason.InsufficientFunds) {
    // → show warning dialog with no message (uses default i18n)
  }
}
```

Confirm-before-delete on pending price-change:

```typescript
// comms-hub.component.ts:726-737
this.confirmationService.confirm({
  header: this.translateService.translate('confirm.deleteTitle'),
  message: detailType === 'priceType'
    ? this.translateService.translate('confirm.deletePriceType')
    : this.translateService.translate('confirm.deletePriceValue'),
  acceptLabel: this.translateService.translate('button.yes'),
  rejectLabel: this.translateService.translate('button.no'),
  ...
});
```

Confirm-before-payment:

```typescript
// comms-hub.component.ts:1144-1157
private showPaymentConfirmation(row: CommChannelServiceItem): void {
  this.confirmationService.confirm({
    message: this.translateService.translate('confirm.paymentMessage'),
    icon: 'payment',
    iconColor: getCssVariable('--color-primary', '#104C54'),
    accept: () => { this.onDoPayment(row); },
    ...
  });
}
```

### PriceType options sourcing

Options are derived from the `PricingType` enum via `Helper.enumToOptions` ([CODE] component line 228-232) — `[ { value: 1, name: ... 'Monthly' }, { value: 2, ... 'Yearly' }, { value: 3, ... 'OneTimePayment' } ]` with i18n keys from `PricingTypeI18n`.

## Counting

- **4 validation surfaces** (effective-date directive's 3 errors + the manual save-time `requiredFields` toast counted as one rule per editor).
- **0 async validators.**
- **6 cross-field / business-flow rules** captured in code (above).
