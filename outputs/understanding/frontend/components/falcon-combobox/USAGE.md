# falcon-combobox — USAGE

> Sweep-refreshed 2026-06-03 (B04). Corrected the debounce guidance (filterChange is already debounced 250ms inside the Stencil). Consumer Sweep: still 0 app consumers.

## Real usage examples

> ⚠️ No production usage exists (0 app consumers as of 2026-06-03). The snippets below are the intended patterns, not observed ones.

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
  this.search$.next(query); // filterChange is ALREADY debounced 250ms inside the Stencil;
                            // pipe to switchMap only for in-flight cancellation, not re-debounce
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
- The `(filterChange)` event is already debounced 250ms inside the component — wire it to `switchMap` for cancellation, not to another `debounceTime`.
- If the field needs an inline error/helper/required marker, the combobox does NOT render them today (GAP G1/G2/G4) — wrap in `<falcon-form-field>` or choose a different control.

## Reactive Forms

```ts
form = new FormGroup({ tag: new FormControl<string>('', { nonNullable: true }) });
```

```html
<falcon-angular-combobox formControlName="tag" [items]="suggestions" [allowFreeText]="true"></falcon-angular-combobox>
```

> Disable via `form.controls.tag.disable()` — there is no `@Input() disabled` property (GAP G3).

## ngModel

```html
<falcon-angular-combobox [items]="items" [(ngModel)]="value"></falcon-angular-combobox>
```

## Tailwind-only usage

```html
<falcon-angular-combobox class="w-full" [items]="items" [(ngModel)]="v"></falcon-angular-combobox>
```

Wrapper-scoped extras (Tailwind path only): `wrapperClass`, `inputClass`, `panelClass`, `optionClass`, `labelClass`.

## Token usage (per-instance override)

```css
.brand-combo {
  --falcon-combobox-panel-max-height: 320px;
  --falcon-combobox-option-bg-hover: var(--color-falcon-teal-tint);
}
```

> The combobox panel renders inline (not body-portaled), so a per-instance host-class token override DOES reach the panel (unlike the dropdown's portaled panel).

## Bad usage to avoid

- Do NOT use for multi-value selection → `<falcon-angular-multi-select>`.
- Do NOT add a `debounceTime` in the `(filterChange)` handler — it is already debounced 250ms inside the Stencil.
- Do NOT depend on `loading=true` to suppress search — it's a visual hint only (it does NOT stop emissions).
- Do NOT bind `[disabled]="true"` and expect it to work — there is no property setter; use Reactive Forms `disable()`.
- Do NOT bind `[value]` directly — use CVA.
- Do NOT introduce it into a form needing an inline error message — it has no error/helper slot yet.

## Do / Don't

| Do | Don't |
|---|---|
| Use when the user MAY enter free text. | Use for pure single-select. |
| Pipe `filterChange` → `switchMap` for cancellation. | Re-debounce inside the handler (already 250ms). |
| Bind value via CVA / `formControlName`. | Bind `[value]` or expect `[disabled]` to work. |

## Consumer Sweep (2026-06-03)

`[CODE]` `Grep "falcon-angular-combobox"` returned **4 files, all library-internal** (wrapper, barrel, `SPEC-LOCK.md`, `combobox.tokens.css`). Bare `<falcon-combobox(-tw)>` tags: 0 in `apps/`. **0 real consumers.** Status: showcase/playground-only — promote in a real feature or formally watch for retirement.

## Verification
🟢 grep-verified 0 app consumers (2026-06-03). Debounce/disabled guidance 🟢 code-verified against `falcon-combobox.tsx` + `.component.ts`. 🟢 RE-VERIFIED 2026-06-03 (W1-b): `<falcon-angular-combobox` = 0 occurrences across `apps/` + `libs/falcon/` (still UNADOPTED). The "disable via Reactive Forms `control.disable()` — no `[disabled]` property" guidance confirmed against the live wrapper.
