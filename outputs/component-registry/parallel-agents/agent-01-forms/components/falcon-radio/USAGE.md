# falcon-radio — USAGE

## Real usage examples

### Example 1 — Standalone radio inside OTP send dialog (channel step)

```html
<falcon-angular-radio
  name="otp-channel"
  value="email"
  [checkedInput]="channel() === 'email'"
  (valueChange)="setChannel('email')"
  [label]="'Email' | translate">
</falcon-angular-radio>
```

### Example 2 — Reactive Forms standalone

```html
<falcon-angular-radio
  formControlName="acceptTos"
  name="acceptTos"
  value="accepted"
  label="Accept terms">
</falcon-angular-radio>
```

### Example 3 — Inside radio-group (canonical)

See `<falcon-angular-radio-group>` USAGE. The group composes radios internally — don't loop manually.

## Recommended usage for NEW Angular pages

- Always prefer `<falcon-angular-radio-group>` for multiple options.
- Use raw `<falcon-angular-radio>` ONLY when the design demands non-uniform layout (e.g. one radio inside a custom card) — then manage `checkedInput` from parent.

## Reactive Forms

```ts
form = new FormGroup({
  channel: new FormControl<string>('email'),
});
```

```html
<falcon-angular-radio formControlName="channel" name="ch" value="email" label="Email"></falcon-angular-radio>
<falcon-angular-radio formControlName="channel" name="ch" value="sms"   label="SMS"></falcon-angular-radio>
```

## ngModel

```html
<falcon-angular-radio [(ngModel)]="channel" name="ch" value="email" label="Email"></falcon-angular-radio>
```

## Tailwind-only usage

```html
<falcon-angular-radio class="mr-3" ... />
```

## Token usage

```css
.brand-radio {
  --falcon-radio-bg-checked-inner: var(--color-falcon-teal-500);
  --falcon-radio-border-color-checked: var(--color-falcon-teal-500);
}
```

## Bad usage to avoid

- Do NOT manually loop radios — use `<falcon-angular-radio-group>`.
- Do NOT mix CVA + `checkedInput` on the same instance.
- Do NOT vary `name` across radios that should be exclusive.

## Do / Don't

| Do | Don't |
|---|---|
| Use radio-group for typical multi-option. | Hand-roll the loop. |
| Set `name` consistent across siblings. | Use radio for boolean. |
| Bind via CVA for forms. | Use raw `[checkedInput]` outside group. |
