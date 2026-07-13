# falcon-select — API

> Sweep-refreshed 2026-06-03 (B04). The alias barrel is a flagged DEAD CANDIDATE (see GAPS). API surface = `<falcon-angular-dropdown>` verbatim.

## Selectors

- Angular class alias: `FalconAngularSelectComponent` (aliases `FalconAngularDropdownComponent`).
- Angular HTML selector: the underlying component's selector is `falcon-angular-dropdown` — **`<falcon-angular-select>` does NOT exist as a tag.** The alias is at the TS class level only.

## Import

```ts
import { FalconAngularSelectComponent, FalconSelectOption } from '@falcon/ui-core';
// Both names point to the same class as FalconAngularDropdownComponent + FalconDropdownOption
```

`[CODE]` `falcon-select/index.ts`:
```ts
export { FalconAngularDropdownComponent as FalconAngularSelectComponent } from '../falcon-dropdown/falcon-dropdown.component';
export type { FalconDropdownOption as FalconSelectOption } from '../falcon-dropdown/falcon-dropdown.component';
```

To use in a template the tag remains `<falcon-angular-dropdown>`. The alias is a TS convenience for matching the spec name — and is itself flagged for removal.

## Inputs, Outputs, types

**Identical to `<falcon-angular-dropdown>`.** See `../falcon-dropdown/API.md` for the full surface (24 wrapper `@Input`s incl. the `disabled` property setter + `errorText` quirk, 3 wrapper outputs, `FalconDropdownOption` type, the `slot="options"`-Shadow-only behavior, etc.).

## CVA / Reactive Forms

YES — same `NG_VALUE_ACCESSOR` provider as dropdown (it IS the dropdown class).

## Methods

None proxied — same gap as dropdown (G6 there).

## Slots / template inputs

Same as dropdown: `slot="icon-left"` both paths; `slot="options"` Shadow-path only; no per-option `ng-template`.

## Constraints

- The HTML selector is still `falcon-angular-dropdown` — the alias doesn't change the tag.
- Importing `FalconAngularSelectComponent` brings in `FalconAngularDropdownComponent` under a renamed export (one class, no double cost).
- All gaps / upgrades for dropdown apply equally.
- The alias is a DEAD CANDIDATE (`index.ts:1`) — do not add new imports of it.

## Accessibility

Same as dropdown (incl. the missing `aria-activedescendant` gap A2 — see `../falcon-dropdown/API.md` Accessibility).

## Verification
🟢 code-verified against `falcon-select/index.ts` (read 2026-06-03). Surface inherited from `../falcon-dropdown/API.md`. 🟢 RE-VERIFIED 2026-06-03 (W1-b): `falcon-select/index.ts` confirmed a pure `export { FalconAngularDropdownComponent as FalconAngularSelectComponent }` re-export with NO `.component.ts` of its own; DEAD-CANDIDATE banner-comment present at line 1. The barrel `angular-wrapper/index.ts:16` does `export * from './components/falcon-select'`. Accurate — no corrections.
