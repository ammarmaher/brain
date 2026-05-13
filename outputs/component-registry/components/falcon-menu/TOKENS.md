# falcon-menu — TOKENS

## Token file
`libs/falcon-ui-tokens/src/components/menu.tokens.css`

10 categories: container, trigger, panel, list, item, item icon, separator, motion, disabled state, focus ring.

Token selector:
```css
:where(falcon-menu, falcon-menu-tw, falcon-angular-menu, .falcon-menu, [data-falcon-menu])
```

## Related Falcon theme tokens

| Menu token | References |
|---|---|
| `--falcon-menu-panel-bg` | `var(--color-falcon-neutral-0)` |
| `--falcon-menu-panel-border-color` | `var(--color-falcon-neutral-200)` |
| `--falcon-menu-panel-shadow` | `0 8px 24px rgba(0, 0, 0, 0.08)` |
| `--falcon-menu-trigger-bg-hover` | `var(--color-falcon-neutral-100)` |
| `--falcon-menu-trigger-focus-ring-color` | `var(--color-falcon-teal-alpha-12)` |

## Tailwind utility guidance
- Trigger slot is fully consumer-controlled — apply Tailwind.
- Panel + item geometry come from tokens.
- Layout utilities on host (margin) work.

## Dark mode support
- Panel bg flips via neutral inversion.
- Shadow strengthens in dark.

## Density support
Via internal token defaults — no `size` prop yet (could be added).

## RTL support
- Menu list is symmetrical.
- External-anchor positioning uses `rect.right - panelWidth` to align right — under RTL pages this may want to flip to `rect.left + panelWidth`. Current source aligns to anchor's right edge always.

## Static style risks
- Panel `position: fixed` in anchor mode is set via inline `style` (escape hatch — required because anchor coordinates aren't expressible as CSS vars). Acceptable.

## Token usage cheat-sheet

| Concern | Token |
|---|---|
| Trigger height | `--falcon-menu-trigger-height: 32px` |
| Trigger padding | `--falcon-menu-trigger-padding-{x,y}` |
| Trigger bg hover | `--falcon-menu-trigger-bg-hover` |
| Trigger focus ring | `--falcon-menu-trigger-focus-ring-color/-width` |
| Panel bg | `--falcon-menu-panel-bg` |
| Panel border | `--falcon-menu-panel-border-*` |
| Panel radius | `--falcon-menu-panel-border-radius: 10px` |
| Panel shadow | `--falcon-menu-panel-shadow` |
| Panel min/max width | `--falcon-menu-panel-min-width: 180px`, `-max-width: 320px` |
| Panel max height | `--falcon-menu-panel-max-height: 320px` |
| Panel padding | `--falcon-menu-panel-padding-{y,x}` |
| Item padding, gap, font, colors | `--falcon-menu-item-*` |
| Separator | `--falcon-menu-separator-*` |
| Motion | `--falcon-menu-motion-*` |

## Per-instance override
```css
.compact-action-menu {
  --falcon-menu-item-padding-y: 6px;
  --falcon-menu-panel-min-width: 140px;
  --falcon-menu-panel-max-height: 240px;
}
```
