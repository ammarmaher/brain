# falcon-angular-wizard — TOKENS

## Token file path
- `libs/falcon-ui-tokens/src/components/wizard.tokens.css`

## Related Falcon theme tokens
From `libs/falcon-theme/src/falcon-tailwind-tokens.css`:
- `--color-falcon-teal-500` — Next/Finish primary button bg.
- `--color-falcon-neutral-200` — section dividers.
- `--color-falcon-neutral-900` — header text.
- `--color-falcon-neutral-500` — secondary text + Save Draft button.

## Tokens consumed indirectly
The wizard embeds `<falcon-stepper>` — so all 14 categories of stepper tokens apply (see `falcon-stepper/TOKENS.md`).

## Tailwind utility guidance
- The Stencil source uses raw CSS class names like `falcon-wizard-root`, `falcon-wizard-header`, `falcon-wizard-stepper`, `falcon-wizard-content`, `falcon-wizard-footer`, `falcon-wizard-footer-spacer`, `falcon-wizard-btn`, `falcon-wizard-btn--back`, `falcon-wizard-btn--next`, `falcon-wizard-btn--finish`, `falcon-wizard-btn--draft`.
- These are intended to be styled via tokens in `wizard.tokens.css` — not by adding Tailwind utilities post-hoc.
- Consumers SHOULD limit external Tailwind to the outer `<falcon-angular-wizard>` margins / max-width / shadow / radius.

## Dark mode support
- Audit needed. The Stencil class is small and doesn't have obvious dark-mode aware variables. Recommend adding overrides at the standard `@custom-variant dark` block in `falcon-tailwind-tokens.css`.

## Density support
- `size: 'sm' | 'md' | 'lg'` forwarded to the embedded stepper, but the wizard's own padding/margin do NOT scale with size.
- **Recommendation:** add `density: 'comfortable' | 'compact'` that reduces `--falcon-wizard-content-padding-y` and `--falcon-wizard-footer-padding-y`.

## RTL support
- The footer layout uses flexbox + `falcon-wizard-footer-spacer` that pushes Save Draft + Next to one side. In RTL, this flips naturally if no `start/end` margins are hardcoded.
- The Back button is on the left in LTR (start side). RTL should put it on the right (end side) — verify the CSS.

## Static style risks
- The footer button visual is owned by the Stencil's own CSS classes (`falcon-wizard-btn--back` / `--next` / `--finish` / `--draft`). These should consume tokens, not hardcoded values. Audit.

## No CSS / No SCSS guidance
- Stencil consumes `falcon-wizard.css`. No `*.component.scss` in the Angular wrapper.

## Token usage matrix per state (proposed — needs full audit of wizard.tokens.css)
| Element | Default | Hover | Focus | Disabled | Loading |
|---|---|---|---|---|---|
| Back button | `--falcon-wizard-back-bg`, `…-color` | `…-hover` | `…-focus` | `…-disabled-opacity` | — |
| Next/Finish button | `--falcon-wizard-next-bg` (teal-500) | `…-hover` (teal-600) | `…-focus-ring` | `…-disabled-opacity` | `…-busy-spinner` (proposed) |
| Save Draft button | `--falcon-wizard-draft-bg` | `…-hover` | `…-focus` | `…-disabled-opacity` | — |
| Content area | `--falcon-wizard-content-bg`, `…-padding-y`, `…-padding-x` | — | — | — | — |
| Footer row | `--falcon-wizard-footer-bg`, `…-padding-y`, `…-border-top` | — | — | — | — |
| Header row | `--falcon-wizard-header-bg`, `…-margin-bottom` | — | — | — | — |
