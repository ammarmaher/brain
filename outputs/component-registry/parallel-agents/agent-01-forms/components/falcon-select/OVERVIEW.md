# falcon-select — OVERVIEW

## Component purpose

**ALIAS** for `<falcon-angular-dropdown>`. Wave 5 naming alignment per architect spec §5.12.1 L1 "Select". The spec named this control "Select"; the platform shipped it as `<falcon-dropdown>` (intentional custom-popover, not native `<select>`). The select alias closes the naming gap without code duplication.

## Business / UI use case

Same as `<falcon-angular-dropdown>`. The alias exists purely so new code can use the spec-named selector.

## When to use it / when NOT to use it

**Use it for:**
- New code that wants to use the spec name "Select" instead of "Dropdown".

**Do NOT use it for:**
- Native `<select>` semantics — this is NOT a native select; it's a custom popover.

## Status

**ALIAS / ACTIVE.** Backward-compatible with `<falcon-angular-dropdown>` — both are the same class.

## Source paths

| Layer | Path |
|---|---|
| Angular wrapper barrel | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-select/index.ts` |
| Actual implementation | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-dropdown/falcon-dropdown.component.ts` |

The `index.ts` simply re-exports:

```ts
export {
  FalconAngularDropdownComponent as FalconAngularSelectComponent,
} from '../falcon-dropdown/falcon-dropdown.component';
export type { FalconDropdownOption as FalconSelectOption } from '../falcon-dropdown/falcon-dropdown.component';
```

## Selectors

| Layer | Tag |
|---|---|
| Angular | `falcon-angular-select` (when imported as the alias class) |
| Stencil Shadow | `<falcon-dropdown>` (same component renders) |
| Stencil Light | `<falcon-dropdown-tw>` |

## Known consumers

- Spec-aligned new code that prefers the "Select" name.

## Related components

- Identical to `<falcon-angular-dropdown>` — see that component's six files for full docs.

## Ownership

`libs/falcon-ui-core`.
