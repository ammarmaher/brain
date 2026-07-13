# falcon-date-picker — API

## Selectors

- Angular: `falcon-angular-date-picker`
- Stencil Shadow: `<falcon-date-picker>` (tag `'falcon-date-picker'`, `shadow: true`)
- Stencil Light: `<falcon-date-picker-tw>` (tag `'falcon-date-picker-tw'`, `shadow: false`)

## Import

```ts
import { FalconAngularDatePickerComponent } from '@falcon/ui-core';
// or: import { FalconAngularDatePickerComponent } from '@falcon';
```

Add to the host's `imports: []`. `CUSTOM_ELEMENTS_SCHEMA` is declared on the wrapper internally (`[CODE]` falcon-date-picker.component.ts:47) — the host does NOT need it.

## Inputs (all on `FalconAngularDatePickerComponent`)

`[CODE]` falcon-date-picker.component.ts:63-93 — **24 `@Input()`s** (the prior dossier's "19" is stale — it omitted the four `disabledIcon*` + `iconLeft`):

| Name | Type | Default | Notes |
|---|---|---|---|
| `value` | `string \| null` | `null` | ISO `'YYYY-MM-DD'`. Two-way via `(valueChange)`. Forwarded as `value` attr. |
| `label` | `string?` | `undefined` | Renders a `<label>` above the field with `htmlFor` wiring. |
| `placeholder` | `string` | `'YYYY-MM-DD'` | Input placeholder. |
| `helperText` | `string?` | `undefined` | Helper line below; hidden when `errorMessage` is set. |
| `errorMessage` | `string?` | `undefined` | Error line below (`role="alert"`); also implicitly sets the error visual + `aria-invalid`. |
| `min` | `string?` | `undefined` | ISO lower bound → forwarded to the embedded calendar. |
| `max` | `string?` | `undefined` | ISO upper bound → forwarded to the embedded calendar. |
| `disabledDates` | `ReadonlyArray<string> \| ((d: Date) => boolean)` | `undefined` | **JS PROPERTY** (wrapper `syncProps()` ts:109-116) → bound onto the embedded calendar via `bindCalendarProps` ref inside the Stencil component. String attr no-ops. |
| `firstDayOfWeek` | `0..6` (`FalconCalendarFirstDayOfWeek`) | `0` | Set `6` for Arabic. |
| `locale` | `string` | `'en-US'` | Popup grid labels only (not calendar system/display format). |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Reflected; scales the INPUT height (sm 30 / md 38 / lg 44 px). |
| `state` | `'default' \| 'error' \| 'success' \| 'warning'` | `'default'` | Reflected; error wins. |
| `disabled` | `boolean` | `false` | Reflected; blocks opening + greys the field. |
| `readonly` | `boolean` | `false` | Reflected; blocks opening but keeps the value visible. |
| `required` | `boolean` | `false` | Reflected; renders `*` + `aria-required`. |
| `name` | `string?` | `undefined` | Native input name. |
| `inputId` | `string?` | `undefined` | Custom id → also becomes the Stencil `resolvedId` (`[CODE]` falcon-date-picker.tsx:79). |
| `disabledIconEnabled` | `boolean` | `true` | Forwarded to the embedded calendar's disabled-slash overlay. |
| `disabledIconColor` | `string \| null` | `null` | Forwarded slash tint. |
| `disabledIconWidth` | `string \| null` | `null` | Forwarded slash width. |
| `disabledIconHeight` | `string \| null` | `null` | Forwarded slash height. |
| `useTailwind` | `boolean` | `true` | **Render-path switch.** `true` → `-tw` portal variant (default, RC#4-fixed). `false` → Shadow variant (CSS-anchored popup, still has the first-click bug). |
| `rootClass` | `string` | `''` | Extra classes on the Stencil element (`[class]`). |
| `iconLeft` | `boolean` | `false` | `[CODE]` ts:93 — 2026-05-17 unified icon-slot API. When true, projects `[slot=icon-left]` content + prepends start-padding. `iconRight` is intentionally skipped (the trailing calendar glyph occupies that edge). |

## Outputs (on `FalconAngularDatePickerComponent`)

`[CODE]` falcon-date-picker.component.ts:95-99 — **5 `@Output`s**:

| Name | Payload | Notes |
|---|---|---|
| `(falconChange)` | `FalconCalendarChangeDetail` (`{ value, date }`) | Day selected or typed-input committed. Re-emitted via `handleChange()` (ts:118-125). |
| `(falconBlur)` | `FalconCalendarBlurDetail` (`{ value }`) | Input blur (`[CODE]` falcon-date-picker.tsx:137-139 emits it — unlike the calendar, this one DOES fire). |
| `(falconOpen)` | `FalconCalendarOpenDetail` (`{ source: 'input' \| 'icon' \| 'programmatic' }`) | Popover opened. `handleOpen()` ALSO schedules the Top-Layer acquire (ts:130-140). |
| `(falconClose)` | `FalconCalendarCloseDetail` (`{ reason: 'select' \| 'blur' \| 'escape' \| 'outside-click' \| 'programmatic' }`) | Popover closed. `handleClose()` releases the Top-Layer promotion first (ts:141-147). |
| `(valueChange)` | `string \| null` | Simplified for `[(value)]`. Emitted in `handleChange()` (ts:122). |

## TypeScript types

Shared `falcon-calendar.types.ts` — `FalconCalendarChangeDetail`, `FalconCalendarBlurDetail`, `FalconCalendarOpenDetail`, `FalconCalendarCloseDetail`, `FalconCalendarSize`, `FalconCalendarFirstDayOfWeek` (see calendar API.md). The `state` union (`'default'|'error'|'success'|'warning'`) is inline on the component, not a named export.

## Reflected props (Stencil only)

`[CODE]` falcon-date-picker.tsx:48-52 — `size`, `state`, `disabled`, `readonly`, `required` are `@Prop({ reflect: true })` so `:host([state='error'])`, `:host([size='sm'])`, `:host([readonly])` CSS rules can target them. `value`/`min`/`max`/`label`/`name`/`disabledIcon*`/`iconLeft` do NOT reflect.

## Mutable props (Stencil)

`value` is `@Prop({ mutable: true, reflect: false })` (`[CODE]` falcon-date-picker.tsx:38) — the component mutates it on calendar-select / typed-input, then emits.

## CVA / ngModel / Reactive Forms

**NO.** `[CODE]` falcon-date-picker.component.ts — the wrapper does NOT implement `ControlValueAccessor`. `[(ngModel)]` / `formControl` / `formControlName` do **not** work (GAP G1 — the biggest gap). Bind `[value]` + `(valueChange)` two-way, or `(falconChange)` for the full detail. For Reactive Forms today: wrap in a custom CVA directive, OR `@ViewChild` the picker and bridge `(valueChange)` ↔ `FormControl` (see USAGE).

## Methods

`[CODE]` The Angular wrapper proxies **none**. The Stencil tags DO expose `@Method()` `open()` and `close()`:

| Method | Description | Available on |
|---|---|---|
| `open()` | Opens the popover (`source='programmatic'`; no-op if `disabled`). | BOTH tags `[CODE]` falcon-date-picker.tsx:87-91 / falcon-date-picker-tw.tsx:111-115 |
| `close()` | Closes the popover (`reason='programmatic'`). | BOTH tags `[CODE]` falcon-date-picker.tsx:93-96 / falcon-date-picker-tw.tsx:117-120 |

> No wrapper-side `openPicker()` / `closePicker()` / `clearDate()` / `setFocus()` proxy (GAP G6). To call `open()`/`close()`, obtain the native element ref.

## Slots / template inputs

- `[CODE]` `slot="icon-left"` — projected when `[iconLeft]="true"`. The wrapper template forwards it via `<ng-content select="[slot=icon-left]">` (`[CODE]` html:31,62); both Stencil tags render the `icon-left` slot + prepend `--falcon-input-icon-input-padding-start` (`[CODE]` falcon-date-picker.tsx:200-204 / falcon-date-picker-tw.tsx:332-340). No `icon-right` (the trailing calendar glyph owns that edge).
- The trailing calendar glyph is a built-in SVG (not a slot).
- No `ng-template` inputs on the wrapper.

## Supported sizes / states

- Sizes: `sm` (input min-h 30px) / `md` (38px) / `lg` (44px) — `[CODE]` calendar.tokens.css:219-228. (Sizes affect the INPUT, not the popup grid cell.)
- States: `default` / `error` / `success` / `warning` (error visual also implied by `errorMessage`).
- No `variant`/`appearance` axis.

## Constraints

- `[CODE]` Single-date only — no range, no time, no display-format (GAP G2/G3/G4); the field always renders ISO `YYYY-MM-DD` (`displayValue`, falcon-date-picker.tsx:114-117).
- `[CODE]` `disabledDates` must be a stable JS property (wrapper `syncProps()` + Stencil `bindCalendarProps` ref) — string attr no-ops; fresh-per-render predicate churns.
- `[CODE]` Typed input is parsed leniently — un-parseable text is silently dropped, empty commits `null` (`parseInputValue`, falcon-date-picker.tsx:168-179). A strict-format flow must validate the emitted value.
- `[CODE]` `readonly` AND `disabled` both block opening (falcon-date-picker.tsx:120,126); selecting a day commits AND closes immediately (no preview/confirm, falcon-date-picker.tsx:150-154).
- `[CODE]` The Shadow variant (`useTailwind=false`) carries the RC#4 first-click bug — use the default `-tw`.

## Accessibility

`[CODE]` Verified IMPLEMENTED on both render paths (prior "verify" hedges resolved):
- The trigger `<input>` has `aria-haspopup="dialog"`, `aria-expanded` (tracks `isOpen`), `aria-controls={popoverId}` (`[CODE]` falcon-date-picker.tsx:216-218). NOTE: it is a text `<input>`, NOT `role="combobox"` (the prior API "role=combobox" claim is corrected — there is no `role` attribute; it relies on `aria-haspopup` + `aria-expanded`).
- `aria-invalid` when `hasError` (`[CODE]` :219); `aria-labelledby` → label id when `label` set (:220); `aria-describedby` → error id (else helper id) (:221).
- The popover `<div>` is `role="dialog"` (`[CODE]` falcon-date-picker.tsx:248 / falcon-date-picker-tw.tsx:388).
- Label renders `*` (`aria-hidden`) when `required`; the input gets the native `required` attr.
- Error paragraph has `role="alert"` (`[CODE]` :241-242).
- The embedded calendar provides `role="grid"` + full keyboard grid nav (see calendar API.md).
- **Gaps (`[BRAIN-OUT]` `_LEARNINGS_POPOVER_PORTAL_PATTERN.md` :77, :262):** there is NO focus-trap inside the popover and NO keyboard-open (the RC#4 fix removed focus-open without adding an Enter/Space/ArrowDown handler — so a keyboard-only user who Tabs to the field cannot open the calendar). See `GAPS_AND_UPGRADES.md` accessibility section.

## Verification
🟢 CODE-VERIFIED 2026-06-03 against falcon-date-picker.component.ts (202 ln), .html (65 ln), falcon-date-picker.tsx (270 ln), falcon-date-picker-tw.tsx (411 ln), .css. Corrected vs prior dossier: 24 inputs (not 19) — added `disabledIcon*` + `iconLeft`; `open()`/`close()` `@Method`s confirmed on BOTH tags (prior "None proxied" wrong); the trigger is `aria-haspopup="dialog"` (NOT `role=combobox`); `role="dialog"` confirmed on the popover. Flagged the no-focus-trap + no-keyboard-open a11y gap.
