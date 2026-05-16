# Validations — marketplace-applications

> **No Reactive Forms used.** Inline editors use `[(ngModel)]` only. The only complex validation lives inside `<falcon-calendar>` when `[useEffectiveDateValidation]="true"` is set.

## Form validators (sync)

### Inline price-value editor (template lines 9-45)
| Field | Rule | Source |
|---|---|---|
| `editingPriceValue` (number) | `min: 0`, `max: 9999999`, `useGrouping: true`, prefix `'SAR '` | `<p-inputNumber [(ngModel)]="editingPriceValue" mode="decimal" [min]="0" [max]="9999999">` (template lines 16-24) |
| Required at submit | `editingPriceValue === null \|\| editingPriceValue === undefined` → toast `appsServices.messages.requiredFields` | component lines 760-773 |
| PES gate at submit | `!canEditPriceValue` → silent return | line 775 |

### Inline price-type editor (template lines 47-106)
| Field | Rule | Source |
|---|---|---|
| `editingPriceType` (PricingType enum) | required at submit; `null` → toast `appsServices.messages.requiredFields` | component line 710-720 |
| `editingEffectiveDate` (Date) | required at submit; not provided → toast | component line 710-720 |
| Custom validators inside `<falcon-calendar>` | `useEffectiveDateValidation: true` → `effectiveDateRequired`, `effectiveDateMustBeInFuture`, `invalidEffectiveDateForPeriodicPricingChange` | template lines 67-86 |
| PES gate at submit | `!canEditPriceType` → silent return | line 706 |

The `<falcon-calendar>` invocation:
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

Error templates beneath:
```html
<small class="p-error" *ngIf="effectiveDateCtrl.hasError('effectiveDateRequired')">
  {{ 'errors.effectiveDateRequired' | translate }}
</small>
<small class="p-error" *ngIf="effectiveDateCtrl.hasError('effectiveDateMustBeInFuture')">
  {{ 'errors.effectiveDateMustBeInFuture' | translate }}
</small>
<small class="p-error pt-3" *ngIf="effectiveDateCtrl.hasError('invalidEffectiveDateForPeriodicPricingChange')">
  {{ 'errors.invalidEffectiveDateForPeriodicPricingChange' | translate }}
</small>
```

[INFERRED] `FalconCalendarComponent.useEffectiveDateValidation` activates a Falcon-custom `Validator` that:
- Requires a non-null date when activated.
- Requires date > now (future-only).
- For periodic pricing types (Monthly / Yearly), requires the effective date to fall on a valid renewal boundary relative to the existing `renewDate` (otherwise the change breaks the billing cycle).

The exact rules live in `libs/falcon/...` — out of scope for this dataset.

## Async validators
**None.** No `AsyncValidatorFn`.

## Business rules captured outside Validators

| Rule | Where enforced | Notes |
|---|---|---|
| Visibility toggle disabled when busy | `isVisibilitySaving(row)` getter (line 819-821) returns `!canManageVisibility \|\| (row.visibility && !row.canHide)` | UI-only disable; backend would reject anyway |
| Concurrent visibility flip prevention | `visibilitySavingIds: Set<string>` (line 192) — same row cannot have two in-flight visibility requests | Front-end-only — back-end is presumed idempotent |
| Payment-in-progress row | `loadingRowIds: (string|number)[]` + `processingRowId` (lines 162-163) — DoPayment menu hidden / disabled per row | Cleared on Completed / Failed / cancelled |
| Payment confirmation dialog | `showPaymentConfirmation(row)` (lines 1128-1141) — confirms via `confirmationService` before `onDoPayment(row)` | UX-only; backend has its own confirmation flow |
| Delete pending change confirmation | `onDeleteDetail(detailItem, row)` (lines 668-692) — confirms via `confirmationService` before delete | UX-only |
| Cancel inline editor on outside event | `cancelEdit()` (lines 614-621) — resets edit state on cancel | |
| Success toast deduplication | `hasShownPaymentSuccess: boolean` (line 193, lines 456-459) — set once on first Completed status, prevents duplicate toasts during polling tail | |

## Date format quirks
- `editingEffectiveDate` is bound as `Date` via two-way ngModel.
- Submit serialization: `this.helper.formatDateOnly(this.editingEffectiveDate)` (line 728) — converts `Date` to backend's `YYYY-MM-DD` string.
- Backend response date parsing: `this.helper.parseDateOnly(effectiveDateStr)` (line 651) — handles `YYYY-MM-DD` back to `Date`.

## Number-input quirks (per `p-inputNumber`)
- `mode="decimal"` + `useGrouping=true` shows thousands separators.
- Prefix `'SAR '` is part of the visible value.
- Range: `[0, 9999999]` — hardcoded magic-number ceiling.

## Validation count (final tally)
- Inline editors: **2 + 3** = 5 form-level validators (2 PES + 3 falcon-calendar custom-error keys)
- Required-field checks at submit: **3** (one per editor mode + double-check)
- Business-rule predicates: **6** behavioral guards (isVisibilitySaving, isRowProcessing, hasShownPaymentSuccess, etc.)

Total: **~12 validation/business-rule predicates** across the page. Lightweight compared to contracts.
