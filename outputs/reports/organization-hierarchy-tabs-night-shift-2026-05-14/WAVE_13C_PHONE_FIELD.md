# Wave 13c — Legacy Phone-Field Migration

**Gap:** GAP-LIB-005 — replace `<falcon-mobile-number>` with `<falcon-angular-phone-field>` in wizard consumers.
**Scope:** admin-console only. management-console, host-shell `forgot-password-flow`, and `user-details-page` (Wave 7b) explicitly preserved.
**Status:** Migration complete. Build status: pre-existing errors out of scope (see Notes).

## Files Changed (4)

1. `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-user-wizard/user-personal-step/user-personal-step.component.html`
2. `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-user-wizard/user-personal-step/user-personal-step.component.ts`
3. `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-client-wizard/client-account-owner-step/client-account-owner-step.component.html`
4. `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-client-wizard/client-account-owner-step/client-account-owner-step.component.ts`

## Input Mapping Applied

| Legacy `<falcon-mobile-number>` | New `<falcon-angular-phone-field>` |
|--------------------------------|-----------------------------------|
| `[ngModel]` / `(ngModelChange)` | `[ngModel]` / `(ngModelChange)` (CVA preserved) |
| `[error]="!!phoneError()"` | `[state]="phoneError() ? 'error' : 'default'"` |
| `[useCustomStyle]="false"` | *(removed — Tailwind render path is default since v5)* |
| *(none — implicit)* | `[country]="'SA'"` (Saudi Arabia per source spec) |
| *(none — implicit)* | `[verifyButton]="true"` (verify button visible per spec) |
| `(focusout)` | `(focusout)` (preserved) |

## Import Mapping Applied

- Removed: `FalconMobileNumberComponent` from `@falcon`
- Added: `FalconAngularPhoneFieldComponent` from `@falcon` (re-exported at `libs/falcon/src/shared-ui/index.ts:335` from `@falcon/ui-core/angular`)
- Standalone `imports[]` array updated in both `.ts` files.

## Build Status

Command: `npx nx build admin-console --skip-nx-cache`

**Zero errors or warnings related to Wave 13c migrated files.**

Two unrelated pre-existing errors still present (NOT caused by this wave):

1. `apps/admin-console/.../insufficient-balance-modal/insufficient-balance-modal.component.ts:32` — `NG2008: Could not find template file './insufficient-balance-modal.component.html'.` Untracked new dir from a prior wave, missing HTML template.
2. `libs/falcon-ui-core/src/tailwind/button-tailwind-classes.ts:50, 123` — `TS2741: Property 'dashed' is missing in type` Pre-existing in modified `button-tailwind-classes.ts`.

Both belong to other waves (insufficient-balance and button-dashed-variant work) and are out of Wave 13c scope.

## Deviations

- `[label]` not added — labels are owned by the parent `<falcon-form-field label="...">` wrapper (consistent with all other field wrappers in these forms). Adding `[label]` on the inner component would render duplicate labels.
- `[required]` not added on the field — required visual indicator is owned by `<falcon-form-field [required]="true">` parent.
- `verifyLabel` left at component default (`'Verify'`); i18n key for verify can be wired in a follow-up if needed.

## Blockers

None. Build errors are pre-existing and outside Wave 13c scope.

## Out-of-Scope Consumers (NOT touched)

- `apps/management-console/.../user-personal-step/user-personal-step.component.ts` (different app)
- `apps/management-console/.../client-account-owner-step/client-account-owner-step.component.ts` (different app)
- `apps/host-shell/.../forgot-password-flow/forgot-password-flow.component.ts` (different app)
- `apps/admin-console/.../user-details/user-details-page.component.*` (Wave 7b pattern preserved per brief)
