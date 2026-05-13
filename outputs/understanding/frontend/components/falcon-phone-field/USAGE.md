# falcon-phone-field — USAGE

## Real usage examples

### Example 1 — Account-owner phone with Verify

```html
<falcon-angular-phone-field
  [label]="'hierarchy.addClient.fields.phone.label' | translate"
  country="SA"
  [errorMessage]="phoneError() | translate"
  [state]="phoneError() ? 'error' : 'default'"
  [required]="true"
  [verifyButton]="true"
  [verifyLabel]="'Verify' | translate"
  [(ngModel)]="value().phone"
  (falcon-country-change)="onCountryChange($event)"
  (falcon-verify)="onVerify($event)">
</falcon-angular-phone-field>
```

### Example 2 — Filtered country list (only GCC)

```ts
gccCountries = [
  { iso: 'SA', name: 'Saudi Arabia', dialCode: '+966', flagEmoji: '🇸🇦' },
  { iso: 'AE', name: 'UAE',          dialCode: '+971', flagEmoji: '🇦🇪' },
  { iso: 'KW', name: 'Kuwait',       dialCode: '+965', flagEmoji: '🇰🇼' },
  { iso: 'QA', name: 'Qatar',        dialCode: '+974', flagEmoji: '🇶🇦' },
  { iso: 'BH', name: 'Bahrain',      dialCode: '+973', flagEmoji: '🇧🇭' },
  { iso: 'OM', name: 'Oman',         dialCode: '+968', flagEmoji: '🇴🇲' },
];
```

```html
<falcon-angular-phone-field
  [countries]="gccCountries"
  country="SA"
  [(ngModel)]="phone">
</falcon-angular-phone-field>
```

### Example 3 — Reactive Forms with stricter validation

```ts
form = new FormGroup({
  phone: new FormControl<string>('', [Validators.required, customPhoneValidator()]),
});
```

## Recommended usage for NEW Angular pages

- Always use this component for phones (never raw input).
- Pair with Reactive Forms validators for real validation.
- Filter the country list when business rules permit (saves DOM weight).
- Pass `country='SA'` (or appropriate) for sensible defaults.

## Reactive Forms

See Example 3.

## ngModel

```html
<falcon-angular-phone-field [(ngModel)]="phone"></falcon-angular-phone-field>
```

## Tailwind-only

```html
<falcon-angular-phone-field class="w-full" ... />
```

## Token usage

```css
.client-phone {
  --falcon-phone-field-country-bg: var(--color-falcon-neutral-50);
  --falcon-phone-field-partition-color: var(--color-falcon-neutral-200);
}
```

## Bad usage to avoid

- Do NOT trust component-side validation — emit-only.
- Do NOT bind `[value]` directly.
- Do NOT use `<falcon-angular-input type='tel'>` instead — loses the country chooser + partition treatment.
- Do NOT load the full country list when business limits are known — filter via `countries` input.

## Do / Don't

| Do | Don't |
|---|---|
| Use for ALL phone fields. | Use generic input for phones. |
| Validate via Reactive Forms + libphonenumber. | Trust component-side. |
| Pass filtered `countries` when applicable. | Always render full list. |
