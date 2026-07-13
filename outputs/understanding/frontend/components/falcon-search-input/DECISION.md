# falcon-search-input — DECISION

## Brain SK final recommendation

**STATUS: READY. Use for all search inputs.**

## Use this component for

- Filter panel search bars.
- Header global search.
- Table global filter.
- Any debounced search field.

## Avoid this component for

- Free-text → input.
- Combo with suggestions → combobox.
- Dropdown with internal search → dropdown's `searchable=true`.

## Preferred render path

`useTailwind=true`.

## Required upgrades

None blocking for the happy path. Two a11y items are worth doing before wider adoption: **G4** (the default Tailwind path omits `clearAriaLabel="Clear search"` → generic "Clear input" label) and **G5** (no `aria-busy` when loading). **G6** (spinner colour points at a non-existent `--color-falcon-primary-500` → off-brand blue) is a quick safe-local fix.

## Relationship

- Composes `<falcon-input variant="search" type="search">` (Shadow) / `<falcon-input-tw variant="search" type="search">` (Light) — owns the debounce/clear/spinner shell only.
- Siblings: `<falcon-angular-combobox>` (suggestions), `<falcon-angular-dropdown [searchable]>` (in-panel search), `<falcon-angular-input>` (saved free-text).

## Exact rule

1. Search bar? → `<falcon-angular-search-input>`.
2. Wire `(falconSearch)` directly to your API call.
3. Set `loading=true` while in-flight.
4. Trust the built-in debounce — don't add external.

---

## Dynamic capability assessment

### 1. What is static today?
- Search-icon-left + clear-X-right layout (inherited from the composed `variant="search"` input — not search-input's own markup).
- Loading spinner placement (trailing, `role="status"`), spinner keyframe.
- The inner input is hard-pinned to `variant="search" type="search"` — no way to change the visual variant.
- Clear-X label `"Clear search"` (Shadow only); the Tailwind/default path uses the base `"Clear input"` (G4).

### 2. What is dynamic through inputs/outputs?
- 7 wrapper `@Input`s (`value`, `placeholder`, `debounceMs`, `loading`, `size`, `disabled`, `useTailwind`).
- 2 `@Output`s (`falconSearch {value}`, `falconSearchClear {previousValue}`) — debounced; clear fires both.
- **No CVA** (G1) — `[value]` + `(falconSearch)` only.

### 3. What is dynamic through slots / ng-template?
- **None.** No `<slot>` on either Stencil tag; no `<ng-content>` in the wrapper.

### 4. What is dynamic through token/theme overrides?
- Spinner: 4 own tokens (`--falcon-search-input-spinner-*`, `-loading-inset`).
- Field (bg/border/focus/height/clear-X): the shared `--falcon-input-*` set, inherited.
- Dark mode + density flow through the composed input automatically.

### 5. What is dynamic through Tailwind classes?
- Host `class=` only (wrapper host-binds `block w-full`). No `wrapperClass`/`inputClass` inputs.

### 6. What is missing to make it reusable across pages?
- CVA (G1), Angular method proxies (G3), focus shortcut (G7), `aria-busy` (G5), brand spinner colour (G6), and — most importantly for the default path — `clearAriaLabel` parity (G4).

### 7. What capability should be added to the shared component (not a page hack)?
- All of the above belong in the shared component (single §5.12.2 chokepoint).

### 8. What flags / options would make it better?
- `@Input() focusShortcut?`, method proxies, optional CVA, `clearAriaLabel` passthrough on the `-tw` twin, `aria-busy`.

### 9. What is the safest upgrade path?
1. **Phase A (safe-local):** repoint spinner colour off `--color-falcon-primary-*` to `--color-falcon-teal-500` (G6); add the missing spec.
2. **Phase B (a11y, HIGH-RISK-QUEUE):** add `clearAriaLabel="Clear search"` + `aria-busy` to the `-tw` twin so the default path matches Shadow (G4/G5).
3. **Phase C (additive API):** wrapper `setFocus()`/`clear()` proxies, optional CVA, `focusShortcut`.
All phases additive — no consumer break (and there are no consumers to break today).

### 10. What is risky to change because other pages depend on it?
- Nothing depends on it today (0 consumers) — risk is theoretical. Still: changing default `debounceMs=300` is a visible UX shift; flipping `useTailwind` default changes DOM structure (Light↔Shadow); the `{ previousValue }` clear payload shape is unusual and any consumer that eventually keys off it would break if changed.

## Verification
🟢 code-verified (re-read 2026-06-03) against `falcon-search-input.component.ts/.html` + both Stencil tags + token file + Tailwind helper. Findings G4/G5/G6 ✅ source-verified this pass.
