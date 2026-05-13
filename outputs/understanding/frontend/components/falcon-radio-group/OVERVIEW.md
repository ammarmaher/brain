# falcon-radio-group — OVERVIEW

## Component purpose

Layout + single-value-binding wrapper that renders multiple `<falcon-angular-radio>` instances sharing a name. Manages the selected value. CVA-based for Reactive Forms / ngModel.

## Business / UI use case

- "Pick one" choices in wizards and forms.
- Status / role / language one-of-many pickers.

## When to use it / when NOT to use it

**Use it for:** any mutually-exclusive multi-option choice rendered as a row/column of radios.

**Do NOT use it for:**
- Boolean → checkbox / switch.
- Long lists → `<falcon-angular-dropdown>`.
- Multi-value → `<falcon-angular-checkbox-group>` / `<falcon-angular-multi-select>`.

## Status

**ACTIVE / PREFERRED.** Wave 9.F backfill.

## Source paths

| Layer | Path |
|---|---|
| Angular wrapper | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-radio-group/falcon-radio-group.component.ts` |
| Angular HTML | `.../falcon-radio-group.component.html` |
| Stencil Shadow | `libs/falcon-ui-core/src/components/falcon-radio-group/falcon-radio-group.tsx` |
| Stencil Light | `libs/falcon-ui-core/src/components/falcon-radio-group-tw/falcon-radio-group-tw.tsx` |
| Tokens | `libs/falcon-ui-tokens/src/components/radio-group.tokens.css` |

## Selectors

| Layer | Tag |
|---|---|
| Angular | `falcon-angular-radio-group` |
| Stencil Shadow | `<falcon-radio-group>` |
| Stencil Light | `<falcon-radio-group-tw>` |

## Known consumers

- Wizard forms (admin + management).
- Status pickers in filter panels.
- Settings pages.

## Related components

- Composes `<falcon-angular-radio>` (via `checkedInput`).
- Alternative: `<falcon-angular-dropdown>` for long lists.

## Ownership

`libs/falcon-ui-core`.
