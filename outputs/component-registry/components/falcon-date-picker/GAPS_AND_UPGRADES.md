# falcon-date-picker — GAPS AND UPGRADES

## Missing capabilities

### G1 — No CVA support (P1)

**This is the biggest gap.** Wrapper does not implement `ControlValueAccessor`. Reactive Forms + ngModel binding does NOT work. Consumers must wire `(valueChange)` + `[value]` two-way manually OR write a custom CVA directive.

**Recommended fix:** add `ControlValueAccessor` on the wrapper directly. Required for parity with siblings.

### G2 — No range mode (P1)

Single date only. Range needs external composition.

### G3 — No time picker (P1)

Date-only. No time selection. Common need for "scheduled at" fields.

**Recommended fix:** add `@Input() showTime = false` + time-input section in popover.

### G4 — No display-format input (P2)

Input shows ISO `YYYY-MM-DD`. No way to display `DD MMM YYYY` or similar — wrapper does no Intl formatting on display.

**Recommended fix:** add `@Input() displayFormat?: string` (Intl options or template string).

### G5 — No calendar system (Hijri) (P2)

Same as calendar.

### G6 — No method proxies (P2)

No `openPicker()` / `closePicker()` / `clearDate()` / `setFocus()`.

### G7 — No "Today" / "Clear" quick actions inside popover (P3)

### G8 — No range-validation interaction with siblings (P3)

If two date-pickers represent start+end, no automatic "start <= end" hint. Consumer must coordinate.

## Missing accessibility

- Verify popover `role="dialog"` + focus trap.
- Verify keyboard nav: Enter opens, Esc closes, Tab inside popover.
- Verify announcement of selected date.

## Missing tests

- No Angular wrapper spec located.

## Missing Tailwind / token parity

- Verify popover anchoring/positioning on both render paths.

## Performance risks

- None.

## Visual / interaction risks

- Popover positioning at viewport edges — verify flip/anchor strategy.
- RTL popover anchoring.

## Recommended upgrade priority

| ID | Title | Priority |
|---|---|---|
| G1 | CVA support | P1 |
| G2 | Range mode | P1 |
| G3 | Time picker | P1 |
| G4 | Display format | P2 |
| G5 | Hijri calendar | P2 |
| G6 | Method proxies | P2 |
| G7 | Quick actions in popover | P3 |

## Concrete upgrade API

```ts
// implements ControlValueAccessor
@Input() mode: 'single' | 'range' = 'single';
@Input() showTime = false;
@Input() displayFormat?: string;
@Input() calendar: 'gregorian' | 'islamic-umalqura' = 'gregorian';
@Output() rangeChange = new EventEmitter<{ start: string; end: string }>();
async openPicker(): Promise<void>;
async closePicker(): Promise<void>;
async clearDate(): Promise<void>;
async setFocus(): Promise<void>;
```

## Shared vs per-page

All shared.

## Workarounds today

- For G1: wrap in a CVA directive externally.
- For G2: compose two pickers and validate min/max cross-field.
- For G3: pair with `<falcon-angular-input type='text'>` for HH:MM.
- For G4: format manually after `(valueChange)` and display in a sibling element.
