# falcon-form-field — API

## Selectors

- Angular: `falcon-form-field`

## Import

```ts
import { FalconFormFieldComponent } from '@falcon/shared-ui';
```

## Inputs (all signal inputs — Angular `input()`)

| Name | Type | Default | Notes |
|---|---|---|---|
| `label` | `string` | `''` | i18n key resolved through `TranslatePipe`. Empty string skips label row. |
| `required` | `boolean` | `false` | Renders required asterisk. |
| `hint` | `string` | `''` | i18n key for helper text. |
| `errorKey` | `string \| null` | `null` | i18n key for error message. |
| `errorParams` | `Record<string, string \| number> \| null` | `null` | Interpolation params for `errorKey` (e.g. `{ max: 30 }`). |
| `disabled` | `boolean` | `false` | |
| `invalid` | `boolean \| null` | `null` | Explicit override — when set, drives invalid visual; otherwise inferred from `errorKey`. |

## Outputs

None.

## TypeScript types

None specific — all primitives.

## CVA / Reactive Forms

NOT a form control — it's a layout/labeled wrapper.

## Methods

None.

## Slots / template inputs

- Default `<ng-content>` slot for the actual control (input / dropdown / etc.).

## Constraints

- Uses `TranslatePipe` from `@falcon/language` — `label`, `hint`, `errorKey` are translation keys.
- Computed `hasError` signal returns `invalid()` when explicit, otherwise `!!errorKey()`.
- Does NOT enforce that the slotted control matches the label state — consumer must sync.
- SCSS file exists — flag for migration to Tailwind utilities only.

## Accessibility

- Verify label is wired to inner control via `for`/`htmlFor` (likely not — the slotted child has its own ID; label may not be programmatically associated). **Cross-link to GAPS.**
- Required asterisk rendered separately from `aria-required` on the inner control — consumer must set both.
