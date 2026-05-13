# falcon-avatar — TOKENS

## Token file
`libs/falcon-ui-tokens/src/components/avatar.tokens.css`

57 lines, 5 categories: sizing, typography (for initials), shape, surface, status dot.

Token selector:
```css
:where(falcon-avatar, falcon-avatar-tw, falcon-angular-avatar, .falcon-avatar, [data-falcon-avatar])
```

## Related Falcon theme tokens

| Avatar token | References |
|---|---|
| `--falcon-avatar-bg` | `var(--color-falcon-teal-500, #124c52)` |
| `--falcon-avatar-fg` | `var(--color-falcon-neutral-50, #ffffff)` |
| `--falcon-avatar-status-ring-color` | `var(--color-falcon-neutral-50, #ffffff)` |
| `--falcon-avatar-status-online` | `var(--color-falcon-green-500, #10b981)` |
| `--falcon-avatar-status-offline` | `var(--color-falcon-neutral-400, #9ca3af)` |
| `--falcon-avatar-status-busy` | `var(--color-falcon-red-500, #ef4444)` |
| `--falcon-avatar-status-away` | `var(--color-falcon-amber-500, #f59e0b)` |
| `--falcon-avatar-font-family` | `var(--font-sans, system-ui, sans-serif)` |

## Tailwind utility guidance
- Margin on host is fine.
- Don't use Tailwind for sizing — use `size` prop.
- Color the initials text via the token, not via parent color.

## Dark mode support
- Status dot ring is white (`--color-falcon-neutral-50`) — flips per dark mode automatically.
- Background `var(--color-falcon-teal-500)` is teal and stays unchanged in dark mode.
- Initials fg is white.

## Density support
Via `size` prop:

| Token | xs | sm | md | lg | xl |
|---|---|---|---|---|---|
| size | 24px | 32px | 40px | 48px | 64px |
| font-size (initials) | 10px | 12px | 16px | 20px | 26px |

## RTL support
- Status dot is bottom-right physically — should ideally be inline-end (bottom-end). Current implementation: physical right.

## Static style risks
- Status dot ring width and color hardcoded as tokens — overridable but not directly via per-instance.

## Token usage cheat-sheet

| Concern | Token |
|---|---|
| Size default | `--falcon-avatar-size: 40px` |
| Size xs/sm/lg/xl | `--falcon-avatar-size-{xs,sm,lg,xl}` |
| Font-family | `--falcon-avatar-font-family` |
| Font-size default | `--falcon-avatar-font-size: 16px` |
| Font-size per size | `--falcon-avatar-font-size-{xs,sm,lg,xl}` |
| Font-weight | `--falcon-avatar-font-weight: 600` |
| Circle radius | `--falcon-avatar-radius: 999px` |
| Square radius | `--falcon-avatar-square-radius: 8px` |
| Background | `--falcon-avatar-bg` (default teal-500) |
| Foreground (initials) | `--falcon-avatar-fg` (default neutral-50) |
| Status dot size | `--falcon-avatar-status-size: 10px` |
| Status dot ring width | `--falcon-avatar-status-ring-width: 2px` |
| Status dot ring color | `--falcon-avatar-status-ring-color` |
| Status online/offline/busy/away colors | `--falcon-avatar-status-{online,offline,busy,away}` |

## Per-instance override
```css
.client-avatar {
  --falcon-avatar-bg: var(--color-falcon-brand-aramco);
  --falcon-avatar-fg: white;
  --falcon-avatar-square-radius: 4px;
}
```

```html
<falcon-angular-avatar class="client-avatar" shape="square" initials="AR" />
```
