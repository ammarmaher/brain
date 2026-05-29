---
type: falcon-component
component: Falcon Button
folder-name: falcon-angular-button
deprecated: false
primary-prds: []
created: 2026-05-15
---
*** Component note — Falcon Button ***
*** Brain Outputs SoT: C:\Falcon\Brain Outputs\understanding\frontend\components\falcon-angular-button\ ***

# Falcon Button

Navigation note. Brain Outputs holds the dossier.

## Dossier (linked)

- [OVERVIEW](../../outputs/understanding/frontend/components/falcon-angular-button/OVERVIEW.md)
- [API](../../outputs/understanding/frontend/components/falcon-angular-button/API.md)
- [USAGE](../../outputs/understanding/frontend/components/falcon-angular-button/USAGE.md)
- [TOKENS](../../outputs/understanding/frontend/components/falcon-angular-button/TOKENS.md)
- [GAPS_AND_UPGRADES](../../outputs/understanding/frontend/components/falcon-angular-button/GAPS_AND_UPGRADES.md)
- [DECISION](../../outputs/understanding/frontend/components/falcon-angular-button/DECISION.md)

## Pages using this component

- [[Organization Hierarchy]] — primary/secondary/icon actions on every section.

## Approved + pending patterns

- Global pattern (seed): [BUTTON_PATTERN.md](../../outputs/understanding/frontend/patterns/BUTTON_PATTERN.md).

## Related gaps

- See [GAP_REGISTRY.md](../../../Brain%20Outputs/understanding/pages/organization-hierarchy/GAP_REGISTRY.md) — filter by component `falcon-button`.

## Theming & Tailwind

- [[Tailwind CSS]] — library entry. Button is a canonical consumer of `--color-falcon-teal-700` and the focus-ring shadow token.
- [[Tailwind Falcon Alignment Scorecard]] — button-level interactive states (hover / focus-visible / active / disabled) flagged for standardization in Wave 1.
- [[Falcon Angular Wrapper Pattern]] — `<falcon-angular-button>` wraps `<falcon-button-tw>`; consumers should use `variant` / `size` props, not external classes.

## Visual difference reports

- [[FALCON_EYES_INDEX]] — filter by component `falcon-button`.

## Tags

#type/falcon-component

## Hubs

- [[COMPONENT_INDEX]] · [[FRONTEND_INDEX]] · [[GAPS_INDEX]] · [[FALCON_EYES_INDEX]]
