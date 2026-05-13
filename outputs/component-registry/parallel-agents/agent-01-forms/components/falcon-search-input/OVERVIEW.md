# falcon-search-input — OVERVIEW

## Component purpose

Specialised search-styled input composing `<falcon-angular-input variant='search'>` (internally) with built-in 300ms debounce, clear-X affordance, and optional loading spinner. Wave 5 — per architect §5.12.2 "Specialized composed input" rule.

## Business / UI use case

- Header search bars across admin + management consoles.
- Filter panel search.
- Table global filter.
- Anywhere a "search-as-you-type" UX is needed.

## When to use it / when NOT to use it

**Use it for:** any search-style input with debounce + clear.

**Do NOT use it for:**
- Free-text non-search → `<falcon-angular-input>`.
- Combo with suggestions → `<falcon-angular-combobox>`.
- Dropdown with internal search → use dropdown's `searchable=true`.

## Status

**ACTIVE / PREFERRED.** Specialised composition, Wave 5.

## Source paths

| Layer | Path |
|---|---|
| Angular wrapper | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-search-input/falcon-search-input.component.ts` |
| HTML | `.../falcon-search-input.component.html` |
| Stencil Shadow | `libs/falcon-ui-core/src/components/falcon-search-input/falcon-search-input.tsx` |
| Stencil Light | `libs/falcon-ui-core/src/components/falcon-search-input-tw/falcon-search-input-tw.tsx` |
| Tokens | `libs/falcon-ui-tokens/src/components/search-input.tokens.css` |

## Selectors

| Layer | Tag |
|---|---|
| Angular | `falcon-angular-search-input` |
| Stencil Shadow | `<falcon-search-input>` |
| Stencil Light | `<falcon-search-input-tw>` |

## Known consumers

- Header search bars.
- Filter panel.
- Table global filter.
- Playground.

## Related components

- Composes `<falcon-angular-input variant='search'>`.
- Sibling: `<falcon-angular-input>`, `<falcon-angular-combobox>`.

## Ownership

`libs/falcon-ui-core`.
