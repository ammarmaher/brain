# falcon-dialog — TOKENS

## Token file
`libs/falcon-ui-tokens/src/components/dialog.tokens.css`

14 categories: container, backdrop, panel, header, title, description, close button, body, footer, severity accent, position variants, focus ring, motion, z-index + state.

Token selector:
```css
:where(falcon-dialog, falcon-dialog-tw, falcon-angular-dialog, .falcon-dialog, [data-falcon-dialog])
```

## Related Falcon theme tokens

| Dialog token | References |
|---|---|
| `--falcon-dialog-backdrop-bg` | `var(--color-falcon-teal-alpha-18, rgba(13, 63, 68, 0.18))` |
| `--falcon-dialog-panel-bg` | `var(--color-falcon-neutral-0)` |
| `--falcon-dialog-panel-color` | `var(--color-falcon-neutral-900)` |
| `--falcon-dialog-panel-shadow` | `0 24px 60px rgba(0, 0, 0, 0.18)` |
| `--falcon-dialog-panel-border-radius` | `18px` |
| (severity accent overrides) | `var(--color-falcon-{green,amber,red}-...)` |

## Tailwind utility guidance
- Body slot content uses Tailwind freely.
- Don't add layout utilities to the dialog host.

## Dark mode support
- Neutrals invert; teal-alpha recomputes.
- Panel bg becomes dark in dark mode.
- Shadows strengthen.

## Density support
Via `size` prop:

| Token | sm | md | lg | xl | full |
|---|---|---|---|---|---|
| panel max-width | 420px | 560px | 720px | (TBD) | viewport |
| panel padding-block | 28px (default) | | | | |
| panel padding-inline | 36px (default) | | | | |

## RTL support
Symmetric layout. Backdrop blur applies uniformly. Close × button is top-right physically — RTL pages may want top-left placement (not currently controlled).

## Static style risks
- Token-driven.
- The Stencil source has a hardcoded `<svg>` for the close ×.

## No CSS / no SCSS guidance
- Token file is the SSOT.

## Token usage cheat-sheet

| Concern | Token |
|---|---|
| Backdrop bg | `--falcon-dialog-backdrop-bg` |
| Backdrop blur | `--falcon-dialog-backdrop-blur: 4px` |
| Panel bg | `--falcon-dialog-panel-bg` |
| Panel radius | `--falcon-dialog-panel-border-radius: 18px` |
| Panel shadow | `--falcon-dialog-panel-shadow` |
| Panel padding-block | `--falcon-dialog-panel-padding-block: 28px` |
| Panel padding-inline | `--falcon-dialog-panel-padding-inline: 36px` |
| Max-width sm/md/lg | `--falcon-dialog-panel-max-width-{sm,md,lg}` |
| Z-index | `--falcon-dialog-z` |
| Motion | `--falcon-dialog-transition-*` |

## Per-instance override
```css
.brand-dialog {
  --falcon-dialog-panel-border-radius: 24px;
  --falcon-dialog-panel-shadow: 0 30px 80px rgba(13,63,68,0.16);
  --falcon-dialog-backdrop-blur: 8px;
}
```
