# falcon-calendar — API

## Selectors

- Angular: `falcon-angular-calendar`
- Stencil Shadow: `<falcon-calendar>`
- Stencil Light: `<falcon-calendar-tw>`

## Import

```ts
import { FalconAngularCalendarComponent } from '@falcon/ui-core';
```

## Inputs

| Name | Type | Default | Notes |
|---|---|---|---|
| `value` | `string \| null` | `null` | ISO date string `'YYYY-MM-DD'`. |
| `min` | `string?` | — | ISO date. |
| `max` | `string?` | — | ISO date. |
| `disabledDates` | `ReadonlyArray<string> \| ((d: Date) => boolean)` | — | Disabled-date predicate. Passed via JS prop (not attr) — wrapper handles via `syncProps()`. |
| `firstDayOfWeek` | `0..6` | `0` (Sun) | |
| `locale` | `string` | `'en-US'` | |
| `showWeekNumbers` | `boolean` | `false` | |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | |
| `disabled` | `boolean` | `false` | |
| `useTailwind` | `boolean` | `true` | |
| `rootClass` | `string` | `''` | |

## Outputs

| Name | Payload | Notes |
|---|---|---|
| `falconChange` | `FalconCalendarChangeDetail` | Full Stencil detail. |
| `falconBlur` | `FalconCalendarBlurDetail` | |
| `valueChange` | `string \| null` | Simplified for two-way binding. |

## CVA

**NO.** Calendar does NOT implement `ControlValueAccessor`. Bind via `[value]` + `(valueChange)` two-way OR `(falconChange)` for full detail. (`<falcon-angular-date-picker>` is the CVA-capable composition.)

## Methods

None proxied.

## Slots / template inputs

- None observed.

## Constraints

- Single-month grid only — no range, no multi-select.
- `disabledDates` must be set as a JS prop, NOT a string attribute. The wrapper's `syncProps()` handles this internally on `ngOnChanges` / `ngAfterViewInit`.
- Both render paths exist; the wrapper template renders BOTH `<falcon-calendar>` AND `<falcon-calendar-tw>` with refs (verify HTML — uses `@if useTailwind` switch).

## Accessibility

- Grid-based calendar (verify `role="grid"` + `aria-rowcount`).
- Per-cell `aria-selected`, `aria-disabled`.
- Keyboard nav: Arrow keys, Home, End, PageUp/Down (month), Shift+PageUp/Down (year).
- Verify focus management on month navigation.
