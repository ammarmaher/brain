# falcon-confirm-dialog — TOKENS

## Token file
`libs/falcon-ui-tokens/src/components/confirm-dialog.tokens.css`

29 lines — short because the component primarily inherits dialog tokens. Includes body padding, icon size, message font, action gap, button radius/padding/colors.

Token selector:
```css
:where(
  falcon-confirm-dialog, falcon-confirm-dialog-tw, falcon-angular-confirm-dialog,
  .falcon-confirm-dialog, [data-falcon-confirm-dialog],
  falcon-dialog, falcon-dialog-tw, falcon-angular-dialog, .falcon-dialog, [data-falcon-dialog]
)
```

Note: the selector includes BOTH the confirm-dialog tags AND the underlying dialog tags. This means the confirm-dialog tokens cascade through the composed dialog.

## Related Falcon theme tokens

| Confirm-dialog token | References |
|---|---|
| `--falcon-confirm-dialog-accept-bg` | `var(--color-falcon-teal-700, #124c52)` |
| `--falcon-confirm-dialog-accept-fg` | `var(--color-falcon-neutral-0)` |
| `--falcon-confirm-dialog-reject-bg` | `var(--color-falcon-neutral-100)` |
| `--falcon-confirm-dialog-reject-fg` | `var(--color-falcon-neutral-700)` |
| `--falcon-confirm-dialog-reject-border` | `var(--color-falcon-neutral-200)` |
| `--falcon-confirm-dialog-message-fg` | `var(--color-falcon-neutral-700)` |

## Tailwind utility guidance
- Apply layout utilities to projected body content.
- Token override for per-instance styling.

## Dark mode support
- Inherits from dialog substrate.
- Teal accept-bg unchanged in dark; neutral reject-bg flips.

## Density support
Via inherited `size` prop. Default `sm`.

## RTL support
Inherited from dialog substrate.

## Static style risks
- Button styling is hardcoded `<button class="falcon-confirm-btn">` rather than composing `<falcon-angular-button>`. The class string emits specific token references but isn't using the button design-system primitive.
- The token file uses fixed `12px`, `8px`, `4px` etc. — no per-density scaling.

## No CSS / no SCSS guidance
- Token file is the SSOT.

## Token usage cheat-sheet

| Concern | Token |
|---|---|
| Body gap | `--falcon-confirm-dialog-body-gap: 12px` |
| Body padding | `--falcon-confirm-dialog-body-padding: 8px 0` |
| Icon size | `--falcon-confirm-dialog-icon-size: 32px` |
| Message font-size | `--falcon-confirm-dialog-message-font-size: 14px` |
| Message color | `--falcon-confirm-dialog-message-fg` |
| Actions gap | `--falcon-confirm-dialog-actions-gap: 8px` |
| Actions padding-top | `--falcon-confirm-dialog-actions-padding-top: 4px` |
| Button padding | `--falcon-confirm-dialog-btn-padding: 8px 16px` |
| Button radius | `--falcon-confirm-dialog-btn-radius: 6px` |
| Button font-size | `--falcon-confirm-dialog-btn-font-size: 13px` |
| Button font-weight | `--falcon-confirm-dialog-btn-font-weight: 500` |
| Accept bg | `--falcon-confirm-dialog-accept-bg` |
| Accept fg | `--falcon-confirm-dialog-accept-fg` |
| Reject bg | `--falcon-confirm-dialog-reject-bg` |
| Reject fg | `--falcon-confirm-dialog-reject-fg` |
| Reject border | `--falcon-confirm-dialog-reject-border` |

## Per-instance override
```css
.danger-confirm {
  --falcon-confirm-dialog-accept-bg: var(--color-falcon-red-500);
  --falcon-confirm-dialog-accept-fg: #fff;
}
```

```html
<falcon-angular-confirm-dialog rootClass="danger-confirm" severity="danger" ...>
```
