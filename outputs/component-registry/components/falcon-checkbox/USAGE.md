# falcon-checkbox — USAGE

## Real usage examples

### Example 1 — Standalone form checkbox

```html
<falcon-angular-checkbox
  [label]="'I agree to the terms'"
  [(ngModel)]="agreed"
  [required]="true">
</falcon-angular-checkbox>
```

### Example 2 — Tri-state header (table select-all)

```html
<falcon-angular-checkbox
  [indeterminate]="someSelected() && !allSelected()"
  [checkedInput]="allSelected()"
  (valueChange)="toggleAll($event)">
</falcon-angular-checkbox>
```

### Example 3 — Reactive Forms

```ts
form = new FormGroup({
  marketing: new FormControl<boolean>(false, { nonNullable: true }),
});
```

```html
<falcon-angular-checkbox
  formControlName="marketing"
  [label]="'Send me marketing emails'">
</falcon-angular-checkbox>
```

## Recommended usage for NEW Angular pages

- Always use CVA (`formControlName` / `ngModel`) for standalone checkboxes.
- Use `checkedInput` ONLY when a parent (like a checkbox-group) manages the selection.
- Pair with `errorText` + `state="error"` for validation feedback.

## ngModel

```html
<falcon-angular-checkbox [(ngModel)]="value" [label]="'Yes'"></falcon-angular-checkbox>
```

## Tailwind-only usage

```html
<falcon-angular-checkbox class="mt-2" [(ngModel)]="v" [label]="'Hello'"></falcon-angular-checkbox>
```

## Token usage

```css
.brand-checkbox {
  --falcon-checkbox-bg-checked: var(--color-falcon-teal-500);
  --falcon-checkbox-border-color-checked: var(--color-falcon-teal-500);
  --falcon-checkbox-radius: 4px;
}
```

## Bad usage to avoid

- Do NOT use BOTH `[(ngModel)]` AND `[checkedInput]` on the same instance.
- Do NOT mutate `[indeterminate]` after toggle — it resets on user interaction.
- Do NOT use `pi pi-check` or PrimeIcons — the check glyph is built-in via Falcon icon assets.

## Do / Don't

| Do | Don't |
|---|---|
| Use CVA for forms. | Use `checkedInput` outside checkbox-group. |
| Use `indeterminate` for tri-state headers. | Try to preserve indeterminate across toggles. |
| Override visuals via tokens. | Hardcode hex / px in consumer CSS. |
