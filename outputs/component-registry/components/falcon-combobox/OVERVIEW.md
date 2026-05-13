# falcon-combobox — OVERVIEW

## Component purpose

Free-text-plus-suggestions combo box. Users can either type free text (if `allowFreeText`) or pick from filtered suggestions. Distinguished from `<falcon-angular-dropdown>` (closed list, no free text) and `<falcon-angular-multi-select>` (multi-value).

## Business / UI use case

- "Choose or create" patterns (e.g. tag picker that supports new-tag entry).
- Search-and-pick fields where the canonical list is large but the user may know an exact value.
- Address / company / contact pickers that fall back to free-text when no match.

## When to use it / when NOT to use it

**Use it for:**
- Free-text combo with autocomplete suggestions.
- "Pick or type-new" workflows (recreate the legacy `creatable: true` pattern from earlier registry).

**Do NOT use it for:**
- Pure single-select → `<falcon-angular-dropdown>`.
- Multi-select → `<falcon-angular-multi-select>`.
- Plain search → `<falcon-angular-search-input>`.

## Status

**ACTIVE.** Wave 9.H added Stencil + Angular wrapper. Newer than dropdown/multi-select — fewer real-world consumers yet.

## Source paths

| Layer | Path |
|---|---|
| Angular wrapper | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-combobox/falcon-combobox.component.ts` |
| Stencil Shadow | `libs/falcon-ui-core/src/components/falcon-combobox/falcon-combobox.tsx` |
| Stencil Light | `libs/falcon-ui-core/src/components/falcon-combobox-tw/falcon-combobox-tw.tsx` |
| Tokens | `libs/falcon-ui-tokens/src/components/combobox.tokens.css` |
| Tailwind helper | `libs/falcon-ui-core/src/tailwind/combobox-tailwind-classes.ts` |

## Selectors

| Layer | Tag |
|---|---|
| Angular | `falcon-angular-combobox` |
| Stencil Shadow | `<falcon-combobox>` |
| Stencil Light | `<falcon-combobox-tw>` |

## Known consumers

- Playground demo route.
- Wave 9.H integration in admin-console (verify with grep).

## Related components

- Sibling: `<falcon-angular-dropdown>`, `<falcon-angular-multi-select>`.
- Composes search-input + dropdown panel internally.

## Ownership

`libs/falcon-ui-core`.
