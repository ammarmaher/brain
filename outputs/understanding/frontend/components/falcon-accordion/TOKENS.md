# falcon-accordion — TOKENS

## Component token file
`libs/falcon-ui-tokens/src/components/accordion.tokens.css` (**139 lines** — recount 2026-06-03).

`[CODE]` Selector (specificity-0, gate-12 compliant — scoped, NOT `:root`):
```css
:where(falcon-accordion, falcon-accordion-tw, falcon-angular-accordion, .falcon-accordion, [data-falcon-accordion])
```
Both render paths resolve here: the Shadow CSS (`falcon-accordion.css`) reads `--falcon-accordion-*` directly; the `-tw` twin reads the SAME tokens through the Tailwind helper's `bg-[var(--falcon-accordion-*)]` arbitrary-value utilities (`accordion-tailwind-classes.ts`).

## Token categories (14 declared)
Per the file's own header comment (`[CODE]` accordion.tokens.css:8-23):
1. CONTAINER — `display`, `direction`, `gap`, `bg`, `border-{width,color,radius}`, `overflow`.
2. ITEM — `item-bg`, `item-bg-hover`, `item-bg-expanded`, `item-bg-disabled`, `item-border-{width,style,color}`.
3. HEADER — padding-{y,x}-{sm,md,lg}, `header-bg`, color (default/hover/expanded/disabled), font-family/size-{sm,md,lg}/weight/weight-expanded, line-height, cursor, cursor-disabled, gap.
4. CHEVRON — `chevron-size`, color (default/hover/expanded), `rotation-collapsed` (0deg), `rotation-expanded` (180deg), `transition-duration` (200ms), `transition-easing`.
5. DESCRIPTION — color, font-size, line-height, margin-top.
6. PANEL BODY — padding-{y,x}-{sm,md,lg}, `panel-bg`, `panel-color`, font-size, line-height, border-top-{width,color}.
7. SEPARATOR (between items) — width (1px), color.
8. MOTION — `transition-duration` (220ms), `transition-easing` (`cubic-bezier(0.16,1,0.3,1)`).
9. FOCUS RING — `focus-ring-width` (3px), `focus-ring-color` (teal-alpha-12), `focus-ring-radius` (6px).
10. SIZING — `min-header-height-{sm,md,lg}` (36/44/52px).
11. TYPOGRAPHY — `letter-spacing` (normal).
12. ICON — `icon-size` (16px), color (default/expanded), `icon-gap` (10px).
13. HELPER / ERROR — helper {color, font-size, margin-top, padding-x}; error {color, font-size, font-weight, line-height, margin-top, padding-x}.
14. DISABLED — `disabled-opacity` (0.6).

## Related Falcon theme tokens (referenced via `var(--…, fallback)`)

| Accordion token | References |
|---|---|
| `--falcon-accordion-bg` / `-panel-bg` | `--color-falcon-neutral-0` (#ffffff) |
| `--falcon-accordion-border-color` / `-separator-color` / `-panel-border-top-color` | `--color-falcon-neutral-200` |
| `--falcon-accordion-item-bg-hover` / `-item-bg-expanded` | `--color-falcon-neutral-50` |
| `--falcon-accordion-header-color` / `-panel-color` | `--color-falcon-neutral-900` |
| `--falcon-accordion-header-color-{hover,expanded}` / `-chevron-color-{hover,expanded}` / `-icon-color-expanded` | `--color-falcon-teal-500` |
| `--falcon-accordion-chevron-color` / `-description-color` / `-icon-color` / `-helper-color` | `--color-falcon-neutral-700` |
| `--falcon-accordion-header-color-disabled` | `--color-falcon-neutral-500` |
| `--falcon-accordion-error-color` | `--color-falcon-red-500` |
| `--falcon-accordion-focus-ring-color` | `--color-falcon-teal-alpha-12` |
| `--falcon-accordion-header-font-family` | `--falcon-font-family` |

## Tailwind utility guidance for this component
- Layout utilities (`w-full`, `max-w-*`, margin) on the host element.
- Inside panel content (`slot="content-*"`) — full Tailwind freedom.
- Do NOT hand-roll Tailwind utilities to override item / header / chevron colors / radii — override the `--falcon-accordion-*` tokens via a host class instead. The `-tw` twin already drives every visual through these tokens via `accordion-tailwind-classes.ts`.

## Dark mode support
Token-driven. The accordion declares no dark-mode block of its own — it inherits the neutral inversion from `falcon-tailwind-tokens.css` (`:where(.app-dark, .app-dark *)`): neutrals flip so the container bg / header text / panel bg invert; brand teal stays for the expanded header + chevron. Geometry (heights/padding/radius/motion) unchanged. `[INFERRED]` not re-verified end-to-end this pass — flag for theme/tokens agent.

## Density support
Heights/padding map per `size` (`sm`/`md`/`lg`). To densify one instance:
```css
.compact-acc { --falcon-accordion-header-padding-y-md: var(--falcon-accordion-header-padding-y-sm); }
```
Note: header heights are NOT aliased to a global `--falcon-density-input-*` token (unlike input) — they are accordion-local literals (36/44/52px). Density presets do NOT ripple automatically.

## RTL support
- The chevron rotates in place (transform), symmetrical — no per-direction logic needed.
- Header layout uses `justify-content: space-between` + `text-align: start` and panel padding uses `padding-inline` (`falcon-accordion.css`), so the row mirrors correctly under `[dir='rtl']`.
- `[INFERRED]` not re-verified at runtime this pass.

## Static style risks
- `[CODE]` `falcon-accordion.css` (239 ln) is **token-only — VERIFIED clean 2026-06-03**: every visual value reads a `--falcon-accordion-*` var; the only literals are structural (`display:flex`, `border:0`, `appearance:none`, `font-weight:400` on description, `gap:0`). No raw color hex.
- `[CODE]` The chevron `<svg>` `d="M4 6l4 4 4-4"` is hardcoded geometry, but uses `stroke="currentColor"` so its color follows `--falcon-accordion-chevron-color-*`. No risk.
- `[CODE]` `accordion-tailwind-classes.ts` emits only `*-[var(--falcon-accordion-*)]` arbitrary-value utilities + structural utilities (`flex`, `w-full`, `group`) — no hardcoded palette. No inline `style` in the `-tw` twin.
- `[CODE]` The wrapper `.component.css` is `:host { display:block; width:100% }` only — no risk.

## Token usage by state

| State | Token(s) consumed |
|---|---|
| Container | `--falcon-accordion-{bg, border-width, border-color, border-radius, overflow}` |
| Item | `--falcon-accordion-item-bg`, `-item-bg-expanded`, `-item-bg-disabled`, `-separator-{width,color}` |
| Header (rest) | `--falcon-accordion-header-{bg, color, font-family, font-weight, line-height, gap, cursor}`, padding/font per size |
| Header (hover) | `--falcon-accordion-header-color-hover`, `-chevron-color-hover` |
| Header (expanded) | `--falcon-accordion-header-color-expanded`, `-header-font-weight-expanded`, `-chevron-color-expanded`, `-chevron-rotation-expanded`, `-icon-color-expanded` |
| Header (disabled) | `--falcon-accordion-header-color-disabled`, `-header-cursor-disabled`, `-disabled-opacity`, `-item-bg-disabled` |
| Header (focus) | `--falcon-accordion-focus-ring-{width,color,radius}` |
| Chevron | `--falcon-accordion-chevron-{size, color, rotation-collapsed, transition-duration, transition-easing}` |
| Description | `--falcon-accordion-description-{color, font-size, line-height, margin-top}` |
| Panel | `--falcon-accordion-panel-{bg, color, font-size, line-height, border-top-width, border-top-color}`, padding per size |
| Helper | `--falcon-accordion-helper-{color, font-size, margin-top, padding-x}` |
| Error | `--falcon-accordion-error-{color, font-size, font-weight, line-height, margin-top, padding-x}` |
| Motion | `--falcon-accordion-transition-{duration, easing}` |
| Loading | _None — accordion has no built-in per-item loading state (GAP P2)._ |

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B13) — token file recounted at 139 lines / 14 categories, `:where()` scope confirmed (gate-12 compliant), Shadow CSS + `-tw` Tailwind helper verified token-only (no raw hex). Density-alias note (heights are accordion-local literals, not `--falcon-density-*`) is new this pass.
