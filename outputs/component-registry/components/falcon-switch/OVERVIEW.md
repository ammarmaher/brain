# falcon-switch — OVERVIEW

## Component purpose

On/off toggle with three coexisting visual variants: `dot-knob` (default — sliding knob), `hidden-input` (knobless flat pill), and `channel-pill` (left/right text labels inside the track). CVA-supported. Built atop a real native `<input type="checkbox">` with `role="switch"` + `aria-checked`.

## Business / UI use case

- Feature toggles / preferences (the canonical use).
- Quick on/off in tables, settings, filter panels.
- "Enabled" boolean indicators on cards.

## When to use it / when NOT to use it

**Use it for:** any boolean control where a switch metaphor (visual on/off) is preferred to a checkbox.

**Do NOT use it for:**
- Form-level acceptance ("I agree") → `<falcon-angular-checkbox>` (semantics + visuals match).
- Mutually-exclusive choice → `<falcon-angular-radio>` / radio-group.

## Status

**ACTIVE / PREFERRED.** Replaces PrimeNG `<p-inputSwitch>`.

## Source paths

| Layer | Path |
|---|---|
| Angular wrapper | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-switch/falcon-switch.component.ts` |
| Angular HTML | `.../falcon-switch.component.html` |
| Stencil Shadow | `libs/falcon-ui-core/src/components/falcon-switch/falcon-switch.tsx` |
| Stencil Light | `libs/falcon-ui-core/src/components/falcon-switch-tw/falcon-switch-tw.tsx` |
| Tokens | `libs/falcon-ui-tokens/src/components/switch.tokens.css` |

## Selectors

| Layer | Tag |
|---|---|
| Angular | `falcon-angular-switch` |
| Stencil Shadow | `<falcon-switch>` |
| Stencil Light | `<falcon-switch-tw>` |

## Known consumers

- Settings pages (admin + management consoles).
- Filter panels' boolean toggles.
- Table row activate/deactivate.

## Related components

- Sibling: `<falcon-angular-checkbox>`, `<falcon-angular-radio>`.

## Ownership

`libs/falcon-ui-core`.
