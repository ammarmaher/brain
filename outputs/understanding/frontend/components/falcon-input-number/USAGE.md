# falcon-input-number — USAGE

## Real usage examples

### Example 1 — Currency entry

```html
<falcon-angular-input-number
  [label]="'Amount'"
  mode="currency"
  currency="SAR"
  locale="en-SA"
  [min]="0"
  [(ngModel)]="amount">
</falcon-angular-input-number>
```

### Example 2 — Quantity picker with spinner

```html
<falcon-angular-input-number
  [label]="'Quantity'"
  [showButtons]="true"
  [step]="1"
  [min]="1"
  [max]="99"
  [integer]="true"
  [(ngModel)]="qty">
</falcon-angular-input-number>
```

### Example 3 — Decimal with 2-digit precision

```html
<falcon-angular-input-number
  mode="decimal"
  [minFractionDigits]="2"
  [maxFractionDigits]="2"
  [(ngModel)]="weight">
</falcon-angular-input-number>
```

## Recommended usage for NEW Angular pages

- Use `mode='currency'` for money entry — let Intl handle the symbol + decimals.
- Use `integer=true` for IDs / counts.
- Use `showButtons=true` for low-step quantities.
- Pass `locale` for Arabic / locale-specific rendering.

## Reactive Forms

```ts
form = new FormGroup({
  amount: new FormControl<number | null>(null, [Validators.required, Validators.min(0)]),
});
```

## ngModel

```html
<falcon-angular-input-number [(ngModel)]="amount"></falcon-angular-input-number>
```

## Tailwind-only

```html
<falcon-angular-input-number class="w-32" rootClass="..." ... />
```

## Token usage

Inherits input + button tokens. Per-instance:

```css
.amount-input {
  --falcon-input-number-spinner-gap: 4px;
  --falcon-input-number-spinner-width: 32px;
}
```

## Bad usage to avoid

- Do NOT bind to a `FormControl<string>` — value is `number | null`.
- Do NOT use `minFractionDigits` in currency mode (Intl owns decimals).
- Do NOT skip `locale` for Arabic — defaults to browser locale which may not match.

## Do / Don't

| Do | Don't |
|---|---|
| Use `mode='currency'` for money. | Use `<falcon-angular-input>` for currency. |
| Pass `locale` explicitly when relevant. | Rely on browser locale silently. |
| Use Reactive Forms validators for min/max. | Trust the clamp only — clamp runs on blur. |
