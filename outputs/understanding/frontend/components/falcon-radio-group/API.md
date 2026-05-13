# falcon-radio-group — API

## Selectors

- Angular: `falcon-angular-radio-group`
- Stencil pair exists; Angular composition is the active path.

## Import

```ts
import { FalconAngularRadioGroupComponent, FalconRadioGroupOption } from '@falcon/ui-core';
```

## Inputs

| Name | Type | Default | Notes |
|---|---|---|---|
| `options` | `FalconRadioGroupOption[]` | `[]` | Required. |
| `selectedValue` (setter) | `string \| number \| boolean \| null \| undefined` | `null` | Two-way via `selectedValueChange`. CVA also writes. |
| `orientation` | `'vertical' \| 'horizontal'` | `'vertical'` | |
| `groupLabel` | `string?` | — | |
| `helperText` | `string?` | — | |
| `errorText` | `string?` | — | |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Forwarded to each radio. |
| `disabled` | `boolean` | `false` | |
| `required` | `boolean` | `false` | |
| `useTailwind` | `boolean` | `true` | Forwarded. |
| `name` | `string` | auto `falcon-radio-group-{seq}` | Shared `name` for native exclusivity. |

## Outputs

| Name | Payload | Notes |
|---|---|---|
| `selectedValueChange` | `string \| number \| boolean \| null` | |

## TypeScript types

```ts
export interface FalconRadioGroupOption {
  value: string | number | boolean;
  label: string;
  disabled?: boolean;
}
```

## CVA

YES. `writeValue` sets the selected; `onChange` fires when option clicked.

## Methods

None.

## Slots / template inputs

- None. Label-only per-option.

## Constraints

- Single-value (radio semantics).
- `name` auto-generated and shared across child radios for native exclusivity.
- Wrapper disabled OR CVA disabled OR per-option disabled all flow through `isDisabled()`.

## Accessibility

- Group should have `role="radiogroup"` + `aria-labelledby` (verify template).
- Arrow-key navigation across radios within group (Stencil-side responsibility — verify).
- Error message has `role="alert"`.
