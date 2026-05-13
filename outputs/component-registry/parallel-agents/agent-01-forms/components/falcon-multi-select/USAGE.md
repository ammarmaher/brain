# falcon-multi-select — USAGE

## Real usage examples

### Example 1 — Permission picker

```html
<falcon-angular-multi-select
  [label]="'role.permissions' | translate"
  [options]="permissionOptions"
  [searchable]="true"
  [clearable]="true"
  [showSelectAll]="true"
  [maxChipsVisible]="5"
  [(ngModel)]="selectedPermissions">
</falcon-angular-multi-select>
```

### Example 2 — Filter panel (multi-tag)

```html
<falcon-angular-multi-select
  [label]="'filter.tags' | translate"
  [options]="tagOptions"
  [searchable]="true"
  [clearable]="true"
  [(ngModel)]="filterState.tags"
  (valuesChange)="onTagFilterChange($event)">
</falcon-angular-multi-select>
```

### Example 3 — Compact in-grid use

```html
<falcon-angular-multi-select
  size="sm"
  [options]="quickOptions"
  [maxChipsVisible]="1"
  [(ngModel)]="rowSelection">
</falcon-angular-multi-select>
```

## Recommended for new pages

- Always use Reactive Forms / ngModel.
- Set `searchable=true` for > 10 options.
- Set `showSelectAll=true` when the user is likely to need all.
- Use `maxChipsVisible` to prevent chip overflow in narrow columns.

## Reactive Forms

```ts
form = new FormGroup({
  perms: new FormControl<(string|number)[]>([], { nonNullable: true }),
});
```

```html
<falcon-angular-multi-select
  formControlName="perms"
  [options]="permissionOptions"
  [searchable]="true">
</falcon-angular-multi-select>
```

## ngModel

```html
<falcon-angular-multi-select
  [options]="options"
  [(ngModel)]="selectedValues">
</falcon-angular-multi-select>
```

## Tailwind-only usage

```html
<falcon-angular-multi-select class="w-full max-w-md" [options]="opts" [(ngModel)]="v">
</falcon-angular-multi-select>
```

## Token usage

```css
.priority-multi {
  --falcon-multi-select-chip-bg: var(--color-falcon-teal-tint);
  --falcon-multi-select-chip-text-color: var(--color-falcon-teal-700);
  --falcon-multi-select-chip-radius: 4px;
}
```

## Bad usage to avoid

- Do NOT use for single-select.
- Do NOT push options imperatively — use the `[options]` setter so the wrapper handles Stencil ready timing.
- Do NOT bind `[values]` directly — bind via CVA / formControl / ngModel.
- Do NOT exceed ~200 options without virtualization — performance risk.

## Do / Don't

| Do | Don't |
|---|---|
| Use `[options]` + `[(ngModel)]` for binding. | Use raw `<falcon-multi-select>` tag without the wrapper. |
| Set `maxChipsVisible` to a sensible value. | Let chips overflow vertically. |
| Use `showSelectAll` for likely-select-all cases. | Build your own "Select all" toggle outside the component. |
| Use `searchable=true` for long lists. | Filter externally on top of the component. |
