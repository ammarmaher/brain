# falcon-checkbox-group — OVERVIEW

## Component purpose

Thin Angular layout + multi-binding wrapper around `<falcon-angular-checkbox>` instances. Manages a `selectedValues` array, toggling individual entries when the user clicks any child checkbox. Pure Angular component — no separate Stencil tag of its own.

## Business / UI use case

- Permission / role lists with checkbox-per-row.
- Filter panels with toggle-list checkboxes.
- "Choose multiple from a known list" scenarios where chip-based multi-select is too heavy.

## When to use it / when NOT to use it

**Use it for:**
- Multi-value boolean selection rendered as inline / stacked checkboxes (not in a dropdown panel).
- Always-visible option lists ≤ ~12 entries.

**Do NOT use it for:**
- Long lists requiring filter / search → `<falcon-angular-multi-select>`.
- Mutually exclusive choice → `<falcon-angular-radio-group>`.
- Single boolean → `<falcon-angular-checkbox>`.

## Status

**ACTIVE / PREFERRED.** Pure Angular wrapper composing many `<falcon-angular-checkbox>` instances. No Stencil-shadow equivalent exists (intentional — the group is layout logic, not a visual primitive).

## Source paths

| Layer | Path |
|---|---|
| Angular wrapper | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-checkbox-group/falcon-checkbox-group.component.ts` |
| Angular HTML | `.../falcon-checkbox-group.component.html` |
| Tokens | `libs/falcon-ui-tokens/src/components/checkbox-group.tokens.css` |

Note: a Stencil pair (`<falcon-checkbox-group>` + `<falcon-checkbox-group-tw>`) exists for cross-framework parity, but the Angular composition is the active path in Angular apps. The wrapper calls `defineFalconTwComponent('falcon-checkbox-group')` for the Tailwind variant of the underlying Stencil group (when applicable).

## Selectors

| Layer | Tag |
|---|---|
| Angular | `falcon-angular-checkbox-group` |
| Stencil Shadow | `<falcon-checkbox-group>` |
| Stencil Light | `<falcon-checkbox-group-tw>` |

## Known consumers

- Role permission selectors (admin-console user-role wizard).
- Filter panel sections.
- Settings pages with grouped toggles.

## Related components

- Composes `<falcon-angular-checkbox>` (via `checkedInput`).
- Alternative: `<falcon-angular-multi-select>` for dropdown-style multi.

## Ownership

`libs/falcon-ui-core`.
