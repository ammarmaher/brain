# falcon-calendar (LEGACY FACADE) — USAGE

## Real usage in active codebase
- _Verify._ Likely none active (Wave 3 noted both call sites use only `[ngModel]` + `(dateChange)`, no Set/Cancel reliance).

## Recommended NEW usage
- DO NOT add new consumers.
- For new date fields, use `<falcon-angular-date-picker>`:
  ```html
  <falcon-angular-date-picker
    [label]="'fields.startDate.label' | translate"
    [(ngModel)]="startDate"
    [min]="minDate"
    [max]="maxDate" />
  ```

## Reactive Forms / ngModel
- Works via CVA. `Date | null` two-way.

## Bad usage to avoid
- Don't pass `useEffectiveDateValidation=true` and expect behavior — it's a no-op.
- Don't use this for new code.

## Do / Don't
- DO let existing consumers keep compiling.
- DON'T extend.
