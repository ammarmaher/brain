# Shared directives — USAGE

## Real usage in active codebase

### `FalconFormValidateDirective` on every wizard form
```html
<form #f="ngForm" [falconFormValidate]="f" (ngSubmit)="onSubmit()">
  <input name="accountName" type="text" [(ngModel)]="value.accountName" required />
</form>
```
The directive automatically:
- Appends `<small class="falcon-error">` next to each invalid control.
- Adds the `*` asterisk to required-input labels.
- Marks controls touched on focusout / submit.

### `FalconStartWithLetter` + `FalconLettersDigitsMax` on text inputs
```html
<input
  name="accountName"
  [(ngModel)]="value.accountName"
  falconStartWithLetter
  [falconLettersDigitsMax]="100"
  required />
```

### `FalconCheckExistsDirective` for async name-uniqueness
```html
<input
  name="financeId"
  [(ngModel)]="value.financeId"
  falconCheckExists
  [falconCheckExistsApi]="accountService.checkFinanceIdExists"
  [falconCheckExistsMinChars]="3"
  falconCheckExistsError="validation.financeId.duplicate" />
```
Where `accountService.checkFinanceIdExists` returns `Observable<boolean>`.

### `FalconPhoneMaskDirective` for phone fields
```html
<input
  name="phone"
  [(ngModel)]="contact.phone"
  falconPhoneMask
  [minDigits]="7"
  [maxDigits]="15"
  type="tel" />
```
The value is auto-formatted as `"XXX XXXXXXXX"`.

### `FalconColumnNameDirective` for column-alias inputs
```html
<input
  name="alias"
  [(ngModel)]="col.alias"
  falconColumnName
  (normalized)="onAliasNormalized()" />
```
Real-time: whitespace becomes `_`. On blur: `__` collapses to `_`, edges stripped.

### `FalconTruncateDirective` for long-text rendering
```html
<span [falconTruncate]="longText" [falconTruncateLimit]="40"></span>
```
Or:
```html
<span falconTruncate [falconTruncateLimit]="40">{{ longText }}</span>
```

## Recommended NEW usage
- Use these directives as the canonical way to add validation / formatting to inputs.
- Combine multiple validators on one input:
  ```html
  <input
    name="username"
    [(ngModel)]="value.username"
    falconUsernameFormat
    [falconLettersDigitsMax]="30"
    falconCheckExists
    [falconCheckExistsApi]="userService.checkUsernameExists"
    required />
  ```

## Reactive Forms / ngModel
- All directives work with both template-driven and reactive forms.
- For reactive forms, declare the validator in the FormGroup definition instead of using the directive (better for code review).

## Tailwind / token usage
- The directives mutate DOM (add classes, append spans) — these mutations use class names like `.falcon-error`, `.falcon-required`, `.falcon-control-invalid`, `.falcon-label-invalid`. CSS for these MUST live in app-global Tailwind / theme CSS.
- `FalconFormValidateDirective` uses inline styles for the error message (`color: var(--color-falcon-red-500)`, etc.). This is a violation — should consume tokens via class only.

## Bad usage to avoid
- DO NOT use `FalconFormValidateDirective` on a non-form element (e.g., `<div>`) — selector restricts but the contract is form-specific.
- DO NOT use `FalconCheckExistsDirective` without `[falconCheckExistsApi]` — it'll silently no-op.
- DO NOT use `FalconEffectiveDateDirective` for new code — it's a no-op stub.
- DO NOT extend `FalconFormValidateDirective` with new MutationObserver listeners — the existing observer covers add/remove.

## Do / Don't
- DO compose multiple sync validators on one input — they all run.
- DO use `FalconCheckExistsDirective` for any async uniqueness check.
- DON'T re-implement validation in component code if a directive exists.
- DON'T forget to set the input's `name` attribute — `FalconFormValidateDirective` uses it to map errors back to controls.
