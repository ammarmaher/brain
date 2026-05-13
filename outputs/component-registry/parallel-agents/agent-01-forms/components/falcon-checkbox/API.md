# falcon-checkbox — API

## Selectors

- Angular: `falcon-angular-checkbox`
- Stencil Shadow: `<falcon-checkbox>`
- Stencil Light: `<falcon-checkbox-tw>`

## Import

```ts
import { FalconAngularCheckboxComponent } from '@falcon/ui-core';
```

## Inputs

| Name | Type | Default | Notes |
|---|---|---|---|
| `label` | `string?` | — | Label text — also accepts `<ng-content>` projection. |
| `helperText` | `string?` | — | |
| `errorText` | `string?` | — | (Same `errorText` naming as dropdown.) |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | |
| `state` | `'default' \| 'error' \| 'success' \| 'warning'` | `'default'` | |
| `readonly` | `boolean` | `false` | |
| `required` | `boolean` | `false` | |
| `name` | `string?` | — | |
| `value` | `string \| number \| boolean` | `'on'` | Native form-submit value when checked. |
| `inputId` | `string?` | auto `falcon-acb-{seq}` | |
| `indeterminate` (setter) | `boolean` | `false` | Tri-state. Lost on user toggle. |
| `checkedInput` (setter) | `boolean \| null \| undefined` | — | Bypasses CVA — used by checkbox-group for parent-driven binding. |
| `useTailwind` | `boolean` | `true` | |
| `rowClass / boxClass / labelClass` | `string` | `''` | Tailwind path. |

## Outputs

| Name | Payload | Notes |
|---|---|---|
| `valueChange` | `boolean` | CVA write — also fires on indeterminate→toggle. |

Stencil emits `falcon-change` with `{ checked, value }` detail + `falcon-blur`.

## TypeScript types

```ts
type FalconCheckboxSize = 'sm' | 'md' | 'lg';
type FalconCheckboxState = 'default' | 'error' | 'success' | 'warning';
```

## CVA / Reactive Forms

YES. `writeValue(boolean | null | undefined)` coerces to boolean. `[(ngModel)]`, `formControlName` work. Toggling automatically resets `indeterminate` (matches native behaviour).

Note: there are **two** ways to set the checked state:
1. **Via CVA** — `[(ngModel)]` / `formControlName` (canonical).
2. **Via `checkedInput`** — parent-driven binding bypass; used by `<falcon-angular-checkbox-group>` so it can manage selection without per-checkbox CVA registration.

## Methods

None proxied. Stencil-side may have `toggle()` / `setFocus()` — verify.

## Slots / template inputs

- Stencil-side has default slot for label content. The Angular template projects `<ng-content>` (verify).
- No `ng-template` inputs.

## Constraints

- The `indeterminate` state is lost on user toggle (matches native). Consumer must re-set if needed.
- `checkedInput` and CVA are mutually exclusive in spirit — using both will conflict.

## Accessibility

- Native `<input type="checkbox">` inside Stencil — full native A11y.
- Required asterisk + `aria-required`.
- `aria-invalid` on error state.
- Error message `role="alert"`.
- Label `htmlFor` ties to native input.
