# falcon-tooltip — TOKENS

## Token file
`libs/falcon-ui-tokens/src/components/tooltip.tokens.css`

14 categories: container, trigger, panel, typography, arrow, placement offset, interactive, motion, focus ring, z-index, disabled, color aliases, enter/exit, breakpoint fallback.

Token selector:
```css
:where(falcon-tooltip, falcon-tooltip-tw, falcon-angular-tooltip, .falcon-tooltip, [data-falcon-tooltip])
```

## Related Falcon theme tokens

| Tooltip token | References |
|---|---|
| `--falcon-tooltip-panel-bg` | `var(--color-falcon-neutral-900, #1a1a1a)` — dark panel |
| `--falcon-tooltip-panel-color` | `var(--color-falcon-neutral-0)` — white text |
| `--falcon-tooltip-panel-shadow` | `0 4px 12px rgba(0, 0, 0, 0.18)` |
| `--falcon-tooltip-offset` | `8px` (gap between trigger and tooltip) |

## Tailwind utility guidance
- Trigger child can use any Tailwind.
- Tooltip panel uses tokens — don't override via host.

## Dark mode support
- Tooltip uses neutral-900 / neutral-0 — flips per dark mode (neutral-900 becomes white, neutral-0 becomes dark — but this would reverse the tooltip color). Verify the dark map preserves the dark-on-light intent.
- Specifically: in dark mode, `--color-falcon-neutral-900` becomes `#ffffff` (per the theme map). That would make tooltip bg white and text dark — semantic flip, may or may not be desired.

## Density support
None (no `size` prop).

## RTL support
- Placement is physical (`top`, `right`, etc.) — not logical.
- Under RTL, `right` and `left` placements may want to flip. Currently the consumer must manage this.

## Static style risks
- Panel `transform` is JS-set (escape hatch, documented).
- `panel-bg: #1a1a1a` hardcoded fallback in token file — acceptable.

## Token usage cheat-sheet

| Concern | Token |
|---|---|
| Panel bg | `--falcon-tooltip-panel-bg` (default neutral-900) |
| Panel text | `--falcon-tooltip-panel-color` |
| Panel padding | `--falcon-tooltip-panel-padding-{x,y}` |
| Panel radius | `--falcon-tooltip-panel-border-radius: 6px` |
| Panel shadow | `--falcon-tooltip-panel-shadow` |
| Panel max-width | `--falcon-tooltip-panel-max-width: 240px` |
| Panel font-family | `--falcon-tooltip-panel-font-family` |
| Panel font-size | `--falcon-tooltip-panel-font-size: 11.5px` |
| Arrow size, color | `--falcon-tooltip-arrow-*` |
| Offset between trigger and panel | `--falcon-tooltip-offset: 8px` |
| Z-index | `--falcon-tooltip-z` |
| Motion duration / easing | `--falcon-tooltip-motion-*` |
| Trigger cursor | `--falcon-tooltip-trigger-cursor: help` |
| Trigger outline | `--falcon-tooltip-trigger-outline: none` |

## Per-instance override
```css
.brand-tooltip {
  --falcon-tooltip-panel-bg: var(--color-falcon-teal-700);
  --falcon-tooltip-offset: 12px;
  --falcon-tooltip-panel-max-width: 320px;
}
```
