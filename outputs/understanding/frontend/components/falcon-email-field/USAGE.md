# falcon-email-field — USAGE

## Real usage examples (active codebase)

### Example 1 — User-Details email with Verify, PES-gated readonly (flagship)

`libs/falcon/src/shared-features/user-details/components/user-details-page.component.html:474`:

```html
<falcon-angular-email-field class="w-full"
  size="md"
  [label]="'hierarchy.userDetails.email' | translate"
  [required]="true"
  [readonly]="!state.permFlags().canEditEmail || state.isTargetStatusFrozen()"
  [verifyButton]="true"
  [verifyIcon]="true"
  [verifyLabel]="'hierarchy.userDetails.verify' | translate"
  [verifyDisabled]="state.emailVerifyDisabled()"
  [state]="state.emailState()"
  [ngModel]="state.currentField().email"
  (ngModelChange)="…"
  (falcon-verify)="…"
  (blur)="…">
</falcon-angular-email-field>
```

Note: `[readonly]` is driven by a **PES flag** (`canEditEmail`) AND a status-frozen gate; `[verifyDisabled]` is a *separate* gate that disables only the button. This page is rendered by BOTH admin-console and management-console.

### Example 2 — Account-owner email (Add Client wizard)

`apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-client-wizard/client-account-owner-step/client-account-owner-step.component.html` — account-owner email, `[verifyButton]` optionally, bound through the wizard payload signal with `Validators.email` on the form control.

### Example 3 — Recommended new usage (Reactive Forms, verify synced to validity)

```html
<falcon-angular-email-field
  formControlName="email"
  [label]="'fields.email.label' | translate"
  [required]="true"
  [verifyButton]="true"
  [verifyLabel]="'Verify' | translate"
  [verifyDisabled]="form.controls.email.invalid"
  [state]="form.controls.email.touched && form.controls.email.invalid ? 'error' : 'default'"
  [errorMessage]="form.controls.email.touched && form.controls.email.invalid ? ('errors.email' | translate) : ''"
  (falcon-verify)="sendVerify($event.value)"
  (blur)="onBlur()">
</falcon-angular-email-field>
```

### Example 4 — Plain email without Verify

```html
<falcon-angular-email-field [label]="'Email'" [(ngModel)]="email"></falcon-angular-email-field>
```

(For a truly plain email with no specialization, `<falcon-angular-input type="email">` is also acceptable.)

## Recommended usage for NEW Angular pages

- Use when a verify-button affordance is wanted; keep `verifyDisabled` synced to form validity so the operator cannot verify a malformed address.
- Always pair the form control with `Validators.email` (+ `Validators.required`) — the component does NOT validate format.
- Bind `(blur)` (re-emitted) so `touched` updates and required errors surface.
- Defaults: `useTailwind=true`, `placeholder='name@example.com'`, `autocomplete='email'`, `size='md'`.

## Reactive Forms

```ts
form = new FormGroup({ email: new FormControl('', [Validators.required, Validators.email]) });
```

## ngModel (template forms)

```html
<falcon-angular-email-field [(ngModel)]="email" (blur)="markTouched()"></falcon-angular-email-field>
```

## Tailwind-only usage

Host-side layout via `class=`; per-instance Tailwind overlay via `wrapperClass`/`inputClass`/`labelClass` (these DO flow — forwarded as `*-extra-class` attrs to the `-tw` twin, `[CODE]` `.html:25-27`):

```html
<falcon-angular-email-field class="max-w-md w-full" wrapperClass="ring-1 ring-falcon-neutral-200" [(ngModel)]="email" />
```

## Token usage (per-instance override pattern)

```css
.verify-email {
  --falcon-email-field-verify-color: var(--color-falcon-teal-700);
  --falcon-email-field-verify-bg-hover: var(--color-falcon-teal-50);
  --falcon-email-field-border-radius: 8px;
}
```

> `[CODE]` Both render paths read the SAME `--falcon-email-field-*` tokens via the `:where(falcon-email-field, falcon-email-field-tw, falcon-angular-email-field, .falcon-email-field, [data-falcon-email-field])` chain.

## Bad usage to avoid

- **Do NOT** rely on the component to validate the email — it emits `falcon-verify` only; format validation is the consumer's Reactive Forms `Validators.email`.
- **Do NOT** expect a "verified ✓" badge to appear after `falcon-verify` — no `verified` state exists (GAP G2).
- **Do NOT** bind `[disabled]` as a template input — it does not exist; disable via the form control. `verifyDisabled` only disables the button.
- **Do NOT** bind `[value]` directly — `[attr.value]` races CVA.
- **Do NOT** set `[verifyIcon]` and expect it on the Shadow path — it is `-tw`-only.
- **Do NOT** place a separate `<falcon-angular-button>` next to a plain input to fake the verify look — use `verifyButton` so the shared border + divider are correct.

## Import requirements (standalone component)

```ts
import { FalconAngularEmailFieldComponent } from '@falcon/ui-core';
import { FormsModule } from '@angular/forms'; // or ReactiveFormsModule
@Component({ standalone: true, imports: [FalconAngularEmailFieldComponent, FormsModule], ... })
```

## Do / Don't

| Do | Don't |
|---|---|
| Use for emails needing a verify affordance. | Use for plain text. |
| Validate via Reactive Forms `Validators.email`. | Trust component-side validation. |
| Sync `verifyDisabled` with form validity. | Allow verify on an invalid email. |
| Bind `(blur)` so touched updates. | Assume native blur bubbles (it doesn't). |
| Override via `--falcon-email-field-*` tokens. | Hardcode hex/px inline. |

## Consumer Sweep (2026-06-03)

`[CODE]` Grep `falcon-angular-email-field` across `apps/` + `libs/falcon/` (excluding `libs/falcon-ui-core/**`) → **2 real consumer files** (+ token/registry/doc hits excluded):

- `libs/falcon/src/shared-features/user-details/components/user-details-page.component.html` (rendered by admin-console + management-console)
- `libs/falcon-studio/src/lib/registry/gallery-defaults.ts` (Studio gallery default)

Excluded non-consumers from the raw grep: `email-field.tokens.css` (the token file), `libs/falcon-studio/WAVE-8A-AUDIT-REPORT.md` (doc).

> Correction: the prior Wave-7 sweep listed only `playground.page.html` (count 1) — stale. The real production consumer is the shared User-Details page.
