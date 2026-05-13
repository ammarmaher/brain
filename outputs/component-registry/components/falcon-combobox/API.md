# falcon-combobox — API

## Selectors

- Angular: `falcon-angular-combobox`
- Stencil Shadow: `<falcon-combobox>`
- Stencil Light: `<falcon-combobox-tw>`

## Import

```ts
import { FalconAngularComboboxComponent, FalconComboboxItem } from '@falcon/ui-core';
```

## Inputs

| Name | Type | Default | Notes |
|---|---|---|---|
| `items` | `FalconComboboxItem[]` | `[]` | Suggestion list. |
| `placeholder` | `string?` | — | |
| `label` | `string?` | — | |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | |
| `allowFreeText` | `boolean` | `false` | When true, users can submit text NOT in items. |
| `clearable` | `boolean` | `true` | |
| `loading` | `boolean` | `false` | Show loading indicator (e.g. while async suggestions resolve). |
| `noResultsMessage` | `string` | `'No matches'` | |
| `inputId` | `string?` | auto `falcon-acbx-{seq}` | |
| `useTailwind` | `boolean` | `true` | |
| `wrapperClass / inputClass / panelClass / optionClass / labelClass` | `string` | `''` | |

## Outputs

| Name | Payload | Notes |
|---|---|---|
| `valueChange` | `string` | Canonical CVA write. |
| `filterChange` | `string` | Emitted on each keystroke — wire for async loading. |
| `cleared` | `void` | Clear-X pressed. |

## TypeScript types

```ts
export interface FalconComboboxItem {
  value: string;
  label: string;
  disabled?: boolean;
}
```

## CVA / Reactive Forms

YES. CVA writes string value. Note: value is `string` not `string | number` (unlike dropdown).

## Methods

None proxied. Stencil-side methods (if any) not exposed on Angular wrapper.

## Slots / template inputs

- None on Angular wrapper.
- Stencil-side might support `slot="options"` — verify in source.

## Constraints

- Single string value only.
- `filterChange` runs on every keystroke — debounce externally if needed.
- `loading` is a visual hint only; consumers must drive it from their async source.
- `allowFreeText=false` rejects values not in `items` — verify Stencil enforcement.

## Accessibility

- `role="combobox"` on input.
- `aria-expanded`, `aria-controls` for panel.
- `aria-busy` when `loading` (verify Stencil).
- Per-option `role="option"`, `aria-selected`.
- Error message has `role="alert"`.
