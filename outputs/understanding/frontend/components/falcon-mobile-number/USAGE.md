# falcon-mobile-number (LEGACY FACADE — REMOVED) — USAGE

> **RECONCILE 2026-06-03 (B22):** The façade is **DELETED.** There is no valid usage of `<falcon-mobile-number>` — use `<falcon-angular-phone-field>`. This file is kept to record the migration and the Consumer Sweep that proved removal is safe.

## Real usage in active codebase (2026-06-03)
- `[CODE]` **0 live consumers.** Nothing in `apps/` or `libs/falcon/` (non-`dist`) renders `<falcon-mobile-number>`.

## Recommended usage (the replacement)
```html
<!-- The migrated forgot-password flow is the canonical reference: -->
<falcon-angular-phone-field
  [label]="'forgotPassword.fields.phone.label' | translate"
  [country]="'SA'"
  [(ngModel)]="phone"
  (ngModelChange)="onPhoneNumberChange($event)"
  (blur)="onRequestBlur('phoneNumber')"
  [state]="phoneNumberError() ? 'error' : 'default'"
  [errorMessage]="translateError(phoneNumberError())">
</falcon-angular-phone-field>
```
> `[CODE]` taken from the live `apps/host-shell/.../forgot-password-flow/forgot-password-flow.component.html:60-71` — the exact page that used to host `<falcon-mobile-number>`.

## Reactive Forms / ngModel
- The replacement `<falcon-angular-phone-field>` provides full CVA. Works with `formControlName` and `[(ngModel)]`. Pair with a phone validator (e.g. `saudiPhoneValidator`) in the consumer.

## Do / Don't

| Do | Don't |
|---|---|
| Use `<falcon-angular-phone-field>` for every phone field. | Try to import `FalconMobileNumberComponent` — it is gone. |
| Pre-translate the `[label]` string. | Pass `preferredCountries` / `showDialCode` / `maxLength` (were no-ops; absent now). |
| Bind `[country]="'SA'"` (UPPER ISO-2). | Re-create the local 25-country `ISO2_TO_DIAL` map — the phone-field has the full list. |

## Consumer Sweep (2026-06-03)

[CODE] `Grep "<falcon-mobile-number"` across the repo (excluding `dist/`):
- **0 source/template consumers.**
- Residual non-source hits: `docs/_plans/W21-W25-wizard-roadmap.md:109` (historical roadmap), `docs/archive/WAVE-A-OLD-STRUCTURE.md:448,480` (archived DEP lists), `docs/_plans/W21-wizard-plan.md:156` (planning table). None compile.

[CODE] **Migration proof:** the Wave-7 sole live consumer `apps/host-shell/src/app/features/auth/forgot-password-flow/forgot-password-flow.component.html` now renders `<falcon-angular-phone-field>` (lines 60-71) — confirmed by grep. The second Wave-7 "consumer" was the façade's own template, deleted with the folder.

> Wave 7 (2026-05-17) count was **2**; B22 count is **0** because the one real consumer migrated and the folder was removed.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B22). Consumer Sweep re-run (`<falcon-mobile-number>` → 0 live; only historical docs). The replacement snippet is 🟢 lifted from the live migrated `forgot-password-flow.component.html`.
