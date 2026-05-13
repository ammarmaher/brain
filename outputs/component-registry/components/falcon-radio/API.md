# falcon-radio — API

## Selectors

- Angular: `falcon-angular-radio`
- Stencil Shadow: `<falcon-radio>`
- Stencil Light: `<falcon-radio-tw>`

## Import

```ts
import { FalconAngularRadioComponent } from '@falcon/ui-core';
```

## Inputs

| Name | Type | Default | Notes |
|---|---|---|---|
| `label` | `string?` | — | |
| `helperText` | `string?` | — | |
| `errorText` | `string?` | — | |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | |
| `state` | `'default' \| 'error' \| 'success' \| 'warning'` | `'default'` | |
| `required` | `boolean` | `false` | |
| `name` | `string?` | — | Required for native radio exclusivity within a group. |
| `value` | `string \| number \| boolean` | `'on'` | The value emitted when this radio is selected. |
| `inputId` | `string?` | auto `falcon-arad-{seq}` | |
| `checkedInput` (setter) | `boolean \| null \| undefined` | — | Parent-driven binding (used by radio-group). |
| `useTailwind` | `boolean` | `true` | |
| `rowClass / markClass / labelClass` | `string` | `''` | Tailwind path. |

## Outputs

| Name | Payload | Notes |
|---|---|---|
| `valueChange` | `boolean` | Emits true when this radio becomes checked. |

Stencil emits `falcon-change` (`{ checked, value }`) + `falcon-blur`.

## CVA / Reactive Forms

YES — but with a twist. `writeValue(value)` receives the GROUP's current value; the radio internally compares to its own bound `value` to set `checked$`. `onChange(this.value)` is fired when this radio becomes checked. For standalone usage, bind via `formControl` + the radio's `value` matches the form value.

## Methods

None proxied.

## Slots / template inputs

- Default slot for label content (Stencil). Verify Angular projection.

## Constraints

- Single radio. For mutual exclusivity across multiple options, use `<falcon-angular-radio-group>`.
- Within a group, the `name` must match across all radios. Radio-group auto-generates and forwards.
- CVA value is the bound `value` when checked, `null` otherwise.

## Accessibility

- Native `<input type="radio">` underneath.
- Required marker + `aria-required`.
- `aria-invalid` on error.
- Error has `role="alert"`.
- Group-level keyboard nav (Arrow keys move selection) lives on radio-group.
