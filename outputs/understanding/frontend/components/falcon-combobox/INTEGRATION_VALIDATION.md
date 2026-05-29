# falcon-combobox — Integration & Validation Layer

> Layer 3 of 3. UI → `OVERVIEW.md`. Business → `BUSINESS.md`.

## Owning backend module(s)
**None.** `[CODE] falcon-combobox.tsx` — the component is purely presentational; it owns no data. Its suggestion list (`items`) is whatever business reference data the parent flow feeds it. `[INFERRED]` In a real adoption the owning module would be whichever service supplies the suggestions (Commerce categories, Identity roles, etc.) — undetermined today because there are 0 consumers (`[CODE] GAPS_AND_UPGRADES.md` Wave 7).

## Backend wiring
| Source | Mechanism | Backend module | Notes |
|---|---|---|---|
| `items` (suggestions) | bound `@Input() items` from parent | (parent flow's module) | `[CODE] falcon-combobox.component.ts:49` — static array; component never fetches. |
| async suggestions | `(filterChange)` → parent observable → re-feed `[items]` | (parent flow's module) | `[CODE] falcon-combobox.component.ts:68,92-95` — `filterChange` emits the query string; the parent is responsible for the HTTP call and re-binding `items`. |
| selected value | CVA write of `string` into the parent form | (parent flow's module) | `[CODE] falcon-combobox.component.ts:80-90` — combobox emits the value only. |

`[CODE] falcon-combobox.tsx:197-201` — the Stencil component debounces `filterChange` internally by **250 ms** before emitting `falconComboboxFilter`. The wrapper's `GAPS_AND_UPGRADES.md` G7 calls debounce "not built in" — that is **CODE-DERIVED CORRECTION**: a 250 ms debounce *is* present in the Stencil layer (`falcon-combobox.tsx:197`). What is missing is a *configurable* `debounceMs` input on the Angular wrapper.

## Validation rules (V-*)
| V-rule | Field | Trigger | Error code / message |
|---|---|---|---|
| (none) | — | — | `[CODE]` No `V-*` rule binds to this component — 0 consumers. |

`[CODE] falcon-combobox.tsx:165-169` — the only built-in "validation" is `allowFreeText`: with it `false`, an unmatched query cannot be committed (`value` stays `''`). This is an *input gate*, not a `V-*` rule. `[CODE] GAPS_AND_UPGRADES.md` G2 — the wrapper has **no `state`/`errorMessage` input**, so it cannot itself render a validation failure — a consuming flow must wrap it in `<falcon-form-field>` for error markup.

## PES keys gating this component
| PES key | Action | Effect when denied |
|---|---|---|
| (none) | — | The combobox has no PES key. `[CODE] falcon-combobox.component.ts` — `disabled` is driven only by CVA `setDisabledState`; there is no imperative `[disabled]` input (`[CODE] GAPS_AND_UPGRADES.md` G3). A PES-gated parent must disable the form *control*, which propagates via CVA. |

## State / signal pattern
`[CODE] falcon-combobox.component.ts:73-74` — wrapper holds two signals: `value` (`signal<string>`) and `disabled` (`signal<boolean>`). CVA: `writeValue` sets `value`; `registerOnChange` fires on select/clear; `setDisabledState` sets `disabled`. `[CODE] falcon-combobox.component.ts:85-103` — three event handlers (`handleSelect`, `handleFilter`, `handleClear`) bridge Stencil CustomEvents into CVA writes + `@Output`s.
`[CODE] falcon-combobox.tsx:46-50` — Stencil holds its own `@State`: `open`, `query`, `activeIndex`, `resolvedId`. Filtering is a computed getter `filteredItems` (`falcon-combobox.tsx:87-91`) — case-insensitive `label.includes(query)`.

## Skeleton ↔ app-wrapper layering
- **Stencil skeleton** — `[CODE] falcon-combobox.tsx` `<falcon-combobox>` (Shadow DOM) and `[CODE] falcon-combobox-tw.tsx` `<falcon-combobox-tw>` (Light DOM, Tailwind). Pure presentational; full WAI-ARIA combobox pattern (`role=combobox` on input, `role=listbox` on panel).
- **Angular wrapper** — `[CODE] falcon-combobox.component.ts` `<falcon-angular-combobox>`: CVA + tag-switcher. `ngOnInit` calls `defineFalconTwComponent('falcon-combobox')` to register the web component on demand.
- Per `feedback_library_skeleton_app_api` — suggestions are fetched by the app/state layer; the library never calls HTTP.

## Integration gotchas
- `[CODE] falcon-combobox.component.ts:85,92` — **Stencil emits camelCase events** `falconComboboxSelect` / `falconComboboxFilter` / `falconComboboxClear` (`[CODE] falcon-combobox.tsx:53-60`). This **contradicts the existing `API.md` Outputs table**, which lists Stencil events as un-namespaced. CODE-DERIVED CORRECTION: the real Stencil event names are `falconComboboxFilter` / `falconComboboxSelect` / `falconComboboxClear`; the wrapper binds them in `falcon-combobox.component.html:24-26`.
- `[CODE] falcon-combobox.component.ts:51` — value type is `string` only (not `string | number` like dropdown) — a numeric option `value` will arrive as a string. (`[CODE] GAPS_AND_UPGRADES.md` G9.)
- `[CODE] falcon-combobox.tsx:197` — the 250 ms internal debounce means `filterChange` lags the keystroke; a parent driving async suggestions should NOT also debounce or it stacks.
- `[CODE] falcon-combobox.component.ts` — no `OnChanges`/`pushOptions` race handling — `items` is a plain `@Input` (the Stencil takes `items` as a prop directly via `[items]` binding in the template, not an attribute). This differs from `falcon-multi-select`/`falcon-dropdown` which need `pushOptions()`.
- `[CODE] GAPS_AND_UPGRADES.md` G8 — Stencil methods (`openPanel`/`closePanel`/`setFocus`) are **not** proxied on the wrapper; imperative control requires reaching the inner element.

## What it CAN do (integration)
- `[CODE] falcon-combobox.component.ts` — Participate in Reactive Forms / `ngModel` via CVA (writes `string`).
- `[CODE] falcon-combobox.component.ts:92` — Drive an async suggestion pipeline: emit `filterChange` per query, parent fetches and re-binds `items`.
- `[CODE] falcon-combobox.component.ts:55` — Show a `loading` indicator while the parent's async source resolves.

## What it CANNOT do (integration)
- `[CODE] falcon-combobox.component.ts` — It cannot fetch its own data — no service injection, no HTTP.
- `[CODE] GAPS_AND_UPGRADES.md` G1/G2/G3/G4 — It cannot render form-level error / helper / required / imperative-disabled — those inputs do not exist on the wrapper.
- `[CODE]` It cannot carry a numeric value — `string` only.
- `[CODE] GAPS_AND_UPGRADES.md` G8 — It cannot be opened/closed/focused imperatively from a parent — no proxied methods.

## Enhancement opportunities
- `[CODE] GAPS_AND_UPGRADES.md` G1/G2/G3/G4 — Add `helperText`, `errorMessage`, `state`, `required`, imperative `disabled` to bring it to form-control parity with `falcon-dropdown`.
- `[CODE] GAPS_AND_UPGRADES.md` G7 — Expose a configurable `debounceMs` on the wrapper (the Stencil already debounces 250 ms — make it tunable).
- `[CODE] GAPS_AND_UPGRADES.md` G8 — Proxy `openPanel`/`closePanel`/`setFocus`/`clear`.
- `[CODE] GAPS_AND_UPGRADES.md` G9 — Widen value to `string | number` for parity with dropdown.

## Verification
🟡 CODE-DERIVED from `[CODE] src/components/falcon-combobox/falcon-combobox.tsx` + `falcon-combobox.types.ts` + `[CODE] src/angular-wrapper/components/falcon-combobox/falcon-combobox.component.{ts,html}`. Two CODE-DERIVED CORRECTIONS to `API.md` (camelCase Stencil events; 250 ms debounce exists). No runtime feature exercises this component — 0 consumers (`[CODE] GAPS_AND_UPGRADES.md` Wave 7).
