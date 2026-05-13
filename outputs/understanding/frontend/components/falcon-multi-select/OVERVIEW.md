# falcon-multi-select — OVERVIEW

## Component purpose

Multi-value selector with chips, searchable list, "+N more" overflow pill, optional tri-state "Select all", and clear-all affordance. Sibling specialist to `<falcon-angular-dropdown>` for multi.

## Business / UI use case

- Permission picker (multiple permissions per role).
- Tag picker.
- Multi-category / multi-region selection in filter panels.
- Any UI requiring multi-value selection from a closed list of options.

## When to use it / when NOT to use it

**Use it for:** any multi-value picker where the list is known up-front.

**Do NOT use it for:**
- Single-select → `<falcon-angular-dropdown>`.
- Free-text-plus-options combo → `<falcon-angular-combobox>`.
- Hierarchical / tree-shaped multi-select → `<falcon-angular-tree>`.

## Status

**ACTIVE / PREFERRED.** Replaces PrimeNG `<p-multiSelect>`. Legacy `<falcon-multiselect>` (libs/falcon/src/shared-ui/lib/components/falcon-multiselect/) is deprecated — migrate to this.

## Source file paths

| Layer | Path |
|---|---|
| Angular wrapper TS | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-multi-select/falcon-multi-select.component.ts` |
| Angular wrapper HTML | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-multi-select/falcon-multi-select.component.html` |
| Stencil Shadow | `libs/falcon-ui-core/src/components/falcon-multi-select/falcon-multi-select.tsx` |
| Stencil Light | `libs/falcon-ui-core/src/components/falcon-multi-select-tw/falcon-multi-select-tw.tsx` |
| Tokens | `libs/falcon-ui-tokens/src/components/multi-select.tokens.css` |
| Tailwind helper | `libs/falcon-ui-core/src/tailwind/multi-select-tailwind-classes.ts` |

## Selectors

| Layer | Tag |
|---|---|
| Angular | `falcon-angular-multi-select` |
| Stencil Shadow | `<falcon-multi-select>` |
| Stencil Light | `<falcon-multi-select-tw>` |

## Known consumers

- Filter panels across admin-console + management-console.
- Permission selectors inside user/role wizards.
- Playground demo route.

## Related components

- Sibling: `<falcon-angular-dropdown>` (single-select).
- Composes a panel similar to `<falcon-angular-dropdown>` internally.
- Legacy peer: `<falcon-multiselect>` (deprecated).

## Ownership

`libs/falcon-ui-core`.
