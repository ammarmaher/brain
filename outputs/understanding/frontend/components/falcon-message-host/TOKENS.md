# falcon-message-host — TOKENS

## Token file
**None.** The host has no own token contract — it composes:
- `<falcon-angular-toast-host>` (uses `toast.tokens.css` for stack positioning).
- `<falcon-angular-toast>` per message (uses `toast.tokens.css` for surface, severity icons, etc.).

To customise visual appearance, override:
- `toast.tokens.css` for per-toast styling.

## Related Falcon theme tokens
None directly — all paint flows through the toast token contract.

## Tailwind utility guidance
- The host renders no visible content of its own — it's a positioning + rendering bridge.
- Layout / margin utilities on the host element are irrelevant (it's typically off-flow via the inner toast-host's fixed positioning).

## Dark mode support
- Inherits from toast.

## Density support
None directly.

## RTL support
- Inherits from toast-host position config (`top-right`, etc.). Position is physical, not logical.

## Static style risks
None directly — host has no visual rules of its own.

## No CSS / no SCSS guidance
- No token file.
- No external CSS.

## Token usage cheat-sheet
For visual customisation, see `falcon-toast/TOKENS.md`. The message-host doesn't have its own tokens.

## Per-instance override
Apply to the toast tokens — not the message-host.

```css
/* Global override that affects all toasts rendered by the message-host */
.app-shell {
  --falcon-toast-bg: var(--color-falcon-teal-50);
  --falcon-toast-border-color: var(--color-falcon-teal-200);
}
```

## Standing rule
- The message-host is a thin composition layer. Visual customisation lives in the toast / toast-host token files.
- Don't create a `message-host.tokens.css` unless the host gains its own visible chrome (e.g. a header / footer slot in a future upgrade).
