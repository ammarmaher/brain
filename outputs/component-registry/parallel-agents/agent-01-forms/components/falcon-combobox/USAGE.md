# falcon-combobox — USAGE

## Real usage examples

### Example 1 — "Choose or create" tag picker

```html
<falcon-angular-combobox
  [label]="'Tags' | translate"
  placeholder="Type or pick..."
  [items]="tagSuggestions"
  [allowFreeText]="true"
  [(ngModel)]="currentTag"
  (filterChange)="onQueryChange($event)">
</falcon-angular-combobox>
```

### Example 2 — Async-loaded company picker

```ts
companyItems = signal<FalconComboboxItem[]>([]);
loading = signal(false);

onQueryChange(query: string) {
  this.loading.set(true);
  this.search$.next(query); // debounced upstream
}
```

```html
<falcon-angular-combobox
  [label]="'Company'"
  [items]="companyItems()"
  [loading]="loading()"
  [(ngModel)]="selectedCompany"
  (filterChange)="onQueryChange($event)">
</falcon-angular-combobox>
```

### Example 3 — Strict suggestion-only mode

```html
<falcon-angular-combobox
  [items]="strictList"
  [allowFreeText]="false"
  [(ngModel)]="selection">
</falcon-angular-combobox>
```

## Recommended usage for NEW Angular pages

- Use when the user MIGHT type a new value but suggestions help.
- For pure search → `<falcon-angular-search-input>`.
- For pure single-pick → `<falcon-angular-dropdown>`.
- Wire `filterChange` to an `Observable.debounceTime(...)` for async loading.

## Reactive Forms

```ts
form = new FormGroup({
  tag: new FormControl<string>('', { nonNullable: true }),
});
```

```html
<falcon-angular-combobox
  formControlName="tag"
  [items]="suggestions"
  [allowFreeText]="true">
</falcon-angular-combobox>
```

## ngModel

```html
<falcon-angular-combobox
  [items]="items"
  [(ngModel)]="value">
</falcon-angular-combobox>
```

## Tailwind-only usage

```html
<falcon-angular-combobox class="w-full" [items]="items" [(ngModel)]="v"></falcon-angular-combobox>
```

## Token usage

```css
.brand-combo {
  --falcon-combobox-panel-max-height: 320px;
  --falcon-combobox-option-bg-hover: var(--color-falcon-teal-tint);
}
```

## Bad usage to avoid

- Do NOT use for multi-value selection.
- Do NOT debounce inside `(filterChange)` handler — debounce in the observable pipeline.
- Do NOT depend on `loading=true` to suppress search — it's a visual hint only.

## Do / Don't

| Do | Don't |
|---|---|
| Use when user MAY enter free text. | Use for pure single-select. |
| Wire `filterChange` to RxJS pipeline for async. | Call API directly inside the handler. |
| Bind value via CVA. | Bind `[value]` directly. |
