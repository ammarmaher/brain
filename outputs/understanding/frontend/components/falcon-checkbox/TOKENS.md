# falcon-checkbox — TOKENS

## Component token file

`libs/falcon-ui-tokens/src/components/checkbox.tokens.css` (~182 lines).

Selector chain (gate-12-compliant, scoped under the component — NOT `:root`):

```css
:where(falcon-checkbox, falcon-checkbox-tw, falcon-angular-checkbox, .falcon-checkbox, [data-falcon-checkbox]) { … }
```

Shadow + Light + Angular host all read the same `--falcon-checkbox-*` variables. (The checkbox is not portaled, so `.falcon-overlay-container` is NOT in the chain — correct.)

## Token categories (14 declared, by header)

1. **CONTAINER** — width / inline display.
2. **LABEL** — color, font, gap, margin, required-marker color.
3. **SIZING** — per size: box dimensions (`--falcon-checkbox-size-{sm,md,lg}` = 14/16/18px), label font, row gap.
4. **TYPOGRAPHY** — label font-weight, line-height.
5. **BACKGROUND** — box paint by state: default / hover / focus / checked / indeterminate / error / disabled / readonly.
6. **TEXT COLOR** — label color by state (default / disabled / error).
7. **BORDER** — width (1.5px), style, radius (`--falcon-checkbox-border-radius` = 4px) + color by state (idle `#c7ced4` → teal on hover/checked).
8. **SHADOW / FOCUS RING** — focus halo width + color (default + error variants).
9. **CHECKMARK** — color (white default), stroke-width, viewport size, transition.
10. **INDETERMINATE BAR** — color, width, height, radius (the horizontal "—" for mixed).
11. **HELPER TEXT** — color, font, margin.
12. **ERROR TEXT** — color, font, margin.
13. **GROUP** — orientation gap (vertical + horizontal) + group label. *(These overlap the `checkbox-group.tokens.css` file, which also scopes `falcon-checkbox` — see falcon-checkbox-group TOKENS.)*
14. **MOTION** — transition duration + easing (`0.12s all` from inventory §5).

## Related Falcon theme tokens

| Falcon theme token | Used by checkbox via |
|---|---|
| `--color-falcon-teal-500` (`#124c52`) | Checked background + border + accent. |
| `--color-falcon-neutral-200` / `#c7ced4` | Idle border. |
| `--color-falcon-neutral-0` (`#ffffff`) | Check glyph color. |
| `--color-falcon-neutral-500` | Disabled glyph / helper text. |
| `--color-falcon-red-500/700` | Error border + error text. |
| `--falcon-radius-xs` | Box corner (≈4px). |

## Tailwind utility guidance for this component

The Tailwind helper `libs/falcon-ui-core/src/tailwind/checkbox-tailwind-classes.ts` resolves every visual property through `--falcon-checkbox-*` tokens (its header: "every visual property reads from `--falcon-checkbox-*` … the Stencil Shadow CSS reads the SAME tokens"). Use `rowClass` / `boxClass` / `labelClass` for path-specific layout tweaks only; override **tokens**, not Tailwind colors.

## Dark mode support

Token-driven — brand teal stays constant; border/label colors shift via neutral inversion in `falcon-tailwind-tokens.css`. No per-checkbox dark override needed.

## Density support

Box dimensions scale with the `size` input (`--falcon-checkbox-size-{sm,md,lg}`).

## RTL support

The label sits inline-end of the box and flips automatically via flex direction inheritance — `[CODE]` checkbox.tokens.css:44 ("RTL flips automatically").

## Static style risks

- The Stencil Shadow CSS (`falcon-checkbox.css`, ~9KB) reads the tokens; the inline check + indeterminate-bar SVGs are hardcoded shapes (acceptable — they are geometry, not theme).
- The Angular wrapper `falcon-checkbox.component.css` is layout-only (`:host { display: inline-block }` + child passthrough) — no static risk.
- No raw-hex/px in templates. Token VALUES use raw px/hex inside `var(--token, #fallback)` fallbacks — design SSOT, acceptable.

## No CSS / no SCSS guidance

- Tailwind utilities only in templates. Per-instance overrides via a host class + `--falcon-checkbox-*` mutation (the wallet allocation-table pattern). Never hardcode hex/px.

## Token usage by state

| State | Token(s) consumed |
|---|---|
| Unchecked | `--falcon-checkbox-bg`, `--falcon-checkbox-border-color` |
| Hover | `--falcon-checkbox-bg-hover`, `--falcon-checkbox-border-color-hover` |
| Checked | `--falcon-checkbox-bg-checked`, `--falcon-checkbox-border-color-checked`, `--falcon-checkbox-check-color` |
| Indeterminate | `--falcon-checkbox-bg-indeterminate`, `--falcon-checkbox-indeterminate-color`, `--falcon-checkbox-indeterminate-width/height/radius` |
| Focus | `--falcon-checkbox-ring-color-focus`, `--falcon-checkbox-ring-width`, `--falcon-checkbox-ring-offset` |
| Error | `--falcon-checkbox-border-color-error`, `--falcon-checkbox-error-color` |
| Disabled | `--falcon-checkbox-bg-disabled`, `--falcon-checkbox-border-color-disabled`, `--falcon-checkbox-text-color-disabled`, `--falcon-checkbox-check-color-disabled` |
| Loading | _None — checkbox has no loading state._ |

## Verification
🟢 code-verified against checkbox.tokens.css (read 2026-06-03) — category list + key token names (`-size-*`, `-border-radius`) corrected to match source. gate-12 scope (no `:root`, no overlay-container) 🟢 confirmed.
