# falcon-drawer — TOKENS

## Token file
`libs/falcon-ui-tokens/src/components/drawer.tokens.css`

12 categories: container, overlay, panel, side widths, edge heights, header, title, close button, body, focus ring, motion, z-index.

Token selector:
```css
:where(falcon-drawer, falcon-drawer-tw, falcon-angular-drawer, .falcon-drawer, [data-falcon-drawer])
```

## Related Falcon theme tokens

| Drawer token | References |
|---|---|
| `--falcon-drawer-overlay-bg` | `var(--color-falcon-teal-alpha-18, rgba(13, 63, 68, 0.18))` |
| `--falcon-drawer-panel-bg` | `var(--color-falcon-neutral-0, #ffffff)` |
| `--falcon-drawer-panel-color` | `var(--color-falcon-neutral-900)` |
| `--falcon-drawer-panel-shadow` | `0 24px 60px rgba(0, 0, 0, 0.18)` |

## Tailwind utility guidance
- Don't touch the panel layout via host utilities — width/position is token-driven per `position` + `size`.
- Apply padding utilities INSIDE the body slot (`<div class="p-6">`), not on the drawer host.

## Dark mode support
- Surface tokens inherit dark via `--color-falcon-neutral-0` flip → drawer bg becomes dark `#1a1a2e` automatically.
- Backdrop teal-alpha is mode-aware via the teal-alpha token system.
- Shadow strengthens in dark via the theme override.

## Density support
Via `size` prop. Token map (side anchors right/left):

| Token | sm | md | lg | xl |
|---|---|---|---|---|
| width | 320px | 480px | 640px | 800px |

Top/bottom (edge) anchors:

| Token | sm | md | lg | xl |
|---|---|---|---|---|
| height | 240px | 360px | 480px | 640px |

## RTL support
- `position="right"` and `position="left"` are physical, not logical — they don't swap under RTL by default.
- Token file has per-position border-radius (e.g. `--falcon-drawer-panel-border-radius-right: 18px 0 0 18px`) — flipping for RTL requires overriding the per-position radius.
- Slide direction comes from `transform: translateX(±100%)` — also physical.

**Note:** for proper RTL, prefer `position="end"` / `position="start"` semantics — NOT yet supported. Workaround: page-level RTL switch sets `position` dynamically.

## Static style risks
- Backdrop `backdrop-filter: blur(4px)` — heavy. Token-controlled, can disable per instance.
- Drawer panel-shadow is a fixed `0 24px 60px rgba(0,0,0,0.18)` value — no per-mode reference. Acceptable.

## No CSS / no SCSS guidance
- Drawer's Angular wrapper has a `falcon-drawer.component.css` placeholder. Keep empty.
- Token file is the SSOT.

## Token usage cheat-sheet

| Concern | Token |
|---|---|
| Panel bg | `--falcon-drawer-panel-bg` |
| Panel text | `--falcon-drawer-panel-color` |
| Panel shadow | `--falcon-drawer-panel-shadow` |
| Side width sm | `--falcon-drawer-side-width-sm: 320px` |
| Side width md | `--falcon-drawer-side-width-md: 480px` |
| Side width lg | `--falcon-drawer-side-width-lg: 640px` |
| Side width xl | `--falcon-drawer-side-width-xl: 800px` |
| Edge height sm/md/lg/xl | `--falcon-drawer-edge-height-{sm,md,lg,xl}` |
| Panel radius right | `--falcon-drawer-panel-border-radius-right: 18px 0 0 18px` |
| Panel radius left | `--falcon-drawer-panel-border-radius-left: 0 18px 18px 0` |
| Panel radius top | `--falcon-drawer-panel-border-radius-top: 0 0 18px 18px` |
| Panel radius bottom | `--falcon-drawer-panel-border-radius-bottom: 18px 18px 0 0` |
| Overlay bg | `--falcon-drawer-overlay-bg` (teal alpha 18) |
| Overlay blur | `--falcon-drawer-overlay-blur: 4px` |
| Overlay opacity | `--falcon-drawer-overlay-opacity: 1` |
| Header padding-block | `--falcon-drawer-header-padding-block: 16px` |
| Close × size, color, etc. | `--falcon-drawer-close-*` |
| Body padding | `--falcon-drawer-body-padding-block/-inline` |
| Motion | `--falcon-drawer-transition-*` |
| Z-index | `--falcon-drawer-z` |

## Per-instance override
```css
.add-user-drawer {
  --falcon-drawer-side-width-md: 560px;
  --falcon-drawer-overlay-blur: 8px;
  --falcon-drawer-panel-border-radius-right: 24px 0 0 24px;
  --falcon-drawer-panel-shadow: 0 30px 80px rgba(13,63,68,0.18);
}
```
