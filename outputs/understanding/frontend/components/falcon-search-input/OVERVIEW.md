# falcon-search-input — OVERVIEW

## Component purpose

Specialised, search-styled input that **composes `<falcon-input variant="search" type="search">`** (Shadow) / `<falcon-input-tw variant="search" type="search">` (Light) and adds three behaviours the base input does not own: a built-in **300 ms debounce**, an auto-appearing **clear-X** (driven by `clearable={!!value}`), and an optional consumer-driven **loading spinner**. It is the canonical example of the architect's **§5.12.2 "Specialized composed input"** rule — a thin Stencil component whose only job is to add search-specific behaviour on top of the flagship input primitive (`[CODE] falcon-search-input.tsx:1-3,108-139`).

## Business / UI use case

- Header / topbar global search bars across host-shell + admin-console + management-console.
- Filter-panel search and data-table global filters (narrow a large record set as-you-type).
- Lookup pickers inside wizards / drawers (filter long reference lists before selection).
- Anywhere a "search-as-you-type" UX is required with throttled backend calls.

> `[CODE]` Grep 2026-06-03 found **zero application consumers** — the component is built, exported, and showcase-ready but not yet wired into any feature. The use cases above are its intended home, not verified live usage (see USAGE Consumer Sweep + GAPS_AND_UPGRADES Wave findings).

## When to use it / when NOT to use it

**Use it for:** any search-style field that needs a magnifier affordance + debounce + clear + optional spinner.

**Do NOT use it for:**
- Free-text whose value is **saved** → `<falcon-angular-input>` (search-input's value is transient and there is no CVA).
- A search box that drops a panel of matching **suggestions** → `<falcon-angular-combobox>`.
- A single-select dropdown that has a **search field inside its panel** → `<falcon-angular-dropdown [searchable]="true">`.
- A labelled form field (label / helper / error) — search-input deliberately has none.
- An in-grid editable cell → `<falcon-angular-grid-input>`.

## Status

**ACTIVE / PREFERRED (Wave 5 specialised composition).** Built on the dual-render Stencil pattern. Not deprecated. **Zero adoption** today — usability-watch flag, not a blocker (`[CODE]` consumer grep 2026-06-03).

## Replaces

- `[INFERRED]` Native `<input type="search">` + hand-rolled `debounceTime` + manual clear button. No legacy PrimeNG search primitive exists to replace (PrimeNG has no dedicated search input).

## Source file paths

| Layer | Path |
|---|---|
| Angular wrapper TS | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-search-input/falcon-search-input.component.ts` |
| Angular wrapper HTML | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-search-input/falcon-search-input.component.html` |
| Angular wrapper CSS | **none** — wrapper applies layout via `@HostBinding('class')` `'block w-full'`, no `.component.css` file. |
| Angular barrel | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-search-input/index.ts` |
| Stencil Shadow source | `libs/falcon-ui-core/src/components/falcon-search-input/falcon-search-input.tsx` |
| Stencil Shadow CSS | `libs/falcon-ui-core/src/components/falcon-search-input/falcon-search-input.css` |
| Stencil Light source | `libs/falcon-ui-core/src/components/falcon-search-input-tw/falcon-search-input-tw.tsx` |
| Types | `libs/falcon-ui-core/src/components/falcon-search-input/falcon-search-input.types.ts` |
| Utils | **none** (no `*.utils.ts`). |
| Tailwind helper | `libs/falcon-ui-core/src/tailwind/search-input-tailwind-classes.ts` (single export: `falconSearchInputLoadingClasses()`). |
| Component token file | `libs/falcon-ui-tokens/src/components/search-input.tokens.css` (~22 lines — spinner only). |

## Selectors / tags

| Layer | Tag / selector |
|---|---|
| Angular selector | `falcon-angular-search-input` |
| Stencil Shadow tag | `<falcon-search-input>` |
| Stencil Light tag | `<falcon-search-input-tw>` |

## Known consumers (grep verified 2026-06-03)

- **None in application code.** `[CODE]` grep `falcon-angular-search-input` across `apps/` + `libs/falcon/` → 0 files; the only match outside `falcon-ui-core` is its own token file (`search-input.tokens.css`). See USAGE Consumer Sweep.

## Related components

- **Composes:** `<falcon-input variant="search">` (Shadow) / `<falcon-input-tw variant="search">` (Light) — search-input owns the debounce/clear/spinner shell; the actual field (border, focus ring, height, the `type="search"` magnifier behaviour) is the inherited input primitive (`[CODE]` falcon-search-input.tsx:114-127).
- **Sibling specialists** (do not compose, share the input surface): `<falcon-angular-combobox>` (suggestions), `<falcon-angular-dropdown [searchable]>` (in-panel search), `<falcon-angular-input>` (saved free-text).

## Ownership / responsibility

`libs/falcon-ui-core` (cross-framework). Owned by Falcon UI team. Token contract lives in `libs/falcon-ui-tokens` (spinner only; field tokens are the shared `--falcon-input-*` set).

## Verification
🟢 code-verified against `falcon-search-input.component.ts` + `.html` + `falcon-search-input.tsx` + `falcon-search-input-tw.tsx` + `search-input.tokens.css` (read 2026-06-03). Consumer count 🟢 grep-verified (0). "Replaces native search" 🔴 INFERRED.
