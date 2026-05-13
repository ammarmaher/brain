# falcon-card — TOKENS

## Token file
`libs/falcon-ui-tokens/src/components/card.tokens.css`

65 lines, 6 categories: layout, surface, typography, header, body, footer.

Token selector:
```css
:where(falcon-card, falcon-card-tw, falcon-angular-card, .falcon-card, [data-falcon-card])
```

## Related Falcon theme tokens

| Card token | References |
|---|---|
| `--falcon-card-bg` | `var(--color-white, #ffffff)` |
| `--falcon-card-fg` | `var(--color-falcon-neutral-800)` |
| `--falcon-card-border-color` | `var(--color-falcon-neutral-150)` |
| `--falcon-card-outlined-border-color` | `var(--color-falcon-neutral-200)` |
| `--falcon-card-header-fg` | `var(--color-falcon-neutral-900)` |
| `--falcon-card-subheader-fg` | `var(--color-falcon-neutral-600)` |
| `--falcon-card-footer-fg` | `var(--color-falcon-neutral-700)` |
| `--falcon-card-footer-border-color` | `var(--color-falcon-neutral-150)` |
| `--falcon-card-shadow` | `0 1px 3px 0 rgb(0 0 0 / 0.07), 0 1px 2px -1px rgb(0 0 0 / 0.07)` |

## Tailwind utility guidance
- Layout utilities on host: `class="block h-full"` for grid items.
- Width: `class="w-full max-w-md"` for constrained card width.
- Margin: free game.
- Do NOT add `bg-*` / `border-*` / `shadow-*` / `rounded-*` utilities on the host — they don't penetrate to the inner root.

## Dark mode support
- Card inherits dark-mode inversions from `--color-falcon-neutral-*` flips.
- `--falcon-card-bg` references `--color-white` which is NOT in the dark override map — light cards stay white-ish in dark mode unless the consumer overrides `--falcon-card-bg`.
- **Risk:** white-card-on-dark-bg works for high contrast but feels off for surface-color theming. Consider mapping `--falcon-card-bg` to a semantic surface token in dark mode.

## Density support
Via `size` prop. Token map:

| Token | sm | md | lg |
|---|---|---|---|
| radius | 6px | 8px | 14px |
| body padding | (token alias) | 16px | (token alias) |
| header padding | 12px / 16px (varies by size) | 16px 16px 12px | 24px / 24px 16px |
| font size | 13px | 14px | 15px |
| header font size | (legacy) | 14px | (legacy) |

The token file declares `--falcon-card-radius-sm: 6px` and `--falcon-card-radius-lg: 14px` but the body/header/footer padding tokens are size-fixed at `md`. The dual-render templates pick per-size padding via their helper functions.

## RTL support
Card is symmetrical. No per-side directional padding logic. RTL works via `direction: rtl` flip.

## Static style risks
- The wrapper template's `bodyClasses`/`headerClasses`/`footerClasses` `computed()` helpers hardcode Tailwind utility strings (`p-3`, `p-4`, `p-6`) — these are LEGACY pre-Stencil renderers. The current rendering goes through `<falcon-card-tw>` Stencil tag, which uses helper functions that consume tokens. Legacy code path can be removed.
- Header subheader `text-xs` hardcoded in `<falcon-card-tw>` source (line 39): `<p class="text-xs text-falcon-neutral-600 m-0">`. Should reference `--falcon-card-subheader-font-size` token (12px) — currently it's a hardcoded Tailwind class.

## No CSS / no SCSS guidance
- No `.scss` file should exist for cards.
- Token file is the single style SSOT.

## Token usage cheat-sheet

| Concern | Token |
|---|---|
| Radius (default size) | `--falcon-card-radius: 8px` |
| Radius small | `--falcon-card-radius-sm: 6px` |
| Radius large | `--falcon-card-radius-lg: 14px` |
| Border width | `--falcon-card-border-width: 1px` |
| Border color default | `--falcon-card-border-color` |
| Border color outlined | `--falcon-card-outlined-border-color` |
| Surface bg | `--falcon-card-bg` |
| Surface text | `--falcon-card-fg` |
| Shadow | `--falcon-card-shadow` |
| Header padding | `--falcon-card-header-padding` |
| Header title size | `--falcon-card-header-font-size: 14px` |
| Header title weight | `--falcon-card-header-font-weight: 600` |
| Subheader size | `--falcon-card-subheader-font-size: 12px` |
| Body padding | `--falcon-card-body-padding: 16px` |
| Footer padding | `--falcon-card-footer-padding: 12px 16px` |
| Footer border | `--falcon-card-footer-border-color` |
| Footer font size | `--falcon-card-footer-font-size: 12px` |

## Per-instance override
```css
.kpi-card {
  --falcon-card-radius: 14px;
  --falcon-card-shadow: 0 4px 12px rgba(13,63,68,0.06);
  --falcon-card-body-padding: 24px;
  --falcon-card-bg: var(--color-falcon-teal-tint, #eef3f4);
}
```

```html
<falcon-angular-card class="kpi-card" [header]="'Total revenue'">
  <strong class="text-2xl">$12,840</strong>
</falcon-angular-card>
```
