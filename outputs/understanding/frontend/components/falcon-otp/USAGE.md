# falcon-otp — USAGE

## Real usage examples

### Example 1 — 6-digit verification code

```html
<falcon-angular-otp
  [label]="'Enter verification code'"
  [length]="6"
  [(ngModel)]="otpValue"
  (ngModelChange)="onOtpChange($event)">
</falcon-angular-otp>
```

### Example 2 — Masked PIN (4 digits)

```html
<falcon-angular-otp
  [label]="'PIN'"
  [length]="4"
  [mask]="true"
  [(ngModel)]="pin">
</falcon-angular-otp>
```

### Example 3 — Alpha-numeric code

```html
<falcon-angular-otp
  [length]="8"
  pattern="[A-Z0-9]"
  [(ngModel)]="code">
</falcon-angular-otp>
```

## Recommended usage for NEW Angular pages

- Use for 4-8 digit code entry.
- Default `length=6` covers most flows.
- Use `mask=true` for PINs.
- Always bind via CVA.
- Detect completion via `(ngModelChange)` checking `value.length === length`.

## Reactive Forms

```ts
form = new FormGroup({
  otp: new FormControl<string>('', [Validators.required, Validators.minLength(6)]),
});

submitOnComplete = effect(() => {
  if (this.form.controls.otp.value.length === 6) this.submit();
});
```

## ngModel

```html
<falcon-angular-otp [(ngModel)]="otp"></falcon-angular-otp>
```

## Tailwind-only

```html
<falcon-angular-otp class="mx-auto" wrapperClass="gap-3" ... />
```

## Token usage

```css
.brand-otp {
  --falcon-otp-box-bg-focus: var(--color-falcon-teal-tint);
  --falcon-otp-box-border-color-focus: var(--color-falcon-teal-500);
}
```

## Bad usage to avoid

- Do NOT use for password entry — use `<falcon-angular-password>`.
- Do NOT use length > 10 — UI degrades.
- Do NOT skip `mask` for PIN flows (security).

## Do / Don't

| Do | Don't |
|---|---|
| Use for 4-8 char codes. | Use for free-text. |
| Set `mask=true` for PINs. | Display PIN unmasked. |
| Detect completion in `(ngModelChange)`. | Wait for blur. |

## Wave 7 Consumer Sweep (2026-05-17)

[CODE] grep `<falcon-angular-otp>` across `apps/` + `libs/falcon/` returned **4 consumer file(s)** as of 2026-05-17:

- `apps/host-shell/src/app/features/auth/enter-otp/enter-otp.component.html`
- `apps/host-shell/src/app/features/auth/forgot-password-flow/forgot-password-flow.component.html`
- `apps/host-shell/src/app/playground/playground.page.html`
- `apps/host-shell/src/app/shared-components/otp-dialog/otp-dialog.component.html`
