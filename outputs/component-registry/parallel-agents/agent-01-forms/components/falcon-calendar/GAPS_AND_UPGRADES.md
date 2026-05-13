# falcon-calendar — GAPS AND UPGRADES

## Missing capabilities

### G1 — No CVA support (P1)

Wrapper does not implement `ControlValueAccessor`. Inline calendar inside Reactive Forms must use external `(valueChange)` wiring. `<falcon-angular-date-picker>` is the CVA composition.

**Recommended fix:** add CVA to the calendar wrapper directly, OR document explicitly that calendar is presentational only.

### G2 — No range selection (P1)

Single-month, single-date only. Range selection is a common ask (filter pickers, booking flows).

**Recommended fix:** add `mode: 'single' | 'range' | 'multi'` input + corresponding state. Big change — schedule as a milestone.

### G3 — No view-mode switching (P2)

Always month-view. No year-view / decade-view jump.

**Recommended fix:** add `viewMode: 'date' | 'month' | 'year' | 'decade'` + transitions.

### G4 — Hijri / Saudi calendar not built-in (P2)

`locale` controls labels but not calendar system. For Arabic / Hijri-only contexts, no built-in alternative.

**Recommended fix:** add `calendar?: 'gregorian' | 'islamic-umalqura' | 'hebrew'` etc. + `Intl.DateTimeFormat` calendar formatting.

### G5 — No method proxies (P2)

No `focus()` / `nextMonth()` / `prevMonth()` / `goToToday()`.

### G6 — No today button (P3)

Common widget — should be optional.

### G7 — `disabledDates` re-application timing (P3)

`syncProps()` runs on `ngOnChanges`; if the predicate function reference changes per render, this could over-fire. Recommend `OnPush` + stable predicate identity.

### G8 — No min/max year input — controlled via `min` / `max` only (P3)

For year-jump, allowing `minYear` / `maxYear` would simplify configuration.

## Missing accessibility

- Verify keyboard nav across month/year boundaries.
- Verify `aria-label` on month/year header.
- Verify focus management on month change.

## Missing tests

- No Angular wrapper spec.

## Missing Tailwind / token parity

- Verify Shadow + Light render identical grids.

## Performance risks

- Predicate function called per cell per render — N=42 cells. Trivial.

## Visual / interaction risks

- Locale-sensitive month names; verify Arabic rendering.

## Recommended upgrade priority

| ID | Title | Priority |
|---|---|---|
| G1 | CVA on wrapper | P1 |
| G2 | Range selection | P1 |
| G3 | View mode switch | P2 |
| G4 | Hijri calendar | P2 |
| G5 | Method proxies | P2 |
| G6 | Today button | P3 |

## Concrete upgrade API

```ts
@Input() mode: 'single' | 'range' | 'multi' = 'single';
@Input() viewMode: 'date' | 'month' | 'year' | 'decade' = 'date';
@Input() calendar: 'gregorian' | 'islamic-umalqura' | 'hebrew' = 'gregorian';
@Input() showToday = false;
@Output() rangeChange = new EventEmitter<{ start: string; end: string }>();
async focus(): Promise<void>;
async goToToday(): Promise<void>;
async nextMonth(): Promise<void>;
async prevMonth(): Promise<void>;
```

For CVA, implement `ControlValueAccessor` directly on the wrapper.

## Shared vs per-page

All shared.

## Workarounds today

- For G1: use `<falcon-angular-date-picker>` if Reactive Forms binding is needed.
- For G2: use two `<falcon-angular-date-picker>` for start + end externally.
- For G4: format dates via `Intl.DateTimeFormat` externally and pass.
