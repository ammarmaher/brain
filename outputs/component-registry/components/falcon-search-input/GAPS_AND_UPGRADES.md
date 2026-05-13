# falcon-search-input — GAPS AND UPGRADES

## Missing capabilities

### G1 — No CVA support (P2)

Bind via event only. Some consumers want `formControlName` for consistency. Decide whether to add CVA OR document forever-event-only.

**Recommended fix:** add CVA — value setter already exists; bridge to `ControlValueAccessor`.

### G2 — No label / helper / error (P2)

By design — search inputs typically don't need these. But for "search with validation" use cases (e.g. searching by SKU pattern that must match a regex), there's no error display.

### G3 — No method proxies (P2)

No `setFocus()` / `clear()` on wrapper.

### G4 — No "search history" / recent suggestions slot (P3)

For "search with autocomplete recent terms", no suggestion list. Use `<falcon-angular-combobox>` instead.

### G5 — Spinner placement fixed (P3)

Spinner replaces / overlays the clear-X — verify positioning. No way to customize.

### G6 — `falconSearchClear` payload `previousValue` is unusual (P3)

Common pattern is `void`. Document the payload purpose.

### G7 — No keyboard shortcut to focus (e.g. "/") (P3)

Many products auto-focus search on "/" keypress. Consider adding `@Input() focusShortcut?: string`.

## Missing accessibility

- Verify `role="searchbox"` or `<input type="search">`.
- Verify clear button A11y.
- Verify spinner aria-busy.

## Missing tests

- No Angular wrapper spec.

## Missing Tailwind / token parity

- Verify Shadow + Light render search icon + clear-X identically.

## Performance risks

- Debounce in Stencil — verify it cancels properly on unmount.

## Visual / interaction risks

- Spinner + clear-X overlapping when both visible.

## Recommended upgrade priority

| ID | Title | Priority |
|---|---|---|
| G1 | CVA support | P2 |
| G3 | Method proxies | P2 |
| G7 | Focus shortcut | P3 |
| G6 | Document `previousValue` payload | P3 |

## Concrete upgrade API

```ts
// implements ControlValueAccessor
@Input() focusShortcut?: string;    // e.g. '/' or 'cmd+k'
async setFocus(): Promise<void>;
async clear(): Promise<void>;
```

## Shared vs per-page

All shared.

## Workarounds today

- For G1: subscribe to `(falconSearch)` and `setValue` on the form control.
- For G3: query nativeElement.
- For G7: add global keydown listener externally.
