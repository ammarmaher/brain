# falcon-calendar — API

## Selectors

- Angular: `falcon-angular-calendar`
- Stencil Shadow: `<falcon-calendar>` (tag `'falcon-calendar'`, `shadow: true`)
- Stencil Light: `<falcon-calendar-tw>` (tag `'falcon-calendar-tw'`, `shadow: false`)

## Import

```ts
import { FalconAngularCalendarComponent } from '@falcon/ui-core';
// or via the falcon barrel:
import { FalconAngularCalendarComponent } from '@falcon';
```

Add `FalconAngularCalendarComponent` to the consuming standalone component's `imports: []`. `CUSTOM_ELEMENTS_SCHEMA` is already declared on the wrapper internally (`[CODE]` falcon-calendar.component.ts:56) — the host does NOT need it.

## Inputs (all on `FalconAngularCalendarComponent`)

`[CODE]` falcon-calendar.component.ts:64-82 — **15 `@Input()`s** (the prior dossier's "11" is stale; the four `disabledIcon*` inputs were added in the 2026-05-15 disabled-slash wave):

| Name | Type | Default | Notes |
|---|---|---|---|
| `value` | `string \| null` | `null` | ISO date string `'YYYY-MM-DD'`. Forwarded as the `value` attr (`[CODE]` html:5). Two-way via `(valueChange)`. |
| `min` | `string?` | `undefined` | ISO date lower bound. Cells below it render disabled. |
| `max` | `string?` | `undefined` | ISO date upper bound. Cells above it render disabled. |
| `disabledDates` | `ReadonlyArray<string> \| ((d: Date) => boolean)` | `undefined` | Disabled-date predicate or ISO array. **Pushed as a JS PROPERTY, not an attribute** — the wrapper's `syncProps()` assigns `el.disabledDates` on `ngAfterViewInit` + every `ngOnChanges` (`[CODE]` falcon-calendar.component.ts:96-103). A string attribute silently no-ops. |
| `firstDayOfWeek` | `0 \| 1 \| 2 \| 3 \| 4 \| 5 \| 6` (`FalconCalendarFirstDayOfWeek`) | `0` (Sun) | Set `6` for Saturday-start (Arabic) locales. |
| `locale` | `string` | `'en-US'` | Drives month/weekday **labels** via `Intl.DateTimeFormat` (`[CODE]` falcon-calendar.utils.ts:84-101). NOT the calendar *system* — Gregorian arithmetic is fixed (GAP G4). |
| `showWeekNumbers` | `boolean` | `false` | Renders an ISO week-number column down the left edge. Reflected on the Stencil tag. |
| `size` | `'sm' \| 'md' \| 'lg'` (`FalconCalendarSize`) | `'md'` | Reflected attr; scales cell metrics via tokens. |
| `disabled` | `boolean` | `false` | Freezes the WHOLE grid (`:host([disabled])` opacity + `pointer-events:none`, `[CODE]` falcon-calendar.css:12-16). Distinct from `disabledDates`. |
| `disabledIconEnabled` | `boolean` | `true` | Wave 2026-05-15. When true, every disabled cell renders an absolute lucide-slash SVG overlay. Forwarded as `disabled-icon-enabled` attr (`[CODE]` html:13). |
| `disabledIconColor` | `string \| null` | `null` | Per-call tint for the slash SVG → sets `--falcon-calendar-disabled-icon-color` inline on the cell (`[CODE]` falcon-calendar.tsx:217-223). `null` → token cascade wins. |
| `disabledIconWidth` | `string \| null` | `null` | Per-call width override → `--falcon-calendar-disabled-icon-width`. |
| `disabledIconHeight` | `string \| null` | `null` | Per-call height override → `--falcon-calendar-disabled-icon-height`. |
| `useTailwind` | `boolean` | `true` | **Render-path switch.** `true` → `<falcon-calendar-tw>` (Light DOM). `false` → `<falcon-calendar>` (Shadow DOM). |
| `rootClass` | `string` | `''` | Caller-supplied extra classes on the Stencil element (`[class]="rootClass || null"`, `[CODE]` html:17). |

> `[CODE]` There is **no `prevMonthAriaLabel` / `nextMonthAriaLabel`** input on the wrapper. The Stencil tags expose them (default `'Previous month'` / `'Next month'`, `[CODE]` falcon-calendar.tsx:51-52 / falcon-calendar-tw.tsx:59-60) but the Angular wrapper does NOT forward them — GAP G-A11Y-1.

### Stencil-only props (NOT exposed on the Angular wrapper)

| Prop | Type | Default | Available on |
|---|---|---|---|
| `prevMonthAriaLabel` | `string` | `'Previous month'` | BOTH tags `[CODE]` falcon-calendar.tsx:51 / falcon-calendar-tw.tsx:59 |
| `nextMonthAriaLabel` | `string` | `'Next month'` | BOTH tags `[CODE]` falcon-calendar.tsx:52 / falcon-calendar-tw.tsx:60 |

> `[CODE]` Mutable prop `value: string | null` (`@Prop({ mutable: true, reflect: false })`, `@Watch`ed) exists on both Stencil tags (`[CODE]` falcon-calendar.tsx:45 / falcon-calendar-tw.tsx:53). The Angular wrapper drives it via the `value` attr + `handleChange()` — do not bind it on the raw tag directly.

## Outputs (on `FalconAngularCalendarComponent`)

`[CODE]` falcon-calendar.component.ts:84-86 — **3 `@Output`s**:

| Name | Payload | Notes |
|---|---|---|
| `(falconChange)` | `FalconCalendarChangeDetail` (`{ value: string \| null; date: Date \| null }`) | Full Stencil detail. Re-emitted from the `falcon-change` CustomEvent via `handleChange()` (`[CODE]` ts:105-112). |
| `(falconBlur)` | `FalconCalendarBlurDetail` (`{ value: string \| null }`) | Re-emitted from `falcon-blur` via `handleBlur()` (`[CODE]` ts:113-116). NOTE: neither Stencil tag actually emits `falcon-blur` from any handler in the inspected source — the `@Event` is declared (`[CODE]` falcon-calendar.tsx:71-72) but never `.emit()`-ed, so `(falconBlur)` is effectively dead today (GAP). |
| `(valueChange)` | `string \| null` | Simplified for `[(value)]` two-way. Emitted inside `handleChange()` alongside `falconChange` (`[CODE]` ts:109). |

> `[CODE]` The Stencil tags emit only `falcon-change` (on day-click / keyboard select, `[CODE]` falcon-calendar.tsx:106). There is no `falcon-open`/`falcon-close` (those belong to date-picker).

## TypeScript types

`libs/falcon-ui-core/src/components/falcon-calendar/falcon-calendar.types.ts` (SHARED with date-picker):

```ts
type FalconCalendarSize = 'sm' | 'md' | 'lg';
type FalconCalendarViewMode = 'day' | 'month' | 'year';   // declared but UNUSED — no view-mode switch yet (GAP G3)
type FalconCalendarFirstDayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;
interface FalconCalendarChangeDetail { readonly value: string | null; readonly date: Date | null; }
interface FalconCalendarBlurDetail  { readonly value: string | null; }
interface FalconCalendarOpenDetail  { readonly source: 'input' | 'icon' | 'programmatic'; }      // date-picker only
interface FalconCalendarCloseDetail { readonly reason: 'select' | 'blur' | 'escape' | 'outside-click' | 'programmatic'; } // date-picker only
interface FalconCalendarDayCell { date; day; month; year; iso; isToday; isOutsideMonth; isSelected; isDisabled; weekNumber; } // grid cell
```

## Reflected props (Stencil only)

`[CODE]` falcon-calendar.tsx:53-55 — `showWeekNumbers`, `size`, `disabled` are `@Prop({ reflect: true })` so `:host([disabled])`, `[size='lg']`, `[data-show-week='true']` CSS rules can target them. `value`, `min`, `max`, `firstDayOfWeek`, `locale`, `disabledIcon*` do NOT reflect.

## Mutable props (Stencil)

`value` is `@Prop({ mutable: true, reflect: false })` and `@Watch('value')` re-syncs the visible `viewDate` whenever the bound value changes (`[CODE]` falcon-calendar.tsx:80-84) — a programmatic value change also moves the visible month.

## CVA / ngModel / Reactive Forms

**NO.** `[CODE]` falcon-calendar.component.ts — the wrapper does NOT implement `ControlValueAccessor` and registers no `NG_VALUE_ACCESSOR`. `[(ngModel)]` / `formControl` / `formControlName` do **not** work (GAP G1). Bind `[value]` + `(valueChange)` two-way, OR `(falconChange)` for the full detail. For Reactive Forms, use `<falcon-angular-date-picker>` (which also lacks CVA but is the form-field path) or bridge `(valueChange)` → `FormControl.setValue()` externally.

## Methods

`[CODE]` The Angular wrapper proxies **none**. The Stencil tags DO expose two `@Method`s (call via the native element ref):

| Method | Description | Available on |
|---|---|---|
| `setValue(v: string \| null)` | Sets the value programmatically (mutates the `value` prop). | BOTH tags `[CODE]` falcon-calendar.tsx:86-89 / falcon-calendar-tw.tsx:97-100 |
| `navigate('prev-month' \| 'next-month' \| 'prev-year' \| 'next-year')` | Shifts the visible `viewDate`. | BOTH tags `[CODE]` falcon-calendar.tsx:91-97 / falcon-calendar-tw.tsx:102-108 |

> The wrapper exposes no `#shadowRef`/`#twRef`-backed `setValue()`/`navigate()` proxy (GAP G5). To call them, `@ViewChild` the wrapper, then query its child Stencil element (tagged `#shadowRef` / `#twRef` internally — but those refs are private to the wrapper).

## Slots / template inputs

`[CODE]` Neither render path declares any `<slot>` and the wrapper has no `ng-content` / `ng-template` inputs. Custom cell content is not possible (GAP). All cell visuals are token-driven + the built-in slash overlay.

## Supported sizes / states / variants

- Sizes: `sm` / `md` / `lg` (reflected; scale cell metrics via tokens).
- Cell states (computed per cell by `buildMonthGrid`, `[CODE]` falcon-calendar.utils.ts:49-80): idle, hover, **today** (`aria-current="date"` + inset ring), **selected** (`aria-selected` + filled bg), **disabled** (`aria-disabled` + slash overlay), **outside-month** (dimmed).
- No `variant` / `appearance` axis (unlike `<falcon-input>`).
- No range / multi-select / month-view / year-view (GAP G2/G3).

## Constraints

- `[CODE]` Single-month, single-date only (falcon-calendar.tsx:1-5).
- `[CODE]` `disabledDates` MUST be a JS property (array/function), never a string attribute — the wrapper's `syncProps()` only assigns the property (ts:96-103); keep the reference stable (GAP G7).
- `[CODE]` The wrapper renders only ONE render path at a time via `@if (useTailwind)` (html:2/21) — it does NOT render both tags simultaneously. The refs `#shadowRef` / `#twRef` therefore only resolve for the active branch.
- `[CODE]` `disabled` (whole-grid) and per-cell `isDisabled` are OR-ed at click time (falcon-calendar.tsx:103) — you cannot "enable one date" inside a fully-disabled calendar.

## Accessibility

`[CODE]` Verified IMPLEMENTED on both render paths (the prior "verify role=grid / keyboard" hedges are resolved):
- Container is `role="group"` with `aria-label` = the month-year title (`[CODE]` falcon-calendar.tsx:160-162).
- The grid wrapper is `role="grid"` (`[CODE]` falcon-calendar.tsx:196-198); each day cell is a `<button role="gridcell">` (`[CODE]` falcon-calendar.tsx:210-236).
- Per-cell ARIA: `aria-selected`, `aria-disabled`, and `aria-current="date"` on today (`[CODE]` falcon-calendar.tsx:230-232).
- Roving tab-index: `tabIndex={cell.isSelected || (!selected && cell.isToday) ? 0 : -1}` — only the selected (or today if none selected) cell is tabbable (`[CODE]` falcon-calendar.tsx:233).
- The weekday-label row is `aria-hidden="true"` (`[CODE]` falcon-calendar.tsx:191); the week-number cells are `aria-hidden="true"` (`[CODE]` falcon-calendar.tsx:206); the slash overlay is `aria-hidden="true"` (`[CODE]` falcon-calendar.tsx:244).
- **Full keyboard grid nav** (`[CODE]` falcon-calendar.tsx:109-145 — IMPLEMENTED): Arrow keys (±1 day / ±7 days), Home/End (week start/end), PageUp/Down (±1 month), Shift+PageUp/Down (±1 year), Enter/Space to select. After a key move the next month re-renders and focus is moved to the new cell via `requestAnimationFrame` (Shadow queries `this.host.shadowRoot`, `-tw` queries `this.host`).
- Nav buttons carry `aria-label` from `prevMonthAriaLabel` / `nextMonthAriaLabel` (`[CODE]` falcon-calendar.tsx:170/182).
- **Gaps:** the day-cell `<button>`s lack a per-cell readable `aria-label` (the visible number is the only accessible name — a screen reader hears "7", not "7 May 2026"); `aria-live` is not announced on month change; `prevMonthAriaLabel`/`nextMonthAriaLabel` are not surfaced on the wrapper. See `GAPS_AND_UPGRADES.md` A1-A3.

## Verification
🟢 CODE-VERIFIED 2026-06-03 against falcon-calendar.component.ts (118 ln), .html (41 ln), falcon-calendar.tsx (267 ln), falcon-calendar-tw.tsx (283 ln), .types.ts, .utils.ts (149 ln). Drift corrected vs prior dossier: 15 inputs (not 11) — added `disabledIcon*`; outputs confirmed 3 (`falconChange`/`falconBlur`/`valueChange`) with `falconBlur` flagged as never-emitted; `setValue`/`navigate` `@Method`s confirmed on BOTH tags; keyboard grid nav + `role=grid` confirmed IMPLEMENTED (prior "verify" hedges resolved).
