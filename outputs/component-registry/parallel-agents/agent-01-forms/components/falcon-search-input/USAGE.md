# falcon-search-input — USAGE

## Real usage examples

### Example 1 — Filter panel search

```html
<falcon-angular-search-input
  [value]="query()"
  placeholder="Search clients..."
  (falconSearch)="onSearch($event.value)"
  (falconSearchClear)="onClear()">
</falcon-angular-search-input>
```

```ts
onSearch(q: string) { this.query.set(q); }
onClear()            { this.query.set(''); }
```

### Example 2 — Header global search with loading

```html
<falcon-angular-search-input
  [loading]="isSearching()"
  [debounceMs]="500"
  placeholder="Search everything..."
  (falconSearch)="performGlobalSearch($event.value)">
</falcon-angular-search-input>
```

### Example 3 — Compact in-table filter

```html
<falcon-angular-search-input
  size="sm"
  [debounceMs]="200"
  placeholder="Filter rows..."
  (falconSearch)="setTableFilter($event.value)">
</falcon-angular-search-input>
```

## Recommended usage for NEW Angular pages

- Use for ALL search bars.
- Pair with RxJS:

```ts
private query$ = new Subject<string>();
onSearch(q: string) { this.query$.next(q); }
```

The component already debounces — wire directly to the API call.

- Use `loading=true` while the search request is in flight.

## Reactive Forms

NOT supported (no CVA). Use `(falconSearch)` event.

## ngModel

NOT supported.

## Tailwind-only

```html
<falcon-angular-search-input class="block max-w-md" ... />
```

## Token usage

```css
.brand-search {
  --falcon-search-input-icon-color: var(--color-falcon-teal-500);
  --falcon-search-input-bg: var(--color-falcon-neutral-50);
}
```

## Bad usage to avoid

- Do NOT debounce externally — the component already does.
- Do NOT use this for non-search → use input.
- Do NOT bind via ngModel — won't work.

## Do / Don't

| Do | Don't |
|---|---|
| Use for search bars. | Use for any free-text. |
| Trust the built-in debounce. | Add external debounce. |
| Set `loading` while searching. | Show spinner externally. |
