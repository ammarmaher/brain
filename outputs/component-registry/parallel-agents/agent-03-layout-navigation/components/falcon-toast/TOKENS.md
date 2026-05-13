# falcon-toast — TOKENS

## Token file
`libs/falcon-ui-tokens/src/components/toast.tokens.css`

14 categories: container (host position), stack gap, toast container surface, severity icon colors, title/message font, dismiss button, action button, motion, focus ring, sizing, z-index, state, icon size, typography aliases.

Token selector:
```css
:where(falcon-toast, falcon-toast-tw, falcon-angular-toast, .falcon-toast, [data-falcon-toast])
```

## Related Falcon theme tokens

| Toast token | References |
|---|---|
| `--falcon-toast-bg` | `var(--color-falcon-neutral-0)` |
| `--falcon-toast-color` | `var(--color-falcon-neutral-900)` |
| `--falcon-toast-border-color` | `var(--color-falcon-neutral-200)` |
| `--falcon-toast-shadow` | `0 8px 24px rgba(0,0,0,0.10)` |
| `--falcon-toast-icon-success-bg` | `var(--color-falcon-green-100)` |
| `--falcon-toast-icon-success-color` | `var(--color-falcon-green-500)` |
| `--falcon-toast-icon-warning-bg` | `var(--color-falcon-amber-50)` |
| `--falcon-toast-icon-warning-color` | `var(--color-falcon-amber-500)` |
| `--falcon-toast-icon-error-bg` | `var(--color-falcon-red-100)` |
| `--falcon-toast-icon-error-color` | `var(--color-falcon-red-500)` |
| `--falcon-toast-icon-info-bg` | `#e0f2fe` (hardcoded — see notes) |
| `--falcon-toast-icon-info-color` | `#0284c7` (hardcoded — see notes) |

## Notes — info-severity colors are hardcoded
The token file (lines 50-51) explicitly notes:
```css
--falcon-toast-icon-info-bg: #e0f2fe; /* light sky-blue tint; no SSOT token — accepted gap; dark override in dark.css */
--falcon-toast-icon-info-color: #0284c7; /* sky blue; no SSOT token — accepted gap; dark override in dark.css */
```

**Risk:** these are the only hardcoded hex values in the toast tokens. A future palette addition (`--color-falcon-sky-*`) should replace them.

## Tailwind utility guidance
- Action button slot can use Tailwind freely.
- Toast geometry is token-driven.

## Dark mode support
- Surface inversion via neutral-0.
- Info icon colors NOT in dark map (per the comment) — accepted gap, dark.css override elsewhere.

## Density support
None (no `size` prop). Width is `--falcon-toast-min-width` / `--falcon-toast-max-width`.

## RTL support
- Host position uses `top-right`, `top-left`, etc. — physical, not logical.
- Toast content layout is symmetrical.

## Static style risks
- Info-severity hardcoded hex values (above).
- Action button styling references toast tokens — verify no drift with `<falcon-angular-button>`.

## No CSS / no SCSS guidance
- Token file is the SSOT.

## Token usage cheat-sheet

| Concern | Token |
|---|---|
| Host position offsets | `--falcon-toast-host-position-{top,bottom,start,end}` |
| Host padding | `--falcon-toast-host-padding: 8px` |
| Stack gap | `--falcon-toast-stack-gap: 10px` |
| Toast bg | `--falcon-toast-bg` |
| Toast border | `--falcon-toast-border-*` |
| Toast radius | `--falcon-toast-border-radius: 10px` |
| Toast shadow | `--falcon-toast-shadow` |
| Padding | `--falcon-toast-padding-{y,x}` |
| Gap | `--falcon-toast-gap: 10px` |
| Per-severity icon bg/color | `--falcon-toast-icon-{info,success,warning,error}-{bg,color}` |
| Title/message font | `--falcon-toast-{title,message}-*` |
| Dismiss button | `--falcon-toast-dismiss-*` |
| Action button | `--falcon-toast-action-*` |
| Motion | `--falcon-toast-motion-*` |
| Z-index | `--falcon-toast-z` |

## Per-instance override
```css
.brand-toast {
  --falcon-toast-bg: var(--color-falcon-teal-50);
  --falcon-toast-border-color: var(--color-falcon-teal-200);
  --falcon-toast-color: var(--color-falcon-teal-900);
}
```
