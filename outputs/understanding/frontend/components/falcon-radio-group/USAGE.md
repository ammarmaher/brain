# falcon-radio-group — USAGE

## Real usage examples

### Example 1 — Status picker

```html
<falcon-angular-radio-group
  groupLabel="Account status"
  [options]="[
    { value: 'active',  label: 'Active' },
    { value: 'paused',  label: 'Paused' },
    { value: 'archive', label: 'Archived' }
  ]"
  [(ngModel)]="status">
</falcon-angular-radio-group>
```

### Example 2 — Horizontal pricing tier

```html
<falcon-angular-radio-group
  orientation="horizontal"
  [options]="tierOptions"
  [(ngModel)]="selectedTier">
</falcon-angular-radio-group>
```

### Example 3 — Reactive Forms with error

```html
<falcon-angular-radio-group
  formControlName="plan"
  [options]="planOptions"
  [errorText]="form.controls.plan.invalid && form.controls.plan.touched ? 'Required' : ''">
</falcon-angular-radio-group>
```

## Recommended usage for NEW Angular pages

- Use for ≤ 8 options. Beyond that, use `<falcon-angular-dropdown>`.
- Always bind via CVA.
- Use `groupLabel` instead of an external label element.

## Reactive Forms

```ts
form = new FormGroup({
  plan: new FormControl<string | null>(null, Validators.required),
});
```

## ngModel

```html
<falcon-angular-radio-group [options]="opts" [(ngModel)]="selected"></falcon-angular-radio-group>
```

## Tailwind-only

```html
<falcon-angular-radio-group class="block w-full" ... />
```

## Token usage

```css
.brand-radio-group {
  --falcon-radio-group-gap: 12px;
  --falcon-radio-group-label-color: var(--color-falcon-teal-700);
}
```

## Bad usage to avoid

- Do NOT manually loop `<falcon-angular-radio>` — use this wrapper.
- Do NOT mix CVA AND `[selectedValue]` setter for writes.
- Do NOT use for > 8 options.

## Do / Don't

| Do | Don't |
|---|---|
| Use for typical pick-one. | Use for boolean. |
| Bind via CVA. | Loop radios manually. |
