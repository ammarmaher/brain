# falcon-calendar — USAGE

## Real usage examples

### Example 1 — Inline calendar on a detail page

```html
<falcon-angular-calendar
  [value]="selectedDate()"
  [min]="'2026-01-01'"
  [max]="'2026-12-31'"
  [firstDayOfWeek]="0"
  locale="en-US"
  (valueChange)="onDateChange($event)">
</falcon-angular-calendar>
```

### Example 2 — Disabled-dates predicate

```ts
isWeekend = (d: Date) => d.getDay() === 0 || d.getDay() === 6;
```

```html
<falcon-angular-calendar
  [disabledDates]="isWeekend"
  [(value)]="picked">
</falcon-angular-calendar>
```

### Example 3 — Disabled-dates array

```html
<falcon-angular-calendar
  [disabledDates]="['2026-05-15', '2026-05-22']"
  (valueChange)="onPick($event)">
</falcon-angular-calendar>
```

## Recommended usage for NEW Angular pages

- Inline calendar? → `<falcon-angular-calendar>`.
- Input + popover? → `<falcon-angular-date-picker>`.
- Use `firstDayOfWeek` per locale (e.g. `6` for Saturday-start Arabic locales).
- Use `disabledDates` predicate for dynamic rules; array for static lists.

## Reactive Forms

Direct CVA is not supported. Use `valueChange` to drive a form control:

```ts
this.calendarDate$.subscribe(d => this.form.controls.date.setValue(d));
```

OR use `<falcon-angular-date-picker>` for CVA support.

## ngModel

NOT supported (no CVA). Use the legacy facade `<falcon-calendar>` for `[(ngModel)]` style.

## Tailwind-only

```html
<falcon-angular-calendar class="inline-block" ... />
```

## Token usage

```css
.brand-cal {
  --falcon-calendar-day-bg-selected: var(--color-falcon-teal-500);
  --falcon-calendar-day-text-color-selected: var(--color-falcon-neutral-0);
}
```

## Bad usage to avoid

- Do NOT pass `disabledDates` as a string — it must be an array or function (JS prop).
- Do NOT use for date input with popover — use `<falcon-angular-date-picker>`.
- Do NOT use for range — not supported yet.

## Do / Don't

| Do | Don't |
|---|---|
| Use for inline calendar UI. | Use for input + popover. |
| Pass `disabledDates` as JS array / fn. | Pass as `[attr.*]` string. |
| Set `firstDayOfWeek` per locale. | Trust browser default for Arabic. |
