# falcon-multi-select — TOKENS

## Component token file

`libs/falcon-ui-tokens/src/components/multi-select.tokens.css` (~329 lines).

The selector chain is:

```css
:where(
  falcon-multi-select,
  falcon-multi-select-tw,
  falcon-angular-multi-select,
  .falcon-multi-select,
  [data-falcon-multi-select],
  .falcon-overlay-container
) { … }
```

`.falcon-overlay-container` is a member because the `-tw` panel **portals into the body overlay container** (`popover-portal.ts portalToOverlay`) — without it the portaled panel would render unstyled. This was rescoped off `:root` on **2026-06-02 (gate-12-rescope)** — `[CODE]` multi-select.tokens.css:37-52. The component tags cover the inline (non-portaled) trigger renders.

## Token categories (14 declared, by header)

1. **CONTAINER** — `width` / `min-width` / `max-width`.
2. **LABEL** — color (idle + error), font family / size / weight / line-height, margin-bottom, cursor, required-marker color. Mirrors falcon-input / falcon-dropdown 1:1.
3. **SIZING** — per `sm`/`md`/`lg`: **min-height** (chips can grow it — not a fixed height), padding-x, padding-y, font-size. md = 38px per spec §4.
4. **TYPOGRAPHY** — font-weight, line-height.
5. **BACKGROUND** — by state: default / hover / focus / error / success / warning / disabled / readonly.
6. **TEXT COLOR** — by state: default / disabled + placeholder color.
7. **BORDER** — width, style, radius + color by state, plus **PANEL** + **OPTION** + **CHIP** border tokens.
8. **SHADOW** — by state + the panel drop shadow.
9. **FOCUS RING** — width, color (focus + error variant), offset.
10. **CHEVRON / SEARCH** — chevron size + color + transition; search-field padding + icon. Plus the unified `--falcon-multi-select-icon-left-color` (aliases `--falcon-input-icon-color`).
11. **HELPER TEXT** — color, font-size, font-weight, margin.
12. **ERROR TEXT** — color, font-size, font-weight, margin.
13. **CLEAR / CHIP** — clear-all button (size/color/bg) + chip dimensions + chip-row-gap + remove icon + **overflow pill** (`+N more`: bg/color/radius/padding/font).
14. **MOTION** — transition duration + easing.

## Related Falcon theme tokens

| Falcon theme token | Used by multi-select via |
|---|---|
| `--color-falcon-neutral-0..950` | Background / disabled / readonly / overflow pill. |
| `--color-falcon-teal-500` | Focus border (brand). |
| `--color-falcon-teal-option` (`#f1f6f6`) | Chip background. |
| `--color-falcon-teal-700` (`#00827a`) | Chip text + check glyph + select-all accent. |
| `--color-falcon-teal-alpha-*` | Focus ring + chip-remove hover. |
| `--color-falcon-red-100/500/700` | Error background / border / text. |
| `--color-falcon-green-500` / `--color-falcon-amber-500` | Success / warning border. |
| `--falcon-density-input-height-{sm,md,lg}` | Sizing aliases. |
| `--font-display`, `--font-weight-medium` | Label / pill type. |

## Tailwind utility guidance for this component

The Tailwind helper `libs/falcon-ui-core/src/tailwind/multi-select-tailwind-classes.ts` returns class strings that resolve EVERY visual value through `--falcon-multi-select-*` via Tailwind v4 arbitrary-value utilities (`min-h-[length:var(--falcon-multi-select-min-height-md)]`, etc.) — its header asserts "NO hardcoded hex / px / ms in here." Consumers should override **tokens**, not hand-roll Tailwind colors/radii.

For host-side layout only:

```html
<falcon-angular-multi-select class="w-full max-w-md" ... />
```

## Dark mode support

Token-driven — inherits the `:where(.app-dark, .app-dark *)` neutral inversion from `falcon-tailwind-tokens.css`. Chip backgrounds shift via neutral inversion; brand teal stays close via the `--color-falcon-teal-*` dark overrides. No per-component dark override required for the **selection** path.

> **chip-list mode exception:** the Angular chip-list template hand-writes dark variants inline (`dark:bg-falcon-neutral-850`, `dark:bg-falcon-neutral-925`, `dark:text-falcon-neutral-100`) rather than reading `--falcon-multi-select-*` tokens — `[CODE]` html:20-91. This works but is NOT token-driven (see Static-style risks + GAP G12).

## Density support

`min-height` maps to `--falcon-multi-select-min-height-{sm,md,lg}` (linked to `--falcon-density-input-height-*`), so density presets ripple through.

## RTL support

The control is RTL-safe by construction: padding uses logical `ps-`/`pe-` utilities, the chevron uses `inset-inline-end`, and the chip-list popover positions via `inset-inline-end` with an explicit RTL branch (`getComputedStyle(host).direction === 'rtl'` → uses `r.left`) — `[CODE]` ts:333-335. Chip layout flips automatically via flex direction inheritance.

## Static style risks

- `[CODE]` **chip-list Angular template hardcodes Tailwind arbitrary values** not tied to `--falcon-multi-select-*`: `min-w-[260px]`, `max-w-[320px]`, `rounded-[12px]`, `shadow-[0_12px_32px_rgba(0,0,0,0.14)]`, `bg-falcon-teal-700`, `max-w-[120px]`, `h-4`, `text-2xs/3xs` (html:20-91). These bypass the token contract → a Studio token mutation does NOT restyle the chip-list popover. **GAP G12 (token-over-literal, chip-list path).** `safe-local`.
- The Stencil Shadow CSS (`falcon-multi-select.css`, ~18KB) and the token *file itself* use raw px/hex inside `var(--token, #fallback)` fallbacks and in token VALUES (e.g. `chip-row-gap: 5px`, `overflow-pill-font-size: 11.5px`, `panel-z-index: 100`). That is the design SSOT and acceptable in a token file — NOT a violation.
- The Angular wrapper `falcon-multi-select.component.css` is layout-only (`:host { display:block; width:100% }` + child width passthrough) — no static risk.

## No CSS / no SCSS guidance

- Tailwind utilities only in templates. Consumer per-instance overrides MUST mutate `--falcon-multi-select-*` via a host class or arbitrary utility (`class="[--falcon-multi-select-chip-row-gap:8px]"`, the live pattern in templates-details).
- Never hardcode hex/px in `style=`; never write component CSS rules in the consumer's `*.component.css`.

## Token usage by state

| State / part | Token(s) consumed |
|---|---|
| Trigger idle | `--falcon-multi-select-bg`, `-border-color`, `-shadow` |
| Trigger focus | `-border-color-focus`, `-shadow-focus`, `-ring-color-focus`, `-ring-width`, `-ring-offset` |
| Trigger error | `-border-color-error`, `-shadow-error`, `-ring-color-error` |
| Trigger disabled / readonly | `-bg-disabled` / `-bg-readonly`, `-border-color-disabled` / `-readonly` |
| Chip | `-chip-bg`, `-chip-text-color`, `-chip-border-color`, `-chip-radius`, `-chip-padding-x`, `-chip-padding-y`, `-chip-row-gap`, `-chip-max-width` |
| Chip remove (hover) | `-chip-remove-color`, `-chip-remove-color-hover`, `-chip-remove-bg-hover` |
| Overflow pill | `-overflow-pill-bg`, `-overflow-pill-color`, `-overflow-pill-border-radius`, `-overflow-pill-padding-x/y`, `-overflow-pill-font-size/weight` |
| Panel | `-panel-bg`, `-panel-border`, `-panel-radius`, `-panel-shadow`, `-panel-max-height`, `-panel-z-index` |
| Search field | `-search-*` (padding, icon color, focus halo) |
| Option hover / active / selected | `-option-bg-hover`, `-option-bg-active`, `-option-bg-selected`, `-option-check-*` |
| Select-all row | `-select-all-*` + the shared checkbox accent |
| Clear all | `-clear-size`, `-clear-color`, `-clear-bg` |
| Icon-left | `-icon-left-color` (→ `--falcon-input-icon-color`) |
| Loading | _None — multi-select has no built-in loading state._ |

## Verification
🟢 code-verified against multi-select.tokens.css (read 2026-06-03) + the Tailwind helper header + the chip-list template. gate-12 portal scope (`.falcon-overlay-container` in `:where`) 🟢 confirmed. chip-list literal-bypass (G12) 🟢 confirmed in html:20-91.
