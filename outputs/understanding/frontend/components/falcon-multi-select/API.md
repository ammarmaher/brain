# falcon-multi-select — API

## Selectors

- Angular: `falcon-angular-multi-select`
- Stencil Shadow: `<falcon-multi-select>`
- Stencil Light: `<falcon-multi-select-tw>`

## Import

```ts
import { FalconAngularMultiSelectComponent, FalconMultiSelectOption } from '@falcon/ui-core';
```

## Inputs

| Name | Type | Default | Notes |
|---|---|---|---|
| `label` | `string?` | — | |
| `placeholder` | `string?` | — | |
| `helperText` | `string?` | — | |
| `errorText` | `string?` | — | (Same `errorText` vs `errorMessage` API inconsistency as dropdown.) |
| `options` | `FalconMultiSelectOption[]` (setter) | `[]` | Push-options-on-ready handling identical to dropdown. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | |
| `state` | `'default' \| 'error' \| 'success' \| 'warning'` | `'default'` | |
| `readonly` | `boolean` | `false` | |
| `required` | `boolean` | `false` | |
| `clearable` | `boolean` | `false` | Clear-all X. |
| `searchable` | `boolean` | `false` | Search field inside panel. |
| `name` | `string?` | — | |
| `inputId` | `string?` | auto `falcon-ams-{seq}` | |
| `searchPlaceholder` | `string` | `'Search…'` | |
| `emptyMessage` | `string` | `'No results'` | |
| `maxChipsVisible` | `number` | `3` | Triggers "+N more" overflow pill beyond this count. |
| `showSelectAll` | `boolean` | `false` | Tri-state row at top of panel. |
| `selectAllLabel` | `string` | `'Select all'` | |
| `useTailwind` | `boolean` | `true` | Render-path switch. |
| `wrapperClass / triggerClass / panelClass / optionClass / labelClass` | `string` | `''` | Tailwind path. |

## Outputs

| Name | Payload | Notes |
|---|---|---|
| `valuesChange` | `ReadonlyArray<string \| number>` | CVA write. |
| `opened` | `void` | |
| `closed` | `void` | |

Stencil emits `falcon-change`, `falcon-clear`, `falcon-open`, `falcon-close`, `falcon-search`, `falcon-blur`.

## TypeScript types

```ts
export interface FalconMultiSelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}
type FalconMultiSelectValue = ReadonlyArray<string | number>;
```

## CVA

YES. `writeValue(value: ReadonlyArray<string | number>)` writes selected values; also triggers `pushOptions()` so Stencil's `values` prop stays in sync.

## Methods

None proxied on Angular wrapper. Stencil tag is expected to expose similar `openPanel`/`closePanel`/`setFocus`/`clear` family — verify against Stencil source.

## Slots / template inputs

- Stencil-side `slot="options"` likely (mirrors dropdown). Angular wrapper does NOT project — GAP.
- No per-chip / per-option ng-template — GAP.

## Constraints

- Multi-value only. Use `<falcon-angular-dropdown>` for single.
- `maxChipsVisible` cap shows "+N" overflow pill; clicking shows full list? — verify Stencil behaviour.
- `showSelectAll` is tri-state: unchecked / indeterminate / all-checked.

## Accessibility

- Trigger has combobox role + `aria-expanded` + `aria-controls`.
- Each option is `role="option"` with `aria-selected`.
- Chips removable via keyboard (verify).
- Error message has `role="alert"`.
