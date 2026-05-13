# falcon-checkbox — OVERVIEW

## Component purpose

Single boolean checkbox with optional indeterminate state, label, helper, error, and Falcon size + state contract. CVA-based.

## Business / UI use case

- Single "I agree" / "remember me" / boolean toggle inside forms.
- Header tri-state "Select all" indicator in tables (used internally by `<falcon-angular-multi-select>` + `<falcon-angular-table>`).
- Compose primitive for `<falcon-angular-checkbox-group>`.

## When to use it / when NOT to use it

**Use it for:** any standalone boolean form control with a label.

**Do NOT use it for:**
- Multiple checkboxes sharing a single value → `<falcon-angular-checkbox-group>`.
- Switch / toggle (visual switch metaphor) → `<falcon-angular-switch>`.
- Radio (mutually exclusive) → `<falcon-angular-radio>` / `<falcon-angular-radio-group>`.

## Status

**ACTIVE / PREFERRED.** Replaces PrimeNG `<p-checkbox>` and native `<input type=checkbox>`.

## Source paths

| Layer | Path |
|---|---|
| Angular wrapper | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-checkbox/falcon-checkbox.component.ts` |
| Angular HTML | `.../falcon-checkbox.component.html` |
| Stencil Shadow | `libs/falcon-ui-core/src/components/falcon-checkbox/falcon-checkbox.tsx` |
| Stencil Light | `libs/falcon-ui-core/src/components/falcon-checkbox-tw/falcon-checkbox-tw.tsx` |
| Tokens | `libs/falcon-ui-tokens/src/components/checkbox.tokens.css` |
| Tailwind helper | `libs/falcon-ui-core/src/tailwind/checkbox-tailwind-classes.ts` |

## Selectors

| Layer | Tag |
|---|---|
| Angular | `falcon-angular-checkbox` |
| Stencil Shadow | `<falcon-checkbox>` |
| Stencil Light | `<falcon-checkbox-tw>` |

## Known consumers

- Wizard forms (admin + management organization-hierarchy pages).
- `<falcon-angular-checkbox-group>` internal composition.
- `<falcon-angular-table>` header tri-state.
- Filter panels.

## Related components

- Composed by: `<falcon-angular-checkbox-group>`.
- Sibling: `<falcon-angular-switch>` (different visual metaphor).

## Ownership

`libs/falcon-ui-core`.
