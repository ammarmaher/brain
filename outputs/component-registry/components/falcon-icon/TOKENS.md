# falcon-icon — TOKENS

## Token file
`libs/falcon-ui-tokens/src/components/icon.tokens.css`

2 categories: sizing + color. Trivially short (31 lines).

Token selector:
```css
:where(falcon-icon, falcon-icon-tw, falcon-angular-icon, .falcon-icon, [data-falcon-icon])
```

## Related Falcon theme tokens

| Icon token | References |
|---|---|
| `--falcon-icon-size-xs` | `var(--falcon-icon-xs, 12px)` |
| `--falcon-icon-size-sm` | `var(--falcon-icon-sm, 14px)` |
| `--falcon-icon-size-md` | `var(--falcon-icon-md, 16px)` |
| `--falcon-icon-size-lg` | `var(--falcon-icon-lg, 20px)` |
| `--falcon-icon-size-xl` | `var(--falcon-icon-xl, 24px)` |
| `--falcon-icon-color` | `currentColor` |

The `--falcon-icon-{xs,sm,md,lg}` parent tokens are declared in `libs/falcon-theme/src/falcon-tailwind-tokens.css` as semantic aliases for the icon scale.

## Tailwind utility guidance
- Color: apply `text-falcon-{family}-{shade}` on the parent (icon inherits via `currentColor`).
- Margin: apply on the parent or wrapper.
- Size: use the `size` prop, NOT Tailwind utilities.

## Dark mode support
- Color inherits — no explicit dark override needed in the icon token file.
- The parent text color flips per dark mode automatically via the global theme.

## Density support
Via `size` prop:

| Size | Tokenized | Default |
|---|---|---|
| xs | `--falcon-icon-xs` | 12px |
| sm | `--falcon-icon-sm` | 14px |
| md | `--falcon-icon-md` | 16px |
| lg | `--falcon-icon-lg` | 20px |
| xl | `--falcon-icon-xl` | 24px |

## RTL support
- Icons aren't directionally aware by default.
- Arrows / chevrons need explicit `transform: scaleX(-1)` under RTL — currently caller's responsibility.

## Static style risks
- The icon font itself is loaded from `libs/falcon-theme/src/styles/falcon-icons.css` — that file declares the `@font-face` with the woff/ttf path. Production builds bundle the font.

## Token usage cheat-sheet

| Concern | Token |
|---|---|
| Size xs / sm / md / lg / xl | `--falcon-icon-size-{xs,sm,md,lg,xl}` (driven by `data-size`) |
| Color | `--falcon-icon-color: currentColor` (inherits) |

## Per-instance override
```css
.brand-icon {
  --falcon-icon-color: var(--color-falcon-teal-500);
  --falcon-icon-size-md: 18px;  /* override md size */
}
```

```html
<falcon-angular-icon class="brand-icon" name="check" size="md" />
```

## Standing rule
- Always set color on the **parent** element (uses `currentColor` inheritance) — not via inline `style`.
- For semantic colors that change with theme/dark mode, use Falcon palette tokens (`text-falcon-red-500`, etc.) rather than hex values.
