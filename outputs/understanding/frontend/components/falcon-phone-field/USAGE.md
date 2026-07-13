# falcon-phone-field — USAGE

## Real usage examples (active codebase)

### Example 1 — User-Details phone with Verify, PES-gated readonly (flagship)

`libs/falcon/src/shared-features/user-details/components/user-details-page.component.html:453`:

```html
<falcon-angular-phone-field class="w-full"
  size="md"
  [label]="'hierarchy.userDetails.phone' | translate"
  [required]="true"
  [maxlength]="10"  <!-- ⚠ NOT a wrapper input — falls through as an unknown attr; does NOT cap the inner input (GAP) -->
  [readonly]="!state.permFlags().canEditPhone || state.isTargetStatusFrozen()"
  [verifyButton]="true"
  [verifyIcon]="true"
  [verifyLabel]="'hierarchy.userDetails.verify' | translate"
  [verifyDisabled]="state.phoneVerifyDisabled()"
  [state]="state.phoneState()"
  [ngModel]="…" (ngModelChange)="…" (blur)="…"
  (falcon-verify)="…">
</falcon-angular-phone-field>
```

`[readonly]` is driven by the `canEditPhone` PES flag + a status-frozen gate; `[verifyDisabled]` is a separate button-only gate. Rendered by BOTH admin-console and management-console.

### Example 2 — Forgot-password mobile capture (SMS OTP)

`apps/host-shell/src/app/features/auth/forgot-password-flow/forgot-password-flow.component.html:60`:

```html
<falcon-angular-phone-field
  country="SA"
  size="lg"
  [label]="'login.forgotPasswordFlow.fields.mobileNumber' | translate"
  [required]="true"
  [ngModel]="requestFormValue().phoneNumber"
  (ngModelChange)="onPhoneNumberChange($event)"
  (blur)="onRequestBlur('phoneNumber')"
  [state]="phoneNumberError() ? 'error' : 'default'"
  [errorMessage]="translateError(phoneNumberError())"
  [ngModelOptions]="{ standalone: true }">
</falcon-angular-phone-field>
```

The emitted E.164 (`onChange(detail.value)`) is what the flow submits to `auth/forgot-password` for SMS OTP delivery.

### Example 3 — Restricted country list (GCC only)

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
<falcon-angular-phone-field [countries]="gccCountries" country="SA" [(ngModel)]="phone"></falcon-angular-phone-field>
```

### Example 4 — Reactive Forms with stricter validation

```ts
form = new FormGroup({ phone: new FormControl('', [Validators.required, customPhoneValidator()]) });
```

```html
<falcon-angular-phone-field formControlName="phone" country="SA"
  [state]="form.controls.phone.touched && form.controls.phone.invalid ? 'error' : 'default'"
  (blur)="onBlur()">
</falcon-angular-phone-field>
```

## Recommended usage for NEW Angular pages

- Always use this for phones (never raw `<input type="tel">`).
- Pass `country` for a sensible default; pass `[countries]` to restrict by business region.
- Pair the control with `Validators.required` + a libphonenumber/regex validator — the component does NOT validate.
- Bind `(blur)` so touched updates (native blur doesn't bubble).
- Seed `country` alongside the value (`writeValue` doesn't parse a dial-code prefix).

## ngModel (template forms)

```html
<falcon-angular-phone-field [(ngModel)]="phone" country="SA" (blur)="markTouched()"></falcon-angular-phone-field>
```

## Tailwind-only usage

Host layout via `class=`; per-instance overlay via `wrapperClass`/`inputClass`/`labelClass` (forwarded as `*-extra-class` to the `-tw` twin):

```html
<falcon-angular-phone-field class="w-full" wrapperClass="ring-1 ring-falcon-neutral-200" [(ngModel)]="phone" />
```

## Token usage (per-instance override pattern)

```css
.client-phone {
  --falcon-phone-field-cc-bg-hover: var(--color-falcon-neutral-50);
  --falcon-phone-field-divider-color: var(--color-falcon-neutral-200);
  --falcon-phone-field-panel-shadow: 0 12px 28px rgba(15,23,42,0.18);
}
```

> `[CODE]` Both render paths read the SAME `--falcon-phone-field-*` tokens via `:where(falcon-phone-field, falcon-phone-field-tw, falcon-angular-phone-field, .falcon-phone-field, [data-falcon-phone-field], .falcon-overlay-container)`. The `.falcon-overlay-container` selector is included so the **body-portaled** country panel still inherits the tokens (gate-12-rescope wave, 2026-06-02).

## Bad usage to avoid

- **Do NOT** trust the emitted value as a valid number — it is digit-stripped + composed (`composeFullNumber`), never validated.
- **Do NOT** use `<falcon-angular-input type="tel">` instead — loses the chooser, dial code, divider, and searchable panel.
- **Do NOT** bind `[maxlength]` and expect a cap — it is not a wrapper input (it falls through as an unknown attr). Cap via a Reactive Forms validator.
- **Do NOT** bind `[value]` directly — `[attr.value]` races CVA.
- **Do NOT** set `[verifyIcon]` / `*Class` and expect them on the Shadow path — they are `-tw`-only.
- **Do NOT** re-wire `(falcon-open)`/`(falcon-close)` — the wrapper uses them for the Top-Layer popover lifecycle.
- **Do NOT** re-implement the country panel — restrict via `[countries]` instead.

## Import requirements (standalone component)

```ts
import { FalconAngularPhoneFieldComponent } from '@falcon/ui-core';
import { FormsModule } from '@angular/forms'; // or ReactiveFormsModule
@Component({ standalone: true, imports: [FalconAngularPhoneFieldComponent, FormsModule], ... })
```

## Do / Don't

| Do | Don't |
|---|---|
| Use for ALL phone fields. | Use a generic input for phones. |
| Pass `country` + filtered `[countries]`. | Render the full list when the region is known. |
| Validate via Reactive Forms + libphonenumber. | Trust the component-side value as valid. |
| Bind `(blur)` so touched updates. | Assume native blur bubbles. |
| Override via `--falcon-phone-field-*` tokens. | Hardcode hex/px inline. |

## Consumer Sweep (2026-06-03)

`[CODE]` Grep `falcon-angular-phone-field` across `apps/` + `libs/falcon/` (excluding `libs/falcon-ui-core/**`, token file, eslint config) → **~10 consumer references across these files**:

- `libs/falcon/src/shared-features/user-details/components/user-details-page.component.html` (admin + management)
- `apps/host-shell/src/app/features/auth/forgot-password-flow/forgot-password-flow.component.html`
- `apps/admin-console/.../add-client-wizard/client-account-owner-step/client-account-owner-step.component.html`
- `apps/admin-console/.../add-user-wizard/user-personal-step/user-personal-step.component.html`
- `apps/management-console/.../add-user-wizard/user-personal-step/user-personal-step.component.html`
- `apps/admin-console/.../templates-page/.../buttons/button-card.component.{html,ts}`
- `apps/management-console/.../templates-page/.../buttons/button-card.component.{html,ts}`
- `apps/{admin,management}-console/.../templates-wizard/models.ts`
- `libs/falcon-studio/src/lib/registry/gallery-defaults.ts`

Excluded non-consumers from the raw grep: `phone-field.tokens.css`, `eslint.config.mjs`, `libs/falcon-studio/WAVE-8A-AUDIT-REPORT.md`.

> The prior Wave-7 sweep listed 5 files (incl. the now-legacy `<falcon-mobile-number>` shared-ui wrapper). The component has since spread to the User-Details page, the templates builder (both consoles), and Studio.
