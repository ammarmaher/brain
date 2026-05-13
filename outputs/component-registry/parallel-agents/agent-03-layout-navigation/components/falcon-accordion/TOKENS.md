# falcon-accordion — TOKENS

## Token file
`libs/falcon-ui-tokens/src/components/accordion.tokens.css`

14 categories: container, item, header, chevron, description, panel body, separator, motion, focus ring, sizing, typography, icon, helper/error, disabled.

Token selector:
```css
:where(falcon-accordion, falcon-accordion-tw, falcon-angular-accordion, .falcon-accordion, [data-falcon-accordion])
```

## Related Falcon theme tokens

| Accordion token | References |
|---|---|
| `--falcon-accordion-bg` | `var(--color-falcon-neutral-0)` |
| `--falcon-accordion-border-color` | `var(--color-falcon-neutral-200)` |
| `--falcon-accordion-item-bg-hover` | `var(--color-falcon-neutral-50)` |
| `--falcon-accordion-item-bg-expanded` | `var(--color-falcon-neutral-50)` |

## Tailwind utility guidance
- Layout utilities on host (margin, width).
- Inside panel content — full Tailwind freedom.
- Don't override item / header / chevron styling via utilities.

## Dark mode support
- Inherits via neutral inversion.

## Density support
Via `size` prop. Token map per size for header padding (excerpt from token file lines 46-50):

| Token | sm | md | lg |
|---|---|---|---|
| header padding-y | 8px | 12px | 16px |
| header padding-x | 12px | 16px | (declared per md) |

## RTL support
- Chevron typically rotates in-place — no per-direction logic.
- Symmetrical layout.

## Static style risks
- Token-driven. Chevron SVG is hardcoded but uses `stroke="currentColor"` so color follows the host text color.

## No CSS / no SCSS guidance
- Token file is the SSOT.

## Token usage cheat-sheet

| Concern | Token |
|---|---|
| Container bg | `--falcon-accordion-bg` |
| Container border | `--falcon-accordion-border-{color,width}` |
| Container radius | `--falcon-accordion-border-radius: 8px` |
| Item bg default | `--falcon-accordion-item-bg: transparent` |
| Item bg hover | `--falcon-accordion-item-bg-hover` |
| Item bg expanded | `--falcon-accordion-item-bg-expanded` |
| Item bg disabled | `--falcon-accordion-item-bg-disabled` |
| Header padding (per size) | `--falcon-accordion-header-padding-{y,x}-{sm,md,lg}` |
| Chevron size, rotation, transition | `--falcon-accordion-chevron-*` |

## Per-instance override
```css
.faq-accordion {
  --falcon-accordion-border-radius: 12px;
  --falcon-accordion-header-padding-y-md: 16px;
  --falcon-accordion-item-bg-hover: var(--color-falcon-teal-tint);
}
```
