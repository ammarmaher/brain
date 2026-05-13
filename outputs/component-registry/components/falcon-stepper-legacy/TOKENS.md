# falcon-stepper (LEGACY) — TOKENS

## Token file path
- _None._ The legacy bespoke stepper does NOT have a corresponding `*.tokens.css` file in `libs/falcon-ui-tokens/src/components/`. The visual SSOT is the legacy `falcon-stepper.component.scss` file alongside the component.

## Related Falcon theme tokens (consumed via arbitrary values)
From `libs/falcon-theme/src/falcon-tailwind-tokens.css`, referenced in the template/SCSS:
- `--color-falcon-neutral-150` — bg border-t color (footer row).
- (Likely also referenced in SCSS but not audited deeply): `--color-falcon-teal-500`, `--color-falcon-neutral-200`, `--color-falcon-neutral-500`, `--color-falcon-neutral-900`.

## Tailwind utility guidance
- The template uses Tailwind utilities for layout (flex, gap, padding) but the dot/track/label visuals come from SCSS — these are tokens-violation territory.
- For migration, the entire visual layer maps onto the new `stepper.tokens.css` 14-category contract — no additional tokens are needed.

## Dark mode support
- **Missing.** No dark mode rules in the SCSS.

## Density support
- **None.** Single density.

## RTL support
- Uses `inset-inline-start` percentages for dot positioning (good — flips in RTL).
- Arrow-key handler absent so no RTL flip concern.

## Static style risks
- **High.** The SCSS file is the SSOT for visual values — that itself is the violation. Every hex / px in it is a hardcoded value.
- The template's inline `var(--color-falcon-neutral-150,#e5e7eb)` is consumed directly — the fallback hex is the static style risk.

## No CSS / No SCSS guidance
- **The SCSS file violates this rule.** It is the most prominent SCSS file under `libs/falcon/src/shared-ui/lib/components/`.
- **Recommendation:** delete this SCSS during migration. Do NOT add any new tokens scoped to this legacy component.

## Token usage matrix per state
- _Not applicable._ Tokens are not used for this legacy component beyond the few `--color-falcon-neutral-150` references.
- The migration target (Falcon UI core stepper) has a full 14-category token contract — see `falcon-stepper/TOKENS.md`.
