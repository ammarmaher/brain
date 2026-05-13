# falcon-date-picker — API

## Selectors

- Angular: `falcon-angular-date-picker`
- Stencil Shadow: `<falcon-date-picker>`
- Stencil Light: `<falcon-date-picker-tw>`

## Import

```ts
import { FalconAngularDatePickerComponent } from '@falcon/ui-core';
```

## Inputs

| Name | Type | Default | Notes |
|---|---|---|---|
| `value` | `string \| null` | `null` | ISO `'YYYY-MM-DD'`. |
| `label` | `string?` | — | |
| `placeholder` | `string` | `'YYYY-MM-DD'` | |
| `helperText` | `string?` | — | |
| `errorMessage` | `string?` | — | |
| `min` | `string?` | — | |
| `max` | `string?` | — | |
| `disabledDates` | `ReadonlyArray<string> \| ((d: Date) => boolean)` | — | JS prop. |
| `firstDayOfWeek` | `0..6` | `0` | |
| `locale` | `string` | `'en-US'` | |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | |
| `state` | `'default' \| 'error' \| 'success' \| 'warning'` | `'default'` | |
| `disabled` | `boolean` | `false` | |
| `readonly` | `boolean` | `false` | |
| `required` | `boolean` | `false` | |
| `name` | `string?` | — | |
| `inputId` | `string?` | — | |
| `useTailwind` | `boolean` | `true` | |
| `rootClass` | `string` | `''` | |

## Outputs

| Name | Payload | Notes |
|---|---|---|
| `falconChange` | Full Stencil detail | |
| `falconBlur` | | |
| `falconOpen` | | Popover opened. |
| `falconClose` | | Popover closed. |
| `valueChange` | `string \| null` | Simplified two-way. |

## CVA

**NO** — same as calendar. Bind via `[value]` + `(valueChange)`.

## Methods

None proxied.

## Slots / template inputs

- None on wrapper.

## Constraints

- Outside-click + Escape close.
- `disabledDates` as JS prop only (wrapper handles via `syncProps()`).
- Single-date only (no range, no time).
- ISO string format on output.

## Accessibility

- Trigger has `role="combobox"`, `aria-haspopup="dialog"` (verify), `aria-expanded`.
- Popover has `role="dialog"` (verify).
- Required marker + `aria-required` + `aria-invalid`.
- Error has `role="alert"`.
