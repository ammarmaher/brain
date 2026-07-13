# falcon-search-input — USAGE

## Real usage examples (active codebase)

> `[CODE]` There are **no application consumers** of `<falcon-angular-search-input>` as of 2026-06-03 (grep across `apps/` + `libs/falcon/` → 0 files). The snippets below are the **recommended** patterns, not citations of live code. See Consumer Sweep at the bottom.

### Example 1 — Filter-panel search (controlled value)

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
onClear()           { /* optional — falconSearch('') already fired the reset */ }
```

### Example 2 — Header global search with loading spinner

```html
<falcon-angular-search-input
  [loading]="isSearching()"
  [debounceMs]="500"
  placeholder="Search everything..."
  (falconSearch)="performGlobalSearch($event.value)">
</falcon-angular-search-input>
```

Set `[loading]="true"` when your request goes out and `false` when it settles — the spinner is yours to drive (`[CODE]` falcon-search-input.tsx:128-135).

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

- Use for ALL search bars; wire `(falconSearch)` straight to the API call — the component already debounced (`[CODE]` falcon-search-input.tsx:88-94).
- Leave `useTailwind=true` (default, Light DOM) for Studio token-runtime + Tailwind-utility parity.
- Use `[value]` only to **reset/seed** the box from app state — it is NOT a `[(ngModel)]` channel.

```ts
// the component debounces internally — no RxJS debounceTime needed
onSearch(q: string) { this.loadResults(q); }
```

## Reactive Forms

**NOT supported** — the wrapper has no CVA (`[CODE]` falcon-search-input.component.ts:31-37). `formControlName` will not bind. Use `(falconSearch)`; if you must mirror into a form control, `setValue()` it from the handler.

## ngModel

**NOT supported** (no CVA). `[(ngModel)]` will not drive the value.

## Tailwind-only

```html
<falcon-angular-search-input class="block max-w-md" ... />
```

The wrapper already host-binds `block w-full` (`[CODE]` falcon-search-input.component.ts:72); add layout/responsive utilities via the host `class=`. There are no `wrapperClass` / `inputClass` inputs.

## Token usage (per-instance override pattern)

The component's **own** token surface is the loading spinner only (`[CODE]` search-input.tokens.css:13-21). To restyle the spinner per-instance, add a host class and mutate the spinner tokens:

```css
.brand-search {
  --falcon-search-input-spinner-color: var(--color-falcon-teal-500);
  --falcon-search-input-spinner-track: var(--color-falcon-neutral-200);
  --falcon-search-input-spinner-size: 16px;
  --falcon-search-input-loading-inset: 12px;
}
```

> To restyle the **field** (background, border, focus colour, icon) you override the shared `--falcon-input-*` tokens, NOT a `--falcon-search-input-*` token — the field is the composed `<falcon-input variant="search">`. There is **no** `--falcon-search-input-icon-color` / `--falcon-search-input-bg` token (a prior version of this doc claimed these — they do not exist).

## Bad usage to avoid

- **Do NOT** add RxJS `debounceTime` on top of `(falconSearch)` — you get a sluggish ~double delay (`[CODE]` falcon-search-input.tsx:88-94).
- **Do NOT** bind `[(ngModel)]` / `formControlName` — no CVA; it silently won't work.
- **Do NOT** re-fetch in BOTH `(falconSearch)` and `(falconSearchClear)` — clear already fires `falconSearch('')`; you would fetch twice (`[CODE]` falcon-search-input.tsx:104-105).
- **Do NOT** forget to toggle `[loading]` back to `false` — the spinner is consumer-controlled and stays forever otherwise.
- **Do NOT** target a `--falcon-search-input-icon-color` / `--falcon-search-input-bg` token — they don't exist; override `--falcon-input-*` for the field.
- **Do NOT** use it for combobox suggestions, a savable form field, or a searchable dropdown — wrong component.
- **Do NOT** use `*ngIf`/`*ngFor` around it — use `@if`/`@for` per project rule.

## Import requirements (standalone component)

```ts
import { FalconAngularSearchInputComponent } from '@falcon/ui-core';

@Component({
  standalone: true,
  imports: [FalconAngularSearchInputComponent],
  ...
})
```

> No `FormsModule` needed (no ngModel). The wrapper supplies `CUSTOM_ELEMENTS_SCHEMA` internally.

## Do / Don't

| Do | Don't |
|---|---|
| Use for search bars / list filters. | Use for any free-text whose value is saved. |
| Trust the built-in 300 ms debounce. | Add external `debounceTime`. |
| Bind `[value]` only to reset/seed. | Bind `[(ngModel)]` (no CVA). |
| Set `[loading]` while a request is in flight. | Leave `[loading]` stuck on. |
| Override `--falcon-search-input-spinner-*` for the spinner, `--falcon-input-*` for the field. | Invent `--falcon-search-input-icon-color`/`-bg`. |

## Consumer Sweep (2026-06-03)

[CODE] grep `falcon-angular-search-input` across `apps/` + `libs/falcon/` returned **0 application consumer file(s)** as of 2026-06-03. The only repo match outside `libs/falcon-ui-core/` is the component's own token file:

- `libs/falcon-ui-tokens/src/components/search-input.tokens.css` — token definition, NOT a consumer.

**Status: zero adoption (unchanged from Wave 7, 2026-05-17).** Showcase/playground-ready primitive awaiting a feature home. See GAPS_AND_UPGRADES Wave findings.
