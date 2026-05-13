# falcon-checkbox-group — API

## Selectors

- Angular: `falcon-angular-checkbox-group`
- Stencil pair exists but Angular composition is the primary code path.

## Import

```ts
import { FalconAngularCheckboxGroupComponent, FalconCheckboxGroupOption } from '@falcon/ui-core';
```

## Inputs

| Name | Type | Default | Notes |
|---|---|---|---|
| `options` | `FalconCheckboxGroupOption[]` | `[]` | Required. |
| `selectedValues` (setter) | `ReadonlyArray<string \| number> \| null \| undefined` | `[]` | Two-way via `selectedValuesChange`. Wrapper also implements CVA. |
| `orientation` | `'vertical' \| 'horizontal'` | `'vertical'` | |
| `groupLabel` | `string?` | — | |
| `helperText` | `string?` | — | |
| `errorText` | `string?` | — | |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Passed to each child checkbox. |
| `disabled` | `boolean` | `false` | |
| `useTailwind` | `boolean` | `true` | Forwarded to each child checkbox. |
| `name` | `string?` | — | |

## Outputs

| Name | Payload | Notes |
|---|---|---|
| `selectedValuesChange` | `Array<string \| number>` | Mirrors CVA write. |

## TypeScript types

```ts
export interface FalconCheckboxGroupOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}
```

## CVA / Reactive Forms

YES. Wrapper implements `ControlValueAccessor`. `writeValue([])` accepts the array; `registerOnChange` invoked on toggle; `setDisabledState` honors CVA disabled.

## Methods

None.

## Slots / template inputs

- None on Angular wrapper. Per-option label is `option.label` text only — no template / icon.

## Constraints

- Manages selection by value comparison via `Array.includes(value)`.
- Disables children when wrapper `disabled` OR CVA disabled OR per-option `disabled`.
- Uses `trackByValue` for *ngFor identity (now @for in templates).

## Accessibility

- Per-checkbox A11y inherited from `<falcon-angular-checkbox>`.
- `groupLabel` should be rendered as `<legend>`-like text — verify template wraps in a `role="group"` + `aria-labelledby`.
- Error text under group has `role="alert"`.
