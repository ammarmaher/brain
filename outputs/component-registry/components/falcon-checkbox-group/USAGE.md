# falcon-checkbox-group — USAGE

## Real usage examples

### Example 1 — Permission selector

```html
<falcon-angular-checkbox-group
  groupLabel="Permissions"
  [options]="permissionOptions"
  orientation="vertical"
  [(ngModel)]="selectedPermissions">
</falcon-angular-checkbox-group>
```

### Example 2 — Horizontal toggles in settings

```html
<falcon-angular-checkbox-group
  groupLabel="Notifications"
  orientation="horizontal"
  [options]="[
    { value: 'email', label: 'Email' },
    { value: 'sms',   label: 'SMS' },
    { value: 'push',  label: 'Push' }
  ]"
  [(ngModel)]="channels">
</falcon-angular-checkbox-group>
```

### Example 3 — Reactive Forms with errorText

```html
<falcon-angular-checkbox-group
  formControlName="perms"
  groupLabel="Choose at least 2"
  [options]="opts"
  [errorText]="form.controls.perms.invalid ? 'Pick at least 2' : ''">
</falcon-angular-checkbox-group>
```

## Recommended usage for NEW Angular pages

- Use for ≤ 12 always-visible options.
- For long lists → `<falcon-angular-multi-select>`.
- Always bind via CVA (`formControlName` or `[(ngModel)]`).

## Reactive Forms

```ts
form = new FormGroup({
  perms: new FormControl<(string|number)[]>([], { nonNullable: true, validators: [minSelected(2)] }),
});
```

## ngModel

```html
<falcon-angular-checkbox-group
  [options]="opts"
  [(ngModel)]="selectedValues">
</falcon-angular-checkbox-group>
```

## Tailwind-only usage

The wrapper passes `useTailwind=true` (default) to each child. Per-row layout is controlled by `orientation`.

```html
<falcon-angular-checkbox-group class="block" ... />
```

## Token usage

```css
.brand-group {
  --falcon-checkbox-group-gap: 12px;
  --falcon-checkbox-group-label-color: var(--color-falcon-teal-700);
}
```

## Bad usage to avoid

- Do NOT manually loop `@for` over `<falcon-angular-checkbox>` to fake a group — use this wrapper.
- Do NOT mix `[(ngModel)]` AND `(selectedValuesChange)` listener for value writes — pick one.
- Do NOT use for long lists.

## Do / Don't

| Do | Don't |
|---|---|
| Use this wrapper for grouped checkboxes. | Hand-roll your own loop. |
| Bind via CVA. | Mutate selection imperatively from outside. |
| Use `orientation` for layout. | Set inline `style="display: flex"`. |
