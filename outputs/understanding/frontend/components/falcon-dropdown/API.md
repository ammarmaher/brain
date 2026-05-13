# falcon-dropdown — API

## Selectors / tags

- Angular: `falcon-angular-dropdown`
- Stencil Shadow: `<falcon-dropdown>` (shadow: true)
- Stencil Light: `<falcon-dropdown-tw>` (shadow: false)

## Import

```ts
import { FalconAngularDropdownComponent, FalconDropdownOption } from '@falcon/ui-core';
```

## Inputs (Angular wrapper)

| Name | Type | Default | Notes |
|---|---|---|---|
| `label` | `string?` | `undefined` | |
| `placeholder` | `string?` | `undefined` | |
| `helperText` | `string?` | `undefined` | |
| `errorText` | `string?` | `undefined` | NOTE: wrapper uses `errorText` not `errorMessage` (Stencil tag uses `errorMessage`). See GAPS — minor API inconsistency vs sibling components. |
| `options` | `FalconDropdownOption[] \| null \| undefined` | `[]` | Setter triggers `pushOptions()` to live Stencil element. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | |
| `state` | `'default' \| 'error' \| 'success' \| 'warning'` | `'default'` | |
| `variant` | `'form' \| 'search' \| 'grid'` | `'form'` | Wave 9.C. |
| `appearance` | `'default' \| 'filled' \| 'ghost'` | `'default'` | Wave 9.C. |
| `readonly` | `boolean` | `false` | |
| `required` | `boolean` | `false` | |
| `clearable` | `boolean` | `false` | |
| `searchable` | `boolean` | `false` | Shows search input inside panel. |
| `name` | `string?` | `undefined` | |
| `inputId` | `string?` | auto `falcon-ad-{seq}` | |
| `searchPlaceholder` | `string` | `'Search…'` | |
| `emptyMessage` | `string` | `'No results'` | |
| `useTailwind` | `boolean` | `true` | Render-path switch. |
| `wrapperClass` | `string` | `''` | Tailwind path. |
| `triggerClass` | `string` | `''` | Tailwind path. |
| `panelClass` | `string` | `''` | Tailwind path. |
| `optionClass` | `string` | `''` | Tailwind path. |
| `labelClass` | `string` | `''` | Tailwind path. |

## Outputs

| Name | Payload | Notes |
|---|---|---|
| `valueChange` | `string \| number \| null` | Mirrors CVA write. |
| `opened` | `void` | Panel opened. |
| `closed` | `void` | Panel closed. |
| (Stencil events on bare tag) | `falcon-change`, `falcon-search`, `falcon-open`, `falcon-close`, `falcon-clear`, `falcon-blur` | All `CustomEvent<{ value }>`. |

## TypeScript types

```ts
export interface FalconDropdownOption {
  value: string | number;
  label: string;
  disabled?: boolean;
  iconUrl?: string;        // Wave 4 — replaces per-item ng-template for icons/flags
  iconSrcset?: string;
  iconAlt?: string;
}
type FalconDropdownSize = 'sm' | 'md' | 'lg';
type FalconDropdownState = 'default' | 'error' | 'success' | 'warning';
type FalconDropdownValue = string | number | null;
type FalconDropdownVariant = 'form' | 'search' | 'grid';
type FalconDropdownAppearance = 'default' | 'filled' | 'ghost';
```

## CVA / Reactive Forms

**YES** — `NG_VALUE_ACCESSOR` + `forwardRef`. Supports `[(ngModel)]`, `formControl`, `formControlName`. `setDisabledState(true)` toggles internal disabled signal which the template forwards via `[attr.disabled]`.

## Methods (Stencil only)

- `openPanel()`
- `closePanel()`
- `setFocus()` — focuses trigger button.
- `clear()` — applies clear.

> **GAP** — Angular wrapper does NOT proxy these methods (same as `<falcon-input>`).

## Slots / template inputs

- **Stencil Shadow**: `slot="options"` exists in the listbox (allows full panel custom rendering by replacing the default option loop). Default content is the auto-generated option list.
- **Angular wrapper**: no `ng-template` inputs. The Stencil `slot="options"` can be used via raw Stencil tag but NOT through the Angular wrapper's template.
- Per-option custom templates → NOT supported beyond `iconUrl` (see GAPS).

## Constraints

- Single-value only. Use `<falcon-angular-multi-select>` for multi.
- `searchable` panel auto-focuses search input on open.
- Type-ahead (closed dropdown) uses 600ms drain buffer matching native `<select>` behaviour.
- Outside-click + Escape close the panel.
- `slot="options"` exists on Shadow but Angular wrapper doesn't surface it (raw `<falcon-dropdown>` tag works).
- Wrapper `errorText` input name does NOT match Stencil `errorMessage` prop — internal mapping is needed in template (verify in `falcon-dropdown.component.html`).

## Accessibility

- `role="combobox"` on trigger button.
- `aria-haspopup="listbox"`, `aria-expanded`, `aria-controls`, `aria-invalid`, `aria-required`, `aria-describedby`, `aria-disabled` on trigger.
- `role="listbox"` on panel, `role="option"` on each option.
- Per-option `aria-selected`, `aria-disabled`.
- Error message has `role="alert"`.
- Required asterisk is `aria-hidden`.
- Full keyboard nav: ArrowUp/Down, Home, End, Enter, Tab (closes), Esc (closes + refocus trigger), printable chars (type-ahead).
