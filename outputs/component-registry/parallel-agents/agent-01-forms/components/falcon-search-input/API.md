# falcon-search-input — API

## Selectors

- Angular: `falcon-angular-search-input`
- Stencil Shadow: `<falcon-search-input>`
- Stencil Light: `<falcon-search-input-tw>`

## Import

```ts
import { FalconAngularSearchInputComponent } from '@falcon/ui-core';
```

## Inputs

| Name | Type | Default | Notes |
|---|---|---|---|
| `value` (setter) | `string` | `''` | Two-way friendly via signal. |
| `placeholder` | `string` | `'Search…'` | |
| `debounceMs` | `number` | `300` | Debounce delay for `falconSearch` event. |
| `loading` | `boolean` | `false` | Consumer-controlled spinner. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | |
| `disabled` | `boolean` | `false` | |
| `useTailwind` | `boolean` | `true` | |

## Outputs

| Name | Payload | Notes |
|---|---|---|
| `falconSearch` | `{ value: string }` | Debounced. |
| `falconSearchClear` | `{ previousValue: string }` | Fired on clear-X. |

## TypeScript types

```ts
type FalconSearchInputSize = 'sm' | 'md' | 'lg';
interface FalconSearchEventDetail { value: string; }
interface FalconSearchClearDetail { previousValue: string; }
```

## CVA

**NO** — wrapper does not implement CVA. Bind via `[value]` + `(falconSearch)` event for application-level search.

## Methods

None proxied.

## Slots / template inputs

- None.

## Constraints

- Debounce is built-in — do NOT debounce externally.
- Loading spinner is consumer-controlled (component shows it but doesn't run the search).
- No label / helper / error inputs — this is intentionally search-only.

## Accessibility

- Native `<input type="search">` underneath (verify Stencil).
- Search icon `aria-hidden="true"`.
- Clear button `aria-label="Clear search"` (verify Stencil).
- `aria-busy` when `loading` (verify).
