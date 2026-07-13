# falcon-combobox — DECISION

> Sweep-refreshed 2026-06-03 (B04).

## Brain SK final recommendation

**STATUS: NEEDS-UPGRADE + UNADOPTED. Functional core, but missing form-control inputs (helperText / errorMessage / state / disabled-setter / required), has a camelCase-event-naming divergence, a weaker overlay story than the dropdown, and 0 production consumers.** Treat as a capability-in-waiting: do not retrofit a critical form onto it until G1/G2/G3/G6 land; prefer `<falcon-angular-dropdown searchable>` for closed searchable pickers today.

## Use this component for

- Free-text + suggestion pickers ("choose or create" patterns: tag picker, contact, free-form company).
- Async-loaded autocomplete fields (wire `filterChange` → fetch → re-bind `items`).

## Avoid this component for

- Pure single-select from a closed list → `<falcon-angular-dropdown>`.
- A searchable-but-closed picker where you'd otherwise reach for `allowFreeText=false` → consider `<falcon-angular-dropdown searchable>` instead (it has the full form-control contract the combobox lacks).
- Pure search of a page/grid → `<falcon-angular-search-input>`.
- Multi-select → `<falcon-angular-multi-select>`.
- Any field needing an inline error/helper/required marker today (GAP G1/G2/G4).
- A field inside a clipped (`overflow:hidden`) drawer/dialog on browsers without the Popover API (GAP G13 — the panel can be clipped).

## Preferred render path

`useTailwind=true` (default). Note the `-tw` path lacks the Shadow path's scroll-active-into-view (A4) — minor until adopted.

## Required upgrades before wider use

P1: G1 (helperText/errorMessage + render), G2 (state), G3 (disabled setter), G6 (per-item template). Then G13 (portal fallback) + G8 (public methods) for robustness.

## Relationship to other components

- Siblings: `<falcon-angular-dropdown>` (closed list), `<falcon-angular-multi-select>` (multi), `<falcon-angular-search-input>` (pure search).
- No shared panel implementation with the dropdown — it reimburses its own input + panel.

## Exact rule for future implementation tasks

1. **Free-text + suggestions?** → `<falcon-angular-combobox>` with `allowFreeText=true`.
2. **Searchable but closed?** → prefer `<falcon-angular-dropdown searchable>` (fuller contract) unless free-text is genuinely wanted, then `allowFreeText=false`.
3. Wire `(filterChange)` to `switchMap` for async cancellation — do NOT re-debounce (250ms is built in).
4. Use `[loading]` for async progress (visual only).
5. Disable via Reactive Forms `control.disable()` — there is no `[disabled]` property.
6. Wrap in `<falcon-form-field>` for label/error UNTIL G1/G2 land.
7. Bind value via CVA / `formControlName` — never `[value]`. Value is `string` only.

---

## Dynamic capability assessment

### 1. What is static today?
- No form-control inputs (helper/error/state/disabled-setter/required).
- No variant/appearance, no per-item template, no icon.
- Hardcoded 250ms debounce; inline SVG clear icon.
- camelCase Stencil event names.
- Inline panel; Top-Layer only via Popover API (no body-portal fallback).

### 2. What is dynamic through inputs/outputs?
- `[CODE]` 15 wrapper `@Input`s (items/placeholder/label/size/allowFreeText/clearable/loading/noResultsMessage/inputId/useTailwind + 5 Tailwind class hooks); `disabled` via CVA only.
- 3 outputs (`valueChange`, `filterChange`, `cleared`).
- CVA (string) + `filterChange` for async.

### 3. What is dynamic through slots / ng-template?
- None (no `<slot>`, no `ng-template`) — G6.

### 4. What is dynamic through token/theme overrides?
- All visual axes via `--falcon-combobox-*` (incl. panel/option/clear). Inline panel → per-instance host-class override DOES reach the panel (unlike the portaled dropdown). Dead helper/error tokens.

### 5. What is dynamic through Tailwind classes?
- `wrapperClass`/`inputClass`/`panelClass`/`optionClass`/`labelClass` (Tailwind path) + host `class=`.

### 6. What is missing to make this component reusable across pages?
- Form-control contract (helper/error/state/disabled-setter/required/variant/appearance).
- Per-item template / icon.
- Public imperative API (methods don't exist on the Stencil yet).
- Tunable debounce; `string | number` value.
- A body-portal fallback for clipped containers.

### 7. What capability should be added to the shared component (not page hack)?
- All of the above — every adopting page would otherwise re-implement the same plumbing or wrap in `<falcon-form-field>`.

### 8. What flags / options / templates / slots would make it better?
- `helperText`/`errorMessage`/`state`/`required`/`variant`/`appearance` inputs.
- `<ng-template falconComboboxItem let-item>` directive + `iconUrl`.
- `debounceMs` input; `disabledFromInput` setter; `string | number` value.
- `@Method()`s on both `.tsx` (then wrapper proxies).

### 9. What is the safest upgrade path?
1. **Phase A (additive, safe-local):** wrapper `disabledFromInput` setter, `required`, `variant`/`appearance`, `debounceMs`, consolidate item-type name. 
2. **Phase B (render-contract, HIGH-RISK):** `helperText`/`errorMessage`/`state` + `<p role="alert">` in both `.tsx`; per-item template.
3. **Phase C (a11y/parity):** `aria-busy`, `-tw` scroll-into-view.
4. **Phase D (overlay):** body-portal fallback (G13) + `@Method()`s (G8).
5. **Event rename (G11):** breaking — coordinate across React/Vue wrappers.

### 10. What is risky to change because other pages depend on it?
- **Nothing today** — 0 consumers, so the blast radius is just the library + the React/Vue wrappers (which mirror the API).
- The `string` value type — widening to `string | number` is schema-breaking for any future typed form; stage as opt-in.
- The camelCase event names — renaming breaks any direct raw-tag listener + the wrapper template + cross-framework wrappers.
- The default `useTailwind=true` — flipping changes DOM (Light↔Shadow); Shadow wasn't broadly adopted on this newer component, so lower risk than dropdown.

## Verification
🟢 RE-VERIFIED 2026-06-03 (W1-b) against the live wrapper. UNADOPTED + NEEDS-UPGRADE status holds (0 consumers across `apps/` + `libs/falcon/`); the missing `disabled` setter (G3), camelCase events, `string`-only value, and absent form-control inputs all confirmed. No corrections.
