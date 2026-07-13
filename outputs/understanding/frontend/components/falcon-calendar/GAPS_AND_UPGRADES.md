# falcon-calendar — GAPS AND UPGRADES

## Missing capabilities (active source verified 2026-06-03)

### G1 — No CVA on the wrapper (P1)

`[CODE]` falcon-calendar.component.ts — `FalconAngularCalendarComponent` does not implement `ControlValueAccessor` / register `NG_VALUE_ACCESSOR`. Inline-calendar Reactive-Forms binding requires external `(valueChange)` wiring. `<falcon-angular-date-picker>` is NOT a CVA either, so there is no CVA-capable date component at all today.

**Recommended fix (P1):** add CVA on the calendar wrapper directly (additive — keep `(valueChange)`), OR document explicitly that the calendar is presentational. Same recommendation applies to date-picker.

### G2 — No range / multi-select (P1)

`[CODE]` falcon-calendar.tsx:1-5 + `value: string | null` (tsx:45) — single-month, single-date only. Range selection (filter pickers, booking flows, "from–to" periods) is a common ask.

**Recommended fix:** add `mode: 'single' | 'range' | 'multi'` + corresponding state + a `rangeChange` event. Large change — schedule as a milestone; the value shape changes, so it must be opt-in.

### G3 — No view-mode switching (P2)

Always month-view. `[CODE]` `FalconCalendarViewMode = 'day' | 'month' | 'year'` is DECLARED in falcon-calendar.types.ts:4 but **completely unused** — there is no year-view / decade-view jump, no UI to switch.

**Recommended fix:** wire the existing `FalconCalendarViewMode` type into a `viewMode` prop + month/year grid renders + header click-to-zoom.

### G4 — Hijri / Umm-al-Qura calendar not built-in (P2)

`[CODE]` falcon-calendar.utils.ts:84-101 — `locale` drives `Intl.DateTimeFormat` *labels* only; the arithmetic (`buildMonthGrid`, `shiftMonth`) is fixed-Gregorian. For Arabic/Hijri business contexts there is no built-in alternative; dates must be converted by the host flow.

**Recommended fix:** add `calendar?: 'gregorian' | 'islamic-umalqura' | 'hebrew'` + `Intl.DateTimeFormat` calendar-aware formatting/arithmetic.

### G5 — No Angular-wrapper method proxies (P2)

`[CODE]` The Stencil tags expose `@Method()` `setValue(v)` + `navigate(dir)` (falcon-calendar.tsx:86-97) but the wrapper proxies neither. Consumers must reach the native element ref. There is no `focus()` / `goToToday()` proxy at all.

**Recommended fix:** add wrapper `setValue()`, `navigate()`, `goToToday()`, `focus()` proxies backed by the existing `#shadowRef`/`#twRef`.

### G6 — `size` does not scale the cell height (P2)

`[CODE]` calendar.tokens.css — `--falcon-calendar-day-height` is a single `30px`; there are no `-day-height-sm/-lg` tokens, and the Stencil reflects `size` but no CSS rule keys off `:host([size='sm']) .falcon-calendar-day`. So the `size` input is **largely inert on the calendar grid** (it only affects the date-picker *input* height). Documented as a constraint, not a crash.

**Recommended fix:** add `--falcon-calendar-day-height-{sm,lg}` + `:host([size]) .falcon-calendar-day` rules, OR drop `size` from the calendar wrapper if it is intentionally input-only.

### G7 — `disabledDates` re-application timing (P3)

`[CODE]` falcon-calendar.component.ts:94 — `syncProps()` runs on EVERY `ngOnChanges`; if the predicate reference changes per change-detection pass, the Stencil prop churns (re-render storm). The wrapper is `OnPush`, which helps, but the consumer must keep the predicate identity stable.

**Recommended fix:** memoize the assignment (only re-assign when the reference actually changed); document the stable-reference rule in USAGE (done).

### G8 — No "Today" / quick-jump button (P3)

No optional "Today" affordance or min/max year jump in the header.

**Recommended fix:** add `showToday` + a token-driven Today chip.

## Missing accessibility (verified 2026-06-03 — prior "verify" hedges resolved)

- **A1 (P2):** day-cell `<button>`s have NO readable `aria-label` — the visible day number is the only accessible name (`[CODE]` falcon-calendar.tsx:210-237). A screen reader hears "7", not "7 May 2026". Add `aria-label={fullDateLabel}` per cell.
- **A2 (P2):** no `aria-live` region announces the month/year on navigation — a screen-reader user moving months gets no spoken confirmation.
- **A3 (P3):** `prevMonthAriaLabel` / `nextMonthAriaLabel` exist on the Stencil tags but are NOT surfaced on the Angular wrapper (`[CODE]` ts:64-82) — i18n of the nav labels is impossible from Angular. Add the two `@Input`s.
- **CONFIRMED OK:** `role="grid"` + `role="gridcell"` + `aria-selected`/`aria-disabled`/`aria-current` + roving tab-index + full keyboard grid nav are all IMPLEMENTED (`[CODE]` falcon-calendar.tsx:196-236, 109-145). The prior "verify keyboard nav / verify role=grid / verify focus management" placeholders are resolved — they work.

## Missing tests

- `[CODE]` grep 2026-06-03 → **0 spec/e2e files** for `<falcon-calendar>`, `<falcon-calendar-tw>`, OR the Angular wrapper. The pure date helpers in `falcon-calendar.utils.ts` (`buildMonthGrid`, `isoWeek`, `makeIsDisabled`, `weekdayLabels`) are non-trivial and entirely untested. GAPs: (a) a `falcon-calendar.utils.spec.ts` unit-testing grid generation + ISO week + disabled predicate + locale labels; (b) a Stencil spec for render/keyboard/disabled-click; (c) a wrapper spec for `syncProps()` + `(valueChange)` + `(falconChange)`.

## Missing Tailwind / token parity

- `[CODE]` Shadow CSS + the `-tw` Tailwind helper read the SAME `--falcon-calendar-*` tokens; render structure is mirrored 1:1 (header / weekday row / grid / day cell / slash overlay). **Parity OK at the token level.** Not visually diffed in this static pass.
- `[CODE]` Both paths share the disabled-slash overlay (Shadow CSS `.falcon-calendar-day-disabled-slash` :173-186 ↔ `-tw` `falconCalendarDisabledIconOverlayClasses()` :180-186). Parity OK.

## Cross-framework parity

- `[CODE]` grep — **no React (`libs/falcon-ui-react`) or Vue (`libs/falcon-ui-vue`) wrapper** for the calendar. Stencil-core + Angular-wrapper only, despite the brand SoT being React. Add a `falcon-ui-react` wrapper when cross-framework parity is needed.

## Performance risks

- The disabled predicate is called per cell (42 cells) per render via `makeIsDisabled` (`[CODE]` falcon-calendar.utils.ts:125-143). Trivial. `OnPush` wrapper + `requestAnimationFrame` focus move — no real risk.

## Visual / interaction risks

- Locale-sensitive month/weekday names via `Intl` — not visually verified for Arabic in this pass.
- `size` is largely inert on the grid (G6) — a consumer setting `size="lg"` on a standalone calendar will see no cell-size change, which may surprise.

## Recommended upgrade priority

| ID | Title | Priority |
|---|---|---|
| G1 | CVA on wrapper | P1 |
| G2 | Range / multi-select | P1 |
| G3 | View-mode switch (type already exists) | P2 |
| G4 | Hijri calendar | P2 |
| G5 | Wrapper method proxies | P2 |
| G6 | `size` → cell-height tokens | P2 |
| A1 | Per-cell `aria-label` | P2 |
| A2 | `aria-live` month announce | P2 |

## Concrete upgrade API

```ts
// Angular wrapper additions
@Input() mode: 'single' | 'range' | 'multi' = 'single';
@Input() viewMode: 'day' | 'month' | 'year' = 'day';      // wire the existing type
@Input() calendar: 'gregorian' | 'islamic-umalqura' = 'gregorian';
@Input() showToday = false;
@Input() prevMonthAriaLabel = 'Previous month';           // forward to Stencil (A3)
@Input() nextMonthAriaLabel = 'Next month';
@Output() rangeChange = new EventEmitter<{ start: string; end: string }>();
async setValue(v: string | null): Promise<void>;          // proxy
async navigate(dir: 'prev-month'|'next-month'|'prev-year'|'next-year'): Promise<void>;
async goToToday(): Promise<void>;
```

For CVA, implement `ControlValueAccessor` directly on the wrapper.

## Shared vs per-page

All gaps belong in the **shared Falcon component** — the calendar is the date-picker's embedded grid, so per-page hacks would fork the date story. Fix once in `libs/falcon-ui-core`.

## Workarounds today

- For G1: bridge `(valueChange)` → `FormControl.setValue()`, or use `<falcon-angular-date-picker>`.
- For G2: compose two date-pickers + cross-validate `start <= end` externally.
- For G4: convert dates via `Intl.DateTimeFormat` with a Hijri calendar externally, pass ISO strings.
- For G5: `@ViewChild` the wrapper and call `setValue`/`navigate` on its child element ref.

## Wave 7 Findings (2026-05-17)

**Consumer count: 2** ([CODE] grep `<falcon-angular-calendar>` — applications-table + playground). No new structural gaps.

## Deep-Dive Sweep Findings (2026-06-03 — B07)

**Consumer count: 0 direct** ([CODE] grep `<falcon-angular-calendar`). The 2 prior consumers are GONE (applications-table → date-picker; playground removed). The component is live only via the `<falcon-angular-date-picker>` composition + the showcase gallery.

Drift corrected vs prior dossier (component stays ACTIVE; no deletion flag — it IS the date-picker's grid):
- **Inputs 11 → 15** (added `disabledIcon*`); outputs confirmed 3 with `(falconBlur)` flagged as **never-emitted** (declared but no `.emit()` call).
- **`setValue`/`navigate` `@Method`s confirmed on BOTH tags** (G5 = wrapper-proxy gap, not capability gap).
- **Keyboard grid nav + `role=grid` confirmed IMPLEMENTED** — the prior 3 "verify" a11y hedges resolved to PASS.
- **New a11y gaps surfaced:** per-cell `aria-label` missing (A1), no `aria-live` month announce (A2), nav-label inputs not forwarded (A3).
- **`size` largely inert on the grid** (G6) — no `-day-height-{sm,lg}` tokens.
- **Wrong token names corrected** in TOKENS.md (`-container-bg` → `-bg`, etc.); `--color-falcon-primary-700` slash-icon alias inconsistency noted.
- **Legacy façade DELETED** — OVERVIEW/RECOGNITION cross-links corrected.
- All findings are `safe-local` (doc) EXCEPT the `(falconBlur)` dead-event (HIGH-RISK-QUEUE: it's a public-API surface that silently never fires). See FINDINGS/B07.md.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B07) against all source layers (wrapper / Shadow / `-tw` / utils / tokens). G1/G2 confirmed; G3 type-exists-unused confirmed; G5 method-proxy gap confirmed; G6 size-inert confirmed; a11y placeholders resolved to PASS + 3 new a11y gaps; `(falconBlur)` dead-event found. No deletion flag — component stays ACTIVE as the date-picker grid.
