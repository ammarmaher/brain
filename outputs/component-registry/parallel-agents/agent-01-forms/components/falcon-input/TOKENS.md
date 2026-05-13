# falcon-input — TOKENS

## Component token file

`libs/falcon-ui-tokens/src/components/input.tokens.css` (~204 lines).

The `:where(falcon-input, falcon-input-tw, falcon-angular-input, .falcon-input, [data-falcon-input])` selector ensures Shadow + Light + Angular host + utility-class consumers ALL read the same `--falcon-input-*` variables.

## Token categories (14 declared)

1. CONTAINER — `--falcon-input-width / min-width / max-width`.
2. LABEL — `--falcon-input-label-color`, `--falcon-input-label-color-error`, font family / size / weight / line-height, margin-bottom, cursor, required asterisk color.
3. SIZING — per `sm`/`md`/`lg`: height / padding-x / padding-y / font-size. Heights link to `--falcon-density-input-height-{sm,md,lg}`.
4. TYPOGRAPHY — font-weight, line-height, letter-spacing.
5. BACKGROUND — `bg`, `bg-hover`, `bg-focus`, `bg-error`, `bg-success`, `bg-warning`, `bg-disabled`, `bg-readonly`. Plus Wave 9.C `bg-filled`, `bg-filled-hover`, `bg-filled-focus`, `bg-ghost-hover` for appearance variants.
6. TEXT COLOR — `text-color`, `text-color-disabled`, `placeholder-color`.
7. BORDER — width, style, radius, plus `border-color-{idle,hover,focus,error,success,warning,disabled,readonly}`.
8. SHADOW — per state: `shadow`, `shadow-hover`, `shadow-focus` (3-stop teal halo), `shadow-error` (no halo + micro-drop), `shadow-success`, `shadow-warning`, `shadow-disabled`, `shadow-readonly`.
9. FOCUS RING — `ring-width`, `ring-color-focus`, `ring-color-error`, `ring-offset`.
10. PREFIX / SUFFIX — gap, color, size for both prefix + suffix slots.
11. HELPER TEXT — color, font-size, font-weight, margin-top, padding-x.
12. ERROR TEXT — color, font-size, font-weight, line-height, margin-top, padding-x.
13. CLEAR BUTTON — size, color, color-hover, bg, bg-hover, radius.
14. MOTION — transition-duration (150ms), transition-easing (ease).

## Related Falcon theme tokens (from `falcon-tailwind-tokens.css`)

| Falcon theme token | Used by input via |
|---|---|
| `--color-falcon-neutral-0..950` | Background / disabled / readonly. |
| `--color-falcon-teal-500` | Focus border (brand). |
| `--color-falcon-teal-alpha-12` | Focus ring color. |
| `--color-falcon-red-100 / 500 / 700` | Error background / border / text. |
| `--color-falcon-green-500` | Success border. |
| `--color-falcon-amber-500` | Warning border. |
| `--falcon-density-input-height-{sm,md,lg}` | Sizing. |
| `--falcon-density-input-padding-x-{sm,md,lg}` | Sizing. |
| `--falcon-radius-md` | Border radius. |
| `--falcon-spacing-1`, `--falcon-spacing-2` | Margins + gaps. |
| `--font-display`, `--falcon-font-family` | Label font. |
| `--font-weight-medium`, `--falcon-font-weight-normal` | Weights. |
| `--falcon-font-size-xs`, `--falcon-font-size-md`, `--falcon-font-size-xxs` | Type scale. |

## Tailwind utility guidance for this component

The Tailwind helper at `libs/falcon-ui-core/src/tailwind/input-tailwind-classes.ts` returns class strings that lean on the SAME `--falcon-input-*` tokens through arbitrary-value utilities. Consumers should NOT hand-roll Tailwind classes that override colors / radii / shadows — they should override tokens instead.

For host-side utility additions (responsive width, layout, etc.):

```html
<falcon-angular-input class="w-full max-w-sm md:max-w-md" ... />
```

Or pass extra wrapper utilities via `wrapperClass=""` (Tailwind path only).

## Dark mode support

Inherits from `:where(.app-dark, .app-dark *)` overrides in `falcon-tailwind-tokens.css` lines 385-451:

- Neutrals invert → input background flips from `#ffffff` to `#1a1a2e` / dark surface.
- Brand teal stays unchanged → focus ring color is consistent.
- Shadows strengthen → focus halo becomes slightly more visible against dark canvas.
- Geometry (height / padding / radius / motion) stays identical.

No per-input dark override is required — purely token-driven.

## Density support

Heights map to `--falcon-density-input-height-{sm,md,lg}` so density presets ripple through. To opt a single field into "compact":

```css
.compact-input { --falcon-input-height-md: var(--falcon-density-input-height-sm); }
```

## RTL support

Falcon theme handles RTL via `:where([dir='rtl'], [dir='rtl'] *)` overrides at the `libs/falcon-ui-tokens/src/rtl/` layer (referenced in `index.css`). Native `<input>` direction follows page direction. Prefix / suffix slots auto-mirror because the Tailwind helper uses `gap`-based flex which respects writing direction.

> NOT verified end-to-end in this audit — flag for Agent 5 (theme/tokens).

## Static style risks

- The Stencil Shadow CSS file `libs/falcon-ui-core/src/components/falcon-input/falcon-input.css` likely has rules referencing the same tokens. Token contract is fine, but if any hex / px is hardcoded in that file, mark as GAP.
- `falcon-input.component.css` in the Angular wrapper is only `:host { display: block; width: 100%; }` — no static risks.
- `add-client-special-input` token-override pattern is used in admin-console wizard — verified clean.

## No CSS / no SCSS guidance

- Tailwind utilities only in templates (`@source` paths catch them).
- Consumer per-instance overrides MUST mutate `--falcon-input-*` tokens via a host class + the consumer's CSS file. **Never hardcode hex or px inline.**
- Do not write component CSS rules in the consumer's `*.component.css` to style the input. Use token overrides only.

## Token usage by state

| State | Token(s) consumed |
|---|---|
| Border | `--falcon-input-border-color`, `--falcon-input-border-color-hover`, `--falcon-input-border-color-focus`, `--falcon-input-border-color-error`, `--falcon-input-border-color-success`, `--falcon-input-border-color-warning`, `--falcon-input-border-color-disabled`, `--falcon-input-border-color-readonly` |
| Radius | `--falcon-input-border-radius` |
| Shadow | `--falcon-input-shadow`, `--falcon-input-shadow-hover`, `--falcon-input-shadow-focus`, `--falcon-input-shadow-error`, `--falcon-input-shadow-success`, `--falcon-input-shadow-warning`, `--falcon-input-shadow-disabled`, `--falcon-input-shadow-readonly` |
| Spacing | `--falcon-input-padding-x-{sm,md,lg}`, `--falcon-input-padding-y-{sm,md,lg}`, `--falcon-input-gap`, `--falcon-input-helper-margin-top`, `--falcon-input-error-margin-top`, `--falcon-input-error-padding-x`, `--falcon-input-helper-padding-x` |
| Color (text) | `--falcon-input-text-color`, `--falcon-input-text-color-disabled`, `--falcon-input-placeholder-color`, `--falcon-input-label-color`, `--falcon-input-label-color-error`, `--falcon-input-required-color` |
| Color (background) | `--falcon-input-bg`, plus 7 state-specific variants + 4 appearance variants. |
| Hover | `--falcon-input-bg-hover`, `--falcon-input-border-color-hover`, `--falcon-input-shadow-hover` |
| Focus | `--falcon-input-bg-focus`, `--falcon-input-border-color-focus`, `--falcon-input-shadow-focus`, `--falcon-input-ring-color-focus`, `--falcon-input-ring-width`, `--falcon-input-ring-offset` |
| Error | `--falcon-input-bg-error`, `--falcon-input-border-color-error`, `--falcon-input-shadow-error`, `--falcon-input-ring-color-error`, `--falcon-input-error-color`, `--falcon-input-label-color-error` |
| Success | `--falcon-input-bg-success`, `--falcon-input-border-color-success`, `--falcon-input-shadow-success` |
| Warning | `--falcon-input-bg-warning`, `--falcon-input-border-color-warning`, `--falcon-input-shadow-warning` |
| Disabled | `--falcon-input-bg-disabled`, `--falcon-input-border-color-disabled`, `--falcon-input-shadow-disabled`, `--falcon-input-text-color-disabled` |
| Loading | _None observed in active source._ (Input has no built-in loading state. Compose externally if needed.) |
