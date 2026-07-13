# falcon-button — TOKENS

## Component token file
`libs/falcon-ui-tokens/src/components/button.tokens.css` (**278 lines** — recount 2026-06-03; the prior "214" was stale, the Wave 9.F variant token blocks added ~64 lines).

`[CODE]` The selector keeps specificity 0 (gate-12 compliant — scoped, NOT `:root`):
```css
:where(falcon-button, falcon-button-tw, falcon-angular-button, .falcon-button, [data-falcon-button]) { … }
```
so the Shadow tag, the Light tag, the Angular wrapper, the marker class, and the data-attr all receive the contract, and any host-class override wins.

## Token categories (14 declared)

`[CODE]` button.tokens.css:18-34 header enumerates:
1. CONTAINER — `display`, `min-width`.
2. SIZING (per size) — `height` (34/38/44), `padding-x` (18/16/20), `gap` (`sm` reads `--falcon-button-gap-x-sm`=6 px, `md` 12, `lg` 14 — Wave 19 bumped +4 px for icon breathing room), `font-size` (12.5/13/14).
3. TYPOGRAPHY — `font-family` (`var(--font-display, var(--falcon-font-family))`), `font-weight` (semibold 600), `line-height` (1), `letter-spacing` (normal).
4. BORDER — `width` (1 px), `style` (solid), `radius` (10 px).
5. BACKGROUND — by variant × state. **10 variant families** each carry `bg` / `bg-hover` / `bg-active` (+ `bg-disabled` on the core 5).
6. TEXT COLOR — by variant × state, incl. per-variant `*-text-disabled`.
7. BORDER COLOR — by variant × state.
8. SHADOW / FOCUS RING — `shadow` / `shadow-hover` (none), `shadow-focus` (3-stop teal halo `rgba(13,63,68,0.18) 0 0 0 3px`), `shadow-focus-danger` (red halo `rgba(220,38,38,0.22) 0 0 0 3px`).
9. ICON — `icon-size-{sm,md,lg}` (14/16/18 px).
10. SPINNER / LOADING — `spinner-size-{sm,md,lg}`, `spinner-stroke-width` (2 px), `spinner-color` (currentColor), `spinner-track-opacity` (0.25), `loading-label-opacity` (0).
11. DISABLED — `disabled-opacity` (0.5), `disabled-cursor` (not-allowed).
12. ICON-ONLY — `icon-only-size-{sm,md,lg}` aliased to the matching `height` token (square aspect).
13. FULL-WIDTH — `full-width` (100%).
14. MOTION — `transition-duration` (150 ms), `transition-easing` (ease).

> `[CODE]` Wave 9.F variant token blocks (button.tokens.css:156-220) add `outline`, `primary-dark`, `outline-primary-dark`, `outline-danger` families (bg/text/border × state) + `dashed` (Wave 13b, :118-220) `dashed-border-style: dashed`. The `dashed` variant overrides `border-style` to dashed via `--falcon-button-dashed-border-style`.

## Related Falcon theme tokens (from `falcon-tailwind-tokens.css`)

| Button token | References |
|---|---|
| `--falcon-button-primary-bg` | `var(--color-falcon-teal-500, #0d3f44)` |
| `--falcon-button-primary-bg-hover` | `var(--color-falcon-teal-600, #124c52)` |
| `--falcon-button-primary-bg-active` | `var(--color-falcon-teal-700, #0a3338)` |
| `--falcon-button-secondary-bg` | `var(--color-falcon-neutral-0, #ffffff)` |
| `--falcon-button-secondary-border` | `var(--color-falcon-neutral-200, #e5e7eb)` |
| `--falcon-button-danger-bg` | `var(--color-falcon-red-500, #dc2626)` |
| `--falcon-button-primary-dark-bg` | `var(--color-falcon-teal-700, #0d3f44)` |
| `--falcon-button-outline-text` | `var(--color-falcon-neutral-500, #9ca3af)` |
| `--falcon-button-outline-danger-border` | `var(--color-falcon-red-500, #dc2626)` |
| `--falcon-button-link-text` | `var(--color-falcon-neutral-600, #6b7280)` (Wave 19 — muted, was neutral-900) |
| `--falcon-button-link-text-hover` | `var(--color-falcon-teal-700, #0d3f44)` |
| `--falcon-button-font-family` | `var(--font-display, var(--falcon-font-family))` |
| `--falcon-button-font-weight` | `var(--falcon-font-weight-semibold, 600)` |

## Tailwind utility guidance for this component
- DO NOT add color / border / padding / radius utilities to the `<falcon-angular-button>` host — they won't propagate into the Shadow tree (Shadow mode) and the Light-DOM template emits its own classes anyway.
- Layout utilities on the parent container are fine: `flex items-center gap-2 justify-end` for action bars.
- `[CODE]` The `-tw` twin's classes come from `button-tailwind-classes.ts`, which reads the SAME `--falcon-button-*` tokens via Tailwind arbitrary values (e.g. `bg-[var(--falcon-button-primary-bg)]`). So overriding a token updates BOTH render paths identically.

## Dark mode support
Inherits from `:where(.app-dark, .app-dark *)` neutral inversion in `falcon-tailwind-tokens.css` (lines ~385-451). There is **no button-specific dark override** in `button.tokens.css` (verified 2026-06-03):
- Teal stays unchanged (brand-intentional) → primary stays teal in dark mode.
- Neutrals invert → secondary `bg-falcon-neutral-0` (#fff) flips to the dark surface.
- Focus halos remain teal/red alpha — contrast recomputes against the dark canvas.

## Density support
No density tokens. Density is selected via the `size` prop. Token map between sizes:

| Token | sm | md | lg |
|---|---|---|---|
| height | 34px | 38px | 44px |
| padding-x | 18px | 16px | 20px |
| gap | 6px | 12px | 14px |
| font-size | 12.5px | 13px | 14px |
| icon-size | 14px | 16px | 18px |
| spinner-size | 14px | 16px | 18px |

## RTL support
- Token file has no explicit RTL section. The button is symmetrical (label centered, icon-start before label, icon-end after) and flips naturally under `direction: rtl` from the `libs/falcon-ui-tokens/src/rtl/` layer.
- **Caveat:** directional arrow glyphs inside `icon-start` / `icon-end` do NOT auto-flip — caller uses `transform: scaleX(-1)` or RTL-aware glyphs. `[INFERRED]` not re-verified end-to-end this pass.

## Static style risks
- `[CODE]` Shadow CSS `falcon-button.css` (299 ln) is **token-only — VERIFIED clean 2026-06-03**: `@apply`-free structural rules (flex/box-sizing/transition-property list) + every visual value reads a `--falcon-button-*` var; the only literals are the spinner keyframe degrees (`rotate(0deg)`/`rotate(360deg)`) and the `750ms` spin duration (`[CODE]` :288, :295-298). No raw color hex.
- `[CODE]` `falcon-button.component.css` (26 ln) is host `display`/`vertical-align` + the `--full-width` block-flip — layout only, no static color risks.
- `[CODE]` `button-tailwind-classes.ts` reads only tokens through arbitrary values — no hardcoded colors. The only literal geometry is structural (`box-border`, `whitespace-nowrap`, `border-solid`).

## No CSS / no SCSS guidance
- Do NOT create a `.scss` for buttons. The wrapper's `falcon-button.component.css` carries only host layout — keep visual rules in tokens.
- Do NOT use `::ng-deep` to reach into the Shadow DOM — forbidden break-glass.

## Token usage by state

| State | Token(s) consumed |
|---|---|
| Border | `--falcon-button-{variant}-border`, `-border-hover`, `-border-active` (+ `--falcon-button-dashed-border-style: dashed`) |
| Radius | `--falcon-button-border-radius` (10 px) |
| Shadow | `--falcon-button-shadow` (none), `-shadow-hover` (none), `-shadow-focus`, `-shadow-focus-danger` |
| Spacing | `--falcon-button-padding-x-{sm,md,lg}`, `-gap-{sm,md,lg}`, `-gap-x-sm` |
| Color (text) | `--falcon-button-{variant}-text`, `-text-hover`, `-text-disabled` |
| Color (background) | `--falcon-button-{variant}-bg`, `-bg-hover`, `-bg-active`, `-bg-disabled` (10 variant families) |
| Hover | `--falcon-button-{variant}-bg-hover`, `-border-hover`, `-text-hover` |
| Active | `--falcon-button-{variant}-bg-active`, `-border-active` |
| Focus | `--falcon-button-shadow-focus` (`-danger` for danger/outline-danger) |
| Disabled | `--falcon-button-disabled-opacity` (0.5), `-disabled-cursor` (not-allowed), per-variant `*-text-disabled` |
| Loading | `--falcon-button-loading-label-opacity` (0), `-spinner-color`, `-spinner-size-*`, `-spinner-stroke-width`, `-spinner-track-opacity` |

## Per-instance override example
```css
.publish-button-tall {
  --falcon-button-height-md: 48px;
  --falcon-button-padding-x-md: 24px;
  --falcon-button-border-radius: 999px; /* pill */
}
```
```html
<falcon-angular-button class="publish-button-tall" [label]="'Publish'" />
```

## Standing rules to enforce
- No raw `px` in Tailwind classes on the host (`class="h-[38px]"`) — use the `size` prop.
- No inline `style="--falcon-button-…"` — declare overrides in a tokens layer.
- The `:where()` selector keeps specificity 0 → any host-class override wins; never reach for `!important`.

## Verification
🟢 CODE-VERIFIED 2026-06-03 — token file recounted at **278 lines**, 14 categories + Wave 9.F/13b variant blocks confirmed, gap values corrected (md 12 / lg 14), Shadow CSS verified token-only (no raw hex), tailwind helper verified token-only. gate-12 `:where()` scope confirmed (not `:root`).
