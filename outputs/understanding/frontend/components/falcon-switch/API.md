# falcon-switch — API

## Selectors

- Angular: `falcon-angular-switch`
- Stencil Shadow: `<falcon-switch>`
- Stencil Light: `<falcon-switch-tw>`

## Import

```ts
import { FalconAngularSwitchComponent } from '@falcon/ui-core';
```

## Inputs

| Name | Type | Default | Notes |
|---|---|---|---|
| `variant` | `'dot-knob' \| 'hidden-input' \| 'channel-pill'` | `'dot-knob'` | Three visual variants. |
| `label` | `string?` | — | |
| `helperText` | `string?` | — | |
| `errorText` | `string?` | — | |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | |
| `state` | `'default' \| 'error' \| 'success' \| 'warning'` | `'default'` | |
| `required` | `boolean` | `false` | |
| `name` | `string?` | — | |
| `value` | `string \| number \| boolean` | `'on'` | Native form value when on. |
| `inputId` | `string?` | auto `falcon-asw-{seq}` | |
| `textOn` | `string?` | — | For `channel-pill` variant — left-side text. |
| `textOff` | `string?` | — | For `channel-pill` variant — right-side text. |
| `checkedInput` (setter) | `boolean \| null \| undefined` | — | Parent-driven bypass. |
| `useTailwind` | `boolean` | `true` | |
| `rowClass / trackClass / labelClass` | `string` | `''` | |

## Outputs

| Name | Payload | Notes |
|---|---|---|
| `valueChange` | `boolean` | CVA write. |

Stencil emits `falcon-change` + `falcon-blur`.

## TypeScript types

```ts
type FalconSwitchSize = 'sm' | 'md' | 'lg';
type FalconSwitchState = 'default' | 'error' | 'success' | 'warning';
type FalconSwitchVariant = 'dot-knob' | 'hidden-input' | 'channel-pill';
```

## CVA

YES.

## Methods

None proxied.

## Slots / template inputs

- Default slot for label content.

## Constraints

- `textOn` / `textOff` only render in `channel-pill` variant.
- Single boolean — no tri-state.

## Accessibility

- Native `<input type="checkbox">` underneath.
- `role="switch"` + `aria-checked`.
- Required marker + `aria-required`.
- Error has `role="alert"`.
- Label `htmlFor` ties to native input.
