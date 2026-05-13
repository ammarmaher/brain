# falcon-select — API

## Selectors

- Angular class alias: `FalconAngularSelectComponent` (aliases `FalconAngularDropdownComponent`).
- Angular HTML selector: the underlying component's selector is `falcon-angular-dropdown` — `<falcon-angular-select>` does NOT exist as a tag. The alias is at the TS class level only.

## Import

```ts
import { FalconAngularSelectComponent, FalconSelectOption } from '@falcon/ui-core';
// Both names point to the same class as FalconAngularDropdownComponent + FalconDropdownOption
```

To use in a template, the tag remains `<falcon-angular-dropdown>`. The alias is a TS convenience for matching the spec name in code.

## Inputs, Outputs, types

**Identical to `<falcon-angular-dropdown>`.** See `../falcon-dropdown/API.md` for the full surface.

## CVA

YES — same as dropdown.

## Methods

None proxied — same as dropdown.

## Slots / template inputs

None on wrapper — same as dropdown.

## Constraints

- The HTML selector is still `falcon-angular-dropdown` — the alias doesn't change the tag.
- Importing `FalconAngularSelectComponent` brings in `FalconAngularDropdownComponent` under a renamed export.
- All gaps / upgrades for dropdown apply equally to select.

## Accessibility

Same as dropdown.
