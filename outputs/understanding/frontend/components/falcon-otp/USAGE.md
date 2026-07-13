# falcon-otp — USAGE

## Real usage examples (active codebase)

### Example 1 — Login OTP step (the live consumer)

`apps/host-shell/src/app/features/auth/enter-otp/enter-otp.component.html:74-79`:

```html
<falcon-angular-otp
  [ngModel]="otpValue"
  [length]="otpLength"
  [state]="screenState === OtpScreenState.Error ? 'error' : 'default'"
  (ngModelChange)="onOtpValueChange($event)">
</falcon-angular-otp>
```

> `[CODE]` The login screen drives error styling via `[state]` and reads the assembled code via `(ngModelChange)`; it does NOT use `(falconComplete)` (the wrapper does not expose it — G1) — completion is inferred from `value.length === length` / the Verify action.

### Example 2 — 6-digit verification code (ngModel)

```html
<falcon-angular-otp
  [label]="'Enter verification code'"
  [length]="6"
  [(ngModel)]="otpValue"
  (ngModelChange)="onOtpChange($event)">
</falcon-angular-otp>
```

### Example 3 — Masked PIN (4 digits)

```html
<falcon-angular-otp [label]="'PIN'" [length]="4" [mask]="true" [(ngModel)]="pin"></falcon-angular-otp>
```

### Example 4 — Alpha-numeric code

```html
<falcon-angular-otp [length]="8" pattern="[A-Z0-9]" [(ngModel)]="code"></falcon-angular-otp>
```

## Recommended usage for NEW Angular pages

- Use for 4–8 character code entry; `length=6` covers most flows.
- Set `length` to **exactly** the backend-issued code length.
- `mask=true` only for true PINs (an OTP is transient/low-sensitivity — leave unmasked so users can verify what they typed and OS SMS auto-fill reads it).
- Bind via CVA (`[(ngModel)]` / `formControlName`).
- Detect completion via `(ngModelChange)` checking `value.length === length` (until the `(falconComplete)` GAP G1 lands).

## Reactive Forms

```ts
form = new FormGroup({
  otp: new FormControl<string>('', [Validators.required, Validators.minLength(6)]),
});
```

The backend still decides correctness — surface a wrong-code by setting `[state]="'error'"` + `[errorMessage]`.

## ngModel (template forms)

```html
<falcon-angular-otp [(ngModel)]="otp"></falcon-angular-otp>
```

## Tailwind-only

```html
<falcon-angular-otp class="mx-auto" wrapperClass="gap-3" ... />
```

`wrapperClass` / `boxClass` / `inputClass` / `labelClass` flow ONLY to the Tailwind (default) path; in Shadow mode (`useTailwind=false`) they silently no-op.

## Token usage (per-instance override pattern)

```css
.brand-otp {
  --falcon-otp-bg-focus: var(--color-falcon-teal-tint);
  --falcon-otp-border-color-focus: var(--color-falcon-teal-500);
  --falcon-otp-box-size-md: 48px;
  --falcon-otp-gap: var(--falcon-spacing-3);
}
```

> Token names have **no `-box-` infix**: it is `--falcon-otp-bg-focus` / `--falcon-otp-border-color-focus` / `--falcon-otp-box-size-md` (the box *size* tokens do carry `box`) / `--falcon-otp-gap` (single, not per-size). A prior version of this doc used `--falcon-otp-box-bg-focus` / `--falcon-otp-box-border-color-focus` — those do not exist.

## Bad usage to avoid

- **Do NOT** use for password entry → `<falcon-angular-password>`.
- **Do NOT** set `length` to a value the backend did not issue — verification can never pass.
- **Do NOT** grant access on `complete=true` — completion ≠ correctness; wait for the backend.
- **Do NOT** re-implement paste-fill / auto-advance / SMS-autofill — all built in.
- **Do NOT** rely on Enter-to-submit — Enter is swallowed; wire a button or the completion signal.
- **Do NOT** target `--falcon-otp-box-bg-focus` — use `--falcon-otp-bg-focus`.
- **Do NOT** use `*ngIf`/`*ngFor` around it — use `@if`/`@for`.

## Do / Don't

| Do | Don't |
|---|---|
| Use for 4–8 char codes; match backend length. | Use for free-text / password. |
| Set `mask=true` for true PINs only. | Mask transient OTPs (breaks SMS auto-fill UX). |
| Bind via CVA. | Bind `[value]` directly. |
| Detect completion via length / Verify action. | Grant access on `complete` alone. |
| Override `--falcon-otp-bg-focus` etc. | Invent `--falcon-otp-box-bg-focus`. |

## Consumer Sweep (2026-06-03)

[CODE] grep `falcon-angular-otp` across `apps/` + `libs/falcon/` returned **3 application consumer file(s)** as of 2026-06-03 (plus 1 Studio showcase registry entry):

- `apps/host-shell/src/app/features/auth/enter-otp/enter-otp.component.html` — login OTP step.
- `apps/host-shell/src/app/features/auth/forgot-password-flow/forgot-password-flow.component.html` — recovery code.
- `libs/falcon/src/shared-ui/lib/components/otp-dialog/otp-dialog.component.html` — shared OTP dialog (moved here from the old `apps/host-shell/.../shared-components/otp-dialog/`).
- `libs/falcon-studio/src/lib/registry/gallery-defaults.ts` — Studio showcase registry (NOT a runtime feature consumer).

> Change since Wave 7 (4 files): the playground demo route is gone; the otp-dialog relocated from host-shell shared-components into `libs/falcon/shared-ui`. Net live feature consumers: **3** (auth ×2 + shared dialog).
