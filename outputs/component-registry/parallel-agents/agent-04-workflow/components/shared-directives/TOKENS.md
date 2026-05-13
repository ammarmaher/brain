# Shared directives — TOKENS

## Token file path
- _None._ The directives have no per-component token file.

## Related Falcon theme tokens (consumed via injected CSS)
- `--color-falcon-red-500` — error text color (inline-styled in `FalconFormValidateDirective`).
- `--validation-font-size` — error message font size (CSS variable consumed via inline `style.fontSize`).

## Tailwind utility guidance
- The directives are DOM-mutation only — they don't render CSS. They add class names like `.falcon-error`, `.falcon-required`, `.falcon-control-invalid`, `.falcon-label-invalid` and expect the consumer CSS / theme to define these.

## Dark mode support
- Inherits via the consumer's theme.

## Density support
- _None._

## RTL support
- The injected `<small class="falcon-error">` uses `paddingLeft: 9px` (LTR-specific) — should be `paddingInlineStart` for RTL. Violation.

## Static style risks
- **High.** `FalconFormValidateDirective` writes inline styles using hard-coded `9px`, `3px`, `0rem` values for paddings + margins. Token violation.

## No CSS / No SCSS guidance
- Directives don't have CSS files. The styles must come from app-global theme.

## Token usage matrix per state
| Element | Token-driven? |
|---|---|
| `.falcon-error` text | Partially (`var(--color-falcon-red-500)` is via inline style — token name OK, application channel wrong) |
| `.falcon-required` asterisk | Class only — token via consumer CSS |
| `.falcon-control-invalid` border | Class only — token via consumer CSS |
| `.falcon-label-invalid` label color | Class only — token via consumer CSS |

## Recommendation
- Define `.falcon-error`, `.falcon-required`, `.falcon-control-invalid`, `.falcon-label-invalid` in `falcon-tailwind-tokens.css` with full token contracts.
- Strip inline styles from `FalconFormValidateDirective` — use the class-name approach only.
