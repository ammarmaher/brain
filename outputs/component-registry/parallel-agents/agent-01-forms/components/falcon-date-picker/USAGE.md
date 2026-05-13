# falcon-date-picker — USAGE

## Real usage examples

### Example 1 — Birth date with min/max

```html
<falcon-angular-date-picker
  [label]="'Date of birth'"
  min="1900-01-01"
  [max]="todayIso"
  [(value)]="dob"
  (valueChange)="onDateChange($event)">
</falcon-angular-date-picker>
```

### Example 2 — Disable weekends

```html
<falcon-angular-date-picker
  [disabledDates]="isWeekend"
  [(value)]="meetingDate">
</falcon-angular-date-picker>
```

### Example 3 — With error state

```html
<falcon-angular-date-picker
  [label]="'Start date'"
  [errorMessage]="startError() | translate"
  [state]="startError() ? 'error' : 'default'"
  [required]="true"
  [(value)]="startDate">
</falcon-angular-date-picker>
```

## Recommended usage for NEW Angular pages

- Always for input + popover date entry.
- Pair with form validation externally — wrapper has no CVA.
- Use `firstDayOfWeek=6` for Saturday-start Arabic locales.
- Pass `disabledDates` predicate for dynamic rules.

## Reactive Forms

Without CVA, wire via subscription:

```ts
@ViewChild(FalconAngularDatePickerComponent) picker!: FalconAngularDatePickerComponent;

ngAfterViewInit() {
  this.picker.valueChange.subscribe(v => this.form.controls.date.setValue(v));
  this.form.controls.date.valueChanges.subscribe(v => this.picker.value = v);
}
```

OR (better) wrap in a directive that implements `ControlValueAccessor`.

## ngModel

NOT supported (no CVA). Recommended fix tracked under GAPS.

## Tailwind-only

```html
<falcon-angular-date-picker class="w-full" rootClass="..." ... />
```

## Token usage

Inherits calendar tokens; per-instance override:

```css
.brand-date {
  --falcon-input-border-color-focus: var(--color-falcon-teal-500);
  --falcon-calendar-day-bg-selected: var(--color-falcon-teal-500);
}
```

## Bad usage to avoid

- Do NOT use for inline always-visible → use `<falcon-angular-calendar>`.
- Do NOT bind `[(ngModel)]` — won't work.
- Do NOT pass `disabledDates` as a string attr — must be JS array/fn.

## Do / Don't

| Do | Don't |
|---|---|
| Use for input + popover. | Use for inline. |
| Bind via `[value]` + `(valueChange)`. | Use `ngModel`. |
| Pass `firstDayOfWeek` per locale. | Trust browser default. |
