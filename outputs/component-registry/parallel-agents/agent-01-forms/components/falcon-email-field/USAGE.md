# falcon-email-field — USAGE

## Real usage examples

### Example 1 — Account-owner email with Verify button

```html
<falcon-angular-email-field
  [label]="'hierarchy.addClient.fields.email.label' | translate"
  [errorMessage]="emailError() | translate"
  [state]="emailError() ? 'error' : 'default'"
  [required]="true"
  [verifyButton]="true"
  [verifyLabel]="'Verify' | translate"
  [verifyDisabled]="!isEmailValid()"
  [(ngModel)]="value().email"
  (falcon-verify)="onVerify($event.value)">
</falcon-angular-email-field>
```

### Example 2 — Simple email without Verify

```html
<falcon-angular-email-field
  [label]="'Email'"
  [(ngModel)]="email">
</falcon-angular-email-field>
```

### Example 3 — Reactive Forms

```html
<falcon-angular-email-field
  formControlName="email"
  [verifyButton]="true"
  [verifyDisabled]="form.controls.email.invalid"
  (falcon-verify)="sendVerify($event.value)">
</falcon-angular-email-field>
```

## Recommended usage for NEW Angular pages

- Use when verify-button affordance is needed.
- For plain email entry without verify, `<falcon-angular-input type="email">` is acceptable too.
- Keep `verifyDisabled` synced with form validity.

## Reactive Forms

```ts
form = new FormGroup({
  email: new FormControl<string>('', [Validators.required, Validators.email]),
});
```

## ngModel

```html
<falcon-angular-email-field [(ngModel)]="email"></falcon-angular-email-field>
```

## Tailwind-only

```html
<falcon-angular-email-field class="w-full max-w-md" ... />
```

## Token usage

```css
.verify-email {
  --falcon-email-field-verify-bg: var(--color-falcon-teal-500);
  --falcon-email-field-verify-color: var(--color-falcon-neutral-0);
}
```

## Bad usage to avoid

- Do NOT rely on the component to validate the email — it emits `falcon-verify` only. Validation is consumer's responsibility (Reactive Forms `Validators.email`).
- Do NOT use this for non-email fields.
- Do NOT bind `[value]` directly.

## Do / Don't

| Do | Don't |
|---|---|
| Use for emails requiring verify affordance. | Use for plain text. |
| Validate via Reactive Forms. | Trust component-side validation. |
| Sync `verifyDisabled` with form validity. | Allow verify on invalid email. |
