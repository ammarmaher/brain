# falcon-combobox — GAPS AND UPGRADES

> Sweep-refreshed 2026-06-03 (B04). Corrected: G7 (a 250ms debounce DOES exist inside the Stencil — the gap is a *tunable* input), G8 (the Stencil has NO `@Method()`s at all — nothing to proxy), a11y (`aria-autocomplete`/`aria-activedescendant` ARE present). Added G11–G13.

## Missing capabilities (active source verified 2026-06-03)

### G1 — No `helperText` / `errorMessage` inputs on the wrapper (P1)

`[CODE]` Unlike `<falcon-input>`/`<falcon-dropdown>`/`<falcon-multi-select>`, the combobox wrapper has NO helper/error inputs, and **neither Stencil component renders a helper or error element** (`falcon-combobox.tsx` render has no `<p role="alert">`). Form-level error/helper cannot be shown in the component. (The `--falcon-combobox-helper-*`/`-error-*` tokens exist but are dead — see TOKENS.)

**Recommended fix:** add `@Input() helperText?` + `@Input() errorMessage?` on the wrapper AND render `<p role="alert">` in both `.tsx`. `risk-class HIGH-RISK-QUEUE` (render-contract + a11y change).

### G2 — No `state` input (P1)

`[CODE]` No `state: 'default'|'error'|'success'|'warning'`. Cannot show validation styling consistently with other form controls (only `size` + `disabled` are reflected). `risk-class HIGH-RISK-QUEUE`.

### G3 — No `@Input() disabled` property setter (P1)

`[CODE]` `disabled` is written ONLY by CVA's `setDisabledState` (`.ts:130`); there is no `disabledFromInput`-style setter (contrast `falcon-dropdown.component.ts:186-189`). A non-Forms `[disabled]="true"` does nothing. `risk-class safe-local` (additive setter).

### G4 — No `required` input (P2)

`[CODE]` No required marker on the label (the Stencil label has no asterisk branch). `risk-class safe-local`.

### G5 — No `variant` / `appearance` (P2)

`[CODE]` Doesn't follow the Wave 9.C convention that `<falcon-input>`/`<falcon-dropdown>` adopted. `risk-class safe-local`.

### G6 — No per-item template / icon (P1)

`[CODE]` Only `item.label` text renders (`falcon-combobox.tsx:310`); no `iconUrl`, sub-label, or `ng-template`. No `<slot>` exists. (Contrast dropdown's `iconUrl`.) `risk-class HIGH-RISK-QUEUE` (template contract).

### G7 — No CONFIGURABLE debounce; the 250ms is hardcoded (P3) — corrected

`[CODE]` **Correction:** a debounce DOES exist — `falcon-combobox.tsx:197-201` / `-tw.tsx:178-181` `setTimeout(... 250)` before emitting `falconComboboxFilter`. The gap is that 250ms is **hardcoded** with no `@Input() debounceMs` to tune it. (Prior dossier said "no debounce — fires every keystroke", which was wrong.) `risk-class safe-local`.

### G8 — No imperative API exists (NOT "methods not proxied") (P2) — corrected

`[CODE]` **Correction:** the Stencil components define `openPanel`/`closePanel`/`selectItem`/`scrollActiveOptionIntoView` as **private** methods — there are **NO `@Method()` decorators** (contrast `falcon-dropdown.tsx:115-137`). So there is nothing for the wrapper to proxy and no public open/close/focus/clear API at all. To add one, you must FIRST add `@Method()`s to both `.tsx`, then proxy on the wrapper. `risk-class HIGH-RISK-QUEUE` (public API surface on the Stencil).

### G9 — Value type is `string` only (P2)

`[CODE]` `value` is `string` everywhere (`.ts:120`, `.tsx:34`); dropdown is `string | number`. A numeric option `value` arrives as a string. `risk-class safe-local` (widen as opt-in).

### G10 — `searchable` is implicit (by design)

`[CODE]` There is no `searchable` toggle — search/filter is always on (the field IS a search input). Fine; documented.

### G11 — camelCase Stencil event names break the `falcon-*` convention (P2) — NEW

`[CODE]` The Stencil events are `falconComboboxFilter` / `falconComboboxSelect` / `falconComboboxClear` (`.tsx:53-60`) — camelCase, whereas EVERY other Falcon component uses kebab `falcon-*` (`falcon-change`, `falcon-open`, etc., per house rule "namespaced `falcon-*` events"). A cross-framework consumer wiring the raw tag must use the odd casing. `risk-class HIGH-RISK-QUEUE` (renaming the events would break any direct listener + the wrapper template).

### G12 — Two item-type names (`FalconComboboxItem` vs `ComboboxItem`) (P3) — NEW

`[CODE]` The wrapper declares + exports `FalconComboboxItem` (`.ts:36-40`); the types file declares `ComboboxItem` (`falcon-combobox.types.ts:5-9`) which the `.tsx` files use. Structurally identical, but two names for one concept is a drift hazard. Consolidate to one. `risk-class safe-local`.

### G13 — Weaker overlay story than dropdown (inline + Popover-API-only) (P2) — NEW

`[CODE]` The panel renders inline and escapes ancestor stacking ONLY via the native Popover API (wrapper MutationObserver). On browsers without the Popover API the panel stays inline and can be clipped by an `overflow:hidden` ancestor — there is NO body-portal fallback (contrast `<falcon-dropdown-tw>`'s `ensurePortaled` body-portal + Top-Layer). Inside drawers/dialogs this is a real risk once the component is adopted. `risk-class HIGH-RISK-QUEUE` (would need a portal path).

## Missing accessibility

- `[CODE]` **A1 (P2):** no live region announcing result count.
- `[CODE]` **A2 (info — already present):** `aria-autocomplete="list"` (`.tsx:241`) AND `aria-activedescendant` (`.tsx:242`) ARE present — corrects the prior "verify" note. The combobox a11y is actually BETTER than the dropdown's (which lacks `aria-activedescendant`).
- `[CODE]` **A3 (P2):** no `aria-busy` while `loading` (the spinner is `aria-hidden`) — screen readers don't hear the busy state.
- `[CODE]` **A4 (P3, parity):** the Shadow path scrolls the active option into view (`scrollActiveOptionIntoView`, `.tsx:178-187`); the `-tw` path does NOT — keyboard-active option can scroll out of view in Tailwind mode.

## Missing tests

`[CODE]` No `.spec.ts` located (Glob 2026-06-03). Add CVA cycle, filter-debounce, free-text vs strict modes, keyboard nav, clear, Top-Layer acquire/release. `risk-class safe-local`.

## Missing Tailwind / token parity

- `[CODE]` **No `-tw` CSS file** + **no Shadow/`-tw` slot** — the `-tw` lacks the Shadow path's scroll-into-view (A4). Otherwise the dual-render prop/event surface matches 1:1.
- `[CODE]` Dead helper/error tokens (TOKENS) — declared, never rendered.

## Performance risks

- `[CODE]` The wrapper's `MutationObserver` fires on every Stencil render (per keystroke) but acquire/release are idempotent (`activePanelEl` guard) — acceptable, scoped to the host subtree.

## Visual / interaction risks

- `[CODE]` "No matches" row vs `loading` spinner — when `loading` and the list is empty, both the spinner and the empty row can show; verify the intended state machine once adopted.
- `[CODE]` `-tw` no scroll-into-view (A4) — long lists feel broken under keyboard nav in Tailwind mode.

## Recommended upgrade priority

| ID | Title | Priority | risk-class |
|---|---|---|---|
| G1 | `helperText` + `errorMessage` (+ render element) | P1 | HIGH-RISK-QUEUE |
| G2 | `state` input | P1 | HIGH-RISK-QUEUE |
| G3 | `@Input() disabled` property setter | P1 | safe-local |
| G6 | Per-item template / `iconUrl` | P1 | HIGH-RISK-QUEUE |
| G8 | Add `@Method()`s then proxy on wrapper | P2 | HIGH-RISK-QUEUE |
| G13 | Body-portal fallback for the panel | P2 | HIGH-RISK-QUEUE |
| G11 | Rename events to `falcon-*` | P2 | HIGH-RISK-QUEUE |
| G4 | `required` input | P2 | safe-local |
| G5 | `variant` / `appearance` | P2 | safe-local |
| G7 | Tunable `debounceMs` input | P3 | safe-local |
| G9 | Widen value to `string \| number` | P2 | safe-local |
| G12 | Consolidate `FalconComboboxItem`/`ComboboxItem` | P3 | safe-local |
| A4 | `-tw` scroll-active-into-view parity | P3 | safe-local |

## Concrete upgrade API

```ts
// Angular wrapper additions
@Input() helperText?: string;
@Input() errorMessage?: string;
@Input() state: 'default' | 'error' | 'success' | 'warning' = 'default';
@Input('disabled') set disabledFromInput(v: boolean | string | null);   // mirror dropdown's setter
@Input() required = false;
@Input() variant: 'form' | 'search' | 'grid' = 'form';
@Input() appearance: 'default' | 'filled' | 'ghost' = 'default';
@Input() debounceMs = 250;
@ContentChild(FalconComboboxItemTemplateDirective) itemTpl?: FalconComboboxItemTemplateDirective;
async openPanel(): Promise<void>;  // requires @Method() added to both .tsx first
async clear(): Promise<void>;
```

## Shared vs per-page

All gaps belong in the shared component.

## Workarounds today

- For G1/G2: wrap in `<falcon-form-field>` for label + error markup.
- For G3: use Reactive Forms `control.disable()` (CVA path).
- For G7: the 250ms is fine for most cases; pipe `filterChange` → `switchMap` for cancellation.
- For G8: reach the inner Stencil element via `ViewChild` — but note there are NO public methods to call.

## Wave findings — B04 (2026-06-03)

`[CODE]` Consumer count: **0** (grep returned only library-internal files). The component is a capability the platform owns but does not use.

New/corrected this pass (see `FINDINGS/B04.md`):
1. **G7 corrected** — 250ms debounce DOES exist (gap is tunability), not "no debounce".
2. **G8 corrected** — no `@Method()`s exist; nothing to proxy + no public imperative API.
3. **G11 (medium, HIGH-RISK-QUEUE)** — camelCase events break the `falcon-*` convention.
4. **G12 (low, safe-local)** — dual item-type names (`FalconComboboxItem` vs `ComboboxItem`).
5. **G13 (medium, HIGH-RISK-QUEUE)** — inline panel + Popover-API-only Top-Layer = weaker overlay than dropdown (no body-portal fallback).
6. **Dead helper/error tokens (low, safe-local)** — declared but never rendered.
7. **a11y note** — `aria-autocomplete`/`aria-activedescendant` present (better than dropdown); `aria-busy` missing.
8. **0 adoption** — promote in a real "choose or create" feature or formally retire.

## Verification
🟢 code-verified against both `.tsx` + `.component.ts` + `combobox.tokens.css` (read 2026-06-03). Corrections to G7/G8/a11y are 🟢 code-verified.
