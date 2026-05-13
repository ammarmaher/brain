# falcon-button — TOKENS

## Token file
`libs/falcon-ui-tokens/src/components/button.tokens.css`

214 lines. Tokens grouped into 14 numbered sections covering container, sizing, typography, border, background, text-color, border-color, shadow / focus, icon, spinner, disabled, icon-only, full-width, motion.

The token selector is:
```css
:where(falcon-button, falcon-button-tw, falcon-angular-button, .falcon-button, [data-falcon-button]) { ... }
```

— so any of the three element forms (Shadow tag, Light tag, Angular wrapper) or the marker class / data-attribute receives the token contract.

## Related Falcon theme tokens (from `falcon-tailwind-tokens.css`)
The button tokens reference these theme primitives:

| Button token | References |
|---|---|
| `--falcon-button-primary-bg` | `var(--color-falcon-teal-500, #0d3f44)` |
| `--falcon-button-primary-bg-hover` | `var(--color-falcon-teal-600)` |
| `--falcon-button-primary-bg-active` | `var(--color-falcon-teal-700)` |
| `--falcon-button-secondary-bg` | `var(--color-falcon-neutral-0)` (white) |
| `--falcon-button-secondary-bg-hover` | `var(--color-falcon-neutral-100)` |
| `--falcon-button-secondary-border` | `var(--color-falcon-neutral-200)` |
| `--falcon-button-danger-bg` | `var(--color-falcon-red-500)` |
| `--falcon-button-danger-bg-active` | `var(--color-falcon-red-700)` |
| `--falcon-button-shadow-focus` | `rgba(13,63,68,0.18) 0 0 0 3px` (teal alpha) |
| `--falcon-button-shadow-focus-danger` | `rgba(220,38,38,0.22) 0 0 0 3px` (red alpha) |
| `--falcon-button-font-family` | `var(--font-display, var(--falcon-font-family))` |
| `--falcon-button-font-weight` | `var(--falcon-font-weight-semibold, 600)` |

## Tailwind utility guidance for this component
- DO NOT add color / border / padding / radius utilities to `<falcon-angular-button>` host. They will not propagate into the Shadow tree (Shadow mode) and the Light-DOM template emits its own classes already.
- Layout utilities on the parent container are fine: `flex items-center gap-2 justify-end` for action bars.
- Width utilities are fine in conjunction with `fullWidth=false`: `class="w-32"` to clamp to a fixed pill width.

## Dark mode support
Per `feedback_v02_theme_adopted.md`, dark mode tokens are declared in `:where(.app-dark, .app-dark *), :where(.dark, .dark *)` (lines 385-451 of `falcon-tailwind-tokens.css`). Buttons inherit dark by virtue of referencing `--color-falcon-teal-*` and `--color-falcon-neutral-*` — those flip per the theme map.

Specifically:
- Teal stays unchanged across modes (brand-intentional).
- Neutrals invert — secondary buttons' `bg-falcon-neutral-0` becomes `#1a1a2e` in dark.
- Focus halos remain teal alpha — the alpha-base recomputes to `rgba(105,142,146,..)` for contrast on dark canvas.

Verified there is NO button-specific dark-mode override in `button.tokens.css` — it relies entirely on theme-level neutral inversion. Acceptable.

## Density support
No density variant tokens declared (no `--falcon-button-density-compact-*` etc.). Density is selected via the `size` prop (`sm` / `md` / `lg`). The token map between sizes:

| Token | sm | md | lg |
|---|---|---|---|
| height | 34px | 38px | 44px |
| padding-x | 18px | 16px | 20px |
| gap | 6px | 8px | 10px |
| font-size | 12.5px | 13px | 14px |
| icon-size | 14px | 16px | 18px |
| spinner-size | 14px | 16px | 18px |

## RTL support
- Token file has no explicit RTL section.
- Button is symmetrical (label center, icon-start before label, icon-end after) — flips naturally under `direction: rtl` from `libs/falcon-ui-tokens/src/themes/rtl.css`.
- ONE caveat: arrow icons inside `icon-start` / `icon-end` don't auto-flip. Caller's responsibility to use `transform: scaleX(-1)` or RTL-aware icon glyphs.

## Static style risks
None observed in the active source. Both Shadow and Light renderers consume tokens through helper modules:
- Shadow: `falcon-button.css` is referenced via `styleUrl: 'falcon-button.css'` — would need separate audit to confirm zero hardcodes, but the styleUrl filename suggests pure token consumption.
- Light: `falcon-button-tw.tsx` uses `falconButtonRootClasses` from `tailwind/button-tailwind-classes.ts` which would emit Tailwind utility classes referencing custom-property tokens.

One in-source `bg-gradient-to-b`-style escape is in `<falcon-angular-popup>` (consumer of the button) — NOT in the button itself.

## No CSS / no SCSS guidance
- Do NOT create an external `.scss` file for buttons. The wrapper's `falcon-button.component.css` is referenced via `styleUrl` but should remain empty (Angular requires the file path but the rules go through tokens).
- Do NOT use `::ng-deep` to reach into the Shadow DOM — break-glass and forbidden.

## Token usage cheat-sheet

| Concern | Token |
|---|---|
| Border-radius (all variants share) | `--falcon-button-border-radius: 10px` |
| Border-radius full-pill | Override `--falcon-button-border-radius: 999px` |
| Border-width | `--falcon-button-border-width: 1px` |
| Shadow on focus | `--falcon-button-shadow-focus` |
| Shadow on focus danger | `--falcon-button-shadow-focus-danger` |
| Spacing inside button (gap between icon + label) | `--falcon-button-gap-{sm,md,lg}` |
| Spacing X-padding | `--falcon-button-padding-x-{sm,md,lg}` |
| Color primary bg | `--falcon-button-primary-bg` |
| Color primary text | `--falcon-button-primary-text` |
| Hover bg | `--falcon-button-{variant}-bg-hover` |
| Active bg | `--falcon-button-{variant}-bg-active` |
| Disabled opacity | `--falcon-button-disabled-opacity: 0.5` |
| Disabled cursor | `--falcon-button-disabled-cursor: not-allowed` |
| Loading label opacity | `--falcon-button-loading-label-opacity: 0` |
| Loading spinner color | `--falcon-button-spinner-color: currentColor` |
| Loading spinner stroke | `--falcon-button-spinner-stroke-width: 2px` |
| Loading spinner track opacity | `--falcon-button-spinner-track-opacity: 0.25` |
| Motion duration | `--falcon-button-transition-duration: 150ms` |
| Motion easing | `--falcon-button-transition-easing: ease` |
| Icon-only square aspect | `--falcon-button-icon-only-size-{sm,md,lg}` |
| Full-width | `--falcon-button-full-width: 100%` |

## Per-instance override example
```css
.publish-button-tall {
  --falcon-button-height-md: 48px;
  --falcon-button-padding-x-md: 24px;
  --falcon-button-border-radius: 999px;
}
```

Then:
```html
<falcon-angular-button class="publish-button-tall" [label]="'Publish'" />
```

## Standing rules to enforce
- No raw `px` values inside Tailwind classes on the host (e.g. `class="h-[38px]"`) — use size prop.
- No inline `style="--falcon-button-..."` — declare overrides in a tokens layer.
- The `:where()` token selector keeps specificity at 0, so any class-level override on the host wins. Use that — don't reach for `!important`.
